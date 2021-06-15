import * as types from '../constants/index'

import { FirebaseApp } from '../api/firebase/index'

export const actRestoreToken = (user) => {
    if (user != null) {
        const acc = JSON.parse(user)
        return {
            type: types.RESTORE_TOKEN,
            userName: acc.userName,
            passWord: acc.passWord,
        }
    } else {
        return {
            type: types.RESTORE_TOKEN,
            userName: null,
            passWord: null,
        }
    }
}

export const actSignIn = (userName, passWord) => {
    if (userName) {
        return {
            type: types.SIGN_IN,
            userName: userName,
            passWord: passWord,
        }
    }
}

export const actSignUp = (userName, passWord) => {
    if (userName) {
        return {
            type: types.SIGN_UP,
            userName: userName,
            passWord: passWord,
        }
    }
}

export const actSignInFailed = (error) => {
    return {
        type: types.SIGN_IN_FAILED,
        errorMsg: error
    }
}

export const actSignUpFailed = (error) => {
    return {
        type: types.SIGN_UP_FAILED,
        errorMsg: error
    }
}

export const actSignOut = () => {
    return {
        type: types.SIGN_OUT
    }
}