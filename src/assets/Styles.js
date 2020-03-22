import { StyleSheet } from 'react-native';
import { Colors } from './Colors';


export var NavBarStyle = StyleSheet.create({
    leftIcon: {
        marginStart: 10,
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center'
    },
    title: {
        color: Colors.white,
        fontSize: 20,
    }
});

export var ScreenCont = StyleSheet.create({
    safeArea: {
        flex: 1, 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: Colors.white
    },
    container: {
        flex: 1, 
        width: "100%",
        backgroundColor: Colors.white
    }
});