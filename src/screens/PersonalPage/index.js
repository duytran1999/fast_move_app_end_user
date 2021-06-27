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
import { CommonActions } from '@react-navigation/native';
import HeaderBar from '../../components/HeaderBar/index'
import { connect } from 'react-redux'
import { actSignOut } from '../../actions/index'
import { actGetMyLocationString, actGetMyLocation, actGetDistanceMatrix } from '../../actions/actionLocation'
import GlobalStyles from '../../constants/GlobalStyle';

import { SetAccount, GetAccount, RemoveAccount } from '../../api/secure/index'
import { API_KEY_GOOGLE } from '../../constants/api_key'
import { HEIGHT_DEVICE_SCREEN, HEIGHT_DEVICE_WINDOW, WIDTH_DEVICE_WINDOW, } from '../../constants/DeviceDimensions';

// top: Platform.OS === 'android' ? StatusBar.currentHeight : ifIphoneX() ? 50 : 20,

export class PersonalPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
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
                            avatar: doc.data().imageAva,
                        })
                    })
            }
        });
    }
    convertTimeStampToDateJS = (timeStamp) => {
        return (timeStamp.getDate() + "/" + timeStamp.getMonth() + "/" + timeStamp.getFullYear())
    }
    goBackHomeScreen = () => {
        this.props.navigation.goBack()
    }
    render() {
        if (Platform.OS == 'android') {
            return (
                <>
                    <StatusBar backgroundColor={"#D7443E"} />
                    <SafeAreaView style={[GlobalStyles.droidSafeArea], {}}>
                        <View style={{ flex: 1 }}>
                            <View style={{ alignItems: 'center' }}>
                                <Image
                                    source={require('../../assets/picture/dating/dating1.jpg')}
                                    style={{ height: HEIGHT_DEVICE_SCREEN / 2, width: 500 }}
                                />
                            </View>
                            <View style={{
                                position: "absolute",
                                top: ifIphoneX() ? 50 : 20, left: 10
                            }}>
                                <TouchableOpacity
                                    onPress={() => this.goBackHomeScreen()}
                                >
                                    <View style={{
                                        borderRadius: 15, backgroundColor: '#f1f2f6', width: 30, height: 30,
                                        alignItems: 'center', justifyContent: 'center',
                                    }}>
                                        <FontAwesome5
                                            name="times"
                                            size={20}
                                            color={"#57606f"}
                                        />
                                    </View>
                                </TouchableOpacity>
                            </View>
                            <View style={{
                                position: "absolute",
                                top: ifIphoneX() ? 50 : 20, right: 10
                            }}>
                                <View style={{
                                    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
                                    borderRadius: 15, backgroundColor: '#f1f2f6', height: 30, paddingHorizontal: 10
                                }}>
                                    <FontAwesome5
                                        name="signal"
                                        size={20}
                                        color={"#2ed573"}
                                    />
                                    <Text style={{ marginLeft: 10, color: "#57606f", fontWeight: '600' }}>
                                        Hoạt Động
                                    </Text>
                                </View>
                            </View>

                            <View style={{
                                position: 'absolute', backgroundColor: 'white', paddingHorizontal: 20, paddingTop: 20,
                                width: WIDTH_DEVICE_WINDOW, height: HEIGHT_DEVICE_SCREEN / 2 + 90,
                                top: HEIGHT_DEVICE_SCREEN / 2 - 90, borderTopLeftRadius: 30, borderTopRightRadius: 30
                            }}>
                                <ScrollView>
                                    <View style={{ flexDirection: "row", justifyContent: 'space-between', alignItems: 'center' }}>
                                        <View>
                                            <Text style={{ fontWeight: '900', fontSize: 30 }}>
                                                {this.state.name}
                                            </Text>
                                        </View>
                                        <View>
                                            <TouchableOpacity onPress={() => this.props.navigation.navigate('SettingAccount')}>
                                                <View>
                                                    <FontAwesome5
                                                        name="user-cog"
                                                        size={25}
                                                        color={"#57606f"}
                                                    />
                                                </View>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                    <View >
                                        <View style={{ marginTop: 10 }}>
                                            <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: "#7bed9f", padding: 10, borderRadius: 10 }}>
                                                <Image
                                                    source={require('../../assets/icon/truck.png')}
                                                    style={{ width: 50, height: 50 }}
                                                />
                                                <Text style={{ fontWeight: '700', marginLeft: 10, color: 'white', fontSize: 17 }}>
                                                    Xem Tất Cả Chuyến Đi
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                </ScrollView>
                                <TouchableOpacity onPress={() => this.props.LogOut()}>
                                    <View style={{ marginBottom: 10 }}>
                                        <View style={{
                                            flexDirection: 'row', alignItems: 'center', backgroundColor: "#c7ecee",
                                            padding: 10, borderRadius: 10, height: 70
                                        }}>
                                            <Image
                                                source={require('../../assets/icon/logout.png')}
                                                style={{ width: 40, height: 40 }}
                                            />
                                            <Text style={{ fontWeight: '700', marginLeft: 10, color: 'white', fontSize: 17 }}>
                                                Đăng Xuất
                                            </Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </SafeAreaView>
                </>
            )
        }
        return (
            <>
                <StatusBar hidden={true} />
                <View style={{ flex: 1 }}>
                    <View style={{ alignItems: 'center' }}>
                        <Image
                            source={require('../../assets/picture/dating/dating1.jpg')}
                            style={{ height: HEIGHT_DEVICE_SCREEN / 2, width: 500 }}
                        />
                    </View>
                    <View style={{
                        position: "absolute",
                        top: ifIphoneX() ? 50 : 20, left: 10
                    }}>
                        <TouchableOpacity
                            onPress={() => this.goBackHomeScreen()}
                        >
                            <View style={{
                                borderRadius: 15, backgroundColor: '#f1f2f6', width: 30, height: 30,
                                alignItems: 'center', justifyContent: 'center',
                            }}>
                                <FontAwesome5
                                    name="times"
                                    size={20}
                                    color={"#57606f"}
                                />
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={{
                        position: "absolute",
                        top: ifIphoneX() ? 50 : 20, right: 10
                    }}>
                        <View style={{
                            flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
                            borderRadius: 15, backgroundColor: '#f1f2f6', height: 30, paddingHorizontal: 10
                        }}>
                            <FontAwesome5
                                name="signal"
                                size={20}
                                color={"#2ed573"}
                            />
                            <Text style={{ marginLeft: 10, color: "#57606f", fontWeight: '600' }}>
                                Hoạt Động
                            </Text>
                        </View>
                    </View>

                    <View style={{
                        position: 'absolute', backgroundColor: 'white', paddingHorizontal: 20, paddingTop: 20,
                        width: WIDTH_DEVICE_WINDOW, height: HEIGHT_DEVICE_SCREEN / 2 + 90,
                        top: HEIGHT_DEVICE_SCREEN / 2 - 90, borderTopLeftRadius: 30, borderTopRightRadius: 30
                    }}>
                        <ScrollView>
                            <View style={{ flexDirection: "row", justifyContent: 'space-between', alignItems: 'center' }}>
                                <View>
                                    <Text style={{ fontWeight: '900', fontSize: 30 }}>
                                        {this.state.name}
                                    </Text>
                                </View>
                                <View>
                                    <TouchableOpacity onPress={() => this.props.navigation.navigate('SettingAccount')}>
                                        <View>
                                            <FontAwesome5
                                                name="user-cog"
                                                size={25}
                                                color={"#57606f"}
                                            />
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View >
                                <View style={{ marginTop: 10 }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: "#7bed9f", padding: 10, borderRadius: 10 }}>
                                        <Image
                                            source={require('../../assets/icon/truck.png')}
                                            style={{ width: 50, height: 50 }}
                                        />
                                        <Text style={{ fontWeight: '700', marginLeft: 10, color: 'white', fontSize: 17 }}>
                                            Xem Tất Cả Chuyến Đi
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </ScrollView>
                        <TouchableOpacity onPress={() => this.props.LogOut()}>
                            <View style={{ marginBottom: 10 }}>
                                <View style={{
                                    flexDirection: 'row', alignItems: 'center', backgroundColor: "#c7ecee",
                                    padding: 10, borderRadius: 10, height: 70
                                }}>
                                    <Image
                                        source={require('../../assets/icon/logout.png')}
                                        style={{ width: 40, height: 40 }}
                                    />
                                    <Text style={{ fontWeight: '700', marginLeft: 10, color: 'white', fontSize: 17 }}>
                                        Đăng Xuất
                                    </Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </>
        )
    }
}

const mapStateToProps = (state) => ({

})

const mapDispatchToProps = (dispatch, props) => {
    return {
        LogOut: () => {
            FirebaseApp.auth().signOut()
                .then(() => {
                    RemoveAccount('userAccount').then(() => { console.log("Remove Token Thanh Cong cc") })
                })
                .then(() => {
                    dispatch(actSignOut())
                })
                .then(() => {
                    CommonActions.navigate({
                        name: "SignIn"
                    })
                })
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PersonalPage)
