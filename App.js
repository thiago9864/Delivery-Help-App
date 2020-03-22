import React from 'react';

import { Colors } from './src/assets/Colors';
import { Fonts } from './src/assets/Fonts';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import NetInfo from "@react-native-community/netinfo";
import LoginScreen from './src/screens/LoginScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import HelpBoardScreen from './src/screens/HelpBoardScreen';
import LocalStorage from './src/utils/LocalStorageNativeModule';
import { View, Text, StyleSheet } from 'react-native';

const Stack = createStackNavigator();

export var IndicesStack = {
  Login: 'LoginScreen',
  SignUp: 'SignUpScreen',
  HelpBoard: 'HelpBoardScreen'
}

export default class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isSignedIn: false,
      checkLocalStorageComplete: false
    }

    LocalStorage.getString(
      'access_token',
      '',
      (error, values) => {
        console.log('access_token',values);
        if (values != "") {
          this.setState({ checkLocalStorageComplete: true , isSignedIn: true });
        } else {
          this.setState({ checkLocalStorageComplete: true });
        }

      }
    )
  }

  lastStackRouteName = "";
  stackEvent = {
    focus: e => {
      //esse evento dispara quando o foco de cada tela muda, o que 
      //funciona como um 'onRouteChange'
      //console.log(e);
      lastStackRouteName = e.target.substring(0, e.target.indexOf('-'));
    }
  }

  stackOptions = {
    headerTintColor: Colors.white,
    headerStyle: { backgroundColor: Colors.colorPrimary },
    headerShown: false
  }

  stackOptionsWithHeader = {
    headerTintColor: Colors.white,
    headerStyle: { backgroundColor: Colors.colorPrimary }
  }

  componentDidMount() {

    this.netInfoUnsubscribe = NetInfo.addEventListener(state => {
      console.log("Connection type", state.type);
      console.log("Is connected?", state.isConnected);
    });

  }
  componentWillUnmount() {
    this.netInfoUnsubscribe();
  }

  render() {
    if (this.state.checkLocalStorageComplete == false) {
      return (
        <View style={SplashStyle.container}>
          <Text style={SplashStyle.logomarca}>Delivery Help</Text>
        </View>
      )
    }
    let initialRoute = IndicesStack.Login;
    if (this.state.isSignedIn) {
      initialRoute = IndicesStack.HelpBoard;
    }
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName={initialRoute}>
          <Stack.Screen name={IndicesStack.Login} component={LoginScreen} options={this.stackOptions} listeners={this.stackEvent} />
          <Stack.Screen name={IndicesStack.SignUp} component={SignUpScreen} options={this.stackOptions} listeners={this.stackEvent} />
          <Stack.Screen name={IndicesStack.HelpBoard} component={HelpBoardScreen} options={this.stackOptionsWithHeader} listeners={this.stackEvent} />
        </Stack.Navigator>
      </NavigationContainer>
    )
  };
}

const SplashStyle = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    flexDirection: 'column',
    backgroundColor: Colors.colorPrimary,
    alignSelf: 'center'
  },
  logomarca: {
    fontSize: 20,
    fontFamily: Fonts.openSansBold,
    fontSize: 36,
    color: Colors.white,
    textAlign: "center"
  }
});