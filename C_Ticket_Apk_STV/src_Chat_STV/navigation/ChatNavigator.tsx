import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { ChatStackParamList } from '../types'
import {
  ChatHomeScreen,
  PrivateChatsScreen,
  GroupChatsScreen,
  EmployeeDirectoryScreen,
  NewsBoardScreen,
  ChatSearchScreen,
  EmailMainScreen,
} from '../screens'

const Stack = createNativeStackNavigator<ChatStackParamList>()

export default function ChatNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="ChatHome"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="ChatHome" component={ChatHomeScreen} />
      <Stack.Screen name="PrivateChats" component={PrivateChatsScreen} />
      <Stack.Screen name="GroupChats" component={GroupChatsScreen} />
      <Stack.Screen name="EmployeeDirectory" component={EmployeeDirectoryScreen} />
      <Stack.Screen name="NewsBoard" component={NewsBoardScreen} />
      <Stack.Screen name="ChatSearch" component={ChatSearchScreen} />
      <Stack.Screen name="EmailMain" component={EmailMainScreen} />
      
      {/* TODO: Agregar screens cuando se implementen */}
      {/*
      <Stack.Screen name="ChatConversation" component={ChatConversationScreen} />
      <Stack.Screen name="NewsDetail" component={NewsDetailScreen} />
      <Stack.Screen name="CreateGroup" component={CreateGroupScreen} />
      <Stack.Screen name="UserProfile" component={UserProfileScreen} />
      */}
    </Stack.Navigator>
  )
}
