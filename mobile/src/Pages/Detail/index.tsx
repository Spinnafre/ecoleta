import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Image, SafeAreaView, Linking,TextInput } from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'
// Feather é um dosvário pacotes de vector-icons
import { Feather as Icon, FontAwesome } from '@expo/vector-icons'
import { SvgUri } from 'react-native-svg'
import { RectButton } from 'react-native-gesture-handler'

import api from '../../services/api'
import * as MailComposer from 'expo-mail-composer';

interface Point {
    point_id: number
}
interface Data {
    point: {
        image: string,
        image_url: string,
        name: string,
        email: string,
        whatsapp: string,
        city: string,
        uf: string
    }, items: {
        title: string
    }[]

}

const Detail = () => {
    const [Data, setData] = useState<Data>({} as Data)
    const navigation = useNavigation()

    const route = useRoute()

    // Permite especeificar que route params possui um atributo number chamado point_id
    const RouteParams = route.params as Point

    useEffect(() => {
        api.get(`points/${RouteParams.point_id}`)
            .then(resp => {
                setData(resp.data)
            })
    }, [])

    const handleNavigate = () => {
        navigation.goBack()
    }
    function handleComposeMail(){
        MailComposer.composeAsync({
            subject:'Interesse na coleta de resíduos',
            recipients:[Data.point.email]
        })
    }
    function handleComposeWhatsapp() {
        Linking.openURL(`whatsapp://send?phone?phone=${Data.point.whatsapp}&text=Tenho interesse em coleta de resíduos`)
    }

    if (!Data.point) {
        return null
    }
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.container}>

                <TouchableOpacity onPress={handleNavigate}>
                    <Icon name="arrow-left" size={24} color="#34cb79" />
                </TouchableOpacity>

                <Image style={styles.pointImage} source={{ uri: Data.point.image_url }} />
                <Text style={styles.pointName}>{Data.point.name}</Text>
                <Text style={styles.pointItems}>{Data.items.map(items=>items.title).join(', ')}</Text>

                <View style={styles.address}>
                    <Text style={styles.addressTitle}> Endereço</Text>
                    <Text style={styles.addressContent}> {Data.point.city},{Data.point.uf}</Text>
                </View>

            </View>
            <View style={styles.footer}>
                <RectButton style={styles.button} onPress={handleComposeWhatsapp}>
                    <FontAwesome name="whatsapp" size={20} color="#eee" />
                    <Text style={styles.buttonText}>Whatsapp</Text>
                </RectButton>

                <RectButton style={styles.button} onPress={handleComposeMail}>
                    <Icon name="mail" size={20} color="#eee" />
                    <Text style={styles.buttonText}>E-mail</Text>
                </RectButton>

            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 32,
        paddingTop: 32,
    },

    pointImage: {
        width: '100%',
        height: 120,
        resizeMode: 'cover',
        borderRadius: 10,
        marginTop: 32,
    },

    pointName: {
        color: '#322153',
        fontSize: 28,
        fontFamily: 'Ubuntu_700Bold',
        marginTop: 24,
    },

    pointItems: {
        fontFamily: 'Roboto_400Regular',
        fontSize: 16,
        lineHeight: 24,
        marginTop: 8,
        color: '#6C6C80'
    },

    address: {
        marginTop: 32,
    },

    addressTitle: {
        color: '#322153',
        fontFamily: 'Roboto_500Medium',
        fontSize: 16,
    },

    addressContent: {
        fontFamily: 'Roboto_400Regular',
        lineHeight: 24,
        marginTop: 8,
        color: '#6C6C80'
    },

    footer: {
        borderTopWidth: StyleSheet.hairlineWidth,
        borderColor: '#999',
        paddingVertical: 20,
        paddingHorizontal: 32,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },

    button: {
        width: '48%',
        backgroundColor: '#34CB79',
        borderRadius: 10,
        height: 50,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },

    buttonText: {
        marginLeft: 8,
        color: '#FFF',
        fontSize: 16,
        fontFamily: 'Roboto_500Medium',
    },
});

export default Detail