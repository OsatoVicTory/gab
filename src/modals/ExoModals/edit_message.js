import { useState, useRef, useEffect } from 'react';
import './styles_2.css';
import useTextEditor from '../../hooks/useTextEditor';
import { CloseIcon, EmojiIcon, SendIcon } from '../../component/Icons';
import TextWithEmoji from '../../component/TextWithEmoji';
import EmojiPicker from '../../component/Emoji-picker';
import { formatTimeFromDate } from '../../utils/formatters';
import LoadingSpinner from '../../component/loading/loading';
import { useDispatch } from "react-redux";
import { bindActionCreators } from "redux";
import { setChatsData, setStatusMessageData } from "../../store/actions";
import { editDirectMessage } from '../../services/dm';
import useClickOutside from '../../hooks/useClickOutside';

const EditMessage = ({ data, closeModal, socket }) => {

    const [showEmoji, setShowEmoji] = useState(false);
    const modalRef = useRef();
    const divRef = useRef();
    const pRef = useRef();
    const placeholderRef = useRef();
    const [offsetWidth, setOffsetWidth] = useState(400);
    const [editLoading, setEditLoading] = useState(false);
    const [clearDiv, setClearDiv] = useState(false);
    const dispatch = useDispatch();
    const setStatusMessage = bindActionCreators(setStatusMessageData, dispatch);
    const setChats = bindActionCreators(setChatsData, dispatch);

    const send = async () => {
        try {
            setEditLoading(true);
            const message = pRef.current?.innerText;
            if(!message || message === data.message) {
                setStatusMessage({type:'error',text:'Message should be different from previous'});
                return false;
            };
            setClearDiv(false);
            
            const formData = new FormData();
            formData.append('senderId', data.senderId);
            formData.append('receiverId', data.receiverId);
            formData.append('messageId', data._id);
            formData.append('message', message);
            const res = await editDirectMessage(formData);
            const { messageData } = res.data;
            socket.emit('edittedMessage', messageData);
            setChats('editMessage', messageData);
            setStatusMessage({type:'success',text:'Message edited successfully'});
            setEditLoading(false);
            setClearDiv(true);
            closeModal();
        } catch (err) {
            setStatusMessage({type:'error',text:err?.response?.message||'Network problem'});
            setEditLoading(false);
            setClearDiv(false);
        }
    };

    const { empty, insertEmoji } = useTextEditor(
        divRef, pRef, placeholderRef, () => null, send, data.message||'', clearDiv
    );

    function resize() {
        const ele = document.getElementById('ed_editor');
        if(ele) setOffsetWidth(ele.offsetWidth);
    };

    useEffect(() => {
        resize();
        window.addEventListener('resize', resize);
        return () => window.removeEventListener('resize', resize);
    }, []);

    useClickOutside(modalRef, () => closeModal());
;
    return (
        <div className='Edit__Message' ref={modalRef}>
            <div className='edit_message_header'>
                <span>Edit message</span>
                <div className='emh_close'>
                    <CloseIcon className={'emh_close_icon'} />
                </div>
            </div>
            <div className='edit_message_body hide_scroll_bar'>
                <div className='previous_message'>
                    <div className='previous_message_content'>
                        <TextWithEmoji text={data.message||''} font={14.1} 
                        CLX={'pmc_text'} clx={'pmc-inner'} search={''} />
                        {/* <span className='pmc_read_more'>Read more</span> */}
                        <span className='pmc_text_placeholder'>------</span>
                    </div>
                    <div className='pm_base'>
                        <span className='pmc_time'>
                            {formatTimeFromDate(data.createdAt)}
                        </span>
                    </div>
                </div>
            </div>
            <div className='edit__Message__footer' id='ed_editor'>
                {showEmoji && <div className='edm__Emoji'>
                    <EmojiPicker offsetWidth={offsetWidth} emojiClick={insertEmoji} />
                </div>}
                <div className='edit__Message__Box'>
                    <div className='edit__Message__Emoji' 
                    onClick={() => setShowEmoji(!showEmoji)}>
                        <EmojiIcon className={'edme_icon'} />
                    </div>
                    <div className='edit__Message__Input'>
                        <div contentEditable='true' ref={divRef} role='textbox'
                        spellCheck='true' className='edm-input-editor hide_scroll_bar'
                        suppressContentEditableWarning={true}>
                            <p className='edm-input-p' ref={pRef} id='p'><br/></p>
                        </div>
                        <div className='edm-input-placeholder' ref={placeholderRef}>
                        Type message</div>
                    </div>
                    <div className='edit__Message__Send'>
                        <div className='ed_send' onClick={() => send()}>
                            {!editLoading ? <SendIcon className={'ed_send_icon'} /> :
                            <LoadingSpinner width={'15px'} heght={'15px'} />}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default EditMessage;