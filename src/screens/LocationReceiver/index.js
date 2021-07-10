import React, { Component } from 'react'
import {
    Text, View, TouchableOpacity, SafeAreaView, StyleSheet, StatusBar, FlatList, Image, Platform, TextInput, TouchableWithoutFeedback, Keyboard, ScrollView, Alert,
    KeyboardAvoidingView
} from 'react-native'
import { ifIphoneX } from 'react-native-iphone-x-helper'
import ViewPager from '@react-native-community/viewpager';
import { connect } from 'react-redux'
import HeaderBar from '../../components/HeaderBar'
import { WIDTH_DEVICE_SCREEN, HEIGHT_DEVICE_SCREEN, HEIGHT_DEVICE_WINDOW } from '../../constants/DeviceDimensions'
import GlobalStyles from '../../constants/GlobalStyle'
import * as Location from 'expo-location';
import { actGetMyLocationString, actGetLocationReceiver } from '../../actions/actionLocation'
import Map from '../Map/index'

export class LocationReceiver extends Component {
    constructor(props) {
        super(props)
        this.state = {
            pageInitial: 0,
            locationString: "",
            locationStringSet: "",
            locationCoords: "",
            detailLocation: '',
            nameReceiver: "",
            phoneReceiver: "",
            bool1: false,
            bool2: false,
            navigateMap: false,
        }
    }
    renderLocation = (locationString) => {
        return locationString.street + " " + locationString.district + " " + locationString.subregion + " " + locationString.city
    }

