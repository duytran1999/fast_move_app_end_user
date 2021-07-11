import React, { Component } from 'react'
import {
    Text, View, TouchableOpacity, SafeAreaView, StyleSheet, Alert,
    StatusBar, FlatList, Image, Platform, ActivityIndicator,
    ImageBackground, Button, ScrollView, KeyboardAvoidingView,
    TouchableWithoutFeedback, Keyboard, TextInput
} from 'react-native'
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps'
import * as Location from 'expo-location';
import Modal from 'react-native-modal';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import MapViewDirections from 'react-native-maps-directions';
import { ifIphoneX } from 'react-native-iphone-x-helper'
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

import { FirebaseApp } from '../../api/firebase/index'

import HeaderBar from '../../components/HeaderBar/index'


import { connect } from 'react-redux'
import { CommonActions } from '@react-navigation/native';
import { actSignOut } from '../../actions/index'
import { actGetMyLocationString, actGetMyLocation, actGetDistanceMatrix } from '../../actions/actionLocation'
import GlobalStyles from '../../constants/GlobalStyle';

import { SetAccount, GetAccount, RemoveAccount } from '../../api/secure/index'
import { API_KEY_GOOGLE } from '../../constants/api_key'
import { HEIGHT_DEVICE_WINDOW, WIDTH_DEVICE_WINDOW } from '../../constants/DeviceDimensions';
import { listService } from '../Feed/listService'

