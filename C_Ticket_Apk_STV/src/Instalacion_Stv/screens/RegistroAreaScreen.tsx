import React from 'react'
import { View, StyleSheet } from 'react-native'
import { RegistroAreaForm } from '../components'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import type { InstalacionStackParamList } from '../../types'

type NavigationProp = NativeStackNavigationProp<InstalacionStackParamList>

interface Props {
  navigation: NavigationProp
  route: {
    params: {
      instalacionId: string
      instalacionNombre: string
    }
  }
}

export function RegistroAreaScreen({ navigation, route }: Props) {
  const { instalacionId, instalacionNombre } = route.params

  const handleSuccess = () => {
    navigation.goBack()
  }

  const handleCancel = () => {
    navigation.goBack()
  }

  return (
    <View style={styles.container}>
      <RegistroAreaForm
        instalacionId={instalacionId}
        instalacionNombre={instalacionNombre}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
})
