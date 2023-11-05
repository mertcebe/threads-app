let initialState = {
    isCommentSecOpen: false,
    commentOwner: null
};

const CommentReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'TOGGLE_COMMENT_SEC':
            return {
                ...state,
                isCommentSecOpen: action.payload.toggle,
                commentOwner: action.payload.owner
            };
        default:
            return state
    }
}

export default CommentReducer