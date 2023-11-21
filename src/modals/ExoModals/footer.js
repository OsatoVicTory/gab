import { 
    CloseIcon, MessageIcon, AudioIcon, 
    VideoIcon, ImageIcon, LinkIcon 
} from '../../component/Icons';
import OptimizedImage from '../../component/OptimizedImage';
import './others.css';
import TextWithEmoji from '../../component/TextWithEmoji';

const MediaIcon = ({ type, clx }) => {
    if(type === 'Message') return <MessageIcon className={clx} />;
    else if(type === 'Photo') return <ImageIcon className={clx} />;
    else if(type === 'Audio') return <AudioIcon className={clx} />;
    else if(type === 'Link') return <LinkIcon className={clx} />;
    else return <VideoIcon className={clx} />;
};

const LeftPane = ({ data, type }) => {
    if(type === 'Photo') return <OptimizedImage data={data} />;
    // else return <VideoPreview data={data} />;
}

const ForwardFooter = ({ type, media, msg }) => {
    return (
        <div className='ForwardFooter'>
            {media && <div className='ffi-image'>
                <LeftPane type={type} data={media} />
            </div>}
            <div className={`ffi-main ${media && true}`}>
                <div className='ffi-close'>
                    <CloseIcon className={'ffi-close-icon'} />
                </div>
                <div className='ffim-top'>
                    <MediaIcon clx={'ffim-icon'} type={type} />
                    <span className='txt-14 bold'>{type}</span>
                </div>
                {msg && <TextWithEmoji text={msg} font={16} 
                CLX={'ffim-base txt-14'} clx={'txt-inner'} search={null} />}
            </div>
        </div>
    )
};

export default ForwardFooter;