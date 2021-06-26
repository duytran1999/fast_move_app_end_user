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

export class DetailTrip extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }
    goBackHomeScreen = () => {
        this.props.navigation.goBack()
    }
    renderHeader = () => {
        return (
            <View style={{ backgroundColor: 'white', marginBottom: 10 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 10, marginVertical: 10 }}>
                    <TouchableOpacity
                        onPress={() => this.goBackHomeScreen()}
                    >
                        <View>
                            <Image
                                source={require('../../assets/icon/left-arrow-slim.png')}
                                style={{ width: 30, height: 30 }}
                            />
                        </View>
                    </TouchableOpacity>
                    <View>
                        <Text style={{ fontWeight: 'bold', fontSize: 20, marginLeft: 10 }}>
                            Chi Tiết Chuyến Đi
                        </Text>
                    </View>
                </View>
            </View>
        )
    }
    convertTimeStampToDateJS = (timeStamp) => {
        let datetime = new Date(timeStamp)
        return (datetime.getDate() + "/" + datetime.getMonth() + "/" + datetime.getFullYear() + " | " + datetime.getHours() + ":" + datetime.getMinutes())
    }

    convertObjectLocationToString = (location) => {
        return location.street + " " + location.district + " " + location.subregion + " " + location.city
    }

    renderInfoTrip = (key, createOrder, distanceTrip, locationSender, locationReceiver, receiverInfo, senderInfo, durationTrip) => {
        console.log(receiverInfo)
        return (
            <View style={{ paddingHorizontal: 10, backgroundColor: 'white', padding: 5, marginTop: 10 }}>
                <Text style={{ fontWeight: '800', fontSize: 25, marginBottom: 15, color: "#30336b" }}>
                    Thông Tin
                </Text>
                <Text
                    style={{
                        fontWeight: '500', marginBottom: 5
                    }}
                >
                    {`Mã Chuyến Đi: ${key}`}
                </Text>
                <Text style={{
                    fontWeight: "800", color: '#273c75'
                }} >
                    {this.convertTimeStampToDateJS(createOrder.toDate())}
                </Text>
                <View style={{
                    height: 100, width: WIDTH_DEVICE_WINDOW - 20, justifyContent: 'space-between', flexDirection: 'row',
                    marginTop: 5
                }}>
                    <View style={{
                        backgroundColor: null, height: 100, width: WIDTH_DEVICE_WINDOW / 2 - 15,
                        alignItems: 'center', justifyContent: 'center'
                    }}>
                        <Text style={{ fontWeight: '900', fontSize: 20, color: '#535c68' }}>
                            {`${distanceTrip} km`}
                        </Text>
                        <Text style={{ fontWeight: '700', fontSize: 13, color: '#535c68' }} >
                            Quãng Đường
                        </Text>
                    </View>
                    <View
                        style={{ width: 2, backgroundColor: '#535c68' }}
                    />
                    <View style={{
                        backgroundColor: null, height: 100, width: WIDTH_DEVICE_WINDOW / 2 - 15,
                        alignItems: 'center', justifyContent: 'center'
                    }}>
                        <Text style={{ fontWeight: '900', fontSize: 20, color: '#535c68' }}>
                            {`${Math.round(durationTrip)} phút`}
                        </Text>
                        <Text style={{ fontWeight: '700', fontSize: 13, color: '#535c68' }} >
                            Thời Gian Di Chuyển
                        </Text>
                    </View>
                </View>
                <View>
                    <View style={{ paddingTop: 10, }}>
                        <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                            <Image
                                source={require('../../assets/icon/start.png')}
                                style={{ width: 30, height: 30, marginRight: 10 }}
                            />
                            <View style={{}}>
                                <Text style={{ fontWeight: '700' }}>
                                    {senderInfo.nameSender + ' . ' + senderInfo.phoneSender}
                                </Text>
                                <Text style={{ width: WIDTH_DEVICE_WINDOW - 20 - 30 - 10 }} numberOfLines={1}>
                                    {this.convertObjectLocationToString(locationSender)}
                                </Text>
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <Image
                                source={require('../../assets/icon/flag-finish.png')}
                                style={{ width: 30, height: 30, marginRight: 10 }}
                            />
                            <View>
                                <Text style={{ fontWeight: '700' }}>
                                    {receiverInfo.nameReceiver + ' . ' + receiverInfo.nameReceiver}
                                </Text>
                                <Text style={{ width: WIDTH_DEVICE_WINDOW - 20 - 30 - 10 }} numberOfLines={1}>
                                    {this.convertObjectLocationToString(locationReceiver)}
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        )
    }
    renderPayment = (tripMoney, tipMoney, isBigGoods, totalBillTrip) => {
        let moneyOfBigGoods = 20000
        let nonBigGoods = 0
        return (
            <View style={{ paddingHorizontal: 10, backgroundColor: 'white', padding: 5 }}>
                <Text style={{ fontWeight: '800', fontSize: 25, marginBottom: 15, color: '#30336b' }}>
                    Thanh Toán
                </Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
                    <Text style={{ color: "#535c68" }}>
                        Cước phí chuyến xe:
                    </Text>
                    <Text style={{ color: "#535c68" }}>
                        {tripMoney.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}
                    </Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
                    <Text style={{ color: "#535c68" }}>
                        Tiền bồi dưỡng:
                    </Text>
                    <Text style={{ color: "#535c68" }}>
                        {tipMoney.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}
                    </Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
                    <Text style={{ color: "#535c68" }}>
                        Hàng hóa cồng kềnh:
                    </Text>
                    <Text style={{ color: "#535c68" }}>
                        {isBigGoods === false ? nonBigGoods.toLocaleString('it-IT', { style: 'currency', currency: 'VND' }) : moneyOfBigGoods.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}
                    </Text>
                </View>
                <View
                    style={{ width: WIDTH_DEVICE_WINDOW - 20, height: 2, backgroundColor: "#535c68", marginVertical: 5 }}
                />
                <View style={{
                    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
                }}>
                    <Text style={{ fontSize: 18, fontWeight: '800', color: "#130f40" }}>
                        Tổng Cộng:
                    </Text>
                    <Text style={{ fontSize: 18, fontWeight: '800', color: "#130f40" }}>
                        {totalBillTrip.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}
                    </Text>
                </View>
            </View>
        )
    }
    render() {
        let {
            distanceTrip, createOrder, key, orderId, receiverInfo, senderInfo,
            tripMoney, tipMoney, totalBillTrip, paymentType, isBigGoods, locationSender, locationReceiver,durationTrip
        } = this.props.route.params.detailTrip
        return (
            <>
                <StatusBar backgroundColor={"#D7443E"} />
                <SafeAreaView style={[GlobalStyles.droidSafeArea], {}}>
                    {this.renderHeader()}
                    <ScrollView>
                        {this.renderPayment(tripMoney, tipMoney, isBigGoods, totalBillTrip)}
                        {this.renderInfoTrip(key, createOrder, distanceTrip, locationSender, locationReceiver, receiverInfo, senderInfo, durationTrip)}
                    </ScrollView>
                </SafeAreaView>
            </>
        )
    }
}

export default (DetailTrip)
