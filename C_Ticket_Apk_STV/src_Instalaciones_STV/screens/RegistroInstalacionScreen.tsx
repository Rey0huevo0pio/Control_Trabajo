import React from 'react'
import { View, StyleSheet } from 'react-native'
import { RegistroInstalacionForm } from '../components'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import type { InstalacionStackParamList } from '@/types'

type NavigationProp = NativeStackNavigationProp<InstalacionStackParamList>

interface Props {
  navigation: NavigationProp
}

export function RegistroInstalacionScreen({ navigation }: Props) {
  const handleSuccess = () => {
    navigation.goBack()
  }

  const handleCancel = () => {
    navigation.goBack()
  }

  return (
    <View style={styles.container}>
      <RegistroInstalacionForm
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
