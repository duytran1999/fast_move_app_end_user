import * as types from '../constants/index'
import { FirebaseApp } from '../api/firebase/index'
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps'


export const actGetMyLocation = (location) => {
    return {
        type: types.GET_LOCATION,
        location: location
    }
}

export const actGetMyLocationString = (locationString) => {

    return {
        type: types.GET_LOCATION_STRING,
        locationString: locationString
    }
}
export const actGetLocationSender = (
    locationSender,
    locationSenderCoords,
    senderInfo
) => {
    return {
        type: types.GET_LOCATION_SENDER,
        locationSender: locationSender,
        locationSenderCoords: locationSenderCoords,
        senderInfo: senderInfo
    }
}

export const actGetLocationReceiver = (
    locationReceiver,
    locationReceiverCoords,
    receiverInfo
) => {
    return {
        type: types.GET_LOCATION_RECEIVER,
        locationReceiver: locationReceiver,
        locationReceiverCoords: locationReceiverCoords,
        receiverInfo: receiverInfo
    }
}