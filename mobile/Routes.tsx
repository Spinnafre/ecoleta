import React from 'react'

import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'

import Home from './src/Pages/Home/index'
import Point from './src/Pages/Point'
import Detail from './src/Pages/Detail'



const Stack = createStackNavigator();

function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator headerMode="none" screenOptions={{ cardStyle: { backgroundColor: '#fff' } }}>
                <Stack.Screen name="Home" component={Home} />
                <Stack.Screen name="Point" component={Point} />
                <Stack.Screen name="Detail" component={Detail} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}


export default App;
