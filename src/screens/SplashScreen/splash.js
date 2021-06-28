import React, { Component } from 'react'
import { Text, View, ImageBackground, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'
import { CommonActions } from '@react-navigation/native'

import { Picker } from '@react-native-picker/picker';
import { WIDTH_DEVICE_SCREEN } from '../../constants/DeviceDimensions';
import { GetAccount } from '../../api/secure/index'
import { actRestoreToken } from '../../actions/index'
class Splash extends Component {
    constructor(props) {
        super(props);

    }
    componentDidMount() {
        console.log("i am in splash")
        //this.props.LogIn()
    }
    render() {
        return (
            <View style={{ flex: 1, backgroundColor: '#686de0', alignItems: 'center', justifyContent: 'center' }}>
                <View style={{ alignItems: 'center' }}>
                    <Text>
                        Splash
                    </Text>
                </View>
            </View>
        )
    }
}
const mapStateToProps = (state) => {
    return {
    }
}

const mapDispatchToProps = (dispatch, props) => {
    return {

    }
}
export default connect(null, null)(Splash)