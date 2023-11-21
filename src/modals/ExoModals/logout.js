import { useRef } from 'react';
import "./modal_styles.css";
import { CloseIcon } from '../../component/Icons';
import useClickOutside from '../../hooks/useClickOutside';

const LogoutModal = ({ socket, closeModal }) => {

    const modalRef = useRef();

    useClickOutside(modalRef, () => closeModal());

    return (
        <div className='ActionModal' ref={modalRef}>
            <div className='actionModal__Content'>
                <div className='actionModal__Header'>
                    <span className='txt-17'>Log out</span>
                    <div className='actionModal__Close'>
                        <CloseIcon className={'action-close-icon'} />
                    </div>
                </div>
                <span className='txt-14 action_span'>Do you want to log out ?</span>
                <div className='actionModal__Base'>
                    <div className='action_modal_white_border'>
                        <span className='txt-14 bold'>Cancel</span>
                    </div>
                    <div className='action_modal_green_border'>
                        <span className='txt-14 bold'>Logout</span>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default LogoutModal;