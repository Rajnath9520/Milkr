import React, { useEffect, useState } from 'react';
import healthService from '../../services/healthService';

const ApiHealth = ({ interval = 30000 }) => {
  const [status, setStatus] = useState({ ok: false, message: 'Unknown' });

  const check = async () => {
    try {
      const res = await healthService.getHealth();
      if (res && res.status === 'active') {
        setStatus({ ok: true, message: res.message || 'OK' });
      } else {
        setStatus({ ok: false, message: res?.message || 'Unhealthy' });
      }
    } catch (err) {
      setStatus({ ok: false, message: err?.response?.data?.error || 'Down' });
    }
  };

  useEffect(() => {
    check();
    const id = setInterval(check, interval);
    return () => clearInterval(id);
  }, [interval]);

  return (
    <div className={`px-3 py-1 rounded-full text-sm font-medium ${status.ok ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`} title={status.message}>
      API: {status.ok ? 'OK' : 'Down'}
    </div>
  );
};

export default ApiHealth;
