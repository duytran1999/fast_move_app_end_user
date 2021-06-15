import React, { Component } from 'react'
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import { WIDTH_DEVICE, HEIGHT_DEVICE } from '../../constants/DeviceDimensions'

const size_icon = 30
class TopBar extends Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }
    render() {
        return (
            <View style={style.container}>
                <TouchableOpacity
                    onPress={() => this.props.logOut()}
                >
                    <Image
                        source={require('../../assets/logo/logo_namngangTo.png')}
                        style={style.logo}
                    />
                </TouchableOpacity>
                <View style={{ flexDirection: 'row', }}>
                    <TouchableOpacity style={{ marginRight: 10 }}>
                        <View style={{ backgroundColor: '#D7443E', borderRadius: size_icon / 2, height: size_icon, width: size_icon, justifyContent: 'center', alignItems: 'center' }}>
                            <FontAwesome5
                                name={"search"}
                                color={"white"}
                                size={size_icon - 20}
                            />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={{}} onPress={()=>this.props.navigation.navigate("Chat")}>
                        <View style={{ backgroundColor: '#D7443E', borderRadius: size_icon / 2, height: size_icon, width: size_icon, justifyContent: 'center', alignItems: 'center' }}>
                            <FontAwesome5
                                name={"comments"}
                                color={"white"}
                                size={size_icon - 20}
                            />
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

const mapStateToProps = (state) => ({

})

const mapDispatchToProps = {

}

const style = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 15
    },
    logo: {
        width: 100, height: 50
    }
})

export default connect(null, null)(TopBar)
