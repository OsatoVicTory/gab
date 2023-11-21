import React, { useState, useEffect, useRef } from 'react';
import './convo.css';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { 
    setStatusMessageData, setModalData, 
    setChatsData, setModalMessageData 
} from '../../../store/actions';
import { bindActionCreators } from 'redux';
import ConvoHeader from '../../../component/convo_header';
import ConvoMessage from '../../../component/Message';
import Input from '../../../component/Input';
import { MdKeyboardDoubleArrowDown } from 'react-icons/md';
// import image from '../../../images/img1.jpg';
import { getUser } from '../../../services/user';
import bgImage from '../../../images/bgImage.png';
import { 
    goToMessage, scrollUtil, 
    searchWordUtil, filterText 
} from '../../../utils/chats_previous';
import useLongPress from '../../../hooks/useLongPress';
import NoData from '../../../component/NoData';
import LoadingSpinner from '../../../component/loading/loading';
import ErrorPage from '../../../component/ErrorPage';
import { MdCheckBox, MdCheckBoxOutlineBlank } from 'react-icons/md';

const DirectConvo = ({ socket }) => {

    const State = useSelector(state => state.chats);
    const user = useSelector(state => state.user);
    const loc = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const setModal = bindActionCreators(setModalData, dispatch);
    const setChats = bindActionCreators(setChatsData, dispatch);
    const setModalMessage = bindActionCreators(setModalMessageData, dispatch);
    const setStatusMessage = bindActionCreators(setStatusMessageData, dispatch);
    const { id } = useParams();
    const accountData = State.data.find(({ account }) => account._id === id)||loc.state;
    const acct = accountData;
    const [account, setAccount] = useState(accountData);
    const { messages, unReads, taggedYou } = acct||{};
    const [showCheckBox, setShowCheckBox] = useState(false);
    const [loading, setLoading] = useState(acct?.account ? false : true);
    const [error, setError] = useState(false);
    const [checked, setChecked] = useState([]);
    const [showScrollDown, setShowScrollDown] = useState(false);
    const [tagged, setTagged] = useState(loc?.state?.tagged||null);
    const [focusTagged, setFocusTagged] = useState(null);
    const elementsRef = useRef([]);
    const [fixedTime, setFixedTime] = useState('');
    const [search, setSearch] = useState(null);
    const curRef = useRef(null);
    const nxtRef = useRef(null);
    const mainRef = useRef(null);
    const [unreadsState, setUnreadsState] = useState(unReads);
    const unReadsRef = useRef(null);
    const [taggedState, setTaggedState] = useState(taggedYou);
    const taggedRef = useRef(null);

    const handleLongPress = (e) => setShowCheckBox(true);
    const handleClick = (e) => null;
    const events = useLongPress(handleClick, handleLongPress, 500);
    const handleChecked = (_id) => {
        if(!checked.includes(_id)) setChecked([...checked, _id]);
        else setChecked([...checked.filter(id => id !== _id)]);
    }
    const scrollDownwards = () => {
        if(messages?.length > 0) goToMessage(messages[messages.length - 1]._id, (ex) => null);
    }
    
    useEffect(() => {
        if(messages?.length > 0) {
            const eles = document.getElementsByClassName(`CLN__time`)||[];
            if(eles) {
                elementsRef.current = eles;
                curRef.current = eles.length - 1;
                nxtRef.current = eles.length - 1;
            };
            if(!unReads) scrollDownwards();
            else goToMessage(messages[messages.length - unReads]?._id, (ex) => null, true);
        }
        setUnreadsState(unReads);
        setTaggedState(taggedYou);
        if(!acct?.account) {
            getUser(id).then(res => {
                setAccount(res.data.user);
                setLoading(false);
            }).catch(err => {
                setLoading(false);
                setError(true);
                setStatusMessage({type:'error',text:'Network Error'});
            });
        }

        return () => setChats('leavingPage', id);
        
    }, [id]);

    useEffect(() => {
        const ele = document.getElementById(`Gab-${messages[messages.length - 1]?._id}`);
        if(ele && mainRef.current) {
            if(ele.getBoundingClientRect().top > mainRef.current.clientHeight) setShowScrollDown(true);
        }
    }, [messages?.length]);

    useEffect(() => {
        if(focusTagged) goToMessage(focusTagged, setFocusTagged);
    }, [focusTagged]);

    useEffect(() => {
        console.log('unReads', unReads, 'unreadsState', unreadsState);
        if(unReads > unreadsState) {
            const message_id = messages[messages.length - unReads - unreadsState]?._id;
            const ele = document.getElementById(`Gab-${message_id}`);
            if(ele) unReadsRef.current = ele;
        }
        if(taggedYou) {
            const ele = document.getElementById(`Gab-${taggedYou}`);
            if(ele) {
                taggedRef.current = ele;
                setTaggedState(taggedYou);
            }
        }
    }, [taggedYou, unReads]);

    useEffect(() => {
        if(!taggedState) setChats('removeTagged', id);
    }, [taggedState]);

    const getInfos = (type, user_id) => {
        if(type === 'sender') return user_id !== user._id ? acct.account : user;
        else if(user._id === user_id) return user;
        else return user_id === acct.account._id ? acct.account : null; 
    };

    const searchWord = (type, cb) => {
        searchWordUtil(
            curRef.current, nxtRef.current, elementsRef.current, 
            messages, search, setStatusMessage, type, cb
        );
    }

    const handleScroll = (e) => {
        scrollUtil(
            e, curRef, nxtRef, elementsRef.current, setFixedTime, 
            setShowScrollDown, messages, unReadsRef.current, 
            unReads > unreadsState, setUnreadsState, unReads,
            taggedRef.current, taggedState, setTaggedState
        );
    }

    const deleteSelectedMessage = () => {
        setModal('delete-message');
        setModalMessage({ messageIds: checked, receiverId: id });
    }

    return (
        <div className='Convo__'>
            <div className='Convo__Container'>
                {loading && <div className='cC__Loading'>
                    <LoadingSpinner width={'40px'} height={'40px'} />
                </div>}
                {error && <ErrorPage />}
                
                {(!loading && error) && <NoData />}

                {(acct?.account || !account.userName) && <div className='Convo__Wrapper'>

                    <ConvoHeader account={acct?.account ? acct.account : account} 
                    type={'profile'} checked={checked}
                    checkedRef={showCheckBox} setCheckedRef={setShowCheckBox} 
                    backFunc={() => navigate('/app/chats')} setSearch={setSearch} 
                    searchWord={searchWord} deleteSelectedMessage={deleteSelectedMessage} />

                    <div className={`Convo__Main`} ref={mainRef}
                    style={{backgroundImage: `url(${bgImage})`}}>
                        {fixedTime && <div className='sticky-time grey fnt-300 std-bg'>
                            {fixedTime}
                        </div>}
                        <div className='Convo__Main__' onScroll={(e) => handleScroll(e)}>
                            <ul className='Convo__Lists'>
                                {(messages||[]).map((Val, Idx) => (
                                    Val?.senderId ?
                                        (Val.centerMessage ?
                                        <li key={`Convo__List__${Idx}`}>
                                        <div className='Convo__Center__Message' id={`Gab-${Val._id}`}>
                                            <div className={`convo-center-message fnt-400 ${Val.messageId&&'pointer'}`}
                                            onClick={() => {
                                                if(Val.messageId) {
                                                    goToMessage(Val.messageId, setFocusTagged);
                                                }
                                            }}>
                                                {filterText(Val.centerMessage, 
                                                getInfos, user.contacts)}
                                            </div>
                                        </div>
                                        </li> :
                                        <li key={`Convo__List__${Idx}`}>
                                        {messages.length - unReads === Idx && <div 
                                        className='Convo__Unreads'>
                                            <div className='convo-unreads fnt-400'>
                                            {`${unReads} new message${unReads > 1 ? 's' : ''}`}
                                            </div>
                                        </div>}
                                        <div className={`Convo__List ${focusTagged === Val._id}`} 
                                        {...events} id={`Gab-${Val._id}`}>
                                            {showCheckBox && <div className='Convo__Check'
                                            onClick={()=>handleChecked(Val._id)}>
                                                {checked.includes(Val._id) ?
                                                    <MdCheckBox className='cc-box' /> :
                                                    <MdCheckBoxOutlineBlank className='cc-box' />
                                                }
                                            </div>}
                                            <div className={`Conver__Sation ${showCheckBox} ${Val.senderId === user._id ? 'you' : ''}`}>
                                                
                                                <ConvoMessage message={Val} setTagged={setTagged} account={acct?.account}
                                                user={user} id={id} socket={socket} data={Val} isGroup={false}
                                                setFocusTagged={setFocusTagged} search={search} getInfos={getInfos}
                                                notSameSender={Idx===0 || messages[Idx-1]?.senderId !== messages[Idx].senderId} />

                                            </div>
                                        </div>
                                        </li>) :
                                        <li key={`Convo__List__${Idx}`}>
                                        <div className={`Convo__List__NotMessage`}>
                                            <div className={`CLN__${Val.time?'time':''}`} id={Val.time ? `Time#${Idx}`: 'CLN'}>
                                                <div className='CLN__Div std-bg'>{Val.message||Val.time}</div>
                                            </div>
                                        </div>
                                        </li>
                                ))}
                            </ul>
                        </div>
                        {showScrollDown && <div className='Convo__Main__Scroller'
                        onClick={() => scrollDownwards()}>
                            {taggedState && <div className='bottom-div green'>@</div>}
                            {unReads > unreadsState && 
                            <div className='unreadsState green'>{unReads - unreadsState}</div>}
                            <div className='cms-scroller'>
                                <MdKeyboardDoubleArrowDown className='cm-scroller-icon' />
                            </div>
                        </div>}
                    </div>

                    <Input socket={socket} user={user} setTagged={setTagged} isGroup={false}
                    receiver={acct?.account ? acct.account : account} tagged={tagged} getInfos={getInfos} />

                </div>}
            </div>
        </div>
    );
}

export default DirectConvo;