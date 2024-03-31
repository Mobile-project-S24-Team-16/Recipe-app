import { View, Text } from 'react-native'
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

const Home = () => {

    const Tab = createBottomTabNavigator();

    return (

        <View style={{ flex: 1, backgroundColor: '#FEFADF' }}>

            <Tab.Navigator>
                
            </Tab.Navigator>

        </View>

    );

}

export default Home