import React from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import type { Instalacion } from '../../types'

interface Props {
  instalacion: Instalacion
  onPress?: () => void
  onCreateArea?: () => void
  showCreateArea?: boolean
}

export function InstalacionCard({
  instalacion,
  onPress,
  onCreateArea,
  showCreateArea = false,
}: Props) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      {/* Foto de la instalación */}
      <View style={styles.imageContainer}>
        {instalacion.foto ? (
          <Image source={{ uri: instalacion.foto }} style={styles.image} />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Ionicons name="business-outline" size={40} color="#999" />
          </View>
        )}
        {/* Badge de activo/inactivo */}
        <View style={[
          styles.statusBadge,
          { backgroundColor: instalacion.activa ? '#4CAF50' : '#9E9E9E' }
        ]}>
          <Text style={styles.statusText}>
            {instalacion.activa ? 'Activa' : 'Inactiva'}
          </Text>
        </View>
      </View>

      {/* Contenido de la tarjeta */}
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {instalacion.nombre_instalacion}
        </Text>

        {/* Ubicación */}
        <View style={styles.infoRow}>
          <Ionicons name="location-outline" size={16} color="#666" />
          <Text style={styles.infoText} numberOfLines={1}>
            {instalacion.ubicacion?.direccion || 'Sin ubicación'}
          </Text>
        </View>

        {/* Responsable */}
        <View style={styles.infoRow}>
          <Ionicons name="shield-outline" size={16} color="#666" />
          <Text style={styles.infoText} numberOfLines={1}>
            {instalacion.responsable || 'Sin responsable'}
          </Text>
        </View>

        {/* Descripción (corta) */}
        {instalacion.descripcion && (
          <Text style={styles.description} numberOfLines={2}>
            {instalacion.descripcion}
          </Text>
        )}

        {/* Registrador */}
        <View style={styles.registradorContainer}>
          <Ionicons name="person-circle-outline" size={16} color="#999" />
          <Text style={styles.registradorText}>
            Registrado por: {instalacion.nombre_registrador}
          </Text>
        </View>
      </View>

      {/* Botón de crear área */}
      {showCreateArea && (
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.createAreaButton}
            onPress={onCreateArea}
            activeOpacity={0.7}
          >
            <Ionicons name="add-circle-outline" size={20} color="#007AFF" />
            <Text style={styles.createAreaButtonText}>Crear Área</Text>
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 15,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
    height: 150,
    backgroundColor: '#f0f0f0',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e8e8e8',
  },
  statusBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 6,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  description: {
    fontSize: 14,
    color: '#888',
    marginTop: 8,
    marginBottom: 12,
    lineHeight: 20,
  },
  registradorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  registradorText: {
    fontSize: 12,
    color: '#999',
  },
  footer: {
    padding: 16,
    paddingTop: 0,
  },
  createAreaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#f0f8ff',
    borderRadius: 10,
    gap: 8,
    borderWidth: 1,
    borderColor: '#007AFF',
    borderStyle: 'dashed',
  },
  createAreaButtonText: {
    color: '#007AFF',
    fontSize: 15,
    fontWeight: '600',
  },
})
