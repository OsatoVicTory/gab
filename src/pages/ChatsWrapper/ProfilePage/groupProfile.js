import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useScrollDetector from '../../../hooks/useScrollDetector';
import defaultImage from '../../../images/avatar.png';
import { MdArrowBack, MdCall, MdOutlineArrowForwardIos } from 'react-icons/md';
// import { FaEllipsisV } from 'react-icons/fa';
import { BiSolidMessageAltDetail } from 'react-icons/bi';
// import { BsCameraVideoFill } from 'react-icons/bs';
import { AiFillEdit } from 'react-icons/ai';
import './profile.css';
import { useSelector, useDispatch } from 'react-redux';
import UserImage from '../../../component/ProfileImage/userImage';
import { formatDateTimeFromDate } from '../../../utils/formatters';
import NoData from '../../../component/NoData';
import { 
    setEditGroupData, setModalData, setGroupsData,
    setFixedImagesData, setModalMessageData, setStatusMessageData 
} from '../../../store/actions';
import { contactName } from '../../../utils/chats';
import EditParticipant from '../../../modals/EndoModals/editParticipant';
import { bindActionCreators } from 'redux';
import { getImages } from '../../../utils/helpers';
import ProfileImages from './images';
import LoadingSpinner from '../../../component/loading/loading';
import OptimizedImage from '../../../component/OptimizedImage';
import { MdKeyboardArrowRight } from 'react-icons/md';
import { responseMessage } from '../../../utils/others';
import { exitGroup } from '../../../services/group';

