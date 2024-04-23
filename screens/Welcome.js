import { Button, Text, View, Image, SafeAreaView } from 'react-native';
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
            <View>
                <Animated.Image
                     source={require("../assets/images/foodRecipeAppLogo.png")}
                     style={[{
                         height: 360,
                         width: 360,
                         position: "absolute",
                         top: 80,
                         marginLeft: 25,
                     }, animatedStyle]}
                />
            </View>
            <View style={{
                paddingHorizontal: 22,
                position: "absolute",
                top: 450,
                width: "100%",
                justifyContent: "center",
                alignItems: "center",
            }}>
                <Text style={{
                    fontSize: 30,
                    fontWeight: 600,
                    color: "#012636",
                    textAlign: "center",
                    paddingBottom: 50
                }}
                >
                    Welcome to our app!
                </Text>
                <View>
                    <Button
                        title="Get started"
                        onPress={() => navigation.navigate("RegistrationAndLogin")}
                        style={{
                            width: "100%",
                        }}
                    />
                </View>
            </View>
        </SafeAreaView>
    );
}

export default Welcome