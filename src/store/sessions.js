// for loaded state and modals
export const sessionsReducer = (state = {}, action) => {
    switch (action.type) {
        case 'SET_LOADED_STATE_DATA':
            return { ...state, loadedState: {...state.loadedState, ...action.payload} };
        case 'SET_MODAL_DATA':
            return { ...state, modal: action.payload };
        case 'SET_MODAL_MESSAGE_DATA':
            return { ...state, modalMessage: action.payload };
        case 'SET_INITIALIZED_DATA':
            return { ...state, initialized: {...state.initialized, ...action.payload} };
        case 'SET_EDIT_GROUP_DATA':
            return { ...state, group: action.payload };
        default:
            return state;
    }
}

export const setLoadedStateData = (data) => {
    return (dispatch) => {
        dispatch({
            type: "SET_LOADED_STATE_DATA",
            payload: data
        })
    }
}

export const setModalData = (data) => {
    return (dispatch) => {
        dispatch({
            type: "SET_MODAL_DATA",
            payload: data
        })
    }
}

export const setInitializedData = (data) => {
    return (dispatch) => {
        dispatch({
            type: "SET_INITIALIZED_DATA",
            payload: data
        })
    }
}

export const setModalMessageData = (data) => {
    return (dispatch) => {
        dispatch({
            type: "SET_MODAL_MESSAGE_DATA",
            payload: data
        })
    }
}

export const setEditGroupData = (data) => {
    return (dispatch) => {
        dispatch({
            type: "SET_EDIT_GROUP_DATA",
            payload: data
        })
    }
}