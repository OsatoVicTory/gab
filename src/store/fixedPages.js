export const fixedPagesReducer = (state = { type: null }, action) => {
    switch (action.type) {
        case "SET_FIXED_IMAGES_DATA":
            return action.payload ? { ...action.payload } : { type: null };
        case "SET_FIXED_STATUS_DATA":
            return action.payload ? { ...action.payload } : { type: null };
        default:
            return state
    }
}

export const setFixedImagesData = (data) => {
    return (dispatch) => {
        dispatch({
            type: "SET_FIXED_IMAGES_DATA",
            payload: data
        })
    }
};

export const setFixedStatusData = (data) => {
    return (dispatch) => {
        dispatch({
            type: "SET_FIXED_STATUS_DATA",
            payload: data
        })
    }
};