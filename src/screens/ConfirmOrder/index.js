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
export class ConfirmOrder extends Component {
    constructor(props) {
        super(props)
        this.state = {
            noteForDriver: '',
            showModelNoteDrive: false,
            isBigGoods: false,
            tipMoney: 0,
            paymentType: PaymentType[0]
        }
    }
    calculateTotalBill = () => {
        let { isBigGoods, tipMoney } = this.state
        if (isBigGoods == true) {
            return 100000 + tipMoney + 20000
        } else {
            return 100000 + tipMoney
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
            "Thông Báo",
            "Bạn muốn đặt lại",
            [
                {
                    text: "Rời Đi",
                    onPress: () => this.props.navigation.goBack(),
                    style: "cancel"
                },
                { text: "Ở lại", onPress: () => console.log("OK Pressed") }
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
                        Xem Lại Đơn Hàng
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

                    <Text style={{ color: 'silver', marginLeft: 10 }}>
                        Để lại ghi chú cho tài xế của bạn ...
                    </Text>

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
                                    <Text style={styles.header}>Ghi chú cho tài xế</Text>
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
                                placeholder="Ghi Chú"
                                style={styles.textInput}
                                state={this.state.showModelNoteDrive}
                                onChangeText={(noteForDriver) => this.setState({ noteForDriver })}
                            />
                            <View style={styles.btnContainer}>
                                <Button title="Xác Nhận" onPress={() => this.setModalNoteDriveVisible(!this.state.showModelNoteDrive)} />
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
                    <Text style={{ marginBottom: 10, }}>
                        Thêm Dịch Vụ
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
                                    Giao Hàng Cồng Kềnh
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
                                {this.state.isBigGoods == true ? " Thêm: +20.000 vnd" : '+20.000 vnd'}

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
                                    Hỗ Trợ Tài Xế
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
                                {this.state.tipMoney > 0 ? `Thêm: ${this.state.tipMoney.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })} vnd` : '+5.000 vnd'}

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
                        Thanh Toán:
                    </Text>
                    <TouchableOpacity>
                        <View style={{
                            justifyContent: 'space-between', alignItems: 'center',
                            flexDirection: 'row',
                        }}>
                            <Image
                                source={this.state.paymentType.img}
                                style={{ width: 20, height: 20,marginRight:10 }}
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
                        Tổng Tiền:
                    </Text>
                    <Text>
                        {this.calculateTotalBill().toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}

                    </Text>
                </View>
                <View style={{ padding: 10 }}>
                    <TouchableOpacity>
                        <View style={{ height: 50, backgroundColor: '#e84118', alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ color: 'white', fontWeight: '700' }}>
                                Thanh Toán
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
    render() {
        return (
            <>
                <StatusBar backgroundColor={"#D7443E"} />
                <SafeAreaView style={GlobalStyles.droidSafeArea}>
                    <HeaderBar
                        goBackHomeScreen={this.goBackHomeScreen}
                        name={"Xác Nhận Đơn Hàng"}
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
const mapStateToProps = (state) => ({

})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(ConfirmOrder)
