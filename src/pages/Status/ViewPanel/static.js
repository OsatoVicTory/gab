import { useState, useRef, useEffect } from 'react';
import './styles.css';
import { useSelector, useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import { 
    setStatusData, setModalData, setModalMessageData, setStatusMessageData 
} from '../../../store/actions';
import StatusFooterInput from "./footer_input";
import StatusContent from './content';
import CaptionModal from '../../../modals/ExoModals/caption';
import { MdKeyboardArrowUp, MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md';
import { ArrowLeftIcon, CloseIcon } from '../../../component/Icons';
import defaultImage from '../../../images/avatar.png';
import { formatDateTimeFromDate } from '../../../utils/formatters';
import { useNavigate } from 'react-router-dom';
import { BsTrashFill } from 'react-icons/bs';
import { deleteStatus } from '../../../services/status';
import { responseMessage } from '../../../utils/others';
import { contactName } from '../../../utils/Chat';
import Reel from './reel';

const StatusViewStatic = ({ state, closeStatusView, socket, stopperRef }) => {

    const accountId = state.account._id;
    const [showInput, setShowInput] = useState(false);
    const [showCaption, setShowCaption] = useState(false);
    const [offsetWidth, setOffsetWidth] = useState(300);
    const user = useSelector(state => state.user);
    const { modal } = useSelector(state => state.sessions);
    const { contacts } = useSelector(state => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const setStatus = bindActionCreators(setStatusData, dispatch);
    const setModal = bindActionCreators(setModalData, dispatch);
    const setModalMessage = bindActionCreators(setModalMessageData, dispatch);
    const setStatusMessage = bindActionCreators(setStatusMessageData, dispatch);
    const timerRef = useRef(null);
    const stopRef = useRef(false);
    const [time, setTime] = useState(0);
    const [index, setIndex] = useState(state.index||0);
    const [viewStatus, setViewStatus] = useState('running');
    const varMap = new Map();
    const viewedMap = useRef(varMap);

    const checkRunning = (page, idx) => {
        const { _id, viewed } =  state.view[idx]||{};
        if(viewed || accountId === user._id) setViewStatus('completed'+_id);
        else if(_id && !viewedMap.current.has(_id)) setViewStatus('running'+_id);
        else setViewStatus('completed'+_id);
    };
    
    const switchIndex = (type) => {
        setShowInput(false);
        setShowCaption(false);
        if(modal) setModal(null);
        if(type === 'right') {
            if(index + 1 >= state.view.length) {
                if(timerRef.current) clearInterval(timerRef.current)
                closeStatusView();  
            } else {
                setIndex(index + 1);
                checkRunning(null, index + 1);
            }
        } else {
            if(index === 0) {
                if(timerRef.current) clearInterval(timerRef.current);
                closeStatusView();
            } else {
                setIndex(index - 1);
                checkRunning(null, index - 1);
            }
        }
    };

    useEffect(() => {
        if(time >= 7) switchIndex('right');
    }, [time]);
    
    const setter = (data_id, pause) => {
        viewedMap.current.set(data_id, accountId);
        setViewStatus('completed' + data_id + accountId);
    };

    useEffect(() => {
        if(showInput || showCaption) stopRef.current = true;
        else stopRef.current = false;
    }, [showInput, showCaption]);

    const resize = () => {
        const ele = document.getElementById('status-view');
        if(ele) setOffsetWidth(ele.offsetWidth);
    };

    useEffect(() => {
        resize();
        window.addEventListener('resize', resize);
        return () => {
            if(accountId !== user._id) setStatus('leaveView', viewedMap.current);
            else setStatus('userView', 'now');
            window.removeEventListener('resize', resize);
        }
    }, []);

    const handleDelete = (val) => {
        deleteStatus(val._id).then(res => {
            const ends = user.contacts.filter(c => (
                c.userId !== user._id && !c.barred)).map(contact => contact.userId)
            socket.emit('deleteStatus', { accountId, statusId: val._id, ends });
            setStatus('deleteMyStatus', val._id);
            setStatusMessage({
                type:'success', 
                text:'Deleted successfully from database. Might take a moment to reflect'
            });
        }).catch(err => responseMessage('error', setStatusMessage, err));
    };

    function showViewers(val) {
        setModal('status-viewers');
        setModalMessage(val);
    };
    
    return (
        <div className='Status__View' id='status-view'>
            {state.view[index] && 
            <div className='status__View'>

                <div className='sVW__controls left' 
                onClick={() => closeStatusView()}>
                    <ArrowLeftIcon className={'sVW__controls_icon'} />
                </div>

                {accountId === user._id && <div className='sVW__controls forDelete' 
                onClick={() => handleDelete(state.view[index])}>
                    <BsTrashFill className='sVW__controls_icon' />
                </div>}

                <div className='sVW__controls right'
                onClick={() => navigate('/app/chats')}>
                    <CloseIcon className={'sVW__controls_icon'} />
                </div>

                {index > 0 && <div className='sVW__controls arrow left' 
                onClick={() => switchIndex('left')}>
                    <MdKeyboardArrowLeft className='sVW__controls_icon' />
                </div>}

                {((!viewStatus?.startsWith('running')) && index < state.view.length - 1) &&
                <div className='sVW__controls arrow right' 
                onClick={() => switchIndex('right')}>
                    <MdKeyboardArrowRight className='sVW__controls_icon' />
                </div>}

                <div className='status__View__Wrapper'>
                    <header>

                        <Reel data={state.view} index={index} 
                        setFinished={setTime} viewStatus={viewStatus} 
                        stopRef={stopRef} stopperRef={stopperRef} timerRef={timerRef} />

                        <div className='status__View__User'>
                            <div className='svU__Image'>
                                <img src={state.account.img||defaultImage} alt='status' />
                            </div>
                            <div className='svU-texts'>
                                <span className='svut-top'>
                                    {contactName(state.account._id, contacts) ||
                                    state.account.userName}
                                </span>
                                <span className='svut-base'>
                                    {formatDateTimeFromDate(
                                        state.view[index].createdAt
                                    )}
                                </span>
                            </div>
                        </div>
                    </header>
                    <main>
                        <div className='status__View__Main'>
                            <StatusContent setter={setter} socket={socket} 
                            stopRef={stopRef} viewStatus={viewStatus}
                            data={state.view[index]} />
                        </div>
                    </main>
                    <footer>
                        {!showInput && <div className='status_view_footer_plain'>
                            
                            {accountId !== user._id && <div onClick={() => setShowInput(true)}>
                                <MdKeyboardArrowUp className='svfp_icon' />
                                <span className='svfp_span'>Reply</span>
                            </div>}

                            {accountId === user._id && <div 
                            onClick={() => showViewers(state.view[index])}>
                                <MdKeyboardArrowUp className='svfp_icon' />
                                <span className='svfp_span'>Viewers</span>
                            </div>}

                            {state.view[index].caption && <div className='svfp_caption'
                            onClick={() => setShowCaption(true)}>
                                <MdKeyboardArrowUp className='svfp_icon' />
                                <span className='svfp_span'>Caption</span>
                            </div>}
                        </div>}
                        {showInput && <div className='status_view_footer'>
                            <StatusFooterInput  
                            data={state.view[index]}
                            account={state.account} socket={socket}
                            close={() => setShowInput(false)}  />
                        </div>}
                    </footer>
                </div>
            </div>}

            <span>
                <CaptionModal showModal={showCaption ? 'show' : ''}
                closeModal={() => setShowCaption(false)} width={offsetWidth}
                caption={state.view[index].caption} />
            </span>

        </div>
    )
};

export default StatusViewStatic;