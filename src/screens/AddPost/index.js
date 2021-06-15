import React, { Component } from 'react'
import {
    View, KeyboardAvoidingView, TextInput, StyleSheet, Text,
    Platform, TouchableWithoutFeedback, Button, Keyboard,
    Image, TouchableOpacity, SafeAreaView
} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { WIDTH_DEVICE, HEIGHT_DEVICE } from '../../constants/DeviceDimensions'
const size_icon = 20
export class AddPost extends Component {
    constructor(props) {
        super(props);
        this.state = {
            postContent: "",
            imagePost: "",
            createAt: "",
            heightKeyBoard: 0,
            shownKeyboard: false
        }
    }
    componentDidMount() {
        this.keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            (e) => {

                this.setState({
                    heightKeyBoard: e.endCoordinates.height,
                    shownKeyboard: true
                })
                console.log('State Keyboard Shown: ' + this.state.heightKeyBoard)
            },
        );
        this.keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            (e) => {
                this.setState({
                    heightKeyBoard: e.endCoordinates.height,
                    shownKeyboard: false
                })
                console.log('State Keyboard Hide: ' + this.state.heightKeyBoard)
            },
        );
    }

    componentWillUnmount() {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
    }

    _keyboardDidShow(e) {
        console.log(HEIGHT_DEVICE)
        alert('Keyboard Shown: ' + e.endCoordinates.height);
        // this.setState({
        //     imagePost: "asdasdasd"
        // })
    }

    _keyboardDidHide(e) {
        alert('Keyboard Hidden: ' + e.endCoordinates.height);
        // this.setState({
        //     imagePost: "asdasdasd"
        // })
    }

    goToHome() {
        this.props.navigation.goBack();
        Keyboard.dismiss()
    }
    headerBar() {
        return (
            <View style={{
                flexDirection: 'row', justifyContent: "space-between", alignItems: 'center',
                paddingHorizontal: 10, paddingVertical: 5,
                height: 50
            }}>
                <TouchableOpacity
                    onPress={() => this.goToHome()}
                >
                    <View style={{ width: 60, height: 40, justifyContent: 'center' }}>
                        <FontAwesome5 name="chevron-left" color="#D7443E" size={30} />
                    </View>
                </TouchableOpacity>
                <View>
                    <Text style={{ fontSize: 20 }}>
                        Bài Viết
                    </Text>
                </View>

                <TouchableOpacity>
                    <View style={{ backgroundColor: this.state.postContent.length > 0 ? '#D7443E' : "#a4b0be", borderRadius: 10, width: 60, height: 40, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: 'white' }}>
                            Đăng
                        </Text>
                    </View>
                </TouchableOpacity >
            </View >
        )
    }
    render() {
        return (
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.container}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss} style={{ flex: 1 }}>
                    <SafeAreaView style={{ flex: 1 }} >
                        {
                            this.headerBar()
                        }
                        <View style={{ justifyContent: 'space-between', flex: 1 }}>
                            <View style={{ margin: 10 }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <View>
                                        <Image
                                            source={require('../../assets/icon/user(1).png')}
                                            style={{ width: 35, height: 35 }}
                                        />
                                    </View>
                                    <View style={{ marginLeft: 10 }}>
                                        <Text style={{ fontSize: 14, fontWeight: '600' }}>  Duy Tran</Text>
                                    </View>
                                </View>
                                <TextInput
                                    placeholder="Bạn đang làm gì ? "
                                    onChangeText={(postContent) => this.setState({ postContent })}
                                    onSubmitEditing={Keyboard.dismiss}
                                />
                            </View>
                            {
                                <View style={{
                                    backgroundColor: '#dfe4ea',
                                    borderTopLeftRadius: 15, borderTopRightRadius: 15,
                                    height: 50, width: WIDTH_DEVICE,
                                    position: 'absolute',
                                    bottom: 0, padding: 5,

                                }} >
                                    <View style={{
                                        flexDirection: "row", justifyContent: 'space-between', alignItems: 'center',
                                        padding: 10
                                    }}>
                                        <TouchableOpacity>
                                            <FontAwesome5
                                                name={"camera"}
                                                size={size_icon}
                                                color={"#ff4757"}
                                            />
                                        </TouchableOpacity>
                                        <TouchableOpacity>
                                            <FontAwesome5
                                                name={"images"}
                                                size={size_icon}
                                                color={"#ff4757"}
                                            /></TouchableOpacity>
                                        <TouchableOpacity>
                                            <FontAwesome5
                                                name={"users"}
                                                size={size_icon}
                                                color={"#ff4757"}
                                            /></TouchableOpacity>
                                    </View>
                                </View>
                            }
                        </View>
                    </SafeAreaView>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView >
        )
    }
}

export default AddPost

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    inner: {
        padding: 24,
        flex: 1,
        justifyContent: "space-around"
    },
    header: {
        fontSize: 36,
        marginBottom: 48
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
