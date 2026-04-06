import React, { useState, useEffect } from 'react'
import { Modal, ScrollView, TouchableOpacity, View } from 'react-native'
import { YStack, XStack, Input, Card, Text } from 'tamagui'
import { Ionicons } from '@expo/vector-icons'
import { Button } from '../../../../components/design-system'
import api, { API_CONFIG, getAuthToken } from '../../../../services/api'
import { emailService } from '../../../../services/emailService'

export function EmailConfigModal({ visible, onClose, userEmail, onSuccess, userFullName, targetUserId }: any) {
  const [loading, setLoading] = useState(false)
  const [testing, setTesting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [step, setStep] = useState<'basic' | 'advanced'>('basic')
  
  const [data, setData] = useState({
    email: userEmail || '',
    passwordEmail: '',
    imapHost: userEmail && userEmail.includes('@') ? `mail.${userEmail.split('@')[1]}` : 'bh8966.banahosting.com',
    imapPort: '993',
    imapSecure: true,
    smtpHost: userEmail && userEmail.includes('@') ? `mail.${userEmail.split('@')[1]}` : 'bh8966.banahosting.com',
    smtpPort: '465',
    smtpSecure: true,
  })

  // Reset cuando se abre el modal
  useEffect(() => {
    if (visible) {
      const defaultHost = userEmail && userEmail.includes('@') ? `mail.${userEmail.split('@')[1]}` : 'bh8966.banahosting.com'
      setData({
        email: userEmail || '',
        passwordEmail: '',
        imapHost: defaultHost,
        imapPort: '993',
        imapSecure: true,
        smtpHost: defaultHost,
        smtpPort: '465',
        smtpSecure: true,
      })
      setError(null)
      setSuccess(null)
      setStep('basic')
    }
  }, [visible, userEmail])

  const test = async () => {
    setError(null); setSuccess(null)
    if (!data.email || !data.passwordEmail) { setError('Email y contraseña requeridos'); return }
    if (!data.imapHost || !data.smtpHost) { setError('Servidores IMAP/SMTP requeridos'); return }
    try {
      setTesting(true)
      const token = getAuthToken()
      if (!token) { setError('Sin sesión'); return }
      const r = await api.post(API_CONFIG.endpoints.EMAIL_TEST, {
        email: data.email,
        passwordEmail: data.passwordEmail,
        imapHost: data.imapHost,
        imapPort: parseInt(data.imapPort),
        imapSecure: data.imapSecure,
        smtpHost: data.smtpHost,
        smtpPort: parseInt(data.smtpPort),
        smtpSecure: data.smtpSecure,
      }, { headers: { Authorization: `Bearer ${token}` } })
      if (r.data.success) setSuccess('✅ Conexión exitosa a IMAP y SMTP')
      else {
        const errs = []
        if (!r.data.data?.imap?.success) errs.push(`IMAP: ${r.data.data.imap?.error}`)
        if (!r.data.data?.smtp?.success) errs.push(`SMTP: ${r.data.data.smtp?.error}`)
        setError('❌ ' + errs.join(' | '))
      }
    } catch (e: any) { setError(e.response?.data?.message || 'Error') }
    finally { setTesting(false) }
  }

  const save = async () => {
    setError(null); setSuccess(null)
    if (!data.email || !data.passwordEmail) { setError('Email y contraseña requeridos'); return }
    if (!data.imapHost || !data.smtpHost) { setError('Servidores IMAP/SMTP requeridos'); return }
    try {
      setLoading(true)
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
      }

      // Si hay targetUserId, guardar para ese usuario (Admin)
      if (targetUserId) {
        console.log('💾 [Modal] Guardando config para userId:', targetUserId)
        await emailService.saveConfigForUser(targetUserId, configData)
      } else {
        console.log('💾 [Modal] Guardando config para usuario actual')
        await api.post(API_CONFIG.endpoints.EMAIL_CONFIG, configData, {
          headers: { Authorization: `Bearer ${getAuthToken()}` },
        })
      }
      
      setSuccess('✅ Configuración guardada correctamente')
      setTimeout(() => { onSuccess(); onClose() }, 1500)
    } catch (e: any) { setError(e.response?.data?.message || 'Error') }
    finally { setLoading(false) }
  }

  const InputField = ({ label, icon, ...props }: any) => (
    <YStack gap="$2">
      <XStack gap="$2" alignItems="center">
        {icon && <Ionicons name={icon} size={16} color="$color2" />}
        <Text fontSize={14} fontWeight="600" color="$color2">{label}</Text>
      </XStack>
      <Input borderWidth={1} borderColor="$border" borderRadius={12} height={50} paddingHorizontal="$3" {...props} />
    </YStack>
  )

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}>
        <TouchableOpacity activeOpacity={1} onPress={onClose} style={{ flex: 1 }} />
        <View style={{ maxHeight: '90%', backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24 }}>
          <Card padding="$4">
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 }}>
              <View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Ionicons name="mail" size={24} color="$primary" />
                  <Text fontSize={20} fontWeight="700">📧 Configurar Correo</Text>
                </View>
                {userFullName && <Text fontSize={13} color="$color2">Para: {userFullName}</Text>}
                {targetUserId && <Text fontSize={11} color="$primary">Asignando a otro usuario</Text>}
              </View>
              <TouchableOpacity onPress={onClose}><Ionicons name="close-circle" size={24} color="$color" /></TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              <YStack gap="$3">
                {error && <Card backgroundColor="$errorMuted" borderColor="$error" borderWidth={1} padding="$3"><Text color="$error" fontWeight="600">⚠️ {error}</Text></Card>}
                {success && <Card backgroundColor="$successMuted" borderColor="$success" borderWidth={1} padding="$3"><Text color="$success" fontWeight="600">{success}</Text></Card>}
                
                <XStack gap="$2">
                  <Button title="Básico" variant={step === 'basic' ? 'primary' : 'outline'} size="sm" flex={1} onPress={() => setStep('basic')} />
                  <Button title="Avanzado" variant={step === 'advanced' ? 'primary' : 'outline'} size="sm" flex={1} onPress={() => setStep('advanced')} />
                </XStack>
                
                {step === 'basic' && (
                  <YStack gap="$3">
                    <InputField label="Correo Electrónico" icon="mail-outline" placeholder="usuario@dominio.com" value={data.email} onChangeText={(t: string) => setData({ ...data, email: t })} keyboardType="email-address" autoCapitalize="none" />
                    <InputField label="Contraseña del Correo" icon="lock-closed-outline" placeholder="••••••••" value={data.passwordEmail} onChangeText={(t: string) => setData({ ...data, passwordEmail: t })} secureTextEntry />
                    <Card backgroundColor="$primaryMuted" padding="$3">
                      <Text fontSize={11} color="$primary" fontWeight="600">ℹ️ El nombre se tomará del usuario: {userFullName || 'No definido'}</Text>
                    </Card>
                  </YStack>
                )}
                
                {step === 'advanced' && (
                  <YStack gap="$3">
                    <Text fontSize={18} fontWeight="700">📥 IMAP (Recepción)</Text>
                    <InputField label="Servidor IMAP" icon="server-outline" placeholder="mail.dominio.com" value={data.imapHost} onChangeText={(t: string) => setData({ ...data, imapHost: t })} />
                    <XStack gap="$3">
                      <YStack flex={1}><InputField label="Puerto" icon="key-outline" placeholder="993" value={data.imapPort} onChangeText={(t: string) => setData({ ...data, imapPort: t })} keyboardType="number-pad" /></YStack>
                      <YStack flex={1} justifyContent="flex-end"><Button title={data.imapSecure ? '🔒 SSL' : '🔓 Sin SSL'} onPress={() => setData({ ...data, imapSecure: !data.imapSecure })} variant={data.imapSecure ? 'success' : 'outline'} size="sm" /></YStack>
                    </XStack>
                    
                    <Text fontSize={18} fontWeight="700" marginTop="$2">📤 SMTP (Envío)</Text>
                    <InputField label="Servidor SMTP" icon="server-outline" placeholder="mail.dominio.com" value={data.smtpHost} onChangeText={(t: string) => setData({ ...data, smtpHost: t })} />
                    <XStack gap="$3">
                      <YStack flex={1}><InputField label="Puerto" icon="key-outline" placeholder="465" value={data.smtpPort} onChangeText={(t: string) => setData({ ...data, smtpPort: t })} keyboardType="number-pad" /></YStack>
                      <YStack flex={1} justifyContent="flex-end"><Button title={data.smtpSecure ? '🔒 SSL' : '🔓 Sin SSL'} onPress={() => setData({ ...data, smtpSecure: !data.smtpSecure })} variant={data.smtpSecure ? 'success' : 'outline'} size="sm" /></YStack>
                    </XStack>
                  </YStack>
                )}
                
                <YStack gap="$3" paddingTop="$2">
                  <Button title={testing ? 'Probando...' : '🔧 Probar Conexión'} icon={"wifi-outline" as any} onPress={test} disabled={testing} variant="outline" size="lg" fullWidth />
                  <Button title={loading ? 'Guardando...' : '💾 Guardar Configuración'} icon={"save-outline" as any} onPress={save} disabled={loading} variant="primary" size="lg" fullWidth />
                  <Button title="Cancelar" onPress={onClose} variant="ghost" size="lg" fullWidth />
                </YStack>
                
                <Card backgroundColor="$background2" padding="$3">
                  <YStack gap="$1">
                    <XStack gap="$2" alignItems="center">
                      <Ionicons name="information-circle" size={16} color="$primary" />
                      <Text fontSize={12} fontWeight="600" color="$color">Configuración típica de cPanel</Text>
                    </XStack>
                    <Text fontSize={11} color="$color2">• Servidor: bh8966.banahosting.com</Text>
                    <Text fontSize={11} color="$color2">• IMAP: 993 (SSL) o 143 (sin SSL)</Text>
                    <Text fontSize={11} color="$color2">• SMTP: 465 (SSL) o 587 (TLS)</Text>
                  </YStack>
                </Card>
              </YStack>
            </ScrollView>
          </Card>
        </View>
      </View>
    </Modal>
  )
}
