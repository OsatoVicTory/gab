import './styles.css';
import { Routes, Route } from 'react-router-dom';
import NoGab from './NoGab';
import ChatSidePanel from './SidePanel';
import ChatPanel from './ChatPanel';
import ProfilePage from './Profile';
import EditableUserProfile from './Profile/editable_profile';

const Chat = ({ socket }) => {

    const id = window.location.pathname.split('/')[4];

    return (
        <div className={`Chat ${id && true}`}>
            <div className='Chat__Left'>
                <ChatSidePanel />
            </div>  
            <div className='Chat__Right'>
                <Routes>
                    <Route path='/' element={<NoGab />} />
                    <Route path='/direct_chat/:id' element={<ChatPanel socket={socket} />} />
                    <Route path='/profile/:id' element={<ProfilePage />} />
                    <Route path='/profile/me' 
                    element={<EditableUserProfile socket={socket} />} />
                </Routes>
            </div>
        </div>
    );
};

export default Chat;