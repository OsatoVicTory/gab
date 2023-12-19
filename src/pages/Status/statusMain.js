// import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import StatusView from './ViewPanel';
import StatusViewStatic from './ViewPanel/static';
import './styles.css';
import logo from '../../images/logo.jpg';

const StatusMain = ({ status, closeStatusView, socket, stopperRef }) => {

    const { mine } = useSelector(state => state.status);
    const user = useSelector(state => state.user);
    const data = { view: mine, index: 0, account: user };

    return (
        <div className={`statusMain ${status.type ? 'show' : 'hide'}`}>
            {!status.type && <div className='no-status'>
                <h1>Status updates</h1>
                <img src={logo} alt='logo' />
            </div>}
            {(status.type && status.type !== 'mine') && <div className='status'>
                <StatusView data={status} socket={socket}
                closeStatusView={closeStatusView} stopperRef={stopperRef} />
            </div>}
            {(status.type && status.type === 'mine') && <div className='status'>
                <StatusViewStatic state={data} socket={socket}
                closeStatusView={closeStatusView} stopperRef={stopperRef} />
            </div>}
        </div>
    )
}

export default StatusMain;