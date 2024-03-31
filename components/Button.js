import { Text, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";

const Button = (props) => {
    const filledBgColor = props.color || "#012636";
    const outlinedColor = "#ffffff";
    const bgColor = props.filled ? filledBgColor : outlinedColor;
    const textColor = props.filled ? "#ffffff" : "#FEFADF";

    return (
        <TouchableOpacity
            style={{
                ...styles.button,
                ...{ backgroundColor: bgColor },
                ...props.style,
            }}
            onPress={props.onPress}
        >
            <Text style={{ fontSize: 18, ...{ color: textColor } }}>{props.title}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    button: {
        paddingBottom: 16,
        paddingVertical: 10,
        borderColor: "#012636",
        borderWidth: 2,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
    },
})

export default Button