import { useState, useEffect, useRef } from 'react';
import './modal_styles.css';
import { useSelector } from 'react-redux';
import { CloseIcon, ArrowLeftIcon, SendIcon } from '../../component/Icons';
import defaultImage from '../../images/avatar.png';
import TextWithEmoji from '../../component/TextWithEmoji';
import { contactName } from '../../utils/Chat';
import LoadingSpinner from '../../component/loading/loading';
import useClickOutside from '../../hooks/useClickOutside';
import { useNavigate } from 'react-router-dom';

const ContactsModal = ({ closeModal }) => {
    
    const navigate = useNavigate();
    const user = useSelector(state => state.user);
    const { contacts } = user;
    const modalRef = useRef();
    const [forwardShowing, setForwardShowing] = useState(contacts);
    const [search, setSearch] = useState('');

    useClickOutside(modalRef, () => closeModal());

    const startConvo = (val) => {
        navigate(`/app/chats/direct-chat/${val._id}`, 
            { state: { account: val, messages: [],
            unreadMessages: 0, unReads: 0 } } 
        );
        closeModal();
    };

    const handleChange = (e) => setSearch(e.target.value);

    useEffect(() => {
        if(!search) setForwardShowing(contacts);
        else {
            const value = String(value).toLowerCase();
            setForwardShowing([...contacts.filter(val => (
                (val.userName||'').toLowerCase().startsWith(value) || 
                String(val.phoneNumber).startsWith(value)
            ))]);
        }
    }, [search]);

    return (
        <div className='ForwardMessage contacts_' ref={modalRef}>
            <header>
                <div className='forwardIconDiv' onClick={() => closeModal()}>
                    <CloseIcon className={'forwardIcon'} />
                </div>
                <h2>Contacts</h2>
            </header>
            <section>
                <div className='forwardSearch'>
                    <div className='forwardIconDiv' onClick={() => setSearch('')}>
                        <ArrowLeftIcon className={'forwardIcon green'} />
                    </div>
                    <input placeholder='Search' onChange={handleChange} value={search} />
                </div>
            </section>
            <main className='hide_scroll_bar mainContacts'>
                <ul className='forwardLists'>
                    {forwardShowing.map((val, idx) => (
                        <li className='forwardList contacts' key={`forward-${idx}`}
                        onClick={() => startConvo(val)}>
                            <div className='fl-image'>
                                <img src={val.img||defaultImage} alt='dp' />
                            </div>
                            <div className='fl-texts'>
                                <div className='fl-span'>
                                    <span className='txt-17'>
                                        {contactName(val.phoneNumber, user.contacts)}
                                    </span>
                                </div>
                                <div className='fl-span'>
                                    <TextWithEmoji text={val.about}
                                    CLX={'txt-14'} clx={'txt-inner'}
                                    font={window.innerWidth <= 450 ? 13 : 14} 
                                    search={null} />
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </main>
        </div>
    )
};

export default ContactsModal;