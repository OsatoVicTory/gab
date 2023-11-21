import { useState, useRef } from 'react';
import useTextEditor from './hook';
import Picker from './picker';
import './styles.css';

const Emoji = () => {
    const divRef = useRef();
    const placeholderRef = useRef();
    const [emoji, setEmoji] = useState(false);
    const pRef = useRef();

    const { empty, insertEmoji } = useTextEditor(divRef, pRef, placeholderRef);

    return (
        <div className='Emoji'>
            <span onClick={()=>setEmoji(!emoji)} style={{cursor:'pointer'}}>Open emoji</span>
            <div className='Emoji-wrapper'>
                {emoji && <Picker inserter={insertEmoji} />}
                <div className='Emoji-input'>
                    <div contentEditable='true' ref={divRef} 
                    spellCheck='true' className='text-editor' role='textbox'
                    suppressContentEditableWarning={true}>
                        <p className='emoji-p' ref={pRef} id='p'><br/></p>
                    </div>
                    <div className='emoji-placeholder' ref={placeholderRef}>Type message</div>
                </div>
            </div>
        </div>
    )
}
export default Emoji;