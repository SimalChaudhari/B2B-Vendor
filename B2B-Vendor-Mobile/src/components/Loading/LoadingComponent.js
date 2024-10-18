import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

export default function LoadingComponent() {
    return (
        <View>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 20 }}><ActivityIndicator size="large" color="#0000ff" /></View>
        </View>
    )
}

const styles = StyleSheet.create({})