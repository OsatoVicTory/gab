import TextWithEmoji from '../component/TextWithEmoji';
import { MdOutlineWifiTetheringErrorRounded } from 'react-icons/md';
// import { alphaNumeric, contactName } from './Chat';
import { AudioIcon, ImageIcon, LinkIcon } from '../component/Icons';
import { BiBlock } from 'react-icons/bi';

export const resData = (data, user) => {
    let res = [], x = 0;
    for(; x < data.length; x++) {
        if(user.pinned.includes(data[x].account._id)) {
            res.push({ ...data[x], pinned: true });
        }
    }
    x--;
    for(;x >= 0; x--) {
        if(!user.pinned.includes(data[x].account._id)) res.push(data[x]);
    }
    return res;
};

export const MessageIcon = ({ msg }) => {
    if(msg.isDeleted) {
        <BiBlock className='cspm_icon' />;
    } else if(msg?.images?.length > 0) {
        return <ImageIcon className={'cspm_icon'} />;
    } else if(msg.status_tagged) {
        return <MdOutlineWifiTetheringErrorRounded className='cspm_icon' />;
    }  else if(msg.link) {
        return <LinkIcon className={'cspm_icon'} />;
    } else if(msg.audio) {
        return <AudioIcon className={'cspm_icon'} />;
    } else {
        return undefined;
    }
};

export const MessageComponent = ({ msg }) => {
    if(msg.audio || msg?.images?.length > 0 || msg.link || 
        msg.status_tagged || msg.isDeleted) {
        return (
            <div className='cspm-message-media'>
                <MessageIcon msg={msg} />

                {msg.isDeleted ? 
                <span className={'txt-14 cspm-14'}>
                    This message was deleted
                </span> :
                msg.message ? 
                <TextWithEmoji text={msg.message} 
                CLX={'txt-14 cspm-14'} clx={'cspm-inner'}
                font={window.innerWidth <= 450 ? 14 : 15} search={null} /> : 
                <span className={'txt-14 cspm-14'}>
                    {msg.audio ? 'Audio' : 
                    msg.status_tagged ? 
                    (msg.status_tagged.text||msg.status_tagged.caption) :
                    msg.link ? msg.link.split('=')[0] : 'Image'}
                </span>}
                
            </div>
        )
    } else {
        return (
            <div className='cspm-message'>
                <TextWithEmoji text={msg.message} 
                CLX={'txt-14 cspm-14'} clx={'cspm-inner'}
                font={window.innerWidth <= 450 ? 14 : 15} 
                search={null} />
            </div>
        )
    }
};