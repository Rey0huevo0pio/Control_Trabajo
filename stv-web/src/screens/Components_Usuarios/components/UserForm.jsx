/**
 * ============================================================================
 * 👤 USER FORM - Formulario de usuario (Web)
 * ============================================================================
 */
import React, { useState, useCallback } from 'react';
import { userService } from '../../../services/userService';
import { emailService } from '../../../services/emailService';
import { EmailConfigModal } from './modulo_correo';

// Función para inicializar datos del formulario
function getInitialFormData(userData, isEditMode) {
  if (isEditMode && userData) {
    return {
      Control_Usuario: userData.Control_Usuario || '',
      password: '',
      nombre: userData.nombre || '',
      apellido: userData.apellido || '',
      rol: userData.rol || 'vigilante',
      telefono: userData.telefono || '',
      email: userData.email || '',
      departamento: userData.departamento || '',
      puesto: userData.puesto || '',
      activo: userData.activo !== false,
    };
  }
  return {
    Control_Usuario: '',
    password: '',
    nombre: '',
    apellido: '',
    rol: 'vigilante',
    telefono: '',
    email: '',
    departamento: '',
    puesto: '',
    activo: true,
  };
}

export function UserForm({ mode = 'create', user = null, onSave, onCancel }) {
  // Inicializar formData directamente con datos del usuario si existe
  const [formData, setFormData] = useState(() => getInitialFormData(user, mode === 'edit'));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [emailModalVisible, setEmailModalVisible] = useState(false);
  const [configuredEmail, setConfiguredEmail] = useState(null);
  const [loadingEmail, setLoadingEmail] = useState(false);

  // Cargar correo configurado - función interna que no necesita useCallback
  const loadConfiguredEmail = useCallback(async () => {
    if (!user?.id) return;
    try {
      setLoadingEmail(true);
      const config = await emailService.getEmailConfigByUserId(user.id);
      if (config && config.email) {
        setConfiguredEmail(config.email);
        setFormData((prev) => ({ ...prev, email: config.email }));
      }
    } catch {
      console.log('No hay correo configurado o error al cargar');
    } finally {
      setLoadingEmail(false);
    }
  }, [user]); // Dependencia completa del objeto user

  // Handler para cargar email cuando se necesita (llamado desde UI o al abrir modal)
  const handleLoadEmail = () => {
    if (mode === 'edit' && user?.id) {
      loadConfiguredEmail();
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (mode === 'create') {
        await userService.createUser(formData);
      } else {
        const updateData = { ...formData };
        if (!updateData.password) delete updateData.password;
        await userService.updateUser(user._id || user.id, updateData);
      }
      onSave?.();
    } catch (err) {
      console.error('[UserForm] Error:', err);
      setError(err.response?.data?.message || 'Error al guardar usuario');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: 'white', borderRadius: 14, padding: 24 }}>
      <h3 style={{ margin: '0 0 20px' }}>
        {mode === 'create' ? 'Nuevo Usuario' : 'Editar Usuario'}
      </h3>

      {error && (
        <div style={{ padding: 12, backgroundColor: '#FFE5E3', borderRadius: 8, marginBottom: 16, color: '#FF3B30' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Control Usuario *</label>
            <input
              type="text"
              value={formData.Control_Usuario}
              onChange={(e) => handleChange('Control_Usuario', e.target.value)}
              required
              disabled={mode === 'edit'}
              style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid #D1D1D6', fontSize: 14 }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
              Contraseña {mode === 'create' ? '*' : '(dejar vacio)'}
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => handleChange('password', e.target.value)}
              required={mode === 'create'}
              style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid #D1D1D6', fontSize: 14 }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Nombre *</label>
            <input
              type="text"
              value={formData.nombre}
              onChange={(e) => handleChange('nombre', e.target.value)}
              required
              style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid #D1D1D6', fontSize: 14 }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Apellido *</label>
            <input
              type="text"
              value={formData.apellido}
              onChange={(e) => handleChange('apellido', e.target.value)}
              required
              style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid #D1D1D6', fontSize: 14 }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Rol *</label>
            <select
              value={formData.rol}
              onChange={(e) => handleChange('rol', e.target.value)}
              style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid #D1D1D6', fontSize: 14 }}
            >
              <option value="vigilante">Vigilante</option>
              <option value="supervisor">Supervisor</option>
              <option value="rh">RRHH</option>
              <option value="it">TI</option>
              <option value="admin">Administrador</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Teléfono</label>
            <input
              type="tel"
              value={formData.telefono}
              onChange={(e) => handleChange('telefono', e.target.value)}
              style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid #D1D1D6', fontSize: 14 }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Email</label>
            {loadingEmail ? (
              <div style={{ padding: '12px 14px', borderRadius: 10, border: '1px solid #D1D1D6', fontSize: 14, color: '#8E8E93' }}>
                Cargando configuración de correo...
              </div>
) : configuredEmail ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 10, border: '1px solid #34C759', backgroundColor: '#F0FFF4' }}>
                <span style={{ fontSize: 24 }}>✅</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#1A1A1A' }}>📧 {configuredEmail}</div>
                  <div style={{ fontSize: 12, color: '#8E8E93' }}>Toca para editar la configuración</div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    handleLoadEmail();
                    setEmailModalVisible(true);
                  }}
                  style={{
                    padding: '8px 16px', borderRadius: 8, border: '1px solid #007AFF',
                    backgroundColor: 'white', color: '#007AFF', fontSize: 14, fontWeight: 600, cursor: 'pointer',
                  }}
                >
                  Editar
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  handleLoadEmail();
                  setEmailModalVisible(true);
                }}
                style={{
                  width: '100%', padding: '14px 16px', borderRadius: 10, border: '1px dashed #007AFF',
                  backgroundColor: '#F0F8FF', color: '#007AFF', fontSize: 14, fontWeight: 600, cursor: 'pointer',
                }}
              >
                ⚙️ Configurar Correo Electrónico
              </button>
            )}
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Departamento</label>
            <input
              type="text"
              value={formData.departamento}
              onChange={(e) => handleChange('departamento', e.target.value)}
              style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid #D1D1D6', fontSize: 14 }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Puesto</label>
            <input
              type="text"
              value={formData.puesto}
              onChange={(e) => handleChange('puesto', e.target.value)}
              style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid #D1D1D6', fontSize: 14 }}
            />
          </div>
        </div>

        {mode === 'edit' && (
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
            <input
              type="checkbox"
              checked={formData.activo}
              onChange={(e) => handleChange('activo', e.target.checked)}
              style={{ width: 18, height: 18 }}
            />
            <span style={{ fontSize: 14 }}>Usuario activo</span>
          </label>
        )}

        <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
          <button
            type="submit"
            disabled={loading}
            style={{
              flex: 1, padding: '14px 20px', borderRadius: 10, border: 'none',
              backgroundColor: '#007AFF', color: 'white', fontSize: 15, fontWeight: 600,
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? 'Guardando...' : 'Guardar'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            style={{
              padding: '14px 20px', borderRadius: 10, border: '1px solid #D1D1D6',
              backgroundColor: 'white', fontSize: 15, cursor: 'pointer',
            }}
          >
            Cancelar
          </button>
        </div>
      </form>

      {/* Modal de Configuración de Correo */}
      <EmailConfigModal
        visible={emailModalVisible}
        onClose={() => setEmailModalVisible(false)}
        userId={user?.id || ''}
        targetUserId={user?.id}
        userEmail={configuredEmail || user?.email || ''}
        userFullName={`${user?.nombre} ${user?.apellido}`}
        onSuccess={async () => {
          if (user?.id) {
            await loadConfiguredEmail();
          }
        }}
      />
    </div>
  );
}

export default UserForm;
