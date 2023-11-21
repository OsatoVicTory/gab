import { useRef, useCallback } from 'react';
import useModal from '../../hooks/useModal';
import './endo.css';
import { useDispatch, useSelector } from "react-redux";
import { bindActionCreators } from "redux";
import { setModalData, setModalMessageData } from "../../store/actions";

const DropDownModal = ({ pos, closeModal, openModal, data, setTagged }) => {

    const modalRef = useRef();
    const { _id } = useSelector(state => state.user);
    const dispatch = useDispatch();
    const setModal = bindActionCreators(setModalData, dispatch);
    const setModalMessage = bindActionCreators(setModalMessageData, dispatch);
    useModal(modalRef, closeModal);

    const setter = (type) => {
        setModal(type);
        setModalMessage(data);
        closeModal();
    };

    const notQuiteLong = useCallback(() => {
        const hr = 60 * 60 * 1000;
        return new Date().getTime() - new Date(data.createdAt).getTime() <= 1 * hr;
    }, []);

    const youSend = useCallback(() => {
        return data.senderId === _id;
    }, []);

    return (
        <div className='DropDown__Modal' style={{...pos}}>
            <div className='dropDown__Modal hideModal' ref={modalRef}>
                <div className='dropDown__Modal_lists'>

                    {!data.audio && <div className='dDMl' onClick={() => {
                        setTagged(data);
                        closeModal();
                    }}>
                        <span className='ddml-span'>Reply</span>
                    </div>}

                    <div className='dDMl' onClick={(e) => {
                        openModal(e.target, 'reactions_picker_preview', 280, 57, true, data);
                    }}>
                        <span className='ddml-span'>React</span>
                    </div>

                    {(!data.audio && youSend()) && <div className='dDMl' 
                    onClick={() => setter('forward-message')}>
                        <span className='ddml-span'>Forward</span>
                    </div>}

                    {(!data.audio && !data?.images[0] && notQuiteLong() && youSend()) && 
                    <div className='dDMl'
                    onClick={() => setter('edit-message')}>
                        <span className='ddml-span'>Edit</span>
                    </div>}

                    {data.senderId === _id && <div className='dDMl' onClick={(e) => {
                        openModal(e.target, 'message_info', 240, 150, true, data);
                    }}>
                        <span className='ddml-span'>Info</span>
                    </div>}

                    <div className='dDMl' onClick={() => setter('delete-message')}>
                        <span className='ddml-span'>Delete</span>
                    </div>

                </div>
            </div>
        </div>
    )
};

export default DropDownModal;