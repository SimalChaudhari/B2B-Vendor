// import { StatusBar } from 'expo-status-bar';
import { View, StyleSheet } from 'react-native';
import StackNavigator from './navigation/StackNavigator';
import { Provider } from "react-redux";
import store from "./store";

export default function App() {
  return (
    <Provider store={store}>
      <View style={styles.container}>
        <StackNavigator />
      </View>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
