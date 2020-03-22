import * as React from 'react';
import { StyleSheet, View, Text, TextInput, SafeAreaView, ScrollView, Alert } from 'react-native';
import { ScreenCont } from '../assets/Styles';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Colors } from '../assets/Colors';
import { Fonts } from '../assets/Fonts';
import { IndicesStack } from '../../App';
import { CheckBox } from 'react-native-elements'
//import { ScreenCont } from '../assets/Styles';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { PermissionsAndroid } from 'react-native';
import LocalStorage from '../utils/LocalStorageNativeModule';
import Geolocation from '@react-native-community/geolocation';

export default class SignUpScreen extends React.Component {

    constructor({ navigation, route }) {
        super();
        this.navigation = navigation;//contem funções que controlam o navigation drawer
        this.route = route;//contem informações da rota (tela aberta)
        this.state = {
            name: "",
            email: "",
            password: "",
            telephone: "",
            role: 0,
            longitude: -22,
            latitude: -44,
            termsAccepted: false
        }
        this.tryingLocation = 0;
    }

    async requestLocationPermission() {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                    title: 'Delivery Help',
                    message:
                        'Delivery Help needs temporary access to your location ' +
                        'so volunteers and people in need find each other.',
                    buttonNegative: 'Cancel',
                    buttonPositive: 'OK',
                },
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                console.log('You can use location');
                LocalStorage.setString('gps_granted', "true");
                this.tryingLocation = 0;
                this.getGPSLocation();
            } else {
                console.log('Location permission denied');
                LocalStorage.setString('gps_granted', "false");
            }
        } catch (err) {
            console.warn(err);
        }
    }

    btnSignIn = () => {

    }

    optChecked = (type) => {
        this.setState({ role: type });
    }

    btnLocateMe = () => {
        LocalStorage.getString(
            'gps_granted',
            "",
            (error, values) => {
                if (values == "") {
                    console.log("location pending");
                    this.requestLocationPermission();
                } else if (values == "true") {
                    console.log("location authorized");
                    this.tryingLocation = 0;
                    this.getGPSLocation();
                } else {
                    //this.requestLocationPermission();
                    this.callAlert("Location services need to be authorized to get your location");
                }

            }
        )

        //this.setState({ latitude: '22', longitude: '44' });
    }

    getGPSLocation() {
        let options = {
            timeout: 3000,
            enableHighAccuracy: true,
            maximumAge: 5000
        }
        this.locationsArr = [];
        this.tryingLocation++;
        console.log('tryingLocation:', this.tryingLocation);
        Geolocation.getCurrentPosition(
            (sucess) => {
                console.log(sucess);
                if (sucess.coords != null) {
                    this.setState({
                        latitude: sucess.coords.latitude,
                        longitude: sucess.coords.longitude
                    });

                    this.callAlert("Location obtained");
                } else if (this.tryingLocation < 3) {
                    this.getGPSLocation();

                } else {
                    this.callAlert("Location unavaliable");
                    this.setState({
                        latitude: "",
                        longitude: ""
                    });
                }
            },
            (error) => {
                console.log('error', error);
                if (this.tryingLocation < 3) {
                    this.getGPSLocation();
                } else {
                    this.callAlert("Location unavaliable");
                    this.setState({
                        latitude: "",
                        longitude: ""
                    });
                }
            },
            options
        );
    }

    componentWillUnmount() {
        //Geolocation.clearWatch(this.watchID);
    }

    btnSignUp = () => {
        if (this.state.name == "") {
            this.callAlert("Type your name");
        } else if (this.state.email == "") {
            this.callAlert("Type your e-mail");
        } else if (this.state.password == "") {
            this.callAlert("Type your password");
        } else if (this.state.telephone == "") {
            this.callAlert("Type your phone number");
        } else if (this.state.latitude == "" || this.state.longitude == "") {
            this.callAlert("Press the Locate Me button");
        } else if (this.state.termsAccepted == false) {
            this.callAlert("You have to accept the terms of use.");
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
                    console.error(error);
                    this.callAlert(error.message);
                    LocalStorage.setString('access_token', "");
                    LocalStorage.setString('email', "");
                    LocalStorage.setString('refresh_token', "");
                }
            );
        }
    }

    /*
     {
         "access_token": "-..kWgtmP6QD3O4hisWA9lPHFVB0rHxQh5mdG1urFonKaE", 
        "email": "Teste", 
        "refresh_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..MeQi2jaFApSxmcmriiANfVAShG4dpj98zXBMBg7mdug"}
    */

    async postRequest(onDataReceived, onError) {

        let endpoint = "https://delivery-help.herokuapp.com/signup";

        try {

            let bodyStr = JSON.stringify({
                name: this.state.name,
                email: this.state.email,
                password: this.state.password,
                longitude: this.state.longitude.toString().substr(0,9),
                latitude: this.state.latitude.toString().substr(0,9),
                telephone: this.state.telephone,
                role: this.state.role,
            });

            console.log("bodyStr:",bodyStr);
            let response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: bodyStr,
            });

            
            let responseText = await response.text();

            console.log('responseText:',responseText);

            let responseJson = JSON.parse(responseText);

            onDataReceived(responseJson);

        } catch (error) {
            onError(error);
        }

    }

    callAlert(message) {
        // Works on both Android and iOS
        Alert.alert(
            'Delivery Help',
            message,
            [
                { text: 'OK', onPress: () => console.log('OK Pressed') },
            ],
            { cancelable: false }
        )
    }

    render() {
        return (
            <SafeAreaView style={ScreenCont.safeArea}>
                <View style={ScreenCont.container}>
                    {/* Aqui entra o conteudo*/}
                    <ScrollView>
                        <View style={SignUpStyle.container}>
                            <View style={SignUpStyle.top_view}>
                                <Text style={SignUpStyle.logomarca}>Delivery Help</Text>
                            </View>
                            <View style={SignUpStyle.account_type}>
                                <Text style={SignUpStyle.form_title}>Type of Account</Text>
                                <View style={SignUpStyle.type_options_cont}>
                                    <View style={SignUpStyle.type_options}>
                                        <CheckBox
                                            title='Volunteer'
                                            containerStyle={SignUpStyle.type_options_bg}
                                            checked={this.state.role == 0}
                                            checkedIcon='dot-circle-o'
                                            uncheckedIcon='circle-o'
                                            checkedColor={Colors.white}
                                            uncheckedColor={Colors.white}
                                            textStyle={{ fontFamily: Fonts.openSansRegular, color: Colors.white }}
                                            onPress={() => this.optChecked(0)}
                                        />
                                    </View>
                                    <View style={SignUpStyle.type_options}>
                                        <CheckBox
                                            title='Needing Help'
                                            containerStyle={SignUpStyle.type_options_bg}
                                            checked={this.state.role == 1}
                                            checkedIcon='dot-circle-o'
                                            uncheckedIcon='circle-o'
                                            checkedColor={Colors.white}
                                            uncheckedColor={Colors.white}
                                            textStyle={{ fontFamily: Fonts.openSansRegular, color: Colors.white }}
                                            onPress={() => this.optChecked(1)}
                                        />
                                    </View>
                                </View>
                            </View>
                            <View style={SignUpStyle.login}>
                                <Text style={SignUpStyle.form_title}>Personal Data</Text>
                                <TextInput
                                    style={SignUpStyle.text}
                                    placeholder={"Name"}
                                    onChangeText={text => this.setState({ name: text })}
                                />
                                <TextInput
                                    style={SignUpStyle.text}
                                    placeholder={"E-mail"}
                                    onChangeText={text => this.setState({ email: text })}
                                />
                                <TextInput
                                    style={SignUpStyle.text}
                                    placeholder={"Password"}
                                    onChangeText={text => this.setState({ password: text })} />
                                <TextInput
                                    style={SignUpStyle.text}
                                    placeholder={"Phone Number"}
                                    onChangeText={text => this.setState({ telephone: text })}
                                />
                                <TouchableOpacity onPress={() => this.btnLocateMe()}>
                                    <View style={SignUpStyle.signin}>
                                        <Text style={SignUpStyle.button_text}>LOCATE ME</Text>
                                    </View>
                                </TouchableOpacity>
                                <View style={SignUpStyle.map_container}>
                                    <MapView
                                        provider={PROVIDER_GOOGLE} // remove if not using Google Maps
                                        style={SignUpStyle.map}
                                        region={{
                                            latitude: this.state.latitude,
                                            longitude: this.state.longitude,
                                            latitudeDelta: 0.0922,
                                            longitudeDelta: 0.0421,
                                        }}
                                    >
                                    </MapView>
                                </View>

                            </View>

                            <View style={[SignUpStyle.login, { marginTop: 16 }]}>
                                <View style={SignUpStyle.type_options}>
                                    <CheckBox
                                        title="I Accept the Terms of Use"
                                        containerStyle={SignUpStyle.type_options_bg}
                                        checked={this.state.termsAccepted}
                                        checkedColor={Colors.white}
                                        uncheckedColor={Colors.white}
                                        textStyle={{ fontFamily: Fonts.openSansRegular, color: Colors.white }}
                                        onPress={() => this.setState({ termsAccepted: !this.state.termsAccepted })}
                                    />
                                </View>
                                <TouchableOpacity onPress={() => this.btnSignUp()}>
                                    <View style={SignUpStyle.signin}>
                                        <Text style={SignUpStyle.button_text}>SIGN UP</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </ScrollView>
                    {/* Aqui termina o conteudo*/}
                </View>
            </SafeAreaView>
        );
    }
}

