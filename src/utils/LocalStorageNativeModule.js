import { NativeModules } from 'react-native';
import { Platform } from 'react-native';

/*
Interface entre o código nativo e o javascript do aplicativo

Docs
https://reactnative.dev/docs/native-modules-android
https://reactnative.dev/docs/native-modules-ios

Callbacks (valueCallback) são funções lambda no formato
(error, valor) => {
    //codigo
}
*/

const localStorageKey = "UFJF_APP_REACT_STORAGE_KEY";

export default class LocalStorage {
    
    /**
     * Salva uma string no armazenamento local
     * @param {String} key 
     * @param {String} value 
     */
    static setString(key, value) {
        if (Platform.OS === 'ios') {
            NativeModules.UserDefaultsModule.setString(key, value);
        } else {
            NativeModules.SharedPreferences.setString(localStorageKey, key, value);
        }
    }

    /**
     * Salva um número no armazenamento local
     * @param {String} key 
     * @param {Number} value 
     */
    static setNumber(key, value) {
        if (Platform.OS === 'ios') {
            NativeModules.UserDefaultsModule.setNumber(key, value);
        } else {
            NativeModules.SharedPreferences.setNumber(localStorageKey, key, value);
        }
    }

    /**
     * Salva um valor booleano no armazenamento local
     * @param {String} key 
     * @param {Boolean} value 
     */
    static setBoolean(key, value) {
        if (Platform.OS === 'ios') {
            NativeModules.UserDefaultsModule.setBoolean(key, value);
        } else {
            NativeModules.SharedPreferences.setBoolean(localStorageKey, key, value);
        }
    }

    /**
     * Salva uma string no armazenamento criptografado
     * @param {String} key 
     * @param {String} value 
     */
    static setEncryptedString(key, value) {
        if (Platform.OS === 'ios') {
            //o UserDefaults do ios ja é criptografado por padrão
            NativeModules.UserDefaultsModule.setString(key, value);
        } else {
            NativeModules.SharedPreferences.setEncryptedString(localStorageKey, key, value);
        }
    }

    ////

    /**
     * Obtem um valor string do armazenamento local
     * @param {String} key 
     * @param {String} padrao 
     * @param {(error:Error, value:String)=>void} valueCallback 
     */
    static getString(key, padrao, valueCallback) {
        if (Platform.OS === 'ios') {
            NativeModules.UserDefaultsModule.getString(key, padrao, valueCallback);
        } else {
            NativeModules.SharedPreferences.getString(localStorageKey, key, padrao, valueCallback);
        }
    }

    /**
     * Obtem uma lista de valores do armazenamento local
     * @param {String[]} keys 
     * @param {String[]} padroes 
     * @param {(error:Error, value:String[])=>void} valueCallback
     */
    static getMultipleString(keys, padroes, valueCallback) {
        if (Platform.OS === 'ios') {
            //NativeModules.UserDefaultsModule.getString(key, padrao, valueCallback);
        } else {
            NativeModules.SharedPreferences.getMultipleString(localStorageKey, keys, padroes, valueCallback);
        }
    }

    /**
     * Obtem um número do armazenamento local
     * @param {String} key 
     * @param {Number} padrao 
     * @param {(error:Error, value:Number)=>void} valueCallback 
     */
    static getNumber(key, padrao, valueCallback) {
        if (Platform.OS === 'ios') {
            NativeModules.UserDefaultsModule.getNumber(key, padrao, valueCallback);
        } else {
            NativeModules.SharedPreferences.getNumber(localStorageKey, key, padrao, valueCallback);
        }
    }

    /**
     * Obtem um valor booleano do armazenamento local
     * @param {String} key 
     * @param {Boolean} padrao 
     * @param {(error:Error, value:Boolean)=>void} valueCallback 
     */
    static getBoolean(key, padrao, valueCallback) {
        if (Platform.OS === 'ios') {
            NativeModules.UserDefaultsModule.getBoolean(key, padrao, valueCallback);
        } else {
            NativeModules.SharedPreferences.getBoolean(localStorageKey, key, padrao, valueCallback);
        }
    }

    /**
     * Obtem um valor string do armazenamento criptografado
     * @param {String} key 
     * @param {String} padrao 
     * @param {(error:Error, value:String)=>void} valueCallback 
     */
    static getEncryptedString(key, padrao, valueCallback) {
        if (Platform.OS === 'ios') {
            //o UserDefaults do ios ja é criptografado por padrão
            NativeModules.UserDefaultsModule.getString(key, padrao, valueCallback);
        } else {
            NativeModules.SharedPreferences.getEncryptedString(localStorageKey, key, padrao, valueCallback);
        }
    }
}