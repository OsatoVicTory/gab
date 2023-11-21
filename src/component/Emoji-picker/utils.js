import emoji_lists from '../emoji-store/emoji_list.json';

export const spliceArray = (rowLength) => {
    const res = [];
    for(let list of emoji_lists) {
        const obj = { title: list.title };
        const { lists } = list;
        const objArray = [];
        let i = 0;
        while(i < lists.length) {
            objArray.push(lists.slice(i, i + rowLength));
            i += rowLength;
        }
        obj.lists = objArray;
        res.push(obj);
    }
    return res;
};

export const mountFnc = (offsetWidth, setEmojiLists, setEmojiListsShowing, setState) => {
    const rowLength = Math.floor((offsetWidth - 18) / 40);
    const res = spliceArray(rowLength || 7);
    setEmojiLists(res);
    setEmojiListsShowing(res);
    setState('view_full_lists');
};

export const scrollFn = (
    e, elements, current, 
    isOpen, setCurrent, setEmojiSkinTones
) => {
    const { bottom } = e.target.getBoundingClientRect();
    if(elements) {
        let mx = 0, i = 0;
        for(const ele of elements) {
            if(ele.getBoundingClientRect().top <= bottom) mx = i;
            i++;
        }
        if(mx !== current) setCurrent(mx);
    }
    if(isOpen) setEmojiSkinTones(null);
}

export const searchFnc = (search, offsetWidth, setEmojiListsShowing) => {
    if(!offsetWidth) return;
    const rowLength = Math.floor((offsetWidth - 18) / 40);
    const res = [], rep = [];
    let i = 0;
    for(let list of emoji_lists) {
        const { lists } = list;
        while(i < lists.length) {
            if(lists[i].name.find(n => n.includes(search))) rep.push(lists[i]);
            i++; 
        }
        i = 0;
    }
    i = 0;
    while(i < rep.length) {
        res.push(rep.slice(i, i + rowLength));
        i += rowLength;
    }
    setEmojiListsShowing([{ title: 'Search', lists: res }]);
}