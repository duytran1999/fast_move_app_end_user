import React, { Component } from 'react'
import { Text, View, ImageBackground } from 'react-native'
import { connect } from 'react-redux'
import { CommonActions } from '@react-navigation/native'
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
                <Text>
                    Splash Screen
                </Text>
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