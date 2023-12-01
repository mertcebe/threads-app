export const openCommunitiesMenuFunc = (dispatch, value) => {
    dispatch({
        type: 'OPEN_COMMUNITIES_MENU',
        payload: value
    })
}

export const openCommunitiesInviteFunc = (dispatch, value) => {
    dispatch({
        type: 'OPEN_COMMUNITIES_INVITE',
        payload: value
    })
}