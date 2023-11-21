import { FRONTEND_URL } from '../config';

export const alphaNumeric = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';

export const goToMessage = (messageId, setFocusTaggedMessage, bottom = false) => {
    setFocusTaggedMessage(messageId)
    const ele = document.getElementById(`Gab-${messageId}`);
    if(ele) {
        if(!bottom) ele.scrollIntoView({ behavior: "smooth" });
        else ele.scrollIntoView(false, { behavior: "smooth" });
        setTimeout(() => {
            setFocusTaggedMessage(null);
        }, 1500);
    }
};

export const contactName = (userId, userName, contacts) => {
    return (contacts||[]).find(user => user.userId === userId)?.userName||`~ ${userName||userId}`;
};

// get participants map
export const getParticipantsMap = (arr, arr2) => {
    let mp = new Map();
    for(var par of arr) mp.set(par.userId, par);
    for(var par2 of arr2) mp.set(par2.userId, par2);
    return mp;
};

// split emoji for reactions header lists
export const reactionsEmojiSplit = (data) => {
    let mp = new Map(), tmp, res = [];
    for(let i = 0; i < data.length; i++) {
        tmp = mp.get(data[i].emoji);
        if(tmp) mp.set(data[i].emoji, tmp + 1);
        else mp.set(data[i].emoji, 1);
    }
    for(let [emoji, emojiLength] of mp) {
        res.push({ emoji, emojiLength });
    }
    return res;
}

// filterText
export const filterText = (str, getInfos, contacts) => {
    let res = '';
    for(let i = 0; i < str.length; i++) {
        if(alphaNumeric.includes(str[i])) {
            let j = i, word = '';
            while(j < str.length && alphaNumeric.includes(str[j])) word += str[j++];
            const user = getInfos('aux', word);
            if(user) res += contactName(user._id, user.userName, contacts);
            else res += word;
            i = j - 1;
        } else res += str[i];
    }
    return res;
}

//edit output of Text
export const textOutput = (msg, search, finder, isGroup, contacts) => {
    const words = msg.split(' ');
    let res = '';
    const fillWord = (txt) => {
        if(!(search?.length > 0)) return txt;
        let tmp = '', ret = '';
        for(var i = 0; i < txt.length; i++) {
            if(txt.slice(i, i + search.length).toLowerCase() !== search.toLowerCase()) {
                tmp += txt[i];
            } else {
                ret += `<span class='in-message-span'>${tmp}</span>`;
                ret += `<span class='in-message-span searched'>${txt.slice(i, i + search.length)}</span>`;
                i += search.length - 1;
                tmp = '';
            }
        }
        ret += `<span class='in-message-span'>${tmp}</span>`;
        return ret;
    }
    const getUserName = (id) => {
        return contactName(id, finder('aux', id)?.userName, contacts);
    }

    for(var word of words) {
        if(word[0] === '@') {
            if(!isGroup) {
                res += `<span class='in-message-span'>${word+' '}</span>`;
                continue;
            }
            let j = 1, userId = '', tmp = '';
            while(j < word.length && alphaNumeric.includes(word[j])) userId += word[j++];
            while(j < word.length) tmp += word[j++];
            if(!finder('aux', userId)) res += `<span class='in-message-span'>${word+' '}</span>`;
            else {
                res += `<span id='${`/app/chats/profile/${userId}`}' class='gab-in-app-link'>${'@'+getUserName(userId)}</span>`;
                if(tmp) res += `<span class='in-message-span'>${tmp+' '}</span>`;
                else res += ' ';
            }
            continue;
        }

        const text = res.length === 0 ? (' '+fillWord(word)) : fillWord(word);
        if(word.startsWith('http://') || word.startsWith('https://')) {
            const end = word.split('//')[1].split('/')[0].split('.');
            if(end[end.length - 1].length > 1) {
                if(word.startsWith(FRONTEND_URL)) {
                    res += `<span id='${word.slice(FRONTEND_URL.length, word.length + 10)}' class='gab-in-app-link'>${text+' '}</span>`;
                } else {
                    res += `<a href='${word}' target='_blank' class='a-tag'>${text+' '}</a>`;
                }
            } else {
                res += `<span class='in-message-span'>${text+' '}</span>`; 
            }
        } else {
            res += `<span class='in-message-span'>${text+' '}</span>`;
        }
    }
    return res;
};

// search message
export const searchWordUtil = (
    curRef, nxtRef, elements, messages, 
    search, setStatusMessage, type, cb
) => {
    let start, end;
    if(type === 'up') {
        start = elements[Math.max(curRef - 1, 0)]?.id?.split('#')[1] - 0;
        end = elements[curRef]?.id?.split('#')[1] - 0;
    } else {
        start = elements[nxtRef]?.id?.split('#')[1] - 0;
        end = elements[Math.min(elements.length - 1, nxtRef + 1)]?.id?.split('#')[1] - 0;
    }
    
    if(start === end) {
        if(nxtRef + 1 >= elements.length - 1) end = messages.length - 1;
        else end = elements[Math.min(elements.length - 1, nxtRef + 1)]?.id?.split('#')[1] - 0;
    }
    if(!start) start = 0;
    if(!end) end = 0;
    
    for(let v = start; v <= end; v++) {
        const { message } = messages[v];
        if(!message) continue;
        if(message.toLowerCase().includes(search.toLowerCase())) {
            goToMessage(messages[v]._id, (v) => null);
            cb(false);
            return;
        }
    }
    cb(false);
    setStatusMessage({type:'error',text:'No Message relating to search'});
}

// scroll 
export const scrollUtil = (
    e, curRef, nxtRef, elements, setFixedTime,
    setShowScrollDown, messages, unreadsRef,
    unreadsState, setUnreadState, unReads,
    taggedRef, taggedState, setTaggedState
) => {
    const { scrollHeight, clientHeight, scrollTop } = e.target;
    const nxt = elements[nxtRef.current]?.getBoundingClientRect().top;
    const cur = elements[curRef.current]?.getBoundingClientRect().top;
    if(nxt <= 68) {
        curRef.current = nxtRef.current;
        const index = elements[curRef.current].id.split('#')[1] - 0;
        setFixedTime(messages[index]?.time);
        nxtRef.current = Math.min(elements.length - 1, nxtRef.current + 1);
    } else if(cur > 68) {
        const tmp = curRef.current;
        curRef.current = Math.max(0, tmp - 1);
        const index = elements[curRef.current].id.split('#')[1] - 0;
        setFixedTime(messages[index]?.time);
        nxtRef.current = tmp;
    } else if(cur <= 68) {
        const index = elements[curRef.current].id.split('#')[1] - 0;
        setFixedTime(messages[index]?.time);
    }
    
    if(taggedRef && taggedState && taggedRef?.getBoundingClientRect().top <= clientHeight) {
        setTaggedState(false);
    }
    if(unreadsRef && unreadsRef?.getBoundingClientRect().top <= clientHeight && unreadsState) {
        setUnreadState(unReads);
    } 
    
    if(Math.abs(scrollHeight - clientHeight - scrollTop) < 1) {
        setShowScrollDown(false);
    } else {
        setShowScrollDown(true);
    }
}