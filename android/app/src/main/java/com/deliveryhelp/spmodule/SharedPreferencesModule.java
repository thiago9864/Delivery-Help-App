// ToastModule.java

package com.deliveryhelp.spmodule;

import android.content.SharedPreferences;
import android.util.Log;

import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.Arguments;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.ArrayList;

public class SharedPreferencesModule extends ReactContextBaseJavaModule {
    private static ReactApplicationContext reactContext;

    SharedPreferencesModule(ReactApplicationContext context) {
        super(context);
        reactContext = context;
    }

    @Override
    public String getName() {
        return "SharedPreferences";
    }

    @ReactMethod
    public void setNumber(String prefsName, String key, Float value) {
        SharedPreferences settings = getReactApplicationContext().getSharedPreferences(prefsName, 0);
        SharedPreferences.Editor editor = settings.edit();
        editor.putFloat(key, value);
        editor.apply();
    }

    @ReactMethod
    public void getNumber(String prefsName, String key, Float padrao, Callback valueCallback) {
        SharedPreferences settings = getReactApplicationContext().getSharedPreferences(prefsName, 0);
        Float valor = settings.getFloat(key, padrao);
        valueCallback.invoke(null, valor);
    }

    @ReactMethod
    public void setBoolean(String prefsName, String key, Boolean value) {
        SharedPreferences settings = getReactApplicationContext().getSharedPreferences(prefsName, 0);
        SharedPreferences.Editor editor = settings.edit();
        editor.putBoolean(key, value);
        editor.apply();
    }

    @ReactMethod
    public void getBoolean(String prefsName, String key, Boolean padrao, Callback valueCallback) {
        SharedPreferences settings = getReactApplicationContext().getSharedPreferences(prefsName, 0);
        Boolean valor = settings.getBoolean(key, padrao);
        valueCallback.invoke(null, valor);
    }

    @ReactMethod
    public void setString(String prefsName, String key, String value) {
        SharedPreferences settings = getReactApplicationContext().getSharedPreferences(prefsName, 0);
        SharedPreferences.Editor editor = settings.edit();
        editor.putString(key, value);
        editor.apply();
    }

    @ReactMethod
    public void getString(String prefsName, String key, String padrao, Callback valueCallback) {
        SharedPreferences settings = getReactApplicationContext().getSharedPreferences(prefsName, 0);
        String valor = settings.getString(key, padrao);
        valueCallback.invoke(null, valor);
    }

    @ReactMethod
    public void getMultipleString(String prefsName, ReadableArray keys, ReadableArray padroes, Callback valueCallback) {
        SharedPreferences settings = getReactApplicationContext().getSharedPreferences(prefsName, 0);
        ArrayList<String> valores = new ArrayList<>();

        for(int i=0; i<keys.size(); i++){
            String key = keys.getString(i);
            String padrao = padroes.getString(i);
            String valor = settings.getString(key, padrao);
            valores.add(valor);
        }
        
        WritableArray promiseArray=Arguments.createArray();
        for(int i=0;i<valores.size();i++){
            promiseArray.pushString(valores.get(i));
        }
        
        valueCallback.invoke(null, promiseArray);
    }

    @ReactMethod
    public void setEncryptedString(String prefsName, String key, String value) {
        SharedPreferences settings = getReactApplicationContext().getSharedPreferences(prefsName, 0);
        SharedPreferences.Editor editor = settings.edit();
        ///////// implementar criptografia aqui /////////
        /////////////////////////////////////////////////
        editor.putString(key, value);
        editor.apply();
    }

    @ReactMethod
    public void getEncryptedString(String prefsName, String key, String padrao, Callback valueCallback) {
        SharedPreferences settings = getReactApplicationContext().getSharedPreferences(prefsName, 0);
        String valor = settings.getString(key, padrao);
        ///////// implementar descriptografia aqui /////////
        /////////////////////////////////////////////////
        valueCallback.invoke(null, valor);
    }

}