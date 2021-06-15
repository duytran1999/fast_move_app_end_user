import * as types from '../constants/index'



const INITIAL_STATE = {
    userLocation: {},
    userLocationString: {},
    locationSender: {},
    locationReceiver: {},

};

// chú ý initial state là object ko là mảng


const authReducer = (state = INITIAL_STATE, action) => {
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

            };
        case types.GET_LOCATION_RECEIVER:
            return {

            };

        default:
            return state;
    }
}

export default authReducer;