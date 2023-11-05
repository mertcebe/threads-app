import React from 'react'
import { Provider } from 'react-redux'
import { combineReducers, createStore } from 'redux'
import CommentReducer from './commentReducer/CommentReducer';

const AppReducer = ({ children }) => {
    const store = createStore(
        combineReducers({
            commentReducer: CommentReducer
        })
    );
    return (
        <Provider store={store}>
            {children}
        </Provider>
    )
}

export default AppReducer