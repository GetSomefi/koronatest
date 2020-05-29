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
  TouchableHighlight,
  
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

/*
kun rupee lähettää sitä safezonee
päälle
action=set_safe_zone&senderId=XXX&lat=XX&lon=XX
pois
action=remove_safe_zone&senderId=XXX&lat=XX&lon=XX
*/

const App = (props) => {
  const [situation, setSituation] = useState(false);
  //console.log(UpTime);
  let seconds = "nada";

  return (
    <View style={styles.mainView}>
      {
        //<ImageBackground source={images.bg1.src} style={{position:"absolute",width: '100%', height: '100%', resizeMode: "cover"}}></ImageBackground>
      }
      <LinearGradient colors={['rgba(51, 54, 69, 1)', 'rgba(51, 54, 69, 1)']} style={{position:"absolute",width: '100%', height: '100%'}}></LinearGradient>
      
      <View>
          <TouchableHighlight>
            <Text style={styles.setHomeButton}>Aseta sijainti turvalliseksi</Text>
          </TouchableHighlight>
      </View>

      <View style={styles.container}>
        <Text style={styles.header}>Älä tuu lähel!</Text>
        
        <View style={{
          ...styles.mainBubble,
          backgroundColor: situation ? "rgb(66, 69, 86)" : "rgb(66, 69, 86)",
          borderColor: situation ? "rgb(248, 100, 108)" : "#64f891"
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
    borderWidth:8,

    //to center insides
    flexDirection:"column",
    justifyContent:"center"
  },
  header: {
    fontSize:36,
    textAlign:"center",
    marginBottom:30,
    color:"#FFF",
    fontFamily: 'MPLUSRounded1c-Bold'
  },
  setHomeButton:{
    color:"#646772",
    padding:15,
    position:"absolute",
    right:0,
    top:0,
    borderRadius:4,
    textTransform:"uppercase",
    fontFamily: 'Roboto-Regular'
  }
});

export default App;
