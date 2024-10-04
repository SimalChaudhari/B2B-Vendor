// import { StatusBar } from 'expo-status-bar';
import { View, StyleSheet } from 'react-native';
import StackNavigator from './navigation/StackNavigator';

export default function App() {
  return (
    <View style={styles.container}>
      <StackNavigator />
      {/*  
        <Text>Open up App.js to start working on your app!</Text>
        <StatusBar style="auto" />
      */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // Ensures the content takes the full height of the screen
    backgroundColor: "#fff",
  },
});
