
import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Provider } from 'react-redux'

import { createStore, applyMiddleware, compose } from 'redux'
import appReducer from './src/reducers/index'

import thunk from 'redux-thunk'

import AppLoading from 'expo-app-loading';
import { Asset } from "expo-asset";
import * as Font from "expo-font";
import { StatusBar } from "expo-status-bar";
import Routes from './src/routes'



const store = createStore(
  appReducer,
  applyMiddleware(thunk)
)
// const LoadAssets = async () => {
//   const imageAssets = Asset.loadAsync([
//     require('./src/assets/picture/dating/dating1.jpg'),
//     require('./src/assets/picture/dating/dating2.jpg'),
//   ])
//   return await Promise.all([imageAssets])
// }
export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loadingAssets: true
    }
  }
  
  render() {
    // if (this.state.loadingAssets === true) {
    //   return (
    //     <AppLoading
    //       startAsync={LoadAssets}
    //       onFinish={() => this.setState({ loadingAssets: false })}
    //       onError={console.warn}
    //     />
    //   )
    // }
    return (
      <Provider store={store}>
        <StatusBar />
        <Routes />
      </Provider>
    )
  }
}

