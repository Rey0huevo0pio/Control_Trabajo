/**
 * ============================================================================
 * 📝 REGISTRO INSTALACION FORM - Formulario de registro (Web)
 * ============================================================================
 *
 * ADAPTADO DE: C_Ticket_Apk_STV/src_Instalaciones_STV/components/RegistroInstalacionForm.tsx
 *
 * QUÉ HACE:
 * - Formulario completo para registrar nueva instalación
 * - Campos: nombre, ubicación, descripción, responsable
 * - Validación y envío a la API
 *
 * CONEXIONES:
 * - Mobile: C_Ticket_Apk_STV/src_Instalaciones_STV/components/RegistroInstalacionForm.tsx
 * - API: src_Instalaciones_STV/lib/instalacion.api.js
 *
 * ============================================================================
 */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { instalacionApi } from '../lib/instalacion.api';

export const RegistroInstalacionForm = ({ onSuccess, onCancel }) => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    nombre_instalacion: '',
    nombre_registrador: user?.nombre || '',
    ubicacion: { direccion: '' },
    descripcion: '',
    responsable: '',
    creado_por: user?.id || '',
    activa: true,
  });

  const handleChange = (field, value) => {
    if (field === 'ubicacion') {
      setFormData(prev => ({
        ...prev,
        ubicacion: { ...prev.ubicacion, direccion: value },
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.nombre_instalacion.trim()) {
      setError('El nombre de la instalación es requerido');
      return;
    }
    if (!formData.ubicacion.direccion.trim()) {
      setError('La ubicación es requerida');
      return;
    }
    if (!formData.responsable.trim()) {
      setError('El responsable es requerido');
      return;
    }
    if (!formData.creado_por) {
      setError('Debes iniciar sesión para registrar una instalación');
      return;
    }

    setLoading(true);
    try {
      await instalacionApi.create(formData);
      if (onSuccess) onSuccess();
      else navigate('/instalaciones');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'No se pudo registrar la instalación');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (onCancel) onCancel();
    else navigate('/instalaciones');
  };

  const inputStyle = {
    display: 'flex', alignItems: 'center', gap: 12,
    borderWidth: 1, borderColor: '#DDD', borderRadius: 12,
    paddingHorizontal: 12, backgroundColor: '#F9F9F9',
    padding: 12,
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
            Registrar Instalación
          </h2>
          <p style={{ margin: '4px 0 0', fontSize: 14, color: 'rgba(255,255,255,0.8)' }}>
            Complete los datos de la nueva instalación
          </p>
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

          {/* Nombre de la instalación */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: '#333', marginBottom: 8 }}>
              Nombre de la Instalación *
            </label>
            <div style={inputStyle}>
              <span>🏢</span>
              <input
                type="text"
                placeholder="Ej: Oficina Principal"
                value={formData.nombre_instalacion}
                onChange={(e) => handleChange('nombre_instalacion', e.target.value)}
                style={{ flex: 1, border: 'none', outline: 'none', fontSize: 16, background: 'transparent' }}
              />
            </div>
          </div>

          {/* Nombre del registrador */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: '#333', marginBottom: 8 }}>
              Nombre del Registrador
            </label>
            <div style={{ ...inputStyle, backgroundColor: '#F2F2F7' }}>
              <span>👤</span>
              <input
                type="text"
                value={formData.nombre_registrador}
                readOnly
                style={{ flex: 1, border: 'none', outline: 'none', fontSize: 16, background: 'transparent', color: '#8E8E93' }}
              />
            </div>
          </div>

          {/* Ubicación */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: '#333', marginBottom: 8 }}>
              Ubicación *
            </label>
            <div style={inputStyle}>
              <span>📍</span>
              <input
                type="text"
                placeholder="Dirección completa"
                value={formData.ubicacion.direccion}
                onChange={(e) => handleChange('ubicacion', e.target.value)}
                style={{ flex: 1, border: 'none', outline: 'none', fontSize: 16, background: 'transparent' }}
              />
            </div>
          </div>

          {/* Descripción */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: '#333', marginBottom: 8 }}>
              Descripción
            </label>
            <div style={inputStyle}>
              <span>📄</span>
              <textarea
                placeholder="Descripción de la instalación"
                value={formData.descripcion}
                onChange={(e) => handleChange('descripcion', e.target.value)}
                rows={4}
                style={{ flex: 1, border: 'none', outline: 'none', fontSize: 16, background: 'transparent', resize: 'vertical', minHeight: 80 }}
              />
            </div>
          </div>

          {/* Responsable */}
          <div style={{ marginBottom: 28 }}>
            <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: '#333', marginBottom: 8 }}>
              Responsable *
            </label>
            <div style={inputStyle}>
              <span>🛡️</span>
              <input
                type="text"
                placeholder="Nombre del responsable"
                value={formData.responsable}
                onChange={(e) => handleChange('responsable', e.target.value)}
                style={{ flex: 1, border: 'none', outline: 'none', fontSize: 16, background: 'transparent' }}
              />
            </div>
          </div>

          {/* Botones */}
          <div style={{ display: 'flex', gap: 12 }}>
            <button
              type="button"
              onClick={handleCancel}
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
                  Registrar Instalación
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
