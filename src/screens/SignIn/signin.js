import React, { Component } from 'react'
import {
    Text, View, TextInput, TouchableOpacity, SafeAreaView, Image, FlatList, StyleSheet, Alert,
    TouchableWithoutFeedback, KeyboardAvoidingView, ScrollView, Keyboard
} from 'react-native'

import { connect } from 'react-redux'
import { CommonActions } from '@react-navigation/native';
import { Formik } from 'formik';

import { actSignIn, actSignInFailed } from '../../actions/index'
import { GetAccount, SetAccount } from '../../api/secure/index'
import { SignInSchema } from '../../utils/validation'
import { FirebaseApp } from '../../api/firebase/index'
import { WIDTH_DEVICE_SCREEN, HEIGHT_DEVICE_SCREEN } from '../../constants/DeviceDimensions'

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
                require('../../assets/picture/dating/dating1.jpg'),
                require('../../assets/picture/dating/dating2.jpg'),
            ]
        }
    }
    submit(values) {
        this.props.SignIn(values.email, values.password)
    }
    render() {
        let { errorMsgSignIn } = this.props
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: 'silver' }}>
                <View style={{
                    position: 'absolute',
                    height: HEIGHT_DEVICE_SCREEN / 2, width: WIDTH_DEVICE_SCREEN,
                    top: 0, left: 0
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
                                        height: HEIGHT_DEVICE_SCREEN / 2
                                    }}
                                />
                            </View>
                        }
                    />
                </View>
                <View style={{
                    position: 'absolute', backgroundColor: '#f5f6fa',
                    height: HEIGHT_DEVICE_SCREEN / 2 + 200, width: WIDTH_DEVICE_SCREEN,
                    top: HEIGHT_DEVICE_SCREEN / 2 - 150, left: 0,
                    borderTopLeftRadius: 40, borderTopRightRadius: 40,
                    paddingHorizontal: 20, paddingVertical: 20
                }}>
                    <View>
                        <Text style={{ fontSize: 25, fontWeight: 'bold' }}>
                            The best <Text style={{ fontSize: 35, color: '#D7443E' }}> Dating</Text>
                        </Text>
                        <Text style={{ fontSize: 25, fontWeight: 'bold' }}> Experience   </Text>
                    </View>
                    <View>
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
                                                onPress: () => console.log("Cancel Pressed"),
                                                style: "cancel"
                                            },
                                            {
                                                text: "OK",
                                                onPress: () => console.log("OK Pressed")
                                            }
                                        ]
                                    )
                                ) : (<View />)
                        }
                        <Formik
                            initialValues={{ email: 'tranduy@gmail.com', password: '123456' }}
                            onSubmit={values => this.submit(values)}
                            validationSchema={SignInSchema}
                        >
                            {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                                <View style={{}}>
                                    <View>
                                        <View style={styles.input}>
                                            {errors.email && touched.email ? (
                                                <Text style={{ color: 'red' }}>{errors.email}</Text>
                                            ) : null}
                                            <Text style={styles.labelTxt}>
                                                Username/Email </Text>
                                            <TextInput
                                                onChangeText={
                                                    handleChange("email")
                                                }
                                                style={{ borderBottomColor: 'silver', borderBottomWidth: 1 }}
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
                                                style={{ borderBottomColor: 'silver', borderBottomWidth: 1 }}
                                                onChangeText={handleChange("password")}
                                                onBlur={handleBlur("password")}
                                                value={values.password}
                                                secureTextEntry={true} />
                                        </View>
                                        <View style={{ backgroundColor: 'red', flex: 1 }}>

                                        </View>
                                    </View>
                                    <View style={{
                                        flexDirection: 'row', justifyContent: 'space-between',

                                    }}>
                                        <View style={{
                                            width: size_btn, height: size_btn, backgroundColor: '#ecf0f1', position: 'absolute',
                                            borderRadius: 20, padding: 15, justifyContent: 'space-between'

                                        }}>

                                            <TouchableOpacity
                                                style={{
                                                    borderRadius: 10, borderWidth: 3, backgroundColor: '#ffffff', borderColor: "#ffffff",
                                                    alignItems: 'center', justifyContent: 'center', height: size_btn / 2 - 30
                                                }}
                                                onPress={() => this.props.navigation.navigate("PasswordReset")}
                                            >
                                                <View >
                                                    <Text style={{ color: "#D7443E" }}>
                                                        Quên Mật Khẩu ?  </Text>
                                                </View>
                                            </TouchableOpacity>


                                            <TouchableOpacity
                                                style={{
                                                    borderRadius: 10, borderWidth: 3, backgroundColor: '#D7443E', borderColor: "#D7443E",
                                                    alignItems: 'center', justifyContent: 'center', height: size_btn / 2 - 30
                                                }}
                                                onPress={() => this.props.navigation.navigate("SignUp")}
                                            >
                                                <View >
                                                    <Text style={{ color: "#ffffff" }}>
                                                        Đăng Ký   </Text>
                                                </View>
                                            </TouchableOpacity>

                                        </View>

                                        <View style={{
                                            width: size_btn, height: size_btn, position: 'absolute', left: WIDTH_DEVICE_SCREEN - 40 - size_btn
                                            , justifyContent: 'center', alignItems: 'center'
                                        }}>
                                            <TouchableOpacity
                                                style={{
                                                    width: size_btn / 1.5, height: size_btn / 1.5, borderRadius: size_btn / 3, borderWidth: 1, justifyContent: 'center', alignItems: 'center',
                                                    backgroundColor: '#D7443E', borderColor: "#D7443E",
                                                    //shadowColor: "#ff6b81",
                                                    // shadowOffset: {
                                                    //     width: 0,
                                                    //     height: 12,
                                                    // },
                                                    // shadowOpacity: 1,
                                                    // shadowRadius: 16.00,
                                                    // elevation: 50,
                                                }}
                                                onPress={handleSubmit}>
                                                <Text style={{ fontSize: 15, fontWeight: '600', color: 'white' }}>
                                                    Sign In
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            )}
                        </Formik>
                    </View>
                </View>
            </SafeAreaView>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        errorMsgSignIn: state.authReducer.errorMsgSignIn,
        myUserLocation: state.locationReducer.userLocation,
    }
}

const mapDispatchToProps = (dispatch, props) => {
    return {
        SignIn: (userName, passWord) => {
            FirebaseApp
                .auth()
                .signInWithEmailAndPassword(userName, passWord)

                .then(() => {
                    SetAccount('userAccount', { userName, passWord })
                        .then(() => {
                            dispatch(actSignIn(userName, passWord))
                        })
                        .then(() => {
                            CommonActions.navigate({
                                name: "AppStack"
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