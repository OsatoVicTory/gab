import { useState, useCallback, useRef, useEffect } from 'react';
import './header.css';
// import TextWithEmoji from "../TextWithEmoji";
import { ArrowLeftIcon, Search, Ellipsis, CloseIcon, VideoIcon, PhoneIcon } from '../Icons';
import { 
    MdOutlineDelete, MdOutlineKeyboardArrowDown, MdOutlineKeyboardArrowUp 
} from 'react-icons/md';
import LoadingSpinner from '../loading/loading';
import image from '../../images/avatar.png';
import useClickOutside from '../../hooks/useClickOutside';
import { contactName } from '../../utils/Chat';
import { useSelector, useDispatch } from 'react-redux';
import { formatDateTimeFromDate } from '../../utils/formatters';
import { bindActionCreators } from 'redux';
import { setChatsData, setStatusMessageData } from '../../store/actions';
import { responseMessage } from '../../utils/others';
import { deleteDirectMessageForMe } from '../../services/dm';


const Header = ({ 
    searchWord, setSearch, checked, search, goToProfile, setChecked,
    setCheckBox, checkBox, backFnc, deleteSelectedMessage, account 
}) => {

    const [showInput, setShowInput] = useState(false);
    const [searchLoading, setSearchLoading] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const inputRef = useRef();
    const dropDownRef = useRef();
    const { contacts } = useSelector(state => state.user);
    const dispatch = useDispatch();
    const setChats = bindActionCreators(setChatsData, dispatch);
    const setStatusMessage = bindActionCreators(setStatusMessageData, dispatch);
    
    const handleGo = (type) => {
        setSearchLoading(type);
        searchWord(type, setSearchLoading);
    };

    const handleChange = useCallback((e) => {
        setSearch(e.target.value);
        e.target.focus();
    }, []);

    useEffect(() => {
        inputRef.current?.focus();
    }, [search]);

    useClickOutside(dropDownRef, () => setShowDropdown(false));

    function dropDownClick(type) {
        if(type === 'search') setShowInput(true);
        else if(type === 'delete') setCheckBox(true);
        setShowDropdown(false);
    };

    const deleteChat = () => {
        deleteDirectMessageForMe(account._id, { clearAll: true }).then(res => {
            setChats('clearChat', account._id);
            setStatusMessage({ type:'success',
            text:'Chats cleared and would not be visible on next sign in or refresh'});
            setShowDropdown(false);
        }).catch(err => {
            responseMessage('error', setStatusMessage, err);
        });
    };

    const MainComponent = () => {
        return (
            <div className='chat_header'>
                <div className='header_icon_div' style={{border:'none'}}
                onClick={() => backFnc()}>
                    <ArrowLeftIcon className={'header_icon'} />
                </div>
                <div className='header_img' onClick={() => goToProfile()}>
                    <img src={account?.img||image} alt='dp' />
                </div>
                <div className='header_texts' onClick={() => goToProfile()}>
                    <span className='header_userName'>
                        {contactName(account._id, contacts) || account.phoneNumber}
                    </span>
                    <span className='last_seen'>
                        {account.lastSeen === 'online' ? 'online' :
                        `Last seen ${formatDateTimeFromDate(account.lastSeen)}`}
                    </span>
                </div>
                <div className='header_icon_div header_right_icon'>
                    <VideoIcon className={'header_icon'} />
                </div>
                <div className='header_icon_div header_right_icon h_phone_icon'>
                    <PhoneIcon className={'header_icon'} />
                </div>
                <div className='header_icon_div header_right_icon ellipsis' 
                onClick={() => setShowDropdown(!showDropdown)}>
                    <Ellipsis className={'header_icon'} />
                </div>
            </div>
        )
    };

    const SearchComponent = () => {
        return (
            <div className='chat_header_search'>
                <div className='ch_search_input'>
                    <input placeholder='Search message' value={search||''}
                    onChange={handleChange} ref={inputRef} />
                </div>
                <div className='ch-search-icons'>
                    <div className='header_icon_div' onClick={() => handleGo('up')}>
                        {searchLoading === 'up' && 
                        <LoadingSpinner width={'18px'} height={'18px'} />}
                        {searchLoading !== 'up' && 
                        <MdOutlineKeyboardArrowUp className='header_icon' />}
                    </div>
                    <div className='header_icon_div' onClick={() => handleGo('down')}>
                        {searchLoading === 'down' && 
                        <LoadingSpinner width={'18px'} height={'18px'} />}
                        {searchLoading !== 'down' && 
                        <MdOutlineKeyboardArrowDown className='header_icon' />}
                    </div>
                    <div className='header_icon_div' onClick={() => {
                        setShowInput(false);
                        setSearch('');
                    }}>
                        <CloseIcon className={'header_icon'} />
                    </div>
                </div>
            </div>
        )
    };

    const DeleteComponent = () => {
        return (
            <div className='chat_header_delete'>
                <div className='ch_delete_left'>
                    <span className='txt-17'>{checked.length} Selected</span>
                </div>
                <div className='ch_delete_icons'>
                    <div className='header_icon_div' onClick={() => {
                        setCheckBox(false);
                        setChecked([]);
                    }}>
                        <CloseIcon className={'header_icon'} />
                    </div>
                    <div className='header_icon_div' onClick={() => deleteSelectedMessage()}>
                        <MdOutlineDelete className='header_icon' />
                    </div>
                </div>
            </div>
        );
    };

    const DropDownComponent = () => {
        return (
            <div className='header_dropdown' ref={dropDownRef}>
                <div className='hd_div' onClick={() => goToProfile()}>
                    View contact
                </div>
                <div className='hd_div' onClick={() => dropDownClick('search')}>
                    Search message
                </div>
                <div className='hd_div' onClick={() => dropDownClick('delete')}>
                    Delete messages
                </div>
                <div className='hd_div' onClick={deleteChat}>Clear chat</div>
            </div>
        )
    };

    return (
        <div className='Chat__Header'>
            {showInput ? <SearchComponent /> :
            (checkBox ? <DeleteComponent /> : <MainComponent />)}

            {showDropdown && <DropDownComponent />}
        </div>
    )
};

export default Header;