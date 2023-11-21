import React, { useState, useEffect, useRef } from 'react';
import './search.css';
import defaultImage from '../../images/avatar.png';
import LoadingSpinner from '../../component/loading/loading';
import { findUser, recommendUsers } from '../../services/user';
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { contactName } from '../../utils/Chat';
import { bindActionCreators } from "redux";
import { setStatusMessageData } from "../../store/actions";
import { responseMessage } from '../../utils/others';
// import ErrorPage from '../../component/ErrorPage';
import { CloseIcon, Search } from '../../component/Icons';
import TextWithEmoji from '../../component/TextWithEmoji';
import useClickOutside from '../../hooks/useClickOutside';

const SearchUser = ({ closeModal }) => {

    const modalRef = useRef();
    const [searchLoading, setSearchLoading] = useState(false);
    const [userData, setUserData] = useState({});
    const [error, setError] = useState(false);
    const [recommend, setRecommend] = useState([]);
    const [recommendLoading, setRecommendLoading] = useState(false);
    const { contacts } = useSelector(state => state.user);
    const [search, setSearch] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const setStatusMessage = bindActionCreators(setStatusMessageData, dispatch);
    const handleSearchChange = (e) => setSearch(e.target.value);

    const fetchRecommendedUsers = () => {
        recommendUsers().then(res => {
            setRecommend(res.data.users);
            setRecommendLoading(false);
        }).catch(err => {
            responseMessage('error', setStatusMessage, err);
            setError(true);
        });
    };

    const fetchUser = () => {
        findUser(search).then(res => {
            setUserData(res.data.user);
            setSearchLoading(false);
        }).catch(err => {
            responseMessage('error', setStatusMessage, err);
            setError(true);
        });
    };

    const handleSearchUser = () => {
        if(searchLoading) return;
        setSearchLoading(true);
        fetchUser();
    }

    const startConvo = (val) => {
        navigate(`/app/chats/direct_chat/${val?._id||userData._id}`, 
            { state: { account: val||userData, messages: [],
            unreadMessages: 0, unReads: 0 } } 
        );
        closeModal();
    }

    const reLoading = () => {
        setError(false);
        if(recommendLoading) fetchRecommendedUsers();
        else fetchUser();
    }
    
    useEffect(() => {
        setRecommendLoading(true);
        fetchRecommendedUsers();
    }, []);

    useClickOutside(modalRef, () => closeModal());

    return (
        <div className='SearchModal' ref={modalRef}>
            <header>
                <div className='sM_header_top'>
                    <span className='sm_text'>Search Users</span>
                    <div className='sm_close' onClick={() => closeModal()}>
                        <CloseIcon className={'smhs_icon'} />
                    </div>
                </div>
                <div className='sM_header_search'>
                    <div className='smhs'>
                        <input placeholder='Search' onChange={handleSearchChange} />
                        <div className='smhs_search' onClick={handleSearchUser}>
                            <Search className={'smhs_icon'} />
                        </div>
                    </div>
                </div>
            </header>
            <main>
                <div className='searched'>
                    <span className='st_title'>Searched Users</span>
                    {searchLoading && <div className='s_loading'>
                        <LoadingSpinner width={'20px'} height={'20px'} />
                    </div>}
                    {(!searchLoading && userData?.phoneNumber) && <div className='recommended'>
                        <div className='search_lists'>
                            <div className='search_list' onClick={() => startConvo(userData)}>
                                <img src={userData.img||defaultImage} alt='dp' />
                                <div className='search_text'>
                                    <span className='txt-17 sl-17'>
                                        {contactName(userData._id, contacts) ||
                                        userData.phoneNumber}
                                    </span>
                                    <TextWithEmoji text={userData?.about||''} CLX={'txt-14 rt-14'}
                                    clx={'txt-14'} font={15} search={null} />
                                </div>
                            </div>
                        </div>
                    </div>}
                </div>
                <div className='recommended'>
                    <span className='st_title'>Recommended Users</span>
                    {recommendLoading && <div className='s_loading'>
                        <LoadingSpinner width={'20px'} height={'20px'} />
                    </div>}
                    {!recommendLoading && <div className='recommended'>
                        <div className='search_lists'>
                            {recommend.map((val, idx) => (
                                <div className='search_list' key={`rec-${idx}`}
                                onClick={() => startConvo(val)}>
                                    <img src={val.img||defaultImage} alt='dp' />
                                    <div className='search_text'>
                                        <span className='txt-17 sl-17'>
                                            {contactName(val._id, contacts) ||
                                            val.phoneNumber}
                                        </span>
                                        <TextWithEmoji text={val?.about||''} CLX={'txt-14 rt-14'}
                                        clx={'txt-14'} font={15} search={null} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>}
                </div>
            </main>
        </div>
    );
}

export default SearchUser;