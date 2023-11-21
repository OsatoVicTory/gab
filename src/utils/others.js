export const responseMessage = (
    type, setStatusMessage, response
) => {
    if(type === 'success') {
        setStatusMessage({ type: 'success', text: response.data.message });
    } else if(type === 'use-server') {
        setStatusMessage({ type: response.data.status, text: response.data.message });
    } else {
        setStatusMessage({ 
            type: 'error', 
            text: response?.response?.data?.message || response?.data?.message ||
            response?.message || 'Network Error',
        });
    }
};

export const catchError = (fn, setStatusMessage) => {
    fn.catch(err => responseMessage('error', setStatusMessage, err));
}

export const debounce = (
    fn, data, setLoading, setStatusMessage, cb, onlyErr = false
) => {
    setTimeout(() => {
        fn(data).then(res => {
            if(!onlyErr) responseMessage('use-server', setStatusMessage, res);
            cb(res.data);
            setLoading(false);
        }).catch(err => {
            responseMessage('error', setStatusMessage, err);
            setLoading(false);
        })
    }, 300);
};