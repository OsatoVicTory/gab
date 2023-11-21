import StatusUtils from './utils/status';

const Utils = new StatusUtils();

const INITIAL_STATE = { mine: [], data: [], newStatus: 0, loaded: false };

export const statusReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'SET_STATUS_DATA':
            console.log('status action.payload=>');
            return Utils[action.payload[0]]({...state}, action.payload.slice(1, 10));
        default:
            return state;
    }
}

export const setStatusData = (...data) => {
    return (dispatch) => {
        dispatch({
            type: "SET_STATUS_DATA",
            payload: data
        })
    }
}