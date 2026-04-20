/**
 * ============================================================================
 * 📝 REGISTRO INSTALACION SCREEN - Pantalla de registro (Web)
 * ============================================================================
 *
 * ADAPTADO DE: C_Ticket_Apk_STV/src_Instalaciones_STV/screens/RegistroInstalacionScreen.tsx
 *
 * QUÉ HACE:
 * - Wrapper del formulario de registro de instalación
 * - Soporta modo edición cuando recibe instalacionId
 *
 * CONEXIONES:
 * - Component: src_Instalaciones_STV/components/RegistroInstalacionForm.jsx
 *
 * ============================================================================
 */
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { RegistroInstalacionForm } from '../components/RegistroInstalacionForm';

export const RegistroInstalacionScreen = () => {
  const { instalacionId } = useParams();
  const navigate = useNavigate();

  const handleSuccess = () => {
    if (instalacionId) {
      navigate(`/instalaciones/${instalacionId}`);
    } else {
      navigate('/instalaciones');
    }
  };

  return <RegistroInstalacionForm instalacionId={instalacionId} onSuccess={handleSuccess} />;
};
