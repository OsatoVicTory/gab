import { useRef } from 'react';
import useModal from '../../hooks/useModal';
import './endo.css';
import { DeliveredIcon } from '../../component/Icons';
import { formatDateTimeFromDate } from '../../utils/formatters';

const MessageInfoModal = ({ pos, closeModal, data }) => {

    const modalRef = useRef();
    useModal(modalRef, closeModal);

    return (
        <div className='MessageInfo__Modal' style={{...pos}}>
            <div className='messageInfo__Modal hideModal' ref={modalRef}>
                <div className='messageInfo'>
                    <div className='mInfo_top'>
                        <DeliveredIcon className={'mInfo_icon blue'} />
                        <span className='mInfo_txt-17'>Read</span>
                    </div>
                    <span className='mInfo_txt-14'>
                        {data.isRead ? formatDateTimeFromDate(data.isRead) : '...'}
                    </span>
                </div>
                <div className='messageInfo'>
                    <div className='mInfo_top'>
                        <DeliveredIcon className={'mInfo_icon'} />
                        <span className='mInfo_txt-17'>Delivered</span>
                    </div>
                    <span className='mInfo_txt-14'>
                        {!data.isDelivered ? '...' : formatDateTimeFromDate(data.isDelivered)}
                    </span>
                </div>
            </div>
        </div>
    )
};

export default MessageInfoModal;