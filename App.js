/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Fragment,useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  ImageBackground,
} from 'react-native';

import BgTracking from './components/bgtTracking.js'


const image = { uri: "./assets/kaupunki_tausta_pysty_750_1334_roni_piirainen.jpg" };

const App = () => {
  const [situation, setSituation] = useState(false);

  return (
    <ImageBackground source={image} style={styles.imageBg}>   
      <View style={styles.container}>
        <Text style={styles.header}>Älä tuu lähel!</Text>
        <View style={{
          ...styles.mainBubble,
          backgroundColor: situation ? "#ea2127" : "#96bb26"
          }}>
          <View>
            <BgTracking setSituation={(c)=>setSituation(c)} />
          </View>
        </View>
      </View>
    </ImageBackground>  
  );
};

const styles = StyleSheet.create({
  container:{
    flex:1,
    flexDirection:"column",
    justifyContent:"center",
    alignItems:"center"
  },
  imageBg: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center"
  },
  mainBubble:{
    margin:15,
    padding:30,
    borderRadius:125,
    width:250,
    height:250,

    //backgroundColor:"#96bb26",

    //to center insides
    flexDirection:"column",
    justifyContent:"center"
  },
  header: {
    fontSize:30,
    textAlign:"center",
    marginBottom:30,
    color:"#000"
  }
});

export default App;
