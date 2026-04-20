/**
 * ============================================================================
 * 📝 REGISTRO AREA FORM - Formulario de registro de área (Web)
 * ============================================================================
 *
 * ADAPTADO DE: C_Ticket_Apk_STV/src_Instalaciones_STV/components/RegistroAreaForm.tsx
 *
 * QUÉ HACE:
 * - Formulario para registrar nueva área dentro de una instalación
 * - Campos: nombre del área, descripción
 * - Validación y envío a la API
 *
 * CONEXIONES:
 * - Mobile: C_Ticket_Apk_STV/src_Instalaciones_STV/components/RegistroAreaForm.tsx
 * - API: src_Instalaciones_STV/lib/instalacion.api.js
 *
 * ============================================================================
 */
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { instalacionApi } from '../lib/instalacion.api';

export const RegistroAreaForm = () => {
  const navigate = useNavigate();
  const { instalacionId } = useParams();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    nombre_area: '',
    descripcion: '',
    id_instalacion: instalacionId,
    creado_por: user?.id || '',
  });

  // Mock instalación nombre (luego vendrá de la API)
  const instalacionNombre = 'Instalación #' + (instalacionId?.slice(-4) || '???');

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.nombre_area.trim()) {
      setError('El nombre del área es requerido');
      return;
    }

    setLoading(true);
    try {
      await instalacionApi.createArea(formData);
      navigate(`/instalaciones/${instalacionId}`);
    } catch (err) {
      setError(err.response?.data?.message || 'No se pudo registrar el área');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(180deg, #F5F7FA 0%, #E4E8EC 100%)',
      padding: '32px 24px',
    }}>
      <div style={{ maxWidth: 640, margin: '0 auto' }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)',
          padding: '32px 40px',
          borderRadius: 24,
          marginBottom: 24,
          textAlign: 'center',
          boxShadow: '0 8px 32px rgba(102, 126, 234, 0.35)',
        }}>
          <div style={{
            width: 64, height: 64, borderRadius: 20,
            background: 'rgba(255,255,255,0.2)',
            backdropFilter: 'blur(10px)',
            margin: '0 auto 16px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '2px solid rgba(255,255,255,0.3)',
          }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
              <line x1="12" y1="11" x2="12" y2="17" />
              <line x1="9" y1="14" x2="15" y2="14" />
            </svg>
          </div>
          <h2 style={{ margin: 0, fontSize: 28, fontWeight: 800, color: 'white', letterSpacing: '-0.5' }}>
            Registrar Nueva Área
          </h2>
          <p style={{ margin: '8px 0 0', fontSize: 15, color: 'rgba(255,255,255,0.8)', fontWeight: 500 }}>
            Complete los datos del nuevo espacio
          </p>
        </div>

        {/* Instalación info */}
        <div style={{
          background: 'linear-gradient(135deg, #E8F4FF 0%, #D4ECFE 100%)',
          borderRadius: 16, padding: 20,
          marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14,
          boxShadow: '0 4px 16px rgba(0, 122, 255, 0.15)',
          border: '1px solid rgba(0, 122, 255, 0.15)',
        }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#007AFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
            <path d="M9 22v-4h6v4" />
          </svg>
          <span style={{ fontSize: 17, color: '#007AFF', fontWeight: 700 }}>
            {instalacionNombre}
          </span>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} style={{
          background: 'linear-gradient(180deg, #FFFFFF 0%, #FAFBFC 100%)',
          borderRadius: 24, padding: 32,
          border: '1px solid #E8EAED',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
        }}>
          {/* Error message */}
          {error && (
            <div style={{
              background: 'linear-gradient(135deg, #FFE5E3 0%, #FFDDDA 100%)',
              border: '1px solid #FF3B30',
              borderRadius: 14, padding: 16, marginBottom: 24,
              display: 'flex', alignItems: 'center', gap: 12,
              boxShadow: '0 4px 12px rgba(255, 59, 48, 0.15)',
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FF3B30" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span style={{ color: '#FF3B30', fontSize: 14, fontWeight: 600 }}>{error}</span>
            </div>
          )}

          {/* Nombre del área */}
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#545454', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.5 }}>
              Nombre del Área *
            </label>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 14,
              borderWidth: 2, borderColor: '#E0E0E0', borderRadius: 14,
              padding: 16, backgroundColor: '#FAFAFA',
              transition: 'all 0.2s ease',
            }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#8E8E93" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
              </svg>
              <input
                type="text"
                placeholder="Ej: Recepción, Almacén, Oficina 101"
                value={formData.nombre_area}
                onChange={(e) => handleChange('nombre_area', e.target.value)}
                style={{ flex: 1, border: 'none', outline: 'none', fontSize: 16, background: 'transparent', fontWeight: 500 }}
              />
            </div>
          </div>

          {/* Descripción */}
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#545454', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.5 }}>
              Descripción (Opcional)
            </label>
            <div style={{
              display: 'flex', alignItems: 'flex-start', gap: 14,
              borderWidth: 2, borderColor: '#E0E0E0', borderRadius: 14,
              padding: 16, backgroundColor: '#FAFAFA',
              transition: 'all 0.2s ease',
            }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#8E8E93" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginTop: 2 }}>
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
              </svg>
              <textarea
                placeholder="Descripción del área y su función..."
                value={formData.descripcion}
                onChange={(e) => handleChange('descripcion', e.target.value)}
                rows={4}
                style={{ flex: 1, border: 'none', outline: 'none', fontSize: 16, background: 'transparent', resize: 'vertical', minHeight: 100, fontWeight: 500 }}
              />
            </div>
          </div>

          {/* Info card */}
          <div style={{
            background: 'linear-gradient(135deg, #E8F4FF 0%, #D4ECFE 100%)',
            borderRadius: 16, padding: 20,
            marginBottom: 28, display: 'flex', alignItems: 'flex-start', gap: 16,
            border: '1px solid rgba(0, 122, 255, 0.15)',
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#007AFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#007AFF', marginBottom: 6 }}>
                Información
              </div>
              <p style={{ fontSize: 14, color: '#5C5C5E', lineHeight: 1.6, margin: 0, fontWeight: 500 }}>
                El área se asociará automáticamente a la instalación seleccionada y estará disponible para crear tickets.
              </p>
            </div>
          </div>

          {/* Botones */}
          <div style={{ display: 'flex', gap: 16 }}>
            <button
              type="button"
              onClick={() => navigate(-1)}
              disabled={loading}
              style={{
                flex: 1, 
                background: 'linear-gradient(180deg, #F5F5F5 0%, #E8E8E8 100%)',
                border: '1px solid #D0D0D0',
                borderRadius: 14, padding: 18, 
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: 16, fontWeight: 700, color: '#5C5C5E',
                transition: 'all 0.2s ease',
              }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                flex: 1, 
                background: loading 
                  ? 'linear-gradient(180deg, #99C9FF 0%, #7DB8F5 100%)' 
                  : 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)',
                border: 'none', borderRadius: 14, padding: 18,
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: 16, fontWeight: 700, color: 'white',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                boxShadow: loading ? 'none' : '0 4px 16px rgba(102, 126, 234, 0.35)',
                transition: 'all 0.3s ease',
              }}
            >
              {loading ? (
                <span>⏳ Registrando...</span>
              ) : (
                <>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Registrar Área
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
