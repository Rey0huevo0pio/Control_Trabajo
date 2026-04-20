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
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { instalacionApi } from '../lib/instalacion.api';
import { userService } from '../../services/userService';

export const RegistroInstalacionForm = ({ instalacionId, onSuccess, onCancel }) => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [error, setError] = useState('');
  const [ingenieros, setIngenieros] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({
    nombre_instalacion: '',
    nombre_registrador: user?.nombre || '',
    ubicacion: { direccion: '' },
    descripcion: '',
    responsable: '',
    creado_por: user?.id || '',
    activa: true,
    ingeniero_instalacion: '',
    nombre_ingeniero: '',
  });

  useEffect(() => {
    const loadIngenieros = async () => {
      try {
        const usersData = await userService.getUsers();
        setIngenieros(usersData || []);
      } catch (err) {
        console.error('Error al cargar ingenieros:', err);
      }
    };
    loadIngenieros();
  }, []);

  useEffect(() => {
    if (instalacionId) {
      const loadInstalacion = async () => {
        setLoadingData(true);
        try {
          const data = await instalacionApi.getById(instalacionId);
          setFormData({
            nombre_instalacion: data.nombre_instalacion || '',
            nombre_registrador: data.nombre_registrador || user?.nombre || '',
            ubicacion: { direccion: data.ubicacion?.direccion || '' },
            descripcion: data.descripcion || '',
            responsable: data.responsable || '',
            creado_por: data.creado_por || user?.id || '',
            activa: data.activa ?? true,
            ingeniero_instalacion: data.ingeniero_instalacion || '',
            nombre_ingeniero: data.nombre_ingeniero || '',
          });
          setIsEditMode(true);
        } catch (err) {
          setError('No se pudo cargar la instalación');
        } finally {
          setLoadingData(false);
        }
      };
      loadInstalacion();
    }
  }, [instalacionId]);

  const handleChange = (field, value) => {
    if (field === 'ubicacion') {
      setFormData(prev => ({
        ...prev,
        ubicacion: { ...prev.ubicacion, direccion: value },
      }));
    } else if (field === 'ingeniero_instalacion') {
      const ingeniero = ingenieros.find(i => i.id === value);
      setFormData(prev => ({
        ...prev,
        ingeniero_instalacion: value,
        nombre_ingeniero: ingeniero ? `${ingeniero.nombre} ${ingeniero.apellido}`.trim() : '',
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
      if (isEditMode && instalacionId) {
        await instalacionApi.update(instalacionId, formData);
      } else {
        await instalacionApi.create(formData);
      }
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

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(180deg, #F5F7FA 0%, #E4E8EC 100%)',
      padding: '32px 24px',
    }}>
      <div style={{ maxWidth: 640, margin: '0 auto' }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #11998E 0%, #38EF7D 100%)',
          padding: '32px 40px',
          borderRadius: 24,
          marginBottom: 24,
          textAlign: 'center',
          boxShadow: '0 8px 32px rgba(56, 239, 125, 0.35)',
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
              <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
              <path d="M9 22v-4h6v4" />
              <line x1="8" y1="6" x2="8" y2="6" />
              <line x1="16" y1="6" x2="16" y2="6" />
            </svg>
          </div>
          <h2 style={{ margin: 0, fontSize: 28, fontWeight: 800, color: 'white', letterSpacing: '-0.5' }}>
            {isEditMode ? 'Editar Instalación' : 'Registrar Instalación'}
          </h2>
          <p style={{ margin: '8px 0 0', fontSize: 15, color: 'rgba(255,255,255,0.85)', fontWeight: 500 }}>
            {isEditMode ? 'Actualice los datos de la instalación' : 'Complete los datos de la nueva instalación'}
          </p>
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

          {/* Nombre de la instalación */}
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#545454', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.5 }}>
              Nombre de la Instalación *
            </label>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 14,
              borderWidth: 2, borderColor: '#E0E0E0', borderRadius: 14,
              padding: 16, backgroundColor: '#FAFAFA',
              transition: 'all 0.2s ease',
            }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#8E8E93" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
                <path d="M9 22v-4h6v4" />
              </svg>
              <input
                type="text"
                placeholder="Ej: Oficina Principal, Biblioteca Central"
                value={formData.nombre_instalacion}
                onChange={(e) => handleChange('nombre_instalacion', e.target.value)}
                style={{ flex: 1, border: 'none', outline: 'none', fontSize: 16, background: 'transparent', fontWeight: 500 }}
              />
            </div>
          </div>

          {/* Nombre del registrador */}
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#545454', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.5 }}>
              Nombre del Registrador
            </label>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 14,
              borderWidth: 2, borderColor: '#E8E8E8', borderRadius: 14,
              padding: 16, backgroundColor: '#F0F0F0',
              opacity: 0.8,
            }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#8E8E93" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <input
                type="text"
                value={formData.nombre_registrador}
                readOnly
                style={{ flex: 1, border: 'none', outline: 'none', fontSize: 16, background: 'transparent', color: '#8E8E93', fontWeight: 500 }}
              />
            </div>
          </div>

          {/* Ubicación */}
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#545454', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.5 }}>
              Ubicación *
            </label>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 14,
              borderWidth: 2, borderColor: '#E0E0E0', borderRadius: 14,
              padding: 16, backgroundColor: '#FAFAFA',
              transition: 'all 0.2s ease',
            }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#8E8E93" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <input
                type="text"
                placeholder="Dirección completa de la instalación"
                value={formData.ubicacion.direccion}
                onChange={(e) => handleChange('ubicacion', e.target.value)}
                style={{ flex: 1, border: 'none', outline: 'none', fontSize: 16, background: 'transparent', fontWeight: 500 }}
              />
            </div>
          </div>

          {/* Descripción */}
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#545454', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.5 }}>
              Descripción
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
                placeholder="Descripción de la instalación y sus servicios..."
                value={formData.descripcion}
                onChange={(e) => handleChange('descripcion', e.target.value)}
                rows={4}
                style={{ flex: 1, border: 'none', outline: 'none', fontSize: 16, background: 'transparent', resize: 'vertical', minHeight: 100, fontWeight: 500 }}
              />
            </div>
          </div>

          {/* Responsable */}
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#545454', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.5 }}>
              Responsable *
            </label>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 14,
              borderWidth: 2, borderColor: '#E0E0E0', borderRadius: 14,
              padding: 16, backgroundColor: '#FAFAFA',
              transition: 'all 0.2s ease',
            }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#8E8E93" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              <input
                type="text"
                placeholder="Nombre del responsable"
                value={formData.responsable}
                onChange={(e) => handleChange('responsable', e.target.value)}
                style={{ flex: 1, border: 'none', outline: 'none', fontSize: 16, background: 'transparent', fontWeight: 500 }}
              />
            </div>
          </div>

          {/* Ingeniero de Instalación */}
          <div style={{ marginBottom: 28 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#545454', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.5 }}>
              Ingeniero de Instalación
            </label>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 14,
              borderWidth: 2, borderColor: '#E0E0E0', borderRadius: 14,
              padding: 16, backgroundColor: '#FAFAFA',
              transition: 'all 0.2s ease',
            }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#8E8E93" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <select
                value={formData.ingeniero_instalacion}
                onChange={(e) => handleChange('ingeniero_instalacion', e.target.value)}
                style={{ flex: 1, border: 'none', outline: 'none', fontSize: 16, background: 'transparent', fontWeight: 500, color: '#333', cursor: 'pointer' }}
              >
                <option value="">Seleccionar ingeniero...</option>
                {ingenieros.map((ing) => (
                  <option key={ing.id} value={ing.id}>
                    {ing.nombre} {ing.apellido}
                  </option>
                ))}
              </select>
            </div>
            {formData.nombre_ingeniero && (
              <p style={{ marginTop: 8, fontSize: 13, color: '#34C759', fontWeight: 500 }}>
                Ingeniero asignado: {formData.nombre_ingeniero}
              </p>
            )}
          </div>

          {/* Botones */}
          <div style={{ display: 'flex', gap: 16 }}>
            <button
              type="button"
              onClick={handleCancel}
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
                  : 'linear-gradient(135deg, #11998E 0%, #38EF7D 100%)',
                border: 'none', borderRadius: 14, padding: 18,
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: 16, fontWeight: 700, color: 'white',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                boxShadow: loading ? 'none' : '0 4px 16px rgba(56, 239, 125, 0.35)',
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
                  {isEditMode ? 'Guardar Cambios' : 'Registrar Instalación'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
