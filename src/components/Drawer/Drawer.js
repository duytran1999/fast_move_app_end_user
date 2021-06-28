import React, { Component } from 'react'
import { Text, View, TouchableOpacity, SafeAreaView, StyleSheet, ScrollView, Image, Platform } from 'react-native'
import { connect } from 'react-redux'
import { WIDTH_DEVICE_WINDOW, HEIGHT_DEVICE_WINDOW } from '../../constants/DeviceDimensions'
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import * as Location from 'expo-location';
import { CommonActions } from '@react-navigation/native';
import GlobalStyles from '../../constants/GlobalStyle';
import { listFunction } from './function'
import { SetAccount, GetAccount, RemoveAccount } from '../../api/secure/index'
import { actSignOut } from '../../actions/index'
import { actCreateOrderTransport, actResetLocation } from '../../actions/actionLocation'

import { ifIphoneX } from 'react-native-iphone-x-helper'
import { FirebaseApp } from '../../api/firebase/index'

const styles = StyleSheet.create({
    avatar: {
        height: 50, width: 50,
        borderRadius: 25
    },
    headerContain: {
        flexDirection: "row",
        alignItems: 'center',
        paddingHorizontal: 10, paddingVertical: 5,

    },
    nameContain: {
        marginLeft: 10
    }
})
class Drawer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            //locationString: null
            name: "",
            avatar: ''
        }
    }

    componentDidMount() {
        FirebaseApp.auth().onAuthStateChanged((user) => {
            if (user) {
                var uid = user.uid;
                FirebaseApp.firestore().collection("User").doc(uid).get()
                    .then(doc => {
                        this.setState({
                            name: doc.data().displayName,
                            avatar: doc.data().imageAva
                        })
                    })

            }
        });
    }
    CreateOrder = () => {
        this.props.CreateOrder()
        this.props.navigation.closeDrawer()
    }
    render() {
        return (
            <SafeAreaView style={GlobalStyles.droidSafeArea}>
                <TouchableOpacity
                    onPress={() => this.props.navigation.navigate('PersonalPage')}
                >
                    <View style={styles.headerContain}>
                        <View>
                            {
                                this.state.avatar.length > 0
                                    ?
                                    <Image
                                        source={{ uri: this.state.avatar }}
                                        style={styles.avatar}
                                    />
                                    :
                                    <Image
                                        source={require("../../assets/icon/user.png")}
                                        style={styles.avatar}
                                    />
                            }
                        </View>
                        <View style={styles.nameContain}>
                            <Text style={{ fontSize: 25, fontWeight: "bold" }}>
                                {this.state.name}
                            </Text>
                            <Text style={{ fontSize: 14, color: '#353b48' }}>
                                Xem Thông Tin
                            </Text>
                        </View>
                    </View>
                </TouchableOpacity>

                <View style={{
                    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
                    paddingHorizontal: 10, paddingVertical: 10,
                    backgroundColor: "#eb4d4b"
                }}>
                    <Text style={{ color: 'white' }}>
                        Xu Tích Lũy
                    </Text>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={{ fontWeight: 'bold', color: 'white' }}>
                            10
                        </Text>
                        <Image
                            source={require('../../assets/icon/dollar.png')}
                            style={{ height: 20, width: 20, marginLeft: 5 }}
                        />
                    </View>
                </View>
                <ScrollView style={{ marginTop: 10 }}>
                    <TouchableOpacity
                        style={{ marginVertical: 10, marginHorizontal: 10 }}
                        onPress={() => this.CreateOrder()}
                    >
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Image
                                source={require('../../assets/icon/plus.png')}
                                style={{ height: 35, width: 35, marginRight: 20 }}
                            />
                            <Text style={{ fontWeight: 'bold', fontSize: 18, color: "#2f3640" }}>
                                Thêm Đơn Hàng
                            </Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{ marginVertical: 10, marginHorizontal: 10 }}
                        onPress={() => { this.props.navigation.navigate("OrderManage") }}
                    >
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Image
                                source={require('../../assets/icon/gear.png')}
                                style={{ height: 35, width: 35, marginRight: 20 }}
                            />
                            <Text style={{ fontWeight: 'bold', fontSize: 18, color: "#2f3640" }}>
                                Quản Lý Đơn Hàng
                            </Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{ marginVertical: 10, marginHorizontal: 10 }}
                        onPress={() => { }}
                    >
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Image
                                source={require('../../assets/icon/bell.png')}
                                style={{ height: 35, width: 35, marginRight: 20 }}
                            />
                            <Text style={{ fontWeight: 'bold', fontSize: 18, color: "#2f3640" }}>
                                Thông Báo
                            </Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{ marginVertical: 10, marginHorizontal: 10 }}
                        onPress={() => { }}
                    >
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Image
                                source={require('../../assets/icon/help.png')}
                                style={{ height: 35, width: 35, marginRight: 20 }}
                            />
                            <Text style={{ fontWeight: 'bold', fontSize: 18, color: "#2f3640" }}>
                                Trợ Giúp
                            </Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{ marginVertical: 10, marginHorizontal: 10 }}
                        onPress={() => { }}
                    >
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Image
                                source={require('../../assets/icon/contact.png')}
                                style={{ height: 35, width: 35, marginRight: 20 }}
                            />
                            <Text style={{ fontWeight: 'bold', fontSize: 18, color: "#2f3640" }}>
                                Liên Hệ
                            </Text>
                        </View>
                    </TouchableOpacity>
                </ScrollView>
                <View>
                    <TouchableOpacity
                        onPress={() => this.props.LogOut()}
                    >
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 10, marginVertical: 10 }}>
                            <Image
                                source={require('../../assets/icon/logout.png')}
                                style={{ height: 30, width: 30 }}
                            />
                            <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'silver', marginLeft: 15 }}>
                                Đăng Xuất
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        myUserLocation: state.locationReducer.userLocation
    }
}

const mapDispatchToProps = (dispatch, props) => {
    return {
        LogOut: () => {
            FirebaseApp.auth().signOut()
                .then(() => {
                    RemoveAccount('userAccount').then(() => { console.log("Remove Token Thanh Cong cc") })
                })
                .then(() => {
                    dispatch(actResetLocation())
                })
                .then(() => {
                    dispatch(actSignOut())
                })
                .then(() => {
                    CommonActions.navigate({
                        name: "SignIn"
                    })
                })
        },
        CreateOrder: () => {
            dispatch(actCreateOrderTransport())
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Drawer)
