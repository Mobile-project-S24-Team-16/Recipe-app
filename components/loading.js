import { View, Text, ActivityIndicator, StyleSheet  } from "react-native";
import React from "react";

const Loading = (props) => {
    return (
        <View style={styles.activityIndicatorWrapper}>
            <ActivityIndicator {...props} />
        </View>
    );
}

const styles = StyleSheet.create({
    activityIndicatorWrapper: {
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center', 
    },

});

export default Loading;