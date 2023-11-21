import { useEffect, useState, useRef } from 'react';
import './styles.css'; 
import { HiOutlineLightBulb } from 'react-icons/hi';
import { BsFlag, BsEmojiSmile, BsCup } from 'react-icons/bs';
import { AiFillCar } from 'react-icons/ai';
import { CgHashtag } from 'react-icons/cg';
import { TbDog } from 'react-icons/tb';
import { MdSportsVolleyball } from 'react-icons/md';
import EmojiPickerContents from './contents';
import { getEmojiSkintonesModalPositions } from '../../utils/modal';
import EmojiRender from '../emoji-store/emojiRender';
import { mountFnc, scrollFn, searchFnc } from './utils';
import emoji_data from '../emoji-store/emoji_data.json';


const EmojiPicker = ({ emojiClick, offsetWidth }) => {
    const eleRef = useRef();
    const elements = useRef();
    const [emojiLists, setEmojiLists] = useState([]);
    const [emojiListsShowing, setEmojiListsShowing] = useState([]);
    const [current, setCurrent] = useState(0);
    const indexRef = useRef(0);
    const skinTonesRef = useRef();
    const [state, setState] = useState('not_loaded');
    const [emojiSkinTones, setEmojiSkinTones] = useState(null);

    function scrollFnc(e) {
        const setter = (val) => {
            indexRef.current = val;
            setCurrent(val);
        }
        scrollFn(
            e, elements.current, indexRef.current, 
            emojiSkinTones?.emoji, setter, setEmojiSkinTones
        );
    };

    useEffect(() => {
        if(offsetWidth) mountFnc(offsetWidth, setEmojiLists, setEmojiListsShowing, setState); 
        if(eleRef.current) eleRef.current.addEventListener('scroll', scrollFnc);
        return () => eleRef.current?.removeEventListener('scroll', scrollFnc);
    }, []);

    useEffect(() => {
        if(state !== 'not_loaded') {
            const eles = Array.from(document.getElementsByClassName('Epm_list_title'));
            if(eles) elements.current = eles;
        }
    }, [state]);

    useEffect(() => { 
        if(offsetWidth) mountFnc(offsetWidth, setEmojiLists, setEmojiListsShowing, setState);
    }, [offsetWidth]);

    function handleChange(e) {
        const { value } = e.target;
        if(value) {
            if(state !== 'search') setState('search');
            if(current !== 0) setCurrent(0);
            searchFnc(value, offsetWidth, setEmojiListsShowing);
        } else {
            setEmojiListsShowing(emojiLists);
            setState('view_full_lists');
        }
    };

    function handleEmojiClick(e, emojiData) {
        if(emojiData.v) {
            const { pos, tick } = getEmojiSkintonesModalPositions(e.target, 240);
            setEmojiSkinTones({ emoji: 'true', emojis: emojiData.v, style: pos, tick });
        } else {
            emojiClick(emojiData.emoji);
            if(emojiSkinTones?.emoji) setEmojiSkinTones(null);
        }
    };
    function clickFnc(e) {

        if(!skinTonesRef.current) return;
        
        if(skinTonesRef.current && !skinTonesRef.current.contains(e.target)) {
            setEmojiSkinTones(null);
        };
    };

    function scrollerFnc(idx) {
        if(!elements.current) return;
        let i = 0;
        for(const ele of elements.current) {
            if(i === idx) {
                indexRef.current = idx;
                setCurrent(idx);
                ele.scrollIntoView(true, { behavior: 'smooth' });
                return;
            }
            i++;
        }
    };

    return (
        <div className='Emoji_Picker' id='EM-picker' onClick={clickFnc}>
            <span>{emojiSkinTones?.emoji && <div className='Ep__skintones hide_scroll_bar' 
            style={{...emojiSkinTones.style}} ref={skinTonesRef}>
                <span className='Ep_skintones_tick' style={{...emojiSkinTones.tick}}></span>
                {emojiSkinTones.emojis.map((val, idx) => (
                    <div className='Ep_skintones_div' key={`ep-skintones-${idx}`}
                    onClick={(e) => handleEmojiClick(e, val)}>
                        <EmojiRender emoji={val.emoji} size={32} />
                    </div>
                ))}
            </div>}</span>
            <div className='Emoji_picker'>
                <div className='Emoji_picker_header'>
                    <div className={`Eph ${current===0}`}
                    onClick={() => scrollerFnc(0)}>
                        <BsEmojiSmile className='Eph-icon adjust' />
                    </div>
                    <div className={`Eph ${current===1}`}
                    onClick={() => scrollerFnc(1)}>
                        <TbDog className='Eph-icon' />
                    </div>
                    <div className={`Eph ${current===2}`}
                    onClick={() => scrollerFnc(2)}>
                        <BsCup className='Eph-icon' />
                    </div>
                    <div className={`Eph ${current===3}`}
                    onClick={() => scrollerFnc(3)}>
                        <MdSportsVolleyball className='Eph-icon' />
                    </div>
                    <div className={`Eph ${current===4}`}
                    onClick={() => scrollerFnc(4)}>
                        <AiFillCar className='Eph-icon' />
                    </div>
                    <div className={`Eph ${current===5}`}
                    onClick={() => scrollerFnc(5)}>
                        <HiOutlineLightBulb className='Eph-icon' />
                    </div>
                    <div className={`Eph ${current===6}`}
                    onClick={() => scrollerFnc(6)}>
                        <CgHashtag className='Eph-icon' />
                    </div>
                    <div className={`Eph ${current===7}`}
                    onClick={() => scrollerFnc(7)}>
                        <BsFlag className='Eph-icon adjust' />
                    </div>
                </div>
                <div className='Emoji_picker_main'>
                    <div className='Epm_search'>
                        <input placeholder='Search emoji' onChange={handleChange} />
                    </div>
                    <div className='Epm_full_lists hide_scroll_bar' ref={eleRef}>
                        <EmojiPickerContents state={state} 
                        handleEmojiClick={handleEmojiClick}
                        rowLength={Math.floor(((offsetWidth||300) - 18) / 40)}
                        emojiListsShowing={emojiListsShowing} />
                    </div>
                </div>
            </div>
        </div>
    )
};
export default EmojiPicker;