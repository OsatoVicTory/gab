import { useState, useEffect } from 'react';
import './styles.css';
import { BiBlock } from 'react-icons/bi';
import defaultImage from '../../../images/avatar.png';
import { ArrowLeftIcon, MessageIcon, CloseIcon } from '../../../component/Icons';
import { MdKeyboardArrowRight } from 'react-icons/md';
// import { VideoIcon } from '../../../component/Icons';
// import { AiFillPhone } from 'react-icons/ai';
import { useSelector, useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import { 
    setFixedImagesData, setModalData, setFixedCallsData,
    setChatsData, setModalMessageData, setStatusMessageData 
} from '../../../store/actions';
import OptimizedImage from '../../../component/OptimizedImage';
import { blockUser } from '../../../services/user';
import { responseMessage } from '../../../utils/others';
import { formatDateTimeFromDate, formatDay_TimeFromDate } from '../../../utils/formatters';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import ProfileImages from './images';
import { getImages } from '../../../utils/helpers';
import useScrollDetector from '../../../hooks/useScrollDetector';
import LoadingSpinner from '../../../component/loading/loading';
import TextWithEmoji from '../../../component/TextWithEmoji';
import NoData from '../../../component/NoData';

const ProfilePage = () => {

    const [images, setImages] = useState([]);
    const [fixed, setFixed] = useState(false);
    const [showImages, setShowImages] = useState(false);
    const [blockLoading, setBlockLoading] = useState(false);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const loc = useLocation();
    const { data } = useSelector(state => state.chats);
    const acct = data.find(({ account }) => account._id === id)?.account||loc?.state;
    const { contacts, _id } = useSelector(state => state.user);
    const setChats = bindActionCreators(setChatsData, dispatch);
    const setFixedImages = bindActionCreators(setFixedImagesData, dispatch);
    const setModalMessage = bindActionCreators(setModalMessageData, dispatch);
    const setModal = bindActionCreators(setModalData, dispatch);
    const setStatusMessage = bindActionCreators(setStatusMessageData, dispatch);
    const setFixedCalls = bindActionCreators(setFixedCallsData, dispatch);
    const contact_name = contacts.find(ct => ct.userId === acct._id)?.userName || acct.userName;

    useScrollDetector(70, (res) => setFixed(res));
    // run this function to get all images
    useEffect(() => {
        let timeoutId;
        if(acct._id) {
            setLoading(true);
            getImages(
                {senderId:acct._id, img:null}, 
                data, setImages, (idx) => null
            );
            timeoutId = setTimeout(() => setLoading(false), 300);
        }
        return () => clearTimeout(timeoutId);
    }, [id]);

    const clickContact = () => {
        setModal('add-to-contact');
        setModalMessage({ ...acct });
    };

    const dispatchImage = (index) => {
        setFixedImages({
            type: 'image',
            index: index,
            images,
        })
    };

    const shareContact = () => {
        setModal('share');
        setModalMessage({ contentId: acct._id, 
            link: `Message~/app/chats/direct_chat/${id}~${id}`,
            link_text: contact_name, images: []
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
    };

    const startCall = (type) => {
        setFixedCalls({
            type, callerId: _id, receiverId: id,
            receiverName: contact_name, image: acct.img
        });
    };

    return (
        <div className='Profile__Page'>
        {!acct?._id && <NoData />}
        {acct?._id && <div className='profile__Page__Wrapper hide_scroll_bar' id='profile'>
            <div className='profile__Page__Content'>
                <div className={`profile_top ${fixed}`}>
                    <div onClick={() => navigate(-1)}>
                        <ArrowLeftIcon className={'profile_top_icon'} />
                    </div>
                    <span className='profile_txt_big'>{contact_name}</span>
                    <div onClick={() => {
                        if(!loading) navigate(`/app/chat`);
                    }}>
                        {!loading && <CloseIcon className={'profile_top_icon'} />}
                        {loading && <LoadingSpinner width={'15px'} height={'15px'} />}
                    </div>
                </div>
                <div className='Profile remote'>
                    <div className='Profile_Images'>
                        <img src={acct.img||defaultImage} alt='profile' />
                    </div>

                    <TextWithEmoji text={contact_name}
                    CLX={'profile_txt_xl p_txt_userName'} font={15}  
                    search={null} clx={'profile_txt_big_inner'} />

                    <span className='profile_txt_big'>{acct.phoneNumber}</span>
                    <span className='profile_txt_small'>
                        {acct.lastSeen === 'online' ? 'online' :
                        `Last seen ${formatDateTimeFromDate(acct.lastSeen)}`}
                    </span>
                    <div className='profile_icons'>
                        <div className='profile_page_icon_div'
                        onClick={() => navigate(`/app/chats/direct_chat/${acct._id}`, {
                            state: { account: acct, messages: [], 
                            unReads: 0, unreadMessages: 0 }
                        })}>
                            <MessageIcon className='ppid_icon' />
                            <span className='profile_txt_big'>Message</span>
                        </div>
                        {/* <div className='profile_page_icon_div'
                        onClick={() => startCall('audio')}>
                            <AiFillPhone className='ppid_icon p_phone' />
                            <span className='profile_txt_big'>Voice</span>
                        </div>
                        <div className='profile_page_icon_div video'
                        onClick={() => startCall('video')}>
                            <VideoIcon className={'ppid_icon'} />
                            <span className='profile_txt_big'>Video</span>
                        </div> */}
                    </div>
                </div>
                <div className='profile__Images'>
                    <div className='profile_images_top'>
                        <span className='profile_text_small'>Images</span>
                        {images.length > 0 && <div className='profile_images_count' 
                        onClick={() => setShowImages(true)}>
                            <span className='profile_text_small'>{images.length}</span>
                            <MdKeyboardArrowRight className='pic_icon' />
                        </div>}
                    </div>
                    {images.length > 0 && <div className='profile_images_'>
                        <div className='profile_images_clipped no_scroll_bar'>
                            <div className='profile_images_overflow'>
                                {images.slice(0, 10).map((val, idx) => (
                                    <div className='profile_img' key={`profile-${idx}`}
                                    onClick={() => dispatchImage(idx)}>
                                        <OptimizedImage data={val.img} />
                                    </div>
                                ))}
                                {images.length > 10 && <div className='profile-img img_arrow'
                                onClick={() => setShowImages(true)}>
                                    <MdKeyboardArrowRight className='pm-arrow' />
                                </div>}
                            </div>
                        </div>
                    </div>}
                </div>
                <div className='profile_box'>
                    <TextWithEmoji text={acct.about} CLX={'profile_txt_big profile_about'} 
                    font={15} search={null} clx={'profile_txt_big_inner'} />
                    <span className='profile_txt_small'>
                        {formatDay_TimeFromDate(acct.aboutUpdate||acct.createdAt)}
                    </span>
                </div>
                {contact_name && <div className='profile_box cursor' onClick={shareContact}>
                    <span className='profile_txt_big'>Share contact</span>
                    <span className='profile_txt_small'>Share {contact_name} contact</span>
                </div>}
                <div className='profile_box cursor' onClick={clickContact}>
                    <span className='profile_txt_big'>Add or Edit contact</span>
                    <span className='profile_txt_small'>
                        {contact_name ? `Edit ${contact_name}` : `Add ${acct.phoneNumber}`}
                    </span>
                </div>
                <div className='profile_box' onClick={blockUserFn}
                style={{justifyContent:'unset', cursor: 'pointer'}}>
                    <div style={{justifyContent:'unset'}}>
                        <BiBlock className='profile_icon red' />
                        <span className='profile_txt-big red' style={{marginLeft: '12px'}}>
                            {acct.isBlocked ? 
                                blockLoading ? 'Unblocking...' : 'UnBlock' :
                                blockLoading ? 'Blocking...' : 'Block'
                            }
                        </span>
                    </div>
                </div>
            </div>
        </div>}

        {showImages && <ProfileImages data={images} 
        closePage={() => setShowImages(false)} />}

        </div>
    )
};

export default ProfilePage;