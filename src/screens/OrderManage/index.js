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


export class OrderManage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listOrder: []
        }
    }
    goBackHomeScreen = () => {
        this.props.navigation.goBack()
    }
    componentDidMount() {
        FirebaseApp.auth().onAuthStateChanged((user) => {
            if (user) {
                var uid = user.uid;
                FirebaseApp.firestore().collection("order").doc(uid).collection("historyOrder")
                    .get()
                    .then((querrySnapshot) => {
                        let order = []
                        querrySnapshot.forEach(doc => {
                            order.push({
                                ...doc.data(),
                                key: doc.id
                            })
                        })
                        this.setState({
                            listOrder: order
                        })
                    })
            }
        })
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
                            Hoạt Động
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
    renderItemOrder = (item, index) => {
        return (
            <TouchableOpacity
                onPress={() => this.props.navigation.navigate("DetailTrip", {
                    detailTrip: item
                })}
            >
                <View style={{
                    marginBottom: 10, backgroundColor: 'white',
                    padding: 10, borderRadius: 10, marginHorizontal: 10
                }}>
                    <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                        <Image
                            source={require('../../assets/icon/taxi-driver.png')}
                            style={{ width: 30, height: 30 }}
                        />
                        <Text style={{ fontWeight: '900', fontSize: 17, marginLeft: 10 }}>
                            {this.convertTimeStampToDateJS(item.createOrder.toDate())}
                        </Text>
                    </View>
                    <View style={{ borderTopWidth: 1, paddingTop: 10, borderTopColor: "#e8e8e8" }}>
                        <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                            <Image
                                source={require('../../assets/icon/start.png')}
                                style={{ width: 30, height: 30, marginRight: 10 }}
                            />
                            <Text style={{ width: WIDTH_DEVICE_WINDOW - 20 - 30 - 10 - 20 }} numberOfLines={1}>
                                {this.convertObjectLocationToString(item.locationSender)}
                            </Text>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <Image
                                source={require('../../assets/icon/flag-finish.png')}
                                style={{ width: 30, height: 30, marginRight: 10 }}
                            />
                            <Text style={{ width: WIDTH_DEVICE_WINDOW - 20 - 30 - 10 - 20 }} numberOfLines={1}>
                                {this.convertObjectLocationToString(item.locationReceiver)}
                            </Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }
    render() {
        // this.state.listOrder.length > 0 ? console.log(this.state.listOrder[0].createOrder) : console.log("nonen")
        console.log(this.state.listOrder.length)
        if (this.state.listOrder.length > 0) {
            return (
                <>
                    <View style={{ marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : ifIphoneX() ? 50 : 20 }} />
                    <View>
                        {this.renderHeader()}
                        <View>
                            <FlatList
                                //
                                data={this.state.listOrder}
                                renderItem={({ item, index }) =>  this.renderItemOrder(item, index)}
                            />
                        </View>
                    </View>
                </>
            )
        }
        else {
            return (
                <>
                    <View style={{ marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : ifIphoneX() ? 50 : 20 }} />
                    <View>
                        {this.renderHeader()}
                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ fontSize: 17, fontWeight: 'bold' }}>
                                Bạn chưa có đơn vận chuyển !
                            </Text>
                        </View>
                    </View>
                </>
            )
        }

    }
}

const mapStateToProps = (state) => ({

})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(OrderManage)
