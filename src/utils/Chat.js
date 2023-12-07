import { v4 as uuidv4 } from 'uuid';
// import { emojiHTMLString, isEmoji } from "../component/emoji-store/util";

export const formatTextAndMatchSearch = (text, clx, search) => {
    let str = '', res = '';
};

export const randomId = () => {
    return uuidv4();
};

export const contactName = (id, contacts) => {
    return (contacts||[]).find(({ userId }) => userId === id)?.userName;
}

export const scrollToMessage = (messageId, setFocusTaggedMessage, bottom = false) => {
    setFocusTaggedMessage(messageId);
    const ele = document.getElementById(`Gab-${messageId}`);
    if(ele) {
        if(!bottom) ele.scrollIntoView({ behavior: "smooth" });
        else ele.scrollIntoView(false, { behavior: "smooth" });
        setTimeout(() => {
            setFocusTaggedMessage(null);
        }, 1500);
    }
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
    const search_arr = search.split(' ').filter(c => c).map(c => c.toLowerCase());
    for(let v = start; v <= end; v++) {
        const { message } = messages[v];
        if(!message) continue;
        const message_lw = message.toLowerCase();
        if(search_arr.find(q => message_lw.includes(q))) {
            scrollToMessage(messages[v]._id, (v) => null);
            cb(false);
            return;
        }
    }
    cb(false);
    setStatusMessage({type:'error',text:'No Message relating to search'});
}

// scroll 
export const scrollUtil = (
    e, curRef, nxtRef, eles, setFixedTime,
    setShowScrollDown, messages, unreadsRef,
    unreadsState, setUnreadState, unReads
    // taggedRef, taggedState, setTaggedState
) => {
    const elements = eles.current;
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
    
    // if(taggedRef && taggedState && taggedRef?.getBoundingClientRect().top <= clientHeight) {
    //     setTaggedState(false);
    // }

    if( unreadsRef.current && unReads.current > unreadsState.current && 
        ((unreadsRef.current?.getBoundingClientRect().top||0) - 60 <= clientHeight) ) {
        setUnreadState(unReads.current);
        unreadsState.current = unReads.current;
    } 
    
    if(Math.abs(scrollHeight - clientHeight - scrollTop) < 1) {
        setShowScrollDown(false);
        if(unReads.current > unreadsState.current) {
            setUnreadState(unReads.current);
            unreadsState.current = unReads.current;
        }
    } else {
        setShowScrollDown(true);
    }
};