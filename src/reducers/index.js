import { combineReducers } from 'redux'
import authReducer from './authReducer'
import locationReducer from './locationReducer'

const appReducer = combineReducers({
    authReducer, locationReducer
})

export default appReducer