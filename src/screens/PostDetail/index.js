import React, { Component } from 'react'
import {
    Text, View, FlatList, Image, StyleSheet, TouchableOpacity, ScrollView, StatusBar, SafeAreaView, Platform,
} from 'react-native'
import { connect } from 'react-redux'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AutoHeightImage from 'react-native-auto-height-image';

import { WIDTH_DEVICE, HEIGHT_DEVICE } from '../../constants/DeviceDimensions'

import HeaderBar from '../../components/HeaderBar/index'

export class PostDetail extends Component {
    constructor(props) {
        super(props)

    }
    componentDidMount() {
    }
    render() {
        return (
            <SafeAreaView style={{ flex: 1 }} >
                <HeaderBar
                    navigation={this.props.navigation}
                    namePost={this.props.route.params.namePost}
                />
                <ScrollView style={{paddingHorizontal:10}}>
                    <View>

                    </View>
                    <View style={{ marginVertical: 10, marginHorizontal: 5 }}>
                        <Text style={{ fontSize: 17 }}>
                            {this.props.route.params.contentPost}
                        </Text>
                    </View>
                    {
                        this.props.route.params.imagePost.map((item, index) => (
                            <TouchableOpacity
                                key={index}
                                style={{ borderBottomColor: "#dfe6e9", borderBottomWidth: 10 }}
                            >
                                <View>
                                    <AutoHeightImage
                                        width={WIDTH_DEVICE}
                                        source={item}
                                    />
                                </View>
                            </TouchableOpacity>
                        ))
                    }
                </ScrollView>

            </SafeAreaView>
        )
    }
}

const mapStateToProps = (state) => ({

})

const mapDispatchToProps = {

}

export default (PostDetail)
