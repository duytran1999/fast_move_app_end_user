
import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Provider } from 'react-redux'

import { createStore, applyMiddleware, compose } from 'redux'
import appReducer from './reducers/index'

import thunk from 'redux-thunk'

import Routes from './routes'


const store = createStore(
  appReducer,
  applyMiddleware(thunk)
)
export default class MangXaHoi extends Component {
  render() {
    return (
      <View style={{marginTop:90}}>
        <Text>
          ád
        </Text>
      </View>
    )
  }
}

{/* <Provider store={store}>
        <Routes />
      </Provider> */}