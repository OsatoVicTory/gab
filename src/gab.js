import React, { useState, useEffect } from 'react';
import './App.css';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import { bindActionCreators } from "redux";
import { 
    setChatsData, setUserData, 
    setStatusMessageData, setLoadedStateData, 
    setModalData, setGroupsData, setStatusData 
} from "./store/actions";
import GabWrapper from './GabWrapper';
import LoadingPage from './component/loading/LoadingPage';
import ExoModal from './modals/ExoModals';
import { userIn } from './services/user';
// import img from './images/avatar.png';
// import img1 from './images/img1.jpg';
import { SERVER } from './config';
import ErrorPage from './component/ErrorPage';
import { responseMessage } from './utils/others';
// import { getFakeData } from './utils/formatters';
import { io } from "socket.io-client";
// const socket = {emit: (...e)=>null, on: (...d) => null};

const Gab = () => {
    // const socket = io(SERVER);
    const user = useSelector(state => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [socket, setSocket] = useState({
        emit: (...e)=>null, on: (...d) => null, 
        notLoaded: true, disconnect: () => null
    });
    
    const setChats = bindActionCreators(setChatsData, dispatch);
    const setGroups = bindActionCreators(setGroupsData, dispatch);
    const setUser = bindActionCreators(setUserData, dispatch);
    const setStatus = bindActionCreators(setStatusData, dispatch);
    const setStatusMessage = bindActionCreators(setStatusMessageData, dispatch);
    const setLoadedState = bindActionCreators(setLoadedStateData, dispatch);
    const setModal = bindActionCreators(setModalData, dispatch);
    const { loadedState, modal } = useSelector(state => state.sessions);
    const [loading, setLoading] = useState(loadedState?.chats ? false : true);
    const [error, setError] = useState(false);
    
    useEffect(() => {
        
        setSocket(io(SERVER));
        if(loading) {
            // const hash = "LEHV6nWB2yk8pyo0adR*.7kCMdnj";
            const loggedIn = async () => {
                // getFakeData(user, setChats, setGroups)
                // setLoadedState({ chats: true, groups: true });
                // return setLoading(false);

                try {
                    const { data } = await userIn();
                    if(data.status !== "success") {
                      setStatusMessage({type:'error',text:data.message});
                      return navigate("/login");
                    }
                    const { User, Chats, Groups, Status } = data;
                    setUser(User);
                    setChats('Init', Chats);
                    setGroups('Init', Groups);
                    setStatus('Init', Status);
                    setLoadedState({ chats: true, groups: true, status: true });
                    setStatusMessage({type:'success',text:data.message});
                    setLoading(false);
                } catch (err) {
                    responseMessage('error', setStatusMessage, err);
                    setError(true);
                    setLoading(false);
                    if(err.data.status === 'failed') navigate("/login");
                }
            } 
            loggedIn();
        }
        return () => socket.disconnect();
        
    }, []);

    return (
        <div className='Gab__Wrapper'>
            {(loading && !error) && <div className='Gab__Loading'>
                <LoadingPage />
            </div>}
            {error && <ErrorPage />}
            {(!loading && !error) && <div className='Gab__Container'>
                <GabWrapper socket={socket}  />
                <div className='gab__ExoModal__Wrapper'>
                    {modal && <ExoModal socket={socket}
                    closeModal={() => setModal(null)} />}
                </div>
            </div>}
        </div>
    )
}

export default Gab;