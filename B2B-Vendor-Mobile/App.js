import React from 'react';
import { View, StyleSheet } from 'react-native';
import StackNavigator from './navigation/StackNavigator';
import { Provider } from "react-redux";
import store from "./store";
import Toast from 'react-native-toast-message';
import { UserContext } from './UserContext';
import 'react-native-gesture-handler';
import { AuthProvider } from './src/components/AuthToken/AuthContext';

const App = () => {
  return (
    <Provider store={store}>
      <UserContext>
        <View style={styles.container}>
          <AuthProvider>
            <StackNavigator />
            <Toast ref={(ref) => Toast.setRef(ref)} />
          </AuthProvider>
        </View>
      </UserContext>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});

export default App;
