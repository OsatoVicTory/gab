import { useState, useEffect, useRef } from 'react';
import './styles.css';
import useTextEditor from '../../hooks/useTextEditor';
import EmojiPicker from '../Emoji-picker';
import RecorderCapture from './recorder';
import { useDispatch, useSelector } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setStatusMessageData, setChatsData } from '../../store/actions';
import { Scrapped, Tagged, FooterImages } from './components';
import { ImageIcon, EmojiIcon, SendIcon, AudioIcon } from '../Icons';
import { checkIfIsLink } from '../../utils/texts';
import { sendDirectMessage, fetchScrappedData } from '../../services/dm';
import LoadingSpinner from '../loading/loading';


const Footer = ({ tagged, setTagged, account, socket, isBlocked }) => {

    const dispatch = useDispatch();
    const user = useSelector(state => state.user);
    const setChats = bindActionCreators(setChatsData, dispatch);
    const setStatusMessage = bindActionCreators(setStatusMessageData, dispatch);
    const [offsetWidth, setOffsetWidth] = useState(0.6 * window.innerWidth);
    const [showEmoji, setShowEmoji] = useState(false);
    const [mic, setMic] = useState(false);
    const [images, setImages] = useState([]);
    const [scrappedData, setScrappedData] = useState(null);
    const [sendLoading, setSendLoading] = useState(false);
    const [clearDiv, setClearDiv] = useState(false);
    const [sendState, setSendState] = useState(false);
    const footerRef = useRef();
    const timeoutRef = useRef();
    const divRef = useRef();
    const pRef = useRef();
    const placeholderRef = useRef();
    const linkRef = useRef('');
    const typingRef = useRef(false);

    const checkLinkAndScrape = async (inputs) => {
        try {
            const words = inputs.split(' ');
            let fnd = '';
            for(const word of words) {
                if(word === linkRef.current) return;
                if(fnd) break;
                if(!checkIfIsLink(word)) continue;
                fnd = word;
                break;
            }
            if(fnd === linkRef.current) return;
            if(fnd) {
                linkRef.current = fnd;
                setScrappedData({ loaded: false });
                timeoutRef.current = setTimeout(() => {
                    fetchScrappedData(linkRef.current).then(res => {
                        setScrappedData({ ...res.data, loaded: true });
                    }).catch(err => {
                        const title = linkRef.current.split('://')[1]?.split('.')[0]||'';
                        setScrappedData({ loaded: true, site: linkRef.current, title, pTag: title });
                    });
                }, 1000);
            } else {
                linkRef.current = '';
                setScrappedData(null);
            }
        } catch (err) {
            if(linkRef.current) {
                const title = linkRef.current.split('://')[1].split('.')[0];
                setScrappedData({ loaded: true, site: linkRef.current, title, pTag: title });
            }
        }

    };

    // useEffect(() => {
    //     const ele = document.getElementById('gab-main-footer');
    //     if(ele) {
    //         let new_class = 'chat-footer';
    //         if(tagged?.senderId) new_class += ' taggedOpened';
    //         if(scrappedData?.loaded !== undefined) new_class += ' scrappedOpened';
    //         if(images.length > 0) new_class += ' imagesOpened';
    //         ele.className = new_class;
    //     }
    // }, [tagged?.senderId, scrappedData?.loaded, images.length]);

    const send = async () => {
        try {
            setClearDiv(false);
            const message = pRef.current?.innerText || '';
            if(!message && images.length < 1) return false;
            if(images.length > 2) {
                setStatusMessage({type:'error',text:'Cannot post more than 2 images'});
                return false;
            }
            setSendLoading(true);
            const formData = new FormData();
            formData.append('message', message);
            if(tagged) {
                const taggedData = {
                    ...tagged, 
                    images: tagged?.images?.length > 0 ? [tagged.images[0]] : [],
                }
                formData.append('tagged', JSON.stringify(taggedData));
            }
            formData.append('senderId', user._id);
            formData.append('senderPhoneNumber', user.phoneNumber);
            formData.append('senderColor', user.userColor);
            for(const image of images) formData.append('files', image);
            formData.append('receiverId', account._id);
            formData.append('scrappedData', JSON.stringify(scrappedData));
            
            const res = await sendDirectMessage(formData);
            const userAcct = { ...user, contacts: '', blocked: '' };
            socket.emit('sendMessage', { 
                message: { ...res.data.messageData },
                sender: userAcct, 
            });
            setChats('iSend', account, res.data.messageData);

            const imgs = [...images];
            setTagged(null);
            setImages([]);
            for(var img of imgs) URL.revokeObjectURL(img);
            setStatusMessage({type:'success',text:'Message sent successfully'});
            setSendLoading(false);
            setShowEmoji(false);
            setScrappedData(null);
            setClearDiv(true);
            setSendState(false);
            socket.emit('stoppedtyping', { typer: user._id, receiver: account._id });
        } catch (err) {
            setStatusMessage({type:'error',text:err.response?.data.message||err.message});
            setSendLoading(false);
            setClearDiv(false);
            setSendState(false);
        }
    };

    const sendFn = () => {
        setSendState('send');
    };

    useEffect(() => { 
        if(sendState === 'send') send();
     }, [sendState]);

    const { empty, insertEmoji } = useTextEditor(
        divRef, pRef, placeholderRef, checkLinkAndScrape, sendFn, null, clearDiv
    );
         

    function resize() { 
        if(footerRef.current) setOffsetWidth(footerRef.current.offsetWidth);
    };
    
    const typing = () => {
        if(!typingRef.current) {
            socket.emit('typing', { typer: user._id, receiver: account._id });
        }
        typingRef.current = true;
    };
    const stoppedTyping = () => {
        if(typingRef.current) {
            socket.emit('stoppedtyping', { typer: user._id, receiver: account._id });
        }
        typingRef.current = false;
    };

    useEffect(() => {
        resize();
        window.addEventListener('resize', resize);
        if(divRef.current) {
            divRef.current.addEventListener('keydown', typing);
            divRef.current.addEventListener('blur', stoppedTyping);
        }
        return () => {
            if(images?.length > 0) images.forEach(image => URL.revokeObjectURL(image));
            divRef.current?.removeEventListener('keydown', typing);
            divRef.current?.removeEventListener('blur', stoppedTyping);
            window.removeEventListener('resize', resize);
            clearTimeout(timeoutRef.current);
        }
    }, []);

    function pickedMediaFile(e) {
        const File = e.target.files[0];
        if(!File?.size) return;
        // if(!['.png','.jpg','.jpeg'].find(file => File.name.endsWith(file))) {
        //     return setStatusMessage({type:'error',text:'Upload only image files'});
        // }
        if(File.size > 2048048) {
            return setStatusMessage({type:'error', text:'File cannot be more than 2MB'});
        }
        setImages([...images, File]);
    };

    return (
        <div className='Chat__Footer' ref={footerRef}>

            {tagged?.senderId && <Tagged data={tagged} 
            contacts={user.contacts} close={()=>setTagged(null)} />}

            {scrappedData && <Scrapped data={scrappedData} 
            close={()=>setScrappedData(null)} setData={setScrappedData} />}

            {showEmoji && <div className='Footer__Emoji__Picker'>
                <EmojiPicker offsetWidth={offsetWidth} emojiClick={insertEmoji} />
            </div>}

            <div className={`footer__Message ${!isBlocked ? 'hide' : 'show'}`}>
                <div className='footer__Blocked'>
                    Cannot send a blocked user message. Go to profile and unblock
                </div>
            </div>

            <div className={`footer__Message ${isBlocked ? 'hide' : 'show'}`}>
                {mic && <div className={`footer__Mic`}>
                    <div className='f_Mic_placeholder'>Recording...</div>
                    <div className='f_Mic'>
                        <RecorderCapture close={() => setMic(false)} 
                        account={account} user={user} tagged={tagged} 
                        setTagged={setTagged} socket={socket} setChats={setChats} 
                        setShowEmoji={setShowEmoji} setStatusMessage={setStatusMessage} />
                    </div>
                </div>}

                
                <div className={`footer__MessageBox ${!mic ? 'show' : 'hide'}`}>
                    <div className='footer_icon_' onClick={()=>setShowEmoji(!showEmoji)}>
                        <EmojiIcon className={'footer_icon'} />
                    </div>
                    <label className='footer_icon_' htmlFor='file_input'>
                        <ImageIcon className={'footer_icon'} />
                    </label>
                    <input type='file' id='file_input' 
                    accept='image/*' onChange={pickedMediaFile} />

                    <div className='footer__Message__Input'>
                        <div contentEditable='true' ref={divRef} role='textbox'
                        spellCheck='true' className='footer-input-editor hide_scroll_bar'
                        suppressContentEditableWarning={true}>
                            <p className='footer-input-p' ref={pRef} id='p'><br/></p>
                        </div>
                        <div className='footer-input-placeholder' ref={placeholderRef}>
                        Type message</div>
                    </div>
                    <div className='footer_icon_' onClick={() => {
                        if(sendLoading) return;
                        else if(empty && images.length < 1) setMic(true);
                        else send();
                    }}>
                        {sendLoading ?
                            <LoadingSpinner width={'18px'} height={'18px'} /> :
                            (empty && images.length < 1) ?
                            <AudioIcon className={'footer_icon white'} /> :
                            <SendIcon className={'footer_icon white'} /> 
                        }
                    </div>
                </div>
            </div>

            {images?.length > 0 && <FooterImages images={images} setImages={setImages} />}
        </div>
    )
};

export default Footer;