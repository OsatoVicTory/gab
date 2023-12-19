import ChatsUtils from './utils/chats';

const Utils = new ChatsUtils();

export const chatsReducer = (state = { data: [], totalUnreadMessages: 0 }, action) => {
    switch (action.type) {
        case 'SET_CHATS_DATA':
            return Utils[action.payload[0]]({...state}, action.payload.slice(1, 10));
        default:
            return state;
    }
}

export const setChatsData = (...data) => {
    return (dispatch) => {
        dispatch({
            type: "SET_CHATS_DATA",
            payload: data
        })
    }
}