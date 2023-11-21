import { useState, useRef, useEffect } from 'react';
import './footer.css';
import { CloseIcon, EmojiIcon, SendIcon } from "../../../component/Icons";
import useTextEditor from '../../../hooks/useTextEditor';
import EmojiPicker from '../../../component/Emoji-picker';
import { sendDirectMessage } from '../../../services/dm';
import { responseMessage } from '../../../utils/others';
import { useSelector, useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setChatsData, setStatusMessageData } from '../../../store/actions';
import LoadingSpinner from '../../../component/loading/loading';


const StatusFooterInput = ({ close, data, account, socket }) => {

    const user = useSelector(state => state.user);
    const dispatch = useDispatch();
    const setChats = bindActionCreators(setChatsData, dispatch);
    const setStatusMessage = bindActionCreators(setStatusMessageData, dispatch);
    const divRef = useRef();
    const pRef = useRef();
    const placeholderRef = useRef();
    const eleRef = useRef();
    const [offsetWidth, setOffsetWidth] = useState(window.innerWidth - 20);
    const [showEmoji, setShowEmoji] = useState(false);
    const [replyLoading, setReplyLoading] = useState(false);
    const [sendState, setSendState] = useState(false);

    function send() {
        const message = divRef.current?.innerText;
        if(!message) return false;
        
        if(replyLoading) return false;
        setReplyLoading(true);
        const formData = new FormData();
        formData.append('senderId', user._id);
        formData.append('senderPhoneNumber', user.phoneNumber);
        formData.append('senderColor', user.userColor);
        formData.append('status_tagged', JSON.stringify(data));
        formData.append('message', message);
        formData.append('receiverId', data.posterId);
        const userAcct = { ...user };
        delete userAcct.contacts;
        delete userAcct.groups;
        sendDirectMessage(formData).then(res => {
            responseMessage('success', setStatusMessage, res);
            socket.emit('sendMessage', { 
                sender: userAcct, 
                message: { ...res.data.messageData },
                receiverId: data.posterId 
            });
            setChats('iSend', account, res.data.messageData);
            setReplyLoading(false);
            setSendState(false);
            close();
        }).catch(err => {
            setReplyLoading(false);
            responseMessage('error', setStatusMessage, err);
            setSendState(false);
        })
    };

    function resize() {
        if(eleRef.current) setOffsetWidth(eleRef.current.offsetWidth);
    };

    function sendFn() {
        setSendState('send');
    };

    useEffect(() => {
        if(sendState === 'send') send();
    }, [sendState]);

    useEffect(() => {
        resize();
        window.addEventListener('resize', resize);
        return () => window.removeEventListener('resize', resize);
    }, []);
    
    const { empty, insertEmoji } = useTextEditor(
        divRef, pRef, placeholderRef, () => null, sendFn, null, false
    );

    return (
        <div className='Status__Footer__Input' ref={eleRef}>
            {showEmoji && <div className='sfi__Emoji__Wrapper'>
               <EmojiPicker offsetWidth={offsetWidth} emojiClick={insertEmoji} />
            </div>}
            <div className='status__Input'>
                <div className='sip_icon_div' onClick={() => close()}>
                    <CloseIcon className={'sip_icon'} />
                </div>
                <div className='sip_icon_div' onClick={() => setShowEmoji(!showEmoji)}>
                    <EmojiIcon className={'sip_icon'} />
                </div>
                <div className='sip__Input__Box'> 
                    <div contentEditable='true' ref={divRef} role='textbox'
                    spellCheck='true' className='sip-input-editor hide_scroll_bar'
                    suppressContentEditableWarning={true}>
                        <p className='sip-input-p' ref={pRef} id='p'><br/></p>
                    </div>
                    <div className='sip-input-placeholder' ref={placeholderRef}>
                    Type message</div>
                </div>
                <div className='sip_icon_div send' onClick={() => send()}>
                    {!replyLoading ? <SendIcon className={'sip_icon'} /> :
                    <LoadingSpinner width={'15px'} height={'15px'} />}
                </div>
            </div>
        </div>
    )
};

export default StatusFooterInput;