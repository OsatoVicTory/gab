import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import useScrollDetector from '../../../hooks/useScrollDetector';
import defaultImage from '../../../images/avatar.png';
import { MdArrowBack, MdCall, MdKeyboardArrowRight, MdOutlineArrowForwardIos } from 'react-icons/md';
import { FaEllipsisV } from 'react-icons/fa';
import { BiSolidMessageAltDetail } from 'react-icons/bi';
import { BsCameraVideoFill } from 'react-icons/bs';
import './profile.css';
import { useSelector, useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import { 
    setFixedImagesData, setModalData, 
    setChatsData, setModalMessageData, setStatusMessageData 
} from '../../../store/actions';
import UserImage from '../../../component/ProfileImage/userImage';
import { formatDateTimeFromDate } from '../../../utils/formatters';
import NoData from '../../../component/NoData';
import { getImages, getCommonGroups } from '../../../utils/helpers';
import OptimizedImage from '../../../component/OptimizedImage';
import ProfileImages from './images';
import LoadingSpinner from '../../../component/loading/loading';
import { contactName } from '../../../utils/chats';
import { responseMessage } from '../../../utils/others';
import { blockUser } from '../../../services/user';

const UserProfile = () => {

    const [makeFixed, setMakeFixed] = useState(false);
    const navigate = useNavigate();
    const loc = useLocation();
    const { id } = useParams();
    const user = useSelector(state => state.user);
    const { data } = useSelector(state => state.chats);
    const groups = useSelector(state => state.groups);
    const acct = data.find(({ account }) => account._id === id)?.account||loc.state;
    const [images, setImages] = useState([]);
    const [showImages, setShowImages] = useState(false);
    const [groupsData, setGroupsData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [blockLoading, setBlockLoading] = useState(false);
    const dispatch = useDispatch();
    const setChats = bindActionCreators(setChatsData, dispatch);
    const setFixedImages = bindActionCreators(setFixedImagesData, dispatch);
    const setModalMessage = bindActionCreators(setModalMessageData, dispatch);
    const setModal = bindActionCreators(setModalData, dispatch);
    const setStatusMessage = bindActionCreators(setStatusMessageData, dispatch);

    const dispatchImage = (index) => {
        setFixedImages({
            type: 'image',
            index: index,
            images,
        })
    }

    useScrollDetector(70, (res) => setMakeFixed(res));
    // run this function to get all images
    useEffect(() => {
        // console.log(data);
        if(acct._id) {
            getImages(
                {senderId:acct._id, img:null}, 
                data, null, setImages, 
                (idx) => null
            );
            getCommonGroups(groups.data, user._id, id, setGroupsData);
            setLoading(false);
        }
    }, []);

    const clickContact = () => {
        setModal('add-to-contact');
        setModalMessage({ ...acct });
    };

    const shareContact = () => {
        setModal('share');
        setModalMessage({ contentId: acct._id, link: 'Message user',
            link_text: contactName(acct._id, acct.userName, user.contacts)
        });
    };

    const blockUserFn = () => {
        if(blockLoading) return alert('Current sending request to block user');
        setBlockLoading(true);
        blockUser(id).then(res => {
            responseMessage('success', setStatusMessage, res);
            setChats('blockUser', id);
            setBlockLoading(false);
        }).catch(err => {
            responseMessage('error', setStatusMessage, err);
            setBlockLoading(false);
        })
    }

    return (
        <div className='Profile__Wrapper'>
            {!acct && <div className='profile__NoData'>
                <NoData />
            </div>}
            {acct && <div className='Profile__Content'>
                <div className={`Profile__Top ${makeFixed}`}>
                    <div className='pt-icons' onClick={() => navigate(-1)}>
                        <MdArrowBack className='pt-icon' />
                    </div>
                    {!makeFixed && <span className='fnt-400'>{'Contact Info '}</span>}
                    {makeFixed && <div className='pt__'>
                        {/* <img src={acct?.img} alt='user-profile-img' /> */}
                        <UserImage img={acct?.img} />
                        <span className='profile-medium bold'>
                            {contactName(acct._id, acct.userName, user.contacts)}
                        </span>
                    </div>}
                    <div className='pt-icons'>
                        {loading && <LoadingSpinner width={'20px'} height={'20px'} />}
                        {!loading && <FaEllipsisV className='pt-icon' />}
                    </div>
                </div>
                <div className='Profile__Main'>
                    <div className='Profile__' id='profile'>
                        <div className='Profile-box one bg-white'>
                            <UserImage img={acct.img} />
                            <h2 className='profile-big'>
                                {contactName(acct._id, acct.userName, user.contacts)}
                            </h2>
                            <span className='fnt-500 profile-medium'>
                                {acct.phoneNumber}
                            </span>
                            <span className='fnt-400 profile-small'>
                                {acct.lastSeen === 'online' ? 'online' :
                                `Last seen ${formatDateTimeFromDate(acct.lastSeen)}`}
                            </span>
                            <div className='Profile__Icons'>
                                <div className='profile__Icon'
                                onClick={() => {
                                    navigate(`/app/chats/direct-chat/${id}`, { state: {
                                        account: acct, messages: [], unreadMessages: 0, unReads: 0,
                                    }});
                                }}>
                                    <BiSolidMessageAltDetail className='Profile-icon' />
                                    <span className='fnt-500 profile-medium green'>Message</span>
                                </div>
                                <div className='profile__Icon'>
                                    <MdCall className='Profile-icon' />
                                    <span className='fnt-500 profile-medium green'>Audio</span>
                                </div>
                                <div className='profile__Icon'>
                                    <BsCameraVideoFill className='Profile-icon' />
                                    <span className='fnt-500 profile-medium green'>Video</span>
                                </div>
                            </div>
                        </div>
                        <div className='Profile-box two bg-white' onClick={clickContact}>
                            <span className='fnt-400 profile-medium'>Contact</span>
                            <span className='fnt-500 profile-medium black'>
                                {user.contacts.find(c => c.userId === acct._id) ?
                                'Edit contact' : 'Add to contacts'}
                            </span>
                        </div>
                        <div className='Profile-box two bg-white' onClick={shareContact}>
                            <span className='fnt-400 profile-medium'>Share Contact</span>
                            <span className='fnt-500 profile-medium green'>
                                {contactName(acct._id, acct.userName, user.contacts)}
                            </span>
                        </div>
                        <div className='Profile-box two bg-white' onClick={blockUserFn}>
                            <span className='fnt-400 profile-medium'>Block user</span>
                            <span className='fnt-500 profile-medium red'>
                                {blockLoading ? (acct.isBlocked ? 'UnBlocking...' : 'Blocking...') :
                                `${acct.isBlocked ? 'UnBlock' : 'Block'} ${contactName(acct._id, acct.userName, user.contacts)}`}
                            </span>
                        </div>
                        <div className='Profile-box three bg-white'>
                            <div className='profile-media'>
                                <div className='pm-top'>
                                    <span className='fnt-400 profile-medium'>Media</span>
                                    {images.length > 0 && <div className='pm-count'
                                    onClick={() => setShowImages(true)}>
                                        <span className='fnt-400 profile-medium'>
                                            {images.length}
                                        </span>
                                        <MdOutlineArrowForwardIos className='pm-icon' />
                                    </div>}
                                </div>
                                {images.length > 0 && <div className='pm-images'>
                                    <div className='profile-images__'>
                                        <div className='profile-images'>
                                            {images.slice(0, 15).map((val, idx) => (
                                                <div className='pm-img' key={`pm-img-${idx}`}
                                                onClick={() => dispatchImage(idx)}>
                                                    <OptimizedImage data={val.img} />
                                                </div>
                                            ))}
                                            {images.length > 15 && <div className='pm-img img-arrow'
                                            onClick={() => setShowImages(true)}>
                                                <MdKeyboardArrowRight className='pm-arrow' />
                                            </div>}
                                        </div>
                                    </div>
                                </div>}
                            </div>
                        </div>
                        <div className='Profile-box bg-white'>
                            <span className='fnt-500 profile-medium black'>
                                {acct.about}
                            </span>
                        </div>
                        {groupsData.length > 0 && <div className='Profile-box four bg-white'>
                            <span className='profile-medium'>
                                {groupsData.length} {`Group${groupsData.length>1?'s':''} in common`}
                            </span>
                            <div className='profile-groups'>
                                {groupsData.map((val, idx) => (
                                    <div className='profile-group bg-white' key={`profile-group-${idx}`}
                                    onClick={() => navigate(`/app/chats/group-chat/${val._id}`)}>
                                        <img src={val?.img||defaultImage} alt='profile-group' />
                                        <div className='pg-txts'>
                                            <span className='fnt-400 profile-medium'>
                                                {val.groupName}
                                            </span>
                                            <span className='fnt-400 profile-small'>
                                                {val.participants.map(p => (
                                                    contactName(p.userId, p.userName, user.contacts)
                                                )).join(', ')}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>}
                    </div>
                </div>
            </div>}
            {showImages && <ProfileImages data={images} 
            closePage={() => setShowImages(false)} />}
        </div>
    );
}

export default UserProfile;