const GroupProfile = ({ socket }) => {

    const [makeFixed, setMakeFixed] = useState(false);
    const dispatch = useDispatch();
    const setGroup = bindActionCreators(setEditGroupData, dispatch);
    const setModal = bindActionCreators(setModalData, dispatch);
    const groupProfileRef = useRef(null);
    const navigate = useNavigate();
    const { id } = useParams();
    const user = useSelector(state => state.user);
    const { data } = useSelector(state => state.groups);
    const acct = data.find(({ account }) => account._id === id)?.account;
    const [acc, setAcct] = useState(acct);
    const [showAll, setShowAll] = useState(false);
    // const [edit, setEdit] = useState(false);
    const [editParticipants, setEditParticipants] = useState(null);
    const [editRef, setEditRef] = useState(null);
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [exitLoading, setExitLoading] = useState(false);
    const [showImages, setShowImages] = useState(false);
    const setGroups = bindActionCreators(setGroupsData, dispatch);
    const setFixedImages = bindActionCreators(setFixedImagesData, dispatch);
    const setModalMessage = bindActionCreators(setModalMessageData, dispatch);
    const setStatusMessage = bindActionCreators(setStatusMessageData, dispatch);

    const dispatchImage = (index) => {
        setFixedImages({
            type: 'image',
            index: index,
            images,
        })
    }

    useScrollDetector(70, (res) => setMakeFixed(res));

    useEffect(() => {
        // if no data fetch from api
        // run this function to get all images in messages
        getImages(
            {groupId:acct._id, img:null}, 
            null, data, setImages, 
            (idx) => null
        );
        setLoading(false);
    }, []);

    const isAdmin = () => {
        if(acct.participants.find(p => p.userId === user._id && p.admin)) return true;
        return false;
    }
    const activate = (e, val) => {
        if(!isAdmin()) return navigate(`/app/chats/direct-chat/${val.userId||val._id}`, {
            state: { account: {...val}, messages: [], unReads: 0, unreadMessages: 0 }
        });
        setEditRef(e?.target);
        const userId = val.userId||val._id;
        setEditParticipants({...val,userId,groupId:id});
    }
    // no need for add participants as this can be done in edit-group exomodal
    const editGroup = () => {
        setModal('edit-group');
        setGroup(acct);
    }
    const shareGroupLink = () => {
        setModal('share');
        setModalMessage({ contentId: id, link: 'Group invite', link_text: acct.groupName });
    }
    const filterData = (data) => {
        let res = [0];
        for(let i = 0; i < data.length; i++) {
            if(data[i].userId === user._id) res[0] = data[i];
            else res.push(data[i]);
        }
        return showAll ? res : res.slice(0, 10);
    };

    const exitGroupFn = () => {
        if(exitLoading) return alert('Currently sending request to exit');
        setExitLoading(true);
        exitGroup(id).then(res => {
            const account_id = id;
            console.log(res.data, res);
            socket.emit('exitedGroup', { exiter: user._id, 
                groupId: id, message: res.data.messageData
            });
            responseMessage('success', setStatusMessage, res);
            setExitLoading(false);
            navigate(`/app/chats`);
            setGroups('iExitedGroup', account_id);
        }).catch(err => {
            responseMessage('error', setStatusMessage, err);
            setExitLoading(false);
        })
    }

    return (
        <div className='Profile__Wrapper'>
            {!acct && <div className='profile__NoData'>
                <NoData />
            </div>}
            {acct && <div className='Profile__Content' ref={groupProfileRef}>
                <div className={`Profile__Top ${makeFixed}`}>
                    <div className='pt-icons' onClick={() => navigate(-1)}>
                        <MdArrowBack className='pt-icon' />
                    </div>
                    {!makeFixed && <span className='fnt-400'>{'Group Info '}</span>}
                    {makeFixed && <div className='pt__'>
                        {/* <img src={acct?.img} alt='user-profile-img' /> */}
                        <UserImage img={acct?.img} />
                        <span className='profile-medium bold'>{acct.groupName}</span>
                    </div>}
                    {isAdmin() && <div className='pt-icons' onClick={() => {
                        if(!loading) editGroup();
                    }}>
                        {loading && <LoadingSpinner width={'20px'} height={'20px'} />}
                        {!loading && <AiFillEdit className='pt-icon' />}
                    </div>}
                </div>
                <div className='Profile__Main'>
                    <div className='Profile__' id='profile'>
                        <div className='Profile-box one bg-white'>
                            <UserImage img={acct.img} />
                            <h2 className='profile-big'>{acct.groupName}</h2>
                            <span className='fnt-500 profile-medium'>
                                {acct.phoneNumber}
                            </span>
                            <span className='fnt-400 profile-small'>
                                Created {formatDateTimeFromDate(acct.createdAt)}
                            </span>
                            <div className='Profile__Icons'>
                                <div className='profile__Icon'
                                onClick={() => navigate(`/app/chats/group-chat/${id}`)}>
                                    <BiSolidMessageAltDetail className='Profile-icon' />
                                    <span className='fnt-500 profile-medium green'>Chat</span>
                                </div>
                            </div>
                        </div>
                        <div className='Profile-box two bg-white'>
                            <span className='fnt-400 profile-medium'>About</span>
                            <span className='fnt-500 profile-medium black'>
                                {acct.description}
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
                        <div className='Profile-box two bg-white' onClick={shareGroupLink}
                        style={{cursor: 'pointer'}}>
                            <span className='fnt-400 profile-medium'>Group link</span>
                            <span className='fnt-500 profile-medium black'>
                                Share group link
                            </span>
                        </div>
                        <div className='Profile-box two bg-white' onClick={exitGroupFn}
                        style={{cursor: 'pointer'}}>
                            <span className='fnt-400 profile-medium'>Exit and remove Group</span>
                            <span className='fnt-500 profile-medium red'>
                                {exitLoading ? 'Exiting...' : 'Exit group'}
                            </span>
                        </div>
                        <div className='Profile-box four bg-white'>
                            <div className='pb-top'>
                                <span className='profile-medium'>Participants</span>
                                <span className='pb-showall fnt-400 green'
                                onClick={()=>setShowAll(!showAll)}>Show all</span>
                            </div>
                            <div className={`profile-groups`}>
                                {filterData(acct.participants).map((val, idx) => (
                                    <div className='profile-group bg-white' 
                                    key={`profile-group-${idx}`} 
                                    onClick={(e) => activate(e, val)} >
                                        <img src={val.img||defaultImage} alt='profile-group-img' />
                                        <div className={`pg-txts ${val.admin && 'is-admin'}`}>
                                            <span className='fnt-400 profile-medium'>
                                                {contactName(val.userId, val.userName, user.contacts)}
                                            </span>
                                            <span className='fnt-400 profile-small'>
                                                {val.about}
                                            </span>
                                        </div>
                                        {val.admin && <div className='group-page-admin green'>
                                        admin</div>}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {editParticipants && <EditParticipant data={editParticipants} 
                contacts={user.contacts} eleRef={editRef} socket={socket}
                closeModal={() => setEditParticipants(null)} />}

            </div>}

            {showImages && <ProfileImages data={images} 
            closePage={() => setShowImages(false)} />}

        </div>
    );
}

export default GroupProfile;