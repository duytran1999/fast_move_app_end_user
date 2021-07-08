import * as types from '../constants/index'

const INITIAL_STATE = {
    isLoading: true,
    isSignout: false,
    userName: null,
    passWord: null,
    errorMsg: null,
    errorMsgSignIn: null,
    errorMsgSignUp: null,
    typeClient: null
};

// chú ý initial state là object ko là mảng


const authReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case types.RESTORE_TOKEN:
            return {
                ...state,
                isLoading: false,
                isSignout: false,
                userName: action.userName,
                passWord: action.passWord,
                typeClient: action.typeClient,
                errorMsg: null
            };
        case types.SIGN_IN:
            return {
                ...state,
                isLoading: false,
                isSignout: false,
                userName: action.userName,
                passWord: action.passWord,
                errorMsgSignIn: null
            };
        case types.SIGN_UP:
            return {
                ...state,
                isLoading: false,
                isSignout: false,
                userName: action.userName,
                passWord: action.passWord,
                errorMsgSignUp: null
            };
        case types.SIGN_OUT:
            return {
                ...state,
                isLoading: false,
                isSignout: true,
                userName: null,
                passWord: null,
                typeClient: null,
                errorMsg: null,
                errorMsgSignIn: null,
                errorMsgSignUp: null
            };
        case types.SIGN_IN_FAILED:
            return {
                ...state,
                isLoading: false,
                isSignout: true,
                userName: null,
                passWord: null,
                errorMsgSignIn: action.errorMsg
            };
        case types.SIGN_UP_FAILED:
            return {
                ...state,
                isLoading: false,
                isSignout: true,
                userName: null,
                passWord: null,
                errorMsgSignUp: action.errorMsg
            };
        case types.CLIENT_TYPE_CLIENT:
            return {
                ...state,
                typeClient: action.typeClient
            };
        case types.CLIENT_TYPE_DRIVER:
            return {
                ...state,
                typeClient: action.typeClient
            };

        default:
            return state;
    }
}

export default authReducer;