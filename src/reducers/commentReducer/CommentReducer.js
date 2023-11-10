let initialState = {
    refreshComments: false,
    commentInComment: null
};

const CommentReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'REFRESH_COMMENTS':
            return {
                ...state,
                refreshComments: action.payload,
            };
        case 'START_COMMENT_IN_COMMENT':
            return {
                ...state,
                commentInComment: action.payload
            }
        default:
            return state
    }
}

export default CommentReducer