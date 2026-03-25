import React, { useState, useCallback } from 'react'
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useFocusEffect } from '@react-navigation/native'
import { InstalacionCard } from '../components'
import { instalacionApi } from '../lib'
import type { Instalacion } from '@/types'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import type { InstalacionStackParamList } from '@/types'

type NavigationProp = NativeStackNavigationProp<InstalacionStackParamList>

interface Props {
  navigation: NavigationProp
}

export function InstalacionesHomeScreen({ navigation }: Props) {
  const [instalaciones, setInstalaciones] = useState<Instalacion[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const loadInstalaciones = async () => {
    try {
      const data = await instalacionApi.getActivas()
      setInstalaciones(data)
    } catch (error) {
      console.error('Error al cargar instalaciones:', error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useFocusEffect(
    useCallback(() => {
      loadInstalaciones()
    }, [])
  )

  const onRefresh = () => {
    setRefreshing(true)
    loadInstalaciones()
  }

  const handleCreateInstalacion = () => {
    navigation.navigate('RegistroInstalacion')
  }

  const handleVerDetalle = (instalacionId: string) => {
    navigation.navigate('DetalleInstalacion', { instalacionId })
  }

  const handleCrearArea = (instalacionId: string, instalacionNombre: string) => {
    navigation.navigate('RegistroArea', {
      instalacionId,
      instalacionNombre,
    })
  }

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Cargando instalaciones...</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Instalaciones</Text>
          <Text style={styles.subtitle}>
            {instalaciones.length} instalación(es) registrada(s)
          </Text>
        </View>
        <TouchableOpacity
          style={styles.addButton}
          onPress={handleCreateInstalacion}
        >
          <Ionicons name="add-circle" size={32} color="#007AFF" />
        </TouchableOpacity>
      </View>

      {/* Lista de instalaciones */}
      {instalaciones.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="business-outline" size={80} color="#ccc" />
          <Text style={styles.emptyTitle}>Sin instalaciones</Text>
          <Text style={styles.emptyText}>
            No hay instalaciones registradas aún.{'\n'}¡Comienza registrando una!
          </Text>
          <TouchableOpacity
            style={styles.emptyButton}
            onPress={handleCreateInstalacion}
          >
            <Ionicons name="add-circle-outline" size={24} color="#007AFF" />
            <Text style={styles.emptyButtonText}>Registrar Instalación</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={instalaciones}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <InstalacionCard
              instalacion={item}
              showCreateArea
              onPress={() => handleVerDetalle(item._id)}
              onCreateArea={() =>
                handleCrearArea(item._id, item.nombre_instalacion)
              }
            />
          )}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#007AFF']}
            />
          }
        />
      )}
    </View>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  addButton: {
    padding: 8,
  },
  listContainer: {
    paddingVertical: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#999',
    marginTop: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#bbb',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 24,
  },
  emptyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#f0f8ff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#007AFF',
    borderStyle: 'dashed',
  },
  emptyButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
})
