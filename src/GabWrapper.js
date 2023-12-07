import React, { lazy, Suspense, useEffect, useState } from 'react';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import { bindActionCreators } from "redux";
import { 
    setChatsData, setInitializedData, 
    setStatusData, setStatusMessageData, setFixedCallsData
} from "./store/actions";
import SuspenseLoading from './component/suspense';
import useChatsSocket from './sockets/direct_chats';
import useStatusSocket from './sockets/status';
import FixedPage from './pages/fixedPages';
const Chat = lazy(() => import('./pages/Chat'));
const Status = lazy(() => import('./pages/Status'));

const GabWrapper = ({ socket }) => {
    const [incomingCall, setIncomingCall] = useState({});
    const user = useSelector(state => state.user);
    const chats = useSelector(state => state.chats);
    const dispatch = useDispatch();
    const { loadedState, initialized } = useSelector(state => state.sessions);
    const fixedPage = useSelector(state => state.fixedPages);
    const initSetter = bindActionCreators(setInitializedData, dispatch);
    const setChats = bindActionCreators(setChatsData, dispatch);
    const setStatus = bindActionCreators(setStatusData, dispatch);
    const setStatusMessage = bindActionCreators(setStatusMessageData, dispatch);
    const setFixedCalls = bindActionCreators(setFixedCallsData, dispatch);
    
    useEffect(() => {
        if(!socket.notLoaded) {
            const online = () => {
                socket.emit('userOnline', user._id);
            };
            online();
            socket.on('updateAccount', (data) => {
                setChats('propagateAccount', data._id, data);
                setStatus('propagateAccount', data._id, data);
            });
            const callSetter = (data) => setIncomingCall({ time: String(Date.now()), ...data});
            
            socket.on('receivingCall', (data) => {
                callSetter(data);
            });
        }
    }, [socket.notLoaded]);

    useEffect(() => {
        if(incomingCall.time) {
            if(fixedPage.type === 'audio' || fixedPage.type === 'video') {
                socket.emit('userInCall', { to: incomingCall.callerId });
            } else setFixedCalls({ ...incomingCall });
        }
    }, [incomingCall.time]);
    
    useChatsSocket(socket, setChats, [...chats.data.map(({ account }) => account._id)],
        initSetter, initialized, loadedState, user._id, setStatusMessage
    );

    useStatusSocket(socket, setStatus, setChats);


    return (
        <div className='Gab__Body'>
            <Routes>
                <Route path='/chats/*' element={
                    <Suspense fallback={<SuspenseLoading />}>
                        <Chat socket={socket} />
                    </Suspense>
                } />

                <Route path='/status' element={
                    <Suspense fallback={<SuspenseLoading />}>
                        <Status socket={socket} />
                    </Suspense>
                } />
            </Routes>
            {fixedPage.type && <FixedPage data={fixedPage} socket={socket} />}
        </div>
    )
}

export default GabWrapper;