import React, { useState, useEffect,ChangeEvent, SyntheticEvent } from 'react'
import { View, StyleSheet, Image, Text, ImageBackground, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native'
import { RectButton, TextInput } from 'react-native-gesture-handler'
import { Feather as Icon } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import RNPickerSelect from 'react-native-picker-select';
import axios from 'axios'


interface IBGEresponse {
  sigla: string
}
interface IBGEnomeResponse {
  nome: string
}

const Home = () => {
  const [cities, setCities] = useState<string[]>([])
  const [ufs, setUfs] = useState<string[]>([])
  const [selectedUF, setSelectedUF] = useState('0')
  const [selectedCity, setSelectedCity] = useState('0')

  useEffect(() => {
    axios.get<IBGEresponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados').then(uf => {
      const datesUF = uf.data.map(ufs => ufs.sigla)
      setUfs(datesUF)
    })
  }, []);

  useEffect(() => {
    if (selectedUF == '0') {
      return
    }

    axios.get<IBGEnomeResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUF}/municipios`)
      .then(resp => {
        const datesCities = resp.data.map(cities => cities.nome)
        setCities(datesCities)
      })
  }, [selectedUF]);


  const navigation = useNavigation()
  const HandleNavigation = () => {
    navigation.navigate('Point', { selectedUF, selectedCity })

  }
  const ufS = {
    label: 'Selecione o estado...',
    value: '0',
    color: '#9EA0A4',
  };
  const cityS = {
    label: 'Selecione a cidade...',
    value: '0',
    color: '#9EA0A4',
  };


  function handleSelectUf(event: string) {
    // console.log('UF SELECIONADA',event)
    setSelectedUF(event)
  }

  function handleSelectedCity(event: string) {
    // console.log('city SELECIONADA',event)
    setSelectedCity(event)
  }


  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView style={{ flex: 1 }} >
        <ImageBackground source={require('../../../assets/home-background.png')} style={styles.container} imageStyle={{ width: 274, height: 368 }}>
          <View style={styles.main}>
            <Image source={require('../../../assets/logo.png')}></Image>

            <Text style={styles.title}>Seu marcketplace de coletas resíduos.</Text>
            <Text style={styles.description}>Ajudamos pessoas a encontrarem pontos de coletas de forma eficiente.</Text>

          </View>

          <View style={styles.footer}>
            {console.log(selectedUF, selectedCity)}
            {/* Vai ficar o Picker Select listando todos os estado e cidades do IBGE */}
            <RNPickerSelect
              placeholder={ufS}
              value={selectedUF}
              onValueChange={ufs => handleSelectUf(ufs)}
              items={ufs.map(ufs=>({label:ufs,value:ufs }))}         

            />
            <RNPickerSelect
              placeholder={cityS}
              value={selectedCity}
              onValueChange={city => handleSelectedCity(city)}
              items={cities.map(city => ({ label: city, value: city }))} 
            />


            <RectButton style={styles.button} onPress={HandleNavigation}>
              <View style={styles.buttonIcon}>
                <Text>
                  <Icon name="arrow-right" color='#FFF' size={24} />
                </Text>
              </View>
              <Text style={styles.buttonText}>Encontrar pontos de coletas</Text>

            </RectButton>
          </View>

        </ImageBackground >

      </KeyboardAvoidingView>
    </SafeAreaView>

  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,

  },

  main: {
    flex: 1,
    justifyContent: 'center',
  },

  title: {
    color: '#322153',
    fontSize: 32,
    fontFamily: 'Ubuntu_700Bold',
    maxWidth: 260,
    marginTop: 64,
  },

  description: {
    color: '#6C6C80',
    fontSize: 18,
    marginTop: 16,
    fontFamily: 'Roboto_500Medium',
    maxWidth: 260,
    lineHeight: 24,
  },

  footer: {},

  select: {},

  input: {
    height: 60,
    backgroundColor: '#eee',
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,

  },

  button: {
    backgroundColor: '#34CB79',
    height: 60,
    flexDirection: 'row',
    borderRadius: 10,
    overflow: 'hidden',
    alignItems: 'center',
    marginTop: 8,

  },

  buttonIcon: {
    height: 60,
    width: 60,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',

  },

  buttonText: {
    flex: 1,
    justifyContent: 'center',
    textAlign: 'center',
    color: '#FFF',
    fontFamily: 'Roboto_500Medium',
    fontSize: 16,
  }
});

export default Home