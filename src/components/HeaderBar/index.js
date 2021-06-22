import React, { Component } from 'react'

import { Text, View, TouchableOpacity } from 'react-native'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

export class HeaderBar extends Component {
    render() {
        return (
            <View style={{
                flexDirection: 'row', justifyContent: "space-between", alignItems: 'center', paddingHorizontal: 10, paddingVertical: 5,
                height:50,backgroundColor:'#D7443E'
            }}>
                <TouchableOpacity
                    onPress={() => this.props.goBackHomeScreen()}
                >
                    <View>
                        <FontAwesome5 name="chevron-left" color="white" size={30} />
                    </View>
                </TouchableOpacity>
                <View>
                    <Text style={{fontSize:20,color:'white',fontWeight:'bold'}}>
                        {this.props.name}
                    </Text>
                </View>

                <TouchableOpacity>
                    <View>
                       
                    </View>
                </TouchableOpacity>
            </View>
        )
    }
}

export default HeaderBar
