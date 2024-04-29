import { Button, Text, View, Image, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import React from 'react';
import Animated, { useAnimatedStyle, withRepeat, interpolate, useSharedValue, withTiming } from 'react-native-reanimated';


const Welcome = ({ navigation }) => {

    // Animated rotation
    const rotation = useSharedValue(0);
    const scale = useSharedValue(0.1);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ rotate: `${rotation.value}deg` }, { scale: scale.value }]
        };
    });

    React.useEffect(() => {
        rotation.value = withRepeat(withTiming(360, { duration: 2000 }), -1, true);
        scale.value = withTiming(1, { duration: 3000 });
        setTimeout(() => {
            rotation.value = 0;
        }, 2500);
    }, []);

    return (

        <SafeAreaView style={{ flex: 1, backgroundColor: '#FFC786' }}>
            <View style={{flex: 1}}>
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <Animated.Image
                    source={require("../assets/images/foodRecipeAppLogo.png")}
                    style={[{
                        height: 360,
                        width: 360,
                        // position: "absolute",
                        top: 80,
                        // marginLeft: 25,
                        marginBottom: 20,
                    }, animatedStyle]}
                />
            </View>
            <View style={{ flex: 1, paddingHorizontal: 22 }}>

                <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{
                        fontSize: 30,
                        fontWeight: 600,
                        color: "#012636",
                        textAlign: "center",
                        paddingBottom: 25
                    }}
                    >
                        Welcome to our app!
                    </Text>
                    <Text style={{
                        fontSize: 18,
                        color: "#012636",
                        textAlign: "center",
                        paddingBottom: 25
                    }}
                    >
                        In this app you can find many different recipes, save your favorite ones, use the shopping list feature to help with shopping, and even add your own recipes!
                    </Text>
                    <View>
                        <TouchableOpacity
                            style={{
                                backgroundColor: "#007AFF",
                                padding: 10,
                                borderRadius: 5,
                                width: '100%',
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                            onPress={() => navigation.navigate('RegistrationAndLogin')}
                        >
                            <Text style={{
                                color: "#FFF",
                                fontSize: 16,
                                textAlign: "center",
                            }}
                            >
                                Get started
                            </Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
            </View>
        </SafeAreaView>
    );
}

export default Welcome