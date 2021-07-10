import React, { Component } from 'react'
import {
    Text, View, TextInput, TouchableOpacity, SafeAreaView, Image, FlatList, StyleSheet, Alert,
    TouchableWithoutFeedback, KeyboardAvoidingView, ScrollView, Keyboard, StatusBar
} from 'react-native'

import { connect } from 'react-redux'
import { CommonActions } from '@react-navigation/native';
import { Formik } from 'formik';
import Modal from 'react-native-modal';
import { actSignIn, actSignInFailed, actSetClientType_CLIENT, actSetClientType_DRIVER, actRestSignInError } from '../../actions/index'
import { GetAccount, SetAccount } from '../../api/secure/index'
import { SignInSchema } from '../../utils/validation'
import { FirebaseApp } from '../../api/firebase/index'
import { WIDTH_DEVICE_SCREEN, HEIGHT_DEVICE_SCREEN } from '../../constants/DeviceDimensions'
import { ifIphoneX } from 'react-native-iphone-x-helper'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { API_FAST_MOVE, logInUser, createUser } from '../../api/heroku/index'
// _userName: "abc@gmail.com",
// _passWord: "Duytran99",
const size_btn = WIDTH_DEVICE_SCREEN / 2 - 50
class SignIn extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            imageData: [
                require('../../assets/picture/intro/cc1.jpg'),
                require('../../assets/picture/intro/download.png'),
            ],
            modalVisible: false,
            typeClient: null,
            isDriver: false,
            isClient: false, typeClientTemp: null
        }
    }
    setModalVisible = (visible) => {
        this.setState({ modalVisible: visible });
    }
    submit(values) {
        this.props.SignIn(values.email, values.password, this.props.clientType)
        this.setModalVisible(!this.state.modalVisible)

    }
    renderDriverColor = () => {
        let { isDriver } = this.state
        if (isDriver == null) {
            return 'white'
        }
        else if (isDriver == true) {
            return '#eccc68'
        }
    }
    renderClientColor = () => {
        let { isClient } = this.state
        if (isClient == null) {
            return 'white'
        }
        else if (isClient == true) {
            return '#ff6b81'
        }
    }
    setClientType = (typeClient) => {
        if (typeClient == 'client') {
            this.setState({
                typeClientTemp: typeClient,
                isClient: true,
                isDriver: false
            })
        } else if (typeClient == 'driver') {
            this.setState({
                typeClientTemp: typeClient,
                isClient: false,
                isDriver: true
            })
        }
    }
    goToSignIn = () => {
        let { typeClientTemp } = this.state
        if (typeClientTemp == null) {
            Alert.alert(
                "Thông Báo",
                "Vui lòng cho chúng tôi biết bạn là ai ?",
                [
                    {
                        text: "OK",
                        onPress: () => console.log("OK Pressed")
                    }
                ]
            )
        }
        else {
            if (typeClientTemp == "driver") {
                this.setState({
                    typeClient: typeClientTemp
                })
                this.props.SetCTDriver()
            }
            else {
                this.setState({
                    typeClient: typeClientTemp
                })
                this.props.SetCTClient()
            }
        }

    }

    render() {
        let { errorMsgSignIn } = this.props
        console.log(this.props.clientType)
        if (this.state.typeClient == null) {
            return (
                <View style={{
                    flex: 1,
                    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : ifIphoneX() ? 50 : 20,
                }}>
                    <View style={{ flex: 1, backgroundColor: "none", justifyContent: 'center', paddingLeft: 30 }}>
                        <Text style={{ color: "#2f3542", fontWeight: '700', fontSize: 30 }}>
                            Bạn là
                        </Text>
                    </View>
                    <View style={{ flex: 2, backgroundColor: "none" }}>
                        <View style={{ flex: 1, flexDirection: 'row' }}>

                            <View style={{ flex: 1, backgroundColor: "none", }}>
                                <TouchableOpacity style={{ flex: 1 }} onPress={() => { this.setClientType("driver") }}>
                                    <View style={{
                                        flex: 1, justifyContent: 'space-between', alignItems: 'center', borderRadius: 10, borderWidth: 2, margin: 10,
                                        borderColor: this.state.isDriver == true ? "#eccc68" : "#a4b0be", backgroundColor: this.renderDriverColor()
                                    }}>
                                        <View style={{ flex: 1, justifyContent: 'center' }}>
                                            <Text style={{ fontSize: 17, fontWeight: '800', color: this.state.isDriver == true ? "white" : "#a4b0be" }}>
                                                Tài xế
                                            </Text>
                                        </View>
                                        <View style={{ flex: 1 }}>
                                            <Image
                                                source={require('../../assets/icon/driver.png')}
                                                style={{
                                                    width: WIDTH_DEVICE_SCREEN / 2 - 40, height: WIDTH_DEVICE_SCREEN / 2 - 40
                                                }}
                                            />
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            </View>

                            <View style={{ flex: 1, backgroundColor: "none" }}>
                                <TouchableOpacity style={{ flex: 1 }} onPress={() => { this.setClientType("client") }}>
                                    <View style={{
                                        flex: 1, justifyContent: 'space-between', alignItems: 'center', borderRadius: 10, borderWidth: 2, margin: 10,
                                        borderColor: this.state.isClient == true ? "#ff6b81" : "#a4b0be", backgroundColor: this.renderClientColor()
                                    }}>
                                        <View style={{ flex: 1, justifyContent: 'center' }}>
                                            <Text style={{ fontSize: 17, fontWeight: '800', color: this.state.isClient == true ? "white" : "#a4b0be" }}>
                                                Khách hàng
                                            </Text>
                                        </View>
                                        <View style={{ flex: 1 }}>
                                            <Image
                                                source={require('../../assets/icon/team.png')}
                                                style={{
                                                    width: WIDTH_DEVICE_SCREEN / 2 - 30, height: WIDTH_DEVICE_SCREEN / 2 - 30
                                                }}
                                            />
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            </View>

                        </View>
                    </View>
                    <View style={{ flex: 1, backgroundColor: "none", justifyContent: 'center', alignItems: 'center' }}>
                        <TouchableOpacity onPress={() => { this.goToSignIn() }}>
                            <View style={{
                                height: 100, width: 100, alignItems: 'center', justifyContent: 'center',
                                backgroundColor: this.state.typeClientTemp == 'client' ? "#ff6b81" : this.state.typeClientTemp == 'driver' ? "#eccc68" : "#ced6e0",
                                borderRadius: 50
                            }}>
                                <FontAwesome5
                                    name={"arrow-right"}
                                    color={"white"}
                                    size={30}
                                />
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            )
        }
        else if (this.state.typeClient == "client") {
            return (
                <ScrollView style={{ flex: 1, backgroundColor: 'white' }}>
                    <View style={{
                        height: HEIGHT_DEVICE_SCREEN / 3, width: WIDTH_DEVICE_SCREEN,
                    }}>
                        <FlatList
                            data={this.state.imageData}
                            keyExtractor={item => item.toString()}
                            horizontal
                            showsHorizontalScrollIndicator
                            pagingEnabled
                            bounces
                            renderItem={({ item, index }) =>
                                <View key={index}>
                                    <Image
                                        source={item}
                                        style={{
                                            width: WIDTH_DEVICE_SCREEN,
                                            height: HEIGHT_DEVICE_SCREEN / 3
                                        }}
                                    />
                                </View>
                            }
                        />
                    </View>
                    <KeyboardAvoidingView
                        behavior={Platform.OS === "ios" ? "padding" : "height"}
                        style={{ flex: 1 }}
                        enabled={false}
                    >
                        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                            <View style={{ flex: 1 }}>
                                <View style={{
                                    backgroundColor: 'white',
                                    height: HEIGHT_DEVICE_SCREEN / 2 + 100, width: WIDTH_DEVICE_SCREEN,
                                    flex: 1,
                                    borderTopLeftRadius: 40, borderTopRightRadius: 40,
                                    paddingHorizontal: 20, paddingVertical: 20
                                }}>
                                    <View>
                                        <Text style={{ fontSize: 25, fontWeight: 'bold' }}>
                                            Giao hàng <Text style={{ fontSize: 35, color: '#D7443E' }}> Fast</Text>
                                        </Text>
                                        <Text style={{ fontSize: 25, fontWeight: 'bold' }}>
                                            Tốc độ        <Text style={{ fontSize: 35, color: '#D7443E' }}>Move</Text>
                                        </Text>

                                    </View>
                                    <View style={{ flex: 1 }}>
                                        {
                                            errorMsgSignIn != null
                                                ?
                                                (
                                                    Alert.alert(
                                                        "Đăng Nhập Không Thành Công",
                                                        errorMsgSignIn,
                                                        [
                                                            {
                                                                text: "Đăng Kí ",
                                                                onPress: () => this.props.navigation.navigate("SignUp")
                                                            },
                                                            {
                                                                text: "Hủy",
                                                                onPress: () => this.props.ResetSignInError(),
                                                                style: "cancel"
                                                            },
                                                            {
                                                                text: "OK",
                                                                onPress: () => this.props.ResetSignInError()
                                                            }
                                                        ]
                                                    )
                                                ) : (<View />)
                                        }
                                        <Formik
                                            initialValues={{
                                                email: 'duy@gmail.com',
                                                password: '123456',
                                                typeClient: 'khachhang'
                                            }}
                                            onSubmit={values => {
                                                this.submit(values)
                                            }}
                                            validationSchema={SignInSchema}

                                        >
                                            {({ handleChange, handleBlur, handleSubmit, setFieldValue, values, errors, touched }) => (
                                                <View style={{ flex: 1 }}>
                                                    <View style={{ flex: 1, backgroundColor: 'none' }}>
                                                        <View style={styles.input}>
                                                            {errors.email && touched.email ? (
                                                                <Text style={{ color: 'red' }}>{errors.email}</Text>
                                                            ) : null}
                                                            <Text style={styles.labelTxt}>
                                                                Email / Số Điện Thoại </Text>
                                                            <TextInput
                                                                onChangeText={
                                                                    handleChange("email")
                                                                }
                                                                style={{ borderBottomColor: 'silver', borderBottomWidth: 1, height: 40 }}
                                                                onBlur={handleBlur("email")}
                                                                value={values.email} />
                                                        </View>

                                                        <View style={[styles.input, { marginBottom: 10 }]}>
                                                            {errors.password && touched.password ? (
                                                                <Text style={{ color: 'red' }}>{errors.password}</Text>
                                                            ) : null}
                                                            <Text style={styles.labelTxt}>
                                                                Mật Khẩu </Text>
                                                            <TextInput
                                                                style={{ borderBottomColor: 'silver', borderBottomWidth: 1, height: 40 }}
                                                                onChangeText={handleChange("password")}
                                                                onBlur={handleBlur("password")}
                                                                value={values.password}
                                                                secureTextEntry={true} />
                                                        </View>
                                                        <View style={{ alignItems: 'flex-end' }}>
                                                            <TouchableOpacity onPress={() => { this.props.navigation.navigate("PasswordReset") }}>
                                                                <View>
                                                                    <Text style={{ fontWeight: '700' }} >
                                                                        Quên Mật Khẩu ?
                                                                    </Text>
                                                                </View>
                                                            </TouchableOpacity>
                                                        </View>
                                                    </View>
                                                    <View style={{
                                                        flex: 1, backgroundColor: null,
                                                        paddingVertical: 0, justifyContent: 'flex-end'
                                                    }}>
                                                        <TouchableOpacity
                                                            style={{
                                                                borderRadius: 10, borderWidth: 3, backgroundColor: '#D7443E', borderColor: "#D7443E",
                                                                alignItems: 'center', justifyContent: 'center', height: 60, marginTop: 10
                                                            }}
                                                            onPress={handleSubmit}
                                                        >
                                                            <View style={{}}>
                                                                <Text style={{ fontSize: 15, fontWeight: '600', color: 'white' }}>
                                                                    Đăng Nhập
                                                                </Text>
                                                            </View>
                                                        </TouchableOpacity>

                                                        <TouchableOpacity
                                                            style={{
                                                                borderRadius: 10, borderWidth: 3, backgroundColor: 'white', borderColor: "#D7443E",
                                                                alignItems: 'center', justifyContent: 'center', height: 60, marginTop: 10
                                                            }}
                                                            onPress={() =>
                                                                this.props.navigation.navigate("SignUp")
                                                            }
                                                        >
                                                            <View >
                                                                <Text style={{ fontSize: 15, fontWeight: '900', color: '#D7443E' }}>
                                                                    Đăng Ký   </Text>
                                                            </View>
                                                        </TouchableOpacity>
                                                    </View>
                                                </View>
                                            )}
                                        </Formik>
                                    </View>
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    </KeyboardAvoidingView>


                </ScrollView>


            )
        }
        else {
            return (
                <View style={{ flex: 1, backgroundColor: 'white' }}>
                    <View style={{
                        height: HEIGHT_DEVICE_SCREEN / 3, width: WIDTH_DEVICE_SCREEN,
                    }}>
                        <FlatList
                            data={this.state.imageData}
                            keyExtractor={item => item.toString()}
                            horizontal
                            showsHorizontalScrollIndicator
                            pagingEnabled
                            bounces
                            renderItem={({ item, index }) =>
                                <View key={index}>
                                    <Image
                                        source={item}
                                        style={{
                                            width: WIDTH_DEVICE_SCREEN,
                                            height: HEIGHT_DEVICE_SCREEN / 3
                                        }}
                                    />
                                </View>
                            }
                        />
                    </View>
                    <View style={{
                        backgroundColor: 'white',
                        height: HEIGHT_DEVICE_SCREEN / 2 + 100, width: WIDTH_DEVICE_SCREEN,
                        flex: 1,
                        borderTopLeftRadius: 40, borderTopRightRadius: 40,
                        paddingHorizontal: 20, paddingVertical: 20
                    }}>
                        <View>

                            <Text style={{ fontSize: 35, color: '#D7443E', fontWeight: 'bold' }}>Tài Xế </Text>

                            <Text style={{ fontSize: 20, }}>
                                Cùng FastMove vượt qua đại dịch COVID-19
                            </Text>
                        </View>
                        <View style={{ flex: 1 }}>
                            {
                                errorMsgSignIn != null
                                    ?
                                    (
                                        Alert.alert(
                                            "Đăng Nhập Không Thành Công",
                                            errorMsgSignIn,
                                            [
                                                {
                                                    text: "Đăng Kí ",
                                                    onPress: () => this.props.navigation.navigate("SignUp")
                                                },
                                                {
                                                    text: "Hủy",
                                                    onPress: () => this.props.ResetSignInError(),
                                                    style: "cancel"
                                                },
                                                {
                                                    text: "OK",
                                                    onPress: () => this.props.ResetSignInError()
                                                }
                                            ]
                                        )
                                    ) : (<View />)
                            }
                            <Formik
                                initialValues={{
                                    email: 'duy@gmail.com',
                                    password: '123456',
                                    typeClient: 'khachhang'
                                }}
                                onSubmit={values => {
                                    this.submit(values)
                                }}
                                validationSchema={SignInSchema}

                            >
                                {({ handleChange, handleBlur, handleSubmit, setFieldValue, values, errors, touched }) => (
                                    <View style={{ flex: 1 }}>
                                        <View style={{ flex: 1, backgroundColor: 'none' }}>
                                            <View style={styles.input}>
                                                {errors.email && touched.email ? (
                                                    <Text style={{ color: 'red' }}>{errors.email}</Text>
                                                ) : null}
                                                <Text style={styles.labelTxt}>
                                                    Email / Số Điện Thoại </Text>
                                                <TextInput
                                                    onChangeText={
                                                        handleChange("email")
                                                    }
                                                    style={{ borderBottomColor: 'silver', borderBottomWidth: 1, height: 40 }}
                                                    onBlur={handleBlur("email")}
                                                    value={values.email} />
                                            </View>

                                            <View style={[styles.input, { marginBottom: 10 }]}>
                                                {errors.password && touched.password ? (
                                                    <Text style={{ color: 'red' }}>{errors.password}</Text>
                                                ) : null}
                                                <Text style={styles.labelTxt}>
                                                    Mật Khẩu </Text>
                                                <TextInput
                                                    style={{ borderBottomColor: 'silver', borderBottomWidth: 1, height: 40 }}
                                                    onChangeText={handleChange("password")}
                                                    onBlur={handleBlur("password")}
                                                    value={values.password}
                                                    secureTextEntry={true} />
                                            </View>
                                            <View style={{ alignItems: 'flex-end' }}>
                                                <TouchableOpacity onPress={() => { this.props.navigation.navigate("PasswordReset") }}>
                                                    <View>
                                                        <Text style={{ fontWeight: '700' }} >
                                                            Quên Mật Khẩu ?
                                                        </Text>
                                                    </View>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                        <View style={{
                                            flex: 1, backgroundColor: null,
                                            paddingVertical: 0, justifyContent: 'flex-end'
                                        }}>
                                            <TouchableOpacity
                                                style={{
                                                    borderRadius: 10, borderWidth: 3, backgroundColor: '#D7443E', borderColor: "#D7443E",
                                                    alignItems: 'center', justifyContent: 'center', height: 60, marginTop: 10
                                                }}
                                                onPress={handleSubmit}
                                            >
                                                <View style={{}}>
                                                    <Text style={{ fontSize: 15, fontWeight: '600', color: 'white' }}>
                                                        Đăng Nhập
                                                    </Text>
                                                </View>
                                            </TouchableOpacity>

                                            <TouchableOpacity
                                                style={{
                                                    borderRadius: 10, borderWidth: 3, backgroundColor: 'white', borderColor: "#D7443E",
                                                    alignItems: 'center', justifyContent: 'center', height: 60, marginTop: 10
                                                }}
                                                onPress={() =>
                                                    this.props.navigation.navigate("SignUp")
                                                }
                                            >
                                                <View >
                                                    <Text style={{ fontSize: 15, fontWeight: '900', color: '#D7443E' }}>
                                                        Đăng Ký   </Text>
                                                </View>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                )}
                            </Formik>
                        </View>
                    </View>
                </View>
            )
        }

    }
}
// const logInUser = async (email, password, role) => {
//     try {
//         let response = await fetch(
//             `${API_FAST_MOVE}/api/users/login`
//             , {
//                 method: 'POST',
//                 headers: {
//                     Accept: 'application/json',
//                     'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify({
//                     "email": email,
//                     "password": password,
//                     "role": role
//                 })
//             });
//         let json = await response.json();
//         return json
//     } catch (error) {
//         console.error(error);
//     }
// }
const mapStateToProps = (state) => {
    return {
        errorMsgSignIn: state.authReducer.errorMsgSignIn,
        myUserLocation: state.locationReducer.userLocation,
        clientType: state.authReducer.typeClient
    }
}

