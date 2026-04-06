import React, { useState } from 'react'
import { Modal, ScrollView, TouchableOpacity, View } from 'react-native'
import { YStack, XStack, Input, Card, Text } from 'tamagui'
import { Ionicons } from '@expo/vector-icons'
import { Button } from '../../../../components/design-system'
import api, { API_CONFIG, getAuthToken } from '../../../../services/api'

export function EmailConfigModal({ visible, onClose, userEmail, onSuccess }: any) {
  const [loading, setLoading] = useState(false)
  const [testing, setTesting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [step, setStep] = useState<'basic' | 'advanced'>('basic')
  const [data, setData] = useState({ email: userEmail || '', displayName: '', passwordEmail: '', imapHost: '', imapPort: '993', imapSecure: true, smtpHost: '', smtpPort: '465', smtpSecure: true })

  const test = async () => {
    setError(null); setSuccess(null)
    if (!data.email || !data.passwordEmail) { setError('Email y contraseña requeridos'); return }
    try {
      setTesting(true)
      const token = getAuthToken()
      if (!token) { setError('Sin sesión'); return }
      const r = await api.post(API_CONFIG.endpoints.EMAIL_TEST, { ...data, imapPort: parseInt(data.imapPort), smtpPort: parseInt(data.smtpPort) }, { headers: { Authorization: `Bearer ${token}` } })
      if (r.data.success) setSuccess('✅ Conexión OK')
      else setError('❌ Error en conexión')
    } catch (e: any) { setError(e.response?.data?.message || 'Error') }
    finally { setTesting(false) }
  }

  const save = async () => {
    setError(null); setSuccess(null)
    if (!data.email || !data.passwordEmail || !data.displayName) { setError('Campos requeridos'); return }
    try {
      setLoading(true)
      const token = getAuthToken()
      if (!token) { setError('Sin sesión'); return }
      await api.post(API_CONFIG.endpoints.EMAIL_CONFIG, { ...data, imapPort: parseInt(data.imapPort), smtpPort: parseInt(data.smtpPort) }, { headers: { Authorization: `Bearer ${token}` } })
      setSuccess('✅ Guardado')
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
              <Text fontSize={20} fontWeight="700">📧 Configurar Correo</Text>
              <TouchableOpacity onPress={onClose}><Ionicons name="close-circle" size={24} color="$color" /></TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              <YStack gap="$3">
                {error && <Card backgroundColor="$errorMuted" padding="$3"><Text color="$error" fontWeight="600">⚠️ {error}</Text></Card>}
                {success && <Card backgroundColor="$successMuted" padding="$3"><Text color="$success" fontWeight="600">{success}</Text></Card>}
                <XStack gap="$2">
                  <Button title="Básico" variant={step === 'basic' ? 'primary' : 'outline'} size="sm" flex={1} onPress={() => setStep('basic')} />
                  <Button title="Avanzado" variant={step === 'advanced' ? 'primary' : 'outline'} size="sm" flex={1} onPress={() => setStep('advanced')} />
                </XStack>
                {step === 'basic' && (
                  <YStack gap="$3">
                    <InputField label="Correo" icon="mail-outline" placeholder="usuario@dominio.com" value={data.email} onChangeText={(t: string) => setData({ ...data, email: t })} keyboardType="email-address" autoCapitalize="none" />
                    <InputField label="Nombre" icon="person-outline" placeholder="Nombre Completo" value={data.displayName} onChangeText={(t: string) => setData({ ...data, displayName: t })} />
                    <InputField label="Contraseña" icon="lock-closed-outline" placeholder="••••••••" value={data.passwordEmail} onChangeText={(t: string) => setData({ ...data, passwordEmail: t })} secureTextEntry />
                  </YStack>
                )}
                {step === 'advanced' && (
                  <YStack gap="$3">
                    <Text fontSize={18} fontWeight="700">IMAP (Recepción)</Text>
                    <InputField label="Host" icon="server-outline" placeholder="mail.dominio.com" value={data.imapHost} onChangeText={(t: string) => setData({ ...data, imapHost: t })} />
                    <XStack gap="$3">
                      <YStack flex={1}><InputField label="Puerto" icon="key-outline" placeholder="993" value={data.imapPort} onChangeText={(t: string) => setData({ ...data, imapPort: t })} keyboardType="number-pad" /></YStack>
                      <YStack flex={1} justifyContent="flex-end"><Button title={data.imapSecure ? '🔒 SSL' : '🔓'} onPress={() => setData({ ...data, imapSecure: !data.imapSecure })} variant={data.imapSecure ? 'success' : 'outline'} size="sm" /></YStack>
                    </XStack>
                    <Text fontSize={18} fontWeight="700">SMTP (Envío)</Text>
                    <InputField label="Host" icon="server-outline" placeholder="mail.dominio.com" value={data.smtpHost} onChangeText={(t: string) => setData({ ...data, smtpHost: t })} />
                    <XStack gap="$3">
                      <YStack flex={1}><InputField label="Puerto" icon="key-outline" placeholder="465" value={data.smtpPort} onChangeText={(t: string) => setData({ ...data, smtpPort: t })} keyboardType="number-pad" /></YStack>
                      <YStack flex={1} justifyContent="flex-end"><Button title={data.smtpSecure ? '🔒 SSL' : '🔓'} onPress={() => setData({ ...data, smtpSecure: !data.smtpSecure })} variant={data.smtpSecure ? 'success' : 'outline'} size="sm" /></YStack>
                    </XStack>
                  </YStack>
                )}
                <YStack gap="$3">
                  <Button title={testing ? 'Probando...' : '🔧 Probar'} icon={"wifi-outline" as any} onPress={test} disabled={testing} variant="outline" size="lg" fullWidth />
                  <Button title={loading ? 'Guardando...' : '💾 Guardar'} icon={"save-outline" as any} onPress={save} disabled={loading} variant="primary" size="lg" fullWidth />
                  <Button title="Cancelar" onPress={onClose} variant="ghost" size="lg" fullWidth />
                </YStack>
                <Card backgroundColor="$background2" padding="$3">
                  <YStack gap="$1">
                    <Text fontSize={11} color="$color2">• Servidor: mail.tudominio.com</Text>
                    <Text fontSize={11} color="$color2">• IMAP: 993 (SSL) o 143</Text>
                    <Text fontSize={11} color="$color2">• SMTP: 465 (SSL) o 587</Text>
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
