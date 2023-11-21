import { useState, useRef, useEffect } from 'react';
import { MdTextFields } from "react-icons/md";
import { CloseIcon, EmojiFillIcon, SendIcon } from "../../component/Icons";
import useTextEditor from './writeHook';
import { getModalPositions } from '../../utils/modal';
import './status.css';
import { bindActionCreators } from 'redux';
import { setStatusMessageData, setStatusData } from '../../store/actions';
import { useDispatch, useSelector } from 'react-redux';
import EmojiPickerModal from '../EndoModals/emoji_picker_modal';
import { createStatus } from '../../services/status';
import { responseMessage } from '../../utils/others';
import LoadingSpinner from '../../component/loading/loading';
import useClickOutside from '../../hooks/useClickOutside';

const StatusWrite = ({ closeModal, socket }) => {

    const modalRef = useRef();
    const dispatch = useDispatch();
    const user = useSelector(state => state.user);
    const setStatus = bindActionCreators(setStatusData, dispatch);
    const setStatusMessage = bindActionCreators(setStatusMessageData, dispatch);
    const fontFamily = ['Arial', 'Poppins', 'Lato', 'Monterrat', 'Roboto', 'Roboto Mono'];
    const [font, setFont] = useState(0);
    const [loading, setLoading] = useState(false);
    const [showEmoji, setShowEmoji] = useState(null);
    const divRef = useRef();
    const pRef = useRef();
    const placeholderRef = useRef();
    const lim = 500;

    async function send() {
        divRef.current?.blur();
        return false;
    };

    function toggleEmojiPicker(e) {
        if(showEmoji?.show) return setShowEmoji(null);
        const pos = getModalPositions(e.target, 
            Math.min(window.innerWidth - 10, 330), 390, false
        );
        setShowEmoji({ show: 'true', pos });
    };

    // since special hook was used shouldn't follow like the other from hooks folder
    const { empty, insertEmoji } = useTextEditor(
        divRef, pRef, placeholderRef, () => null, send, null, lim, setStatusMessage
    );

    useClickOutside(modalRef, () => closeModal());
    
    const handleCreate = () => {
        const text = pRef.current?.innerText || '';
        if(loading || !text) return;
        setLoading(true);
        const data = { text, font: fontFamily[font] };
        createStatus(data).then(res => {
            setStatus('iPost', res.data.status);
            const account = { 
                img: user.img, userName: user.userName, 
                _id: user._id, about: user.about 
            };
            // const ends = user.contacts.filter(contact => (
            //     contact._id !== user._id && !contact.barred && contact.userId !== user._id
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
        <div className='StatusWrite' ref={modalRef}>
            <div className='statusWrite'>
                <header>
                    <div className='sW_header_parts'>
                        <div className='sW_header_div' onClick={() => closeModal()}>
                            <CloseIcon className={'sW_header_icon'} />
                        </div>
                    </div>
                    <div className='sW_header_parts'>
                        <div className='sW_header_div'
                        onClick={() => setFont((font + 1) % 6)}>
                            <MdTextFields className='sW_header_icon' />
                        </div>
                        <div className='sW_header_div' onClick={toggleEmojiPicker}>
                            <EmojiFillIcon className={'sW_header_icon'} />
                        </div>
                    </div>
                </header>
                <main>
                    <div className='sW__Input__Box'>
                        <div className='sW__Input'>
                            <div contentEditable='true' ref={divRef} role='textbox'
                            spellCheck='true' className='sw-input-editor hide_scroll_bar'
                            suppressContentEditableWarning={true}>
                                <p className='sw-input-p' ref={pRef} id='p'><br/></p>
                            </div>
                            <div className='sw-input-placeholder' ref={placeholderRef}>
                            What's on your mind to share</div>
                        </div>
                    </div>
                </main>
                <footer>
                    <div className='sW_footer'>
                        <div className={`sW_send ${empty?'empty':''}`}
                        onClick={handleCreate}>
                            {!loading ? <SendIcon className={'sW_send_icon'} /> :
                            <LoadingSpinner width={'15px'} height={'15px'} />}
                        </div>
                    </div>
                </footer>
            </div>
            
            <span>
                {showEmoji?.show && <EmojiPickerModal pos={showEmoji.pos} 
                closeModal={()=>setShowEmoji(null)} emojiClick={insertEmoji} />}
            </span>

        </div>
    )
};

export default StatusWrite;