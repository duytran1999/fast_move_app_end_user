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
import { PaymentType } from './PaymentType'
import { API_FAST_MOVE, createOrder } from '../../api/heroku/index'
const ASPECT_RATIO = WIDTH_DEVICE_WINDOW / HEIGHT_DEVICE_WINDOW
export class ConfirmOrder extends Component {
    constructor(props) {
        super(props)
        this.state = {
            noteForDriver: '',
            showModelNoteDrive: false,
            isBigGoods: false,
            tipMoney: 0,
            paymentType: PaymentType[0],
            navigateSearchDriver: false,
            orderStatus: "wait_driver",
            idOrder: ''
        }
    }
    calculateTotalBill = () => {
        let { isBigGoods, tipMoney } = this.state
        if (isBigGoods == true) {
            return this.props.route.params.resultTrip + tipMoney + 20000
        } else {
            return this.props.route.params.resultTrip + tipMoney
        }
    }
    increaseMoneyTip = () => {
        this.setState({
            tipMoney: this.state.tipMoney + 5000
        })
    }
    decreaseMoneyTip = () => {
        if (this.state.tipMoney > 0) {
            this.setState({
                tipMoney: this.state.tipMoney - 5000
            })
        }
    }
    goBackHomeScreen = () => {
        Alert.alert(
            "Th??ng B??o",
            "B???n mu???n ?????t l???i",
            [
                {
                    text: "R???i ??i",
                    onPress: () => this.props.navigation.goBack(),
                    style: "cancel"
                },
                { text: "??? l???i", onPress: () => console.log("OK Pressed") }
            ]
        );
    }
    setModalNoteDriveVisible = (visible) => {
        this.setState({ showModelNoteDrive: visible });
    }
    renderReviewYourOrder = () => {
        return (
            <TouchableOpacity>
                <View style={{
                    flexDirection: 'row', alignItems: 'center',
                    backgroundColor: 'white',
                    paddingHorizontal: 10, paddingVertical: 15,
                }}>
                    <Image
                        source={require('../../assets/icon/view.png')}
                        style={{ width: 30, height: 30, marginRight: 10 }}
                    />
                    <Text style={{ fontWeight: 'bold' }}>
                        Xem L???i ????n H??ng
                    </Text>
                </View>
            </TouchableOpacity>
        )
    }
    renderOpenNoteDrive = () => {
        return (
            <TouchableOpacity
                onPress={() => this.setModalNoteDriveVisible(!this.state.showModelNoteDrive)}
            >
                <View style={{
                    flexDirection: 'row', alignItems: 'center',
                    backgroundColor: 'white',
                    paddingHorizontal: 10, paddingVertical: 15,
                }}>
                    <Image
                        source={require('../../assets/icon/post-it.png')}
                        style={{ width: 30, height: 30 }}
                    />

                    {
                        this.state.noteForDriver.length > 0
                            ?
                            <Text style={{ color: 'black', marginLeft: 10 }}>
                                {this.state.noteForDriver}
                            </Text>
                            :
                            <Text style={{ color: 'silver', marginLeft: 10 }}>
                                ????? l???i ghi ch?? cho t??i x??? c???a b???n ...
                            </Text>

                    }
                </View>
            </TouchableOpacity>
        )
    }
    renderModalNoteDrive = () => {
        return (
            <Modal
                onSwipeComplete={() => this.setModalNoteDriveVisible(!this.state.showModelNoteDrive)}
                visible={this.state.showModelNoteDrive}
                style={{
                    // marginTop: HEIGHT_DEVICE_WINDOW / 2, marginHorizontal: 0, marginBottom: 0,
                    margin: 0
                }}
                swipeDirection="down"
                scrollHorizontal={true}
            >
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={styles.container}
                >
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <View style={styles.inner}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }} >
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={styles.header}>Ghi ch?? cho t??i x???</Text>
                                    <Image
                                        source={require("../../assets/icon/driver.png")}
                                        style={{ width: 30, height: 30 }}
                                    />
                                </View>
                                <TouchableOpacity onPress={() => this.setModalNoteDriveVisible(!this.state.showModelNoteDrive)}>
                                    <View>
                                        <FontAwesome5
                                            size={50}
                                            color={"#353b48"}
                                            name={"times"}
                                        />
                                    </View>
                                </TouchableOpacity>
                            </View>
                            <TextInput
                                placeholder="Ghi Ch??"
                                style={styles.textInput}
                                state={this.state.showModelNoteDrive}
                                onChangeText={(noteForDriver) => this.setState({ noteForDriver })}
                            />
                            <View style={styles.btnContainer}>
                                <Button title="X??c Nh???n" onPress={() => this.setModalNoteDriveVisible(!this.state.showModelNoteDrive)} />
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </KeyboardAvoidingView>
            </Modal >
        )
    }
    renderBonusService = () => {
        return (
            <View>
                <View style={{ marginTop: 10, }}>
                    <Text style={{ marginBottom: 10, marginLeft: 10 }}>
                        Th??m D???ch V???
                    </Text>
                    <View style={{
                        backgroundColor: "white",
                        justifyContent: 'space-between',
                        paddingHorizontal: 20,
                        paddingVertical: 10
                    }}>
                        <View>
                            <View style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                            }}>
                                <Image
                                    source={require("../../assets/icon/merchandise.png")}
                                    style={{ height: 30, width: 30, marginRight: 10 }}
                                />
                                <Text>
                                    Giao H??ng C???ng K???nh
                                </Text>
                            </View>
                        </View>
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center', justifyContent: 'space-between', marginTop: 10
                        }}>
                            <Text style={{
                                color: this.state.isBigGoods == true ? "#e84118" : "#7f8fa6",
                                fontSize: this.state.isBigGoods == true ? 15 : 12,
                                fontWeight: this.state.isBigGoods == true ? "bold" : 'normal',
                            }}>
                                {this.state.isBigGoods == true ? " Th??m: +20.000 vnd" : '+20.000 vnd'}

                            </Text>
                            <TouchableOpacity
                                onPress={() => this.setState({
                                    isBigGoods: !this.state.isBigGoods
                                })}
                                style={{ marginLeft: 10 }}
                            >
                                <View>
                                    {
                                        this.state.isBigGoods == true
                                            ?
                                            <FontAwesome5
                                                size={30}
                                                color={"#353b48"}
                                                name={"check-square"}
                                            />
                                            :
                                            <FontAwesome5
                                                size={30}
                                                color={"#353b48"}
                                                name={"square"}
                                            />
                                    }
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{
                        backgroundColor: "white",
                        justifyContent: 'space-between',
                        paddingHorizontal: 20,
                        paddingVertical: 10
                    }}>
                        <View>
                            <View style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                            }}>
                                <Image
                                    source={require("../../assets/icon/tip.png")}
                                    style={{ height: 30, width: 30, marginRight: 10 }}
                                />
                                <Text>
                                    H??? Tr??? T??i X???
                                </Text>
                            </View>
                        </View>
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center', justifyContent: 'space-between', marginTop: 10
                        }}>
                            <Text style={{
                                color: this.state.tipMoney > 0 == true ? "#e84118" : "#7f8fa6",
                                fontSize: this.state.tipMoney > 0 == true ? 15 : 12,
                                fontWeight: this.state.tipMoney > 0 == true ? "bold" : 'normal',
                            }}>
                                {this.state.tipMoney > 0 ? `Th??m: ${this.state.tipMoney.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })} vnd` : '+5.000 vnd'}

                            </Text>
                            <View style={{
                                flexDirection: 'row',
                                alignItems: 'center', justifyContent: 'space-between', marginTop: 10
                            }}>
                                <TouchableOpacity
                                    onPress={() => { this.increaseMoneyTip() }}
                                >
                                    <View>
                                        <FontAwesome5
                                            size={30}
                                            name={"plus-square"}
                                            color={"#353b48"}
                                        />
                                    </View>
                                </TouchableOpacity>
                                <Text style={{ marginHorizontal: 10 }}>
                                    {this.state.tipMoney / 5000}
                                </Text>
                                <TouchableOpacity
                                    onPress={() => { this.decreaseMoneyTip() }}
                                >
                                    <View>
                                        <FontAwesome5
                                            size={30}
                                            name={"minus-square"}
                                            color={"#353b48"}
                                        />
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        )
    }
    renderBill = () => {
        return (
            <View style={{ borderTopLeftRadius: 20, borderTopRightRadius: 20, backgroundColor: 'white' }}>
                <View style={{
                    marginHorizontal: 10, marginTop: 10, height: 50, justifyContent: 'space-between', alignItems: 'center',
                    flexDirection: 'row',
                }}>
                    <Text style={{ fontWeight: 'bold' }}>
                        Thanh To??n:
                    </Text>
                    <TouchableOpacity>
                        <View style={{
                            justifyContent: 'space-between', alignItems: 'center',
                            flexDirection: 'row',
                        }}>
                            <Image
                                source={this.state.paymentType.img}
                                style={{ width: 20, height: 20, marginRight: 10 }}
                            />
                            <Text style={{ fontWeight: '600' }}>
                                {this.state.paymentType.name}
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={{
                    marginHorizontal: 10, marginTop: 10, height: 50, justifyContent: 'space-between', alignItems: 'center',
                    flexDirection: 'row',
                }}>
                    <Text style={{ fontWeight: 'bold' }}>
                        T???ng Ti???n:
                    </Text>
                    <Text>
                        {this.calculateTotalBill().toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}

                    </Text>
                </View>
                <View style={{ padding: 10 }}>
                    <TouchableOpacity onPress={() => {
                        this.goToScreenDriver()
                    }}>
                        <View style={{ height: 50, backgroundColor: '#e84118', alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ color: 'white', fontWeight: '700' }}>
                                T??m T??i X???
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
    backToBillScreen = () => {
        let { navigateSearchDriver } = this.state
        this.setState({
            navigateSearchDriver: !navigateSearchDriver
        })
    }
    goToScreenDriver = () => {
        FirebaseApp.auth().onAuthStateChanged((user) => {
            if (user) {
                var uid = user.uid;
                let totalbill = this.calculateTotalBill()
                this.setState({
                    idOrder: uuidv4()
                })
                FirebaseApp.firestore().collection("order").doc(uid).collection("historyOrder").doc(this.state.idOrder).set({
                    orderId: this.state.idOrder,
                    locationCoordsSender: this.props.locationCoordsSender,
                    locationSender: this.props.locationSender,
                    locationCoordsReceiver: this.props.locationCoordsReceiver,
                    locationReceiver: this.props.locationReceiver,
                    senderInfo: this.props.senderInfo,
                    receiverInfo: this.props.receiverInfo,
                    distanceTrip: this.props.distanceTrip,
                    createOrder: new Date(),
                    tipMoney: this.state.tipMoney,
                    isBigGoods: this.state.isBigGoods,
                    paymentType: this.state.paymentType.name,
                    totalBillTrip: this.calculateTotalBill(),
                    tripMoney: this.props.route.params.resultTrip,
                    durationTrip: this.props.durationTrip,
                    noteForDriver: this.state.noteForDriver,
                    timeDriverReceivesGoods: '',
                    timeDriverDeliveryGoods: '',
                    orderStatus: "wait_driver",
                    idUserCreateOrder: uid,
                    serviceType: this.props.route.params.serviceType,
                    Commission: totalbill * 0.01
                }).then(() => {
                    FirebaseApp.firestore().collection("all_order").doc(this.state.idOrder).set({
                        orderId: this.state.idOrder,
                        locationCoordsSender: this.props.locationCoordsSender,
                        locationSender: this.props.locationSender,
                        locationCoordsReceiver: this.props.locationCoordsReceiver,
                        locationReceiver: this.props.locationReceiver,
                        senderInfo: this.props.senderInfo,
                        receiverInfo: this.props.receiverInfo,
                        distanceTrip: this.props.distanceTrip,
                        createOrder: new Date(),
                        tipMoney: this.state.tipMoney,
                        isBigGoods: this.state.isBigGoods,
                        paymentType: this.state.paymentType.name,
                        totalBillTrip: this.calculateTotalBill(),
                        tripMoney: this.props.route.params.resultTrip,
                        durationTrip: this.props.durationTrip,
                        noteForDriver: this.state.noteForDriver,
                        timeDriverReceivesGoods: '',
                        timeDriverDeliveryGoods: '',
                        orderStatus: "wait_driver",
                        idUserCreateOrder: uid,
                        serviceType: this.props.route.params.serviceType,
                        Commission: totalbill * 0.01
                    }).then(() => {
                        FirebaseApp.firestore().collection("all_order_realtime").doc(this.state.idOrder).set({
                            orderId: this.state.idOrder,
                            locationCoordsSender: this.props.locationCoordsSender,
                            locationSender: this.props.locationSender,
                            locationCoordsReceiver: this.props.locationCoordsReceiver,
                            locationReceiver: this.props.locationReceiver,
                            senderInfo: this.props.senderInfo,
                            receiverInfo: this.props.receiverInfo,
                            distanceTrip: this.props.distanceTrip,
                            createOrder: new Date(),
                            tipMoney: this.state.tipMoney,
                            isBigGoods: this.state.isBigGoods,
                            paymentType: this.state.paymentType.name,
                            totalBillTrip: this.calculateTotalBill(),
                            tripMoney: this.props.route.params.resultTrip,
                            durationTrip: this.props.durationTrip,
                            noteForDriver: this.state.noteForDriver,
                            timeDriverReceivesGoods: '',
                            timeDriverDeliveryGoods: '',
                            orderStatus: "wait_driver",
                            idUserCreateOrder: uid,
                            serviceType: this.props.route.params.serviceType,
                            Commission: totalbill * 0.01
                        })
                    })
                        .then(() => {
                            let receiver = {
                                name: this.props.receiverInfo.nameReceiver,
                                phone: this.props.receiverInfo.phoneReceiver,
                                address: this.renderLocation(this.props.locationReceiver)
                            }
                            createOrder("H??ng Nh???", receiver, this.renderLocation(this.props.locationSender),
                                this.state.paymentType.name, this.state.noteForDriver,
                                totalbill * 0.01, this.props.route.params.resultTrip, totalbill,
                                this.props.token)
                                .then((order) => {
                                    console.log(order._id)
                                    FirebaseApp.firestore().collection("order").doc(uid).collection("historyOrder").doc(this.state.idOrder).set({
                                        idOrderApiFastMove: order._id
                                    }, { merge: true })
                                        .then(() => {
                                            FirebaseApp.firestore().collection("all_order").doc(this.state.idOrder).set({
                                                idOrderApiFastMove: order._id
                                            }, { merge: true })
                                        })
                                })
                        })
                        .then(() => {
                            this.props.navigation.navigate("WaitDriver", {
                                idOrder: this.state.idOrder,
                                serviceType: this.props.route.params.serviceType
                            })
                        })
                })
            }
        })
    }
    renderLocation = (locationString) => {
        return locationString.street + " " + locationString.district + " " + locationString.subregion + " " + locationString.city
    }
    render() {
        console.log(this.props.locationSender)
        let { navigateSearchDriver } = this.state
        if (navigateSearchDriver == true) {
            return (
                <View style={{ flex: 1, backgroundColor: '#fcfcfc' }}>
                    <View style={{ flex: 1 }}>
                        <MapView
                            style={{ flex: 2 }}
                            provider='google'
                            initialRegion={{
                                latitude: this.props.locationCoordsSender.latitude,
                                longitude: this.props.locationCoordsSender.longitude,
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
                            <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: 'white' }}>
                                <ActivityIndicator
                                    size={50}
                                    color={"red"}
                                />
                                <Text style={{ fontSize: 13, fontWeight: 'bold' }}>
                                    ??ang T??m Ki???m T??i X???
                                </Text>
                            </View>
                            <View style={{
                                flexDirection: 'row', alignItems: 'center', backgroundColor: 'white',
                                marginTop: 10, padding: 10, justifyContent: 'space-between'
                            }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Image
                                        source={this.state.paymentType.img}
                                        style={{ height: 30, width: 30, marginRight: 10 }}
                                    />
                                    <Text style={{ fontSize: 15, fontWeight: 'bold' }}>
                                        {this.state.paymentType.name}
                                    </Text>
                                </View>
                                <View>
                                    <Text>
                                        {this.calculateTotalBill().toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}
                                    </Text>
                                </View>
                            </View>

                            <View style={{
                                flexDirection: 'row', alignItems: 'center', backgroundColor: 'white',
                                marginTop: 10, padding: 10, justifyContent: 'space-between'
                            }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Image
                                        source={this.props.route.params.serviceType.icon}
                                        style={{ height: 30, width: 30, marginRight: 10 }}
                                    />
                                    <Text style={{ fontSize: 15, fontWeight: 'bold' }}>
                                        {this.props.route.params.serviceType.name}
                                    </Text>
                                </View>
                                <View>
                                    <Text>
                                        {this.props.distanceTrip} km
                                    </Text>
                                </View>
                            </View>

                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', flex: 1, marginTop: 5 }}>
                                <View style={{
                                    backgroundColor: '#bdc3c7', flex: 1, height: 50, margin: 5,
                                    alignItems: 'center', justifyContent: 'center'
                                }}>
                                    <TouchableOpacity onPress={() => {  }}>
                                        <View>
                                            <Text style={{ color: 'white', fontWeight: 'bold' }}>
                                                H???y ????n H??ng
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                                <View style={{
                                    backgroundColor: '#e74c3c', flex: 1, height: 50, margin: 5,
                                    alignItems: 'center', justifyContent: 'center'
                                }}>
                                    <Text style={{ color: 'white', fontWeight: 'bold' }}>
                                        B???n c?? th???c m???c
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
        }
        else {
            return (
                <>
                    <StatusBar backgroundColor={"#D7443E"} />
                    <SafeAreaView style={GlobalStyles.droidSafeArea}>
                        <HeaderBar
                            goBackHomeScreen={this.goBackHomeScreen}
                            name={"X??c Nh???n ????n H??ng"}
                        />
                        {this.renderReviewYourOrder()}
                        {this.renderOpenNoteDrive()}
                        {this.renderModalNoteDrive()}
                        <ScrollView>
                            {this.renderBonusService()}
                        </ScrollView>
                        {this.renderBill()}

                    </SafeAreaView>
                </>
            )
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
        token: state.authReducer.token
    }
}

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(ConfirmOrder)
