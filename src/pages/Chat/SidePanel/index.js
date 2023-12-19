import { useState, useEffect } from 'react';
import './styles.css';
import avatar from '../../../images/avatar.png';
import { 
    Ellipsis, Status, Search, DropDownIcon, AtIcon,
    PinIcon, 
    MessageIcon
} from '../../../component/Icons';
// import TextWithEmoji from '../../../component/TextWithEmoji';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { bindActionCreators } from "redux";
import { 
    setModalData, setChatsData, setFixedStatusData 
} from "../../../store/actions";
import { contactName } from '../../../utils/Chat';
import SidePanelModal from '../../../modals/EndoModals/sidepanel';
import { getModalPositions } from '../../../utils/modal';
import { MessageComponent } from '../../../utils/side';
import { formatDay_TimeFromDate } from '../../../utils/formatters';

const ChatSidePanel = () => {

    const id = window.location.pathname.split('/')[4];
    const user = useSelector(state => state.user);
    const Chats = (useSelector(state => state.chats));
    const chats = Chats.data;
    const total = Chats.totalUnreadMessages;
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const [pos, setPos] = useState(chats.map(ch => ch.pos));
    const [modal, setModal] = useState(null);
    const setter = bindActionCreators(setModalData, dispatch);
    const setChats = bindActionCreators(setChatsData, dispatch);
    const { mine, data, newStatus, tracker } = useSelector(state => state.status);
    const setFixedStatus = bindActionCreators(setFixedStatusData, dispatch);

    const startConvo = (_id) => {
        if(id) setChats('leavingPage', id);
        setChats('openedChat', _id);
        navigate(`/app/chats/direct_chat/${_id}`);
    };

    const handleInputChange = (e) => {
        setSearch(e.target.value);
    };
    
    const filterChats = () => {
        const ps = [];
        let fnd = 0;
        const srch = search.toLowerCase();
        for(let i = 0; i < chats.length; i++) {
            const { phoneNumber, _id } = chats[i].account;
            const userName = ((contactName(_id, user.contacts)) || chats[i].account.userName)
            if(userName.toLowerCase().includes(srch) ||
            phoneNumber.includes(srch)) ps[i] = fnd++;
        }
        for(let i = 0; i < chats.length; i++) {
            const { phoneNumber, _id } = chats[i].account;
            const userName = ((contactName(_id, user.contacts)) || chats[i].account.userName)
            if(!userName.toLowerCase().includes(srch) ||
            !phoneNumber.includes(srch)) ps[i] = fnd++;
        }
        setPos(ps);
    }
    useEffect(() => { filterChats(); }, [search]);

    useEffect(() => { setPos(chats.map(ch => ch.pos)); }, [chats.length]);

    useEffect(() => {
        const mp = [];
        for(let i = 0; i < data.length; i++) {
            if(data[i].completed) mp.push(data[i].account._id);
        }
        setChats('updateStatus', mp);
    }, [tracker]);

    const showModal = (type) => { setter(type); };
    const transY = (index) => search ? pos[index] * 80 : chats[index].pos * 80;

    const modalClick = (e, data = '') => {
        const pos = getModalPositions(e.target, 240, !data ? 90 : 200, true);
        setModal({ pos, data });
    };

    const profileClick = (_id, hasStatus) => {
        if(hasStatus) {
            for(let st = 0; st < data.length; st++) {
                if(data[st].account._id === _id) {
                    const { statuses } = data[st];
                    for(let s = 0; s < statuses.length; s++) {
                        if(!statuses[s].viewed) {
                            return setFixedStatus({ 
                                type: 'status-view', index: s, 
                                view: statuses, account: data[st].account 
                            });
                        } 
                    }
                    break;
                }
            }
        }
        setChats('hasStatus', _id, false);
        return navigate(`/app/chats/profile/${_id}`);
    };

    useEffect(() => {
        if(total > 0) document.title = `Gab (${total > 99 ? '99+' : total})`;
        else document.title = 'Gab';
    }, [total]);


    return (
        <aside className='chatSidePanel'>
            <header>
                <div className='csp-header'>
                    <div className='csp-header-left' 
                    onClick={() => navigate('/app/chats/profile/me')}
                    style={{cursor: 'pointer'}}>
                        {/* {total > 0 && <div className='unread-count'>{total}</div>} */}
                        <img src={user?.img||avatar} alt='user' />
                    </div>
                    <div className='csp-header-right'>
                        <div className='csphr' onClick={() => navigate('/app/status')}>
                            <Status className={'csp-header-icon'} newUpdates={newStatus} />
                        </div>
                        <div className='csphr' onClick={(e) => modalClick(e)}>
                            <Ellipsis className={'csp-header-icon'} />
                        </div>
                    </div>
                </div>
            </header>
            <section>
                <div className='csp-search'>
                    <Search className={'csp-search-icon'} />
                    <input placeholder='Search or start new chat'
                    onChange={handleInputChange} className='txt-14' />
                </div>
            </section>
            <main>
                <div className='csp-main'>
                    <div className='csp-main__ hide_scroll_bar'>
                        <div className='csp-main-lists' 
                        style={{height: (80 * chats.length)+'px'}}>
                            {chats.map((val, idx) => (
                                <div className='csp-main-list'
                                style={{transform: `translateY(${transY(idx)}px)`}}
                                key={`chats-${idx}`}>
                                    <div className={`cspm-pic ${val.hasStatus}`}
                                    onClick={() => profileClick(val.account._id, val.hasStatus)}>
                                        <img src={val.account.img||avatar} alt='user-profile' />
                                    </div>
                                    <div className='cspm-texts'
                                    onClick={() => startConvo(val.account._id)}>
                                        <div className='cspm-texts-top'>
                                            <span className='txt-17 cspm-17'>
                                                {contactName(val.account._id, user.contacts) ||
                                                val.account.phoneNumber}
                                            </span>

                                            <div className='cspmtt'>
                                                {val.messages.length > 0 && 
                                                <span className='txt-13 greytext'>
                                                    {formatDay_TimeFromDate(
                                                        val.messages[val.messages.length - 1]?.createdAt
                                                    )||''}
                                                </span>}
                                                <div className='cspmt-dropdown' 
                                                onClick={(e) => modalClick(e, val.account)}>
                                                    <DropDownIcon className={'cspmt-icon dd'} />
                                                </div>
                                            </div>
                                        </div>
                                        <div className='cspm-texts-base'>
                                            {val.isTyping && 
                                            <div className='cspm-message'>
                                                <span className={'txt-14 cspm-14 green'}>
                                                    typing...
                                                </span>
                                            </div>}

                                            {(!val.isTyping && val.messages.length > 0) && 
                                            <MessageComponent 
                                            msg={val.messages[val.messages.length - 1]} />}

                                            <div className='cspmtb'>
                                                {/* <AtIcon className={'cspmt-icon green'} /> */}
                                                {val.unreadMessages > 0 && 
                                                <div className='unread-count'>
                                                    {val.unreadMessages}
                                                </div>}
                                                {(val.pinned && !search) &&
                                                <PinIcon className={'cspmt-icon'} />}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
            <footer className='csp-footer'>
                <div className='csp-footer-div' onClick={() => showModal('search-user')}>
                    <Search className={'csp-footer-div-icon'} />
                </div>
                <div className='csp-footer-div' onClick={() => showModal('contacts')}>
                    <MessageIcon className={'csp-footer-div-icon'} />
                </div>
            </footer>

            <span>{modal?.pos && <SidePanelModal pos={modal.pos} 
            data={modal.data} contacts={user.contacts} 
            closeModal={() => setModal(null)} />}</span>

        </aside>
    );
}

export default ChatSidePanel;