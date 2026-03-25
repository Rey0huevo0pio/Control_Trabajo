import React, { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  Image,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { instalacionApi } from '../lib'
import type { CreateInstalacionDto } from '@/types'
import { useAuthStore } from '@/store'

interface Props {
  onSuccess?: () => void
  onCancel?: () => void
}

export function RegistroInstalacionForm({ onSuccess, onCancel }: Props) {
  const { user } = useAuthStore()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<CreateInstalacionDto>({
    nombre_instalacion: '',
    nombre_registrador: user?.nombre || '',
    ubicacion: {
      direccion: '',
    },
    descripcion: '',
    responsable: '',
    creado_por: user?.id || '',
    activa: true,
  })

  const handleChange = (field: keyof CreateInstalacionDto, value: string) => {
    if (field === 'ubicacion' && typeof value === 'string') {
      setFormData(prev => ({
        ...prev,
        ubicacion: { ...prev.ubicacion, direccion: value },
      }))
    } else {
      setFormData(prev => ({ ...prev, [field]: value }))
    }
  }

  const handleSubmit = async () => {
    // Validaciones básicas
    if (!formData.nombre_instalacion.trim()) {
      Alert.alert('Error', 'El nombre de la instalación es requerido')
      return
    }
    if (!formData.ubicacion.direccion.trim()) {
      Alert.alert('Error', 'La ubicación es requerida')
      return
    }
    if (!formData.responsable.trim()) {
      Alert.alert('Error', 'El responsable es requerido')
      return
    }
    if (!formData.creado_por) {
      Alert.alert('Error', 'Debes iniciar sesión para registrar una instalación')
      return
    }

    setLoading(true)
    try {
      console.log('Datos a enviar:', JSON.stringify(formData, null, 2))
      console.log('Usuario actual:', user)
      await instalacionApi.create(formData)
      Alert.alert('Éxito', 'Instalación registrada correctamente')
      setFormData({
        nombre_instalacion: '',
        nombre_registrador: user?.nombre || '',
        ubicacion: { direccion: '' },
        descripcion: '',
        responsable: '',
        creado_por: user?.id || '',
        activa: true,
      })
      onSuccess?.()
    } catch (error: any) {
      console.error('Error completo:', error)
      console.error('Response data:', error.response?.data)
      Alert.alert(
        'Error',
        error.response?.data?.message || error.message || 'No se pudo registrar la instalación'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Registrar Instalación</Text>

      {/* Nombre de la instalación */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Nombre de la Instalación *</Text>
        <View style={styles.inputContainer}>
          <Ionicons name="business-outline" size={20} color="#666" />
          <TextInput
            style={styles.input}
            placeholder="Ej: Oficina Principal"
            value={formData.nombre_instalacion}
            onChangeText={(value) => handleChange('nombre_instalacion', value)}
          />
        </View>
      </View>

      {/* Nombre del registrador */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Nombre del Registrador</Text>
        <View style={styles.inputContainer}>
          <Ionicons name="person-outline" size={20} color="#666" />
          <TextInput
            style={styles.input}
            placeholder="Tu nombre"
            value={formData.nombre_registrador}
            onChangeText={(value) => handleChange('nombre_registrador', value)}
            editable={false}
          />
        </View>
      </View>

      {/* Ubicación */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Ubicación *</Text>
        <View style={styles.inputContainer}>
          <Ionicons name="location-outline" size={20} color="#666" />
          <TextInput
            style={styles.input}
            placeholder="Dirección completa"
            value={formData.ubicacion.direccion}
            onChangeText={(value) => handleChange('ubicacion', value)}
          />
        </View>
      </View>

      {/* Descripción */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Descripción</Text>
        <View style={styles.inputContainer}>
          <Ionicons name="document-text-outline" size={20} color="#666" />
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Descripción de la instalación"
            value={formData.descripcion}
            onChangeText={(value) => handleChange('descripcion', value)}
            multiline
            numberOfLines={4}
          />
        </View>
      </View>

      {/* Responsable */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Responsable *</Text>
        <View style={styles.inputContainer}>
          <Ionicons name="shield-outline" size={20} color="#666" />
          <TextInput
            style={styles.input}
            placeholder="Nombre del responsable"
            value={formData.responsable}
            onChangeText={(value) => handleChange('responsable', value)}
          />
        </View>
      </View>

      {/* Foto (opcional) - Placeholder para futura implementación */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Foto de la Instalación (Opcional)</Text>
        <TouchableOpacity style={styles.photoButton}>
          <Ionicons name="camera-outline" size={24} color="#007AFF" />
          <Text style={styles.photoButtonText}>Seleccionar Foto</Text>
        </TouchableOpacity>
        {formData.foto && (
          <Image source={{ uri: formData.foto }} style={styles.photoPreview} />
        )}
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
              <Text style={styles.submitButtonText}>Registrar Instalación</Text>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
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
  photoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderWidth: 2,
    borderColor: '#007AFF',
    borderRadius: 10,
    borderStyle: 'dashed',
    backgroundColor: '#f0f8ff',
  },
  photoButtonText: {
    color: '#007AFF',
    fontSize: 16,
    marginLeft: 8,
    fontWeight: '600',
  },
  photoPreview: {
    width: '100%',
    height: 200,
    marginTop: 10,
    borderRadius: 10,
    resizeMode: 'cover',
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
