import React, { Component } from 'react';
import { Alert, View, Text, StyleSheet, Image, TouchableHighlight } from 'react-native';

//https://react-native-elements.github.io/react-native-elements/docs/getting_started.html
import { Icon } from 'react-native-elements'

//asennus
//yarn add @mauron85/react-native-background-geolocation
//node ./node_modules/@mauron85/react-native-background-geolocation/scripts/postlink.js
//ja jos joku paskoo ni aja tää
//PS D:\ReactNativeProjektitPC\koronatesti> cd .\android\
//PS D:\ReactNativeProjektitPC\koronatesti\android> .\gradlew clean
//ja sit viel ota Permission location pois ja anna lupa apissa
import BackgroundGeolocation from '@mauron85/react-native-background-geolocation';
//import DeviceInfo from 'react-native-device-info';

import AsyncStorage from '@react-native-community/async-storage';

const images = { 
  checkIcon:{
    src: require("../assets/checkIcon.png")
  },
  bg2:{
    src: require("../assets/flower.jpg")
  }
}

class BgTracking extends Component {
  constructor(props) {
    super(props);

    this.state = {
      debug:false,
      location:null,
      senderIdToBackend:"1278498374923844jbkj234hkj34hk32j4hk32hj3",
      coronaSurrondingsHeader:"Korona appi",
      coronaSurrondings:"Kaikki ok",
      timer:0,
      debugStage:false,
      asyncStorageKey:"22052020_1748",
      interval:10000,
      fastestInterval:5000,
      activitiesInterval:10000,
      safeZoneLocation:{
        lat:null,
        lon:null
      },
      //safeZoneLocation:{lat: 61.4707902, lon: 21.8083698}, //makkosen huudit 61.4707902,21.8083698,20
      safeZoneRadius: 0.05, //in kilometers (default is 50m)
      isAtSafeZone:false
    };
  }

	storeData = async (data) => {
		console.log('yrittää'); 
		try {
			console.log('data',data); 
      await AsyncStorage.setItem(this.state.asyncStorageKey, JSON.stringify(data));
      
      this.getData();
		} catch (error) {
			console.log('Save error',error); 
		}
  };
  
