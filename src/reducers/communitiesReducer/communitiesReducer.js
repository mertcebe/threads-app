let initialState = {
    isOpenCommunitiesMenu: false,
    isOpenCommunitiesInvite: false,
    community: null
};

const CommunitiesReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'OPEN_COMMUNITIES_MENU':
            return {
                ...state,
                isOpenCommunitiesMenu: action.payload,
            };
        case 'OPEN_COMMUNITIES_INVITE':
            return {
                ...state,
                community: action.community,
                isOpenCommunitiesInvite: action.payload,
            };
        default:
            return state
    }
}

export default CommunitiesReducer