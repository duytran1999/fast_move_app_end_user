import React, { Component } from 'react'
import {
    Text, View, TouchableOpacity, SafeAreaView, StyleSheet, Alert,
    StatusBar, FlatList, Image, Platform, ActivityIndicator,
    ImageBackground, Button, ScrollView, KeyboardAvoidingView,
    TouchableWithoutFeedback, Keyboard, TextInput, Switch
} from 'react-native'
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps'
import * as Location from 'expo-location';
import Modal from 'react-native-modal';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import MapViewDirections from 'react-native-maps-directions';
import { ifIphoneX } from 'react-native-iphone-x-helper'
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import { FirebaseApp } from '../../../api/firebase/index'
import { CommonActions } from '@react-navigation/native';
import { connect } from 'react-redux'
import { actSignOut } from '../../../actions/index'
import { API_FAST_MOVE } from '../../../api/heroku/index'
import { HEIGHT_DEVICE_SCREEN, HEIGHT_DEVICE_WINDOW, WIDTH_DEVICE_WINDOW, } from '../../../constants/DeviceDimensions';

const ASPECT_RATIO = WIDTH_DEVICE_WINDOW / HEIGHT_DEVICE_WINDOW
export class MapDriverClient extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: null,
            isLoading: true
        }
    }
    componentDidMount() {
        FirebaseApp.firestore().collection("all_order").doc(this.props.route.params.itemOrder.orderId)
            .onSnapshot((querySnapshot => {
                console.log(querySnapshot.data())
                this.setState({
                    data: querySnapshot.data(),
                    isLoading: false
                })
            }))
    }


    fitAll_Markers() {
        this.mapViewMatchDriver.fitToCoordinates([this.state.data.locationCoordsSender,
        this.state.data.locationCoordsReceiver, this.props.route.params.locationDriver], {
            edgePadding: {
                right: (WIDTH_DEVICE_WINDOW / 7),
                bottom: (HEIGHT_DEVICE_WINDOW / 7),
                left: (WIDTH_DEVICE_WINDOW / 7),
                top: (HEIGHT_DEVICE_WINDOW / 7),
            },
            animated: true,
        });
    }
    showCoordsSender = () => {

        if (this.state.data.locationCoordsSender !== null) {
            return (
                <Marker coordinate={this.state.data.locationCoordsSender} >
                    <Image
                        source={require('../../../assets/icon/truck.png')}
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
                        source={require('../../../assets/icon/destination.png')}
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
        if (this.props.route.params.locationDriver !== null) {
            return (
                <Marker coordinate={this.props.route.params.locationDriver} >
                    <Image
                        source={require('../../../assets/icon/driver.png')}
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
    convertObjectLocationToStringStreetandCoords = (location, detailLocation) => {
        return detailLocation.detailLocation + " " + location.street
    }
    convertObjectLocationToString = (location, detailLocation) => {
        return location.district + " " + location.subregion + " " + location.city
    }
    interfaceOrder = () => {
        if (this.state.data.orderStatus === "finded_driver_for_your_order") {
            FirebaseApp.firestore().collection("all_order").doc(this.props.route.params.itemOrder.orderId)
                .set({
                    orderStatus: "picked_up_order",
                    timePickUpOrder: new Date()
                }, { merge: true })
                .then(() => {
                    FirebaseApp.firestore()
                        .collection("order").doc(this.state.data.idUserCreateOrder)
                        .collection("historyOrder").doc(this.props.route.params.itemOrder.orderId).set({
                            orderStatus: "picked_up_order",
                            timePickUpOrder: new Date()
                        }, { merge: true })
                })
                .then(() => {
                    this.layHang(this.state.data.idOrderApiFastMove, this.props.token)
                })
        }
        else if (this.state.data.orderStatus === "picked_up_order") {
            FirebaseApp.firestore().collection("all_order").doc(this.props.route.params.itemOrder.orderId)
                .set({
                    orderStatus: "return_order",
                    timeReturnOrder: new Date()
                }, { merge: true })
                .then(() => {
                    FirebaseApp.firestore()
                        .collection("order").doc(this.state.data.idUserCreateOrder)
                        .collection("historyOrder").doc(this.props.route.params.itemOrder.orderId).set({
                            orderStatus: "return_order",
                            timeReturnOrder: new Date()
                        }, { merge: true })
                })
        } else {
            FirebaseApp.firestore().collection("all_order").doc(this.props.route.params.itemOrder.orderId)
                .set({
                    orderStatus: "finish_order",
                    timeReturnOrder: new Date()
                }, { merge: true })
                .then(() => {
                    FirebaseApp.firestore()
                        .collection("order").doc(this.state.data.idUserCreateOrder)
                        .collection("historyOrder").doc(this.props.route.params.itemOrder.orderId).set({
                            orderStatus: "finish_order",
                            timeReturnOrder: new Date()
                        }, { merge: true })
                        .then(() => {
                            this.traHang(this.state.data.idOrderApiFastMove, this.props.token)
                        })
                })
                .then(() => {
                    this.props.navigation.goBack()
                })
        }
    }
    layHang = async (idOrder, token) => {
        try {
            let response = await fetch(
                `${API_FAST_MOVE}/api/orders/${idOrder}/pick-deliver`
                , {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    }
                });
            let json = await response.json();
            console.log(json)
            return json
        } catch (error) {
            console.error(error);
        }
    }
    traHang = async (idOrder, token) => {
        try {
            let response = await fetch(
                `${API_FAST_MOVE}/api/orders/${idOrder}/deliver`
                , {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    }
                });
            let json = await response.json();
            console.log(json)
            return json
        } catch (error) {
            console.error(error);
        }
    }
    render() {
        console.log(this.state.data)
        console.log("=====================================================================================================")
        this.state.data !== null ? (console.log(this.state.data), console.log("ascascasc")) : console.log("ko co data")
        if (this.state.isLoading === true) {
            return (
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <Text>
                        Loading
                    </Text>
                </View>
            )
        }
        return (
            <View style={{ flex: 1 }}>
                <MapView
                    style={{ flex: 1 }}
                    provider='google'
                    initialRegion={{
                        latitude: this.props.route.params.locationDriver.latitude,
                        longitude: this.props.route.params.locationDriver.longitude,
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
                <View style={{ flex: 1 }}>
                    <View style={{ flex: 1, justifyContent: 'center' }}>
                        <View style={{ marginHorizontal: 10, marginVertical: 10 }}>
                            <View style={{
                                flexDirection: 'row', alignItems: 'center', paddingBottom: 10
                            }}>
                                <View>
                                    <Image
                                        source={require('../../../assets/icon/circle.png')}
                                        style={{ width: 30, height: 30, marginRight: 10 }}
                                    />
                                </View>
                                <View>
                                    <Text style={{ fontWeight: '800', color: '#130f40', fontSize: 12 }}>
                                        Điểm lấy hàng
                                    </Text>
                                    <Text style={{ fontWeight: 'bold' }}>
                                        {this.state.data.senderInfo.nameSender + " . " + this.state.data.senderInfo.phoneSender}
                                    </Text>
                                    <Text >
                                        {this.convertObjectLocationToStringStreetandCoords(this.state.data.locationSender, this.state.data.senderInfo)}
                                    </Text>
                                    <Text >
                                        {this.convertObjectLocationToString(this.state.data.locationSender, this.state.data.senderInfo)}
                                    </Text>
                                </View>
                            </View>

                            <View style={{
                                flexDirection: 'row', alignItems: 'center', paddingTop: 5,
                            }}>
                                <View>
                                    <Image
                                        source={require('../../../assets/icon/location.png')}
                                        style={{ width: 30, height: 30, marginRight: 10 }}
                                    />
                                </View>
                                <View >
                                    <View>
                                        <Text style={{ fontWeight: '800', color: '#130f40', fontSize: 12 }}>
                                            Điểm trả hàng
                                        </Text>
                                        <Text style={{ fontWeight: 'bold' }}>
                                            {this.state.data.receiverInfo.nameReceiver + " . " + this.state.data.receiverInfo.phoneReceiver}
                                        </Text>
                                        <Text >
                                            {this.convertObjectLocationToStringStreetandCoords(this.state.data.locationReceiver, this.state.data.receiverInfo)}
                                        </Text>
                                        <Text >
                                            {this.convertObjectLocationToString(this.state.data.locationReceiver, this.state.data.receiverInfo)}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                    <View style={{ flex: 1, }}>
                        <View style={{
                            flex: 1,
                        }}>
                            <Text style={{ marginLeft: 10, fontWeight: 'bold' }}>
                                Ghi chú đơn hàng
                            </Text>
                            <View style={{
                                margin: 10, borderRadius: 10, borderWidth: 2, padding: 5, height: HEIGHT_DEVICE_SCREEN / 8 - 50,
                                borderColor: 'silver'
                            }}>

                                <Text numberOfLines={3} >
                                    {
                                        this.state.data.noteForDriver
                                    }
                                </Text>
                            </View>
                        </View>
                        <View style={{ flex: 1, justifyContent: 'flex-end' }}>
                            <TouchableOpacity onPress={() => { this.interfaceOrder() }}>
                                <View style={{
                                    backgroundColor: "#eb4d4b",
                                    alignItems: 'center', height: 60, justifyContent: 'center'
                                }}>
                                    <Text style={{ color: 'white', fontWeight: 'bold' }}>
                                        {
                                            this.state.data.orderStatus === 'finded_driver_for_your_order'
                                                ?
                                                "Nhận Hàng"
                                                :
                                                this.state.data.orderStatus === 'picked_up_order'
                                                    ?
                                                    "Trả Hàng"
                                                    :
                                                    "Hoàn Tất"
                                        }
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View >
        )
    }
}

const mapStateToProps = (state) => ({
    token: state.authReducer.token,
})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(MapDriverClient)
