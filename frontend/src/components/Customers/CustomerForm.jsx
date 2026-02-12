import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import { X, MapPin, Save } from 'lucide-react';
import Input from '../common/Input';
import Button from '../common/Button';
import { useToast } from '../../hooks/useToast';
import MapPicker from './MapPicker';

const CustomerForm = ({ customer, onSubmit, onCancel, desiredAccuracy = 3, maxWaitMs = 120000 }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    area: '',
    milkPerDay: 1,
    // hidden location object: { lat, lng }
    location: null,
  });
  const [suggestions, setSuggestions] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationAccuracy, setLocationAccuracy] = useState(null);
  const [locationStatus, setLocationStatus] = useState('');
  const [bestLocation, setBestLocation] = useState(null);
  const searchTimeout = useRef();
  const watchIdRef = useRef(null);
  const liveMapRef = useRef(null);
  const liveMarkerRef = useRef(null);
  const locationAttempts = useRef(0);
  const maxAttempts = 3;
  const cleanupLiveMap = () => {
    try {
      if (liveMarkerRef.current) {
        try { liveMarkerRef.current.remove(); } catch (e) {}
        liveMarkerRef.current = null;
      }
      if (liveMapRef.current) {
        try { liveMapRef.current.remove(); } catch (e) {}
        liveMapRef.current = null;
      }
    } catch (e) {
      // ignore
    }
  };
  const { error: toastError, success: toastSuccess } = useToast();
  const [showMapPicker, setShowMapPicker] = useState(false);

  useEffect(() => {
    if (customer) {
      setFormData({
        name: customer.name || '',
        phone: customer.phone || '',
        address: customer.address || '',
        area: customer.area || '',
        milkPerDay: customer.milkPerDay || 1,
        location: customer.location || null,
      });
    }
  }, [customer]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // trigger address autocomplete when user types address
    if (name === 'address') {
      if (searchTimeout.current) clearTimeout(searchTimeout.current);
      const q = value;
      if (!q || q.length < 3) {
        setSuggestions([]);
        return;
      }
      searchTimeout.current = setTimeout(async () => {
        try {
          setLoadingSuggestions(true);
          const token = import.meta.env.VITE_MAPBOX_TOKEN;
          if (!token) {
            console.error('Mapbox token missing. Set VITE_MAPBOX_TOKEN in your environment.');
            setSuggestions([]);
            return;
          }
          // Use Mapbox forward geocoding (autocomplete)
          // Limit results and bias to India (country=IN). Mapbox uses ISO country codes.
          const mbUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(q)}.json?access_token=${token}&autocomplete=true&country=IN&limit=8&language=en`;
          const res = await fetch(mbUrl);
          const json = await res.json();
          // Map Mapbox features to a unified shape similar to previous suggestions
          const mapped = (json.features || []).map(f => ({
            id: f.id,
            place_id: f.id,
            display_name: f.place_name,
            lat: f.center && f.center[1],
            lon: f.center && f.center[0],
            // address-like object - Mapbox provides context and properties
            address: {
              hamlet: null,
              village: f.text || null,
              locality: (f.context || []).map(c => c.text).join(', '),
              suburb: null,
              neighbourhood: null,
              city: f.place_type && f.place_type.includes('place') ? f.text : null,
              town: f.place_type && f.place_type.includes('town') ? f.text : null,
              municipality: null,
              county: null,
            },
            // preserve center for click handler
            center: f.center,
          }));
          setSuggestions(mapped);
        } catch (err) {
          console.error('Autocomplete error', err);
        } finally {
          setLoadingSuggestions(false);
        }
      }, 350);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // client-side validation
    if (!formData.name || formData.name.trim().length < 2) {
      toastError('Please enter a valid name');
      return;
    }
    const phoneRe = /^[6-9]\d{9}$/;
    if (!formData.phone || !phoneRe.test(String(formData.phone))) {
      toastError('Please enter a valid 10-digit Indian phone number');
      return;
    }
    if (!formData.address || formData.address.trim().length < 5) {
      toastError('Please enter a valid address');
      return;
    }

    // pass the formData (includes location if user selected 'Use my location' or picked a suggestion)
    onSubmit?.(formData);
    toastSuccess?.('Submitting customer...');
  };

  const handleOpenMapPicker = async () => {
    try {
      // If we already have coordinates, just open the picker
      if (formData.location && typeof formData.location.lat === 'number' && typeof formData.location.lng === 'number') {
        setShowMapPicker(true);
        return;
      }

      // If we have an address but no coordinates, forward geocode to center the map
      const addressToGeocode = formData.address || formData.area;
      const token = import.meta.env.VITE_MAPBOX_TOKEN;
      if (addressToGeocode && token) {
        const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(addressToGeocode)}.json?access_token=${token}&limit=1&language=en`;
        const res = await fetch(url);
        const json = await res.json();
        const feature = json?.features?.[0];
        if (feature && Array.isArray(feature.center) && feature.center.length === 2) {
          const lat = Number(feature.center[1]);
          const lng = Number(feature.center[0]);
          const props = feature.properties || {};
          const village = props.neighbourhood || props.locality || props.place || feature.text;
          const ctxTexts = (feature.context || []).map(c => c.text || '').filter(Boolean);
          const areaVal = village || ctxTexts.join(', ') || formData.area;
          setFormData(prev => ({ ...prev, location: { lat, lng }, area: prev.area || areaVal }));
        }
      }
    } catch (e) {
      // best-effort, ignore errors and still open picker
    } finally {
      setShowMapPicker(true);
    }
  };

  // Enhanced location detection like Ola/Uber
  const handleDetectLocation = async () => {
    if (!navigator.geolocation) {
      toastError('Geolocation is not supported by your browser');
      return;
    }

    setLocationLoading(true);
    setLocationAccuracy(null);
    setLocationStatus('Starting location detection...');
    setBestLocation(null);
    locationAttempts.current = 0;

    const desiredAccuracyLocal = desiredAccuracy;
    const maxWait = maxWaitMs;
    let best = null;
    let readings = [];
    let isFinished = false;

    const stop = () => {
      if (watchIdRef.current !== null) {
        try { navigator.geolocation.clearWatch(watchIdRef.current); } catch(e) {}
        watchIdRef.current = null;
      }
      setLocationLoading(false);
      isFinished = true;
    };

    try {
      await new Promise((resolve, reject) => {
        let timeoutId = null;
        
        const onSuccess = (pos) => {
          if (isFinished) return;
          
          const coords = pos.coords;
          const reading = { 
            lat: coords.latitude, 
            lng: coords.longitude, 
            accuracy: coords.accuracy,
            timestamp: Date.now()
          };
          
          readings.push(reading);
          
          // Update best reading
          if (!best || (reading.accuracy && reading.accuracy < best.accuracy)) {
            best = reading;
            setBestLocation(best);
            setLocationAccuracy(best.accuracy);
            
            // Update status with accuracy
            if (best.accuracy <= 5) {
              setLocationStatus(`🎯 High accuracy: ${Math.round(best.accuracy)}m`);
            } else if (best.accuracy <= 20) {
              setLocationStatus(`📍 Good accuracy: ${Math.round(best.accuracy)}m`);
            } else {
              setLocationStatus(`🔍 Improving: ${Math.round(best.accuracy)}m`);
            }
          }

          // Check if we've reached desired accuracy
          if (reading.accuracy && reading.accuracy <= desiredAccuracyLocal) {
            if (isFinished) return;
            isFinished = true;
            if (timeoutId) clearTimeout(timeoutId);
            stop();
            resolve(best);
            return;
          }

          // Update live map
          if (liveMapRef.current && reading.lat && reading.lng) {
            try {
              if (!liveMarkerRef.current) {
                liveMarkerRef.current = L.marker([reading.lat, reading.lng], {
                  icon: L.divIcon({
                    className: 'custom-marker',
                    html: '<div style="background: #3b82f6; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>',
                    iconSize: [20, 20],
                    iconAnchor: [10, 10]
                  })
                }).addTo(liveMapRef.current);
              } else {
                liveMarkerRef.current.setLatLng([reading.lat, reading.lng]);
              }
              liveMapRef.current.panTo([reading.lat, reading.lng]);
            } catch (e) {}
          }
        };

        const onError = (err) => {
          if (isFinished) return;
          
          locationAttempts.current++;
          let msg = 'Unable to retrieve your location';
          
          if (err && err.code) {
            switch (err.code) {
              case 1:
                msg = 'Location permission denied. Please allow location access.';
                break;
              case 2:
                msg = 'Position unavailable. Check your GPS signal.';
                break;
              case 3:
                if (best) {
                  if (isFinished) return;
                  isFinished = true;
                  if (timeoutId) clearTimeout(timeoutId);
                  stop();
                  return resolve(best);
                }
                msg = 'Location request timed out.';
                break;
              default:
                msg = err.message || msg;
            }
          }
          
          if (locationAttempts.current < maxAttempts) {
            setLocationStatus(`Retrying... (${locationAttempts.current}/${maxAttempts})`);
            return;
          }
          
          if (isFinished) return;
          isFinished = true;
          if (timeoutId) clearTimeout(timeoutId);
          stop();
          reject(msg);
        };

        // Initialize live map
        try {
          if (!liveMapRef.current && typeof L !== 'undefined') {
            const el = document.getElementById('live-location-map');
            if (el) {
              const map = L.map(el, { 
                center: [20.5937, 78.9629], 
                zoom: 5,
                zoomControl: false
              });
              
              const token = import.meta.env.VITE_MAPBOX_TOKEN;
              if (token) {
                L.tileLayer(`https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token=${token}`, {
                  tileSize: 512,
                  zoomOffset: -1,
                  attribution: '© Mapbox © OpenStreetMap',
                }).addTo(map);
              } else {
                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                  attribution: '© OpenStreetMap contributors',
                }).addTo(map);
              }
              liveMapRef.current = map;
            }
          }
        } catch (e) {}

        // Start watching with enhanced options
        try {
          watchIdRef.current = navigator.geolocation.watchPosition(onSuccess, onError, { 
            enableHighAccuracy: true, 
            maximumAge: 0,
            timeout: 30000
          });
        } catch (e) {
          // Fallback to getCurrentPosition
          navigator.geolocation.getCurrentPosition((pos) => {
            const coords = pos.coords;
            best = { lat: coords.latitude, lng: coords.longitude, accuracy: coords.accuracy };
            setLocationAccuracy(best.accuracy);
            setBestLocation(best);
            resolve(best);
          }, (err) => onError(err), { 
            enableHighAccuracy: true, 
            maximumAge: 0,
            timeout: 30000
          });
        }

        // Enhanced timeout with progress updates
        timeoutId = setTimeout(() => {
          if (isFinished) return;
          
          if (best) {
            isFinished = true;
            stop();
            resolve(best);
          } else {
            isFinished = true;
            stop();
            reject('Location detection timed out. Please try again or use map picker.');
          }
        }, maxWait);
      });

      // Process the best location
      if (best) {
        setFormData(prev => ({ ...prev, location: { lat: Number(best.lat), lng: Number(best.lng) } }));
        
        // Enhanced reverse geocoding
        try {
          const token = import.meta.env.VITE_MAPBOX_TOKEN;
          if (!token) {
            toastError('Mapbox token not configured. Set VITE_MAPBOX_TOKEN to enable reverse geocoding.');
          } else {
            setLocationStatus('Getting address...');
            const mbUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(best.lng)},${encodeURIComponent(best.lat)}.json?access_token=${token}&language=en&limit=1&types=address,poi,locality,neighborhood,place`;
            const res = await fetch(mbUrl);
            const json = await res.json();
            const feature = json && json.features && json.features[0];
            
            if (feature) {
              const display = feature.place_name;
              const props = feature.properties || {};
              const village = props.neighbourhood || props.locality || props.place || feature.text;
              const ctxTexts = (feature.context || []).map(c => c.text || '').filter(Boolean);
              const areaVal = village || ctxTexts.join(', ') || '';
              
              setFormData(prev => ({ 
                ...prev, 
                address: display, 
                area: areaVal, 
                location: { lat: Number(best.lat), lng: Number(best.lng) } 
              }));
              
              if (best.accuracy && best.accuracy <= desiredAccuracy) {
                toastSuccess(`✅ Location detected with high accuracy (${Math.round(best.accuracy)}m)`);
                setLocationStatus(`✅ High accuracy location found: ${Math.round(best.accuracy)}m`);
              } else {
                toastSuccess(`📍 Location detected (${Math.round(best.accuracy)}m). Opening map to refine.`);
                setLocationStatus(`📍 Opening map for precise selection (${Math.round(best.accuracy)}m accuracy)`);
                setShowMapPicker(true);
              }
            } else {
              toastSuccess('Location detected. Opening map to select exact address.');
              setShowMapPicker(true);
            }
          }
          setSuggestions([]);
        } catch (err) {
          console.warn('Reverse geocode failed', err);
          toastSuccess('Location detected. Opening map to select address.');
          setShowMapPicker(true);
        }
      }
    } catch (err) {
      const message = typeof err === 'string' ? err : (err?.message || 'Unable to retrieve your location');
      console.warn('Geolocation error', message);
      toastError(message);
      setLocationStatus('Location detection failed');
    } finally {
      cleanupLiveMap();
      setLocationLoading(false);
    }
  };

  return (
    <div className="p-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Full Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter customer name"
            required
          />
          <Input
            label="Phone Number"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            placeholder="10-digit mobile number"
            required
          />
        </div>

        <Input
          label="Address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Complete address"
          required
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Area / Locality"
            name="area"
            value={formData.area}
            onChange={handleChange}
            placeholder="Locality name"
            required
          />
          <Input
            label="Milk per Day (Litres)"
            name="milkPerDay"
            type="number"
            step="0.5"
            value={formData.milkPerDay}
            onChange={handleChange}
            placeholder="Daily requirement"
            required
          />
        </div>

        <div className="bg-blue-50 rounded-2xl p-6 border-2 border-blue-100">
          <h4 className="text-sm font-bold text-gray-700 mb-4 flex items-center">
            <MapPin className="w-4 h-4 mr-2 text-blue-500" />
            Location (optional)
          </h4>
          <p className="text-sm text-gray-600 mb-3">You can either enter an address above or let the browser detect your current location. Address-only entries are allowed.</p>
          
          {/* Debug info - remove in production */}
          {formData.location && (
            <div className="mb-3 p-2 bg-green-50 rounded text-xs text-gray-600">
              <div>📍 Location: {formData.location.lat?.toFixed(6)}, {formData.location.lng?.toFixed(6)}</div>
              <div>🏠 Address: {formData.address || 'Not set'}</div>
              <div>🏘️ Area: {formData.area || 'Not set'}</div>
            </div>
          )}
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  disabled={locationLoading}
                  className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                    locationLoading 
                      ? 'bg-gray-400 text-white cursor-not-allowed' 
                      : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg transform hover:scale-105'
                  }`}
                onClick={handleDetectLocation}
              >
                {locationLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Detecting...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <span>📍</span>
                    <span>Use my location</span>
                  </div>
                )}
                </button>
                {locationLoading && (
                  <button
                    type="button"
                    onClick={() => {
                      if (watchIdRef.current !== null) {
                        try { navigator.geolocation.clearWatch(watchIdRef.current); } catch (e) {}
                        watchIdRef.current = null;
                      }
                      setLocationLoading(false);
                      toastError('Location detection cancelled');
                    }}
                    className="px-3 py-2 rounded-xl bg-gray-100 text-sm text-gray-700 border"
                  >
                    Cancel
                  </button>
                )}

                <span className="text-sm text-gray-600">{formData.location ? `Using detected location${locationAccuracy ? ` — approx ${Math.round(locationAccuracy)}m` : ''}` : 'No location selected'}</span>
              </div>
            
              <div className="ml-3">
                <button
                  type="button"
                  onClick={handleOpenMapPicker}
                  className="px-3 py-1 rounded-md bg-white border border-gray-200 text-sm hover:bg-gray-50"
                >
                  Pick on map
                </button>
              </div>
            </div>

              {/* live map while detecting */}
              {locationLoading && (
                <div className="mt-3">
                  <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-3 mb-2">
                    <div className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                      <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                      <span>{locationStatus || 'Detecting location...'}</span>
                    </div>
                    {locationAccuracy && (
                      <div className="text-xs text-gray-600 mt-1">
                        Accuracy: {Math.round(locationAccuracy)}m {locationAccuracy <= 5 ? '🎯' : locationAccuracy <= 20 ? '📍' : '🔍'}
                      </div>
                    )}
                  </div>
                  <div id="live-location-map" className="w-full h-48 rounded-lg border-2 border-blue-200 shadow-sm" />
                  <div className="text-xs text-gray-500 mt-2 space-y-1">
                    <div>🚶‍♂️ Move outdoors for better GPS signal</div>
                    <div>📱 Keep device steady for accurate readings</div>
                    <div>⏱️ Takes 10-30 seconds for high accuracy</div>
                  </div>
                </div>
              )}

            <div className="relative mt-3 sm:mt-0">
              {/* Suggestions dropdown */}
              {loadingSuggestions && <div className="text-xs text-gray-500">Searching...</div>}
              {suggestions.length > 0 && (
                <div className="absolute z-40 w-full bg-white rounded-xl shadow-lg mt-2 max-h-60 overflow-auto">
                  {suggestions.map((s) => (
                    <button
                      key={s.place_id}
                      type="button"
                      onClick={() => {
                        // set address, area (use address.city/suburb/town), and location
                        const address = s.display_name || s.place_name || '';
                        const addrObj = s.address || {};
                        const areaVal = addrObj.hamlet || addrObj.village || addrObj.locality || addrObj.suburb || addrObj.neighbourhood || addrObj.city || addrObj.town || addrObj.municipality || addrObj.county || '';
                        // Mapbox mapped suggestions use lat/lon in s.lat/s.lon or s.center
                        const lat = s.lat ? Number(s.lat) : (s.center ? Number(s.center[1]) : null);
                        const lon = s.lon ? Number(s.lon) : (s.center ? Number(s.center[0]) : null);
                        const location = (lat && lon) ? { lat, lng: lon } : null;
                        setFormData(prev => ({ ...prev, address, area: areaVal, location }));
                        setSuggestions([]);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50"
                    >
                      <div className="text-sm font-medium text-gray-800">{s.display_name}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </form>

      {showMapPicker && (
        <MapPicker
          initial={formData.location}
          mapboxToken={import.meta.env.VITE_MAPBOX_TOKEN}
          onCancel={() => setShowMapPicker(false)}
          onConfirm={(data) => {
            setShowMapPicker(false);

            // Always set coordinates first
            if (data?.location || (data?.lat && data?.lng)) {
              const loc = data.location || { lat: Number(data.lat), lng: Number(data.lng) };
              setFormData(prev => ({ ...prev, location: loc }));
            }

            // If address/area provided, update immediately
            if (data?.address || data?.area !== undefined) {
              setFormData(prev => ({ 
                ...prev, 
                address: data.address || prev.address, 
                area: data.area !== undefined ? data.area : prev.area,
              }));
              toastSuccess('Location and address updated from map');
              return;
            }

            // Otherwise reverse geocode using Mapbox or OSM as fallback
            const loc = data.location || { lat: Number(data.lat), lng: Number(data.lng) };
            (async () => {
              try {
                const token = import.meta.env.VITE_MAPBOX_TOKEN;
                if (token) {
                  const mbUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(loc.lng)},${encodeURIComponent(loc.lat)}.json?access_token=${token}&language=en&limit=1`;
                  const res = await fetch(mbUrl);
                  const json = await res.json();
                  const feature = json && json.features && json.features[0];
                  if (feature) {
                    const display = feature.place_name;
                    const props = feature.properties || {};
                    const village = props.neighbourhood || props.locality || props.place || feature.text;
                    const ctxTexts = (feature.context || []).map(c => c.text || '').filter(Boolean);
                    const areaVal = village || ctxTexts.join(', ') || '';
                    setFormData(prev => ({ ...prev, address: display || prev.address, area: areaVal || prev.area }));
                    toastSuccess('Location selected from map');
                    return;
                  }
                }

                // OSM fallback
                const nomUrl = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${encodeURIComponent(loc.lat)}&lon=${encodeURIComponent(loc.lng)}`;
                const nRes = await fetch(nomUrl, { headers: { 'Accept': 'application/json' } });
                const nJson = await nRes.json();
                const display = nJson?.display_name || '';
                const addr = nJson?.address || {};
                const areaVal = addr.hamlet || addr.village || addr.suburb || addr.neighbourhood || addr.locality || addr.town || addr.city || '';
                setFormData(prev => ({ ...prev, address: display || prev.address, area: areaVal || prev.area }));
                toastSuccess('Location selected from map');
              } catch (err) {
                console.warn('Map reverse geocode failed', err);
                toastError('Failed to reverse geocode selected location');
              }
            })();
          }}
        />
      )}

      <div className="flex space-x-4 pt-4">
        <Button
          type="submit"
          variant="primary"
          icon={Save}
          fullWidth
          onClick={handleSubmit}
        >
          {customer ? 'Update' : 'Save'} Customer
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default CustomerForm;