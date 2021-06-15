import React, { Component } from 'react'
import { Text, View, FlatList, Image, StyleSheet, TouchableOpacity, ScrollView, TextInput } from 'react-native'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import ViewPager from '@react-native-community/viewpager';
import AutoHeightImage from 'react-native-auto-height-image';

import { CommonActions } from '@react-navigation/native';

import { WIDTH_DEVICE, HEIGHT_DEVICE } from '../../constants/DeviceDimensions'
const sizeBtnReact = 20
export class Post extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "Duy Trần abcc",
            dataImg: [
                require('../../assets/picture/mer1.jpg'),
                require('../../assets/picture/mer2.jpg'),
                require('../../assets/picture/mer3.jpg'),
            ],
            content: "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc.",
            limitTheLineText: 3,
            hideFullContentText: true,
            txtComment: ""
        }
    }
    deleteComment() {
        this.setState({
            txtComment: ""
        })
    }
    changeStatusHideContent() {
        this.setState({
            hideFullContentText: !this.state.hideFullContentText
        })
        console.log(this.state.hideFullContentText)
    }
    postOwnerRender() {
        return (
            <View style={{
                flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 15,
                alignItems: 'center', marginBottom: 10
            }}>

                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View>
                        <Image
                            source={require('../../assets/icon/user(1).png')}
                            style={{ width: 35, height: 35 }}
                        />
                    </View>
                    <View style={{ marginLeft: 10 }}>
                        <Text style={{ fontSize: 14, fontWeight: '600' }}>
                            {this.state.name}
                        </Text>
                        <Text style={{ color: '#747d8c', fontSize: 12 }}>
                            9h trước
                        </Text>
                    </View>
                </View>
                <FontAwesome5
                    name={"ellipsis-v"}
                    color={"#747d8c"}
                    size={sizeBtnReact}
                />
            </View>
        )
    }
    postReact() {
        return (
            <View style={{
                flexDirection: 'row', justifyContent: 'space-between',
                paddingHorizontal: 15, marginTop: 10, marginBottom: 10, paddingTop: 10
            }}>
                <TouchableOpacity>
                    <Image
                        source={require('../../assets/icon/heart.png')}
                        style={{ width: sizeBtnReact, height: sizeBtnReact }}
                    />
                </TouchableOpacity>
                <View style={{ flexDirection: 'row' }}>
                    <TouchableOpacity style={{ marginRight: 20 }}>
                        <View>
                            <FontAwesome5
                                name={"comment"}
                                size={sizeBtnReact}
                                color={"#57606f"}
                            />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <View>
                            <FontAwesome5
                                name={"share"}
                                size={sizeBtnReact}
                                color={"#57606f"}
                            />
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
    renderImagesPost(item, index) {
        return (
            <TouchableOpacity
                key={index}
                style={{}}
                onPress={() => this.props.navigation.navigate("ImageDetail", {
                    index: index,
                    imagePost: this.state.dataImg,
                })}>
                <View style={{ alignItems: 'center', justifyContent: 'center', marginLeft: 20 }} >
                    <AutoHeightImage
                        width={WIDTH_DEVICE - 40}
                        source={item}
                        style={{ borderRadius: 20 }}
                    />
                </View>
            </TouchableOpacity>
        )
    }

    render() {
        let { limitTheLineText, hideFullContentText } = this.state
        return (
            <View>
                <TouchableOpacity onPress={() => {
                    this.props.navigation.navigate(
                        "PostDetail",
                        {
                            namePost: this.state.name,
                            imagePost: this.state.dataImg,
                            contentPost: this.state.content
                        })
                }}>
                    <View style={{ marginTop: 10 }}>
                        {this.postOwnerRender()}
                        <View style={{ paddingHorizontal: 20, marginBottom: 10 }}>
                            <Text
                                numberOfLines={hideFullContentText == true ? limitTheLineText : null}
                                style={{
                                    fontSize: 15,
                                }}
                            >
                                {'\t\t' + this.state.content}
                            </Text>
                            {
                                hideFullContentText === true
                                    ? (
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <View />
                                            <TouchableOpacity onPress={() => this.changeStatusHideContent()} style={{ marginTop: 10 }}>
                                                <Text style={{ fontWeight: '600', fontSize: 16 }}> Xem thêm</Text>
                                            </TouchableOpacity>
                                        </View>
                                    ) : (
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <View />
                                            <TouchableOpacity onPress={() => this.changeStatusHideContent()} style={{ marginTop: 10 }}>
                                                <Text style={{ fontWeight: '600', fontSize: 15 }}>Thu nhỏ</Text>
                                            </TouchableOpacity>
                                        </View>
                                    )
                            }
                        </View>
                        <View style={{ width: WIDTH_DEVICE - 20, height: HEIGHT_DEVICE / 3 }}>
                            <ViewPager style={styles.viewPager} initialPage={0}>
                                {this.state.dataImg.map((item, index) => this.renderImagesPost(item, index))}
                            </ViewPager>
                        </View>

                    </View >
                </ TouchableOpacity>
                <View style={{ marginHorizontal: 20 }}>
                    {
                        this.postReact()
                    }
                    {/* <View style={{ flexDirection: 'row', paddingHorizontal: 20, justifyContent: 'space-between', alignItems: 'center' }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                            <Image
                                source={require('../../assets/icon/user(1).png')}
                                style={{ width: 20, height: 20, marginRight: 10 }}
                            />
                            <TextInput
                                placeholder="Viết bình luận"
                                onChangeText={(txtComment) => this.setState({ txtComment })}
                                value={this.state.txtComment}
                                style={{ width: WIDTH_DEVICE - 35 - 10 - 40 - 100 }}
                            />
                        </View>
                        {
                            this.state.txtComment.length > 0
                                ?
                                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                    <TouchableOpacity
                                        onPress={() => this.deleteComment()}
                                        style={{ marginRight: 10 }}
                                    >
                                        <View>
                                            <FontAwesome5
                                                name={"backspace"}
                                                color={"#57606f"}
                                                size={25}
                                            />
                                        </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity>
                                        <View style={{ borderRadius: 10, backgroundColor: '#D7443E' }}>
                                            <Text style={{ fontSize: 10, color: 'white', padding: 10 }}>
                                                Đăng
                                </Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                                : null
                        }
                    </View> */}
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    viewPager: {
        flex: 1,
    },
    page: {

    },
});


