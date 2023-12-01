import React from 'react'
import { Provider } from 'react-redux'
import { combineReducers, createStore } from 'redux'
import CommentReducer from './commentReducer/CommentReducer';
import CommunitiesReducer from './communitiesReducer/communitiesReducer';

const AppReducer = ({ children }) => {
    const store = createStore(
        combineReducers({
            commentReducer: CommentReducer,
            communitiesReducer: CommunitiesReducer
        })
    );
    return (
        <Provider store={store}>
            {children}
        </Provider>
    )
}

export default AppReducer