  getData = async(reset) => {
		try {
			//const value = AsyncStorage.getItem(key);
			const value = await AsyncStorage.getItem(this.state.asyncStorageKey);
      const data = JSON.parse(value);

      console.log("stored: ", data);

      if(!data){
        let randNum = Math.floor((Math.random() * 10000000000) + 100000000);
        let date = JSON.stringify( new Date() );
        let madeUpId = randNum + "_" + date;
        madeUpId = madeUpId.replace(/["']/g, "");
        let newStorageData = {
          senderIdToBackendStored:madeUpId,
        }
        console.log("new storage data", newStorageData);
        this.storeData(newStorageData);
      }else{
        this.setState({
          senderIdToBackend: data.senderIdToBackendStored,
        });

        if(!data.safeZoneLocation){

          console.log("safe data ei oo");
          if(this.state.safeZoneSet){
            let newStorageData = {
              senderIdToBackendStored:data.senderIdToBackendStored,
              safeZoneLocation:this.state.safeZoneLocation
            }
            console.log("new storage data", newStorageData);
            this.storeData(newStorageData);
          }
        }else{
          console.log("safe data on");
          if(!reset){ //should be used for first load only
            this.setState({
              safeZoneSet:true,
              senderIdToBackend: data.senderIdToBackendStored,
              safeZoneLocation: data.safeZoneLocation
            });     
          }else{
            this.state.isAtSafeZone = false;
            let newStorageData = {
              senderIdToBackendStored:data.senderIdToBackendStored,
            }
            console.log("new storage data (removed safe)", newStorageData);
            this.storeData(newStorageData);         
          }
        }
      }




      //console.log("state getin jälkeen ", this.state);

    } catch (error) {
			console.log('Fetch error',error); 
		}
  };

  reConfigure = () => {
    console.log("---------Reconfigure---------");
    console.log(this.state);
    BackgroundGeolocation.configure({
      desiredAccuracy: BackgroundGeolocation.HIGH_ACCURACY,
      stationaryRadius: 50,
      distanceFilter: 50,
      notificationTitle: this.state.coronaSurrondingsHeader,
      notificationText: this.state.coronaSurrondings,
      debug: this.state.debugStage,
      startOnBoot: false,
      stopOnTerminate: true,
      locationProvider: BackgroundGeolocation.ACTIVITY_PROVIDER,
      interval: this.state.interval,
      fastestInterval: this.state.fastestInterval, 
      activitiesInterval: this.state.activitiesInterval, //säilytetään tämä aina näin
      stopOnStillActivity: false,
      url: 'http://192.168.81.15:3000/location',
      httpHeaders: {
        'X-FOO': 'bar'
      },
      // customize post properties
      postTemplate: {
        lat: '@latitude',
        lon: '@longitude',
        foo: 'bar' // you can also add your own properties
      }
    });  
    
  }

  sendToBackend = async(location) => {

    let ROOT_URL = "https://koikka.work/korona/api.php";
    //console.log("Root url " + ROOT_URL);

    let path = "?action=saveToDatabase&accuracy="+location.accuracy
    +"&senderId="+this.state.senderIdToBackend
    +"&lon="+location.longitude
    +"&lat="+location.latitude
    +"&altitude="+location.altitude
    +"&timestamp="+location.timestamp;
    //let path = "orders/"+id+"?status=completed&consumer_key="+this.state.consumer_key+"&consumer_secret="+this.state.consumer_secret;        

    console.log("path"+path);

    return fetch(ROOT_URL + path, {
    //return fetch(ROOT_URL, {
        method: 'POST',
        body: null,
    }).then(response => response.json())
    .then(data => {
      //console.log("Onnistui ", location, data, data.notify);
      console.log("Onnistui ", data);
      let note = "Kaikki ok";
      let header = "Korona appi";
      let situation = false;
      let debugit = false;
      if(data.notify){ //change this to test danger (!) and safe (iffit erikseen jotta helpompi testaa)
        if(!this.state.isAtSafeZone){
          note = "Ihmisiä lähellä!";
          header = "Varoitus!";
          situation = true;
          debugit = true;
        }
      }
      this.props.setSituation(situation);
      this.setState({
        loadingSafeZone:false,
        danger:situation,
        interval:data.interval,
        fastestInterval:data.fastest_interval,
        activitiesInterval:data.activities_interval,
        coronaSurrondings:note,
        coronaSurrondingsHeader:header,
        debugStage:debugit,
        timer:this.state.timer+1,
      })

      
      //BackgroundGeolocation.configure.notificationText = this.state.coronaSurrondings;

    })
    .catch((error) =>{
        this.setState({
            wait:false,
        });
        console.error(error);
    });  
    
  }
  componentDidUpdate(prevProps, prevState) {
    if(
      prevState.coronaSurrondings!==this.state.coronaSurrondings ||
      prevState.interval!==this.state.interval
    )
      this.reConfigure();    
  }

  ifInsideSafezone = (location,center,radius) => {
    console.log("if inside safezone ", location);
    
    //credit https://stackoverflow.com/questions/59633860/check-if-point-is-inside-circle
    function degreesToRadians(degrees) {
        return degrees * Math.PI / 180;
    }

    function distanceInKmBetweenEarthCoordinates(lat1, lon1, lat2, lon2) {
        console.log(lat1, lon1, lat2, lon2);
        var earthRadiusKm = 6371;

        var dLat = degreesToRadians(lat2-lat1);
        var dLon = degreesToRadians(lon2-lon1);

        lat1 = degreesToRadians(lat1);
        lat2 = degreesToRadians(lat2);

        var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
        return earthRadiusKm * c;
    }

    console.log(location, center, radius)
    let newRadius = distanceInKmBetweenEarthCoordinates(location.latitude, location.longitude, center.lat, center.lon);
    console.log(newRadius)

    let difference = radius - newRadius;

    difference = difference * 1000;
    difference = difference.toFixed(2);

    if( newRadius < radius ) {
        //point is inside the circle
        console.log('inside');
        this.setState({
          isAtSafeZone:true,
          isAtSafeZoneDifference:difference
        })
    }
    else if(newRadius > radius) {
        //point is outside the circle
        console.log('outside')
        this.setState({
          isAtSafeZone:false,
          isAtSafeZoneDifference:difference
        })
    }
    else {
        //point is on the circle
        console.log('on the circle')
       
    }

  }

  setSafeZone = () => {
    this.setState({
      loadingSafeZone:true,
      safeZoneSet:!this.state.safeZoneSet,
      safeZoneLocation:{
        lat:this.state.location.latitude,
        lon:this.state.location.longitude
      }
    });
    this.getData(true); //this (true) will not update state
  }

  componentDidMount() {
    console.log("state aluksi ", this.state);
    this.getData();
    console.log("mount: sijainti päivittyi");
    //this.props.setSituation(true);
    this.reConfigure();

    
    this.setState({
      coronaSurrondingsHeader:"Älä tuu lähel!",
    });

    BackgroundGeolocation.on('location', (location) => {
      // handle your locations here
      // to perform long running operation on iOS
      // you need to create background task
      //console.log("1 location",location);
      BackgroundGeolocation.startTask(taskKey => {
        // execute long running task
        // eg. ajax post location
        // IMPORTANT: task has to be ended by endTask
        this.setState({
          location:location
        });

        if(this.state.safeZoneSet){
          console.log("safe on asetetttu" , this.state.isAtSafeZone);
          /*
          this.setState({
            safeZoneLocation:{
              lat:this.state.location.latitude,
              lon:this.state.location.longitude
            }
          });
          */
          console.log("------------->", this.state.safeZoneLocation);
          this.ifInsideSafezone(location,this.state.safeZoneLocation,this.state.safeZoneRadius); 
        }else{
          console.log("safe ei asetetttu");
        }
        //console.log("send to backend: ",location);
                
        this.sendToBackend(location);
        BackgroundGeolocation.endTask(taskKey);
      });
    });

    BackgroundGeolocation.on('stationary', (stationaryLocation) => {
      // handle stationary locations here
      Actions.sendLocation(stationaryLocation);
    });

    BackgroundGeolocation.on('error', (error) => {
      console.log('[ERROR] BackgroundGeolocation error:', error);
    });

    BackgroundGeolocation.on('start', () => {
      console.log('[INFO] BackgroundGeolocation service has been started');
    });

    BackgroundGeolocation.on('stop', () => {
      console.log('[INFO] BackgroundGeolocation service has been stopped');
    });

    BackgroundGeolocation.on('authorization', (status) => {
      console.log('[INFO] BackgroundGeolocation authorization status: ' + status);
      if (status !== BackgroundGeolocation.AUTHORIZED) {
        // we need to set delay or otherwise alert may not be shown
        setTimeout(() =>
          Alert.alert('App requires location tracking permission', 'Would you like to open app settings?', [
            { text: 'Yes', onPress: () => BackgroundGeolocation.showAppSettings() },
            { text: 'No', onPress: () => console.log('No Pressed'), style: 'cancel' }
          ]), 1000);
      }
    });

    BackgroundGeolocation.on('background', () => {
      console.log('[INFO] App is in background', this.state.location);
    });

    BackgroundGeolocation.on('foreground', () => {
      console.log('[INFO] App is in foreground');
    });

    BackgroundGeolocation.on('abort_requested', () => {
      console.log('[INFO] Server responded with 285 Updates Not Required');

      // Here we can decide whether we want stop the updates or not.
      // If you've configured the server to return 285, then it means the server does not require further update.
      // So the normal thing to do here would be to `BackgroundGeolocation.stop()`.
      // But you might be counting on it to receive location updates in the UI, so you could just reconfigure and set `url` to null.
    });

    BackgroundGeolocation.on('http_authorization', () => {
      console.log('[INFO] App needs to authorize the http requests');
    });

    BackgroundGeolocation.checkStatus(status => {
      console.log('[INFO] BackgroundGeolocation service is running', status.isRunning);
      console.log('[INFO] BackgroundGeolocation services enabled', status.locationServicesEnabled);
      console.log('[INFO] BackgroundGeolocation auth status: ' + status.authorization);

      // you don't need to check status before start (this is just the example)
      //if (!status.isRunning) {
        BackgroundGeolocation.start(); //triggers start on start event
      //}
    });

    // you can also just start without checking for status
    // BackgroundGeolocation.start();
  }

  componentWillUnmount() {
    // unregister all event listeners
    BackgroundGeolocation.removeAllListeners();
  }

  render() {
    return (
      <View>
          {
            this.state.debug ? 
            <View style={styles.debug}>
              <Text>timer {this.state.timer}</Text>
              <Text>interval {this.state.interval}</Text>
              <Text>fastestInterval {this.state.fastestInterval}</Text>
              <Text>activitiesInterval {this.state.activitiesInterval}</Text>
              <Text>Safezone set {this.state.safeZoneSet ? 'yes' : 'no'}</Text>
              <Text>Current:{this.state.location.latitude + " " + this.state.location.longitude}</Text>
              <Text>Safe:{ this.state.safeZoneLocation.lat + " " + this.state.safeZoneLocation.lon }
              </Text>
              <Text>
              {
                this.state.isAtSafeZone ? "inside safezone " : "outside safezone " 
              }
              </Text>
              <Text>
              Ero {this.state.isAtSafeZoneDifference}m
              </Text>
            </View> :
            null
          }


          {
            this.state.isAtSafeZone ?
            <View>
              <Text style={styles.header}>Turvassa</Text>
              <View  style={styles.situation}>
                    <Icon
                    name='favorite'
                    color='rgb(248, 100, 108)'
                    size={90}
                    />
              </View>
            </View>:
            <View>
              <Text style={styles.header}>
              {
                    !this.state.danger ? "Suojauksen tila" : "Vaara!"
              }
              </Text>
              <View  style={styles.situation}>
                  {
                    this.state.danger ?
                    <View>
                      {
                        this.state.loadingSafeZone ?
                        <View style={styles.loadingSafeZoneContainer}>
                          <Text style={styles.loadingSafeZoneText}>Tarkistetaan</Text>
                          <Text style={styles.loadingSafeZoneText}>turva-aluetta</Text>
                        </View>:null
                      }
                      <Icon
                        name='block'
                        color='rgb(248, 100, 108)'
                        size={90}
                      />
                    </View>:
                    <View>
                      {
                        this.state.loadingSafeZone ?
                        <View style={styles.loadingSafeZoneContainer}>
                          <Text style={styles.loadingSafeZoneText}>Tarkistetaan</Text>
                          <Text style={styles.loadingSafeZoneText}>turva-aluetta</Text>
                        </View>:null
                      }
                      <Icon
                      name='check'
                      color='#64f891'
                      size={90}
                      />
                    </View>
                  }
              </View>
            </View>
          }


          <TouchableHighlight onPress={()=> this.setState({
            debug:!this.state.debug
          }) } style={styles.debugTrigger}>
            <Icon
                  name='info'
                  color='#FFF'
                  size={30}
                />
          </TouchableHighlight>
          <TouchableHighlight onPress={(e)=> this.setSafeZone(e) } style={styles.safeZoneTrigger}>
            <Icon
                  name='favorite'
                  color= {this.state.safeZoneSet ? 'rgb(248, 100, 108)' : '#FFF'}
                  size={30}
                />
          </TouchableHighlight>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  /*Debug*/
  debug:{
    backgroundColor:"#f7f7f775",
    padding:5,
    position:"absolute",
    bottom:-150,
    left:-35,
  },
  debugTrigger:{
    position:"absolute",
    top:-70,
    left:-35,
  },
  /*Debug*/

  /*Safezone */
  safeZoneTrigger:{
    position:"absolute",
    top:-70,
    right:-35,
  },
  loadingSafeZoneContainer:{
    position:"absolute",
    alignSelf:"center",
    alignItems:"center",
    justifyContent:"center",
    zIndex:10,
    backgroundColor:"rgb(66, 69, 86)",
    width:90,
    height:90
    //bottom:-115
  },
  loadingSafeZoneText:{
    color:"#FFF",
    textAlign:"center",
    fontSize:12
  },
  /*Safezone */

  header: {
    fontSize:18,
    textAlign:"center",
    color:"#fff",
    fontFamily: 'MPLUSRounded1c-Bold'
  },
  situation:{
    padding:0,
    width:120,
    alignSelf:"center",
    marginTop:5
  },
  situationText: {
    fontSize:18,
    textAlign:"center",
    color:"#000",
    fontFamily: 'MPLUSRounded1c-Regular'
  }
});

export default BgTracking;