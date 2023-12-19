import { useCallback, useRef } from 'react';
import { CloseIcon } from '../../component/Icons';
import defaultImage from '../../images/avatar.png';
import './status_viewers.css';
import { formatDateTimeFromDate } from '../../utils/formatters';
import useClickOutside from '../../hooks/useClickOutside';
import { useSelector } from 'react-redux';

const StatusViewers = ({ closeModal, data }) => {

    const modalRef = useRef();
    const { contacts } = useSelector(state => state.user);
    const fn = useCallback(() => {
        const mp = new Map();
        for(const viewer of data.viewers) {
            const user = contacts.find(({_id}) => _id === viewer.userId);
            mp.set(viewer.userId, user);
        }
        return mp;
    }, [data.viewers.length]);

    const userMap = fn();

    useClickOutside(modalRef, () => closeModal());

    const Viewer = ({ viewer }) => {
        const user = userMap.get(viewer.userId);

        return (
            <div className='stvm_viewer'>
                <img src={user.img||defaultImage} alt='dp' />
                <div className='stvm-viewer-txt'>
                    <span className='stvmv_top'>{user.userName}</span>
                    <span className='stvmv_base'>
                        {formatDateTimeFromDate(viewer.time)}
                    </span>
                </div>
            </div>
        )
    };

    return (
        <div className='Status__Viewers' ref={modalRef}>
            <div className='stV__top'>
                <span>Viewers</span>
                <div className='stV_close' onClick={() => closeModal()}>
                    <CloseIcon className={'stV_close_icon'} />
                </div>
            </div>
            <div className='stV__main hide_scroll_bar'>
                <div className='stvm'>
                    {data.viewers.map((val, idx) => (
                        <div className='stvm-' key={`stvm-${idx}`}>
                            <Viewer viewer={val} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
};

export default StatusViewers;