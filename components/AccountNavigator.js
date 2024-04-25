import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Favorites from '../screens/Favorites';
import AddRecipe from '../screens/AddRecipe';
import CreatedRecipes from '../screens/CreatedRecipes';
import { HeartIcon } from 'react-native-heroicons/solid';
import { PlusIcon } from 'react-native-heroicons/solid';
import { ClipboardIcon } from 'react-native-heroicons/solid';

const Tab = createMaterialTopTabNavigator();

const AccountNavigator = () => {
    return (
        <Tab.Navigator
        screenOptions={({ route }) => ({
            tabBarIcon: ({ color, size }) => {
                if (route.name === 'Favorites') {
                    return <HeartIcon size={size} color={color} />;
                } else if (route.name === 'Add Recipe') {
                    return <PlusIcon size={size} color={color} />;
                } else if (route.name === 'My Recipes') {
                    return <ClipboardIcon size={size} color={color} />;
                }
            },
            tabBarActiveTintColor: '#007AFF',
            tabBarInactiveTintColor: 'gray',
            tabBarLabelStyle: { fontSize: 10 },
        })}
        >
            <Tab.Screen 
            name="Favorites"
             component={Favorites}
              />
            <Tab.Screen 
            name="Add Recipe" 
            component={AddRecipe}
             />
            <Tab.Screen 
            name="My Recipes" 
            component={CreatedRecipes} />
        </Tab.Navigator>
    );
}

export default AccountNavigator;