const SignUpStyle = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        justifyContent: 'flex-start',
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
        flexDirection: 'column',
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
    },
    logomarca: {
        marginVertical: 16,
        fontSize: 20,
        fontFamily: Fonts.openSansBold,
        fontSize: 36,
        color: Colors.white
    },
    account_type: {
        width: '80%',
        flexDirection: 'column',
        alignSelf: 'center'
    },
    form_title: {
        fontFamily: Fonts.openSansBold,
        color: Colors.white,
        fontSize: 18,
        marginVertical: 8
    },
    type_options_cont: {
        flexDirection: 'row',
        backgroundColor: Colors.transparent
    },
    type_options: {
        marginHorizontal: -10,
        marginTop: -10,
        marginBottom: -10,
        padding: 0,
    },
    type_options_bg: {
        backgroundColor: Colors.transparent,
        borderColor: Colors.transparent,
        paddingStart: 0
    },
    map_container: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.buttomSecondaryBackground,
        borderColor: Colors.white,
        borderWidth: 1,
        borderRadius: 0,
        marginBottom: 8,
    },
    map: {
        width: '100%',
        height: 100,
        borderRadius: 25
    },
    priorities: {
        width: '80%',
        flexDirection: 'column',
        alignSelf: 'center',
        marginTop: 16
    }
});