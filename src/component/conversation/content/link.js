import { useState } from 'react';
import link from '../../../images/link.jpg';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setStatusMessageData } from '../../../store/actions';
import { getUser } from '../../../services/user';
import './image.css';
import { responseMessage } from '../../../utils/others';

const Link = ({ data }) => {

    const navigate = useNavigate();
    const [msg, to, id] = data.link.split('~');
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const chats = useSelector(state => state.chats).data;
    const setStatusMessage = bindActionCreators(setStatusMessageData, dispatch);

    const clicked = async () => {
        if(loading) return;
        setLoading(true);
        try {
            for(let i = 0; i < chats.length; i++) {
                if(chats[i].account._id === id) {
                    setLoading(false);
                    return navigate(to);
                }
            }
            const account = (await getUser(id)).data.user;
            setLoading(false);
            navigate(to, { state : {
                account, messages: [], unreadMessages: 0, unReads: 0
            }});
        } catch(err) {
            setLoading(false);
            responseMessage('error', setStatusMessage, err);
        }
    };

    return (
        <div className='Link'>
            <div className='Link_img'>
                <img src={link} alt='link' />
            </div>
            <div className='Link_text'>
                <span className='link_txt'>{data.link_text}</span>
                <div className='link_button' onClick={() => clicked()}>
                    <span className='link_txt white'>
                        {!loading ? msg : 'Loading...'}
                    </span>
                </div>
            </div>
        </div>
    )
};

export default Link;