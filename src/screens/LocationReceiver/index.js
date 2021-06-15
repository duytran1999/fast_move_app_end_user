import React, { Component } from 'react'
import { Text, View, TouchableOpacity, SafeAreaView, StyleSheet, StatusBar, FlatList, Image, Platform, TextInput } from 'react-native'

import { connect } from 'react-redux'
import HeaderBar from '../../components/HeaderBar'
import GlobalStyles from '../../constants/GlobalStyle'
import { WIDTH_DEVICE_SCREEN } from '../../constants/DeviceDimensions'

export class LocationReceiver extends Component {
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
        console.log(this.state.bool1)
        return (
            <>
                <StatusBar backgroundColor={"#D7443E"} />
                <SafeAreaView style={GlobalStyles.droidSafeArea}>
                    <HeaderBar
                        navigation={this.props.navigation}
                        name={"Thông Tin Người Nhận"}
                    />
                    <View style={{
                        backgroundColor: "#ecf0f1"
                    }}>
                        <View style={{ backgroundColor: 'white', paddingHorizontal: 10, paddingVertical: 5 }}>
                            <TouchableOpacity>
                                <View style={{
                                    flexDirection: 'row',
                                    height: 100, alignItems: 'center', marginTop: 5,
                                    width: WIDTH_DEVICE_SCREEN - 20 - 20
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
                    </View>
                    <TouchableOpacity
                        onPress={() => { }}
                    >
                        <View style={{
                            backgroundColor: 'white', marginTop: 10,
                            flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 5,

                        }}>
                            <View>
                                <Image
                                    source={require('../../assets/icon/location(1).png')}
                                    style={{ height: 20, width: 20, marginRight: 10 }}
                                />
                            </View>
                            <View>
                                <Text style={{ fontSize: 17, fontWeight: '400' }}>
                                    Vị Trí Hiện Tại
                                </Text>
                                <Text style={{
                                    fontSize: 14, fontWeight: '400', color: "#636e72",
                                    width: WIDTH_DEVICE_SCREEN - 60
                                }}>
                                    {
                                        this.renderLocation(this.props.myUserLocationString[0])
                                    }
                                </Text>
                            </View>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => { }}
                    >
                        <View style={{
                            backgroundColor: 'white', marginTop: 10,
                            flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 5,
                            height: 50
                        }}>
                            <View>
                                <Image
                                    source={require('../../assets/icon/map(2).png')}
                                    style={{ height: 20, width: 20, marginRight: 10 }}
                                />
                            </View>
                            <View>
                                <Text style={{ fontSize: 17, fontWeight: '400' }}>
                                    Chọn trên bản đồ
                                </Text>

                            </View>
                        </View>
                    </TouchableOpacity>
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

export default connect(mapStateToProps, mapDispatchToProps)(LocationReceiver)
