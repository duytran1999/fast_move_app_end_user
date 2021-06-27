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
import * as ImagePicker from 'expo-image-picker';

import { FirebaseApp } from '../../api/firebase/index'
import { CommonActions } from '@react-navigation/native';
import HeaderBar from '../../components/HeaderBar/index'
import { connect } from 'react-redux'
import { actSignOut } from '../../actions/index'
import { actGetMyLocationString, actGetMyLocation, actGetDistanceMatrix } from '../../actions/actionLocation'
import GlobalStyles from '../../constants/GlobalStyle';

import DateTimePickerModal from "react-native-modal-datetime-picker";
import { SetAccount, GetAccount, RemoveAccount } from '../../api/secure/index'
import { API_KEY_GOOGLE } from '../../constants/api_key'
import { HEIGHT_DEVICE_SCREEN, HEIGHT_DEVICE_WINDOW, WIDTH_DEVICE_WINDOW, } from '../../constants/DeviceDimensions';
import moment from 'moment'

export class SettingAccount extends Component {
    constructor(props) {
        super(props)
        this.state = {
            name: "",
            birthday: "",
            email: "",
            showPicker: false,
            avatar: "",
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
                            name: doc.data().displayName,
                            email: doc.data().email,
                            avatar: doc.data().imageAva,
                            birthday: doc.data().dateOfBirth
                        })
                    })

            }
        });
    }
    goBackHomeScreen = () => {
        this.props.navigation.goBack()
    }
    hideDatePicker() {
        this.setState({
            showPicker: false
        })
    };
    handleConfirm = (date) => {
        this.setState({
            birthday: date
        })
        this.hideDatePicker();
    }
    SaveAccount = () => {
        console.log(this.state)
        FirebaseApp.auth().onAuthStateChanged((user) => {
            if (user) {
                var uid = user.uid;
                FirebaseApp.firestore().collection("User").doc(uid).set({
                    displayName: this.state.name,
                    dateOfBirth: this.state.birthday,
                    email: this.state.email
                }, { merge: true });

            }
        });
        this.goBackHomeScreen()
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
    render() {
        return (
            <View style={{ marginTop: Platform.OS == 'android' ? 20 : ifIphoneX() ? 50 : 20 }}>
                <ScrollView>
                    <View style={{ marginHorizontal: 10, justifyContent: 'space-between', flexDirection: 'row' }}>
                        <TouchableOpacity
                            onPress={() => this.goBackHomeScreen()}
                        >
                            <View style={{
                                borderRadius: 15, backgroundColor: '#ecf0f1',
                                width: 30, height: 30,
                                alignItems: 'center', justifyContent: 'center',
                            }}>
                                <FontAwesome5
                                    name="times"
                                    size={20}
                                    color={"#57606f"}
                                />
                            </View>
                        </TouchableOpacity>
                        {/* #ecf0f1 */}
                        <TouchableOpacity
                            onPress={() => this.SaveAccount()}
                        >
                            <View style={{
                                borderRadius: 15, backgroundColor: '#ecf0f1',
                                width: 50, height: 30,
                                alignItems: 'center', justifyContent: 'center',
                            }}>
                                <Text style={{ color: '#57606f', fontWeight: '700' }}>
                                    Lưu
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View>
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
                                        source={require("../../assets/icon/user.png")}
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
                        <View style={{ marginHorizontal: 10, marginTop: 20 }}>
                            <View style={{ height: 50, backgroundColor: "#ecf0f1", marginBottom: 10 }}>
                                <TextInput
                                    state={this.state.name}
                                    onChangeText={(name) => this.setState({ name })}
                                    placeholder={this.state.name}
                                    style={{ fontSize: 20 }}
                                />
                            </View>
                            <View style={{ height: 50, backgroundColor: "#ecf0f1", marginBottom: 10 }}>
                                {
                                    this.state.showPicker == true
                                        ?
                                        <DateTimePickerModal
                                            isVisible={this.state.showPicker}
                                            mode="date"
                                            onConfirm={(birthday) => {
                                                this.handleConfirm(moment(birthday).format('YYYY-MM-DD'))
                                                this.hideDatePicker()
                                            }}
                                            onCancel={() => this.hideDatePicker()}
                                        />
                                        :
                                        <TouchableOpacity onPress={() => this.setState({ showPicker: !this.state.showPicker })}>
                                            <View>
                                                <Text style={{ color: '#bdc3c7', fontSize: 20 }}>
                                                    {this.state.birthday}
                                                </Text>
                                            </View>
                                        </TouchableOpacity>

                                }
                            </View>
                            <View style={{ height: 50, backgroundColor: "#ecf0f1", marginBottom: 10 }}>
                                <TextInput
                                    state={this.state.email}
                                    onChangeText={(email) => this.setState({ email })}
                                    placeholder={this.state.email}
                                    style={{ fontSize: 20 }}
                                />
                            </View>

                        </View>
                    </View>
                </ScrollView>
            </View >
        )
    }
}

const mapStateToProps = (state) => ({

})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(SettingAccount)
