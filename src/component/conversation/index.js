import ConversationByYou from './you_panel';
import ConversationByOthers from './remote_panel';
import './conversation.css';
import { CheckBoxBlank, CheckBoxChecked } from '../Icons';

const ConversationPanel = ({ 
    type, search, message, openModal, handleCheck, 
    setFocus, checked, notSameSender, getImg
}) => {

    return (
        <div className='conversation_panel'>
            {checked && <div className='conversation_check_box'
            onClick={() => handleCheck(message._id)}>
                {checked === 'Yes' ?
                <CheckBoxChecked className={'ccb_icon'} /> :
                <CheckBoxBlank className={'ccb_icon'} />}
            </div>}
            {type === 'You' ?
                <ConversationByYou search={search} 
                message={message} openModal={openModal} getImg={getImg}
                setFocus={setFocus} notSameSender={notSameSender} /> :
                <ConversationByOthers search={search} getImg={getImg} 
                openModal={openModal} message={message}
                setFocus={setFocus} notSameSender={notSameSender} />
            }
        </div>
    )
};

export default ConversationPanel;