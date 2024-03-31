import { Button, Text, View, Image } from 'react-native';
import React from 'react';

const Welcome = ({ navigation }) => {

    return (

        <View style={{ flex: 1, backgroundColor: '#FEFADF' }}>

            <View>

                <Image
                    source={require("../assets/images/foodRecipeAppLogo.jpeg")}
                    style={{
                        height: 360,
                        width: 360,
                        position: "absolute",
                        top: 150,
                    }}
                />

            </View>

            <View style={{
                paddingHorizontal: 22,
                position: "absolute",
                top: 500,
                width: "100%",
                justifyContent: "center",
                alignItems: "center",
            }}>
                <Text style={{
                    fontSize: 30,
                    fontWeight: 600,
                    color: "#012636",
                    textAlign: "center",
                }}
                >
                    Welcome to our app!
                </Text>

                <View>
                    <Button
                        title="Get Started"
                        onPress={() => navigation.navigate("Home")}
                        style={{
                            marginTop: 22,
                            width: "100%",
                        }}
                    />
                </View>

            </View>

        </View>
    );
}

export default Welcome