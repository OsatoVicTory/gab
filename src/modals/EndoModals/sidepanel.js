import { useRef, useState } from 'react';
import useModal from '../../hooks/useModal';
import './endo.css';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import { 
    setModalData, setChatsData, setModalMessageData, setStatusMessageData 
} from '../../store/actions';
import { deleteDirectMessageForMe } from '../../services/dm';
import { responseMessage } from '../../utils/others';
import { pinChat } from '../../services/user';

const SidePanelModal = ({ pos, closeModal, data, contacts }) => {

    const modalRef = useRef();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const setModalMessage = bindActionCreators(setModalMessageData, dispatch);
    const setModal = bindActionCreators(setModalData, dispatch);
    const setChats = bindActionCreators(setChatsData, dispatch);
    const setStatusMessage = bindActionCreators(setStatusMessageData, dispatch);

    useModal(modalRef, closeModal);
    const contact = contacts.find(ct => ct.phoneNumber === data.phoneNumber);
    const navg = (route) => {
        navigate(`/app/chats/${route}/${data._id}`);
        closeModal();
    };

    const clickContact = () => {
        setModal('add-to-contact');
        setModalMessage({ ...data });
    };

    const deleteChat = () => {
        if(loading) return alert(`Current making a ${loading} request`);
        setLoading('clear chat');
        deleteDirectMessageForMe(data._id, { clearAll: true }).then(res => {
            setChats('clearChat', data._id);
            setStatusMessage({ type:'success', text:'Chats cleared' });
            setLoading(false);
            closeModal();
        }).catch(err => {
            responseMessage('error', setStatusMessage, err);
            setLoading(false);
        });
    };

    const Pin = () => {
        if(loading) return alert(`Current making a ${loading} request`);
        setLoading('pin/unpin');
        pinChat(data._id).then(res => {
            setChats('pinChat', data._id);
            responseMessage('success', setStatusMessage, res);
            setLoading(false);
            closeModal();
        }).catch(err => {
            responseMessage('error', setStatusMessage, err);
            setLoading(false);
        });
    };

    const logOutFn = () => {
        setModal('log-out');
        closeModal();
        navigate('/login');
    };

    const ForChats = () => {
        return (
            <div className='SPM_'>
                <div className='spm' onClick={() => navg('direct_chat')}>Start Chat</div> 
                <div className='spm' onClick={() => navg('profile')}>View Info</div>
                <div className='spm' onClick={Pin}>{contact?.pinned ? 'Unpin' : 'Pin'} Chat</div>
                <div className='spm' onClick={deleteChat}>Clear Chat</div>
                <div className='spm' onClick={clickContact}>{contact?'Edit':'Add'} contact</div>
            </div>
        )
    };

    const ForUser = () => {
        return (
            <div className='SPM_'>
                <div className='spm' onClick={() => {
                    navigate('/app/chats/profile/me');
                    closeModal();
                }}>Settings</div>
                <div className='spm' onClick={logOutFn}>Log out</div>
            </div>
        )
    };

    return (
        <div className='SidePanelModal' style={{...pos}}>
            <div className='SPM hideModal' ref={modalRef}>
                {data ? <ForChats /> : <ForUser />}
            </div>
        </div>
    )
};

export default SidePanelModal;