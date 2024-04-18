import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Welcome, Home, RegistrationAndLogin, Registration, Login, MyAccount, Settings, RecipeDetails, ResetPassword, ShoppingList } from './screens';
import { NavigationContainer } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';


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
          name="RegistrationAndLogin"
          component={RegistrationAndLogin}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="Registration"
          component={Registration}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="Home"
          component={HomeStack}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="RecipeDetail"
          component={RecipeDetails}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="ShoppingList"
          component={ShoppingList}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="MyAccount"
          component={MyAccount}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="Settings"
          component={Settings}
          options={{ headerShown: true }}
        />

        <Stack.Screen
          name="ResetPassword"
          component={ResetPassword}
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
            <MaterialIcons name="home" color={color} size={size} />
          )
        }}
      />
      <Tab.Screen
        name="Shopping List"
        component={ShoppingList}
        options={{
          // mahdollisesti väliaikaisesti pois käytöstä
          // headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="list-alt" color={color} size={size} />
          )
        }}
      />
      <Tab.Screen
        name="MyAccountTab"
        component={MyAccount}
        options={{
          // mahdollisesti väliaikaisesti pois käytöstä
          // headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="account-circle" color={color} size={size} />
          )
        }}
      />

    </Tab.Navigator>

  );

};