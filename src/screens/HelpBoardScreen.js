import * as React from 'react';
import { StyleSheet, View, Text, SafeAreaView, ActivityIndicator, TouchableOpacity, Alert, FlatList } from 'react-native';
import { Images } from '../assets/Images';
import { NavBarStyle, ScreenCont } from '../assets/Styles';
import IconNavbarComponent from '../components/IconNavbarComponent';
import { Colors } from '../assets/Colors';
import { Fonts } from '../assets/Fonts';
import { TextInput } from 'react-native-gesture-handler';
import IconComponent from '../components/IconComponent';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import LocalStorage from '../utils/LocalStorageNativeModule';

export default class HelpBoardScreen extends React.Component {

    constructor({ navigation, route }) {
        super();
        this.navigation = navigation;//contem funções que controlam o navigation drawer
        this.route = route;//contem informações da rota (tela aberta)

        //botão do menu da NavBar
        this.navigation.setOptions({
            headerRight: () => (
                <IconNavbarComponent icon={Images.add} onPress={this.btnAdd} />
            ),
            headerTitle: props => (
                <Text style={NavBarStyle.title}>{"Help Board"}</Text>
            )
        });

        this.state = {
            boardJson: null,
            title: "",
            description: ""
        }

        LocalStorage.getString(
            'access_token',
            '',
            (error, values) => {
                console.log('access_token', values);
                if (values != "") {
                    this.setState({ accessToken: values });
                }

            }
        )

        this.updateBoard();

    }

    updateBoard() {
        this.getRequest(
            (success) => {
                this.setState({ loadStatus: 'success', boardJson: success });
            },
            (error) => {
                console.log('error:', error);
                this.setState({ loadStatus: 'error', boardJson: null });
            }
        )
    }

    async getRequest(onDataReceived, onError) {

        let endpoint = "https://delivery-help.herokuapp.com/helpboard";

        try {
            let response = await fetch(endpoint, {
                method: 'GET'
            });

            let responseText = await response.text();

            console.log('responseText:', responseText);

            let responseJson = JSON.parse(responseText);

            onDataReceived(responseJson);

        } catch (error) {
            onError(error);
        }

    }

    btnAdd = () => {
        this.setState({ openAdd: true });
    }

    btnCancel = () => {
        this.setState({ openAdd: false });
    }

    btnSend = () => {
        if (this.state.title == "") {
            this.callAlert("Type a title to easy identify what you need");
        } else if (this.state.description == "") {
            this.callAlert("Type a more detailed description of what you need");
        } else {
            this.postRequest(
                (response) => {
                    console.log('sucess', response);
                    this.setState({ openAdd: false, loadStatus: '' });
                    this.updateBoard();
                },
                (error) => {
                    this.callAlert(error.message);
                }
            );
        }
    }

    dataAtualFormatada() {
        var data = new Date(),
            dia = data.getDate().toString(),
            diaF = (dia.length == 1) ? '0' + dia : dia,
            mes = (data.getMonth() + 1).toString(), //+1 pois no getMonth Janeiro começa com zero.
            mesF = (mes.length == 1) ? '0' + mes : mes,
            anoF = data.getFullYear(),

            hora = data.getHours().toString(),
            horaF = (hora.length == 1) ? '0' + hora : hora,
            min = data.getMinutes().toString(),
            minF = (min.length == 1) ? '0' + min : min,
            seg = data.getSeconds().toString(),
            segF = (seg.length == 1) ? '0' + seg : seg;

        return diaF + "/" + mesF + "/" + anoF + " " + horaF + ":" + minF + ":" + segF;
    }

    async postRequest(onDataReceived, onError) {

        let endpoint = "https://delivery-help.herokuapp.com/new_help";
        let dateStr = this.dataAtualFormatada();//'%d/%m/%Y %H:%M:%S'

        try {

            let bodyStr = JSON.stringify({
                access_token: this.state.accessToken,
                date: dateStr,
                title: this.state.title,
                description: this.state.description
            });

            console.log("bodyStr:", bodyStr);
            let response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: bodyStr,
            });


            let responseText = await response.text();

            console.log('responseText:', responseText);

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

    btnRecordAudio = () => {
        console.log("Record audio");
    }

    btnItemDirections = (item) => {
        console.log("item:", item);
    }

    btnItemLista = (item) => {
        console.log("item:", item);
    }

    formatDistance(distance){
        let d = Math.round(distance / 100);
        return d/10;
    }

