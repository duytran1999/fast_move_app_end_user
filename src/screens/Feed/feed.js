import React, { Component } from 'react'
import { Text, View, TouchableOpacity, SafeAreaView, StyleSheet, StatusBar, FlatList, Image, Platform, ActivityIndicator, ImageBackground } from 'react-native'
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps'
import * as Location from 'expo-location';
import Modal from 'react-native-modal';

import { FirebaseApp } from '../../api/firebase/index'

import { connect } from 'react-redux'
import { CommonActions } from '@react-navigation/native';
import { actSignOut } from '../../actions/index'
import { actGetMyLocationString, actGetMyLocation } from '../../actions/actionLocation'
import GlobalStyles from '../../constants/GlobalStyle';

import { SetAccount, GetAccount, RemoveAccount } from '../../api/secure/index'

//Component

//Height,WIDTH
import { WIDTH_DEVICE_WINDOW, HEIGHT_DEVICE_WINDOW, HEIGHT_DEVICE_SCREEN, WIDTH_DEVICE_SCREEN } from '../../constants/DeviceDimensions'

const ASPECT_RATIO = WIDTH_DEVICE_WINDOW / HEIGHT_DEVICE_WINDOW
class Feed extends Component {
    constructor(props) {
        super(props)
        this.state = {
            // latitude: 10.791671,// 10.791671, //
            // longitude: 106.703345,//106.703345 ,//
            // coordsUser: null
            location: null
        }
    }
    convertCordToLocationString = async (region) => {
        try {
            let locationString = await Location.reverseGeocodeAsync(region)
        } catch (error) {
            console.log(error)
        }
    }
    async componentDidMount() {
        try {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                alert('Permission to access location was denied')
                return;
            }
            let location = await Location.getCurrentPositionAsync({})
            this.setState({
                location: location
            })
        }
        catch (error) {
            console.log(error)
            let status = Location.getProviderStatusAsync()
            if (!(await status).locationServicesEnabled) {
                alert("Enable Services")

            }
        }
    }
    showCoordsSender = () => {
        console.log("coord in feed")
        console.log(this.props.locationCoordsSender)
        if (this.props.locationCoordsSender !== null) {
            return (
                <Marker coordinate={this.props.locationCoordsSender} >
                    <Image
                        source={require('../../assets/icon/truck.png')}
                        style={{ height: 50, width: 50 }}
                    />
                </Marker>
            )
        }
        return (
            null
        )
    }
    showCoordsReceiver = () => {
        console.log("coord in feed")
        console.log(this.props.locationCoordsReceiver)
        if (this.props.locationCoordsReceiver !== null) {
            return (
                <Marker coordinate={this.props.locationCoordsReceiver} >
                    <Image
                        source={require('../../assets/icon/destination.png')}
                        style={{ height: 50, width: 50 }}
                    />
                </Marker>
            )
        }
        return (
            null
        )
    }
    renderLocation = (locationString) => {
        return locationString.street + " " + locationString.district + " " + locationString.subregion + " " + locationString.city
    }
    render() {

        if (this.state.location === null) {
            return (
                <View style={{ flex: 1, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center' }}>

                    <View >
                        <ImageBackground
                            source={require("../../assets/icon/Ripple-1s-200px.gif")}
                            style={{
                                height: WIDTH_DEVICE_SCREEN / 2, width: WIDTH_DEVICE_SCREEN / 2,
                                alignItems: 'center', justifyContent: 'center'
                            }}
                        >
                            <Image
                                source={require("../../assets/icon/compass.png")}
                                style={{
                                    height: 40, width: 40,

                                }}
                            />
                        </ImageBackground>

                    </View>
                    <Text style={{ fontWeight: 'bold' }}>
                        Đang định vị
                    </Text>

                </View>
            )
        }
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: '#fcfcfc' }}>
                <View style={{ flex: 1 }}>
                    <MapView
                        style={{ width: WIDTH_DEVICE_WINDOW, height: HEIGHT_DEVICE_WINDOW / 2 }}
                        provider='google'
                        initialRegion={{
                            latitude: this.state.location.coords.latitude,
                            longitude: this.state.location.coords.longitude,
                            latitudeDelta: 0.01,
                            longitudeDelta: 0.01 * ASPECT_RATIO
                        }}
                    >
                        <Marker
                            coordinate={this.state.location.coords}
                            image={require('../../assets/icon/pin(2).png')}
                        />
                        {
                            this.showCoordsSender()
                            
                        }
                        {
                            this.showCoordsReceiver()
                        }
                    </MapView>
                    <View style={{
                        position: 'absolute',
                        top: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
                        right: 10
                    }}>
                        <TouchableOpacity onPress={() => this.props.navigation.openDrawer()}>
                            <View style={{
                                width: 40, height: 40, borderRadius: 20, backgroundColor: "white",
                                justifyContent: 'center', alignItems: 'center',
                                shadowColor: "#000",
                                shadowOffset: {
                                    width: 0,
                                    height: 4,
                                },
                                shadowOpacity: 0.30,
                                shadowRadius: 4.65,
                                elevation: 8,
                            }}>
                                <Image
                                    source={require('../../assets/icon/menu(1).png')}
                                    style={{ height: 20, width: 20 }}
                                />
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={{
                        position: 'absolute',
                        bottom: 10,
                        right: 10
                    }}>
                        <TouchableOpacity onPress={() => { }}>
                            <View style={{
                                width: 40, height: 40, borderRadius: 20, backgroundColor: "white",
                                justifyContent: 'center', alignItems: 'center',
                                shadowColor: "#000",
                                shadowOffset: {
                                    width: 0,
                                    height: 4,
                                },
                                shadowOpacity: 0.30,
                                shadowRadius: 4.65,
                                elevation: 8,
                            }}>
                                <Image
                                    source={require('../../assets/icon/location.png')}
                                    style={{ height: 20, width: 20 }}
                                />
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{ flex: 1 }}>
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>

                        <View style={{ alignItems: 'center' }}>
                            <TouchableOpacity>
                                <View style={{
                                    height: HEIGHT_DEVICE_SCREEN / 15,
                                    width: WIDTH_DEVICE_WINDOW * 0.95,
                                    borderColor: '#b2bec3', borderWidth: 1,
                                    borderRadius: 10,
                                }} >
                                    <Text>
                                        DUy
                                    </Text>
                                </View>
                            </TouchableOpacity>
                            <View style={{
                                height: HEIGHT_DEVICE_SCREEN / 50,
                                width: WIDTH_DEVICE_WINDOW * 0.85,
                                backgroundColor: '#dcdde1',
                                borderBottomLeftRadius: 10, borderBottomRightRadius: 10
                            }} />
                            <View style={{
                                height: HEIGHT_DEVICE_SCREEN / 50,
                                width: WIDTH_DEVICE_WINDOW * 0.7,
                                backgroundColor: '#ecf0f1',
                                borderBottomLeftRadius: 10, borderBottomRightRadius: 10
                            }} />
                        </View>
                    </View>
                    <View style={{ flex: 1 }}>
                        <View style={{ flex: 1 }}>
                            <View style={{ flexDirection: 'row' }}>
                                <View style={{
                                    width: 50,
                                    height: HEIGHT_DEVICE_SCREEN / 12,
                                    justifyContent: 'center', alignItems: 'center'
                                }}>
                                    <Image
                                        source={require('../../assets/icon/circle.png')}
                                        style={{ height: 20, width: 20 }}
                                    />
                                </View>
                                <TouchableOpacity
                                    onPress={() => this.props.navigation.navigate("LocationSender", this.state.location)}
                                >
                                    {
                                        this.props.senderInfo === null
                                            ?
                                            <View style={{
                                                width: WIDTH_DEVICE_SCREEN - 50,
                                                height: HEIGHT_DEVICE_SCREEN / 12,
                                                justifyContent: 'center',
                                                borderBottomWidth: 0.5, borderBottomColor: '#bdc3c7'
                                            }}>
                                                <View>
                                                    <Text style={{ fontSize: 16, color: '#2EA2EF', fontWeight: 'bold' }}>
                                                        Chọn điểm gửi hàng
                                                    </Text>
                                                </View>
                                            </View>
                                            :
                                            <View style={{
                                                width: WIDTH_DEVICE_SCREEN - 50,
                                                height: HEIGHT_DEVICE_SCREEN / 12,
                                                justifyContent: 'center',
                                                paddingLeft: 20, borderBottomWidth: 0.5, borderBottomColor: '#bdc3c7'
                                            }}>
                                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                    <Text style={{ fontSize: 14, color: '#2EA2EF', fontWeight: 'bold' }}>
                                                        {this.props.senderInfo.nameSender}
                                                    </Text>
                                                    <Text style={{ fontSize: 20, color: '#2EA2EF', fontWeight: 'bold', marginHorizontal: 10 }} >
                                                        .
                                                    </Text>
                                                    <Text style={{ fontSize: 14, color: '#2EA2EF', fontWeight: 'normal' }}>
                                                        {this.props.senderInfo.phoneSender}
                                                    </Text>
                                                </View>
                                                <Text style={{ color: '#535c68' }}>
                                                    {this.renderLocation(this.props.locationSender)}
                                                </Text>
                                            </View>

                                    }
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={{ flex: 1 }}>
                            <View style={{ flexDirection: 'row' }}>
                                <View style={{
                                    width: 50,
                                    height: HEIGHT_DEVICE_SCREEN / 12,
                                    justifyContent: 'center', alignItems: 'center'
                                }}>
                                    <Image
                                        source={require('../../assets/icon/rounded-black-square-shape.png')}
                                        style={{ height: 20, width: 20 }}
                                    />
                                </View>
                                <TouchableOpacity
                                    onPress={() => this.props.navigation.navigate("LocationReceiver", this.state.location)}
                                >
                                    {
                                        this.props.receiverInfo === null
                                            ?
                                            <View style={{
                                                width: WIDTH_DEVICE_SCREEN - 50,
                                                height: HEIGHT_DEVICE_SCREEN / 12,
                                                justifyContent: 'center',
                                                borderBottomWidth: 0.5, borderBottomColor: '#bdc3c7'
                                            }}>
                                                <View>
                                                    <Text style={{ fontSize: 16, color: '#D7443E', fontWeight: 'bold' }}>
                                                        Chọn điểm nhận hàng
                                                    </Text>
                                                </View>
                                            </View>
                                            :
                                            <View style={{
                                                width: WIDTH_DEVICE_SCREEN - 50,
                                                height: HEIGHT_DEVICE_SCREEN / 12,
                                                justifyContent: 'center',
                                                paddingLeft: 20, borderBottomWidth: 0.5, borderBottomColor: '#bdc3c7'
                                            }}>
                                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                    <Text style={{ fontSize: 14, color: '#D7443E', fontWeight: 'bold' }}>
                                                        {this.props.receiverInfo.nameReceiver}
                                                    </Text>
                                                    <Text style={{ fontSize: 20, color: '#D7443E', fontWeight: 'bold', marginHorizontal: 10 }} >
                                                        .
                                                    </Text>
                                                    <Text style={{ fontSize: 14, color: '#D7443E', fontWeight: 'normal' }}>
                                                        {this.props.receiverInfo.phoneReceiver}
                                                    </Text>
                                                </View>
                                                <Text style={{ color: '#535c68' }}>
                                                    {this.renderLocation(this.props.locationReceiver)}
                                                </Text>
                                            </View>

                                    }
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 20 }}>
                        <TouchableOpacity
                            onPress={() => { }}
                        >
                            <View style={{
                                width: WIDTH_DEVICE_SCREEN - 50,
                                height: HEIGHT_DEVICE_SCREEN / 12,
                                backgroundColor: '#D7443E',
                                borderRadius: 20,
                                alignItems: 'center', justifyContent: 'center'
                            }}>
                                <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold', textDecorationLine: 'underline' }}>
                                    Tiếp Tục
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>
        )
    }
}
const setCurrentLocation = async () => {
    try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            alert('Permission to access location was denied')
            return;
        }
        let location = await Location.getCurrentPositionAsync({})
        return location
    }
    catch (error) {
        console.log(error)
        let status = Location.getProviderStatusAsync()
        if (!(await status).locationServicesEnabled) {
            alert("Enable Services")

        }
    }
};
const convertCordToLocationString = async (region) => {
    try {
        let locationString = await Location.reverseGeocodeAsync(region)
        return locationString
    } catch (error) {
        console.log(error)
    }
}
const mapStateToProps = (state) => {
    return {
        //userName: state.authReducer.userName,
        myUserLocation: state.locationReducer.userLocation,
        myUserLocationString: state.locationReducer.userLocationString,
        locationCoordsSender: state.locationReducer.locationSenderCoords,
        locationSender: state.locationReducer.locationSender,
        senderInfo: state.locationReducer.senderInfo,
        locationCoordsReceiver: state.locationReducer.locationReceiverCoords,
        locationReceiver: state.locationReducer.locationReceiver,
        receiverInfo: state.locationReducer.receiverInfo,
    }
}

const mapDispatchToProps = (dispatch, props) => {
    return {
        ConvertCordsToLocation: (locationString) => {
            convertCordToLocationString(locationString)
                .then(locationString => {
                    dispatch(actGetMyLocationString(locationString))
                })
        },
        SetCurrentLocation: () => {
            setCurrentLocation()
                .then((location) => {
                    dispatch(actGetMyLocation(location))
                })
        }
    }
}



export default connect(mapStateToProps, mapDispatchToProps)(Feed)