import React, { Component } from 'react'
import {
    Text, View, FlatList, Image, StyleSheet, TouchableOpacity, ScrollView, StatusBar, SafeAreaView, Platform,
} from 'react-native'
import { connect } from 'react-redux'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import ViewPager from '@react-native-community/viewpager';
import AutoHeightImage from 'react-native-auto-height-image';

import { WIDTH_DEVICE, HEIGHT_DEVICE } from '../../constants/DeviceDimensions'

import HeaderBar from '../../components/HeaderBar/index'

export class ImageDetail extends Component {
    constructor(props) {
        super(props)

    }
    render() {
        return (
            <SafeAreaView style={{ flex: 1 }} >
                <HeaderBar
                    navigation={this.props.navigation}
                    namePost={"Hình Ảnh "}
                />
                <ViewPager style={styles.viewPager} initialPage={this.props.route.params.index}>
                    {this.props.route.params.imagePost.map((item, index) => (
                        <View style={styles.page} key={index} >
                            <AutoHeightImage
                                width={WIDTH_DEVICE}
                                source={item}
                            />
                        </View>
                    ))}
                </ViewPager>

            </SafeAreaView>
        )
    }
}

const mapStateToProps = (state) => ({

})

const mapDispatchToProps = {

}
const styles = StyleSheet.create({
    viewPager: {
        flex: 1,
    },
    page: {
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default (ImageDetail)
