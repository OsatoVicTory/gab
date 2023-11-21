import { useEffect, useRef } from 'react';
import { catchError, responseMessage } from '../utils/others';
import { receivedAllGroupMessage, readAllGroupMessage, 
    receivedGroupMessage, readGroupMessage, fetchGroupWithMessages
} from '../services/group';

const useGroupsSocket = (
    socket, setter, groups, initSetter, 
    init, loadedState, userId, setStatusMessage
) => {

    //type => 'direct-chat or 'group-chat';
    const path_url = window.location.pathname;
    const getPath = () => {
        const path = path_url.split('/');
       return { type: path[3], id: path[4] };
    }
    const pathRef = useRef(getPath());
    const { type, id } = getPath();

    useEffect(() => {
        if(type === 'group-chat' && id) {
            catchError(readAllGroupMessage(id), setStatusMessage);
            socket.emit('readMessageGroup', { 
                groupId: id, receiverId: userId, 
                time: String(new Date()),
            });
        }
        pathRef.current = getPath();
    }, [path_url]);

    useEffect(() => {
        if(loadedState?.chats && !init?.chats) {
            const time = String(new Date());
            catchError(receivedAllGroupMessage(), setStatusMessage);
            socket.emit('receivedAllMessageGroup', { 
                groups, receiverId: userId, time 
            });
            initSetter({ groups: true });
        }
        
        if(true) {

            socket.on('typingGroup', (data) => {
                setter('typing', data.groupId, data.typer);
            });
            socket.on('stoppedtypingGroup', (data) => {
                setter('typing', data.groupId, false);
            });
        
            socket.on('receiveMessageGroup', (data) => {
                if(data.message.senderId === userId) return;
                const pathObj = pathRef.current;
                const isRead = (pathObj.type==='group-chat' && pathObj.id===data.message.groupId);
                socket.emit(isRead ? 'readMessageGroup' : 'receivedMessageGroup', { 
                    senderId: data.message.senderId, groupId: data.message.groupId,
                    messageId: data.message._id, time : String(new Date()),
                    receiverId: userId,
                });
                
                catchError(
                    ( isRead ? readGroupMessage(data.message._id) :
                    receivedGroupMessage(data.message._id) ),
                    setStatusMessage
                );
                setter('receiveMessage', 
                    data.message.groupId, data.message,
                    pathRef.current.id === data.message.groupId, userId
                );
            });

            // reaceive - read
            socket.on('receivedMessageGroup', (data) => {
                setter('receivedMessage', data.groupId, 
                data?.messageId, data.receiverId, data.time);
            });
            socket.on('readMessageGroup', (data) => {
                setter('readMessage', data.groupId, 
                data?.messageId, data.receiverId, data.time);
            });

            socket.on('edittedMessageGroup', (data) => {
                if(data.setter === userId) return;
                setter('editMessage', data.messageData);
            });

            // Reactions
            socket.on('reactedGroup', (data) => {
                const { messageId, senderId, groupId, reaction } = data;
                setter('receiveReaction', senderId, messageId, groupId, reaction);
            });
            socket.on('removeReactionGroup', (data) => {
                const { messageId, senderId, groupId } = data;
                setter('receiveReaction', senderId, messageId, groupId);
            });

            socket.on('deletedMessageGroup', (data) => {
                setter('deletedMessage', data.groupId, data.messageId);
            });

            socket.on('createGroup', (data) => {
                if(data.setter === userId) return;
                setter('createGroup', data.group, data.message);
            });
            socket.on('editedGroup', (data) => {
                // no need to check setter as we have fixed it in the modal
                fetchGroupWithMessages(data.groupId).then(res => {
                    setter('editedGroup', data.groupId, res.data.group);
                }).catch(err => {
                    responseMessage('error', setStatusMessage, err); 
                });
            });
            socket.on('joinedGroup', (data) => {
                if(data.user._id === userId) return;
                setter('joinedGroup', data.groupId, data.user, data.message);
            });
            socket.on('makeAdmin', (data) => {
                if(data.setter === userId) return;
                setter('makeAdmin', data.groupId, data.userId, data.message);
            });
            socket.on('removeParticipant', (data) => {
                if(data.setter === userId) return;
                setter('removeParticipant', data.groupId, data.userId, data.message);
            });
            socket.on('exitedGroup', (data) => {
                if(data.exiter === userId) return;
                setter('exitGroup', data.groupId, data.exiter, data.message);
            });
        }

    }, []);
}

export default useGroupsSocket;