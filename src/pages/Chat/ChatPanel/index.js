import { useState, useEffect, useRef } from 'react';
import './styles.css';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { 
    setStatusMessageData, setModalData, 
    setChatsData, setModalMessageData 
} from '../../../store/actions';
import { bindActionCreators } from 'redux';
import Header from '../../../component/convo_header/header'; 
import Footer from '../../../component/convo_footer'; 
import ConversationPanel from '../../../component/conversation';
import AllMessageReactions from '../../../modals/EndoModals/all_reactions';
import ReactionsPickerPreview from '../../../modals/EndoModals/reactions_picker_preview';
import ReactionsPicker from '../../../modals/EndoModals/reactions_picker';
import DropDownModal from '../../../modals/EndoModals/dropdown';
import { getModalPositions } from '../../../utils/modal';
import { scrollToMessage, scrollUtil, searchWordUtil } from '../../../utils/Chat';
import { DropDownIcon } from '../../../component/Icons';
import MessageInfoModal from '../../../modals/EndoModals/message_info';
// import audio from '../../../images/audio.mp3';

const ChatPanel = ({ socket }) => {

    const chats = useSelector(state => state.chats);
    const user = useSelector(state => state.user);
    const { id } = useParams();
    const navigate = useNavigate();
    const loc = useLocation();
    const acct = chats.data.find(({ account }) => account._id === id)||loc?.state;
    const { messages, unReads } = acct||{};
    const dispatch = useDispatch();
    const setExoModal = bindActionCreators(setModalData, dispatch);
    const setChats = bindActionCreators(setChatsData, dispatch);
    const setExoModalMessage = bindActionCreators(setModalMessageData, dispatch);
    const setStatusMessage = bindActionCreators(setStatusMessageData, dispatch);
    const [search, setSearch] = useState('');
    const [modal, setModal] = useState(null);
    const [fixedTime, setFixedTime] = useState(false);
    const [showScrollDown, setShowScrollDown] = useState(false);
    const [unreadsState, setUnreadsState] = useState(0);
    const [checked, setChecked] = useState([]);
    const [focus, setFocus] = useState(null);
    const [checkBox, setCheckBox] = useState(false);
    const [tagged, setTagged] = useState(null);
    const [eTarget, setETarget] = useState(null);
    const mainRef = useRef();
    const elementsRef = useRef();
    const curRef = useRef();
    const nxtRef = useRef();
    const unReadsRef = useRef();

    const handleCheck = (_id) => {
        if(!checked.includes(_id)) setChecked([...checked, _id]);
        else setChecked([...checked.filter(id => id !== _id)]);
    };

    const closeModal = () => setModal(null);
    const openModal = (e, type, width, height, messageByYou, data) => {
        const pos = getModalPositions(e, width, height, messageByYou);
        setModal({ type, pos, data });
        if(type === 'dropdown') setETarget(e);
        else setETarget(null);
    };

    const openDropDownModal = (e, type, width, height, messageByYou, data) => {
        const pos = getModalPositions(eTarget||e, width, height, messageByYou);
        setModal({ type, pos, data });
    };

    function scrollTo() {
        if(messages?.length > 0) {
            scrollToMessage(messages[messages.length - 1]._id, (ex) => null);
        };
    };

    function scrolled(e) {
        if(modal?.type) setModal(null);
        scrollUtil(
            e, curRef, nxtRef, elementsRef.current, setFixedTime, 
            setShowScrollDown, messages, unReadsRef.current, 
            unReads > unreadsState, setUnreadsState, unReads,
            // taggedRef.current, taggedState, setTaggedState
        );
    };

    function searchWord(type, cb) {
        searchWordUtil(
            curRef.current, nxtRef.current, elementsRef.current, 
            messages, search, setStatusMessage, type, cb
        );
    };

    useEffect(() => {
        let ele;
        if(mainRef.current) {
            ele = mainRef.current;
            ele.addEventListener('scroll', scrolled);
        }
        if(messages?.length > 0) {
            const eles = document.getElementsByClassName('chat_time_list')||[];
            if(eles) {
                elementsRef.current = eles;
                curRef.current = eles.length - 1;
                nxtRef.current = eles.length - 1;
            };
            if(!unReads) scrollTo();
            else scrollToMessage(messages[messages.length - unReads]?._id, (ex) => null, true);
        }
        return () => {
            ele?.removeEventListener('scroll', scrolled);
        }
    }, [id]);
    
    useEffect(() => {
        if(unReads > unreadsState) {
            const message_id = messages[messages.length - unReads - unreadsState]?._id;
            const ele = document.getElementById(`Gab-${message_id}`);
            if(ele) unReadsRef.current = ele;
        }
    }, [unReads]);

    useEffect(() => {
        if(focus) scrollToMessage(focus, setFocus);
    }, [focus]);

    const checkSenders = (idx) => idx && messages[idx - 1].senderId !== messages[idx].senderId;
    const checkFnc = (_id) => !checkBox ? false : checked.includes(_id) ? 'Yes' : checkBox;

    const deleteSelectedMessage = () => {
        setExoModal('delete-message');
        setExoModalMessage({ messageIds: checked, receiverId: id });
    };

    const backFnc = () => {
        navigate('/app/chats');
        setChats('leavingPage', id);
    };
    const goToProfile = () => {
        navigate(`/app/chats/profile/${id}`, {
            state: { ...acct.account }
        });
    };

    const getImg = (_id) => {
        if(_id === user._id) return user.img;
        else return acct.account.img;
    };

    return (
        <div className='ChatPanel'>

            <span>{modal?.type === 'all_message_reactions' && <AllMessageReactions 
            pos={modal.pos} closeModal={closeModal} data={modal.data} socket={socket}
            user={user} acct={acct.account} />}</span>

            <span>{modal?.type === 'reactions_picker_preview' && <ReactionsPickerPreview 
            pos={modal.pos} closeModal={closeModal} socket={socket}
            data={modal.data} openModal={openModal} _id={user._id}
            id={acct.account._id} />}</span>

            <span>{modal?.type === 'reactions_picker' && <ReactionsPicker 
            pos={modal.pos} closeModal={closeModal} data={modal.data} socket={socket}
            _id={user._id} id={acct.account._id} />}</span>

            <span>{modal?.type === 'dropdown' && <DropDownModal 
            pos={modal.pos} closeModal={closeModal} setTagged={setTagged}
            data={modal.data} openModal={openDropDownModal} />}</span>

            <span>{modal?.type === 'message_info' && <MessageInfoModal
            pos={modal.pos} closeModal={closeModal} data={modal.data} />}</span>

            <div className='ChatPanel__Content'>
                
                <header><Header searchWord={searchWord}
                checkBox={checkBox} setCheckBox={setCheckBox} setChecked={setChecked}
                backFnc={backFnc} search={search} setSearch={setSearch}
                deleteSelectedMessage={deleteSelectedMessage} goToProfile={goToProfile}
                checked={checked} account={acct?.account||{}} /></header>

                <main> 
                    {fixedTime && <div className='sticky_time'>{fixedTime}</div>}
                    <div className='ChatPanel__Content__List hide_scroll_bar' ref={mainRef}>
                        <ul className='chat_panel_lists'>
                            {messages.map((val, idx) => (
                                <li className='chat_panel_list' key={`cplist-${idx}`}>
                                    {val.time && <div className='chat_time_list' 
                                    id={`Time#${idx}`}>
                                        <div className='c_t_l'>{val.time}</div>
                                    </div>}
                                    {messages.length - unReads === idx && 
                                    <div className='chat_unread_message'>
                                        <div className='_unread_'>
                                            {unReads} new message{unReads > 1 ? 's' : ''}
                                        </div>
                                    </div>}
                                    {val.createdAt && <div id={`Gab-${val._id}`} 
                                    className={`chat_panel_list_ ${val._id === focus}`}
                                    style={{marginTop: messages.length - unReads === idx ? 
                                    '10px' : '0px'}}>
                                        <ConversationPanel search={search} message={val}
                                        type={val.senderId === user._id ? 'You' : 'Others'} 
                                        openModal={openModal} setTagged={setTagged}
                                        handleCheck={handleCheck} setFocus={setFocus} 
                                        checked={checkFnc(val._id)} 
                                        notSameSender={checkSenders(idx)} getImg={getImg} />
                                    </div>}
                                </li>
                            ))}
                        </ul>
                    </div>
                    {unReads - unreadsState > 0 && <div className='chat_panel_unreadMessages'>
                    {unReads - unreadsState}</div>}
                    {showScrollDown && <div className='chat_panel_scroll' 
                    onClick={() => scrollTo()}>
                        <DropDownIcon className={'chat_panel_scroll_icon'} />
                    </div>}
                </main>

                <footer id='gab-main-footer' className='chat-footer'>
                    <Footer account={acct?.account||{}} isBlocked={acct.isBlocked}
                    socket={socket} tagged={tagged} setTagged={setTagged} />
                </footer>
            </div>
        </div>
    )
};

export default ChatPanel;