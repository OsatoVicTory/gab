import './components.css';
import { AudioIcon, CloseIcon, LinkIcon } from '../Icons';
import image from '../../images/link.jpg';
import SkeletonLoader from '../loading/skeleton';
import { contactName } from '../../utils/Chat';
import TextWithEmoji from '../TextWithEmoji';
import OptimizedImage from '../OptimizedImage';

export const Scrapped = ({ data, close, setData }) => {
    return (
        <div className='Footer__Scrapped'>
            <div className='Footer__Scrapped__Div'>
                <div className='fS_image'>
                    {/* <img src={image} alt='fs' /> */}
                    {data?.loaded ? <img src={data?.img||image} alt='site' 
                    onError={() => setData((prev) => ({ ...prev, img: image }))}/> :
                    <div className='fS_loader'><SkeletonLoader height={'100%'} /></div>}

                </div>
                <div className='fS_texts'>
                    <div className='fS_texts_top'>
                        {data?.loaded ? <span className='fS_title'>{data.title}</span> :
                        <div className='fS_loader'><SkeletonLoader height={20} /></div>}
                    </div>
                    <div className='fS_texts_mid'>
                        {data?.loaded ? <span className='fS_p'>{data.pTag}</span> :
                        <div className='fS_loader'><SkeletonLoader height={18} /></div>}
                    </div>
                    <div className='fS_texts_base'>
                        {data?.loaded ? <span className='fS_txt'>{data.site}</span> :
                        <div className='fS_loader'><SkeletonLoader height={15} /></div>}
                    </div>
                </div>
                <div className='fS_close' onClick={() => close()}>
                    <CloseIcon className={'fS_close_icon'} />
                </div>
            </div>
        </div>
    )
};

export const Tagged = ({ data, close, contacts }) => {
    return (
        <div className='Footer__Tagged'>
            <div className='Footer__Tagged__Div'>
                <span className='fT__thread'></span>
                <div className='fT_close' onClick={() => close()}>
                    <CloseIcon className={'fT_close_icon'} />
                </div>
                <div className={`fT__texts ${data.images.length > 0}`}>
                    <span className='fT_sender'>
                        {contactName(data.senderId, contacts) || data.senderPhoneNumber}
                    </span>
                    <div className='fT__message'>
                        {data.audio && <AudioIcon className={'fT_icon'} />}
                        {data.link && <LinkIcon className={'fT_icon'} />}
                        <TextWithEmoji text={data.message} CLX={'fT_txt'}
                        search={null} font={14} clx={'fT_txt_inner'} />
                    </div>
                    {data.images.length > 0 && <div className='fT__img'>
                        <OptimizedImage data={data.images[0]} />
                    </div>}
                </div>
            </div>
        </div>
    )
};

export const FooterImages = ({ images, setImages }) => {
    return (
        <div className='Footer__Images'>
            <div className='footer__Images'>
                {images.map((val, idx) => (
                    <div className='footer__Image' key={`fi-${idx}`}>
                        <img src={URL.createObjectURL(val)} alt='footer' />
                        <div className='fI_close' onClick={() => {
                            const filteredImages = [];
                            for(let i = 0; i < images.length; i++) {
                                if(i !== idx) filteredImages.push(images[i]);
                                else URL.revokeObjectURL(images[i]);
                            }
                            setImages(filteredImages);
                        }}>
                            <CloseIcon className={'fI_close_icon'} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
};