    render() {

        if (this.state.loadStatus == null || this.state.loadStatus == '') {
            return (
                <SafeAreaView style={ScreenCont.safeArea} onLayout={this.onLayout}>
                    <View style={ScreenCont.container}>
                        {/* Aqui entra o conteudo*/}
                        <View style={LoadingStyles.actContainer}>
                            <ActivityIndicator size="large" color="#0000ff" style={LoadingStyles.actIndicator} />
                        </View>
                        {/* Aqui termina o conteudo*/}
                    </View>
                </SafeAreaView>
            );
        }

        let addCard = null;
        if (this.state.openAdd) {
            addCard = <View style={AddCardStyle.container}>
                <View style={AddCardStyle.container_h}>
                    <Text style={AddCardStyle.title}>Ask For Help</Text>
                    <Text style={AddCardStyle.label}>Title</Text>
                    <TextInput
                        style={AddCardStyle.text}
                        onChangeText={text => this.setState({ title: text })}
                    />
                    <Text style={AddCardStyle.label}>Description</Text>
                    <TextInput
                        style={[AddCardStyle.text, { height: 100 }]}
                        onChangeText={text => this.setState({ description: text })}
                    />
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <TouchableOpacity onPress={() => this.btnRecordAudio()}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <IconComponent src={Images.mic} size={30} color={Colors.white} />
                                <Text style={AddCardStyle.label_center}>Record Audio</Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                    <View style={{ flexDirection: 'row', marginTop: 20 }}>
                        <TouchableOpacity onPress={() => this.btnCancel()}>
                            <View style={AddCardStyle.white_btn}>
                                <Text style={AddCardStyle.button_text}>CANCEL</Text>
                            </View>
                        </TouchableOpacity>
                        <View style={{ flex: 1 }} />
                        <TouchableOpacity onPress={() => this.btnSend()}>
                            <View style={AddCardStyle.white_btn}>
                                <Text style={AddCardStyle.button_text}>SEND</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        }
        
                if (this.state.loadStatus == 'error') {
                    return (
                        <SafeAreaView style={ScreenCont.safeArea} onLayout={this.onLayout}>
                            <View style={ScreenCont.container}>
                                
                                <View style={LoadingStyles.actContainer}>
                                    <Text style={LoadingStyles.no_cards}>No help request found.</Text>
                                </View>
                                {addCard}
                                
                            </View>
                        </SafeAreaView>
                    );
                }
        /*
        this.state.boardJson = [
            {
                'id_needy': 1,
                'distance': 3000,
                'description': 'testeasdfasdfasdfsadfasdfsadfasdfasdfsdafdsfadsf',
                'status': 1
            },
            {
                'id_needy': 2,
                'distance': 4523,
                'description': 'testeasdfasdfasdfsadfasdfsadfasdfasdfsdafdsfadsf',
                'status': 1
            },
            {
                'id_needy': 3,
                'distance': 325,
                'description': 'testeasdfasdfasdfsadfasdfsadfasdfasdfsdafdsfadsf',
                'status': 1
            }
        ];
*/
        return (
            <SafeAreaView style={ScreenCont.safeArea}>
                <View style={ScreenCont.container}>
                    {/* Aqui entra o conteudo*/}
                    <FlatList
                        data={this.state.boardJson}
                        keyExtractor={item => item.id_needy.toString()}
                        style={MainStyles.lista}
                        horizontal={false}
                        renderItem={({ item }) => (
                            ///
                            <View style={ItemStyles.container}>
                                <Text style={ItemStyles.name}>Jane Doe, {this.formatDistance(item.distance)}km</Text>
                                <Text style={ItemStyles.title}>Title</Text>
                                <Text style={ItemStyles.description}>{item.description}</Text>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <TouchableOpacity onPress={() => this.btnItemDirections(item)}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <IconComponent src={Images.location} size={25} color={Colors.white} />
                                            <Text style={AddCardStyle.label_center}>Directions</Text>
                                        </View>
                                    </TouchableOpacity>
                                    <View style={{ flex: 1 }} />
                                    <TouchableOpacity onPress={() => this.btnItemLista(item)}>
                                        <View style={AddCardStyle.white_btn}>
                                            <Text style={AddCardStyle.button_text}>OFFER HELP</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            ///
                        )}
                    />
                    {addCard}
                    {/* Aqui termina o conteudo*/}
                </View>
            </SafeAreaView>
        );
    }
}

const MainStyles = StyleSheet.create({
    lista: {
        flex: 1,
        marginTop: 8,
    }
});

const ItemStyles = StyleSheet.create({
    container: {
        flex: 1,
        position: 'relative',
        marginHorizontal: 8,
        marginBottom: 8,
        flexDirection: 'column',
        alignSelf: 'center',
        backgroundColor: Colors.colorPrimary,
        borderWidth: 1,
        borderColor: Colors.white,
        borderRadius: 10,
        padding: 12
    },
    name: {
        fontFamily: Fonts.openSansRegular,
        fontSize: 14,
        color: Colors.white
    },
    title: {
        fontFamily: Fonts.openSansBold,
        fontSize: 16,
        color: Colors.white
    },
    description: {
        fontFamily: Fonts.openSansRegular,
        fontSize: 14,
        color: Colors.white,
        marginVertical: 8
    }
});

const LoadingStyles = StyleSheet.create({
    actContainer: {
        flex: 1,
        justifyContent: 'center',
        alignContent: 'center'
    },
    actIndicator: {
        alignSelf: 'center'
    },
    no_cards: {
        fontFamily: Fonts.openSansRegular,
        fontSize: 16,
        color: Colors.textButton,
        alignSelf: 'center'
    }
});

const AddCardStyle = StyleSheet.create({
    container: {
        position: 'absolute',
        width: '100%',
        flexDirection: 'column',
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.ligthboxBackground,
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
    },
    container_h: {
        position: 'relative',
        width: '90%',
        flexDirection: 'column',
        backgroundColor: Colors.colorPrimary,
        borderWidth: 1,
        borderColor: Colors.white,
        borderRadius: 10,
        padding: 12
    },
    white_btn: {
        width: 123,
        height: 30,
        flexDirection: 'column',
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.white,
        borderColor: Colors.borderGray,
        borderWidth: 1,
        borderRadius: 25
    },
    button_text: {
        color: Colors.textButton,
        fontFamily: Fonts.openSansBold,
        fontSize: 14
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
    title: {
        color: Colors.white,
        fontFamily: Fonts.openSansBold,
        fontSize: 18
    },
    label: {
        color: Colors.white,
        fontSize: 16,
        fontFamily: Fonts.openSansRegular,
        marginTop: 8
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
        borderRadius: 5,
        fontSize: 16,
        fontFamily: Fonts.openSansRegular
    },
    label_center: {
        color: Colors.white,
        fontSize: 14,
        fontFamily: Fonts.openSansRegular,
        marginTop: 0
    },
});

const LinhaBotoes = StyleSheet.create({
    container: {
        width: '100%',
        height: 100,
        flexDirection: 'row'
    }
});