import { useState, useRef } from 'react';
import './status_setting.css';
import { CheckBoxChecked, CheckBoxBlank, CloseIcon, SendIcon } from '../../component/Icons';
import TextWithEmoji from '../../component/TextWithEmoji';
import defaultImage from '../../images/avatar.png';
import { useSelector, useDispatch } from 'react-redux';
import { setUserData, setStatusMessageData } from '../../store/actions';
import { bindActionCreators } from 'redux';
import { barUsers } from '../../services/user';
import { responseMessage } from '../../utils/others';
import LoadingSpinner from '../../component/loading/loading';
import useClickOutside from '../../hooks/useClickOutside';

const StatusSetting = ({ closeModal, socket }) => {

    const modalRef = useRef();
    const user = useSelector(state => state.user);
    const contacts = user.contacts.filter(c => c.userId !== user._id);
    const [selected, setSelected] = useState(contacts.filter(ct => ct.barred));
    const [contactsShowing, setContactsShowing] = useState(contacts);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const setUser = bindActionCreators(setUserData, dispatch);
    const setStatusMessage = bindActionCreators(setStatusMessageData, dispatch);

    useClickOutside(modalRef, () => closeModal());

    function handleChange(e) {
        const value = e.target.value.toLowerCase();
        if(!value) return setContactsShowing(contacts);
        else setContactsShowing([...contacts.filter(ct => (
            ct.userName.toLowerCase().includes(value) || 
            ct.phoneNumber.includes(value)
        ))]);
    };

    const clickCheck = (val) => {
        let res = [], found = false;
        for(var i = 0; i < selected.length; i++) {
            if(selected[i]._id === val._id) {
                found = true;
            } else res.push(selected[i]);
        }
        if(!found) res.push(val);
        setSelected(res);
    };

    const handleUpdate = () => {
        if(loading) return;
        setLoading(true);
        const okUsers = contacts.filter(sl => {
            return !selected.find(slc => slc._id === sl._id)
        }).map(ct => ct._id);
        barUsers(okUsers).then(res => {
            responseMessage('success', setStatusMessage, res);
            const contacts_data = user.contacts;
            const newContacts = [];
            for(let i = 0; i < contacts_data.length; i++) {
                if(okUsers.includes(contacts_data[i]._id)) {
                    newContacts.push({ ...contacts_data[i], barred: false });
                } else newContacts.push({ ...contacts_data[i], barred: true });
            }
            setUser({ contacts: newContacts });
            setLoading(false);
            closeModal();
        }).catch(err => {
            setLoading(false);
            responseMessage('error', setStatusMessage, err);
        })
    };

    return (
        <div className='StatusSetting' ref={modalRef}>
            <div className='Status__Setting'>
                <header>
                    <div className='sS_header_top'>
                        <span className='ssh_title'>
                            Hide status updates from
                        </span>
                        <div className='ssh_close' onClick={() => closeModal()}>
                            <CloseIcon className={'ssh_close_icon'} />
                        </div>
                    </div>
                    <div className='sS_header_search'>
                        <div className='sS_search'>
                            <input onChange={handleChange} placeholder='Search' />
                        </div>
                    </div>
                </header>
                <main>
                    <div className='sS__main hide_scroll_bar'>
                        <ul className='ss_main_lists'>
                            {contactsShowing.map((val, idx) => (
                                <li className='ss_main_list' key={`ss-${idx}`}>
                                    <div className='ssml_checkbox'
                                    onClick={() => clickCheck(val)}>
                                        {selected.find(ch => ch._id === val._id) ?
                                        <CheckBoxChecked className={'ssml_checkbox_icon'} /> :
                                        <CheckBoxBlank className={'ssml_checkbox_icon'} />}
                                    </div>
                                    <div className='ssml_img'>
                                        <img src={val.img||defaultImage} alt='dp' />
                                    </div>
                                    <div className='ssml_texts'>
                                        <span className='ssml_txt_17'>
                                            {val.userName}
                                        </span>
                                        <TextWithEmoji text={val.about} CLX={'ssml_txt_14'} 
                                        clx={'ssml_txt_inner'} font={13} search={null} />
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </main>
                <footer>
                    <div className='sS_footer'>
                        <div className='sS_footer_left'>
                            <div className='ssfl hide_scroll_bar'>
                                <ul className='ssfl_lists'>
                                    {selected.map((val, idx) => (
                                        <li className='ssfl_list' key={`ssfl-${idx}`}>
                                            <span>{val.userName}</span>
                                            <div className='ssfl_icon_div'
                                            onClick={() => clickCheck(val)}>
                                                <CloseIcon className={'ssfl_icon'} />
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                        <div className='sS_footer_right'>
                            <div className='sS_footer_send' onClick={handleUpdate}>
                                {!loading ? <SendIcon className={'ss_footer_send_icon'} /> :
                                <LoadingSpinner width={'15px'} height={'15px'} />}
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    )
};

export default StatusSetting;