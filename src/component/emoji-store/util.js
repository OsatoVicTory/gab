import images from './emoji_images';
import emojiData from './emoji_data.json';

export const getEmojiStyles = (emoji, desired_px = 18) => {
    const index = emojiData[emoji]?.index;
    // console.log(index, emoji);
    if( !(index >= 0) ) return false;
    const indexOffset = (index - 0) + 1;
    const page = Math.ceil(indexOffset / 338);
    const num = (indexOffset % 338 == 0 && indexOffset) ? 337 : (indexOffset % 338) - 1;
    const left = num && !(num % 26) ? 26 : num % 26;
    const width = Math.ceil(desired_px * 1.373125);
    const height = Math.ceil(desired_px * 1.333333);
    const pos = `-${left * width}px -${Math.floor(num / 26) * height}px`;
    const backgroundSize = `${26 * width}px ${(page < 11 ? 13 : 10) * height}px`;
    return { 
        fontSize: `${desired_px}px`, backgroundSize,
        width: `${width}px`, height: `${height}px`, 
        backgroundImage: `url(${images[page]})`, backgroundPosition: pos,  
    };
};

export const getEmojiStylesForOne = (emoji, size) => {
    const index = emojiData[emoji]?.index;
    if( !(index >= 0) ) return false;
    const indexOffset = (index - 0) + 1;
    const page = Math.ceil(indexOffset / 338);
    const num = (indexOffset % 338 == 0 && indexOffset) ? 337 : (indexOffset % 338) - 1;
    const left = num && !(num % 26) ? 26 : num % 26;
    const width = size;
    const height = size;
    const pos = `-${left * width}px -${Math.floor(num / 26) * height}px`;
    const backgroundSize = `${26 * width}px ${(page < 11 ? 13 : 10) * height}px`;
    return { 
        fontSize: `${Math.floor(0.6875 * size)}px`, backgroundSize,
        width: `${width}px`, height: `${height}px`, 
        backgroundImage: `url(${images[page]})`, backgroundPosition: pos,  
    };
};

export const emojiStringHTML = (emoji, className, desired_px) => {
    const stylesObj = getEmojiStyles(emoji, desired_px);
    const stylesKeys = {
        fontSize:'font-size', width: 'width', 
        height: 'height', backgroundSize: 'background-size', 
        backgroundImage: 'background-image', backgroundPosition: 'background-position'    
    };
    let strHtml = `<span class='${className} emoji-span' style='`;
    Object.keys(stylesKeys).forEach(key => {
        strHtml += `${stylesKeys[key]}: ${stylesObj[key]}; `;
    });
    strHtml += `'>${emoji}</span>`;
    return strHtml;
};

export const classObj = { '*': 'bold-span', '_': 'italics-span', '~': 'line-through-span' };

export const isEmoji = (em) => {
    return emojiData[em]?.index >= 0;
};

export const splitStringForEmoji = (string) => {
    // const res = str.split(/([\p{Emoji_Modifier_Base}\p{Emoji_Modifier}]?[\p{Emoji_Presentation}]|[\p{Emoji}])/gu);
    // return res.filter(e => e);
    const reg = /\p{Emoji}/u;
    const flagReg = /[\uD83C][\uDDE6-\uDDFF]/g;
    const skinTones = ['\u{1f3fb}','\u{1f3fc}','\u{1f3fd}','\u{1f3fe}','\u{1f3ff}','\u{fe0f}'];
    function flg(x) {
        return [
            '\u{e0067}','\u{e0062}','\u{e0065}','\u{e0073}','\u{e0074}',
            '\u{e0063}','\u{e0077}','\u{e006c}','\u{e006e}','\u{e007f}'
        ].find(c => c === x);
    };
    const Zwj = '\u{200d}';
    function isAnEmoji(s) {
        return reg.test(s) || Zwj === s ||
        skinTones.find(code => code === s) || flagReg.test(s);
    }
    const arr = [], res = [];
    for(let char of string) arr.push(char);
    const N = arr.length;
    let str = '';
    for(let i = 0; i < N; i++) {
        if(!isAnEmoji(arr[i])) { str += arr[i]; continue; }
        if(str) res.push(str);
        let j = i, zwj = true, st = '';
        while(j < N) {
            if(arr[j] === Zwj) { zwj = true; }
            else if(flg(arr[j])) { zwj = false; }
            else if(skinTones.find(cd => cd === arr[j])) { zwj = false; }
            else { 
                if(!zwj) break; 
                zwj = flagReg.test(arr[j]); 
            }
            st += arr[j++];
        }
        res.push(st);
        i = j - 1;
        str = '';
    }
    if(str) res.push(str);
    // console.log('string',string,'arr',arr,'res',res);
    return res;
};