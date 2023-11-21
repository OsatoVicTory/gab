import { useState, useEffect, useRef } from 'react';
import './styles.css';
import { useSelector, useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setStatusData, setStatusMessageData } from '../../store/actions';
import { fetchAllStatus, refreshStatus } from '../../services/status';
import { catchError, responseMessage } from '../../utils/others';
// import useStatusSocket from '../../sockets/status';
// import { fakeStatusData } from '../../utils/formatters';
import StatusMain from './statusMain';
import StatusSidePanel from './SidePanel';

const Status = ({ socket }) => {

    const [Data, setData] = useState({});
    const { loaded } = useSelector(state => state.status);
    const { modal } = useSelector(state => state.sessions);
    const dispatch = useDispatch();
    const setStatus = bindActionCreators(setStatusData, dispatch);
    const setStatusMessage = bindActionCreators(setStatusMessageData, dispatch);
    const interval = useRef(null);
    const stopperRef = useRef(false);

    const closeStatusView = () => {
        setData({});
        stopperRef.current = false;
    };
    
    const handleClick = (val, idx) => {
        if(idx === 'mine') setData({ type: 'mine', index: 0 });
        else setData({ 
            type: 'clicked', page: idx, 
            index: val.viewed >= val.statuses.length ? 0 : val.viewed||0 
        });
    };

    useEffect(() => {
        // const fake = fakeStatusData();
        // console.log('fakeStatus', fake);
        // setStatus('Init', fake);

        // no need for this as we have already fetched Status data in Gab
        // fetchAllStatus().then(res => {
        //     setStatus('Init', res.data.status);
        //     setLoading(false);
        // }).catch(err => {
        //     setLoading(false);
        //     setError(true);
        //     responseMessage('error', setStatusMessage, err);
        // })
        return () => catchError(refreshStatus(), setStatusMessage);
    }, []);

    useEffect(() => {
        if(loaded) {
            interval.current = setInterval(() => {
                // if(!stopperRef.current) setStatus('refresh', 'now');
            }, 3000);
        }

        return () => interval.current && clearInterval(interval.current);
    }, [loaded]);

    useEffect(() => {
        if(modal) stopperRef.current = true;
        else stopperRef.current = false;
    }, [modal]);

    return (
        <div className={`STATUS ${Data?.type ? true : false}`}>
            <div className='STATUS_SIDE'>
                <StatusSidePanel click={(val, idx) => handleClick(val, idx)} data={Data} />
            </div>

            <div className='STATUS_VIEW'>
                <StatusMain status={Data} socket={socket}
                closeStatusView={closeStatusView} stopperRef={stopperRef} />
            </div>
        </div>
    )
}

export default Status;