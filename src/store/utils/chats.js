export default class ChatsUtils {
    isSameDay(msg) {
        const today = new Date().getDay();
        return today === new Date(msg?.createdAt).getDay();
    }
    Init({ data }, [ Data ]) {
        const d = Data.data;
        const res = [];
        let pinned = 0;
        for(let i = 0; i < d.length; i++) {
            if(d[i].pinned) {
                res[i] = d[i];
                res[i].pos = pinned++;
            }
        }
        for(let i = 0; i < d.length; i++) {
            if(!d[i].pinned) {
                res[i] = d[i];
                res[i].pos = pinned++;
            }
            res[i].unReads = d[i].unreadMessages;
        }
        return { 
            data: [...res], 
            totalUnreadMessages: Data.totalUnreadMessages, 
        };
    }
    localChatsFetching(state, [ id, Data ]) {
        let { data } = state;
        for(var i=0;i<data.length;i++) {
            if(data[i].account._id === id) {
                data[i].messages = [...Data, ...data[i].messages];
                break;
            }
        }
        return { ...state, data };
    }
    pinChat(state, [ id ]) {
        let { data } = state;
        let index = data.length;
        for(let i = 0; i < data.length; i++) {
            if(data[i].account._id === id) {
                index = data[i].pos;
                break;
            }
        }
        for(let i = 0; i < data.length; i++) {
            if(data[i].account._id === id) data[i].pos = 0;
            else if(data[i].pos < index) data[i].pos++;
        }
        return { ...state, data };
    }
    clearChat(state, [ id ]) {
        let { data, totalUnreadMessages } = state;
        for(let i = 0; i < data.length; i++) {
            if(data[i].account._id === id) {
                if(data[i].unreadMessages > 0) {
                    totalUnreadMessages = Math.max(0, totalUnreadMessages - 1);
                }
                data[i].messages = [];
                data[i].unReads = 0;
                data[i].unreadMessages = 0;
                break;
            }
        }
        return { data, totalUnreadMessages };
    }
    propagateAccount(state, [id, val]) {
        let { data } = state;
        for(var i = 0; i < data.length; i++) {
            if(data[i].account._id === id) {
                const newAcct = { ...data[i].account, ...val };
                data[i].account = newAcct;
                break;
            }
        }
        return { ...state, data };
    }
    leavingPage(state, [ accountId ]) {
        let { data } = state;
        for(var i = 0; i < data.length; i++) {
            if(data[i].account._id === accountId) {
                data[i].unReads = 0;
                data[i].unreadMessages = 0;
                data[i].taggedYou = null;
                break;
            }
        }
        return { ...state, data };
    }
    openedChat(state, [ accountId ]) {
        let { data, totalUnreadMessages } = state;
        for(var i = 0; i < data.length; i++) {
            if(data[i].account._id === accountId) {
                if(data[i].unreadMessages > 0) {
                    totalUnreadMessages = Math.max(0, totalUnreadMessages - 1);
                }
                data[i].unreadMessages = 0;
                break;
            }
        }
        return { ...state, data, totalUnreadMessages };
    }
    blockUser(state, [ accountId ]) {
        let { data } = state;
        for(var i = 0; i < data.length; i++) {
            if(data[i].account._id === accountId) {
                data[i].isBlocked = !data[i].isBlocked;
                break;
            }
        }
        return { ...state, data };
    }
    receiveMessage(state, [ sender, message, inChat, userId ]) {
        let { data, totalUnreadMessages } = state;
        let index = data.length, target = null, isBlocked = false;
        let pinned = 0;
        for(let i = 0; i < data.length; i++) {
            if(data[i].pinned) pinned++;
        }
        for(let i = 0; i < data.length; i++) {
            if(data[i].account._id === sender._id) {
                if(data[i].isBlocked) { isBlocked = true; break; }
                index = data[i].pos;
                if(!this.isSameDay(data[i].messages[data[i].messages.length - 1])) {
                    data[i].messages.push({ time: 'Today' });
                }
                if(inChat) {
                    if(data[i].unreadMessages > 0) {
                        totalUnreadMessages = Math.max(0, totalUnreadMessages - 1);
                    }
                    data[i].unreadMessages = 0;
                    data[i].unReads += 1;
                    data[i].messages.push(message);
                } else {
                    if(data[i].unreadMessages < 1) totalUnreadMessages++;
                    data[i].unreadMessages += 1;
                    data[i].unReads += 1;
                    data[i].messages.push(message);
                }

                if(message?.tagged?.senderId === userId) data[i].taggedYou = message._id;
                target = data[i];
                break;
            } 
        }

        if(!isBlocked) {
            for(let i = 0; i < data.length; i++) {
                if(data[i].account._id === sender._id) {
                    if(data[i].pinned) data[i].pos = 0;
                    else data[i].pos = pinned;
                } else {
                    if(data[i].pinned) {
                        data[i].pos += (index > data[i].pos && index < pinned) ? 1 : 0;
                    } else {
                        data[i].pos += (index > data[i].pos && index >= pinned) ? 1 : 0;
                    }
                }
            }
            if(index === data.length) {
                data.push(
                    { account: sender, messages: [{time: 'Today'}, message], 
                    unreadMessages: 1, unReads: 1, pos: pinned }
                );
                totalUnreadMessages++;
            } 
        }

        return { data, totalUnreadMessages };
    }
    receivedMessage(state, [ receiverId, messageId, time ]) {
        let { data } = state;
        for(var i=0;i<data.length;i++) {
            if(data[i].account._id === receiverId) {
                const { messages } = data[i];
                for(var j = messages.length - 1; j >= 0; j--) {
                    if(messages[j].isDelivered || messages[j].isRead) break;
                    if(messages[j].senderId === receiverId) break;
                    data[i].messages[j].isDelivered = time;
                    if(messages[j]._id === messageId) break;
                }
                break;
            }
        }
        return { ...state, data };
    }
    removeTagged(state, [ accountId ]) {
        let { data } = state;
        for(var i = 0; i < data.length; i++) {
            if(data[i].account._id === accountId) {
                data[i].taggedYou = null;
                break;
            }
        }
        return { ...state, data };
    }
    typing(state, [ typer, res ]) {
        let { data, totalUnreadMessages } = state;
        for(var i = 0; i < data.length; i++) {
            if(data[i].account._id === typer) {
                data[i].isTyping = res;
                break;
            }
        }
        return { data, totalUnreadMessages };
    }
    readMessage(state, [ receiverId, messageId, time ]) {
        let { data, totalUnreadMessages } = state;
        for(var i=0;i<data.length;i++) {
            if(data[i].account._id === receiverId) {
                const { messages } = data[i];
                for(var j = messages.length - 1; j >= 0; j--) {
                    if(messages[j].isRead || messages[j].senderId === receiverId) break;
                    data[i].messages[j].isRead = time;
                    if(messages[j]._id === messageId) break;
                }
                if(data[i].unreadMessages > 0) {
                    totalUnreadMessages = Math.max(0, totalUnreadMessages - 1);
                }
                data[i].unreadMessages = 0;
                // data[i].unReads = 0;
                break;
            }
        }
        return { data, totalUnreadMessages };
    }
    iSend(state, [ receiver, message ]) {
        let { data } = state;
        let index = data.length;
        let pinned = 0;
        for(let i = 0; i < data.length; i++) {
            if(data[i].pinned) pinned++;
        }
        for(let i = 0; i < data.length; i++) {
            if(data[i].account._id === receiver._id) {
                if(!this.isSameDay(data[i].messages[data[i].messages.length - 1])) {
                    data[i].messages.push({ time: 'Today' });
                }
                data[i].messages.push(message);
                data[i].unreadMessages = 0;
                data[i].unReads = 0;
                index = data[i].pos;
                break;
            } 
        }

        for(let i = 0; i < data.length; i++) {
            if(data[i].account._id === receiver._id) {
                if(data[i].pinned) data[i].pos = 0;
                else data[i].pos = pinned;
            } else {
                if(data[i].pinned) {
                    data[i].pos += (index > data[i].pos && index < pinned) ? 1 : 0;
                } else {
                    data[i].pos += (index > data[i].pos && index >= pinned) ? 1 : 0;
                }
            }
        }

        if(index === data.length) {
            data.push(
                { account: receiver, messages: [{time: 'Today'}, message], 
                unreadMessages: 0, unReads: 0, pos: pinned }
            );
        }
        return { ...state, data };
    }
    receiveReaction(state, [ userId, messageId, accountId, reaction]) {
        let { data } = state;
        for(var i = 0; i < data.length; i++) {
            if(data[i].account._id === accountId) {
                let { messages } = data[i];
                for(var j = messages.length - 1; j >= 0; j--) {
                    if(messages[j]._id === messageId) {
                        let { reactions } = messages[j], index = null;
                        for(var r = 0; r < reactions.length; r++) {
                            if(reactions[r].userId === userId) {
                                data[i].messages[j].reactions[r] = reaction;
                                index = r;
                                break;
                            }
                        }
                        if(index === null) {
                            data[i].messages[j].reactions.push(reaction);
                        }
                        break;
                    }
                }
                break;
            }
        }
        return { ...state, data };
    }
    removeReaction(state, [ userId, messageId, accountId]) {
        let { data } = state;
        for(var i = 0; i < data.length; i++) {
            if(data[i].account._id === accountId) {
                let { messages } = data[i];
                for(var j = messages.length - 1; j >= 0; j--) {
                    if(messages[j]._id === messageId) {
                        let { reactions } = messages[j];
                        data[i].messages[j].reactions = reactions.filter(r => r.userId !== userId);
                        break; 
                    }
                }
                break;
            }
        }
        return { ...state, data };
    }
    editMessage(state, [ message ]) {
        let data = [...state.data];
        for(let i = 0; i < data.length; i++) {
            if(message.senderId === data[i].account._id ||
                message.receiverId === data[i].account._id) {
                let { messages } = data[i];
                for(var j = messages.length - 1; j >= 0; j--) {
                    if(messages[j]._id === message._id) {
                        messages[j] = message;
                        break;
                    }
                }
                data[i].messages = messages;
                break;
            }
        }
        return { ...state, data };
    }
    deleteMessage(state, [ messageIds, accountId ]) {
        let { data } = state;
        for(var i = 0; i < data.length; i++) {
            if(data[i].account._id === accountId) {
                const messages = data[i].messages.filter(msg => !messageIds.includes(msg._id));
                data[i].messages = messages;
                break;
            }
        }
        return { ...state, data };
    }
    deletedMessage(state, [ accountId, messageId ]) {
        let { data } = state;
        for(var i = 0; i < data.length; i++) {
            if(data[i].account._id === accountId) {
                let { messages } = data[i];
                for(var j = messages.length - 1; j >= 0; j--) {
                    if(messages[j]._id === messageId) {
                        messages[j].isDeleted = true;
                        break;
                    }
                }
                data[i].messages = messages;
                break;
            }
        }
        return { ...state, data };
    }
    
    hasStatus(state, [accountId, res]) {
        let { data } = state;
        for(var i = 0; i < data.length; i++) {
            if(data[i].account._id === accountId) {
                data[i].hasStatus = res;
                break;
            }
        }
        return { ...state, data };
    }

    updateStatus(state, [ mp ]) {
        const { data } = state;
        for(let i = 0; i < data.length; i++) {
            if(mp.includes(data[i].account._id)) {
                data[i].hasStatus = false;
            }
        }
        return { ...state, data };
    }
};