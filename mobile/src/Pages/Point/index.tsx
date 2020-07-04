import React, { useEffect, useState } from 'react'
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Image, Alert } from 'react-native'
import Constants from 'expo-constants'
import { useNavigation,useRoute } from '@react-navigation/native'
import MapView, { Marker } from 'react-native-maps'
import { SvgUri } from 'react-native-svg'
import { Feather as Icon } from '@expo/vector-icons'
import api from '../../services/api'
import * as Location from 'expo-location'


interface Item {
  id: number,
  title: string,
  image_url: string

}
interface Point{
  id:number,
  image:string,
  image_url:string,
  name:string,
  latitude:number,
  longitude: number,

}
 interface Params{
   selectedUF:string,
   selectedCity:string
 }

const Point = () => {
  const routes=useRoute()
  const RouteParams=routes.params as Params

  const [items, setItem] = useState<Item[]>([])
  const [selectedItem, SetSelectedItem] = useState<number[]>([])
  const [points, setPoints] = useState<Point[]>([])
  const [initialPosition, SetinitialPosition] = useState<[number, number]>([0, 0])


  useEffect(() => {
    api.get('items').then(resp => {
      setItem(resp.data)
    })
  }, [])

  useEffect(() => {
    async function loadPosition() {
      const { status } = await Location.requestPermissionsAsync()

      if (status !== 'granted') {
        Alert.alert('Error permissão', 'Não conseguimos pegar a sua localização, por favor ligue o GPS ou permita o restreamento! ;)')
        return
      }
      
      const location = await Location.getCurrentPositionAsync()

      const { latitude, longitude } = location.coords


      
      SetinitialPosition([
        latitude,
        longitude
      ])
      
    }
    loadPosition()
    
  }, [])

  useEffect(()=>{
    api.get('points',{
      params:{
        city: RouteParams.selectedCity,
        uf: RouteParams.selectedUF,
        items:selectedItem
      }
    }).then(resp => setPoints(resp.data))
  },[selectedItem])

  const navigation = useNavigation()


  const handlePage = () => {
    navigation.goBack()
  }
  function handleNavigationDetail (id:number)  {
    navigation.navigate('Detail',{point_id:id})
  }

  function handleSelectItem(id: number) {
    console.log('Item selecionado')
    // FindIndex pega o índice da primeira ocorrência
    const alreadySelected = selectedItem.findIndex(item => item === id)

    // Se tiver items com id repetidos, ou seja, selecionei o mesmo item mais de uma vez
    // Irá filtrar os items com id diferentes do que eu selecionei, sobrando somente
    //os items que eu deixei selecionado
    if (alreadySelected >= 0) {
      const filteredItems = selectedItem.filter(item => item !== id)
      SetSelectedItem(filteredItems)
    } else {

      SetSelectedItem([...selectedItem, id])

    }

  }

  return (
    <>

      <View style={styles.container}>
        {console.log(RouteParams.selectedUF, RouteParams.selectedCity)}
        <TouchableOpacity onPress={handlePage}>
          <Icon name="arrow-left" size={24} color="#34cb79" />
        </TouchableOpacity>

        <Text style={styles.title}>Seja bem vindo</Text>
        <Text style={styles.description}>Encontre no mapa um ponto de coleta</Text>
        <View style={styles.mapContainer}>
          {initialPosition[0]!==0 && (
            <MapView
              style={styles.map}
              loadingEnabled={initialPosition[0] === 0}
              initialRegion={{ latitude: initialPosition[0], longitude: initialPosition[1], latitudeDelta: 0.015, longitudeDelta: 0.015 }} >
              
              {points.map(point=>(
                <Marker key={point.id} coordinate={{ latitude: point.latitude, longitude: point.longitude }} onPress={() => handleNavigationDetail(point.id)}>
                  <View style={styles.mapMarkerContainer}>
                    <Image style={styles.mapMarkerImage} source={{ uri:`http://192.168.1.3:300/uploads/${point.image}`}} />
                    {console.log(point.image)}
                    <Text style={styles.mapMarkerTitle}>{point.name}</Text>
                  </View>
                </Marker>
              ))}
            </MapView>
          )}
        </View>

      </View>

      <View style={styles.itemsContainer}>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20 }}>
          {items.map(item => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.item,
                selectedItem.includes(item.id) ? styles.selectedItem : {}
              ]}
              onPress={() => handleSelectItem(item.id)}
              activeOpacity={0.6}


            >

              <SvgUri width={42} height={42} uri={item.image_url} />
              <Text style={styles.itemTitle}>{item.title}</Text>

            </TouchableOpacity>
          ))}

        </ScrollView>
      </View>

    </>
  )
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: 20 + Constants.statusBarHeight,
  },

  title: {
    fontSize: 20,
    fontFamily: 'Ubuntu_700Bold',
    marginTop: 24,
  },

  description: {
    color: '#6C6C80',
    fontSize: 16,
    marginTop: 4,
    fontFamily: 'Roboto_400Regular',
  },

  mapContainer: {
    flex: 1,
    width: '100%',
    borderRadius: 5,
    overflow: 'hidden',
    marginTop: 16,
  },

  map: {
    width: '100%',
    height: '100%',
  },

  mapMarker: {
    width: 90,
    height: 80,
  },

  mapMarkerContainer: {
    width: 110,
    height: 70,
    backgroundColor: '#34CB79',
    flexDirection: 'column',
    borderRadius: 8,
    overflow: 'hidden',
    alignItems: 'center'
  },

  mapMarkerImage: {
    width: 110,
    height: 45,
    resizeMode: 'cover',
  },

  mapMarkerTitle: {
    flex: 1,
    fontFamily: 'Roboto_400Regular',
    color: '#FFF',
    fontSize: 13,
    lineHeight: 23,
    padding: 0
  },

  itemsContainer: {
    flexDirection: 'row',
    marginTop: 16,
    marginBottom: 32,
  },

  item: {
    backgroundColor: '#fff',
    borderWidth: 3,
    borderColor: '#eee',
    height: 110,
    width: 120,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 16,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'space-between',

    textAlign: 'center',
  },

  selectedItem: {
    borderColor: '#34CB79',
    borderWidth: 2,
  },

  itemTitle: {
    fontFamily: 'Roboto_400Regular',
    textAlign: 'center',
    fontSize: 13,
  },
});

export default Point