import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Welcome, Home } from './screens';
import { NavigationContainer } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';


const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

export default function App() {

  return (

    <NavigationContainer>

      <Stack.Navigator>

        <Stack.Screen
          name="Welcome"
          component={Welcome}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="Home"
          component={HomeStack}
          options={{ headerShown: false }}
        />

      </Stack.Navigator>

    </NavigationContainer>

  );

}

const HomeStack = () => {

  return (

    <Tab.Navigator>

      <Tab.Screen
        name="HomeTab"
        component={Home}
        options={{
          // mahdollisesti väliaikaisesti pois käytöstä
          // headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Icon name="home" color={color} size={size} />
          )
        }}
      />

      {/* Add other tabs here */}

    </Tab.Navigator>

  );

};