import { useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import StatusViewStatic from '../../Status/ViewPanel/static';
import './styles.css';

const StatusPage = ({ data, socket, closePage }) => {

    const stopperRef = useRef(false);
    const { modal } = useSelector(state => state.sessions);

    useEffect(() => {
        if(modal) stopperRef.current = true;
        else stopperRef.current = false;
    }, [modal]);

    return (
        <div className='status__Page'>
            <StatusViewStatic state={data} socket={socket}
            closeStatusView={closePage} stopperRef={stopperRef} />
        </div>
    )
};

export default StatusPage;