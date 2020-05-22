/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Fragment,useState,useEffect} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  ImageBackground,
  
} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';
import BgTracking from './components/bgtTracking.js'


const images = { 
  bg1:{
    src: require("./assets/kaupunki_tausta_pysty_750_1334_roni_piirainen.jpg")
  },
  bg2:{
    src: require("./assets/flower.jpg")
  }
}

const App = (props) => {
  const [situation, setSituation] = useState(false);
  //console.log(UpTime);
  let seconds = "nada";

  return (
    <View style={styles.mainView}> 
      <ImageBackground source={images.bg1.src} style={{position:"absolute",width: '100%', height: '100%', resizeMode: "cover"}}></ImageBackground>
      <LinearGradient colors={['rgba(255, 255, 255, 0.7)', 'rgba(255, 255, 255, 0.4)']} style={{position:"absolute",width: '100%', height: '100%'}}></LinearGradient>
      <View style={styles.container}>
        <View></View>
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
      
    </View>
  );
};

//this controls whole app
//tick rate of navigation can be set here
const Counter = () => {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(seconds => seconds + 1);
    }, 5000);
    console.log("sec ", seconds);
    return () => clearInterval(interval);
  }, [seconds]);

  return (
    <App counter={seconds} />
  );
};



const styles = StyleSheet.create({
  mainView:{
    flex:1,
    flexDirection:"column",
  },
  container:{
    flex:1,
    flexDirection:"column",
    justifyContent:"center",
    alignItems:"center",
    zIndex:10
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
