import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { TicketStackParamList } from '../types'
import { TicketHomeScreen } from '../screens'

const Stack = createNativeStackNavigator<TicketStackParamList>()

export default function TicketNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="TicketHome"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="TicketHome" component={TicketHomeScreen} />
      
      {/* TODO: Agregar screens cuando se implementen */}
      {/* 
      <Stack.Screen name="CrearTicket" component={CrearTicketScreen} />
      <Stack.Screen name="MisTickets" component={MisTicketsScreen} />
      <Stack.Screen name="TodosTickets" component={TodosTicketsScreen} />
      <Stack.Screen name="ReportesTickets" component={ReportesTicketsScreen} />
      <Stack.Screen name="DetalleTicket" component={DetalleTicketScreen} />
      <Stack.Screen name="EditarTicket" component={EditarTicketScreen} />
      */}
    </Stack.Navigator>
  )
}
