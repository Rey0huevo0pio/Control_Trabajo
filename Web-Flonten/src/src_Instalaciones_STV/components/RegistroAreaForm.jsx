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
    <div style={{ minHeight: '100vh', backgroundColor: '#F2F2F7' }}>
      <div style={{ maxWidth: 700, margin: '0 auto', padding: '24px 32px' }}>
        {/* Header */}
        <div style={{
          backgroundColor: '#007AFF', padding: '24px 32px',
          borderRadius: 20, marginBottom: 24, textAlign: 'center',
        }}>
          <h2 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: 'white' }}>
            Registrar Nueva Área
          </h2>
          <p style={{ margin: '4px 0 0', fontSize: 14, color: 'rgba(255,255,255,0.8)' }}>
            Complete los datos del nuevo área
          </p>
        </div>

        {/* Instalación info */}
        <div style={{
          backgroundColor: '#E8F2FF', borderRadius: 12, padding: 16,
          marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
        }}>
          <span style={{ fontSize: 20 }}>🏢</span>
          <span style={{ fontSize: 16, color: '#007AFF', fontWeight: 600 }}>
            {instalacionNombre}
          </span>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} style={{
          backgroundColor: 'white', borderRadius: 20, padding: 32,
          border: '1px solid #D1D1D6',
        }}>
          {/* Error message */}
          {error && (
            <div style={{
              backgroundColor: '#FFE5E3', border: '1px solid #FF3B30',
              borderRadius: 12, padding: 12, marginBottom: 20,
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <span style={{ fontSize: 20 }}>⚠️</span>
              <span style={{ color: '#FF3B30', fontSize: 14, fontWeight: 500 }}>{error}</span>
            </div>
          )}

          {/* Nombre del área */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: '#333', marginBottom: 8 }}>
              Nombre del Área *
            </label>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 12,
              borderWidth: 1, borderColor: '#DDD', borderRadius: 12,
              padding: 12, backgroundColor: '#F9F9F9',
            }}>
              <span>📂</span>
              <input
                type="text"
                placeholder="Ej: Recepción, Almacén, Oficina 101"
                value={formData.nombre_area}
                onChange={(e) => handleChange('nombre_area', e.target.value)}
                style={{ flex: 1, border: 'none', outline: 'none', fontSize: 16, background: 'transparent' }}
              />
            </div>
          </div>

          {/* Descripción */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: '#333', marginBottom: 8 }}>
              Descripción (Opcional)
            </label>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 12,
              borderWidth: 1, borderColor: '#DDD', borderRadius: 12,
              padding: 12, backgroundColor: '#F9F9F9',
            }}>
              <span>📄</span>
              <textarea
                placeholder="Descripción del área"
                value={formData.descripcion}
                onChange={(e) => handleChange('descripcion', e.target.value)}
                rows={4}
                style={{ flex: 1, border: 'none', outline: 'none', fontSize: 16, background: 'transparent', resize: 'vertical', minHeight: 80 }}
              />
            </div>
          </div>

          {/* Info card */}
          <div style={{
            backgroundColor: '#E8F2FF', borderRadius: 12, padding: 16,
            marginBottom: 24, display: 'flex', alignItems: 'flex-start', gap: 12,
          }}>
            <span style={{ fontSize: 24, color: '#007AFF' }}>ℹ️</span>
            <div>
              <div style={{ fontSize: 16, fontWeight: 600, color: '#007AFF', marginBottom: 4 }}>
                Información
              </div>
              <p style={{ fontSize: 14, color: '#666', lineHeight: 1.5, margin: 0 }}>
                El área se asociará automáticamente a la instalación seleccionada.
              </p>
            </div>
          </div>

          {/* Botones */}
          <div style={{ display: 'flex', gap: 12 }}>
            <button
              type="button"
              onClick={() => navigate(-1)}
              disabled={loading}
              style={{
                flex: 1, backgroundColor: '#F0F0F0', border: '1px solid #DDD',
                borderRadius: 12, padding: 15, cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: 16, fontWeight: 600, color: '#666',
              }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                flex: 1, backgroundColor: loading ? '#99C9FF' : '#007AFF',
                border: 'none', borderRadius: 12, padding: 15,
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: 16, fontWeight: 600, color: 'white',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              }}
            >
              {loading ? (
                <span>⏳ Registrando...</span>
              ) : (
                <>
                  <span>✓</span>
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
