import * as types from '../constants/index'

const INITIAL_STATE = {
    isLoading: true,
    isSignout: false,
    userName: null,
    passWord: null,
    errorMsg: null,
    errorMsgSignIn: null,
    errorMsgSignUp: null
};

// chú ý initial state là object ko là mảng


const authReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case types.RESTORE_TOKEN:
            return {
                isLoading: false,
                isSignout: false,
                userName: action.userName,
                passWord: action.passWord,
                errorMsg: null
            };
        case types.SIGN_IN:
            return {
                isLoading: false,
                isSignout: false,
                userName: action.userName,
                passWord: action.passWord,
                errorMsgSignIn: null
            };
        case types.SIGN_UP:
            return {
                isLoading: false,
                isSignout: false,
                userName: action.userName,
                passWord: action.passWord,
                errorMsgSignUp: null
            };
        case types.SIGN_OUT:
            return {
                isLoading: false,
                isSignout: true,
                userName: null,
                passWord: null,
                errorMsg: null,
                errorMsgSignIn: null,
                errorMsgSignUp: null
            };
        case types.SIGN_IN_FAILED:
            return {
                isLoading: false,
                isSignout: true,
                userName: null,
                passWord: null,
                errorMsgSignIn: action.errorMsg
            };
        case types.SIGN_UP_FAILED:
            return {
                isLoading: false,
                isSignout: true,
                userName: null,
                passWord: null,
                errorMsgSignUp: action.errorMsg
            };

        default:
            return state;
    }
}

export default authReducer;