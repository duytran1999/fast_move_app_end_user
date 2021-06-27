
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
const LoadAssets = async () => {
  const imageAssets = Asset.loadAsync([
    require('./src/assets/picture/dating/dating1.jpg'),
    require('./src/assets/picture/dating/dating2.jpg'),
    require('./src/assets/icon/bell.png'),
    require('./src/assets/icon/chat.png'),
    require('./src/assets/icon/chat(2).png'),
    require('./src/assets/icon/chat(3).png'),
    require('./src/assets/icon/circle.png'),
    require('./src/assets/icon/compass.png'),
    require('./src/assets/icon/contact.png'),
    require('./src/assets/icon/debit-card.png'),
    require('./src/assets/icon/destination.png'),
    require('./src/assets/icon/dollar.png'),
    require('./src/assets/icon/driver.png'),
    require('./src/assets/icon/dualring.gif'),
    require('./src/assets/icon/error.png'),
    require('./src/assets/icon/flag-finish.png'),
    require('./src/assets/icon/flag.png'),
    require('./src/assets/icon/gear.png'),
    require('./src/assets/icon/heart.png'),
    require('./src/assets/icon/help.png'),
    require('./src/assets/icon/house.png'),
    require('./src/assets/icon/Infinity-1s-244px.gif'),
    require('./src/assets/icon/left-arrow-slim.png'),
    require('./src/assets/icon/left-arrow.png'),
    require('./src/assets/icon/location.png'),
    require('./src/assets/icon/location(1).png'),
    require('./src/assets/icon/logout.png'),
    require('./src/assets/icon/map(2).png'),
    require('./src/assets/icon/menu.png'),
    require('./src/assets/icon/menu(1).png'),
    require('./src/assets/icon/menu(3).png'),
    require('./src/assets/icon/merchandise.png'),
    require('./src/assets/icon/money.png'),
    require('./src/assets/icon/pin(1).png'),
    require('./src/assets/icon/pin(2).png'),
    require('./src/assets/icon/placeholder.png'),
    require('./src/assets/icon/plus.png'),
    require('./src/assets/icon/post-it.png'),
    require('./src/assets/icon/Ripple-1s-200px.gif'),
    require('./src/assets/icon/rounded-black-square-shape.png'),
    require('./src/assets/icon/search.png'),
    require('./src/assets/icon/send.png'),
    require('./src/assets/icon/Spinner-1s-317px.gif'),
    require('./src/assets/icon/Spinner-1s-344px.gif'),
    require('./src/assets/icon/start.png'),
    require('./src/assets/icon/taxi-driver.png'),
    require('./src/assets/icon/tip.png'), require('./src/assets/icon/truck.png'),
    require('./src/assets/icon/truck.png'),
    require('./src/assets/icon/user(1).png'),
    require('./src/assets/icon/view.png'),
    require('./src/assets/icon/iconService/delivery(1).png'),
    require('./src/assets/icon/iconService/delivery-truck(1).png'),
    require('./src/assets/icon/iconService/delivery-truck.png'),
    require('./src/assets/icon/iconService/delivery.png'),
    require('./src/assets/icon/iconService/fast-time.png'),
    require('./src/assets/icon/iconService/map.png'),
    require('./src/assets/icon/iconService/mini-van.png'),
    require('./src/assets/icon/iconService/shipping.png'),
  ])
  return await Promise.all([imageAssets])
}
export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loadingAssets: true
    }
  }

  render() {
    if (this.state.loadingAssets === true) {
      return (
        <AppLoading
          startAsync={LoadAssets}
          onFinish={() => this.setState({ loadingAssets: false })}
          onError={console.warn}
        />
      )
    }
    return (
      <Provider store={store}>
        <StatusBar />
        <Routes />
      </Provider>
    )
  }
}

