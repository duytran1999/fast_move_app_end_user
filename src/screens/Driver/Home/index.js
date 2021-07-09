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

import { HEIGHT_DEVICE_SCREEN, HEIGHT_DEVICE_WINDOW, WIDTH_DEVICE_WINDOW, } from '../../../constants/DeviceDimensions';

import { SetAccount, GetAccount, RemoveAccount } from '../../../api/secure/index'


const ASPECT_RATIO = WIDTH_DEVICE_WINDOW / HEIGHT_DEVICE_WINDOW
const size_image_ava = 40
export class Home extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isWorking: true,
            listOrder: [],
            loading: true,
            name: '', avatar: '',
            locationDriver: null
        }
    }
    async componentDidMount() {
        this.getOrderList()
        // let { status } = await Location.requestForegroundPermissionsAsync();
        // let userId = await FirebaseApp.auth().currentUser.uid
        // if (status !== 'granted') {
        //     alert('Permission to access location was denied')
        //     return;
        // }
        // let location = await Location.getCurrentPositionAsync({})
        // this.setState({
        //     locationDriver: location,
        // })
        this.setState({
            locationDriver: {
                latitude: 10.776065,
                longitude: 106.594964,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01 * ASPECT_RATIO
            }
        })
    }
    getOrderList = () => {
        FirebaseApp.auth().onAuthStateChanged((user) => {
            if (user) {
                var uid = user.uid;
                FirebaseApp.firestore().collection("User").doc(uid).get()
                    .then(doc => {
                        this.setState({
                            name: doc.data().displayName,
                            avatar: doc.data().imageAva
                        })
                    }).then(() => {
                        FirebaseApp.firestore().collection("all_order")
                            .onSnapshot((querySnapshot => {
                                let order = []
                                querySnapshot.forEach(doc => {
                                    order.push({
                                        ...doc.data(),
                                        key: doc.id
                                    })
                                })
                                this.setState({
                                    listOrder: order,
                                    loading: false
                                })
                            }))
                    }).then(() => {

                    })
            }
        });

    }
    renderHeader = () => {
        return (
            <View style={{
                flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
                backgroundColor: ''
            }}>
                <View style={{ width: 100 }} >
                    <TouchableOpacity onPress={() => {
                        // this.props.LogOut()
                        this.props.navigation.navigate("SettingDriver")
                    }}>
                        <View>
                            {
                                this.state.avatar.length > 0
                                    ?
                                    <Image
                                        source={{ uri: this.state.avatar }}
                                        style={{ width: size_image_ava, height: size_image_ava, borderRadius: size_image_ava / 2 }}
                                    />
                                    :
                                    <Image
                                        source={require('../../../assets/icon/user.png')}
                                        style={{ width: size_image_ava, height: size_image_ava, borderRadius: size_image_ava / 2 }}
                                    />
                            }
                        </View>
                    </TouchableOpacity>
                </View>
                <View>
                    <TouchableOpacity onPress={() => this.props.LogOut()}>
                        <Text>
                            {
                                this.state.isWorking == true
                                    ?
                                    <Text style={{ color: '#6ab04c', fontWeight: 'bold', }}>
                                        Đang Hoạt Động

                                    </Text>
                                    :
                                    <Text style={{ color: '#535c68', fontWeight: 'bold', }}>
                                        Nghỉ Ngơi
                                    </Text>
                            }
                        </Text>
                    </TouchableOpacity>
                </View>
                <View style={{ width: 100, alignItems: 'flex-end' }} >
                    <Switch
                        trackColor={{ false: "#767577", true: "#6ab04c" }}
                        thumbColor={this.state.isWorking ? "#f4f3f4" : "#f4f3f4"}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={() => {
                            this.setState({
                                isWorking: !this.state.isWorking
                            })
                        }}
                        value={this.state.isWorking}
                    />
                </View>
            </View>
        )
    }
    convertObjectLocationToStringStreetandCoords = (location, detailLocation) => {
        return detailLocation.detailLocation + " " + location.street
    }
    convertObjectLocationToString = (location, detailLocation) => {
        return location.district + " " + location.subregion + " " + location.city
    }
    receivesThisOrder = (item) => {
        FirebaseApp.firestore().collection("all_order").doc(item.orderId).set({
            orderStatus: "finded_driver_for_your_order",
            timeDriverReceivesGoods: new Date(),
            driverPickUp: {
                driverName: this.state.name,
            },
            locationDriver: this.state.locationDriver
        }, { merge: true })
            .then(() => {
                FirebaseApp.firestore().collection("order").doc(item.idUserCreateOrder).collection("historyOrder").doc(item.orderId).set({
                    orderStatus: "finded_driver_for_your_order",
                    timeDriverReceivesGoods: new Date(),
                    driverPickUp: {
                        driverName: this.state.name,
                    },
                    locationDriver: this.state.locationDriver
                }, { merge: true })
            })
            .then(() => {
                this.props.navigation.navigate("MapDriverClient", {
                    itemOrder: item,
                    locationDriver: this.state.locationDriver,
                    orderId: item.orderId
                })
            })

    }
    skipOrder = (index) => {
        console.log("asdasd")
        this.setState({
            listOrder: this.state.listOrder.splice(index, 1)
        })
    }
    render() {
        console.log("=========token driver in home =====================")
        console.log(this.props.token)
        console.log("=========token driver in home =====================")
        return (
            <>
                <ImageBackground
                    style={{
                        flex: 1
                    }}
                    source={require('../../../assets/picture/snazzy-image.png')}
                    blurRadius={0.5}
                >
                    <View style={{
                        flex: 1, marginTop: Platform.OS == 'android' ? StatusBar.currentHeight : ifIphoneX() ? 50 : 20, marginHorizontal: 10,
                    }}>
                        {this.renderHeader()}

                        <View style={{ flex: 12, backgroundColor: "", }}>
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                <Image
                                    source={require('../../../assets/icon/electronic-board-with-concentric-circles.png')}
                                    style={{ width: WIDTH_DEVICE_WINDOW / 2 - 100, height: WIDTH_DEVICE_WINDOW / 2 - 100 }}
                                />
                            </View>
                            <View style={{ flex: 1, backgroundColor: '', alignItems: 'center' }}>
                                {
                                    this.state.isWorking == true
                                        ?
                                        <FlatList
                                            data={this.state.listOrder}
                                            // keyExtractor={item => item.toString()}
                                            horizontal
                                            showsHorizontalScrollIndicator
                                            pagingEnabled
                                            bounces
                                            onRefresh={() => this.getOrderList()}
                                            refreshing={this.state.loading}
                                            renderItem={({ item, index }) =>
                                                <View
                                                    key={index}
                                                    style={{
                                                        //backgroundColor: index % 2 == 0 ? "yellow" : "green",
                                                        width: WIDTH_DEVICE_WINDOW - 20,
                                                        padding: 20
                                                    }}
                                                >
                                                    <View style={{
                                                        flex: 1, backgroundColor: 'white', borderRadius: 10, shadowColor: "#000",
                                                        shadowOffset: {
                                                            width: 0,
                                                            height: 5,
                                                        },
                                                        shadowOpacity: 0.36,
                                                        shadowRadius: 6.68,

                                                        elevation: 11,
                                                    }}>

                                                        <View style={{ marginHorizontal: 5, marginVertical: 7 }}>
                                                            <Text style={{ fontWeight: '900', fontSize: 14, color: '#c23616', marginLeft: 10, marginBottom: 5 }}>
                                                                Có đơn vận chuyển mới !
                                                            </Text>
                                                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                                    <Image
                                                                        source={index % 2 == 0 ? require('../../../assets/icon/man.png') : require('../../../assets/icon/woman.png')}
                                                                        style={{ width: 50, height: 50, marginRight: 5 }}
                                                                    />
                                                                    <View >
                                                                        <Text style={{ fontWeight: '700', marginBottom: 5 }}>
                                                                            {item.senderInfo.nameSender}
                                                                        </Text>
                                                                        <Text>
                                                                            {item.senderInfo.phoneSender}
                                                                        </Text>
                                                                    </View>
                                                                </View>
                                                                <View style={{ alignItems: 'flex-end' }}>
                                                                    <Text style={{ fontWeight: 'bold', fontSize: 17 }}>
                                                                        {item.totalBillTrip.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}
                                                                    </Text>
                                                                    <Text style={{ color: "silver" }}>
                                                                        {`${item.distanceTrip} km`}
                                                                    </Text>
                                                                </View>
                                                            </View>
                                                            <View style={{ marginLeft: 10, marginTop: 20 }}>
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
                                                                        <Text style={{ fontWeight: '800', color: 'silver', fontSize: 10 }}>
                                                                            Điểm lấy hàng
                                                                        </Text>
                                                                        <Text >
                                                                            {this.convertObjectLocationToStringStreetandCoords(item.locationSender, item.senderInfo)}
                                                                        </Text>
                                                                        <Text >
                                                                            {this.convertObjectLocationToString(item.locationSender, item.senderInfo)}
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
                                                                            <Text style={{ fontWeight: '800', color: 'silver', fontSize: 10 }}>
                                                                                Điểm trả hàng
                                                                            </Text>
                                                                            <Text >
                                                                                {this.convertObjectLocationToStringStreetandCoords(item.locationReceiver, item.receiverInfo)}
                                                                            </Text>
                                                                            <Text >
                                                                                {this.convertObjectLocationToString(item.locationReceiver, item.receiverInfo)}
                                                                            </Text>
                                                                        </View>
                                                                    </View>
                                                                </View>
                                                            </View>
                                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, marginHorizontal: 5 }}>
                                                                <View style={{
                                                                    flex: 1, alignItems: 'center', justifyContent: 'center',
                                                                    borderRadius: 10, borderWidth: 2, borderColor: '#e84118', height: 50, marginRight: 5
                                                                }}>
                                                                    <TouchableOpacity onPress={() => this.skipOrder(index)}>
                                                                        <View >
                                                                            <Text>
                                                                                Bỏ qua
                                                                            </Text>
                                                                        </View>
                                                                    </TouchableOpacity>
                                                                </View>
                                                                <View style={{
                                                                    flex: 1, alignItems: 'center', justifyContent: 'center',
                                                                    borderRadius: 10, backgroundColor: '#e84118', height: 50, marginLeft: 5
                                                                }}>
                                                                    <TouchableOpacity onPress={() => this.receivesThisOrder(item)}>
                                                                        <View>
                                                                            <Text style={{ fontWeight: 'bold', color: 'white' }}>
                                                                                Nhận đơn
                                                                            </Text>
                                                                        </View>
                                                                    </TouchableOpacity>
                                                                </View>
                                                            </View>
                                                        </View>
                                                    </View>
                                                </View>
                                            }
                                        />
                                        :
                                        null
                                }

                            </View>
                        </View>
                    </View>
                </ImageBackground>
            </>
        )
    }
}




const mapStateToProps = (state) => ({
    typeClient: state.authReducer.typeClient,
    token: state.authReducer.token,
})

const mapDispatchToProps = (dispatch, props) => {
    return {

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)
