export const openCommunitiesMenuFunc = (dispatch, value) => {
    dispatch({
        type: 'OPEN_COMMUNITIES_MENU',
        payload: value
    })
}

export const openCommunitiesInviteFunc = (dispatch, community, value) => {
    dispatch({
        type: 'OPEN_COMMUNITIES_INVITE',
        community: community,
        payload: value
    })
}