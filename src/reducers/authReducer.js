import * as types from '../constants/index'

const INITIAL_STATE = {
    isLoading: true,
    isSignout: false,
    userName: null,
    passWord: null,
    errorMsg: null,
    token: null,
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
                token: action.token,
                errorMsg: null
            };
        case types.SIGN_IN:
            return {
                ...state,
                isLoading: false,
                isSignout: false,
                userName: action.userName,
                passWord: action.passWord,
                token: action.token,
                errorMsgSignIn: null,
            };
        case types.SIGN_UP:
            return {
                ...state,
                isLoading: false,
                isSignout: false,
                userName: action.userName,
                passWord: action.passWord,
                token: action.token,
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
                errorMsgSignUp: null,
                token: null,
            };
        case types.SIGN_IN_FAILED:
            return {
                ...state,
                isLoading: false,
                isSignout: true,
                userName: null,
                passWord: null,
                token: null,
                errorMsgSignIn: action.errorMsg
            };
        case types.SIGN_UP_FAILED:
            return {
                ...state,
                isLoading: false,
                isSignout: true,
                userName: null,
                passWord: null,
                token: null,
                errorMsgSignUp: action.errorMsg
            };
        case types.RESET_SIGN_IN:
            return {
                ...state,
                errorMsgSignIn: null
            }
        case types.RESET_SIGN_UP:
            return {
                ...state,
                errorMsgSignUp: null
            }
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