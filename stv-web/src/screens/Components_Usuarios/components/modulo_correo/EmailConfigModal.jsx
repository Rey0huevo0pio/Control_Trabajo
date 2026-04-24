/**
 * ============================================================================
 * 📧 EMAIL CONFIG MODAL - Configuración de correo IMAP (Web)
 * ============================================================================
 */
import React, { useState, useEffect } from 'react';
import api, { getAuthToken } from '../../../../services/api';

const DEFAULT_IMAP_HOST = 'bh8966.banahosting.com';

export function EmailConfigModal({ visible, onClose, userEmail, onSuccess, userFullName, targetUserId }) {
  if (!visible) return null;

  const [loading, setLoading] = useState(false);
  const [testing, setTesting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [step, setStep] = useState('basic');

  const [data, setData] = useState({
    email: userEmail || '',
    passwordEmail: '',
    imapHost: DEFAULT_IMAP_HOST,
    imapPort: '993',
    imapSecure: true,
    smtpHost: DEFAULT_IMAP_HOST,
    smtpPort: '465',
    smtpSecure: true,
  });

  useEffect(() => {
    if (visible) {
      const defaultHost = userEmail && userEmail.includes('@') ? `mail.${userEmail.split('@')[1]}` : DEFAULT_IMAP_HOST;
      setData({
        email: userEmail || '',
        passwordEmail: '',
        imapHost: defaultHost,
        imapPort: '993',
        imapSecure: true,
        smtpHost: defaultHost,
        smtpPort: '465',
        smtpSecure: true,
      });
      setError(null);
      setSuccess(null);
      setStep('basic');
    }
  }, [visible, userEmail]);

  const test = async () => {
    setError(null);
    setSuccess(null);
    if (!data.email || !data.passwordEmail) {
      setError('Email y contraseña requeridos');
      return;
    }
    if (!data.imapHost || !data.smtpHost) {
      setError('Servidores IMAP/SMTP requeridos');
      return;
    }
    try {
      setTesting(true);
      const token = getAuthToken();
      if (!token) {
        setError('Sin sesión');
        return;
      }
      const r = await api.post('/email/config/test', {
        email: data.email,
        passwordEmail: data.passwordEmail,
        imapHost: data.imapHost,
        imapPort: parseInt(data.imapPort),
        imapSecure: data.imapSecure,
        smtpHost: data.smtpHost,
        smtpPort: parseInt(data.smtpPort),
        smtpSecure: data.smtpSecure,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (r.data.success) {
        setSuccess('✅ Conexión exitosa a IMAP y SMTP');
      } else {
        const errs = [];
        if (!r.data.data?.imap?.success) errs.push(`IMAP: ${r.data.data?.imap?.error}`);
        if (!r.data.data?.smtp?.success) errs.push(`SMTP: ${r.data.data?.smtp?.error}`);
        setError('❌ ' + errs.join(' | '));
      }
    } catch (e) {
      setError(e.response?.data?.message || 'Error de conexión');
    } finally {
      setTesting(false);
    }
  };

  const save = async () => {
    setError(null);
    setSuccess(null);
    if (!data.email || !data.passwordEmail) {
      setError('Email y contraseña requeridos');
      return;
    }
    if (!data.imapHost || !data.smtpHost) {
      setError('Servidores IMAP/SMTP requeridos');
      return;
    }
    try {
      setLoading(true);
      const configData = {
        email: data.email,
        displayName: userFullName || data.email.split('@')[0] || 'Usuario',
        passwordEmail: data.passwordEmail,
        imapHost: data.imapHost,
        imapPort: parseInt(data.imapPort),
        imapSecure: data.imapSecure,
        smtpHost: data.smtpHost,
        smtpPort: parseInt(data.smtpPort),
        smtpSecure: data.smtpSecure,
      };

      const token = getAuthToken();
      if (targetUserId) {
        await api.post(`/email/config/user/${targetUserId}`, configData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await api.post('/email/config', configData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      setSuccess('✅ Configuración guardada correctamente');
      setTimeout(() => {
        onSuccess?.();
        onClose();
      }, 1500);
    } catch (e) {
      setError(e.response?.data?.message || 'Error al guardar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
    }}>
      <div style={{
        backgroundColor: 'white', borderRadius: 20, width: '90%', maxWidth: 500, maxHeight: '90%',
        overflow: 'hidden',
      }}>
        <div style={{ padding: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 24 }}>📧</span>
                <h3 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>Configurar Correo</h3>
              </div>
              {userFullName && <p style={{ margin: '4px 0 0', fontSize: 13, color: '#8E8E93' }}>Para: {userFullName}</p>}
            </div>
            <button onClick={onClose} style={{ fontSize: 24, background: 'none', border: 'none', cursor: 'pointer' }}>×</button>
          </div>

          {error && (
            <div style={{ padding: 12, backgroundColor: '#FFE5E3', borderRadius: 10, marginBottom: 16, color: '#FF3B30', fontWeight: 600 }}>
              ⚠️ {error}
            </div>
          )}
          {success && (
            <div style={{ padding: 12, backgroundColor: '#E5F1FF', borderRadius: 10, marginBottom: 16, color: '#34C759', fontWeight: 600 }}>
              {success}
            </div>
          )}

          <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
            <button
              onClick={() => setStep('basic')}
              style={{
                flex: 1, padding: '10px 16px', borderRadius: 10, border: '1px solid #D1D1D6',
                backgroundColor: step === 'basic' ? '#007AFF' : 'white', color: step === 'basic' ? 'white' : '#007AFF',
                fontWeight: 600, cursor: 'pointer',
              }}
            >
              Básico
            </button>
            <button
              onClick={() => setStep('advanced')}
              style={{
                flex: 1, padding: '10px 16px', borderRadius: 10, border: '1px solid #D1D1D6',
                backgroundColor: step === 'advanced' ? '#007AFF' : 'white', color: step === 'advanced' ? 'white' : '#007AFF',
                fontWeight: 600, cursor: 'pointer',
              }}
            >
              Avanzado
            </button>
          </div>

          {step === 'basic' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Correo Electrónico</label>
                <input
                  type="email"
                  placeholder="usuario@dominio.com"
                  value={data.email}
                  onChange={(e) => setData({ ...data, email: e.target.value })}
                  style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: '1px solid #D1D1D6', fontSize: 14 }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Contraseña del Correo</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={data.passwordEmail}
                  onChange={(e) => setData({ ...data, passwordEmail: e.target.value })}
                  style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: '1px solid #D1D1D6', fontSize: 14 }}
                />
              </div>
              <div style={{ padding: 12, backgroundColor: '#F2F2F7', borderRadius: 10 }}>
                <p style={{ margin: 0, fontSize: 13, color: '#007AFF' }}>ℹ️ El nombre se tomará del usuario: {userFullName || 'No definido'}</p>
              </div>
            </div>
          )}

          {step === 'advanced' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <h4 style={{ margin: '16px 0 8px', fontSize: 16, fontWeight: 700 }}>📥 IMAP (Recepción)</h4>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Servidor IMAP</label>
                <input
                  type="text"
                  placeholder="mail.dominio.com"
                  value={data.imapHost}
                  onChange={(e) => setData({ ...data, imapHost: e.target.value })}
                  style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: '1px solid #D1D1D6', fontSize: 14 }}
                />
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Puerto</label>
                  <input
                    type="number"
                    placeholder="993"
                    value={data.imapPort}
                    onChange={(e) => setData({ ...data, imapPort: e.target.value })}
                    style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: '1px solid #D1D1D6', fontSize: 14 }}
                  />
                </div>
                <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end' }}>
                  <button
                    onClick={() => setData({ ...data, imapSecure: !data.imapSecure })}
                    style={{
                      width: '100%', padding: '12px', borderRadius: 10, border: '1px solid #D1D1D6',
                      backgroundColor: data.imapSecure ? '#34C759' : '#F2F2F7', color: data.imapSecure ? 'white' : '#3C3C43',
                      fontWeight: 600, cursor: 'pointer',
                    }}
                  >
                    {data.imapSecure ? '🔒 SSL' : '🔓 Sin SSL'}
                  </button>
                </div>
              </div>

              <h4 style={{ margin: '16px 0 8px', fontSize: 16, fontWeight: 700 }}>📤 SMTP (Envío)</h4>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Servidor SMTP</label>
                <input
                  type="text"
                  placeholder="mail.dominio.com"
                  value={data.smtpHost}
                  onChange={(e) => setData({ ...data, smtpHost: e.target.value })}
                  style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: '1px solid #D1D1D6', fontSize: 14 }}
                />
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Puerto</label>
                  <input
                    type="number"
                    placeholder="465"
                    value={data.smtpPort}
                    onChange={(e) => setData({ ...data, smtpPort: e.target.value })}
                    style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: '1px solid #D1D1D6', fontSize: 14 }}
                  />
                </div>
                <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end' }}>
                  <button
                    onClick={() => setData({ ...data, smtpSecure: !data.smtpSecure })}
                    style={{
                      width: '100%', padding: '12px', borderRadius: 10, border: '1px solid #D1D1D6',
                      backgroundColor: data.smtpSecure ? '#34C759' : '#F2F2F7', color: data.smtpSecure ? 'white' : '#3C3C43',
                      fontWeight: 600, cursor: 'pointer',
                    }}
                  >
                    {data.smtpSecure ? '🔒 SSL' : '🔓 Sin SSL'}
                  </button>
                </div>
              </div>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 20 }}>
            <button
              onClick={test}
              disabled={testing}
              style={{
                padding: '14px', borderRadius: 10, border: '1px solid #007AFF',
                backgroundColor: 'white', color: '#007AFF', fontSize: 15, fontWeight: 600,
                cursor: testing ? 'not-allowed' : 'pointer', opacity: testing ? 0.6 : 1,
              }}
            >
              {testing ? 'Probando...' : '🔧 Probar Conexión'}
            </button>
            <button
              onClick={save}
              disabled={loading}
              style={{
                padding: '14px', borderRadius: 10, border: 'none',
                backgroundColor: '#007AFF', color: 'white', fontSize: 15, fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1,
              }}
            >
              {loading ? 'Guardando...' : '💾 Guardar Configuración'}
            </button>
            <button
              onClick={onClose}
              style={{
                padding: '14px', borderRadius: 10, border: '1px solid #D1D1D6',
                backgroundColor: 'white', fontSize: 15, cursor: 'pointer',
              }}
            >
              Cancelar
            </button>
          </div>

          <div style={{ marginTop: 16, padding: 12, backgroundColor: '#F2F2F7', borderRadius: 10 }}>
            <p style={{ fontSize: 12, fontWeight: 600, marginBottom: 4 }}>📝 Configuración típica de cPanel</p>
            <p style={{ fontSize: 12, margin: '4px 0', color: '#8E8E93' }}>• Servidor: bh8966.banahosting.com</p>
            <p style={{ fontSize: 12, margin: '4px 0', color: '#8E8E93' }}>• IMAP: 993 (SSL) o 143 (sin SSL)</p>
            <p style={{ fontSize: 12, margin: '4px 0', color: '#8E8E93' }}>• SMTP: 465 (SSL) o 587 (TLS)</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmailConfigModal;