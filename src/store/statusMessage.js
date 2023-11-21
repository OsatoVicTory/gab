export const statusMessageReducer = (state = {}, action) => {
    switch (action.type) {
        case "SET_STATUS_MESSAGE":
            return {...action.payload}
        default:
            return state
    }
}

export const setStatusMessageData = (data) => {
    return (dispatch) => {
        dispatch({
            type: "SET_STATUS_MESSAGE",
            payload: data
        })
    }
};