export const refreshAllComments = (dispatch, value) => {
    dispatch({
        type: 'REFRESH_COMMENTS',
        payload: value
    })
}

export const startCommentInCommentFunc = (dispatch, value) => {
    dispatch({
        type: 'START_COMMENT_IN_COMMENT',
        payload: value
    })
}