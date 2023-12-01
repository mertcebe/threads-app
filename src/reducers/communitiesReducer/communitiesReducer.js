let initialState = {
    isOpenCommunitiesMenu: false,
    isOpenCommunitiesInvite: false
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
                isOpenCommunitiesInvite: action.payload,
            };
        default:
            return state
    }
}

export default CommunitiesReducer