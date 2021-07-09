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
import * as ImagePicker from 'expo-image-picker';

import { HEIGHT_DEVICE_SCREEN, HEIGHT_DEVICE_WINDOW, WIDTH_DEVICE_WINDOW, } from '../../../constants/DeviceDimensions';

import { SetAccount, GetAccount, RemoveAccount } from '../../../api/secure/index'



export class Setting extends Component {
    constructor(props) {
        super(props)
        this.state = {
            phoneNumber: "",
            avatar: "",
            isLoading: true
        }
    }

    componentDidMount() {
        FirebaseApp.auth().onAuthStateChanged((user) => {
            if (user) {
                var uid = user.uid;
                FirebaseApp.firestore().collection("User").doc(uid).get()
                    .then(doc => {

                        console.log(doc.data())
                        this.setState({
                            avatar: doc.data().imageAva,
                            phoneNumber: doc.data().phone,
                            isLoading: !this.state.isLoading
                        })
                    })

            }
        });
    }
    pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
            base64: true
        });
        if (!result.cancelled) {
            this.setState({
                avatar: result.uri
            })
            let source = "data:image/jpeg;base64," + result.base64
            FirebaseApp.auth().onAuthStateChanged((user) => {
                if (user) {
                    var uid = user.uid;
                    FirebaseApp.firestore().collection("User").doc(uid).set({
                        imageAva: source
                    }, { merge: true });

                }
            });
        }
    };
    SaveAccount = () => {
        FirebaseApp.auth().onAuthStateChanged((user) => {
            if (user) {
                var uid = user.uid;
                FirebaseApp.firestore().collection("User").doc(uid).set({
                    phone: this.state.phoneNumber,

                }, { merge: true })
                    .then(() => {
                        this.props.navigation.goBack()
                    })
            }
        })
    }
    render() {

        return (
            <View style={{ flex: 1, marginTop: Platform.OS == 'android' ? StatusBar.currentHeight : ifIphoneX() ? 50 : 20, marginHorizontal: 10, }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: "center", height: 50 }}>
                    <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                        <View>
                            <FontAwesome5
                                name={"arrow-left"}
                                color={"black"}
                                size={30}
                            />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.SaveAccount()}>
                        <View>
                            <Text style={{ fontWeight: '700', fontSize: 20 }}>
                                Lưu
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={{ flex: 1 }}>
                    <View style={{ alignItems: 'center' }}>
                        {
                            this.state.avatar.length > 0
                                ?
                                <Image
                                    source={{ uri: this.state.avatar }}
                                    style={{ height: 200, width: 200, borderRadius: 100, marginBottom: 10 }}
                                />
                                :
                                <Image
                                    source={require("../../../assets/icon/user.png")}
                                    style={{ height: 200, width: 200, borderRadius: 100, marginBottom: 10 }}
                                />
                        }
                        <TouchableOpacity
                            onPress={() => this.pickImage()}
                        >
                            <View>
                                <Text style={{ color: '#34495e', fontWeight: '700' }}>
                                    Thay đổi ảnh đại diện
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={{ marginTop: 20 }}>
                        <View style={{ borderRadius: 10, borderWidth: 2, padding: 5, borderColor: '#34495e' }}>
                            <Text>
                                Số điện thoại
                            </Text>
                            <TextInput
                                value={this.state.phoneNumber}
                                onChangeText={(phoneNumber) => { this.setState({ phoneNumber }) }}
                                placeholder={"Nhập số điện thoại của bạn !"}
                                style={{ height: 40 }}
                            />
                        </View>
                    </View>
                    <View style={{ flex: 1, backgroundColor: 'none', justifyContent: 'flex-end', paddingBottom: 10 }}>
                        <TouchableOpacity
                            onPress={()=>this.props.LogOut()}
                        >
                            <View style={{
                                height: 50, backgroundColor: '#e74c3c', flexDirection: 'row', justifyContent: 'space-between',
                                paddingHorizontal: 10, alignItems: 'center', borderRadius: 10,
                            }}>
                                <Image
                                    source={require('../../../assets/icon/logout.png')}
                                    style={{ height: 30, width: 30 }}
                                />
                                <Text style={{ fontSize: 17, fontWeight: '900', color: 'white' }}>
                                    Đăng Xuất
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
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

export default connect(mapStateToProps, mapDispatchToProps)(Setting)
