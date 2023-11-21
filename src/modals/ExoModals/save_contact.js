import { useState, useRef } from 'react';
import './styles_2.css';
import { useDispatch } from "react-redux";
import { bindActionCreators } from "redux";
import { setStatusMessageData, setUserData } from "../../store/actions";
import { responseMessage } from '../../utils/others';
import { useSelector } from 'react-redux';
import { saveContact } from '../../services/user';
import useClickOutside from '../../hooks/useClickOutside';

const SaveContact = ({ message, closeModal, socket }) => {

    const modalRef = useRef();
    const [contactName, setContactName] = useState(message?.userName||'');
    const [showSaveBtn, setShowSaveBtn] = useState(false);
    const [editLoading, setEditLoading] = useState(false);
    const dispatch = useDispatch();
    const { contacts, _id } = useSelector(state => state.user);
    const setUser = bindActionCreators(setUserData, dispatch);
    const setStatusMessage = bindActionCreators(setStatusMessageData, dispatch);

    useClickOutside(modalRef, () => closeModal());
    
    function handleChange(e) {
        const { value } = e.target;
        setContactName(value);
        if(value === message.userName) setShowSaveBtn(false);
        else if(!showSaveBtn) setShowSaveBtn(true);
    };
    

    const handleSave = () => {
        if(!showSaveBtn || editLoading) return;
        setEditLoading(true);
        let newContacts = [], found = false;
        for(let contact of contacts) {
            // if(contact.userId === _id || contact._id === _id) continue;
            if(message._id === contact.userId) {
                newContacts.push({ ...contact, ...message, userName: contactName });
                found = true;
            } else {
                newContacts.push(contact);
            }
        }
        if(!found && message._id !== _id) {
            newContacts.push({ ...message, userId: message._id, userName: contactName });
        }
        saveContact({ userId: message._id, userName: contactName }).then(res => {
            setUser({ contacts: newContacts });
            responseMessage('success', setStatusMessage, res);
            setEditLoading(false);
            closeModal();
        }).catch(err => {
            responseMessage('error', setStatusMessage, err);
            setEditLoading(false);
        });
    };

    return (
        <div className='save_contact' ref={modalRef}>
            <div className='save_contact_content'>
                <span>Save/Edit contact</span>
                <div className='save_contact_input'>
                    <input placeholder='Enter name' value={contactName} onChange={handleChange} />
                </div>
                <div className='save_contact__Base'>
                    <div className='save_contact_base'>
                        <div className='scb_div cancel'>Cancel</div>
                        <div className={`scb_div save ${showSaveBtn}`} onClick={handleSave}>
                            {editLoading ? 'Saving...' : 'Save'}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default SaveContact;