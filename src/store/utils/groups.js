export default class GroupsUtils {
    Init({ data }, [ Data ]) {
        return { 
            data: [...Data.data, ...data], 
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
    createNewGroup(state, [ group ]) {
        return {
            ...state,
            data: [group, ...state.data],
        }
    }
    
    propagateAccount(state, [id, val]) {
        let { data } = state;
        for(var i = 0; i < data.length; i++) {
            let { participants } = data[i].account;
            for(var j = 0; j < participants.length; j++) {
                if(participants[j].userId === id) {
                    const newAcct = { ...participants[j], ...val };
                    participants[j] = newAcct;
                    break;
                }
            }
            data[i].account.participants = participants;
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
    receiveMessage(state, [ groupId, message, inChat, userId ]) {
        let index = null, target = null;
        let { data, totalUnreadMessages } = state;
        for(var i = 0; i < data.length; i++) {
            if(data[i].account._id === groupId) {
                index = i;
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
                else if(message?.message?.length <= 1000 && message?.message?.includes(userId)) {
                    data[i].taggedYou = message._id;
                }
                target = data[i];
                break;
            } 
        }
        if(target) {
            data = data.filter(acct => acct.account._id !== groupId);
            data.unshift(target);
        }
        return { data, totalUnreadMessages };
    }
    receivedMessage(state, [ groupId, messageId, receiverId, time ]) {
        let { data } = state;
        for(var i=0;i<data.length;i++) {
            if(data[i].account._id === groupId) {
                const { messages } = data[i];
                for(var j = messages.length - 1; j >= 0; j--) {
                    if(!Array.isArray(messages[j].receivers)) continue;
                    if(messages[j].receivers.find(val => val.userId === receiverId)) break;
                    data[i].messages[j].receivers.push({
                        userId: receiverId,
                        delivered: time
                    });
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
    typing(state, [ groupId, res ]) {
        let { data } = state;
        for(var i = 0; i < data.length; i++) {
            if(data[i].account._id === groupId) {
                data[i].isTyping = res;
                break;
            }
        }
        return { ...state, data };
    }
    iSend(state, [ receiver, message ]) {
        let index = null, { data } = state, target;
        for(var i=0;i<data.length;i++) {
            if(data[i].account._id === receiver._id) {
                data[i].messages.push(message);
                data[i].unreadMessages = 0;
                data[i].unReads = 0;
                index = i;
                target = data[i];
                break;
            }
        }
        if(index === null) {
            data.unshift(
                { account: receiver, messages: [message], 
                unreadMessages: 0, unReads: 0 }
            );
        } else {
            data = data.filter(({ account }) => account._id !== receiver._id);
            data.unshift(target);
        }
        return { ...state, data };
    }
    readMessage(state, [ groupId, messageId, receiverId, time ]) {
        let { data } = state;
        for(var i = 0; i < data.length; i++) {
            if(data[i].account._id === groupId) {
                data[i].taggedYou = false;
                const { messages } = data[i];
                for(var j = messages.length - 1; j >= 0; j--) {
                    if(!Array.isArray(messages[j].receivers)) continue;
                    let { receivers } = messages[j], found = false, doBreak = false;
                    for(var r = 0; r < receivers.length; r++) {
                        if(receivers[r].userId === receiverId) {
                            if(receivers[r].read) {
                                doBreak = true;
                                break
                            }
                            receivers[r].read = time;
                            found = true;
                            break;
                        }
                    }
                    if(doBreak) break;
                    if(!found) receivers.push({
                        userId: receiverId,
                        delivered: time,
                        read: time
                    })
                    data[i].messages[j].receivers = receivers;
                    if(messages[j]._id === messageId) break;
                }
                break;
            }
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
        for(var i = 0; i < data.length; i++) {
            if(message[0].groupId === data[i].account._id) {
                let { messages } = data[i], found = false, target = null;
                for(var j = messages.length - 1; j >= 0; j--) {
                    if(messages[j]._id === message[0]._id) {
                        messages[j] = message[0];
                        found = true;
                        break;
                    }
                    if(messages[j]?.messageId === message[0]._id) target = j;
                }
                if(found) {
                    let newMessages = messages.filter((val, idx) => idx !== target);
                    newMessages.push(message[1]);
                    data[i].messages = newMessages;
                }
                break;
            }
        }
        return { ...state, data };
    }
    deleteMessage(state, [ messageIds, accountId ]) {
        let { data } = state;
        for(var i = 0; i < data.length; i++) {
            if(data[i].account._id === accountId) {
                const messages = data[i].messages.filter(msg => (
                    (!msg.messageId && !messageIds.includes(msg._id)) || 
                    (msg.messageId && !messageIds.includes(msg.messageId))
                ));
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

    createGroup(state, [ group, message ]) {
        let { data } = state;
        data.unshift({
            account: group, messages: [ message ],
            unreadMessages: 0, unReads: 0
        });
        return { ...state, data };
    }
    joinedGroup(state, [ groupId, user, message ]) {
        let { data } = state;
        for(var i = 0; i < data.length; i++) {
            if(data[i].account._id === groupId) {
                if(data[i].account.participants.find(p => p.userId === user._id)) break;
                data[i].account.participants.push({ ...user, userId: user._id });
                data[i].messages.push(message);
                break;
            }
        }
        return { ...state, data };
    }
    joinGroup(state, [ groupData ]) {
        let { data } = state;
        data.unshift(groupData);
        return { ...state, data };
    }
    
    iEditedGroup(state, [ groupId, group, messages ]) {
        let { data } = state;
        for(var i = 0; i < data.length; i++) {
            if(data[i].account._id === groupId) {
                data[i].account = group;
                for(let msg of messages) data[i].messages.push(msg);
                break;
            }
        }
        return { ...state, data };
    }
    // we can unshift here cus we know 
    // this action is received by only targetted/intended users
    editedGroup(state, [ groupId, group ]) {
        let { data, totalUnreadMessages } = state, found = false;
        for(var i = 0; i < data.length; i++) {
            if(data[i].account._id === groupId) {
                if(data[i].unreadMessages < 0 && group.unreadMessages > 0) {
                    totalUnreadMessages += 1;
                } 
                data[i] = group;
                found = true;
                break;
            }
        }
        if(!found) {
            data.unshift(group);
            totalUnreadMessages += 1;
        }
        return { ...state, data, totalUnreadMessages };
    }
    makeAdmin(state, [ groupId, userId, message ]) {
        let { data } = state;
        for(var i = 0; i < data.length; i++) {
            if(data[i].account._id === groupId) {
                let { participants } = data[i].account;
                for(let p = 0; p < participants.length; p++) {
                    if(participants[p].userId === userId) {
                        participants[p].admin = !participants[p].admin;
                        break;
                    }
                }
                data[i].account.participants = participants;
                data[i].messages.push(message);
                break;
            }
        }
        return { ...state, data };
    }
    removeParticipant(state, [ groupId, userId, message ]) {
        let { data } = state;
        for(var i = 0; i < data.length; i++) {
            if(data[i].account._id === groupId) {
                const { participants } = data[i].account;
                let newParticipants = [], target = null;
                for(let par of participants) {
                    if(par.userId !== userId) newParticipants.push(par);
                    else target = par;
                }
                data[i].account.participants = newParticipants;
                if(target) data[i].account.aux_arr.push(target);
                data[i].messages.push(message);
                break;
            }
        }
        return { ...state, data };
    }
    iExitedGroup(state, [ groupId ]) {
        const state_data = state.data;
        let data = [];
        let { totalUnreadMessages } = state;
        for(let i = 0; i < state_data.length; i++) {
            if(state_data[i].account._id === groupId) {
                if(state_data[i].unreadMessages > 0) {
                    totalUnreadMessages = Math.max(0, totalUnreadMessages - 1);
                }
            } else data.push(state_data[i]);
        }
        return { data, totalUnreadMessages };
    }
    exitGroup(state, [ groupId, userId, message ]) {
        let { data } = state;
        for(var i = 0; i < data.length; i++) {
            if(data[i].account._id === groupId) {
                const { participants } = data[i].account;
                let newParticipants = [], target = null;
                for(let par of participants) {
                    if(par.userId !== userId) newParticipants.push(par);
                    else target = par;
                }
                data[i].account.participants = newParticipants;
                if(target) data[i].account.aux_arr.push(target);
                data[i].messages.push(message);
                break;
            }
        }
        return { ...state, data };
    }
};