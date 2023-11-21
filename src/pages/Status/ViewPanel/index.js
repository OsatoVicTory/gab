import { useState, useRef, useEffect } from 'react';
import './styles.css';
import { useSelector, useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setStatusData } from '../../../store/actions';
import StatusFooterInput from "./footer_input";
import StatusContent from './content';
import CaptionModal from '../../../modals/ExoModals/caption';
import { MdKeyboardArrowUp, MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md';
import { ArrowLeftIcon, CloseIcon } from '../../../component/Icons';
import defaultImage from '../../../images/avatar.png';
import { formatDateTimeFromDate } from '../../../utils/formatters';
import { contactName } from '../../../utils/Chat';
import { useNavigate } from 'react-router-dom';
import Reel from './reel';

const StatusView = ({ data, closeStatusView, socket, stopperRef }) => {

    const [showInput, setShowInput] = useState(false);
    const [showCaption, setShowCaption] = useState(false);
    const [offsetWidth, setOffsetWidth] = useState(300);
    const status = useSelector(state => state.status).data;
    const { contacts } = useSelector(state => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const setStatus = bindActionCreators(setStatusData, dispatch);
    const timerRef = useRef(null);
    // const timeRef = useRef(null);
    const stopRef = useRef(false);
    const [accountId, setAccountId] = useState(status[data.page].account._id);
    const [time, setTime] = useState(0);
    const [state, setState] = useState({ 
        view: status[data.page], page: data.page, index: data.index 
    });
    const [viewStatus, setViewStatus] = useState('running');
    const varMap = new Map();
    const viewedMap = useRef(varMap);
    
    const checkRunning = (page, index) => {
        const { statuses, completed } = status[page]||{};
        const { _id, viewed } = statuses[index]||{};
        const vv_id = _id + accountId;
        if(viewed || completed) setViewStatus('completed'+vv_id);
        else if(_id && !viewedMap.current.has(_id)) setViewStatus('running'+vv_id);
        else setViewStatus('completed'+vv_id);
    };
    
    const switchIndex = (type) => {
        setShowInput(false);
        setShowCaption(false);
        const { page, index } = state;
        if(type === 'right') {
            if(index + 1 >= status[page]?.statuses?.length) {
                if(page + 1 >= status.length) {
                    if(timerRef.current) clearInterval(timerRef.current);
                    closeStatusView();
                } else {
                    const nxtStatus = status[page + 1];
                    setAccountId(nxtStatus.account._id);
                    setState({ view: nxtStatus, page: page + 1, index: nxtStatus?.viewed||0 });
                    checkRunning(page + 1, nxtStatus?.viewed||0);
                }    
            } else {
                setState({ ...state, index: index + 1 });
                checkRunning(page, index + 1);
            }
        } else {
            if(!(status[page]?.statuses||[])[index - 1]) {
                if(page - 1 < 0 || !status[page - 1]) {
                    if(timerRef.current) clearInterval(timerRef.current);
                    closeStatusView();
                } else {
                    const prevStatus = status[page - 1];
                    setAccountId(prevStatus.account._id);
                    setState({ view: prevStatus, page: page - 1, index: 0 });
                    checkRunning(page - 1, 0);
                }
            } else {
                setState({ ...state, index: index - 1 });
                checkRunning(page, index - 1);
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
            setStatus('leaveView', viewedMap.current);
            window.removeEventListener('resize', resize);
        }
    }, []);
    
    return (
        <div className='Status__View' id='status-view'>
            {(state.view?.statuses||[])[state.index] && 
            <div className='status__View'>

                <div className='sVW__controls left' 
                onClick={() => closeStatusView()}>
                    <ArrowLeftIcon className={'sVW__controls_icon'} />
                </div>
                <div className='sVW__controls right'
                onClick={() => navigate('/app/chats')}>
                    <CloseIcon className={'sVW__controls_icon'} />
                </div>

                {state.page !== null && <div className='sVW__controls arrow left' 
                onClick={() => switchIndex('left')}>
                    <MdKeyboardArrowLeft className='sVW__controls_icon' />
                </div>}

                {(!viewStatus?.startsWith('running')) && 
                <div className='sVW__controls arrow right' 
                onClick={() => switchIndex('right')}>
                    <MdKeyboardArrowRight className='sVW__controls_icon' />
                </div>}

                <div className='status__View__Wrapper'>
                    <header>

                        <Reel data={state.view.statuses} index={state.index} 
                        setFinished={setTime} viewStatus={viewStatus} 
                        stopRef={stopRef} stopperRef={stopperRef} timerRef={timerRef} />

                        <div className='status__View__User'>
                            <div className='svU__Image'>
                                <img src={state.view.account.img||defaultImage} alt='status' />
                            </div>
                            <div className='svU-texts'>
                                <span className='svut-top'>
                                    {contactName(state.view.account._id, contacts) ||
                                    state.view.account.userName}
                                </span>
                                <span className='svut-base'>
                                    {formatDateTimeFromDate(
                                        state.view.statuses[state.index].createdAt
                                    )}
                                </span>
                            </div>
                        </div>
                    </header>
                    <main>
                        <div className='status__View__Main'>
                            <StatusContent setter={setter} socket={socket} 
                            stopRef={stopRef} viewStatus={viewStatus}
                            data={state.view.statuses[state.index]} />
                        </div>
                    </main>
                    <footer>
                        {!showInput && <div className='status_view_footer_plain'>
                            <div onClick={() => setShowInput(true)}>
                                <MdKeyboardArrowUp className='svfp_icon' />
                                <span className='svfp_span'>Reply</span>
                            </div>

                            {state.view.statuses[state.index].caption && <div className='svfp_caption'
                            onClick={() => setShowCaption(true)}>
                                <MdKeyboardArrowUp className='svfp_icon' />
                                <span className='svfp_span'>Caption</span>
                            </div>}
                        </div>}
                        {showInput && <div className='status_view_footer'>
                            <StatusFooterInput  data={state.view.statuses[state.index]}
                            account={state.view.account} socket={socket}
                            close={() => setShowInput(false)}  />
                        </div>}
                    </footer>
                </div>
            </div>}

            <span>
                <CaptionModal showModal={showCaption ? 'show' : ''}
                closeModal={() => setShowCaption(false)} width={offsetWidth}
                caption={state.view.statuses[state.index].caption} />
            </span>

        </div>
    )
};

export default StatusView;