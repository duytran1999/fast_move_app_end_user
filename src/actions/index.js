import * as types from '../constants/index'

import { FirebaseApp } from '../api/firebase/index'

export const actRestoreToken = (user) => {
    if (user != null) {
        const acc = JSON.parse(user)
        console.log(acc)
        return {
            type: types.RESTORE_TOKEN,
            userName: acc.userName,
            passWord: acc.passWord,
            token: acc.token,
            typeClient: acc.typeClient
        }
    } else {
        return {
            type: types.RESTORE_TOKEN,
            userName: null,
            passWord: null,
            token: null,
            typeClient: null
        }
    }
}

export const actSetClientType_CLIENT = () => {
    return {
        type: types.CLIENT_TYPE_CLIENT,
        typeClient: 'client'
    }
}

export const actSetClientType_DRIVER = () => {
    return {
        type: types.CLIENT_TYPE_DRIVER,
        typeClient: 'driver'
    }
}

export const actSignIn = (userName, passWord, typeClient,token) => {
    if (userName) {
        return {
            type: types.SIGN_IN,
            userName: userName,
            passWord: passWord,
            typeClient: typeClient,
            token:token
        }
    }
}

export const actSignUp = (userName, passWord, typeClient,token) => {
    if (userName) {
        return {
            type: types.SIGN_UP,
            userName: userName,
            passWord: passWord,
            typeClient: typeClient,
            token:token
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