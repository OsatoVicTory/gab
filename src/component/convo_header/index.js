import { useState } from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import { formatDateTimeFromDate } from '../../utils/formatters';
import UserImage from '../ProfileImage/userImage';
import './styles.css';
import { useNavigate } from 'react-router-dom';
import { FaEllipsisV } from 'react-icons/fa';
import { AiOutlineSearch } from 'react-icons/ai';
import { 
    MdOutlineDelete, MdArrowBack, 
    MdOutlineKeyboardArrowDown, MdOutlineKeyboardArrowUp 
} from 'react-icons/md';
import LoadingSpinner from '../loading/loading';
import { useSelector } from 'react-redux';
import { contactName } from '../../utils/chats_previous';

const ConvoHeader = ({ 
    account, checked, checkedRef, setCheckedRef, 
    backFunc, setSearch, searchWord, deleteSelectedMessage
}) => {

    const navigate = useNavigate();
    const { contacts } = useSelector(state => state.user);
    const [showInput, setShowInput] = useState(false);
    const [searchLoading, setSearchLoading] = useState(false);
    const goToProfile = () => {
        if(account.groupName) navigate(`/app/chats/group-profile/${account._id}`);
        else navigate(`/app/chats/profile/${account._id}`, {
            state: { ...account }
        });
    };
    const handleGo = (type) => {
        setSearchLoading(type);
        searchWord(type, setSearchLoading);
    }

    return (
        <header className='convo_header std-bg'>
            {(!checkedRef && showInput) && <div className='ch-container'>
                <div className='ch-search'>
                    <div className='ch-search-left'>
                        <input placeholder='Search message' 
                        onChange={(e) => setSearch(e.target.value)} />
                    </div>
                    <div className='ch-search-icons'>
                        <div className='csr-icons' onClick={() => handleGo('up')}>
                            {searchLoading === 'up' && 
                            <LoadingSpinner width={'18px'} height={'18px'} />}
                            {searchLoading !== 'up' && 
                            <MdOutlineKeyboardArrowUp className='csr-icon' />}
                        </div>
                        <div className='csr-icons' onClick={() => handleGo('down')}>
                            {searchLoading === 'down' && 
                            <LoadingSpinner width={'18px'} height={'18px'} />}
                            {searchLoading !== 'down' && 
                            <MdOutlineKeyboardArrowDown className='csr-icon' />}
                        </div>
                        <div className='csr-icons' onClick={() => {
                            setShowInput(false);
                            setSearch(null);
                        }}>
                            <AiOutlineClose className='csr-icon' />
                        </div>
                    </div>
                </div>
            </div>}
            {(!checkedRef && !showInput) && <div className='ch-container'>
                <div className='ch-left'>
                    <div className='ch-arrow-left' onClick={() => backFunc()}>
                        <MdArrowBack className='ch-icon'/>
                    </div>
                    <div className='ch-image' onClick={()=> goToProfile()}>
                        <UserImage img={account.img} />
                    </div>
                    <div className='ch-text' onClick={()=> goToProfile()}>
                        <div className='ch-txt-wrap'>
                            <span className='fnt-400 bold ch-user'>
                                {account.groupName ? account.groupName : 
                                contactName(account._id, account.userName, contacts)}
                            </span>
                        </div>
                        <div className='ch-txt-wrap'>
                            <span className='fnt-300 ch-small'>
                                {account.userName ?
                                    account.lastSeen === 'online' ?
                                        `online` :
                                        !account?.lastSeen ? '' :
                                        `Last seen ${formatDateTimeFromDate(account.lastSeen)}`
                                    :
                                    (account?.participants||[]).map(p => (
                                        contactName(p.userId, p.userName, contacts)
                                    )).join(', ')
                                }
                            </span>
                        </div>
                    </div>
                </div>
                <div className='ch-icons'>
                    <div className='ch-icons-s' onClick={() => setShowInput(true)}>
                        <AiOutlineSearch className='csr-icon' />
                    </div>
                </div>
            </div>}
            {checkedRef && <div className='ch-container'>
                <div className='ch-left'>
                    <span className='fnt-500'>{checked.length} Selected</span>
                </div>
                <div className='ch-icons'>
                    <div onClick={() => setCheckedRef(false)}>
                        <AiOutlineClose className='ch-icon len' />
                    </div>
                    {checked.length > 0 && <div onClick={deleteSelectedMessage}>
                        <MdOutlineDelete className='ch-icon' style={{marginLeft:'10px'}} />
                    </div>}
                </div>
            </div>}
        </header>
    )
}

export default ConvoHeader;