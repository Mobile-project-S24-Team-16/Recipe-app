import { Button, Text, View, Image, SafeAreaView } from 'react-native';
import React from 'react';

const Welcome = ({ navigation }) => {

    return (

        <SafeAreaView style={{ flex: 1, backgroundColor: '#FFC786' }}>
            <View>
                <Image
                    source={require("../assets/images/foodRecipeAppLogo.png")}
                    style={{
                        height: 360,
                        width: 360,
                        position: "absolute",
                        top: 80,
                        marginLeft: 25,
                    }}
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