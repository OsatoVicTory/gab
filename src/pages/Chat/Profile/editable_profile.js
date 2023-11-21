import { useState, useEffect, useRef } from 'react';
import './styles.css';
import { useSelector, useDispatch } from 'react-redux';
import { 
    setStatusMessageData, setUserData 
} from '../../../store/actions';
import defaultImg from '../../../images/avatar.png';
import { ArrowLeftIcon, EmojiIcon } from '../../../component/Icons';
import useTextEditor from '../../../hooks/useTextEditor';
import { BiEditAlt } from 'react-icons/bi';
import EmojiPicker from '../../../component/Emoji-picker';
import useScrollDetector from '../../../hooks/useScrollDetector';
import TextWithEmoji from '../../../component/TextWithEmoji';
import { responseMessage } from '../../../utils/others';
import { formatDay_TimeFromDate } from '../../../utils/formatters';
import { updateUserAccount } from '../../../services/user';
import { bindActionCreators } from 'redux';

const EditableUserProfile = ({ socket }) => {

    const user = useSelector(state => state.user);
    const dispatch = useDispatch();
    const setUser = bindActionCreators(setUserData, dispatch);
    const setStatusMessage = bindActionCreators(setStatusMessageData, dispatch);
    const [userImg, setUserImg] = useState(user?.img||'');
    const [showEmoji, setShowEmoji] = useState(false);
    const [fixed, setFixed] = useState(false);
    const [edit, setEdit] = useState(false);
    const [offsetWidth, setOffsetWidth] = useState(400);
    const [clearDiv, setClearDiv] = useState(false);
    const [updateLoading, setUpdateLoading] = useState(false);
    const divRef = useRef();
    const pRef = useRef();
    const placeholderRef = useRef();
    const divRef2 = useRef();
    const pRef2 = useRef();
    const placeholderRef2 = useRef();
    const userData = {};

    async function send() {
        divRef2.current?.focus();
        return false;
    };
    async function send2() {
        divRef2.current?.blur();
        return false;
    };

    function resize() {
        const ele = document.getElementById('profile-box');
        if(ele) setOffsetWidth(ele.offsetWidth);
    };

    useScrollDetector(70, (res) => setFixed(res));

    useEffect(() => {
        resize();
        window.addEventListener('resize', resize);
        return () => {
            if(typeof userImg === 'object') URL.revokeObjectURL(userImg);
            window.removeEventListener('resize', resize);
        }
    }, []);

    const { empty, insertEmoji } = useTextEditor(
        divRef, pRef, placeholderRef, () => null, send, userData.userName||'', clearDiv
    );

    const insertEmoji2 = useTextEditor(
        divRef2, pRef2, placeholderRef2, () => null, send2, userData.about||'', clearDiv
    );

    function toggleEmoji(type) {
        if(showEmoji === type) return setShowEmoji(false);
        setShowEmoji(type);
    };

    function insertEmojiFnc(emoji) {
        if(showEmoji === 'userName') insertEmoji(emoji);
        else insertEmoji2.insertEmoji(emoji);
    };

    function handleUpdate() {
        if(updateLoading) return alert('Currently updating...');
        setUpdateLoading(true);
        setClearDiv(false);
        const about = pRef2.current?.innerText || '';
        const formData = new FormData();
        formData.append('userName', pRef.current?.innerText || user.userName || '');
        formData.append('about', about);
        formData.append('cloudinary_id', user.cloudinary_id);
        formData.append('aboutUpdate', about ? String(new Date()) : '');
        if(typeof userImg === 'object') formData.append('file', userImg);
        else formData.append('img', userImg);
        
        const sendUpdate = async () => {
            try {
                const res = await updateUserAccount(formData);
                socket.emit('updateAccount', { ...res.data.user });
                const img = userImg;
                setUser({ ...res.data.user });
                if(typeof img === 'object') {
                    setUserImg(res.data.user.img);
                    URL.revokeObjectURL(img);
                }
                responseMessage('success', setStatusMessage, res);
                setUpdateLoading(false);
                setClearDiv(true);
                setEdit(false);
            } catch (err) {
                responseMessage('error', setStatusMessage, err);
                setUpdateLoading(false);
                setClearDiv(false);
            }
        }
        sendUpdate();
    };

    function pickedMediaFile(e) {
        const img = userImg;
        const File = e.target.files[0];
        if(!File?.size) return;
        // if(!['.png','.jpg','.jpeg'].find(file => File.name.endsWith(file))) {
        //     return setStatusMessage({type:'error',text:'Upload only image files'});
        // }
        if(File.size > 2048048) {
            return setStatusMessage({type:'error', text:'File cannot be more than 2MB'});
        }
        setUserImg(File);
        if(typeof img === 'object') URL.revokeObjectURL(img);
    };

    return (
        <div className='Profile__Page'>
            <div className='profile__Page__Wrapper hide_scroll_bar' id='profile'>
                <div className='profile__Page__Content'>
                    <div className={`profile_top ${fixed}`}>
                        <div>
                            <ArrowLeftIcon className={'profile_top_icon'} />
                        </div>
                        <span className='profile_txt_xl'>{user.userName || 'You'}</span>
                        <div onClick={() => setEdit(!edit)}>
                            <BiEditAlt className={'profile_top_icon'} />
                        </div>
                    </div>
                    <div className='Profile edittable'>
                        <div className='Profile_Images'>

                            <img src={typeof userImg === 'object' ?
                            URL.createObjectURL(userImg) : (userImg||defaultImg)} 
                            alt='profile' />

                            <label htmlFor='img-input'>
                                <BiEditAlt className={'profile_top_icon_'} />
                            </label>
                            <input type='file' id='img-input'
                            accept='image/*' onChange={pickedMediaFile} />
                        </div>
                        <span className='profile_txt_xl'>{user.userName || 'You'}</span>
                        <span className='profile-txt_big'>{user.phoneNumber}</span>
                        <span className='profile_txt_small'>online</span>
                    </div>
                    <div className='profile_box' id='profile-box'>
                        <TextWithEmoji text={user.about} CLX={'profile_txt_big profile_about'} 
                        font={15} search={null} clx={'profile_txt_big_inner'} />
                        <span className='profile_txt_small'>
                            {formatDay_TimeFromDate(user.aboutUpdate||user.createdAt)}
                        </span>
                    </div>
                    <div className={`profile_box edittable ${edit}`}>
                        <span className='profile_txt_big'>Edit user-name</span>
                        <div className='profile__Edittable'>
                            {showEmoji === 'userName' && <div className='profile__Emoji'>
                                <EmojiPicker offsetWidth={offsetWidth} emojiClick={insertEmojiFnc} />
                            </div>}
                            <div className='profile_edittable_input'>
                                <div className='_pei_emoji' 
                                onClick={() => toggleEmoji('userName')}>
                                    <EmojiIcon className={'_pei_emoji_icon'}/>
                                </div>
                                <div className='_pei_input'>
                                    <div contentEditable='true' ref={divRef} role='textbox'
                                    spellCheck='true' className='pei-input-editor hide_scroll_bar'
                                    suppressContentEditableWarning={true}>
                                        <p className='pei-input-p' ref={pRef} id='p'><br/></p>
                                    </div>
                                    <div className='pei-input-placeholder' ref={placeholderRef}>
                                    Enter user-name</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={`profile_box edittable ${edit}`}>
                        <span className='profile_txt_big'>Edit about</span>
                        <div className='profile__Edittable'>
                            {showEmoji === 'about' && <div className='profile__Emoji'>
                                <EmojiPicker offsetWidth={offsetWidth} emojiClick={insertEmojiFnc} />
                            </div>}
                            <div className='profile_edittable_input'>
                                <div className='_pei_emoji' 
                                onClick={() => toggleEmoji('about')}>
                                    <EmojiIcon className={'_pei_emoji_icon'}/>
                                </div>
                                <div className='_pei_input'>
                                    <div contentEditable='true' ref={divRef2} role='textbox'
                                    spellCheck='true' className='pei-input-editor hide_scroll_bar'
                                    suppressContentEditableWarning={true}>
                                        <p className='pei-input-p' ref={pRef2} id='p'><br/></p>
                                    </div>
                                    <div className='pei-input-placeholder' ref={placeholderRef2}>
                                    Enter about</div>
                                </div>
                            </div>
                        </div>
                        <div className='profile__Edittable__Send'>
                            <div className='pes__Send' onClick={handleUpdate}>
                                {updateLoading ? 'Updating...' : 'Update'}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
};

export default EditableUserProfile;