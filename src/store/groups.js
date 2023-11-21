import GroupsUtils from './utils/groups';

const Utils = new GroupsUtils();

export const groupsReducer = (state = { data: [], totalUnreadMessages: 0 }, action) => {
    switch (action.type) {
        case 'SET_GROUPS_DATA':
            console.log(`action.payload=>`, action.payload)
            return Utils[action.payload[0]]({...state}, action.payload.slice(1, 10));
        default:
            return state;
    }
}

export const setGroupsData = (...data) => {
    return (dispatch) => {
        dispatch({
            type: "SET_GROUPS_DATA",
            payload: data
        })
    }
}