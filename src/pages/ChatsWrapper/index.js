import React, { useState } from 'react';
import './styles.css';
import { Routes, Route, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import { bindActionCreators } from "redux";
import { setChatsData, setInitializedData } from "../../store/actions";
import SideComponent from './sideComponent';
import NoGab from './NoGab';
import DirectConvo from './Convo/directConvo';
import GroupConvo from './Convo/groupConvo';
import UserProfile from './ProfilePage/userProfile';
import EditableUserProfile from './ProfilePage/editableUserProfile';
import GroupProfile from './ProfilePage/groupProfile';

const ChatsWrapper = ({ socket }) => {

    const user = useSelector(state => state.user);
    const id = window.location.pathname.split('/')[4];
    const chats = useSelector(state => state.chats);
    const groups = useSelector(state => state.groups);

    return (
        <div className='CW'>
            <div className={`CW__Content ${id?true:false}`}>
                <div className='CW__Side'>
                    {/* pass chats and groups data here */}
                    <SideComponent chats={chats} groups={groups} />
                </div>
                <div className='CW__Main'>
                    <Routes>
                        <Route path='/' element={<NoGab />} />
                        {/* type = 'direct-chat' or 'group-chat' */}
                        <Route path='/direct-chat/:id' element={<DirectConvo socket={socket} />} />
                        <Route path='/group-chat/:id' element={<GroupConvo socket={socket} />} />
                        <Route path='/profile/:id' element={<UserProfile />} />
                        <Route path='/you/:id' element={<EditableUserProfile socket={socket} />} />
                        <Route path='/group-profile/:id' element={<GroupProfile socket={socket} />} />
                    </Routes>
                </div>
            </div>
        </div>
    )
}

export default ChatsWrapper;