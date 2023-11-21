import { useEffect } from 'react';
import { catchError } from '../utils/others';
import { 
    receivedAllDirectMessages, readAllDirectMessages, 
    receivedDirectMessage, readDirectMessage 
} from '../services/dm';

const useChatsSocket = (
    socket, setter, senders, initSetter, 
    init, loadedState, userId, setStatusMessage
) => {

    //type => 'direct-chat or 'group-chat';
    const getPath = () => {
       const path = window.location.pathname.split('/');
       return { type: path[3], id: path[4] };
    }
    const { type, id } = getPath();

    useEffect(() => {
        if(type === 'direct_chat' && id && !socket.notLoaded) {
            catchError(readAllDirectMessages(id), setStatusMessage);
            socket.emit('readMessage', { 
                senderId: id, receiverId: userId,
                time: String(new Date()), 
            });
            setter('readMessage', id, null);
        }
    }, [id, socket?.notLoaded]);

    useEffect(() => {
        if(loadedState?.chats && !init?.chats && !socket.notLoaded) {
            socket.emit('receivedAllMessage', senders);
            catchError(receivedAllDirectMessages(), setStatusMessage);
            initSetter({ chats: true });
        }
        
        if(!socket.notLoaded) {

            socket.on('receivedMessage', (data) => {
                setter('receivedMessage', data.receiverId, data?.messageId, data.time);
            });
            socket.on('readMessage', (data) => {
                setter('readMessage', data.receiverId, data?.messageId, data.time);
            });

            socket.on('typing', (data) => {
                setter('typing', data.typer, true);
            });
            socket.on('stoppedtyping', (data) => {
                setter('typing', data.typer, false);
            });
            
            socket.on('receiveMessage', (data) => {
                const pathObj = getPath();
                const isRead = (pathObj.type==='direct_chat' && pathObj.id===data.message.senderId);
                socket.emit(
                    isRead ? 
                    'readMessage' : 'receivedMessage', { 
                        senderId: data.message.senderId, 
                        messageId: data.message._id, time: String(new Date()), 
                        receiverId: data.message.receiverId 
                });
                
                if(!data.message.audio) {
                    catchError(
                        ( isRead ? readDirectMessage(data.message._id) :
                        receivedDirectMessage(data.message._id) ),
                        setStatusMessage
                    );
                }
                
                setter('receiveMessage', 
                    data.sender, data.message, 
                    pathObj.id === data.message.senderId, userId
                );
            });

            socket.on('edittedMessage', (data) => {
                setter('editMessage', data);
            });

            // Reactions
            // the below code is correct
            // as receiveReaction args are 
            // userId=>id of reactor, messageId, 
            // accountId=>id of account to update on, 
            // ...sender, emoji
            socket.on('reacted', (data) => {
                const { messageId, senderId, reaction } = data;
                setter('receiveReaction', senderId, messageId, senderId, reaction);
            });
            socket.on('removeReaction', (data) => {
                const { messageId, senderId } = data;
                setter('removeReaction', senderId, messageId, senderId);
            });

            socket.on('deletedMessage', (data) => {
                setter('deletedMessage', data.deleterId, data.messageId);
            });
        }

    }, [socket?.notLoaded]);
}

export default useChatsSocket;