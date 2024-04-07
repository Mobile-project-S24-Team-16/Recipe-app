import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Favorites from '../screens/Favorites';
import AddRecipe from '../screens/AddRecipe';
import CreatedRecipes from '../screens/CreatedRecipes';

const Tab = createMaterialTopTabNavigator();

const AccountNavigator = () => {
    return (
        <Tab.Navigator>
            <Tab.Screen name="Favorites" component={Favorites} />
            <Tab.Screen name="AddRecipe" component={AddRecipe} />
            <Tab.Screen name="CreatedRecipes" component={CreatedRecipes} />
        </Tab.Navigator>
    );
}

export default AccountNavigator;