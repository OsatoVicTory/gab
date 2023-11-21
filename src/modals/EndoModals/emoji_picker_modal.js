import { useEffect, useRef, useState } from 'react';
import useModal from '../../hooks/useModal';
import './endo.css';
import EmojiPicker from '../../component/Emoji-picker';

const EmojiPickerModal = ({ pos, closeModal, emojiClick }) => {

    
    const modalRef = useRef();
    const eleRef = useRef();
    const [offsetWidth, setOffsetWidth] = useState(0);
    useModal(modalRef, closeModal);
    useEffect(() => {
        let id;
        if(eleRef.current) id = setTimeout(() => setOffsetWidth(eleRef.current.offsetWidth), 0);
        return () => clearTimeout(id);
    }, []);

    return (
        <div className='Reactions__Picker' style={{...pos}} ref={eleRef}>
            <div className='Reactions_Picker hideModal' ref={modalRef}>
                {offsetWidth && <EmojiPicker 
                offsetWidth={offsetWidth} emojiClick={emojiClick} />}
            </div>
        </div>
    )
};

export default EmojiPickerModal;