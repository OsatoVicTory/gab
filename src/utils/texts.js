import { 
    emojiStringHTML, isEmoji, splitStringForEmoji, classObj 
} from "../component/emoji-store/util";

export const checkIfIsLink = (word) => {
    const regex = /^[a-z]+$/;
    const signsReg = /^[=\?\/]+$/;
    const split = word.split('://');
    if(split[0] !== 'https' || !split[1]) return false;
    const [first, sec] = split[1]?.split('.');
    if(!sec || sec.length < 2) return false;
    let j = 0;
    while(j < sec.length && regex.test(sec[j])) j++;
    if(j < 2 || (j < sec.length && !signsReg.test(sec[j])) ) return false;
    return true;
};

export const findMatchInText = (txt, running_txt, clx, search) => {
    if(!search) return `<span class='${clx}'>${running_txt + txt}</span>`;
    const found_search = search.find(srch => txt.toLowerCase().startsWith(srch));
    if(found_search) {
        return ( running_txt ? (
            `<span class='${clx}'>${running_txt}</span>` +
            `<span class='${clx} matched'>${txt}</span>`
        ) : `<span class='${clx} matched'>${txt}</span>` )
    }
    return `<span class='${clx}'>${running_txt + txt}</span>`;
};

const loopText = (word, str, clx, search, font) => {
    const text = splitStringForEmoji(word);
    let strr = '', res = '';
    for(let char of text) {
        if(!isEmoji(char)) strr += char;
        else {
            res += ( findMatchInText(strr, str, clx, search)  +  emojiStringHTML(char, clx, font) );
            strr = '';
            str = '';
        }
    }
    return { ele: res, strr, stri: str };
};

export const formatTextForEmojisAndMatchSearch = (string, clx, font, search) => {
    const words = string.split(' ');
    let str = '', res = '';
    for(let i = 0; i < words.length; i++) {
        if(i) str += ' ';
        const st = ['*','~','_'].find(c => words[i].startsWith(c) &&
        words[i].endsWith(c) && words[i].length > 2);
        // console.log('word',words[i],'st',st);
        if(st) {
            if(str) res += `<span class='${clx}'>${str}</span>`;
            str = '';
            let styledText = `<span class='${clx} ${classObj[st]}'>`;
            const { ele, strr } = loopText(words[i].slice(1, words[i].length-1), '', clx, search, font);
            styledText += ele;
            if(strr) styledText += findMatchInText(strr, str, clx, search);
            styledText += `</span>`;
            res += styledText;
        } else {
            const isLink = checkIfIsLink(words[i]);
            if(isLink) {
                if(str) res += `<span class='${clx}'>${str}</span>`;
                str = '';
                res += `<a class='aLink ${clx}' target='_blank' href=${words[i]}>`;
            }
            const { ele, strr, stri } = loopText(words[i], str, clx, search, font);
            res += ele;
            str = stri;
            if(strr) {
                if(search.find(srch => strr.toLowerCase().startsWith(srch))) {
                    res += ( str ? (
                        `<span class='${clx}'>${str}</span>` +
                        `<span class='${clx} matched'>${strr}</span>`
                    ) : `<span class='${clx} matched'>${strr}</span>` );
                    str = '';
                } else str += strr;
            }
            if(isLink) {
                if(str) res += `<span class='${clx}'>${str}</span>`;
                res += `</a>`;
                str = '';
            }
        }
    }
    if(str) res += findMatchInText(str, '', clx, search);
    return res;
};

export const formatTextForEmojis = (string, clx, font) => {
    const text = splitStringForEmoji(string);
    let str = '', res = '';
    for(let char of text) {
        if(!isEmoji(char)) str += char;
        else {
            res += `<span class='${clx}'>${str}</span>`;
            res += emojiStringHTML(char, clx, font);
            str = '';
        }
    }
    if(str) res += `<span class='${clx}'>${str}</span>`;
    return res;
};