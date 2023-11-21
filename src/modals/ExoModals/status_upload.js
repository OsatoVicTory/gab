import { useState, useRef, useEffect } from 'react';
import { CloseIcon, EmojiIcon, SendIcon } from "../../component/Icons";
import { AiOutlinePlus } from 'react-icons/ai';
import useTextEditor from '../../hooks/useTextEditor';
import './status.css';
import useClickOutside from '../../hooks/useClickOutside';
import { bindActionCreators } from 'redux';
import { setStatusMessageData, setStatusData } from '../../store/actions';
import { useDispatch, useSelector } from 'react-redux';
import EmojiPicker from '../../component/Emoji-picker';
import { uploadStatus } from '../../services/status';
import { responseMessage } from '../../utils/others';
import LoadingSpinner from '../../component/loading/loading';


const StatusUpload = ({ socket, closeModal }) => {

    const modalRef = useRef();
    const dispatch = useDispatch();
    const user = useSelector(state => state.user);
    const setStatus = bindActionCreators(setStatusData, dispatch);
    const setStatusMessage = bindActionCreators(setStatusMessageData, dispatch);
    const [showEmoji, setShowEmoji] = useState(false);
    const [image, setImage] = useState(null);
    const [offsetWidth, setOffsetWidth] = useState(400);
    const [loading, setLoading] = useState(false);
    const divRef = useRef();
    const pRef = useRef();
    const placeholderRef = useRef();

    async function send() {
        divRef.current?.blur();
        return false;
    };

    // we use false as last params(clearDiv) cus after success we close this div
    const { empty, insertEmoji } = useTextEditor(
        divRef, pRef, placeholderRef, () => null, send, null, false
    );

    useClickOutside(modalRef, () => closeModal());

    function handleChange(e) {
        const File = e.target.files[0];
        if(!File?.size) return;
        if(File.size > 2048048) {
            return setStatusMessage({type:'error', text:'File cannot be more than 2MB'});
        };
        setImage(File);
    };

    function closeImage() {
        const remove_img = image;
        setImage(null);
        URL.revokeObjectURL(remove_img);
    };

    function resize() {
        const ele = document.getElementById('status-caption-box');
        if(ele) setOffsetWidth(ele.offsetWidth);
    };

    useEffect(() => {
        resize();
        window.addEventListener('resize', resize);
        return () => {
            if(image) URL.revokeObjectURL(image);
            window.removeEventListener('resize', resize);
        }
    }, []);

    const handlePost = () => {
        if(loading) return;
        if(!image) return setStatusMessage({ 
            type: 'error', text: 'Cannot post without a photo. You could use write status' 
        });
        setLoading(true);
        const formData = new FormData();
        const message = pRef.current?.innerText || '';
        if(message) formData.append('caption', message);
        formData.append('file', image);
        uploadStatus(formData).then(res => {
            setStatus('iPost', res.data.status);
            const account = { 
                img: user.img, userName: user.userName, 
                _id: user._id, about: user.about 
            };
            // const ends = user.contacts.filter(contact => (
            //     contact.userId !== user._id && !contact.barred
            // )).map(c => c.userId);
            const { ends } = res.data;
            socket.emit('sendStatus', { account, status: res.data.status, ends });
            setLoading(false);
            responseMessage('success', setStatusMessage, res);
            closeModal();
        }).catch(err => {
            setLoading(false);
            responseMessage('error', setStatusMessage, err);
        })
    };

    return (
        <div className='StatusUpload' ref={modalRef}>
            <div className='statusUpload'>
                <header>
                    <span className='sU_header_txt'>Status Upload</span>
                    <div className='sW_header_div' onClick={() => closeModal()}>
                        <CloseIcon className={'sW_header_icon'} />
                    </div>
                </header>
                <main>
                    <div className='sU__main'>
                        <div className={`su__main content ${image?'show':'hide'}`}>
                            <div className='su__main__close' onClick={closeImage}>
                                <CloseIcon className={'sumc_icon'} />
                            </div>
                            
                            {image && <img src={URL.createObjectURL(image)} alt='upload' />}

                            <div className='sU__Caption__Box' id='status-caption-box'>
                                {showEmoji && <div className='sU__Emoji'>
                                    <EmojiPicker offsetWidth={offsetWidth} emojiClick={insertEmoji} />
                                </div>}
                                <div className='sU__Caption__Input'>
                                    <div className='sU_caption_emoji' 
                                    onClick={() => setShowEmoji(!showEmoji)}>
                                        <EmojiIcon className={'sU_caption_emoji_icon'} />
                                    </div>
                                    <div className='sU__Input'>
                                        <div contentEditable='true' ref={divRef} role='textbox'
                                        spellCheck='true' className='su-input-editor hide_scroll_bar'
                                        suppressContentEditableWarning={true}>
                                            <p className='su-input-p' ref={pRef} id='p'><br/></p>
                                        </div>
                                        <div className='su-input-placeholder' ref={placeholderRef}>
                                        Type caption</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={`su__main nocontent ${image?'hide':'show'}`}>
                            <label htmlFor='su_input'>
                                <AiOutlinePlus className='sumn_icon' />
                            </label>
                            <input type='file' id='su_input' 
                            accept='image/*' onChange={handleChange} />
                        </div>
                    </div>
                </main>
                <footer>
                    <div className='sW_footer'>
                        <div className={`sW_send`} onClick={handlePost}>
                            {!loading ? <SendIcon className={'sW_send_icon'} /> :
                            <LoadingSpinner width={'15px'} height={'15px'} />}
                        </div>
                    </div>
                </footer>
            </div>

        </div>
    )
};

export default StatusUpload;