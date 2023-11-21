import { useState, useCallback } from 'react';
import './styles.css';
import { useNavigate } from 'react-router-dom';
import avatar from '../../../images/avatar.png';
import { BiCamera, BiEditAlt } from 'react-icons/bi';
import { Ellipsis, Status, Search, MessageIcon } from '../../../component/Icons';
// import TextWithEmoji from '../../../component/TextWithEmoji';
import { useDispatch, useSelector } from "react-redux";
import { bindActionCreators } from "redux";
import { setModalData, setChatsData } from "../../../store/actions";
import Image from '../../../component/Image';
import { formatDateTimeFromDate } from '../../../utils/formatters';
import { contactName } from '../../../utils/Chat';
import { MdSettings } from 'react-icons/md';

const StatusSidePanel = ({ click }) => {


    const Status = useSelector(state => state.status);
    const user = useSelector(state => state.user);
    const status = Status.data;
    const mine = Status.mine;
    const navigate = useNavigate();
    const dispatch = useDispatch();
    // const [recent, setRecent] = useState(0);
    const setter = bindActionCreators(setModalData, dispatch);

    const showModal = (type) => { setter(type); };
    
    // const filterForRecent = useCallback(() => {
    //     const res = status.filter(val => !val.completed);
    //     setRecent(res.length);
    //     return res;
    // }, [status]);

    // const filterForViewed = useCallback(() => {
    //     return status.filter(val => val.completed);
    // }, [status]);

    return (
        <aside className='chatSidePanel statusPanel'>
            <header>
                <div className='csp-header'>
                    <div className='csp-header-left'>
                        <img src={user.img||avatar} alt='user' />
                    </div>
                    <div className='csp-header-right'>
                        <div className='csphr' onClick={() => navigate('/app/chats')}>
                            <MessageIcon className={'csp-header-icon'} />
                        </div>
                        <div className='csphr' onClick={() => setter('status-settings')}>
                            <MdSettings className={'csp-header-icon'} />
                        </div>
                    </div>
                </div>
            </header>
            <main>
                <div className='csp-main'>
                    <div className='csp-main__ hide_scroll_bar'>

                        <div className='csp-main-lists' 
                        style={{height: ( 120 + (status.length * 80) ) + 'px'}}>

                            {mine.length < 1 && <div className='csp-main-list userCursor' 
                            style={{transform: `translateY(0px)`}} 
                            onClick={() => showModal('status-upload')}>
                                <div className='cspm-pic'>
                                    <img src={user.img||avatar} alt='user' />
                                </div>
                                <div className='cspm-texts'>
                                    <div className='cspm-texts-top'>
                                        <span className='txt-17 cspm-17'>You</span>
                                    </div>
                                    <div className='cspm-texts-base'>
                                        <div className='cspm-message'>
                                            <span className='txt-14 cspm-14'>
                                                Click to create an update
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>}

                            {mine.length > 0 && <div className='csp-main-list' 
                            style={{transform: `translateY(0px)`}}
                            onClick={() => click('mine', 'mine')}>
                                <div className='cspm-pic'>
                                    <Image image={user.img}
                                    len={mine.length} viewed={mine.length} />
                                </div>
                                <div className='cspm-texts'>
                                    <div className='cspm-texts-top'>
                                        <span className='txt-17 cspm-17'>You</span>
                                    </div>
                                    <div className='cspm-texts-base'>
                                        <div className='cspm-message'>
                                            <span className='txt-14 cspm-14'>
                                                {formatDateTimeFromDate(
                                                    mine[mine.length - 1].createdAt
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>}

                            <div className='scp_title'
                            style={{transform: `translateY(80px)`}}>
                                Status updates
                            </div>
                            {status.map((val, idx) => (
                                <div className='csp-main-list'
                                style={{transform: `translateY(${120 + (val.pos * 80)}px)`}}
                                key={`chats-${idx}`} onClick={() => click(val, idx)}>
                                    <div className='cspm-pic'>
                                        <Image image={val.account.img}
                                        len={val.statuses.length} viewed={val.viewed} />
                                    </div>
                                    <div className='cspm-texts'>
                                        <div className='cspm-texts-top'>
                                            <span className='txt-17 cspm-17'>
                                                {contactName(val.account._id, user.contacts) ||
                                                val.account.userName}
                                            </span>
                                        </div>
                                        <div className='cspm-texts-base'>
                                            <div className='cspm-message'>
                                                <span className='txt-14 cspm-14'>
                                                    {formatDateTimeFromDate(
                                                        val.statuses[val.statuses.length - 1]
                                                        .createdAt
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            
                            {/* <div className='scp_title'
                            style={{transform: `translateY(${115 + (recent * 80)}px)`}}>
                                Viewed updates
                            </div>
                            {filterForViewed().map((val, idx) => (
                                <div className='csp-main-list'
                                style={{transform: `translateY(${150 + (val.pos * 80)}px)`}}
                                key={`chats-${idx}`}>
                                    <div className='cspm-pic'>
                                        <Image image={val.account.img}
                                        len={val.statuses.length} viewed={val.viewed} />
                                    </div>
                                    <div className='cspm-texts'>
                                        <div className='cspm-texts-top'>
                                            <span className='txt-17 cspm-17'>
                                            {val.account.userName}</span>
                                        </div>
                                        <div className='cspm-texts-base'>
                                            <div className='cspm-message'>
                                                <span className='txt-14 cspm-14'>
                                                    {formatDateTimeFromDate(
                                                        val.statuses[val.statuses.length - 1]
                                                        .createdAt
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))} */}
                        </div>
                    </div>
                </div>
            </main>
            <footer className='csp-footer'>
                <div className='csp-footer-div' onClick={() => showModal('status-write')}>
                    <BiEditAlt className={'csp-footer-div-icon'} />
                </div>
                <div className='csp-footer-div img-upload' 
                onClick={() => showModal('status-upload')}>
                    <BiCamera className={'csp-footer-div-icon'} />
                </div>
            </footer>
        </aside>
    );
}

export default StatusSidePanel;