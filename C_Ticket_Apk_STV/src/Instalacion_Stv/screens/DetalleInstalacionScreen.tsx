import React, { useState, useCallback } from 'react'
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Image,
  TouchableOpacity,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useFocusEffect } from '@react-navigation/native'
import { InstalacionCard } from '../components'
import { instalacionApi } from '../lib'
import type { Instalacion, AreaInstalacion } from '../../types'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import type { InstalacionStackParamList } from '../../types'

type NavigationProp = NativeStackNavigationProp<InstalacionStackParamList>

interface Props {
  navigation: NavigationProp
  route: {
    params: {
      instalacionId: string
    }
  }
}

export function DetalleInstalacionScreen({ navigation, route }: Props) {
  const { instalacionId } = route.params
  const [instalacion, setInstalacion] = useState<Instalacion | null>(null)
  const [areas, setAreas] = useState<AreaInstalacion[]>([])
  const [loading, setLoading] = useState(true)

  const loadDetalle = async () => {
    try {
      const [instalacionData, areasData] = await Promise.all([
        instalacionApi.getById(instalacionId),
        instalacionApi.getAreasByInstalacion(instalacionId),
      ])
      setInstalacion(instalacionData)
      setAreas(areasData)
    } catch (error) {
      console.error('Error al cargar detalle:', error)
    } finally {
      setLoading(false)
    }
  }

  useFocusEffect(
    useCallback(() => {
      loadDetalle()
    }, [instalacionId])
  )

  const handleCrearArea = () => {
    if (instalacion) {
      navigation.navigate('RegistroArea', {
        instalacionId,
        instalacionNombre: instalacion.nombre_instalacion,
      })
    }
  }

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Cargando información...</Text>
      </View>
    )
  }

  if (!instalacion) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="alert-circle-outline" size={80} color="#ccc" />
        <Text style={styles.errorText}>No se encontró la instalación</Text>
      </View>
    )
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Foto de portada */}
      <View style={styles.headerImage}>
        {instalacion.foto ? (
          <Image source={{ uri: instalacion.foto }} style={styles.image} />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Ionicons name="business-outline" size={60} color="#999" />
          </View>
        )}
      </View>

      {/* Información principal */}
      <View style={styles.content}>
        <Text style={styles.title}>{instalacion.nombre_instalacion}</Text>

        {/* Badge de estado */}
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: instalacion.activa ? '#4CAF50' : '#9E9E9E' },
          ]}
        >
          <Text style={styles.statusText}>
            {instalacion.activa ? 'Activa' : 'Inactiva'}
          </Text>
        </View>

        {/* Ubicación */}
        <View style={styles.infoSection}>
          <View style={styles.sectionHeader}>
            <Ionicons name="location-outline" size={20} color="#007AFF" />
            <Text style={styles.sectionTitle}>Ubicación</Text>
          </View>
          <Text style={styles.infoText}>
            {instalacion.ubicacion?.direccion || 'No especificada'}
          </Text>
        </View>

        {/* Responsable */}
        <View style={styles.infoSection}>
          <View style={styles.sectionHeader}>
            <Ionicons name="shield-outline" size={20} color="#007AFF" />
            <Text style={styles.sectionTitle}>Responsable</Text>
          </View>
          <Text style={styles.infoText}>{instalacion.responsable}</Text>
        </View>

        {/* Descripción */}
        {instalacion.descripcion && (
          <View style={styles.infoSection}>
            <View style={styles.sectionHeader}>
              <Ionicons name="document-text-outline" size={20} color="#007AFF" />
              <Text style={styles.sectionTitle}>Descripción</Text>
            </View>
            <Text style={styles.infoText}>{instalacion.descripcion}</Text>
          </View>
        )}

        {/* Registrador */}
        <View style={styles.infoSection}>
          <View style={styles.sectionHeader}>
            <Ionicons name="person-outline" size={20} color="#007AFF" />
            <Text style={styles.sectionTitle}>Registrado por</Text>
          </View>
          <Text style={styles.infoText}>{instalacion.nombre_registrador}</Text>
        </View>

        {/* Áreas registradas */}
        <View style={styles.infoSection}>
          <View style={styles.sectionHeaderWithAction}>
            <View style={styles.sectionHeader}>
              <Ionicons name="layers-outline" size={20} color="#007AFF" />
              <Text style={styles.sectionTitle}>Áreas ({areas.length})</Text>
            </View>
            <TouchableOpacity
              style={styles.addAreaButton}
              onPress={handleCrearArea}
            >
              <Ionicons name="add-circle" size={20} color="#007AFF" />
            </TouchableOpacity>
          </View>

          {areas.length === 0 ? (
            <View style={styles.emptyAreas}>
              <Ionicons name="layers-outline" size={40} color="#ccc" />
              <Text style={styles.emptyAreasText}>
                No hay áreas registradas
              </Text>
              <TouchableOpacity
                style={styles.createAreaButton}
                onPress={handleCrearArea}
              >
                <Text style={styles.createAreaButtonText}>Crear Área</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.areasList}>
              {areas.map((area) => (
                <View key={area._id} style={styles.areaItem}>
                  <Ionicons
                    name="chevron-forward-outline"
                    size={20}
                    color="#999"
                  />
                  <View style={styles.areaContent}>
                    <Text style={styles.areaName}>{area.nombre_area}</Text>
                    {area.descripcion && (
                      <Text style={styles.areaDescription} numberOfLines={2}>
                        {area.descripcion}
                      </Text>
                    )}
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Botón de crear área */}
        <TouchableOpacity
          style={styles.mainCreateAreaButton}
          onPress={handleCrearArea}
        >
          <Ionicons name="add-circle-outline" size={24} color="#fff" />
          <Text style={styles.mainCreateAreaButtonText}>
            Nueva Área en {instalacion.nombre_instalacion}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
    fontSize: 16,
  },
  errorText: {
    marginTop: 10,
    color: '#f44336',
    fontSize: 16,
  },
  headerImage: {
    height: 200,
    backgroundColor: '#e0e0e0',
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
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 20,
  },
  statusText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  infoSection: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  sectionHeaderWithAction: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  infoText: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    paddingLeft: 28,
  },
  addAreaButton: {
    padding: 8,
  },
  emptyAreas: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderStyle: 'dashed',
  },
  emptyAreasText: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
  },
  createAreaButton: {
    marginTop: 12,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#f0f8ff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#007AFF',
    borderStyle: 'dashed',
  },
  createAreaButtonText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '600',
  },
  areasList: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  areaItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    gap: 12,
  },
  areaContent: {
    flex: 1,
  },
  areaName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  areaDescription: {
    fontSize: 14,
    color: '#888',
    lineHeight: 20,
  },
  mainCreateAreaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
    marginTop: 20,
  },
  mainCreateAreaButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
})
