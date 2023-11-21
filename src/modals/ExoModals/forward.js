import { useState, useEffect, useRef } from 'react';
import './modal_styles.css';
import { useSelector, useDispatch } from 'react-redux';
import { setChatsData, setStatusMessageData } from '../../store/actions';
import { bindActionCreators } from 'redux';
import { CheckBoxChecked, CheckBoxBlank, CloseIcon, ArrowLeftIcon, SendIcon } from '../../component/Icons';
import defaultImage from '../../images/avatar.png';
import TextWithEmoji from '../../component/TextWithEmoji';
import ForwardFooter from './footer';
import { sendDirectMessage } from '../../services/dm';
import { contactName, randomId } from '../../utils/Chat';
import { responseMessage } from '../../utils/others';
import LoadingSpinner from '../../component/loading/loading';
import useClickOutside from '../../hooks/useClickOutside';

const ForwardMessage = ({ message, socket, closeModal }) => {
    
    const user = useSelector(state => state.user);
    const chats = useSelector(state => state.chats).data;
    const modalRef = useRef();
    const [forward, setForward] = useState([]);
    const [forwardShowing, setForwardShowing] = useState([]);
    const [checked, setChecked] = useState([]);
    const [forwardLoading, setForwardLoading] = useState(false);
    const [search, setSearch] = useState('');
    const dispatch = useDispatch();
    const setChats = bindActionCreators(setChatsData, dispatch);
    const setStatusMessage = bindActionCreators(setStatusMessageData, dispatch);

    const forwardData = () => {
        const res = chats.map(val => val.account);
        setForward(res);
        setForwardShowing(res);
    };

    useClickOutside(modalRef, () => closeModal());

    const handleForward = async () => {
        if(forwardLoading) return;
        try {
            setForwardLoading(true);
            for(let i = 0; i < checked.length; i++) {
                const { _id } = checked[i];
                
                if(!message.audio) {
                    const messageData = new FormData(); 
                    if(message.link) {
                        messageData.append('link', message.link);
                        messageData.append('link_text', message.link_text);
                        messageData.append('contentId', message.contentId);
                    }
                    if(message.scrappedData) {
                        messageData.append('scrappedData', message.scrappedData);
                    }
                    messageData.append('images', JSON.stringify(message.images||[]));
                    if(message.message) messageData.append('message', message.message);
                    messageData.append('senderId', user._id);
                    messageData.append('senderPhoneNumber', user.phoneNumber);
                    messageData.append('senderColor', user.userColor);
                    messageData.append('receiverId', _id);
                
                    const res = await sendDirectMessage(messageData);
                    socket.emit('sendMessage', { 
                        message: {
                            ...res.data.messageData,
                            senderUserName: user.userName,
                            senderColor: user.userColor
                        },
                        sender: user, 
                    });
                    setChats('iSend', checked[i], res.data.messageData);
                } else {
                    const messageData = {};
                    messageData.audio = message.audio;
                    messageData.audioDuration = message.audioDuration;
                    messageData.createdAt = String(new Date());
                    messageData.images = [];
                    messageData.reactions = [];
                    messageData.senderId = user._id;
                    messageData.senderPhoneNumber = user.phoneNumber;
                    messageData.senderColor = user.userColor;
                    messageData._id = randomId();
                    messageData.receiverId = _id;
                    socket.emit('sendMessage', { 
                        message: { ...messageData },
                        sender: user, 
                    });
                    setChats('iSend', checked[i], messageData);
                }
            } 
            setForwardLoading(false);
            setStatusMessage({type:'success', text: 'Forwarded successfully'}); 
            closeModal();
        } catch (err) {
            setForwardLoading(false);
            responseMessage('error', setStatusMessage, err);
        }
    };

    const handleChange = (e) => setSearch(e.target.value);

    useEffect(() => {
        if(forward.length < 1 && !search) forwardData();
        else if(!search) setForwardShowing(forward);
        else {
            const value = String(value).toLowerCase();
            setForwardShowing([...forward.filter(val => (
                (val.userName||'').toLowerCase().startsWith(value) || 
                String(val.phoneNumber).startsWith(value)
            ))]);
        }
    }, [search]);

    const clickCheck = (val) => {
        let res = [], found = false;
        for(var i = 0; i < checked.length; i++) {
            if(checked[i]._id === val._id) {
                found = true;
            } else res.push(checked[i]);
        }
        if(!found) res.push(val);
        setChecked(res);
    };

    return (
        <div className='ForwardMessage' ref={modalRef}>
            <header>
                <div className='forwardIconDiv' onClick={() => closeModal()}>
                    <CloseIcon className={'forwardIcon'} />
                </div>
                <h2>Forward Message</h2>
            </header>
            <section>
                <div className='forwardSearch'>
                    <div className='forwardIconDiv' onClick={() => setSearch('')}>
                        <ArrowLeftIcon className={'forwardIcon green'} />
                    </div>
                    <input placeholder='Search' onChange={handleChange} value={search} />
                </div>
            </section>
            <main className='hide_scroll_bar'>
                <ul className='forwardLists'>
                    {forwardShowing.map((val, idx) => (
                        <li className='forwardList' key={`forward-${idx}`}>
                            <div className='fl-checkbox'
                            onClick={() => clickCheck(val)}>
                                {checked.find(ch => ch._id === val._id) ?
                                <CheckBoxChecked className={'forwardIcon'} /> :
                                <CheckBoxBlank className={'forwardIcon'} />}
                            </div>
                            <div className='fl-image'>
                                <img src={val.img||defaultImage} alt='dp' />
                            </div>
                            <div className='fl-texts'>
                                <div className='fl-span'>
                                    <span className='txt-17'>
                                        {contactName(val._id, user.contacts) ||
                                        val.phoneNumber}
                                    </span>
                                </div>
                                <div className='fl-span'>
                                    <TextWithEmoji text={val.about}
                                    CLX={'txt-14'} clx={'txt-inner'}
                                    font={window.innerWidth <= 450 ? 13 : 14} 
                                    search={null} />
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </main>
            <footer>
                <div className='forwardFooter'>
                    <ForwardFooter 
                    type={message.images?.length > 0 ? 'Photo' : message.link ? 'Link' : 'Message'} 
                    media={message.images?.length > 0 ? message.images[0] : null} 
                    msg={message.message || message.link?.split('=')[0] || 'Link'} />

                    {checked.length > 0 && <div className='forwardFooterLists'>
                        <div className='forwardFooterLists_div'>
                            <div className='forwardFooterLists-div hide_scroll_bar'>
                                <ul>
                                {checked.map((val, idx) => (
                                    <li className='ffList' key={`ffL-${idx}`}>
                                        <div className='ffL-div'>
                                            <span className='txt-13'>
                                                {contactName(val._id, user.contacts) ||
                                                val.phoneNumber}
                                            </span>
                                        </div>
                                        <div className='ffL-icon-div'
                                        onClick={() => clickCheck(val)}>
                                            <CloseIcon className={'ffL-icon'} />
                                        </div>
                                    </li>
                                ))}
                                </ul>
                            </div>
                        </div>
                        <div className='forwardSend' onClick={handleForward}>
                            {!forwardLoading ? <SendIcon className={'fS__icon'} /> :
                            <LoadingSpinner width={'15px'} height={'15px'} />}
                        </div>
                    </div>}
                </div>
            </footer>
        </div>
    )
};

export default ForwardMessage;