const mapDispatchToProps = (dispatch, props) => {
    return {
        SignIn: (userName, passWord, typeClient) => {
            FirebaseApp
                .auth()
                .signInWithEmailAndPassword(userName, passWord)
                .then(() => {
                    logInUser(userName, passWord, typeClient === "driver" ? "DELIVER" : "CUSTOMER")
                        .then((acc) => {
                            let token = acc.token
                            SetAccount('userAccount', { userName, passWord, typeClient, token })
                                .then(() => {
                                    dispatch(actSignIn(userName, passWord, typeClient, token))
                                })
                                .then(() => {
                                    CommonActions.navigate({
                                        name: "AppStack"
                                    })
                                })
                        })
                })
                .catch(function (e) {
                    var errorCode = e.code;
                    var errorMessage = e.message;
                    console.log(errorCode + " ---- " + errorMessage)
                    if (e.code === "auth/user-not-found") {
                        console.log("Tai khoan ko ton tai")
                        dispatch(actSignInFailed(e.message))

                    } else if (e.code === "auth/wrong-password") {
                        console.log("Sai mat khau")
                        dispatch(actSignInFailed(e.message))
                    }
                })
        },
        SetCTClient: () => {
            dispatch(actSetClientType_CLIENT())
        },
        SetCTDriver: () => {
            dispatch(actSetClientType_DRIVER())
        },
        ResetSignInError: () => {
            dispatch(actRestSignInError())
        }
    }
}
const styles = StyleSheet.create({
    labelTxt: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#95a5a6'
    },
    input: {
        marginTop: 15,
    }
})

export default connect(mapStateToProps, mapDispatchToProps)(SignIn)