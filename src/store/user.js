export const userReducer = (state = {}, action) => {
    switch (action.type) {
        case 'SET_USER_DATA':
            return { ...state, ...action.payload };
        default:
            return state;
    }
}

export const setUserData = (data) => {
    return (dispatch) => {
        dispatch({
            type: "SET_USER_DATA",
            payload: data
        })
    }
}