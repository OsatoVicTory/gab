import React, { useEffect } from 'react';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import { bindActionCreators } from "redux";
import { 
    setChatsData, setInitializedData, 
    setStatusData, setStatusMessageData,
} from "./store/actions";
import Chat from './pages/Chat';
import Status from './pages/Status';
import useChatsSocket from './sockets/direct_chats';
import FixedPage from './pages/fixedPages';
import useStatusSocket from './sockets/status';
// import { io } from "socket.io-client";
// import { SERVER } from './config';
// const socket = io(SERVER);
// // const socket = '';

const GabWrapper = ({ socket }) => {
    const user = useSelector(state => state.user);
    const chats = useSelector(state => state.chats);
    const dispatch = useDispatch();
    const { loadedState, initialized } = useSelector(state => state.sessions);
    const fixedPage = useSelector(state => state.fixedPages);
    const initSetter = bindActionCreators(setInitializedData, dispatch);
    const setChats = bindActionCreators(setChatsData, dispatch);
    const setStatus = bindActionCreators(setStatusData, dispatch);
    const setStatusMessage = bindActionCreators(setStatusMessageData, dispatch);
    
    useEffect(() => {
        const online = () => {
            socket.emit('userOnline', user._id);
        };
        online();
        socket.on('updateAccount', (data) => {
            setChats('propagateAccount', data._id, data);
            setStatus('propagateAccount', data._id, data);
        });
    }, []);
    
    useChatsSocket(socket, setChats, [...chats.data.map(({ account }) => account._id)],
        initSetter, initialized, loadedState, user._id, setStatusMessage
    );

    useStatusSocket(socket, setStatus, setChats);


    return (
        <div className='Gab__Body'>
            <Routes>
                <Route path='/chats/*' element={<Chat socket={socket} />} />
                <Route path='/status' element={<Status socket={socket} />} />
            </Routes>
            {fixedPage.type && <FixedPage data={fixedPage} socket={socket} />}
        </div>
    )
}

export default GabWrapper;