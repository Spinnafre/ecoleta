import React from 'react';
import { StyleSheet, Text, View, Dimensions, StatusBar } from 'react-native';
import Home from './src/Pages/Home'
import {AppLoading} from 'expo'
import {Roboto_400Regular,Roboto_500Medium} from'@expo-google-fonts/roboto'
import {Ubuntu_700Bold,useFonts} from '@expo-google-fonts/ubuntu'
import {useNavigation} from '@react-navigation/native'

const width = Dimensions.get('window').width

import Routes from './Routes'

export default function App() {
  
  // Fonts fontsLoad é usado para carregar fontes do Google
  const [fontsLoad]=useFonts({
    Roboto_400Regular,
    Roboto_500Medium,
    Ubuntu_700Bold
  })

  
  //App loading dá o efeito de carregamento
  if(!fontsLoad){
    return <AppLoading/>
  }
  
  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="transparent"  translucent/>
      <Routes />
    </>
  );
}
// Todos os elementos são Display Flex por padrão
// Não tem como estilizar com herança