const ASPECT_RATIO = WIDTH_DEVICE_WINDOW / HEIGHT_DEVICE_WINDOW
export class ConfirmOrder extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isLoading: true,
            data: null
        }
    }

    componentDidMount() {
        FirebaseApp.auth().onAuthStateChanged((user) => {
            if (user) {
                var uid = user.uid;
                FirebaseApp.firestore().collection("order").doc(uid).collection("historyOrder").doc(this.props.route.params.idOrder).onSnapshot((querySnapshot => {
                    console.log(querySnapshot.data())
                    this.setState({
                        isLoading: false,
                        data: querySnapshot.data()
                    })
                }))
            }
        })
    }



    CancelOrder = () => {
        FirebaseApp.auth().onAuthStateChanged((user) => {
            if (user) {
                var uid = user.uid;
                FirebaseApp.firestore().collection("order").doc(uid).collection("historyOrder").doc(this.props.route.params.idOrder).set({
                    orderStatus: "cancel_order",
                }, { merge: true })
                    .then(() => {
                        FirebaseApp.firestore().collection("all_order").doc(this.props.route.params.idOrder).set({
                            orderStatus: "cancel_order",
                        }, { merge: true })
                    })
                    .then(() => {
                        FirebaseApp.firestore().collection("all_order_realtime").doc(this.props.route.params.idOrder).delete()
                    })
                    .then(() => {
                        this.props.navigation.goBack()
                    })
            }
        })
    }
    showCoordsSender = () => {

        if (this.state.data.locationCoordsSender !== null) {
            return (
                <Marker coordinate={this.state.data.locationCoordsSender} >
                    <Image
                        source={require('../../assets/icon/truck.png')}
                        style={{ height: 50, width: 50 }}
                    />
                    <View style={{ backgroundColor: 'white', borderRadius: 10, padding: 5 }}>
                        <Text style={{ width: 100 }} numberOfLines={2}>
                            {this.renderLocation(this.state.data.locationSender)}
                        </Text>
                    </View>
                </Marker>
            )
        }
        return (
            null
        )
    }
    showCoordsReceiver = () => {
        if (this.state.data.locationCoordsReceiver !== null) {
            return (
                <Marker coordinate={this.state.data.locationCoordsReceiver} >
                    <Image
                        source={require('../../assets/icon/destination.png')}
                        style={{ height: 50, width: 50 }}
                    />
                    <View style={{ backgroundColor: 'white', borderRadius: 10, padding: 5 }}>
                        <Text style={{ width: 100 }} numberOfLines={1}>
                            {this.renderLocation(this.state.data.locationReceiver)}
                        </Text>
                    </View>
                </Marker>
            )
        }
        return (
            null
        )
    }
    showCoordsDriver = () => {
        if (this.state.data.locationDriver !== null) {
            console.log(this.state.data.locationDriver)
            return (
                <Marker coordinate={this.state.data.locationDriver} >
                    <Image
                        source={require('../../assets/icon/driver.png')}
                        style={{ height: 50, width: 50 }}
                    />
                    <View style={{ backgroundColor: 'white', borderRadius: 10, padding: 5 }}>
                        <Text style={{ width: 100 }} numberOfLines={1}>
                            Tài Xế Đang Ở Đây
                        </Text>
                    </View>
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

    fitAllMarkers() {
        this.mapView.fitToCoordinates([this.state.data.locationCoordsSender, this.state.data.locationCoordsReceiver], {
            edgePadding: {
                right: (WIDTH_DEVICE_WINDOW / 10),
                bottom: (HEIGHT_DEVICE_WINDOW / 7),
                left: (WIDTH_DEVICE_WINDOW / 10),
                top: (HEIGHT_DEVICE_WINDOW / 4),
            },
            animated: true,
        });
    }
    fitAll_Markers() {
        console.log("Fit marker")
        console.log(this.state.data.locationDriver)
        this.mapViewMatchDriver.fitToCoordinates([this.state.data.locationCoordsSender,
        this.state.data.locationCoordsReceiver, this.state.data.locationDriver], {
            edgePadding: {
                right: (WIDTH_DEVICE_WINDOW / 6),
                bottom: (HEIGHT_DEVICE_WINDOW / 6),
                left: (WIDTH_DEVICE_WINDOW / 6),
                top: (HEIGHT_DEVICE_WINDOW / 6),
            },
            animated: true,
        });
    }
    render() {
        this.state.data != null ? console.log(this.state.data.locationDriver) : null
        if (this.state.data == null) {
            return (
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#e74c3c' }}>
                    <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}>
                        Đang Tìm Kiếm Tài Xế
                    </Text>
                </View>
            )
        }
        else if (this.state.data.orderStatus == 'wait_driver') {
            return (
                <View style={{ flex: 1, backgroundColor: '#fcfcfc' }}>
                    <View style={{ flex: 1 }}>
                        <MapView
                            style={{ flex: 2 }}
                            provider='google'
                            initialRegion={{
                                latitude: this.state.data.locationCoordsSender.latitude,
                                longitude: this.state.data.locationCoordsSender.longitude,
                                latitudeDelta: 0.01,
                                longitudeDelta: 0.01 * ASPECT_RATIO
                            }}
                            ref={c => this.mapView = c}
                            onMapReady={this.fitAllMarkers.bind(this)}
                        >
                            {this.showCoordsSender()}
                            {this.showCoordsReceiver()}
                        </MapView>

                        <View style={{ flex: 1, backgroundColor: '#ecf0f1' }}>
                            {
                                this.state.data.orderStatus === 'wait_driver'
                                    ?
                                    <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: 'white' }}>
                                        <ActivityIndicator
                                            size={50}
                                            color={"red"}
                                        />
                                        <Text style={{ fontSize: 13, fontWeight: 'bold' }}>
                                            Đang Tìm Kiếm Tài Xế
                                        </Text>
                                    </View>
                                    :
                                    <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', paddingVertical: 5, paddingLeft: 10 }}>
                                        <Image
                                            source={require("../../assets/icon/finish-line.png")}
                                            style={{ width: 40, height: 40, marginRight: 10 }}
                                        />
                                        <Text style={{ fontSize: 13, fontWeight: 'bold' }}>
                                            Đã Tìm Thấy Tài Xế
                                        </Text>
                                    </View>
                            }
                            <View style={{
                                flexDirection: 'row', alignItems: 'center', backgroundColor: 'white',
                                marginTop: 10, padding: 10, justifyContent: 'space-between'
                            }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Image
                                        source={require('../../assets/icon/money.png')}
                                        style={{ height: 30, width: 30, marginRight: 10 }}
                                    />
                                    <Text style={{ fontSize: 15, fontWeight: 'bold' }}>
                                        {this.state.data.paymentType}
                                    </Text>
                                </View>
                                <View>
                                    <Text>
                                        {this.state.data.totalBillTrip.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}
                                    </Text>
                                </View>
                            </View>

                            <View style={{
                                flexDirection: 'row', alignItems: 'center', backgroundColor: 'white',
                                marginTop: 10, padding: 10, justifyContent: 'space-between'
                            }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Image
                                        source={listService[parseInt(this.state.data.serviceType.id)].icon}
                                        style={{ height: 30, width: 30, marginRight: 10 }}
                                    />
                                    <Text style={{ fontSize: 15, fontWeight: 'bold' }}>
                                        {this.state.data.serviceType.name}
                                    </Text>
                                </View>
                                <View>
                                    <Text>
                                        {this.state.data.distanceTrip} km
                                    </Text>
                                </View>
                            </View>

                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', flex: 1, marginTop: 5 }}>
                                <View style={{
                                    backgroundColor: '#bdc3c7', flex: 1, height: 50, margin: 5,
                                    alignItems: 'center', justifyContent: 'center'
                                }}>
                                    <TouchableOpacity onPress={() => { this.CancelOrder() }}>
                                        <View>
                                            <Text style={{ color: 'white', fontWeight: 'bold' }}>
                                                Hủy Đơn Hàng
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                                <View style={{
                                    backgroundColor: '#e74c3c', flex: 1, height: 50, margin: 5,
                                    alignItems: 'center', justifyContent: 'center'
                                }}>
                                    <Text style={{ color: 'white', fontWeight: 'bold' }}>
                                        Bạn có thắc mắc
                                    </Text>
                                    <Text style={{ color: 'white', }}>
                                        094.883.8864
                                    </Text>
                                </View>

                            </View>
                        </View>
                    </View>
                </View>
            )

        } else if (this.state.data.orderStatus == 'finded_driver_for_your_order') {
            return (
                <View style={{ flex: 1, }}>
                    <View style={{ flex: 2, backgroundColor: 'red' }}>
                        <MapView
                            style={{ flex: 1 }}
                            provider='google'
                            initialRegion={{
                                latitude: this.state.data.locationCoordsSender.latitude,
                                longitude: this.state.data.locationCoordsSender.longitude,
                                latitudeDelta: 0.01,
                                longitudeDelta: 0.01 * ASPECT_RATIO
                            }}
                            ref={c => this.mapViewMatchDriver = c}
                            onMapReady={this.fitAll_Markers.bind(this)}
                        >
                            {this.showCoordsSender()}
                            {this.showCoordsReceiver()}
                            {this.showCoordsDriver()}
                        </MapView>
                    </View>
                    <View style={{ flex: 1, backgroundColor: '', paddingHorizontal: 10, paddingVertical: 10 }}>
                        <View style={{
                            flex: 1,
                            flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
                            borderBottomColor: '#535c68', borderBottomWidth: 1.5, paddingBottom: 10
                        }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <View>
                                    {
                                        this.state.data.driverPickUp.imageAva != null
                                            ?
                                            <Image
                                                source={{ uri: this.state.data.driverPickUp.imageAva }}
                                                style={{ height: 50, width: 50 }}
                                            />
                                            :
                                            <Image
                                                source={require('../../assets/icon/driver.png')}
                                                style={{ height: 50, width: 50 }}
                                            />
                                    }
                                </View>
                                <View style={{ marginLeft: 10 }}>
                                    <Text style={{ fontWeight: '800', color: '#30336b' }}>
                                        {this.state.data.driverPickUp.driverName}
                                    </Text>
                                    <Text>
                                        0948838864
                                    </Text>
                                </View>
                            </View>
                            <View>
                                <FontAwesome5
                                    name={"phone"}
                                    color={"#535c68"}
                                    size={40}
                                />
                            </View>
                        </View>
                        <View style={{
                            flex: 1, backgroundColor: "#eb4d4b", alignItems: 'center', justifyContent: 'center',
                            borderRadius: 20, marginVertical: 10
                        }}>
                            <Text style={{ fontWeight: '800', fontSize: 17, color: 'white' }} numberOfLines={1}>
                                Tài xế đang đến nhận hàng từ bạn
                            </Text>
                        </View>
                        <TouchableOpacity
                            style={{ flex: 1 }}
                            onPress={() => this.CancelOrder()}
                        >
                            <View style={{
                                alignItems: 'center', justifyContent: 'center',
                                borderRadius: 20,
                                borderColor: '#eb4d4b', borderWidth: 2, flex: 1
                            }}>
                                <Text style={{ fontWeight: '800', fontSize: 17, color: '#eb4d4b' }} numberOfLines={1}>
                                    Hủy Đơn Hàng
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            )

        }
        else if (this.state.data.orderStatus == 'picked_up_order') {
            return (
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#f9ca24' }}>
                    <View style={{ alignItems: 'center' }}>
                        <Text style={{ fontWeight: 'bold', fontSize: 20, color: '#30336b' }}>
                            Tài Xế
                        </Text>
                        <Text style={{ fontWeight: 'bold', fontSize: 20, color: '#30336b' }}>
                            Đã Nhận Hàng
                        </Text>
                        <Text style={{ fontWeight: 'bold', fontSize: 20, color: '#30336b' }}>
                            Từ Bạn
                        </Text>

                    </View>
                </View>
            )
        }
        else if (this.state.data.orderStatus == 'return_order') {
            return (
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#eb4d4b' }}>
                    <View style={{ alignItems: 'center' }}>
                        <Text style={{ fontWeight: 'bold', fontSize: 20, color: '#dff9fb' }}>
                            Đã Gửi Hàng Cho Người Nhận
                        </Text>
                        <Text style={{ fontWeight: 'bold', fontSize: 20, color: '#dff9fb' }}>
                            Giao Hàng Thành Công
                        </Text>
                        <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                            <View style={{ marginTop: 20 }}>
                                <FontAwesome5
                                    name={"long-arrow-alt-left"}
                                    size={50}
                                    color={"white"}
                                />
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            )
        }
        else if (this.state.data.orderStatus == 'finish_order') {
            return (
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#eb4d4b' }}>
                    <View style={{ alignItems: 'center' }}>
                        <Text style={{ fontWeight: 'bold', fontSize: 20, color: '#dff9fb' }}>
                            Hoàn Tất Đơn Hàng
                        </Text >
                        <Text style={{ fontWeight: 'bold', fontSize: 20, color: '#dff9fb' }}>
                            Hẹn Gặp Lại Quý Khách
                        </Text>
                        <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                            <View style={{ marginTop: 20 }}>
                                <FontAwesome5
                                    name={"long-arrow-alt-left"}
                                    size={50}
                                    color={"white"}
                                />
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            )
        }
        else if (this.state.data.orderStatus == 'cancel_order') {
            return (
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#be2edd' }}>
                    <View>
                        <Text style={{ fontWeight: 'bold', fontSize: 20, color: '#dff9fb' }}>
                            Bạn đã
                        </Text>
                        <Text style={{ fontWeight: 'bold', fontSize: 20, color: '#dff9fb' }}>
                            Hủy Đơn Hàng
                        </Text>
                        <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                            <View>
                                <FontAwesome5
                                    name={"long-arrow-alt-left"}
                                    size={50}
                                    color={"#130f40"}
                                />
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            )
        }
        else{
            <View>
                <Text>
                    
                </Text>
            </View>
        }
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    inner: {
        padding: 24,
        flex: 1,
        justifyContent: "space-around",
        backgroundColor: "#f5f6fa", borderTopRightRadius: 20, borderTopLeftRadius: 20
    },
    header: {
        fontSize: 20,
    },
    textInput: {
        height: 40,
        borderColor: "#000000",
        borderBottomWidth: 1,
        marginBottom: 36
    },
    btnContainer: {
        backgroundColor: "white",
        marginTop: 12
    }
});
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

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(ConfirmOrder)

