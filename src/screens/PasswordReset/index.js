import React, { Component } from 'react'
import { Text, View, SafeAreaView, StatusBar, Platform, TouchableOpacity, TextInput, Image } from 'react-native'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { Formik } from 'formik';
import { FirebaseApp } from '../../api/firebase/index'
import { RecoveryPassword } from '../../utils/validation'

export class PasswordRest extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false
        }
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
    submit(values) {

        console.log(values.emailRecovery)
        this.setState({
            loading: true
        })
        setTimeout(
            () => {
                FirebaseApp.auth().sendPasswordResetEmail(values.emailRecovery)
                    .then(() => {
                        this.props.navigation.goBack()
                    }).catch(function (error) {
                        // An error happened.
                    });
            },
            5000
        )

    }
    render() {
        return (
            <SafeAreaView style={{ flex: 1,margin:15 }}>
                <StatusBar />
                {
                    this.headerBar()
                }
                <Formik
                    initialValues={{
                        emailRecovery: ""
                    }}
                    onSubmit={values => this.submit(values)}
                    validationSchema={RecoveryPassword}
                >
                    {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                        <View style={{ marginTop: 10 }}>
                            <View style={{ alignItems: 'flex-end', marginBottom: 20 }}>
                                <Text style={{ fontSize: 30, fontWeight: "bold" }}>
                                    Tìm Tài Khoản
                                </Text>
                            </View>
                            <View style={{ backgroundColor: "#dfe4ea", padding: 10, borderRadius: 10 }}>
                                <Text
                                    style={{ fontWeight: 'bold', color: "#57606f" }}
                                >Vui lòng nhập email hoặc số điện thoại để tìm kiếm tài khoản</Text>
                                <TextInput
                                    style={{ marginTop: 10 }}
                                    placeholder="Email/SĐT"
                                    onBlur={handleBlur("emailRecovery")}
                                    onChangeText={handleChange("emailRecovery")}
                                    value={values.emailRecovery}
                                />
                                {errors.emailRecovery && touched.emailRecovery ? (
                                    <Text style={{ color: 'red' }}>{errors.emailRecovery}</Text>
                                ) : null}
                            </View>
                            {
                                this.state.loading == false
                                    ?
                                    <TouchableOpacity
                                        style={{ marginTop: 20, }}
                                        onPress={handleSubmit}>
                                        <View style={{
                                            backgroundColor: '#D7443E', height: 50, borderRadius: 25,
                                            alignItems: 'center', justifyContent: 'center'
                                        }}>
                                            <Text style={{ fontSize: 17, color: "white", fontWeight: 'bold' }}>Gửi Thông Tin Khôi Phục</Text>
                                        </View>
                                    </TouchableOpacity>
                                    :
                                    <View style={{
                                        backgroundColor: '#D7443E', height: 50, borderRadius: 25,
                                        alignItems: 'center', justifyContent: 'center', marginTop: 20
                                    }}>
                                        <Image
                                            source={require('../../assets/icon/Infinity-1s-244px.gif')}
                                            style={{ height: 50, width: 50 }}
                                        />
                                    </View>
                            }
                        </View>

                    )}
                </Formik>

            </SafeAreaView >
        )
    }
}

export default PasswordRest
