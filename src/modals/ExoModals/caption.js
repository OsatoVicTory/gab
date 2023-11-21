import { useRef, useEffect } from 'react';
import TextWithEmoji from '../../component/TextWithEmoji';
import './caption.css';
import { CloseIcon } from '../../component/Icons';

const CaptionModal = ({ showModal, caption, closeModal, width }) => {

    const captionRef = useRef();

    function clicked(e) {
        if(!captionRef.current) return;
        
        if(captionRef.current && !captionRef.current.contains(e.target)) closeModal();
    };

    useEffect(() => {
        document.addEventListener('click', clicked, true);
        return () => document.removeEventListener('click', clicked, true);
    }, []);

    return (
        <div className={`CaptionModal ${showModal}`} style={{width: width+'px'}}>
            <div className='captionModal__Content' ref={captionRef}>
                <div className='cM_header'>
                    <span className='cM_title'>Caption</span>
                    <div className='cmh_icon_div'>
                        <CloseIcon className={'cmh_icon'} />
                    </div>
                </div>
                <div className='cM_main hide_scroll_bar'>
                    <TextWithEmoji text={caption||''} CLX={'cM_text'} 
                    clx={'cmt-inner'} font={14.1} search={null} />
                </div>
            </div>
        </div>
    )
};

export default CaptionModal;