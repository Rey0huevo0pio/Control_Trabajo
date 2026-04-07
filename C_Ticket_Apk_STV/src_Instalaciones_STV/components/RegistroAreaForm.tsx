import React, { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { instalacionApi } from '../lib'
import type { CreateAreaInstalacionDto } from '@/types'
import { useAuthStore } from '@/store'

interface Props {
  instalacionId: string
  instalacionNombre: string
  onSuccess?: () => void
  onCancel?: () => void
}

export function RegistroAreaForm({
  instalacionId,
  instalacionNombre,
  onSuccess,
  onCancel,
}: Props) {
  const { user } = useAuthStore()
  const insets = useSafeAreaInsets()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<CreateAreaInstalacionDto>({
    nombre_area: '',
    descripcion: '',
    id_instalacion: instalacionId,
    creado_por: user?.id || '',
  })

  const handleChange = (field: keyof CreateAreaInstalacionDto, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async () => {
    if (!formData.nombre_area.trim()) {
      Alert.alert('Error', 'El nombre del área es requerido')
      return
    }

    setLoading(true)
    try {
      await instalacionApi.createArea(formData)
      Alert.alert('Éxito', 'Área registrada correctamente')
      setFormData({
        nombre_area: '',
        descripcion: '',
        id_instalacion: instalacionId,
        creado_por: user?.id || '',
      })
      onSuccess?.()
    } catch (error: any) {
      Alert.alert(
        'Error',
        error.response?.data?.message || 'No se pudo registrar el área'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <ScrollView 
      style={styles.container} 
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingTop: insets.top + 16,
        paddingBottom: insets.bottom + 40,
      }}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Registrar Nueva Área</Text>
        <View style={styles.instalacionInfo}>
          <Ionicons name="business-outline" size={20} color="#007AFF" />
          <Text style={styles.instalacionNombre}>{instalacionNombre}</Text>
        </View>
      </View>

      {/* Nombre del área */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Nombre del Área *</Text>
        <View style={styles.inputContainer}>
          <Ionicons name="layers-outline" size={20} color="#666" />
          <TextInput
            style={styles.input}
            placeholder="Ej: Recepción, Almacén, Oficina 101"
            value={formData.nombre_area}
            onChangeText={(value) => handleChange('nombre_area', value)}
          />
        </View>
      </View>

      {/* Descripción */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Descripción (Opcional)</Text>
        <View style={styles.inputContainer}>
          <Ionicons name="document-text-outline" size={20} color="#666" />
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Descripción del área"
            value={formData.descripcion}
            onChangeText={(value) => handleChange('descripcion', value)}
            multiline
            numberOfLines={4}
          />
        </View>
      </View>

      {/* Información adicional */}
      <View style={styles.infoCard}>
        <Ionicons name="information-circle-outline" size={24} color="#007AFF" />
        <View style={styles.infoCardContent}>
          <Text style={styles.infoCardTitle}>Información</Text>
          <Text style={styles.infoCardText}>
            El área se asociará automáticamente a la instalación seleccionada.
          </Text>
        </View>
      </View>

      {/* Botones */}
      <View style={styles.buttonContainer}>
        {onCancel && (
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={onCancel}
            disabled={loading}
          >
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[styles.button, styles.submitButton, loading && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Ionicons name="checkmark-circle-outline" size={20} color="#fff" />
              <Text style={styles.submitButtonText}>Registrar Área</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  instalacionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#f0f8ff',
    padding: 12,
    borderRadius: 10,
  },
  instalacionNombre: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 12,
    backgroundColor: '#f9f9f9',
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    fontSize: 16,
    color: '#333',
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#f0f8ff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    gap: 12,
  },
  infoCardContent: {
    flex: 1,
  },
  infoCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
    marginBottom: 4,
  },
  infoCardText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 20,
    marginBottom: 40,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 10,
    gap: 8,
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: '#007AFF',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
})
