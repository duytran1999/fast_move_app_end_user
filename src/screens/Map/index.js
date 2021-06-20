import React, { Component } from 'react'
<ActivityIndicator size="large" color="#D7443E" />
import { Text, View, TouchableOpacity, SafeAreaView, StyleSheet, StatusBar, FlatList, ImageBackground, Image, Platform, TextInput, ActivityIndicator } from 'react-native'
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps'
import { connect } from 'react-redux'
import HeaderBar from '../../components/HeaderBar'
import GlobalStyles from '../../constants/GlobalStyle'
import { WIDTH_DEVICE_WINDOW, HEIGHT_DEVICE_WINDOW, HEIGHT_DEVICE_SCREEN, WIDTH_DEVICE_SCREEN } from '../../constants/DeviceDimensions'
import { API_KEY_GOOGLE } from '../../constants/api_key'

import * as Location from 'expo-location';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { BlurView } from 'expo-blur';

const ASPECT_RATIO = WIDTH_DEVICE_WINDOW / HEIGHT_DEVICE_WINDOW
class Map extends Component {
    constructor(props) {
        super(props)
        this.state = {
            location: null,
            errorMsg: null,
            street: "",
            locationString: null
        }
    }
    renderLocation = (locationString) => {
        return locationString.street + " " + locationString.district + " " + locationString.subregion + " " + locationString.city
    }
    componentDidMount() {

    }
    render() {
        let { locationString } = this.state
        return (

            <SafeAreaView style={{ flex: 1, backgroundColor: '#fcfcfc' }}>
                <View style={{ flex: 1 }}>
                    <MapView
                        style={{ flex: 1 }}
                        provider='google'
                        initialRegion={{
                            latitude: 10.789013059217272,
                            longitude: 106.67586240917444,
                            latitudeDelta: 0.01,
                            longitudeDelta: 0.01 * ASPECT_RATIO
                        }}
                        onRegionChangeComplete={(region => this.props.setLocation(region))}
                        showsUserLocation={true}
                    >

                    </MapView>

                    <View style={{
                        paddingHorizontal: 10, paddingVertical: 5,
                        position: 'absolute',
                        top: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
                        width: WIDTH_DEVICE_SCREEN - 10
                    }}>
                        <View
                            style={{ flexDirection: 'row', justifyContent: "space-between", alignItems: 'center', height: 50, }}
                        >
                            <View style={{ flexDirection: 'row', justifyContent: "space-between", alignItems: 'center', }} >
                                <TouchableOpacity
                                    onPress={() => this.props.changeNavigateMap()}
                                >
                                    <View>
                                        <Image
                                            source={require("../../assets/icon/left-arrow.png")}
                                            style={{ width: 30, height: 30 }}
                                        />
                                    </View>
                                </TouchableOpacity>
                                <View style={{ marginLeft: 20 }}>
                                    <Text style={{ fontSize: 20, color: '#2f3640', fontWeight: '600' }}>
                                        Bản Đồ
                                    </Text>
                                </View>
                            </View>

                            <TouchableOpacity>
                                <View>
                                    <Image
                                        source={require("../../assets/icon/menu(3).png")}
                                        style={{ width: 30, height: 30 }}
                                    />
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View
                            style={{
                                width: WIDTH_DEVICE_SCREEN - 30,
                                height: 60, marginHorizontal: 5, marginTop: 5, backgroundColor: 'white',
                                justifyContent: 'center', alignItems: 'center',
                                shadowColor: "#000000",
                                shadowOpacity: 0.3,
                                shadowRadius: 2,
                                shadowOffset: {
                                    height: 1,
                                    width: 1
                                },
                                paddingHorizontal: 10
                            }}
                        >
                            <Text>
                                {
                                    this.renderLocation(this.props.locationString)
                                }
                            </Text>
                        </View>
                    </View>
                    <View style={{
                        left: '50%',
                        marginLeft: -20,
                        marginTop: -45,
                        position: 'absolute',
                        top: '50%'
                    }}>
                        <Image
                            source={require('../../assets/icon/placeholder.png')}
                            style={{ width: 50, height: 50 }}
                        />
                    </View>
                    <View style={{ position: 'absolute', bottom: 0 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', paddingHorizontal: 5 }}>
                            <Image
                                source={require('../../assets/icon/search.png')}
                                style={{ width: 20, height: 20 }}
                            />
                            <TouchableOpacity>
                                <View>
                                    <Image
                                        source={require('../../assets/icon/location(1).png')}
                                        style={{ width: 45, height: 45 }}
                                    />
                                </View>
                            </TouchableOpacity>
                        </View>

                        <View style={{ padding: 5 }}>
                            <TouchableOpacity
                                onPress={() =>{
                                    this.props.confirmLocation()
                                    this.props.changeNavigateMap()
                                }}
                            >
                                <View style={{
                                    backgroundColor: '#D7443E',
                                    justifyContent: 'center', alignItems: 'center',
                                    height: 50, width: WIDTH_DEVICE_SCREEN - 10,
                                }}>
                                    <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>
                                        Xác Nhận
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </SafeAreaView>

        )
    }
}

const mapStateToProps = (state) => ({

})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(Map)
