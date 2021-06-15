import React, { Component } from 'react'
import {
    View, KeyboardAvoidingView, TextInput, StyleSheet, Text,
    Platform, TouchableWithoutFeedback, Button, Keyboard,
    Image, TouchableOpacity, SafeAreaView, ScrollView
} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { WIDTH_DEVICE, HEIGHT_DEVICE } from '../../constants/DeviceDimensions'
import { actSignOut } from '../../actions/index'
import { CommonActions } from '@react-navigation/native';
import { connect } from 'react-redux'
import { RemoveAccount } from '../../api/secure/index'
import { FirebaseApp } from '../../api/firebase/index'

const ListFunction = [
    {
        id: 1,
        screen: "Chat",
        name: "Trò Chuyện",
        icon: require("../../assets/icon/iconFunction/chat(4).png")
    },
    {
        id: 2,
        screen: "Maps",
        name: "Quang Đây",
        icon: require("../../assets/icon/iconFunction/map.png")
    },
    {
        id: 3,
        screen: "Page",
        name: "Trang",
        icon: require("../../assets/icon/iconFunction/pages.png")
    },
    {
        id: 4,
        screen: "Music",
        name: "Nhạc",
        icon: require("../../assets/icon/iconFunction/music.png")
    },
    {
        id: 5,
        screen: "News",
        name: "Tin Tức",
        icon: require("../../assets/icon/iconFunction/newspaper.png")
    }
]


class Setting extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showListFunction: true
        }
    }
    componentDidMount() {
        setTimeout(() => {
            this.setState({
                showListFunction: false
            })
        }, 900);
    }
    renderHeaderBar() {
        return (
            <View style={{
                flexDirection: 'row', justifyContent: 'space-between',
                alignItems: 'center',
                paddingHorizontal: 20, paddingVertical: 10
            }}>

                <View style={{
                    flexDirection: 'row', justifyContent: 'space-between',
                    alignItems: 'center',
                }}>
                    <TouchableOpacity
                        onPress={() => this.props.navigation.goBack()}
                    >
                        <FontAwesome5
                            name={"chevron-left"}
                            color={"#D7443E"}
                            size={30}
                        />
                    </TouchableOpacity>
                    <Text style={{ fontSize: 23, fontWeight: 'bold', marginLeft: 20 }}>
                        Trang Cá Nhân
                        </Text>
                </View>
                <View>
                    <FontAwesome5
                        name={"search"}
                        color={"#D7443E"}
                        size={20}
                    />
                </View>
            </View>
        )
    }
    renderPersonalPage() {
        return (
            <View style={{}}>
                <TouchableOpacity>
                    <View style={{
                        flexDirection: 'row', alignItems: 'center',
                        justifyContent: 'space-between'
                    }}>
                        <View style={{
                            flexDirection: 'row', marginTop: 10,
                            alignItems: 'center'
                        }}>
                            <View style={{ marginRight: 10 }}>
                                <Image
                                    source={require('../../assets/icon/user(1).png')}
                                    style={{
                                        height: 50, width: 50
                                    }}
                                />
                            </View>
                            <View style={{ flexDirection: 'column' }}>
                                <View>
                                    <Text style={{ fontSize: 18, fontWeight: '700' }}>Duy Trần</Text>
                                </View>
                                <View>
                                    <Text style={{ fontSize: 13, color: '#747d8c' }}>thaygiaoduy </Text>
                                </View>
                            </View>
                        </View>
                        <View style={{ transform: [{ rotate: '180deg' }] }}>
                            <FontAwesome5
                                name={"long-arrow-alt-left"} size={30} color={"#7f8c8d"}
                            />
                        </View>
                    </View>
                </TouchableOpacity>
                <View style={{ marginTop: 10, backgroundColor: '#ecf0f1', borderRadius: 20 }}>
                    {
                        this.state.showListFunction == false
                            ?
                            <TouchableOpacity onPress={() => {
                                this.setState({
                                    showListFunction: true
                                })
                            }}>
                                <View style={{
                                    flexDirection: 'row', alignItems: 'center',
                                    justifyContent: 'flex-end', paddingHorizontal: 20, paddingVertical: 5
                                }}>

                                    <Text style={{ fontSize: 12, color: "#57606f" }}>
                                        Xem tất cả các ứng dụng
                                        </Text>
                                    <View style={{ transform: [{ rotate: '270deg' }], marginLeft: 10 }}>
                                        <FontAwesome5
                                            name={"chevron-left"}
                                            color={"#D7443E"}
                                            size={20}
                                        />
                                    </View>
                                </View>
                            </TouchableOpacity>
                            :
                            null

                    }
                    <View style={{
                        flex: 1,
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        alignItems: 'flex-start'
                    }}>
                        {
                            ListFunction.map((item) =>
                                item.id <= (this.state.showListFunction == true ? ListFunction.length : 4) ?
                                    <View
                                        style={{ width: '50%' }}
                                        key={item.id}
                                    >
                                        <TouchableOpacity style={{ margin: 5 }}>
                                            <View style={{
                                                flexDirection: 'row', alignItems: 'center',
                                                justifyContent: 'space-between',
                                                backgroundColor: '#ffffff',
                                                borderRadius: 20, height: 60,
                                                paddingVertical: 5, paddingHorizontal: 10
                                            }}>
                                                <Image
                                                    source={item.icon}
                                                    style={{ height: 40, width: 40 }}
                                                />
                                                <View>
                                                    <Text style={{ fontWeight: '500' }}>
                                                        {item.name}
                                                    </Text>
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                    : null
                            )
                        }
                    </View>
                    {
                        this.state.showListFunction == true
                            ?
                            <TouchableOpacity onPress={() => {
                                this.setState({
                                    showListFunction: false
                                })
                            }}>
                                <View style={{
                                    flexDirection: 'row', alignItems: 'center',
                                    justifyContent: 'flex-end', paddingHorizontal: 20, paddingVertical: 5
                                }}>

                                    <Text style={{ fontSize: 12, color: "#57606f" }}>
                                        Thu gọn
                                        </Text>
                                    <View style={{ transform: [{ rotate: '90deg' }], marginLeft: 10 }}>
                                        <FontAwesome5
                                            name={"chevron-left"}
                                            color={"#D7443E"}
                                            size={20}
                                        />
                                    </View>
                                </View>
                            </TouchableOpacity>
                            : null
                    }
                </View>
            </View>
        )
    }
    render() {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
                {this.renderHeaderBar()}
                <ScrollView style={{ paddingHorizontal: 10 }}>
                    {this.renderPersonalPage()}

                </ScrollView>
                <TouchableOpacity onPress={() => this.props.LogOut()}>
                    <View>
                        <Text>
                            Đăng Xuất
                        </Text>
                    </View>
                </TouchableOpacity>
            </SafeAreaView>
        )
    }
}

const mapStateToProps = (state) => {
    return {

    }
}

const mapDispatchToProps = (dispatch, props) => {
    return {
        LogOut: () => {
            FirebaseApp.auth().signOut()
                .then(() => {
                    RemoveAccount('userAccount').then(() => { console.log("Remove Token Thanh Cong cc") })
                })
                .then(() => {
                    dispatch(actSignOut())
                })
                .then(() => {
                    CommonActions.navigate({
                        name: "SignIn"
                    })
                })
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Setting)