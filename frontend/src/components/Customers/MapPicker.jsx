import React, { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Loader } from 'lucide-react';

// Minimal MapPicker: shows a Leaflet map and lets user place/move a marker.
// Props: initial { lat, lng }, onConfirm({ lat, lng }), onCancel(), mapboxToken (optional)
export default function MapPicker({ initial, onConfirm, onCancel, mapboxToken }) {
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const [mapReady, setMapReady] = useState(false);
  const [address, setAddress] = useState('');
  const [geocoding, setGeocoding] = useState(false);
  const geocodeTimeoutRef = useRef(null);
  const addressDataRef = useRef(null); // Store full geocoding data

  // Reverse geocode a location
  const reverseGeocode = useCallback(async (lat, lng) => {
    setGeocoding(true);
    try {
      if (mapboxToken) {
        const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(lng)},${encodeURIComponent(lat)}.json?access_token=${mapboxToken}&language=en&limit=1`;
        const res = await fetch(url);
        const json = await res.json();
        const feature = json?.features?.[0];
        if (feature) {
          const displayAddress = feature.place_name || 'Address not found';
          setAddress(displayAddress);
          const props = feature.properties || {};
          const village = props.neighbourhood || props.locality || props.place || feature.text;
          const ctxTexts = (feature.context || []).map(c => c.text || '').filter(Boolean);
          const areaVal = village || ctxTexts.join(', ') || '';
          addressDataRef.current = { address: displayAddress, area: areaVal, location: { lat, lng } };
          return;
        }
      }

      // Fallback: OpenStreetMap Nominatim
      const nomUrl = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lng)}`;
      const nRes = await fetch(nomUrl, { headers: { 'Accept': 'application/json' } });
      const nJson = await nRes.json();
      const display = nJson?.display_name || 'Address not found';
      const addr = nJson?.address || {};
      const areaVal = addr.hamlet || addr.village || addr.suburb || addr.neighbourhood || addr.locality || addr.town || addr.city || '';
      setAddress(display);
      addressDataRef.current = { address: display, area: areaVal, location: { lat, lng } };
    } catch (err) {
      console.warn('Reverse geocode failed', err);
      setAddress('Failed to get address');
      addressDataRef.current = { address: '', area: '', location: { lat, lng } };
    } finally {
      setGeocoding(false);
    }
  }, [mapboxToken]);

  useEffect(() => {
    // Create map
    const map = L.map(mapRef.current, { center: initial || [20.5937, 78.9629], zoom: initial ? 13 : 5 });

    // Use Mapbox tiles if token provided, otherwise use OpenStreetMap tiles
    if (mapboxToken) {
      L.tileLayer(`https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token=${mapboxToken}`, {
        tileSize: 512,
        zoomOffset: -1,
        attribution: '© Mapbox © OpenStreetMap',
      }).addTo(map);
    } else {
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
      }).addTo(map);
    }

    // add marker if initial provided
    if (initial && initial.lat && initial.lng) {
      markerRef.current = L.marker([initial.lat, initial.lng], { draggable: true }).addTo(map);
      // Reverse geocode initial location
      reverseGeocode(initial.lat, initial.lng);
    }

    // Helper function to update marker and geocode
    const updateMarkerAndGeocode = (lat, lng) => {
      if (!markerRef.current) {
        markerRef.current = L.marker([lat, lng], { draggable: true }).addTo(map);
        // Add drag listener to new marker
        markerRef.current.on('dragend', () => {
          const latlng = markerRef.current.getLatLng();
          updateMarkerAndGeocode(latlng.lat, latlng.lng);
        });
      } else {
        markerRef.current.setLatLng([lat, lng]);
      }
      
      // Provisional payload so confirm works instantly
      addressDataRef.current = {
        address: address || '',
        area: addressDataRef.current?.area || '',
        location: { lat, lng }
      };
      setAddress(prev => prev || 'Getting address...');

      // Debounce geocoding to avoid too many API calls
      if (geocodeTimeoutRef.current) {
        clearTimeout(geocodeTimeoutRef.current);
      }
      geocodeTimeoutRef.current = setTimeout(() => {
        reverseGeocode(lat, lng);
      }, 500);
    };

    // click to place marker
    map.on('click', (e) => {
      const { lat, lng } = e.latlng;
      updateMarkerAndGeocode(lat, lng);
    });

    // Listen to marker drag events if marker exists
    if (markerRef.current) {
      markerRef.current.on('dragend', () => {
        const latlng = markerRef.current.getLatLng();
        updateMarkerAndGeocode(latlng.lat, latlng.lng);
      });
    }

    // store map instance for cleanup
    mapRef.current.__map = map;
    setMapReady(true);

    return () => {
      if (geocodeTimeoutRef.current) {
        clearTimeout(geocodeTimeoutRef.current);
      }
      map.remove();
    };
  }, [reverseGeocode, initial]);

  const confirm = () => {
    if (!markerRef.current) return onCancel?.();
    const latlng = markerRef.current.getLatLng();
    
    // Pass complete data including address if available
    if (addressDataRef.current) {
      onConfirm?.(addressDataRef.current);
    } else {
      // Fallback to just location if no address data
      onConfirm?.({ lat: latlng.lat, lng: latlng.lng, location: { lat: latlng.lat, lng: latlng.lng } });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onCancel} />
      <div className="bg-white rounded-lg shadow-lg w-11/12 md:w-3/4 lg:w-2/3 h-3/4 p-4 flex flex-col">
        <div className="mb-3">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Select Location on Map</h3>
          <p className="text-sm text-gray-600">Click anywhere on the map or drag the marker to set the exact location</p>
        </div>
        <div className="flex-1 border rounded-lg overflow-hidden">
          <div ref={mapRef} className="w-full h-full" />
        </div>
        
        {/* Address Display */}
        <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-start space-x-2">
            <MapPin className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <div className="text-xs font-semibold text-blue-800 mb-1">✅ This will be filled in the form:</div>
              {geocoding ? (
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Loader className="w-4 h-4 animate-spin" />
                  <span>Getting address...</span>
                </div>
              ) : (
                <div className="space-y-1">
                  <div className="text-sm text-gray-800 font-medium">
                    {address || 'Click on the map to select a location'}
                  </div>
                  {addressDataRef.current?.area && (
                    <div className="text-xs text-gray-600">
                      📍 Area: {addressDataRef.current.area}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3 mt-3">
          <button className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition-colors" onClick={onCancel}>
            Cancel
          </button>
          <button 
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" 
            onClick={confirm}
            disabled={!markerRef.current}
          >
            Use this location
          </button>
        </div>
      </div>
    </div>
  );
}
