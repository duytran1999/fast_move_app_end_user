import React, { Component } from 'react'
import { Text, View, TouchableOpacity, SafeAreaView, StyleSheet, StatusBar, FlatList, Image, Platform, ActivityIndicator, ImageBackground, Button } from 'react-native'
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps'
import * as Location from 'expo-location';
import Modal from 'react-native-modal';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import MapViewDirections from 'react-native-maps-directions';

import { FirebaseApp } from '../../api/firebase/index'

import { connect } from 'react-redux'
import { CommonActions } from '@react-navigation/native';
import { actSignOut } from '../../actions/index'
import { actGetMyLocationString, actGetMyLocation, actGetDistanceMatrix } from '../../actions/actionLocation'
import GlobalStyles from '../../constants/GlobalStyle';
import { listService } from './listService'
import { SetAccount, GetAccount, RemoveAccount } from '../../api/secure/index'
import { API_KEY_GOOGLE } from '../../constants/api_key'

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
            location: null,
            modalVisible: false,
            serviceTransport: listService[0],
            userID: null
        }
    }
    calculateDistance = (distanceTrip, serviceType) => {
        let result = distanceTrip * serviceType
        return result.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })
    }
    setModalVisible = (visible) => {
        this.setState({ modalVisible: visible });
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
            //let userId = await FirebaseApp.auth().currentUser.uid
            if (status !== 'granted') {
                alert('Permission to access location was denied')
                return;
            }
            let location = await Location.getCurrentPositionAsync({})
            this.setState({
                location: location,
                // userId: userId
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
    renderPickerSender = () => {
        return (
            <View style={{ flex: 1, justifyContent: 'center' }}>
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
                                    justifyContent: 'center'
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
                                    <Text style={{ color: '#535c68' }} numberOfLines={2}>
                                        {this.renderLocation(this.props.locationSender)}
                                    </Text>
                                </View>

                        }
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    renderPickerReceiver = () => {
        return (
            <View style={{ flex: 1, justifyContent: 'center' }}>
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
                                    justifyContent: 'center', paddingRight: 20
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
                                    <Text style={{ color: '#535c68' }} numberOfLines={2}>
                                        {this.renderLocation(this.props.locationReceiver)}
                                    </Text>
                                </View>

                        }
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    renderSelectedService = () => {
        return (
            <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10 }}>
                <Image
                    source={this.state.serviceTransport.icon}
                    style={{ height: 30, width: 30 }}
                />
                <View style={{ marginLeft: 10 }}>
                    <Text style={{ fontWeight: '900', }}>
                        {this.state.serviceTransport.name}
                    </Text>
                    <Text style={{ color: 'silver', fontSize: 10 }}>
                        {this.state.serviceTransport.description}
                    </Text>
                </View>
            </View>
        )
    }
    renderSelectService = () => {
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <TouchableOpacity onPress={() => { this.setModalVisible(!this.state.modalVisible); }}>
                    <View style={{ alignItems: 'center' }}>

                        <View style={{
                            height: HEIGHT_DEVICE_SCREEN / 12,
                            width: WIDTH_DEVICE_WINDOW * 0.95,
                            borderColor: '#b2bec3', borderWidth: 1,
                            borderRadius: 10,
                            justifyContent: 'space-between',
                            flexDirection: 'row',
                        }} >
                            {
                                this.renderSelectedService()
                            }
                            {
                                this.props.distanceTrip === null
                                    ?
                                    null
                                    :

                                    <View View style={{ alignItems: 'center', justifyContent: 'center', marginRight: 10 }}>
                                        <Text style={{ fontWeight: 'bold' }}>
                                            {
                                                this.calculateDistance(this.props.distanceTrip, this.state.serviceTransport.coefficient)
                                            }
                                        </Text>
                                    </View>

                            }
                        </View>
                        <View style={{
                            height: 10,
                            width: WIDTH_DEVICE_WINDOW * 0.85,
                            backgroundColor: '#dcdde1',
                            borderBottomLeftRadius: 10, borderBottomRightRadius: 10
                        }} />
                        <View style={{
                            height: 10,
                            width: WIDTH_DEVICE_WINDOW * 0.7,
                            backgroundColor: '#ecf0f1',
                            borderBottomLeftRadius: 10, borderBottomRightRadius: 10
                        }} />
                    </View>
                </TouchableOpacity>
            </View >
        )
    }
    renderWrapModal = () => {
        return (
            <Modal
                onSwipeComplete={() => this.setModalVisible(!this.state.modalVisible)}
                visible={this.state.modalVisible}
                swipeDirection="down"
                scrollHorizontal={true}
                style={{ margin: 0 }}
            >
                <View style={{ height: 200 }} >
                    <View style={{ alignItems: 'center', justifyContent: 'space-between', flex: 1 }}>
                        <View
                            style={{ width: 10, height: 10 }}
                        />
                        <FontAwesome5
                            name={"chevron-down"}
                            size={30}
                            color={"white"}
                        />
                    </View>
                </View>
                <View style={{
                    height: HEIGHT_DEVICE_SCREEN - 200,
                    borderTopLeftRadius: 20, borderTopRightRadius: 20,
                    backgroundColor: 'white'
                }}>

                    <View style={{ alignItems: 'center' }}>
                        <TouchableOpacity
                            onPress={() => this.setModalVisible(!this.state.modalVisible)}
                        >
                            <View style={{ alignItems: 'center', marginTop: 20 }}>

                                <Text style={{ fontWeight: 'bold', color: "#636e72" }}>
                                    Tất Cả Dịch Vụ
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <FlatList
                        data={listService}
                        renderItem={({ item, index }) => (
                            <TouchableOpacity
                                onPress={() => {
                                    this.setState({
                                        serviceTransport: item
                                    })
                                    this.setModalVisible(!this.state.modalVisible)
                                }
                                }
                            >
                                <View
                                    style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingBottom: 10 }}
                                    key={index}
                                >
                                    <Image
                                        source={item.icon}
                                        style={{ height: 50, width: 50 }}
                                    />
                                    <View style={{ marginLeft: 10 }}>
                                        <Text style={{ fontWeight: '900', }}>
                                            {item.name}
                                        </Text>
                                        <Text style={{ color: 'silver', fontSize: 13 }}>
                                            {item.description}
                                        </Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        )}
                    />
                </View>
            </Modal>
        )
    }
    navigateConfirmOrder = () => {
        if (this.props.distanceTrip !== null) {
            let result = this.props.distanceTrip * this.state.serviceTransport.coefficient
            this.props.navigation.navigate("ConfirmOrder", {
                resultTrip: result,
                serviceType: this.state.serviceTransport,
                durationTrip: this.props.durationTrip
            })
        }
    }
    renderDirectionMap = () => {
        if (this.props.locationCoordsSender !== null && this.props.locationCoordsReceiver !== null) {
            return (
                <MapViewDirections
                    origin={this.props.locationCoordsSender}
                    destination={this.props.locationCoordsReceiver}
                    apikey={API_KEY_GOOGLE}
                    strokeWidth={3}
                    strokeColor="hotpink"
                    onStart={(params) => {
                        console.log(`Started routing between "${params.origin}" and "${params.destination}"`);
                    }}
                    onReady={result => {
                        console.log(`Distance: ${result.distance} km`)
                        console.log(`Duration: ${result.duration} min.`)
                        this.props.GetDistanceMatrix(result.distance, result.duration)

                        this.mapView.fitToCoordinates(result.coordinates, {
                            edgePadding: {
                                right: (WIDTH_DEVICE_WINDOW / 20),
                                bottom: (HEIGHT_DEVICE_WINDOW / 20),
                                left: (WIDTH_DEVICE_WINDOW / 20),
                                top: (HEIGHT_DEVICE_WINDOW / 20),
                            },
                            animated: true,
                        });
                    }}
                />
            )
        }
    }
    fitAllMarkers() {
        if (this.props.locationCoordsSender != null && this.props.locationCoordsReceiver != null) {
            this.mapView.fitToCoordinates([this.props.locationCoordsSender, this.props.locationCoordsReceiver], {
                edgePadding: {
                    right: (WIDTH_DEVICE_WINDOW / 20),
                    bottom: (HEIGHT_DEVICE_WINDOW / 20),
                    left: (WIDTH_DEVICE_WINDOW / 20),
                    top: (HEIGHT_DEVICE_WINDOW / 20),
                },
                animated: true,
            });
        }
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
                        style={{ flex: 1 }}
                        provider='google'
                        initialRegion={{
                            latitude: this.state.location.coords.latitude,
                            longitude: this.state.location.coords.longitude,
                            latitudeDelta: 0.01,
                            longitudeDelta: 0.01 * ASPECT_RATIO
                        }}
                        ref={c => this.mapView = c}
                        onMapReady={this.fitAllMarkers.bind(this)}
                        showsUserLocation={true}
                    >
                        {/* <Marker
                            coordinate={this.state.location.coords}
                            image={require('../../assets/icon/pin(2).png')}
                        /> */}
                        {this.showCoordsSender()}
                        {this.showCoordsReceiver()}

                        {/* {this.renderDirectionMap()} */}

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
                    {this.renderWrapModal()}
                    {this.renderSelectService()}
                    {this.renderPickerSender()}
                    {this.renderPickerReceiver()}
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 10 }}>
                        <TouchableOpacity
                            onPress={() => this.navigateConfirmOrder()}
                        >
                            <View style={{
                                width: WIDTH_DEVICE_SCREEN - 10,
                                height: HEIGHT_DEVICE_SCREEN / 12,
                                backgroundColor: this.props.locationCoordsSender !== null && this.props.locationCoordsReceiver !== null ? '#D7443E' : "#7f8fa6",
                                borderRadius: 10,
                                alignItems: 'center', justifyContent: 'center'
                            }}>
                                {
                                    this.props.locationCoordsSender !== null && this.props.locationCoordsReceiver !== null
                                        ?
                                        <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold', textDecorationLine: 'underline' }}>
                                            Tiếp Tục
                                        </Text>
                                        :
                                        <View style={{ alignItems: 'center' }}>
                                            <Text style={{ color: 'white', fontSize: 12, fontWeight: 'bold' }}>
                                                Chọn điểm gửi hàng và nhận hàng
                                            </Text>
                                            <Text style={{ color: 'white', fontSize: 10, textDecorationLine: 'underline' }}>
                                                ( Bắt Buộc )
                                            </Text>
                                        </View>


                                }
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView >
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
        distanceTrip: state.locationReducer.distanceTrip,
        durationTrip: state.locationReducer.durationTrip,
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
        },
        GetDistanceMatrix: (distanceTrip, durationTrip) => {
            dispatch(actGetDistanceMatrix(distanceTrip, durationTrip))
        }
    }
}



export default connect(mapStateToProps, mapDispatchToProps)(Feed)