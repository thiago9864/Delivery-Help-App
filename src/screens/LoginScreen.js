import * as React from 'react';
import { StyleSheet, View, Text, TextInput, SafeAreaView, Alert } from 'react-native';
import { ScreenCont } from '../assets/Styles';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Colors } from '../assets/Colors';
import { Fonts } from '../assets/Fonts';
import { IndicesStack } from '../../App';
//import { ScreenCont } from '../assets/Styles';
import LocalStorage from '../utils/LocalStorageNativeModule';

export default class LoginScreen extends React.Component {

    constructor({ navigation, route }) {
        super();
        this.navigation = navigation;//contem funções que controlam o navigation drawer
        this.route = route;//contem informações da rota (tela aberta)
        this.state = {
            email: "",
            password: ""
        }
    }

    btnSignIn = () => {
        if (this.state.email == "") {
            this.callAlert("Type your e-mail");
        } else if(this.state.password == ""){
            this.callAlert("Type your password");
        } else {
            this.postRequest(
                (response) => {
                    console.log('sucess', response);
                    if (response.access_token != null) {
                        let access_token = response.access_token;
                        let email = response.email;
                        let refresh_token = response.refresh_token;

                        console.log('access_token:',access_token);
                        console.log('email:',email);
                        console.log('refresh_token:', refresh_token);
                        
                        LocalStorage.setString('access_token', access_token);
                        LocalStorage.setString('email', email);
                        LocalStorage.setString('refresh_token', refresh_token);
                        this.navigation.navigate(IndicesStack.HelpBoard);
                    } else {
                        this.callAlert(response.message);
                    }
                },
                (error) => {
                    this.callAlert(error.message);
                }
            );
        }
        console.log(this.state.email, this.state.password);
    }

    callAlert(message){
        // Works on both Android and iOS
        Alert.alert(
            'Delivery Help',
            message,
            [
            {text: 'OK', onPress: () => console.log('OK Pressed')},
            ],
            { cancelable: false }
        )
    }

    btnSignUp = () => {
        this.navigation.navigate(IndicesStack.SignUp);
    }

    async postRequest(onDataReceived, onError) {

        let endpoint = "https://delivery-help.herokuapp.com/login";

        try {

            let response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: this.state.email,
                    password: this.state.password,
                }),
            });

            let responseJson = await response.json();

            
            onDataReceived(responseJson);

        } catch (error) {
            onError(new SigaApiError(error.name, error.message));
        }

    }

    render() {
        return (
            <SafeAreaView style={ScreenCont.safeArea}>
                <View style={ScreenCont.container}>
                    {/* Aqui entra o conteudo*/}
                    <View style={LoginStyle.container}>
                        <View style={LoginStyle.top_view}>
                            <Text style={LoginStyle.logomarca}>Delivery Help</Text>
                        </View>
                        <View style={LoginStyle.login}>
                            <TextInput
                                style={LoginStyle.text}
                                placeholder={"E-mail"}
                                onChangeText={text => this.setState({ email: text })}
                                textContentType='username'
                            />
                            <TextInput
                                style={LoginStyle.text}
                                placeholder={"Password"}
                                onChangeText={text => this.setState({ password: text })}
                                textContentType='password'
                            />
                            <TouchableOpacity onPress={() => this.btnSignIn()}>
                                <View style={LoginStyle.signin}>
                                    <Text style={LoginStyle.button_text}>SIGN IN</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this.btnSignUp()}>
                                <View style={LoginStyle.signup}>
                                    <Text style={LoginStyle.button_signup_text}>SIGN UP</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View style={LoginStyle.top_view} />
                    </View>
                    {/* Aqui termina o conteudo*/}
                </View>
            </SafeAreaView>
        );
    }
}

const LoginStyle = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        flexDirection: 'column',
        backgroundColor: Colors.colorPrimary,
        alignSelf: 'center'
    },
    login: {
        width: '80%',
        flexDirection: 'column',
        alignSelf: 'center'
    },
    signin: {
        width: '100%',
        height: 50,
        flexDirection: 'column',
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.white,
        borderColor: Colors.borderGray,
        borderWidth: 1,
        borderRadius: 25,
        marginBottom: 8,
    },
    signup: {
        width: '100%',
        height: 50,
        flexDirection: 'column',
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.buttomSecondaryBackground,
        borderColor: Colors.white,
        borderWidth: 1,
        borderRadius: 25
    },
    button_text: {
        color: Colors.textButton,
        fontFamily: Fonts.openSansBold,
        fontSize: 14
    },
    button_signup_text: {
        color: Colors.white,
        fontFamily: Fonts.openSansBold,
        fontSize: 14
    },
    text: {
        width: '100%',
        marginBottom: 8,
        height: 50,
        paddingTop: 12,
        paddingStart: 25,
        textAlign: 'left',
        backgroundColor: Colors.white,
        borderColor: Colors.border,
        borderWidth: 2,
        borderRadius: 25,
        fontSize: 16,
        fontFamily: Fonts.openSansRegular
    },
    top_view: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
    },
    logomarca: {
        fontSize: 20,
        fontFamily: Fonts.openSansBold,
        fontSize: 36,
        color: Colors.white
    }
});