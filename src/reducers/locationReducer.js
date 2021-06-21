import * as types from '../constants/index'



const INITIAL_STATE = {
    userLocation: null,
    userLocationString: null,
    locationSender: null,
    locationSenderCoords: null,
    senderInfo: null,
    locationReceiver: null,
    locationReceiverCoords: null,
    receiverInfo: null,
    serviceTransport: null
};

// chú ý initial state là object ko là mảng


const locationReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case types.GET_LOCATION:
            return {
                userLocation: action.location,
            };
        case types.GET_LOCATION_STRING:
            return {
                userLocationString: action.locationString,
            };
        case types.GET_LOCATION_SENDER:
            return {
                ...state,
                locationSender: action.locationSender,
                locationSenderCoords: action.locationSenderCoords,
                senderInfo: action.senderInfo,
            };
        case types.GET_LOCATION_RECEIVER:
            return {
                ...state,
                locationReceiver: action.locationReceiver,
                locationReceiverCoords: action.locationReceiverCoords,
                receiverInfo: action.receiverInfo,
            };
        case types.GET_SERVICE_TRANSPORT:
            return {
                ...state,
                serviceTransport: action.serviceTransport
            };

        default:
            return state;
    }
}

export default locationReducer;