    async componentDidMount() {

        try {
            let locationString = await Location.reverseGeocodeAsync(this.props.route.params.coords)

            this.setState({
                locationString: locationString['0'],
                locationStringSet: locationString['0']
            })
        } catch (error) {
            console.log(error)
        }
    }
    changeNavigateMap = () => {
        this.setState({
            navigateMap: false
        })
    }
    setLocation = async (coords) => {
        try {
            let locationString = await Location.reverseGeocodeAsync(coords)

            this.setState({
                locationStringSet: locationString['0'],
                locationCoords: coords
            })
        } catch (error) {
            console.log(error)
        }
        console.log(coords)
    }
    confirmLocation = () => {
        this.setState({
            locationString: this.state.locationStringSet,

        })
        console.log("final location")
        console.log(this.state.locationCoords)
    }
    goBackHomeScreen = () => {
        let { nameReceiver, phoneReceiver } = this.state
        if (nameReceiver.length == 0 || phoneReceiver.length == 0) {
            Alert.alert(
                "Thông Báo",
                "Vui lòng điền đẩy đủ thông tin người nhận",
                [
                    {
                        text: "Vẫn Rời Đi",
                        onPress: () => this.props.navigation.goBack(),
                        style: "cancel"
                    },
                    { text: "OK", onPress: () => console.log("OK Pressed") }
                ]
            );
        }
        else {
            this.props.navigation.goBack()
        }
    }
    confirmLocationReceiver = () => {
        if (this.state.locationCoords.length == 0 || this.state.detailLocation.length == 0) {
            Alert.alert(
                "Thông Báo",
                "Vui lòng điền đẩy đủ địa chỉ",
                [
                    {
                        text: "Vẫn Rời Đi",
                        onPress: () => this.props.navigation.goBack(),
                        style: "cancel"
                    },
                    { text: "OK", onPress: () => console.log("OK Pressed") }
                ]
            );
        }
        else {
            console.log("asdasdasd")
            this.nextPage(this.state.pageInitial)
        }
    }
    confirmLocationReceiverFinish = () => {
        let { nameReceiver, phoneReceiver } = this.state
        if (nameReceiver.length == 0 || phoneReceiver.length == 0) {
            Alert.alert(
                "Thông Báo",
                "Vui lòng điền đẩy đủ thông tin người nhận",
                [
                    {
                        text: "Vẫn Rời Đi",
                        onPress: () => this.props.navigation.goBack(),
                        style: "cancel"
                    },
                    { text: "OK", onPress: () => console.log("OK Pressed") }
                ]
            );
        }
        else {
            let { locationString, locationCoords, detailLocation, nameReceiver, phoneReceiver } = this.state
            //console.log(locationString, locationCoords, detailLocation, nameSender, phoneSender)
            this.props.SetLocationReceiver(locationString, locationCoords, { detailLocation, nameReceiver, phoneReceiver })
            this.props.navigation.goBack()
        }
    }
    nextPage(pageNow) {
        this.viewPager.setPage(pageNow + 1)
        this.setState({
            pageInitial: pageNow + 1
        })
    }
    previousPage = () => {
        this.viewPager.setPage(0)
        console.log("cascascascascasc")
        this.setState({
            pageInitial: 0
        })
    }
    render() {
        if (this.state.navigateMap === false) {
            if (Platform.OS == 'android') {
                return (
                    < >
                        <StatusBar backgroundColor={"#D7443E"} />
                        <SafeAreaView style={GlobalStyles.droidSafeArea}>
                            <ViewPager
                                style={{ flex: 1 }}
                                initialPage={this.state.pageInitial}
                                scrollEnabled={false}
                                ref={(viewPager) => { this.viewPager = viewPager }}
                            >
                                <View style={{ flex: 1, }}>
                                    <View style={{ backgroundColor: "#ecf0f1" }}>
                                        <HeaderBar
                                            goBackHomeScreen={this.goBackHomeScreen}
                                            name={"Địa Chỉ Người Nhận"}
                                        />

                                        <View>
                                            <Text style={{ fontSize: 10, color: "#7f8c8d", paddingHorizontal: 10, paddingVertical: 5 }}>
                                                Địa chỉ nhận hàng
                                            </Text>
                                        </View>

                                        <View style={{ backgroundColor: 'white', paddingHorizontal: 10, paddingVertical: 5 }}>
                                            <TouchableOpacity
                                                onPress={() => this.setState({
                                                    navigateMap: true
                                                })}
                                            >
                                                <View style={{
                                                    flexDirection: 'row',
                                                    height: 90, alignItems: 'center', marginTop: 5,
                                                    width: WIDTH_DEVICE_SCREEN - 20 - 20
                                                }} >
                                                    <View
                                                        style={{
                                                            width: 10, height: 10, borderRadius: 5,
                                                            backgroundColor: 'blue', marginRight: 10
                                                        }}
                                                    />
                                                    <View>
                                                        <Text style={{ fontSize: 15, fontWeight: 'bold' }}
                                                            numberOfLines={2}>
                                                            {
                                                                this.state.locationString === ''
                                                                    ?
                                                                    null
                                                                    :
                                                                    this.renderLocation(this.state.locationString)
                                                            }
                                                        </Text>
                                                    </View>
                                                </View>
                                            </TouchableOpacity>
                                            <View style={{
                                                borderRadius: 10, borderWidth: 1, borderColor: "#bdc3c7",
                                                height: 40, justifyContent: 'space-between', paddingHorizontal: 10,
                                                marginBottom: 5,
                                                flexDirection: 'row', alignItems: 'center'
                                            }}>
                                                <TextInput
                                                    placeholder="Thêm địa chỉ cụ thể "
                                                    value={this.state.detailLocation}
                                                    onChangeText={(detailLocation) => { this.setState({ detailLocation }) }}
                                                />
                                                {
                                                    this.state.detailLocation.length > 0
                                                        ?
                                                        <TouchableOpacity onPress={() => this.setState({
                                                            detailLocation: ""
                                                        })}>
                                                            <View>
                                                                <Image
                                                                    source={require('../../assets/icon/error.png')}
                                                                    style={{ width: 20, height: 20 }}
                                                                />
                                                            </View>
                                                        </TouchableOpacity>
                                                        :
                                                        null
                                                }
                                            </View>
                                        </View>
                                        <View>
                                            <Text style={{ fontSize: 10, color: "#7f8c8d", paddingHorizontal: 10, paddingVertical: 5 }}>
                                                Địa chỉ trước đó
                                            </Text>
                                        </View>
                                        <View style={{ backgroundColor: 'white', paddingHorizontal: 10 }}>
                                            <Text>
                                             
                                            </Text>
                                        </View>
                                        <View>

                                        </View>
                                    </View>
                                    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                        <TouchableWithoutFeedback
                                            onPress={() => this.confirmLocationReceiver()}
                                        >
                                            <View style={{
                                                width: WIDTH_DEVICE_SCREEN - 10,
                                                height: HEIGHT_DEVICE_SCREEN / 12,
                                                backgroundColor: this.state.locationCoords.length == 0 || this.state.detailLocation.length == 0 ? "#95afc0" : '#D7443E',
                                                borderRadius: 20,
                                                alignItems: 'center', justifyContent: 'center'
                                            }}>
                                                <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold', textDecorationLine: 'underline' }}>
                                                    {this.state.locationCoords.length == 0 || this.state.detailLocation.length == 0 ? "Tiếp Tục" : 'Xác Nhận'}
                                                </Text>
                                            </View>
                                        </TouchableWithoutFeedback>
                                    </View>
                                </View>
                                <View style={{ flex: 1 }}>
                                    <View style={{ backgroundColor: "#ecf0f1" }}>
                                        <HeaderBar
                                            goBackHomeScreen={this.previousPage}
                                            name={"Địa Chỉ Người Nhận"}
                                        />
                                        <View>
                                            <Text style={{ fontSize: 10, color: "#7f8c8d", paddingHorizontal: 10, paddingVertical: 5 }}>
                                                Địa chỉ nhận hàng
                                            </Text>
                                        </View>
                                        <View style={{ backgroundColor: 'white', paddingHorizontal: 10, paddingVertical: 5 }}>
                                            <TouchableOpacity
                                                onPress={() => this.setState({
                                                    navigateMap: true
                                                })}
                                            >
                                                <View style={{
                                                    flexDirection: 'row',
                                                    height: 90, alignItems: 'center', marginTop: 5,
                                                    width: WIDTH_DEVICE_SCREEN - 20 - 20
                                                }} >
                                                    <View
                                                        style={{
                                                            width: 10, height: 10, borderRadius: 5,
                                                            backgroundColor: 'blue', marginRight: 10
                                                        }}
                                                    />
                                                    <View>
                                                        <Text style={{ fontSize: 15, fontWeight: 'bold' }}
                                                            numberOfLines={2}>
                                                            {
                                                                this.state.locationString === ''
                                                                    ?
                                                                    null
                                                                    :
                                                                    this.renderLocation(this.state.locationString)
                                                            }
                                                        </Text>
                                                    </View>
                                                </View>
                                            </TouchableOpacity>
                                            <View style={{
                                                borderRadius: 10, borderWidth: 1, borderColor: "#bdc3c7",
                                                height: 40, justifyContent: 'space-between', paddingHorizontal: 10,
                                                marginBottom: 5,
                                                flexDirection: 'row', alignItems: 'center'
                                            }}>
                                                <TextInput
                                                    placeholder="Thêm địa chỉ cụ thể "
                                                    value={this.state.detailLocation}
                                                    onChangeText={(detailLocation) => { this.setState({ detailLocation }) }}
                                                />
                                                {
                                                    this.state.detailLocation.length > 0
                                                        ?
                                                        <TouchableOpacity onPress={() => this.setState({
                                                            detailLocation: ""
                                                        })}>
                                                            <View>
                                                                <Image
                                                                    source={require('../../assets/icon/error.png')}
                                                                    style={{ width: 20, height: 20 }}
                                                                />
                                                            </View>
                                                        </TouchableOpacity>
                                                        :
                                                        null
                                                }
                                            </View>
                                        </View>
                                        <View style={{ backgroundColor: 'white', paddingHorizontal: 10, paddingVertical: 5, marginTop: 10 }}>
                                            {
                                                this.state.bool1 === false
                                                    ?
                                                    <TouchableOpacity
                                                        onPress={() => this.setState({
                                                            bool1: true
                                                        })}
                                                    >
                                                        <View style={{
                                                            borderRadius: 5, borderWidth: 1,
                                                            borderColor: "#636e72",
                                                            padding: 5, height: 60, justifyContent: 'center'
                                                        }}>
                                                            <Text style={{ fontSize: 15, color: "#636e72", fontWeight: "bold" }}>
                                                                {
                                                                    this.state.nameReceiver.length > 0
                                                                        ?
                                                                        this.state.nameReceiver
                                                                        :
                                                                        "Tên Người Nhận"
                                                                }
                                                            </Text>
                                                        </View>
                                                    </TouchableOpacity>
                                                    :
                                                    <View style={{
                                                        borderRadius: 5, borderWidth: this.state.bool1 === true ? 2 : 1,
                                                        borderColor: this.state.bool1 === true ? "#D7443E" : "#636e72",
                                                        padding: 5, height: 60
                                                    }}>
                                                        <Text style={{ fontSize: 14, color: "#D7443E" }}>
                                                            Tên Người Nhận
                                                        </Text>
                                                        <View style={{
                                                            flexDirection: 'row',
                                                            justifyContent: 'space-between', alignItems: 'center'
                                                        }}>
                                                            <TextInput
                                                                value={this.state.nameReceiver}
                                                                placeholder="Nhập tên người nhận"
                                                                onChangeText={(nameReceiver) => this.setState({ nameReceiver })}
                                                                autoFocus={this.state.bool1}
                                                                onEndEditing={() => this.setState({ bool1: false })}
                                                                style={{ width: WIDTH_DEVICE_SCREEN - 90 }}
                                                            />
                                                            <TouchableOpacity onPress={() => {
                                                            }}>
                                                                <View>
                                                                    <Image
                                                                        source={require('../../assets/icon/error.png')}
                                                                        style={{ width: 20, height: 20 }}
                                                                    />
                                                                </View>
                                                            </TouchableOpacity>
                                                        </View>
                                                    </View>
                                            }
                                            <View style={{ marginTop: 10 }}>
                                                {
                                                    this.state.bool2 === false
                                                        ?
                                                        <TouchableOpacity
                                                            onPress={() => this.setState({
                                                                bool2: true
                                                            })}
                                                        >
                                                            <View style={{
                                                                borderRadius: 5, borderWidth: 1,
                                                                borderColor: "#636e72",
                                                                padding: 5, height: 60, justifyContent: 'center'
                                                            }}>
                                                                <Text style={{ fontSize: 15, color: "#636e72", fontWeight: "bold" }}>
                                                                    {
                                                                        this.state.phoneReceiver.length > 0
                                                                            ?
                                                                            this.state.phoneReceiver
                                                                            :
                                                                            "Số Điện Thoại"
                                                                    }
                                                                </Text>
                                                            </View>
                                                        </TouchableOpacity>
                                                        :
                                                        <View style={{
                                                            borderRadius: 5, borderWidth: this.state.bool2 === true ? 2 : 1,
                                                            borderColor: this.state.bool2 === true ? "#D7443E" : "#636e72",
                                                            padding: 5, height: 60
                                                        }}>
                                                            <Text style={{ fontSize: 14, color: "#D7443E" }}>
                                                                Số Điện Thoại
                                                            </Text>
                                                            <View style={{
                                                                flexDirection: 'row',
                                                                justifyContent: 'space-between', alignItems: 'center'
                                                            }}>
                                                                <TextInput
                                                                    value={this.state.phoneReceiver}
                                                                    placeholder="Nhập số điện thoại"
                                                                    onChangeText={(phoneReceiver) => this.setState({ phoneReceiver })}
                                                                    autoFocus={this.state.bool2}
                                                                    onEndEditing={() => this.setState({ bool2: false })}
                                                                    keyboardType='numeric'
                                                                />
                                                                {
                                                                    this.state.phoneReceiver.length > 0
                                                                        ?
                                                                        <TouchableOpacity onPress={() => this.setState({
                                                                            phoneReceiver: ""
                                                                        })}>
                                                                            <View>
                                                                                <Image
                                                                                    source={require('../../assets/icon/error.png')}
                                                                                    style={{ width: 20, height: 20 }}
                                                                                />
                                                                            </View>
                                                                        </TouchableOpacity>
                                                                        :
                                                                        null
                                                                }
                                                            </View>
                                                        </View>
                                                }
                                            </View>
                                        </View>
                                        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                            <TouchableWithoutFeedback
                                                onPress={() => this.confirmLocationReceiverFinish()}
                                            >
                                                <View style={{
                                                    width: WIDTH_DEVICE_SCREEN - 10,
                                                    height: HEIGHT_DEVICE_SCREEN / 12,
                                                    backgroundColor: this.state.locationCoords.length == 0 || this.state.detailLocation.length == 0 ? "#95afc0" : '#D7443E',
                                                    borderRadius: 20,
                                                    alignItems: 'center', justifyContent: 'center'
                                                }}>
                                                    <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold', textDecorationLine: 'underline' }}>
                                                        {this.state.locationCoords.length == 0 || this.state.detailLocation.length == 0 ? "Tiếp Tục" : 'Xác Nhận'}
                                                    </Text>
                                                </View>
                                            </TouchableWithoutFeedback>
                                        </View>
                                    </View>
                                </View>
                            </ViewPager>
                        </SafeAreaView>
                    </ >
                )
            }
            if (Platform.OS == 'ios') {
                return (
                    <>
                        <View style={{ height: ifIphoneX() ? 50 : 20, backgroundColor: '#D7443E' }} />
                        <View style={{flex:1}}>
                            <ViewPager
                                style={{ flex: 1 }}
                                initialPage={this.state.pageInitial}
                                scrollEnabled={false}
                                ref={(viewPager) => { this.viewPager = viewPager }}
                            >
                                <View style={{ flex: 1, }}>
                                    <View style={{ backgroundColor: "#ecf0f1" }}>
                                        <HeaderBar
                                            goBackHomeScreen={this.goBackHomeScreen}
                                            name={"Địa Chỉ Người Nhận"}
                                        />

                                        <View>
                                            <Text style={{ fontSize: 10, color: "#7f8c8d", paddingHorizontal: 10, paddingVertical: 5 }}>
                                                Địa chỉ nhận hàng
                                            </Text>
                                        </View>

                                        <View style={{ backgroundColor: 'white', paddingHorizontal: 10, paddingVertical: 5 }}>
                                            <TouchableOpacity
                                                onPress={() => this.setState({
                                                    navigateMap: true
                                                })}
                                            >
                                                <View style={{
                                                    flexDirection: 'row',
                                                    height: 90, alignItems: 'center', marginTop: 5,
                                                    width: WIDTH_DEVICE_SCREEN - 20 - 20
                                                }} >
                                                    <View
                                                        style={{
                                                            width: 10, height: 10, borderRadius: 5,
                                                            backgroundColor: 'blue', marginRight: 10
                                                        }}
                                                    />
                                                    <View>
                                                        <Text style={{ fontSize: 15, fontWeight: 'bold' }}
                                                            numberOfLines={2}>
                                                            {
                                                                this.state.locationString === ''
                                                                    ?
                                                                    null
                                                                    :
                                                                    this.renderLocation(this.state.locationString)
                                                            }
                                                        </Text>
                                                    </View>
                                                </View>
                                            </TouchableOpacity>
                                            <View style={{
                                                borderRadius: 10, borderWidth: 1, borderColor: "#bdc3c7",
                                                height: 40, justifyContent: 'space-between', paddingHorizontal: 10,
                                                marginBottom: 5,
                                                flexDirection: 'row', alignItems: 'center'
                                            }}>
                                                <TextInput
                                                    placeholder="Thêm địa chỉ cụ thể "
                                                    value={this.state.detailLocation}
                                                    onChangeText={(detailLocation) => { this.setState({ detailLocation }) }}
                                                />
                                                {
                                                    this.state.detailLocation.length > 0
                                                        ?
                                                        <TouchableOpacity onPress={() => this.setState({
                                                            detailLocation: ""
                                                        })}>
                                                            <View>
                                                                <Image
                                                                    source={require('../../assets/icon/error.png')}
                                                                    style={{ width: 20, height: 20 }}
                                                                />
                                                            </View>
                                                        </TouchableOpacity>
                                                        :
                                                        null
                                                }
                                            </View>
                                        </View>
                                        <View>
                                            <Text style={{ fontSize: 10, color: "#7f8c8d", paddingHorizontal: 10, paddingVertical: 5 }}>
                                                Địa chỉ trước đó
                                            </Text>
                                        </View>
                                        <View style={{ backgroundColor: 'white', paddingHorizontal: 10 }}>
                                            <Text>
                                           
                                            </Text>
                                        </View>
                                        <View>

                                        </View>
                                    </View>
                                    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                        <TouchableWithoutFeedback
                                            onPress={() => this.confirmLocationReceiver()}
                                        >
                                            <View style={{
                                                width: WIDTH_DEVICE_SCREEN - 10,
                                                height: HEIGHT_DEVICE_SCREEN / 12,
                                                backgroundColor: this.state.locationCoords.length == 0 || this.state.detailLocation.length == 0 ? "#95afc0" : '#D7443E',
                                                borderRadius: 20,
                                                alignItems: 'center', justifyContent: 'center'
                                            }}>
                                                <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold', textDecorationLine: 'underline' }}>
                                                    {this.state.locationCoords.length == 0 || this.state.detailLocation.length == 0 ? "Tiếp Tục" : 'Xác Nhận'}
                                                </Text>
                                            </View>
                                        </TouchableWithoutFeedback>
                                    </View>
                                </View>
                                <View style={{ flex: 1 }}>
                                    <View style={{ backgroundColor: "#ecf0f1" }}>
                                        <HeaderBar
                                            goBackHomeScreen={this.previousPage}
                                            name={"Địa Chỉ Người Nhận"}
                                        />
                                        <View>
                                            <Text style={{ fontSize: 10, color: "#7f8c8d", paddingHorizontal: 10, paddingVertical: 5 }}>
                                                Địa chỉ nhận hàng
                                            </Text>
                                        </View>
                                        <View style={{ backgroundColor: 'white', paddingHorizontal: 10, paddingVertical: 5 }}>
                                            <TouchableOpacity
                                                onPress={() => this.setState({
                                                    navigateMap: true
                                                })}
                                            >
                                                <View style={{
                                                    flexDirection: 'row',
                                                    height: 90, alignItems: 'center', marginTop: 5,
                                                    width: WIDTH_DEVICE_SCREEN - 20 - 20
                                                }} >
                                                    <View
                                                        style={{
                                                            width: 10, height: 10, borderRadius: 5,
                                                            backgroundColor: 'blue', marginRight: 10
                                                        }}
                                                    />
                                                    <View>
                                                        <Text style={{ fontSize: 15, fontWeight: 'bold' }}
                                                            numberOfLines={2}>
                                                            {
                                                                this.state.locationString === ''
                                                                    ?
                                                                    null
                                                                    :
                                                                    this.renderLocation(this.state.locationString)
                                                            }
                                                        </Text>
                                                    </View>
                                                </View>
                                            </TouchableOpacity>
                                            <View style={{
                                                borderRadius: 10, borderWidth: 1, borderColor: "#bdc3c7",
                                                height: 40, justifyContent: 'space-between', paddingHorizontal: 10,
                                                marginBottom: 5,
                                                flexDirection: 'row', alignItems: 'center'
                                            }}>
                                                <TextInput
                                                    placeholder="Thêm địa chỉ cụ thể "
                                                    value={this.state.detailLocation}
                                                    onChangeText={(detailLocation) => { this.setState({ detailLocation }) }}
                                                />
                                                {
                                                    this.state.detailLocation.length > 0
                                                        ?
                                                        <TouchableOpacity onPress={() => this.setState({
                                                            detailLocation: ""
                                                        })}>
                                                            <View>
                                                                <Image
                                                                    source={require('../../assets/icon/error.png')}
                                                                    style={{ width: 20, height: 20 }}
                                                                />
                                                            </View>
                                                        </TouchableOpacity>
                                                        :
                                                        null
                                                }
                                            </View>
                                        </View>
                                        <View style={{ backgroundColor: 'white', paddingHorizontal: 10, paddingVertical: 5, marginTop: 10 }}>
                                            {
                                                this.state.bool1 === false
                                                    ?
                                                    <TouchableOpacity
                                                        onPress={() => this.setState({
                                                            bool1: true
                                                        })}
                                                    >
                                                        <View style={{
                                                            borderRadius: 5, borderWidth: 1,
                                                            borderColor: "#636e72",
                                                            padding: 5, height: 60, justifyContent: 'center'
                                                        }}>
                                                            <Text style={{ fontSize: 15, color: "#636e72", fontWeight: "bold" }}>
                                                                {
                                                                    this.state.nameReceiver.length > 0
                                                                        ?
                                                                        this.state.nameReceiver
                                                                        :
                                                                        "Tên Người Nhận"
                                                                }
                                                            </Text>
                                                        </View>
                                                    </TouchableOpacity>
                                                    :
                                                    <View style={{
                                                        borderRadius: 5, borderWidth: this.state.bool1 === true ? 2 : 1,
                                                        borderColor: this.state.bool1 === true ? "#D7443E" : "#636e72",
                                                        padding: 5, height: 60
                                                    }}>
                                                        <Text style={{ fontSize: 14, color: "#D7443E" }}>
                                                            Tên Người Nhận
                                                        </Text>
                                                        <View style={{
                                                            flexDirection: 'row',
                                                            justifyContent: 'space-between', alignItems: 'center'
                                                        }}>
                                                            <TextInput
                                                                value={this.state.nameReceiver}
                                                                placeholder="Nhập tên người nhận"
                                                                onChangeText={(nameReceiver) => this.setState({ nameReceiver })}
                                                                autoFocus={this.state.bool1}
                                                                onEndEditing={() => this.setState({ bool1: false })}
                                                                style={{ width: WIDTH_DEVICE_SCREEN - 90 }}
                                                            />
                                                            <TouchableOpacity onPress={() => {
                                                            }}>
                                                                <View>
                                                                    <Image
                                                                        source={require('../../assets/icon/error.png')}
                                                                        style={{ width: 20, height: 20 }}
                                                                    />
                                                                </View>
                                                            </TouchableOpacity>
                                                        </View>
                                                    </View>
                                            }
                                            <View style={{ marginTop: 10 }}>
                                                {
                                                    this.state.bool2 === false
                                                        ?
                                                        <TouchableOpacity
                                                            onPress={() => this.setState({
                                                                bool2: true
                                                            })}
                                                        >
                                                            <View style={{
                                                                borderRadius: 5, borderWidth: 1,
                                                                borderColor: "#636e72",
                                                                padding: 5, height: 60, justifyContent: 'center'
                                                            }}>
                                                                <Text style={{ fontSize: 15, color: "#636e72", fontWeight: "bold" }}>
                                                                    {
                                                                        this.state.phoneReceiver.length > 0
                                                                            ?
                                                                            this.state.phoneReceiver
                                                                            :
                                                                            "Số Điện Thoại"
                                                                    }
                                                                </Text>
                                                            </View>
                                                        </TouchableOpacity>
                                                        :
                                                        <View style={{
                                                            borderRadius: 5, borderWidth: this.state.bool2 === true ? 2 : 1,
                                                            borderColor: this.state.bool2 === true ? "#D7443E" : "#636e72",
                                                            padding: 5, height: 60
                                                        }}>
                                                            <Text style={{ fontSize: 14, color: "#D7443E" }}>
                                                                Số Điện Thoại
                                                            </Text>
                                                            <View style={{
                                                                flexDirection: 'row',
                                                                justifyContent: 'space-between', alignItems: 'center'
                                                            }}>
                                                                <TextInput
                                                                    value={this.state.phoneReceiver}
                                                                    placeholder="Nhập số điện thoại"
                                                                    onChangeText={(phoneReceiver) => this.setState({ phoneReceiver })}
                                                                    autoFocus={this.state.bool2}
                                                                    onEndEditing={() => this.setState({ bool2: false })}
                                                                    keyboardType='numeric'
                                                                />
                                                                {
                                                                    this.state.phoneReceiver.length > 0
                                                                        ?
                                                                        <TouchableOpacity onPress={() => this.setState({
                                                                            phoneReceiver: ""
                                                                        })}>
                                                                            <View>
                                                                                <Image
                                                                                    source={require('../../assets/icon/error.png')}
                                                                                    style={{ width: 20, height: 20 }}
                                                                                />
                                                                            </View>
                                                                        </TouchableOpacity>
                                                                        :
                                                                        null
                                                                }
                                                            </View>
                                                        </View>
                                                }
                                            </View>
                                        </View>
                                        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                            <TouchableWithoutFeedback
                                                onPress={() => this.confirmLocationReceiverFinish()}
                                            >
                                                <View style={{
                                                    width: WIDTH_DEVICE_SCREEN - 10,
                                                    height: HEIGHT_DEVICE_SCREEN / 12,
                                                    backgroundColor: this.state.locationCoords.length == 0 || this.state.detailLocation.length == 0 ? "#95afc0" : '#D7443E',
                                                    borderRadius: 20,
                                                    alignItems: 'center', justifyContent: 'center'
                                                }}>
                                                    <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold', textDecorationLine: 'underline' }}>
                                                        {this.state.locationCoords.length == 0 || this.state.detailLocation.length == 0 ? "Tiếp Tục" : 'Xác Nhận'}
                                                    </Text>
                                                </View>
                                            </TouchableWithoutFeedback>
                                        </View>
                                    </View>
                                </View>
                            </ViewPager>
                        </View>
                    </>
                )
            }
        }
        else {
            return (
                <Map
                    location={this.props.route.params.coords}
                    changeNavigateMap={this.changeNavigateMap}
                    locationString={this.state.locationStringSet}
                    setLocation={this.setLocation}
                    confirmLocation={this.confirmLocation}
                />
            )
        }

    }
}
const convertCordToLocationString = async (region) => {
    try {
        let locationString = await Location.reverseGeocodeAsync(region)
        return locationString
    } catch (error) {
        console.log(error)
    }
}

const mapStateToProps = (state) => {
    return {
        //userName: state.authReducer.userName,
        // myUserLocation: state.locationReducer.userLocation,
        // myUserLocationString: state.locationReducer.userLocationString,
    }
}

const mapDispatchToProps = (dispatch, props) => {
    return {
        ConvertCordsToLocation: (locationString) => {
            convertCordToLocationString(locationString)
                .then(locationString => {
                    dispatch(actGetMyLocationString(locationString))
                })
        },
        SetLocationReceiver: async (locationString, locationCoords, infoReceiver) => {
            setTimeout(() => {
                dispatch(actGetLocationReceiver(locationString, locationCoords, infoReceiver))
            }, 1000)
        }
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(LocationReceiver)


