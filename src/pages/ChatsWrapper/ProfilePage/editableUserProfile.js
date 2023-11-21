import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useScrollDetector from '../../../hooks/useScrollDetector';
import { MdArrowBack, MdCall, MdOutlineArrowForwardIos } from 'react-icons/md';
import { FaEllipsisV } from 'react-icons/fa';
import { BiSolidMessageAltDetail } from 'react-icons/bi';
import { BsCameraVideoFill, BsFillEmojiSmileFill } from 'react-icons/bs';
import './profile.css';
import { useSelector } from 'react-redux';
import UserImage from '../../../component/ProfileImage/userImage';
import { formatDateTimeFromDate } from '../../../utils/formatters';
import NoData from '../../../component/NoData';
import { AiFillEdit } from 'react-icons/ai';
import LoadingSpinner from '../../../component/loading/loading';
import EmojiModal from '../../../modals/EndoModals/emojiModal';
import { setStatusMessageData, setUserData } from '../../../store/actions';
import { useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import { updateUserAccount } from '../../../services/user';
import { responseMessage } from '../../../utils/others';

const EditableUserProfile = ({ socket }) => {

    const [makeFixed, setMakeFixed] = useState(false);
    const [updateLoading, setUpdateLoading] = useState(false);
    const dispatch = useDispatch();
    const setUser = bindActionCreators(setUserData, dispatch);
    const setStatusMessage = bindActionCreators(setStatusMessageData, dispatch);
    const navigate = useNavigate();
    const { id } = useParams();
    const user = useSelector(state => state.user);
    const [update, setUpdate] = useState({...user});
    const [changed, setChanged] = useState(false);
    const [edit, setEdit] = useState(false);
    const [targetModal, setTargetModal] = useState(null);
    const [modalRef, setModalRef] = useState(null);
    const [cursorPosition, setCursorPosition] = useState();
    const refCurrent = useRef(null);
    const nameRef = useRef(null);
    const aboutRef = useRef(null);

    useScrollDetector(90, (res) => setMakeFixed(res));
    useEffect(() => {
        if(update.userName!==user.userName || update.about!==user.about || update.img!==user.img) {
            setChanged(true);
        }
    }, [update.userName, update.img, update.about]);

    const activate = (e, name) => {
        if(targetModal === name) return setTargetModal(null);
        if(name==='userName') refCurrent.current = nameRef.current;
        else refCurrent.current = aboutRef.current;
        setCursorPosition(refCurrent.current.selectionStart);
        setModalRef(e?.target);
        setTargetModal(name);
    }
    const handleChange = (e) => {
        setUpdate({ ...update, [e.target.name]: e.target.value });
    }

    const handleUpdate = () => {
        if(!update['userName']) {
            return setStatusMessage({type:'error',text:'Fill userName field'});
        }
        if(updateLoading) return;
        setUpdateLoading(true);
        let formData = new FormData();
        formData.append('userName', update.userName);
        formData.append('about', update.about);
        formData.append('cloudinary_id', update.cloudinary_id);
        if(typeof update.img === 'object') formData.append('file', update.img);
        else formData.append('img', update.img);
        
        const sendUpdate = async () => {
            try {
                const res = await updateUserAccount(formData);
                socket.emit('updateAccount', { ...res.data.user });
                setUser({ ...res.data.user });
                const img = update.img;
                setUpdate({ ...res.data.user });
                if(typeof img === 'object') URL.revokeObjectURL(img);
                responseMessage('success', setStatusMessage, res);
            } catch (err) {
                responseMessage('error', setStatusMessage, err);
                setUpdateLoading(false);
            }
        }
        sendUpdate();
    };

    return (
        <div className='Profile__Wrapper'>
            {!user && <div className='profile__NoData'>
                <NoData />
            </div>}
            {user && <div className='Profile__Content'>
                <div className={`Profile__Top ${makeFixed}`}>
                    <div className='pt-icons' onClick={() => navigate(-1)}>
                        <MdArrowBack className='pt-icon' />
                    </div>
                    {!makeFixed && <span className='fnt-400'>{' You '}</span>}
                    {makeFixed && <div className='pt__'>
                        <UserImage img={user?.img} />
                        <span className='profile-medium bold'>{user.userName}</span>
                    </div>}
                    <div className='pt-icons' onClick={() => setEdit(prev => !prev)}>
                        <AiFillEdit className='pt-icon' />
                    </div>
                </div>
                <div className='Profile__Main'>
                    <div className='Profile__' id='profile'>
                        <div className='Profile-box one bg-white'>
                            <div className='image-edit'>
                                <img src={(update?.img && typeof update?.img === 'object') ? 
                                URL.createObjectURL(update.img) : update.img} />
                                <label className='ie-abs' htmlFor='ie-input'>
                                    <AiFillEdit className='ie-icon' />
                                </label>
                                <input type='file' id='ie-icon'
                                onChange={(e) => {
                                    const img = update.img;
                                    setUpdate({
                                        ...update,
                                        img: e.target.files[0]
                                    });
                                    if(img && typeof img === 'object') URL.revokeObjectURL(img);
                                }} />
                            </div>
                            <h2 className='profile-big'>{user.userName}</h2>
                            <span className='fnt-500 profile-medium'>
                                {user.phoneNumber}
                            </span>
                            <span className='fnt-400 profile-small'>
                                Last seen {formatDateTimeFromDate(user.lastSeen)}
                            </span>
                        </div>
                        <div className='Profile-box two bg-white'>
                            <span className='fnt-400 profile-medium'>About</span>
                            <span className='fnt-500 profile-medium black'>
                                {user.about}
                            </span>
                        </div>
                        {edit && <div className='Profile-box three bg-white'>
                            <div className='profile-edit'>
                                <div className='profile-input'>
                                    <input placeholder='Enter username' name='userName' 
                                    id='profile-input-userName' ref={nameRef}
                                    value={update.userName||''} onChange={handleChange} />
                                    <div className='profile-edit-emoji'>
                                        <BsFillEmojiSmileFill className='profile-input-emoji' 
                                        onClick={(e) => activate(e, 'userName')} />
                                    </div>
                                </div>
                            </div>
                            <div className='profile-edit'>
                                <div className='profile-input'>
                                    <input placeholder='Enter about' name='about' 
                                    id='profile-input-about' ref={aboutRef}
                                    value={update.about||''} onChange={handleChange} />
                                    <div className='profile-edit-emoji'>
                                        <BsFillEmojiSmileFill className='profile-input-emoji' 
                                        onClick={(e) => activate(e, 'about')} />
                                    </div>
                                </div>
                            </div>
                        </div>}
                        {(changed && edit) && <div className='Profile-box update'>
                            <div className='pb-update' onClick={handleUpdate}>
                                {!updateLoading && <span className='fnt-500 bold white'>Update</span>}
                                {updateLoading && <LoadingSpinner width={'15px'} height={'15px'} />}
                            </div>
                        </div>}
                    </div>
                </div>
                {targetModal && 
                    <EmojiModal eleRef={modalRef} targetModal={targetModal}
                    refCurrent={refCurrent}
                    closeModal={() => setTargetModal(null)} setUpdate={setUpdate}
                    update={update} cursorPosition={cursorPosition}
                    setCursorPosition={setCursorPosition} />
                }
            </div>}
        </div>
    );
}

export default EditableUserProfile;