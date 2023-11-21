import { useEffect } from 'react';
// import { catchError } from '../utils/others';

const useStatusSocket = (socket, setter, setChats) => {

    useEffect(() => {
    
        if(!socket.notLoaded) {
            socket.on('receiveStatus', (data) => {
                setter('receiveStatus', data.account, data.status);
                setChats('hasStatus', data.account._id, true);
            });
        
            socket.on('deleteStatus', (data) => {
                setter('deleteStatus', data.accountId, data.statusId);
            });
        
            socket.on('viewStatus', (data) => {
                setter('viewedMyStatus', data.viewerId, data.statusId, data.time);
            });
        }

    }, [socket?.notLoaded]);
}

export default useStatusSocket;