import React from 'react';
import './styles.css';
import { useSelector } from 'react-redux';
import SearchUser from './search';
import ForwardMessage from './forward';
import ContactsModal from './contacts';
import DeleteModal from './delete';
import SaveContact from './save_contact';
import EditMessage from './edit_message';
import LogoutModal from './logout';
import StatusWrite from './status_write';
import StatusUpload from './status_upload';
import StatusSetting from './status_setting';
import StatusViewers from './status_viewers';

const ExoModal = ({ closeModal, socket }) => {

    const { modal, modalMessage } = useSelector(state => state.sessions);

    const ModalComponent = () => {
        if(modal === 'search-user') {
            return <SearchUser closeModal={closeModal} />;
        } else if(modal === 'forward-message' || modal === 'share') {
            return <ForwardMessage message={modalMessage} 
            socket={socket} closeModal={closeModal} />;
        } else if(modal === 'contacts') {
            return <ContactsModal closeModal={closeModal} />;
        } else if(modal === 'edit-message') {
            return <EditMessage data={modalMessage} 
            socket={socket} closeModal={closeModal} />;
        } else if(modal === 'add-to-contact') {
            return <SaveContact message={modalMessage} 
            socket={socket} closeModal={closeModal} />;
        } else if(modal === 'delete-message') {
            return <DeleteModal message={modalMessage} 
            socket={socket} closeModal={closeModal} />;
        } else if(modal === 'log-out') {
            return <LogoutModal socket={socket} closeModal={closeModal} />;
        } else if(modal === 'status-write') {
            return <StatusWrite socket={socket} closeModal={closeModal} />;
        } else if(modal === 'status-upload') {
            return <StatusUpload socket={socket} closeModal={closeModal} />;
        } else if(modal === 'status-settings') {
            return <StatusSetting socket={socket} closeModal={closeModal} />;
        } else if(modal === 'status-viewers') {
            return <StatusViewers closeModal={closeModal} data={modalMessage} />;
        }
    };

    return (
        <div className='ExoModal__Overlay'>
            <ModalComponent />
        </div>
    )
};

export default ExoModal;