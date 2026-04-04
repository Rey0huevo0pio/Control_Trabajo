import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { ArchiveroStackParamList } from '../types'
import {
  ArchiveroHomeScreen,
  ArchiveroDetalleScreen,
  CrearArchiveroScreen,
  GestionarMiembrosScreen,
  EscanearDocumentoScreen,
  CarpetaDetalleScreen,
} from '../screens'

const Stack = createNativeStackNavigator<ArchiveroStackParamList>()

export default function ArchiveroNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="ArchiveroHome"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="ArchiveroHome" component={ArchiveroHomeScreen} />
      <Stack.Screen name="CrearArchivero" component={CrearArchiveroScreen} />
      <Stack.Screen name="ArchiveroDetalle" component={ArchiveroDetalleScreen} />
      <Stack.Screen name="GestionarMiembros" component={GestionarMiembrosScreen} />
      <Stack.Screen name="EscanearDocumento" component={EscanearDocumentoScreen} />
      <Stack.Screen name="CarpetaDetalle" component={CarpetaDetalleScreen} />
      
      {/* TODO: Agregar screens cuando se implementen */}
      {/*
      <Stack.Screen name="CrearCarpeta" component={CrearCarpetaScreen} />
      <Stack.Screen name="SubirArchivo" component={SubirArchivoScreen} />
      <Stack.Screen name="ArchivoDetalle" component={ArchivoDetalleScreen} />
      <Stack.Screen name="ArchivoPreview" component={ArchivoPreviewScreen} />
      <Stack.Screen name="ConfiguracionArchivero" component={ConfiguracionArchiveroScreen} />
      <Stack.Screen name="ConfiguracionCarpeta" component={ConfiguracionCarpetaScreen} />
      */}
    </Stack.Navigator>
  )
}
