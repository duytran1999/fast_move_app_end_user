import React, { Component } from 'react'
import { Text, View, TouchableOpacity, SafeAreaView, StyleSheet, StatusBar, FlatList, Image, Platform, TextInput } from 'react-native'

import { connect } from 'react-redux'
import HeaderBar from '../../components/HeaderBar'
import { WIDTH_DEVICE_SCREEN } from '../../constants/DeviceDimensions'
import GlobalStyles from '../../constants/GlobalStyle'
export class LocationSender extends Component {
    constructor(props) {
        super(props)
        this.state = {
            detailLocation: '',
            nameSender: "",
            phoneSender: "",
            bool1: false,
            bool2: false,
        }
    }
    renderLocation = (locationString) => {
        // let { street, district, subregion, city } = this.props.myUserLocationString[0]
        // return street + " " + district + " " + subregion + " " + city
        let { street, district, subregion, city } = locationString
        return street + " " + district + " " + subregion + " " + city
    }

    render() {

        return (
            <>
                <StatusBar backgroundColor={"#D7443E"} />
                <SafeAreaView style={GlobalStyles.droidSafeArea}>
                    <HeaderBar
                        navigation={this.props.navigation}
                        name={"Thông Tin Người Gửi"}
                    />
                    <View style={{
                        backgroundColor: "#ecf0f1"
                    }}>
                        <View>
                            <Text style={{ fontSize: 16, color: "#7f8c8d", paddingHorizontal: 10, paddingVertical: 5 }}>
                                Địa chỉ lấy hàng
                            </Text>
                        </View>

                        <View style={{ backgroundColor: 'white', paddingHorizontal: 10, paddingVertical: 5 }}>
                            <TouchableOpacity
                                onPress={() => this.props.navigation.navigate("Map")}
                            >
                                <View style={{
                                    flexDirection: 'row',
                                    height: 100, alignItems: 'center', marginTop: 5,
                                    width:WIDTH_DEVICE_SCREEN-20-20
                                }} >
                                    <View
                                        style={{
                                            width: 10, height: 10, borderRadius: 5,
                                            backgroundColor: 'blue', marginRight: 10
                                        }}
                                    />
                                    <View>
                                        <Text style={{ fontSize: 20, fontWeight: 'bold' }}
                                            numberOfLines={2}>
                                            {
                                                this.renderLocation(this.props.myUserLocationString[0])
                                            }
                                        </Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                            <View style={{
                                borderRadius: 10, borderWidth: 1, borderColor: "#bdc3c7",
                                height: 40, justifyContent: 'space-between', paddingHorizontal: 10,
                                marginBottom: 20,
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
                                            <Text style={{ fontSize: 17, color: "#636e72", fontWeight: "bold" }}>
                                                Tên Người Gửi
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
                                            Tên Người Gửi
                                        </Text>
                                        <View style={{
                                            flexDirection: 'row',
                                            justifyContent: 'space-between', alignItems: 'center'
                                        }}>
                                            <TextInput
                                                value={this.state.nameSender}
                                                placeholder="Nhập tên người gửi"
                                                onChangeText={(nameSender) => this.setState({ nameSender })}
                                                autoFocus={this.state.bool1}
                                                onEndEditing={() => this.setState({ bool1: false })}
                                            />
                                            {
                                                this.state.nameSender.length > 0
                                                    ?
                                                    <TouchableOpacity onPress={() => this.setState({
                                                        nameSender: ""
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
                                                <Text style={{ fontSize: 17, color: "#636e72", fontWeight: "bold" }}>
                                                    Số Điện Thoại
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
                                                    value={this.state.phoneSender}
                                                    placeholder="Nhập tên người gửi"
                                                    onChangeText={(phoneSender) => this.setState({ phoneSender })}
                                                    autoFocus={this.state.bool2}
                                                    onEndEditing={() => this.setState({ bool2: false })}
                                                />
                                                {
                                                    this.state.phoneSender.length > 0
                                                        ?
                                                        <TouchableOpacity onPress={() => this.setState({
                                                            phoneSender: ""
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
                    </View>


                </SafeAreaView>
            </>

        )
    }
}

const mapStateToProps = (state) => {
    return {
        //userName: state.authReducer.userName,
        myUserLocation: state.locationReducer.userLocation,
        myUserLocationString: state.locationReducer.userLocationString,
    }
}

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(LocationSender)
