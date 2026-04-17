import React, { useState, useEffect } from 'react';
import { Text, Card, Button, Stack, HStack, IconButton, Input } from '../../components/design-system';
import { useGoogleSheets } from '../hooks/useGoogleSheets.jsx';

export const GoogleSheetsManager = ({ onClose }) => {
  const {
    accessToken,
    isSignedIn,
    spreadsheets,
    loading,
    error,
    signIn,
    signOut,
    loadSpreadsheets,
    createSpreadsheet,
    deleteSpreadsheet,
    shareSpreadsheet,
    downloadSpreadsheet,
  } = useGoogleSheets();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedSheet, setSelectedSheet] = useState(null);
  const [newSheetTitle, setNewSheetTitle] = useState('');
  const [shareEmail, setShareEmail] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [downloadingId, setDownloadingId] = useState(null);

  const [initialLoadDone, setInitialLoadDone] = useState(false);

  useEffect(() => {
    console.log('Estado - isSignedIn:', isSignedIn, 'accessToken:', !!accessToken, 'loading:', loading, 'spreadsheets:', spreadsheets.length);
    if (isSignedIn && accessToken && !loading && !initialLoadDone) {
      console.log('Llamando loadSpreadsheets...');
      setInitialLoadDone(true);
      loadSpreadsheets();
    }
  }, [isSignedIn, accessToken, loading, initialLoadDone, loadSpreadsheets]);

  const handleCreate = async () => {
    if (!newSheetTitle.trim()) return;
    setActionLoading(true);
    try {
      await createSpreadsheet(newSheetTitle);
      setShowCreateModal(false);
      setNewSheetTitle('');
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (sheetId) => {
    if (!confirm('¿Estás seguro de eliminar este archivo?')) return;
    setActionLoading(true);
    try {
      await deleteSpreadsheet(sheetId);
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleShare = async () => {
    if (!shareEmail.trim() || !selectedSheet) return;
    setActionLoading(true);
    try {
      await shareSpreadsheet(selectedSheet.id, shareEmail);
      setShowShareModal(false);
      setShareEmail('');
      setSelectedSheet(null);
      alert('Archivo compartido exitosamente');
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const openShareModal = (sheet) => {
    setSelectedSheet(sheet);
    setShowShareModal(true);
  };

  const handleDownload = async (sheet) => {
    setDownloadingId(sheet.id);
    try {
      await downloadSpreadsheet(sheet.id, sheet.name, sheet.mimeType);
    } catch (err) {
      console.error('Error descargando:', err);
      alert('Error al descargar archivo');
    } finally {
      setDownloadingId(null);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 20,
          padding: '24px',
          width: '90%',
          maxWidth: 800,
          maxHeight: '90vh',
          overflow: 'auto',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <HStack justify="space-between" style={{ marginBottom: 24 }}>
          <Text variant="h3">Gestor de Google Sheets</Text>
          <IconButton
            icon={<span style={{ fontSize: 24 }}>✕</span>}
            onClick={onClose}
          />
        </HStack>

        {!isSignedIn ? (
          <Stack gap="16px" align="center" style={{ padding: '40px 0' }}>
            <Text variant="body">Inicia sesión con Google para gestionar tus archivos</Text>
            <Button onClick={signIn} disabled={loading}>
              {loading ? 'Conectando...' : 'Iniciar Sesión con Google'}
            </Button>
            {error && <Text variant="bodySmall" color="#FF3B30">{error}</Text>}
          </Stack>
        ) : (
          <>
            <HStack justify="space-between" style={{ marginBottom: 16 }}>
              <Text variant="bodySmall" color="#8E8E93">
                {spreadsheets.length} archivo(s)
              </Text>
              <HStack gap="8px">
                <Button variant="secondary" onClick={loadSpreadsheets} disabled={loading}>
                  Actualizar
                </Button>
                <Button onClick={() => setShowCreateModal(true)}>
                  + Nuevo Archivo
                </Button>
              </HStack>
            </HStack>

            {loading ? (
              <Stack align="center" style={{ padding: '40px 0' }}>
                <Text>Cargando archivos...</Text>
              </Stack>
            ) : spreadsheets.length === 0 ? (
              <Stack align="center" style={{ padding: '40px 0' }}>
                <Text variant="body" color="#8E8E93">No hay archivos disponibles</Text>
                <Button onClick={() => setShowCreateModal(true)} style={{ marginTop: 16 }}>
                  Crear primer archivo
                </Button>
              </Stack>
            ) : (
              <div style={{ display: 'grid', gap: 12 }}>
                {spreadsheets.map((sheet) => (
                  <Card key={sheet.id} variant="outlined">
                    <HStack justify="space-between">
                      <Stack gap="4px" style={{ flex: 1 }}>
                        <Text variant="h5">{sheet.name}</Text>
                        <Text variant="caption" color="#8E8E93">
                          Creado: {formatDate(sheet.createdTime)} · Modificado: {formatDate(sheet.modifiedTime)}
                        </Text>
                      </Stack>
                      <HStack gap="8px">
                        <IconButton
                          icon={<span style={{ fontSize: 20 }}>📥</span>}
                          onClick={() => handleDownload(sheet)}
                          title="Descargar Excel"
                          disabled={downloadingId === sheet.id}
                        />
                        <IconButton
                          icon={<span style={{ fontSize: 20 }}>🔗</span>}
                          onClick={() => window.open(`https://docs.google.com/spreadsheets/d/${sheet.id}`, '_blank')}
                          title="Abrir en Google Sheets"
                        />
                        <IconButton
                          icon={<span style={{ fontSize: 20 }}>📤</span>}
                          onClick={() => openShareModal(sheet)}
                          title="Compartir"
                        />
                        <IconButton
                          icon={<span style={{ fontSize: 20 }}>🗑️</span>}
                          onClick={() => handleDelete(sheet.id)}
                          title="Eliminar"
                          disabled={actionLoading}
                        />
                      </HStack>
                    </HStack>
                  </Card>
                ))}
              </div>
            )}

            <HStack justify="flex-end" style={{ marginTop: 24 }}>
              <Button variant="secondary" onClick={signOut}>
                Cerrar Sesión Google
              </Button>
            </HStack>
          </>
        )}
      </div>

      {showCreateModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1001,
          }}
          onClick={() => setShowCreateModal(false)}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 16,
              padding: 24,
              width: '90%',
              maxWidth: 400,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <Text variant="h4" style={{ marginBottom: 16 }}>Crear nuevo archivo</Text>
            <Input
              placeholder="Nombre del archivo"
              value={newSheetTitle}
              onChange={(e) => setNewSheetTitle(e.target.value)}
              style={{ marginBottom: 16 }}
            />
            <HStack justify="flex-end" gap="8px">
              <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCreate} disabled={actionLoading || !newSheetTitle.trim()}>
                {actionLoading ? 'Creando...' : 'Crear'}
              </Button>
            </HStack>
          </div>
        </div>
      )}

      {showShareModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1001,
          }}
          onClick={() => setShowShareModal(false)}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 16,
              padding: 24,
              width: '90%',
              maxWidth: 400,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <Text variant="h4" style={{ marginBottom: 8 }}>Compartir archivo</Text>
            <Text variant="bodySmall" color="#8E8E93" style={{ marginBottom: 16 }}>
              Compartiendo: {selectedSheet?.name}
            </Text>
            <Input
              placeholder="Correo electrónico"
              value={shareEmail}
              onChange={(e) => setShareEmail(e.target.value)}
              keyboardType="email"
              autoCapitalize="none"
              style={{ marginBottom: 16 }}
            />
            <HStack justify="flex-end" gap="8px">
              <Button variant="secondary" onClick={() => setShowShareModal(false)}>
                Cancelar
              </Button>
              <Button onClick={handleShare} disabled={actionLoading || !shareEmail.trim()}>
                {actionLoading ? 'Compartiendo...' : 'Compartir'}
              </Button>
            </HStack>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoogleSheetsManager;