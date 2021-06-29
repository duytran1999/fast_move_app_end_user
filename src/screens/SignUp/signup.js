import React, { Component } from 'react'
import { Text, View, TextInput, TouchableOpacity, SafeAreaView, StatusBar, Platform, Alert, ActivityIndicatorActivityIndicator, Image } from 'react-native'
import { ProgressSteps, ProgressStep } from 'react-native-progress-steps';
import { connect } from 'react-redux'
import { FirebaseApp } from '../../api/firebase/index'
import { Formik } from 'formik';
import { CommonActions } from '@react-navigation/native';
import ViewPager from '@react-native-community/viewpager';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from 'moment'
import { Picker } from '@react-native-picker/picker';

import { actSignUpFailed, actSignUp } from '../../actions/index'
import { GetAccount, SetAccount } from '../../api/secure/index'
import { WIDTH_DEVICE_SCREEN, HEIGHT_DEVICE_SCREEN } from '../../constants/DeviceDimensions'
import { SignUpSchema } from '../../utils/validation'

const defaultEmail = "tranduytranduytranduy1999abcxyz@gmail.com"
const defaultPhone = "18121999181219991812199918121999"

class SignUp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pageInitial: 0,
            showPicker: false,
            dayOfBirth: new Date(),
            modeSignUp: true,
            activityIndicator: false
        }
    }
    submit(values) {
        this.setState({
            activityIndicator: true
        })
        console.log(values)
        console.log("asasd")
        if (values.email == defaultEmail)
            this.props.SignUp(values.phoneNumber, values.password, values.sex, values.birthDay, defaultEmail, values.phoneNumber, values.displayName, values.typeClient)
        if (values.phoneNumber == defaultPhone)
            this.props.SignUp(values.email, values.password, values.sex, values.birthDay, values.email, defaultPhone, values.displayName, values.typeClient)

    }
    nextPage(pageNow) {
        this.viewPager.setPage(pageNow + 1)
        this.setState({
            pageInitial: pageNow + 1
        })
    }
    previousPage(pageNow) {
        if (pageNow > 0) {
            this.viewPager.setPage(pageNow - 1)
            this.setState({
                pageInitial: pageNow - 1
            })
        }
    }
    showDatePicker() {
        this.setState({
            showPicker: true
        })
    };
    hideDatePicker() {
        this.setState({
            showPicker: false
        })
    };
    handleConfirm = (date) => {
        this.setState({
            dayOfBirth: date
        })
        this.hideDatePicker();
        console.log(this.state.dayOfBirth.toDateString())
    }
    changeMode() {
        this.setState({
            modeSignUp: !this.state.modeSignUp
        })
    }
    headerBar() {
        return (
            Platform.OS === 'android'
                ? (
                    <TouchableOpacity onPress={() => {
                        this.props.navigation.goBack()
                    }}>
                        <View>
                            <FontAwesome5
                                name={"chevron-left"}
                                color={"#D7443E"}
                                size={45}
                            />
                        </View>
                    </TouchableOpacity>
                )
                : <View style={{ height: 45 }} />

        )
    }
    render() {
        let { errorMsgSignUp } = this.props
        let { pageInitial } = this.state
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <StatusBar />
                {
                    errorMsgSignUp != null
                        ?
                        (
                            Alert.alert(
                                "Đăng Ký Không Thành Công",
                                errorMsgSignUp,
                                [
                                    {
                                        text: "Đăng Nhập ",
                                        onPress: () => this.props.navigation.goBack()
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
                    initialValues={{
                        email: '',
                        phoneNumber: '',
                        password: '',
                        confirmPassword: '',
                        displayName: '',
                        birthDay: moment().format('YYYY-MM-DD'),
                        sex: "nam",
                        typeClient: 'khachhang'
                    }}
                    onSubmit={values => this.submit(values)}
                    validationSchema={SignUpSchema}
                >
                    {({ handleChange, handleBlur, handleSubmit, setFieldValue, values, errors, touched }) => (
                        <ViewPager
                            style={{ flex: 1 }}
                            initialPage={pageInitial}
                            scrollEnabled={false}
                            ref={(viewPager) => { this.viewPager = viewPager }}
                        >
                            <View style={{
                                flex: 1, backgroundColor: '#ffffff',
                                padding: 15,

                            }}>
                                {
                                    this.headerBar()
                                }
                                <View style={{ marginTop: 50 }}>
                                    <Text style={{ fontSize: 18, fontWeight: 'bold' }}> Tên của bạn :</Text>
                                    <TextInput
                                        style={{ borderBottomColor: 'silver', borderBottomWidth: 1 }}
                                        onChangeText={handleChange("displayName")}
                                        onBlur={handleBlur("displayName")}
                                        value={values.displayName}
                                    />
                                    {errors.displayName && touched.displayName ? (
                                        <View style={{ height: 50 }}>
                                            <Text style={{ color: 'red' }}>{errors.displayName}</Text>
                                        </View>

                                    ) : <View style={{ height: 50 }} />}
                                    {
                                        errors.displayName == null
                                            ?
                                            values.displayName.length > 0
                                                ?
                                                <TouchableOpacity
                                                    style={{ marginTop: 20, }}
                                                    onPress={() => {
                                                        if (values.displayName.length > 0) {
                                                            this.nextPage(pageInitial)
                                                        }
                                                    }}>
                                                    <View style={{
                                                        backgroundColor: '#D7443E', height: 50, borderRadius: 25,
                                                        alignItems: 'center', justifyContent: 'center'
                                                    }}>
                                                        <Text style={{ fontSize: 17, color: "white", fontWeight: 'bold' }}>Tiếp Tục</Text>
                                                    </View>
                                                </TouchableOpacity>
                                                : <View />
                                            : <View />
                                    }

                                </View>
                            </View>

                            <View style={{
                                flex: 1, backgroundColor: '#ffffff',
                                padding: 15,

                            }}>
                                {
                                    this.headerBar()
                                }
                                <View style={{ marginTop: 50 }}>
                                    <Text style={{ fontSize: 18, fontWeight: 'bold' }}> Bạn là :</Text>
                                    <Picker
                                        selectedValue={values.sex}
                                        onValueChange={(itemValue, itemIndex) =>
                                            setFieldValue("sex", itemValue)
                                        }>
                                        <Picker.Item label="Nam" value="man" />
                                        <Picker.Item label="Nữ" value="nữ" />
                                        <Picker.Item label="Không Tiết Lộ" value="secret" />
                                    </Picker>
                                    {errors.sex && touched.sex ? (
                                        <View style={{ height: 50 }}>
                                            <Text style={{ color: 'red' }}>{errors.sex}</Text>
                                        </View>

                                    ) : <View style={{ height: 50 }} />}
                                    {
                                        errors.sex == null
                                            ?
                                            values.sex.length > 0
                                                ?
                                                <TouchableOpacity
                                                    style={{ marginTop: 20, }}
                                                    onPress={() => {
                                                        if (values.sex.length > 0) {
                                                            this.nextPage(pageInitial)
                                                        }
                                                    }}>
                                                    <View style={{
                                                        backgroundColor: '#D7443E', height: 50, borderRadius: 25,
                                                        alignItems: 'center', justifyContent: 'center'
                                                    }}>
                                                        <Text style={{ fontSize: 17, color: "white", fontWeight: 'bold' }}>Tiếp Tục</Text>
                                                    </View>
                                                </TouchableOpacity>
                                                : <View />
                                            : <View />
                                    }

                                </View>
                            </View>

                            <View style={{
                                flex: 1, backgroundColor: '#ffffff',
                                padding: 15,

                            }}>
                                {
                                    this.headerBar()
                                }
                                <View style={{ marginTop: 50 }}>
                                    <Text style={{ fontSize: 18, fontWeight: 'bold' }}> Ngày sinh của bạn ?</Text>
                                    <View style={{ alignItems: 'center', marginTop: 10 }}>
                                        <TouchableOpacity onPress={() => this.showDatePicker()}>
                                            <View>
                                                <Text>
                                                    {moment(values.birthDay).format('YYYY-MM-DD')}
                                                </Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                    <DateTimePickerModal
                                        isVisible={this.state.showPicker}
                                        mode="date"
                                        onConfirm={(date) => {
                                            setFieldValue('birthDay', moment(date).format('YYYY-MM-DD'));
                                            this.handleConfirm(date)
                                            this.hideDatePicker()
                                        }}
                                        onCancel={() => this.hideDatePicker()}
                                    />
                                    {
                                        errors.birthDay != null
                                            ? values.birthDay == moment().format("YYYY-MM-DD")
                                                ? null
                                                : <View style={{ height: 50 }}>
                                                    <Text style={{ color: 'red' }}>{errors.birthDay}</Text>
                                                </View>

                                            : <View style={{ height: 50 }} />
                                    }
                                    {
                                        errors.birthDay == null
                                            ?
                                            moment().diff(moment(values.birthDay), 'years') >= 18
                                                ?
                                                <TouchableOpacity
                                                    style={{ marginTop: 20, }}
                                                    onPress={() => {
                                                        if (values.displayName.length > 0) {
                                                            this.nextPage(pageInitial)
                                                        }
                                                    }}>
                                                    <View style={{
                                                        backgroundColor: '#D7443E', height: 50, borderRadius: 25,
                                                        alignItems: 'center', justifyContent: 'center'
                                                    }}>
                                                        <Text style={{ fontSize: 17, color: "white", fontWeight: 'bold' }}>Tiếp Tục</Text>
                                                    </View>
                                                </TouchableOpacity>
                                                : <View />
                                            : <View />
                                    }
                                </View>
                            </View>

                            <View style={{
                                flex: 1, backgroundColor: '#ffffff',
                                padding: 15,
                            }}>
                                {
                                    this.headerBar()
                                }
                                <View style={{ marginTop: 50 }}>
                                    {
                                        this.state.modeSignUp == true
                                            ?
                                            (
                                                <View>
                                                    <Text style={{ fontSize: 18, fontWeight: 'bold' }}> Email của bạn :</Text>
                                                    <TextInput
                                                        style={{ borderBottomColor: 'silver', borderBottomWidth: 1 }}
                                                        onChangeText={handleChange("email")}
                                                        onBlur={handleBlur("email")}
                                                        value={values.email}
                                                    />
                                                    {
                                                        errors.email && touched.email ? (
                                                            <View style={{ height: 50 }}>
                                                                <Text style={{ color: 'red' }}>{errors.email}</Text>
                                                            </View>

                                                        ) : <View style={{ height: 50 }} />
                                                    }
                                                    {
                                                        errors.email == null
                                                            ?
                                                            values.email.length > 0
                                                                ?
                                                                <TouchableOpacity
                                                                    style={{ marginTop: 20, }}
                                                                    onPress={() => {
                                                                        if (values.email.length > 0) {
                                                                            this.nextPage(pageInitial);
                                                                            setFieldValue("phoneNumber", defaultPhone)
                                                                            setFieldValue("email", values.email)
                                                                        }
                                                                    }}>
                                                                    <View style={{
                                                                        backgroundColor: '#D7443E', height: 50, borderRadius: 25,
                                                                        alignItems: 'center', justifyContent: 'center'
                                                                    }}>
                                                                        <Text style={{ fontSize: 17, color: "white", fontWeight: 'bold' }}>Tiếp Tục</Text>
                                                                    </View>
                                                                </TouchableOpacity>
                                                                : <View>
                                                                    <Text style={{ color: "#D7443E" }}>
                                                                        Email này sẽ dùng để làm tên đăng nhập và khôi phục tài khoản của bạn</Text>
                                                                </View>
                                                            : <View>
                                                                <Text style={{ color: "#D7443E" }}>
                                                                    Email này sẽ dùng để làm tên đăng nhập và khôi phục tài khoản của bạn</Text>
                                                            </View>

                                                    }
                                                    <TouchableOpacity
                                                        style={{ marginTop: 50 }}
                                                        onPress={() => {
                                                            this.changeMode();
                                                        }}
                                                    >
                                                        <View style={{
                                                            backgroundColor: '#dfe6e9',
                                                            height: 50, alignItems: "center", justifyContent: 'center'
                                                        }}>
                                                            <Text style={{ fontSize: 18, color: "#636e72" }}>
                                                                Đăng nhập bằng Số Điện Thoại </Text>
                                                        </View>
                                                    </TouchableOpacity>
                                                </View>
                                            )
                                            :
                                            (
                                                <View>
                                                    <Text style={{ fontSize: 18, fontWeight: 'bold' }}> Số Điện Thoại của bạn :</Text>
                                                    <TextInput
                                                        style={{ borderBottomColor: 'silver', borderBottomWidth: 1 }}
                                                        onChangeText={handleChange("phoneNumber")}
                                                        onBlur={handleBlur("phoneNumber")}
                                                        value={values.phoneNumber}
                                                    />
                                                    {
                                                        errors.phoneNumber && touched.phoneNumber ? (
                                                            <View style={{ height: 50 }}>
                                                                <Text style={{ color: 'red' }}>{errors.phoneNumber}</Text>
                                                            </View>

                                                        ) : <View style={{ height: 50 }} />
                                                    }
                                                    {
                                                        errors.phoneNumber == null
                                                            ?
                                                            values.phoneNumber.length > 0
                                                                ?
                                                                <TouchableOpacity
                                                                    style={{ marginTop: 20, }}
                                                                    onPress={() => {
                                                                        if (values.phoneNumber.length > 0) {
                                                                            this.nextPage(pageInitial);
                                                                            setFieldValue("email", defaultEmail)
                                                                            setFieldValue("phoneNumber", values.phoneNumber)
                                                                        }
                                                                    }}>
                                                                    <View style={{
                                                                        backgroundColor: '#D7443E', height: 50, borderRadius: 25,
                                                                        alignItems: 'center', justifyContent: 'center'
                                                                    }}>
                                                                        <Text style={{ fontSize: 17, color: "white", fontWeight: 'bold' }}>Tiếp Tục</Text>
                                                                    </View>
                                                                </TouchableOpacity>
                                                                : <View>
                                                                    <Text style={{ color: "#D7443E" }}>
                                                                        Số Điện Thoại này sẽ dùng để làm tên đăng nhập và khôi phục tài khoản của bạn</Text>
                                                                </View>
                                                            : <View>
                                                                <Text style={{ color: "#D7443E" }}>
                                                                    Số Điện Thoại này sẽ dùng để làm tên đăng nhập và khôi phục tài khoản của bạn</Text>
                                                            </View>
                                                    }
                                                    <TouchableOpacity
                                                        style={{ marginTop: 50 }}
                                                        onPress={() => {
                                                            this.changeMode();
                                                        }}
                                                    >
                                                        <View style={{
                                                            backgroundColor: '#dfe6e9',
                                                            height: 50, alignItems: "center", justifyContent: 'center'
                                                        }}>
                                                            <Text style={{ fontSize: 18, color: "#636e72" }}>
                                                                Đăng nhập bằng Email </Text>
                                                        </View>
                                                    </TouchableOpacity>
                                                </View>
                                            )
                                    }



                                </View>
                            </View>

                            <View style={{
                                flex: 1, backgroundColor: '#ffffff',
                                padding: 15
                            }}>
                                {
                                    this.headerBar()
                                }
                                <View style={{ marginTop: 50 }}>

                                    <Text style={{ fontWeight: '900', fontSize: 17 }}>
                                        Mật Khẩu
                                    </Text>
                                    <TextInput
                                        style={{ borderBottomColor: 'silver', borderBottomWidth: 1, backgroundColor: "#dfe4ea", paddingHorizontal: 10, paddingVertical: 5 }}
                                        placeholder={"Mật Khẩu"}
                                        onChangeText={handleChange("password")}
                                        onBlur={handleBlur("password")}
                                        value={values.password}
                                        secureTextEntry={true} />
                                    {errors.password && touched.password
                                        ?
                                        (
                                            <View style={{ height: 50 }}>
                                                <Text style={{ color: 'red' }}>{errors.password}</Text>
                                            </View>
                                        ) : <View style={{ height: 50 }} />
                                    }

                                    <Text style={{ fontWeight: '900', fontSize: 17 }}>
                                        Xác Nhận Mật Khẩu
                                    </Text>
                                    <TextInput
                                        style={{ borderBottomColor: 'silver', borderBottomWidth: 1, backgroundColor: "#dfe4ea", paddingHorizontal: 10, paddingVertical: 5 }}
                                        placeholder={"Nhập Lại Mật Khẩu"}
                                        onChangeText={handleChange("confirmPassword")}
                                        onBlur={handleBlur("confirmPassword")}
                                        value={values.confirmPassword}
                                        secureTextEntry={true} />
                                    {errors.confirmPassword && touched.confirmPassword ? (
                                        <View style={{ height: 50 }}>
                                            <Text style={{ color: 'red' }}>{errors.confirmPassword}</Text>
                                        </View>

                                    ) : <View style={{ height: 50 }} />}
                                    {
                                        errors.password == null && errors.confirmPassword == null
                                            ?
                                            values.password.length > 0 && values.confirmPassword.length > 0
                                                ?
                                                <TouchableOpacity
                                                    style={{ marginTop: 20, }}
                                                    onPress={() => {
                                                        if (values.displayName.length > 0) {
                                                            this.nextPage(pageInitial)
                                                        }
                                                    }}>
                                                    <View style={{
                                                        backgroundColor: '#D7443E', height: 50, borderRadius: 25,
                                                        alignItems: 'center', justifyContent: 'center'
                                                    }}>
                                                        <Text style={{ fontSize: 17, color: "white", fontWeight: 'bold' }}>Tiếp Tục</Text>
                                                    </View>
                                                </TouchableOpacity>
                                                : <View />
                                            : <View />
                                    }
                                </View>
                            </View>

                            <View style={{
                                flex: 1, backgroundColor: '#ffffff',
                                padding: 15,

                            }}>
                                {
                                    this.headerBar()
                                }
                                <View style={{ marginTop: 50 }}>
                                    <Text style={{ fontSize: 18, fontWeight: 'bold' }}> Tiến Hành Đăng Ký</Text>
                                    {
                                        this.state.activityIndicator == true
                                            ?
                                            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                                <Image
                                                    source={require('../../assets/icon/Spinner-1s-317px.gif')}
                                                    style={{ height: 100, width: 100 }}
                                                />
                                            </View>
                                            :
                                            <View
                                                style={{ height: 100 }}
                                            />
                                    }
                                    <TouchableOpacity
                                        style={{ marginTop: 20, }}
                                        onPress={handleSubmit}>
                                        <View style={{
                                            backgroundColor: '#D7443E', height: 50, borderRadius: 25,
                                            alignItems: 'center', justifyContent: 'center'
                                        }}>
                                            <Text style={{ fontSize: 17, color: "white", fontWeight: 'bold' }}>Đăng Ký</Text>
                                        </View>
                                    </TouchableOpacity>


                                </View>
                            </View>
                        </ViewPager>
                    )}
                </Formik>
            </SafeAreaView >
        )
    }
}
const mapStateToProps = (state) => {
    return {
        errorMsgSignUp: state.authReducer.errorMsgSignUp
    }
}

const mapDispatchToProps = (dispatch, props) => {
    return {
        SignUp: (userName, passWord, sex, birthday, email, phone, displayName, typeClient) => {
            FirebaseApp
                .auth()
                .createUserWithEmailAndPassword(userName, passWord)
                .then(() => {
                    FirebaseApp.auth().onAuthStateChanged((user) => {
                        if (user) {
                            var uid = user.uid;
                            FirebaseApp.firestore().collection("User").doc(uid).set({
                                userName: userName,
                                passWord: passWord,
                                imageAva: "",
                                displayName: displayName,
                                sexUser: sex,
                                dateOfBirth: birthday,
                                email: email,
                                phone: phone,
                                typeClient: typeClient

                            })
                                .catch((error) => {
                                    console.error("Error adding document: ", error);
                                });
                        }
                    });
                })
                .then(() => {
                    SetAccount('userAccount', { userName, passWord, typeClient })
                        .then(() => {
                            dispatch(actSignUp(userName, passWord, typeClient))
                        })
                })
                .then(() => {
                    CommonActions.navigate({
                        name: "AppStack"
                    })
                })
                .catch(function (e) {
                    var errorCode = e.code;
                    var errorMessage = e.message;
                    console.log(errorCode + " ---- " + errorMessage)
                    if (e.code === 'auth/email-already-in-use') {
                        console.log('Tai Khoan Ton Tai')
                        dispatch(actSignUpFailed(e.message))
                    }
                    else if (e.code === 'auth/weak-password') {
                        console.log('Mat Khau Qua Yeu')
                        dispatch(actSignUpFailed(e.message))
                    }
                })
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SignUp)