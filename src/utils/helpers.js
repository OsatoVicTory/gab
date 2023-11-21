const findMonth = (index) => {
    const mnths = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return mnths[index];
};


export const setMessageInfoData = (data, participants, setData) => {
    let readBy = [], deliveredTo = [];
    let mp = new Map();
    for(var par of participants) mp.set(par._id, par);
    for(var d of data) {
        if(d.read) readBy.push({ ...mp.get(d.userId), ...d });
        else deliveredTo.push({ ...mp.get(d.userId), ...d });
    }
    return setData({ readBy, deliveredTo });
}

export const getParticipantsData = (data, participants, setData) => {
    let res = [];
    let mp = new Map();
    for(var par of participants) mp.set(par._id, par);
    for(var d of data) res.push({ ...mp.get(d.userId), ...d });
    return setData(res);
}

export const getCommonGroups = (groups, userId, id, setGroupsData) => {
    let res = [];
    for(let g = 0; g < groups.length; g++) {
        const { participants } = groups[g].account;
        let cnt = 0;
        for(var p = 0; p < participants.length; p++) {
            if(participants[p].userId === userId || participants[p].userId === id) cnt++;
            if(cnt > 1) break;
        }
        if(cnt > 1) res.push(groups[g].account);
    }
    setGroupsData(res);
};

export const getImages = (image, chats, setImages, setIndex) => {
    let res = [], index = 0, participantsMap = new Map();
    for(var i = 0; i < chats.length; i++) {
        const { account } = chats[i];
        if(account._id === image.senderId || account._id === image.receiverId) {
            const { messages } = chats[i];
            for(var j = 0; j < messages.length; j++) {
                if(messages[j]?.images?.length > 0) {
                    const { images } = messages[j];
                    for(var idx = 0; idx < images.length; idx++) {
                        res.push({ 
                            ...messages[j], img: images[idx], 
                            images: null 
                        });
                        if(messages[j]._id === image._id) {
                            if(images[idx].img === image.img) index = res.length - 1;
                        }
                    }
                }
            }
            participantsMap.set(account._id, account);
            break;
        }
    }
    
    setIndex(index);
    setImages(res);
    return [res, index, participantsMap];
};

export const getImagesWithTime = (data, setImages, setLoaded) => {
    let res = [], curMnth = null;
    for(var i = 0; i < data.length; i++) {
        const date = new Date(data[i].createdAt);
        if(date.getMonth() !== curMnth) {
            res.push({ month: `${findMonth(date.getMonth())} ${date.getFullYear()}` });
            curMnth = date.getMonth();
        }
        res.push({ ...data[i], idx: i });
    }
    setImages(res);
    setLoaded(true);
}