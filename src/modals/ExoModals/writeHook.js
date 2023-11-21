import { useEffect, useRef, useState } from 'react';
import images from '../../component/emoji-store/emoji_images';
import emojiData from '../../component/emoji-store/emoji_data.json';
import { isEmoji, splitStringForEmoji, classObj } from '../../component/emoji-store/util';

const useTextEditor = (
    divRef, pRef, placeholderRef, checkLinkAndScrape, 
    send, edit, lim, setStatusMessage
) => {
    const Range = useRef(document.createRange());
    const Sel = useRef(window.getSelection());
    const Pos = useRef(0);
    const textContent = useRef('');
    const [empty, setEmpty] = useState(true);
    const selectedRange = useRef(null);
    // const mp = useRef(new Map());
    
    const runInput = (e) => {
        if(e.inputType == 'insertParagraph') {
            insertAndSetRange('', e['$emoji']);
            replaceChildrenNode([pRef.current], divRef.current);
            setCaretPos(divRef.current, 1);
            send();
            return;
        } 

        const eKey = e.data;   
        
        if(textContent.length + ( (eKey||'').length ) >= lim) {
            selectedRange.current = null;
            insertAndSetRange('', e['$emoji']);
            divRef.current.blur();
            return setStatusMessage({ 
                type: 'error', text: `Cannot be more than ${lim} characters`
            });
        };

        if(e.inputType == 'deleteContentBackward') {
            textContent.current = putText(eKey, textContent.current, Pos.current); 
        } else textContent.current = putText(eKey, textContent.current, Pos.current);

        if(textContent.current?.length == 0) {
            if(!empty) setEmpty(true);
            const brArray = [document.createElement('br')];
            replaceChildrenNode(brArray);
            placeholderRef.current.style.display = 'block';
            Pos.current = 0;
        } else {
            if(empty) setEmpty(false);
            placeholderRef.current.style.display = 'none';
            insertAndSetRange(eKey, e['$emoji']);
        }
        selectedRange.current = null;
    };

    const isArrowKeys = (e) => ['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].find(val => val == e.key);
    function insertEmoji(emoji) {
        runInput({ data: emoji, $emoji: emoji });
        divRef.current.focus();
    };
    function pasteData(e) {
        e.preventDefault();
        const clipboardData = e.clipboardData || window.clipboardData;
        const text = clipboardData.getData('text');
        if(text) {
            const formattedText = text.replaceAll('\n', '.');
            runInput({ data: formattedText });
        }
    }
    function mouseUp() {
        selectedRange.current = window.getSelection().toString();
    };
    function mouseDown() {
        if(textContent.current?.length == 0) {
            setCaretPos(pRef.current, 0);
            return Pos.current = 0;
        }
        setTimeout(getAndSetCaretPos, 0);
    };
    function placeholderClick() {
        divRef.current?.focus();
    };
    function runKeydown(e) {
        // const rangeDiv = window.getSelection().getRangeAt(0)?.commonAncestorContainer;
        // if(!rangeDiv?.parentNode?.isContentEditable) return;
        e = e || window.event;
        if(isArrowKeys(e)) { 
            setTimeout(getAndSetCaretPos, 0); 
        } 
        // else {
        //     const key = e.keyCode || e.charCode;
        //     if(key == 8 || key == 46) {
        //         selectedRange.current = window.getSelection().toString();
        //     }
        // }
    };

    useEffect(() => {
        // if(pRef.current) setCaretPos(pRef.current, 0);
        if(divRef.current) {
            divRef.current.focus();
            divRef.current.addEventListener('mouseup', mouseUp);
            divRef.current.addEventListener('mousedown', mouseDown);
            divRef.current.addEventListener('input', runInput);
            divRef.current.addEventListener('paste', pasteData);
            divRef.current.addEventListener('keydown', runKeydown);
        }
        if(placeholderRef.current) {
            placeholderRef.current.addEventListener('click', placeholderClick);
            if(edit) runInput({ data: edit });
        }

        return () => {
            placeholderRef.current?.removeEventListener('click', placeholderClick);
            divRef.current?.removeEventListener('mouseup', mouseUp);
            divRef.current?.removeEventListener('mousedown', mouseDown);
            divRef.current?.removeEventListener('input', runInput);
            divRef.current?.removeEventListener('paste', pasteData);
            divRef.current?.removeEventListener('keydown', runKeydown);
        }
    }, []);

    const getAndSetCaretPos = (ele = divRef.current) => {
        let caretOffset = 0;
        const doc = ele.ownerDocument || ele.document;
        const win = doc.defaultView || doc.parentWindow;
        let sel;
        if(typeof win.getSelection != 'undefined') {
            sel = win.getSelection();
            if(sel.rangeCount > 0) {
                let range = win.getSelection().getRangeAt(0);
                let preCaretRange = range.cloneRange();
                preCaretRange.selectNodeContents(ele);
                preCaretRange.setEnd(range.endContainer, range.endOffset);
                caretOffset = preCaretRange.toString().length;
            }
        } else if ( (sel = doc.selection) && sel.type != 'Control') {
            let textRange = sel.createRange();
            let preCaretTextRange = doc.body.createTextRange();
            preCaretTextRange.moveToElementText(ele);
            preCaretTextRange.setEndPoint('EndToEnd', textRange);
            caretOffset = preCaretTextRange.text.length;
        }
        Pos.current = caretOffset;
    };

    function putText(txt, text, pos) {
        txt = txt || '';
        const value = selectedRange.current || '';
        let len = value.length;
        let str = '';
        if(!value) {
            if(txt) str = text.slice(0, pos) + txt + text.slice(pos);
            else {
                const chars = splitStringForEmoji(text).filter(t => t);
                let cnt = 0, sub = 0;
                for(let char of chars) {
                    if(isEmoji(char)) {
                        cnt += char.length;
                        if(cnt >= pos && !sub) sub = char.length;
                        else str += char;
                    } else {
                        for(let ch of char) {
                            cnt += ch.length;
                            if(cnt >= pos && !sub) sub = ch.length;
                            else str += ch;
                        }
                    }
                }
                Pos.current -= sub;
            }
        } else if(text.slice(pos - len, pos) == value) {
            str = text.slice(0, pos - len) + txt + text.slice(pos);
            Pos.current -= len;
        } else {
            str = text.slice(0, pos) + txt + text.slice(pos + len);
        }
        
        // console.log('str',str,'pos',Pos.current,'value',value);
        return str;
    };

    function splitText(word) {
        const splitted = splitStringForEmoji(word).filter(c => c);
        return splitted;
    }
    
    const insertAndSetRange = (text, add) => {
        if(!textContent.current) return;
        if(add) Pos.current += add.length;
        else Pos.current += (text||'').length;
        // checkLink fnc below is async so it wont affect others running
        checkLinkAndScrape(textContent.current);

        const pos = Pos.current;
        const words = textContent.current.split(' ');
        let ranges = [], cnt = 0, lstNode;
        let nodeArray = [], idx = 0;
        for(let word of words) {
            const st = ['*','~','_'].find(t => word.startsWith(t) && 
            word.length > 2 && word.endsWith(t));
            if(st) {
                if(idx) cnt++;
                if(lstNode) {
                    if(idx) lstNode.innerText += ' ';
                    nodeArray.push(lstNode);
                }
                const tagParentNode = document.createElement('span');
                tagParentNode.classList.add(classObj[st]);
                const tagArray = [];
                const startBorderNode = createBorderNode( ((idx&&!lstNode) ? ' ' : '') + st);
                tagArray.push(startBorderNode);
                [ranges, lstNode] = getAndInsertNodes(
                    word.slice(1, word.length - 1), ranges, 
                    null, tagArray, pos, cnt + 1, idx, tagParentNode
                );
                if(cnt + word.length > pos && !ranges[0]) {
                    const lastNode = tagArray[tagArray.length - 1];
                    const offset = 'data' in (lastNode?.firstChild||{}) ? pos - cnt : 1;
                    ranges = [lastNode, offset];
                }
                const endBorderNode = createBorderNode(st);
                tagArray.push(endBorderNode);
                replaceChildrenNode(tagArray, tagParentNode);
                nodeArray.push(tagParentNode);
                lstNode = null;
            } else {
                [ranges, lstNode] = getAndInsertNodes(
                    idx ? ' '+word : word, ranges, lstNode, nodeArray, pos, cnt, idx
                );
                if(idx) cnt++;
            }
            cnt += word.length;
            idx++;
        }
        if(lstNode) {
            if(!ranges[0]) {
                const lstNodeFirstIndex = textContent.current.length - lstNode.innerText.length;
                ranges = [lstNode.firstChild, pos - lstNodeFirstIndex];
            }
            nodeArray.push(lstNode);
        }
        if(!ranges[0]) {
            const node = document.createElement('span');
            node.innerText = '';
            ranges = [pRef.current, nodeArray.length];
            nodeArray.push(node);
        }
        replaceChildrenNode(nodeArray);
        // pRef.current.replaceChildren(...nodeArray);
        setCaretPos(ranges[0], ranges[1]);
        divRef.current.focus();
    };

    function replaceChildrenNode(arr, par = pRef.current) {
        par.innerHTML = '';
        for(let node of arr) par.appendChild(node);
    }

    function setCaretPos(caretNode, offsetPos) {
        if(Range.current && Sel.current) {
            Range.current.setStart(caretNode, Math.max(0, offsetPos));
            Range.current.collapse(true);
            Sel.current.removeAllRanges();
            Sel.current.addRange(Range.current);
        }
    };

    function getAndInsertNodes(Word, ranges, lstNode, arr, pos, cnt, idx, parNode = null) {
        const word = splitText(Word);
        let str = '', counter = cnt;
        let rnge = ranges, node = lstNode;
        for(let char of word) {
            if(!isEmoji(char)) str += char;
            else {
                if(str) {
                    [node, rnge, counter] = createStringNode(
                        str, node, rnge, counter, parNode, pos, true
                    );
                    arr.push(node);
                }
                counter += char.length;
                node = createEmojiNode(char);
                if(counter >= pos && !rnge[0]) rnge = [node, 1];
                arr.push(node);
                str = '';
                node = null;
            }
        }
        if(str) {
            if(!node) {
                [node, rnge, counter] = createStringNode(
                    str, node, rnge, counter, parNode, pos, parNode ? true : false
                );
            } else {
                node.innerText += str;
            }
            if(parNode) arr.push(node);
        }
        if(parNode) node = null;
        return [rnge, node];
    };

    function createBorderNode(string) {
        const node = document.createElement('span');
        node.innerText = string;
        node.style.color = '#A5A4A4';
        return node;
    };

    function createStringNode(str, lstNode, ranges, cnt, par, pos, closed) {
        let node = lstNode, rng = ranges, tmp = cnt;
        if(node) {
            const joinedText = node.innerText + str;
            node.innerText = joinedText;
        } else {
            // node = document.createElement(par ? 'strong' : 'span');
            node = document.createElement('span');
            node.innerText = str;
        }
        tmp += str.length;
        if(closed && tmp >= pos && !rng[0]) {
            const offset = node.innerText.length - (tmp - pos);
            rng = [node.firstChild, offset];
        }
        return [node, rng, tmp];
    };

    function createEmojiNode(emoji) {
        const emojiNode = document.createElement('span');
        const emojiChildNode = document.createElement('span');
        emojiChildNode.innerText = emoji;
        emojiNode.classList.add('text-emoji-main');
        emojiChildNode.classList.add('text-emoji');
        const desired_px = 24;
        const { page, num, index } = findIndex(emojiData[emoji].index - 0);
        const left = num && !(num % 26) ? 26 : num % 26;
        const pos = `-${left * desired_px}px -${Math.floor(num / 26) * desired_px}px`;
        emojiNode.style.backgroundSize = `${26 * desired_px}px ${(page < 11 ? 13 : 10) * desired_px}px`;
        emojiNode.style.backgroundPosition = pos;
        // emojiNode.style.fontSize = `${desired_px}px`;
        emojiChildNode.style.fontSize = `${(index >= 2268 && index <= 2293) ? 12.5 : 17.5}px`;
        emojiNode.style.width = `${desired_px}px`;
        emojiNode.style.height = `${desired_px}px`;
        emojiNode.style.backgroundImage = `url(${images[page]})`;
        emojiNode.style.margin = `0px`;
        emojiNode.appendChild(emojiChildNode);
        return emojiNode;
    };

    function findIndex(index) {
        index += 1;
        return {
            page: Math.ceil(index / 338), index: index - 1,
            num: (index % 338 == 0 && index) ? 337 : (index % 338) - 1,
        };
    };

    return { empty, insertEmoji };

};

export default useTextEditor;