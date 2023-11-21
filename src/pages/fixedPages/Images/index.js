import React, { useEffect, useState, useRef } from 'react';
import './styles.css';
import { useSelector } from 'react-redux';
import OptimizedImage from '../../../component/OptimizedImage';
import { getImages } from '../../../utils/helpers';
import { AiOutlineArrowLeft } from 'react-icons/ai';
import { MdKeyboardArrowLeft, MdKeyboardArrowRight, MdKeyboardArrowUp } from 'react-icons/md';
import { contactName } from '../../../utils/Chat';
import { formatDateTimeFromDate } from '../../../utils/formatters';
import defaultImage from '../../../images/avatar.png';
import CaptionModal from '../../../modals/ExoModals/caption';

const FixedImages = ({ data, closePage }) => {

    const image = data;
    const user = useSelector(state => state.user);
    const chats = useSelector(state => state.chats);
    const [images, setImages] = useState(image?.images||[]);
    const [index, setIndex] = useState(image?.index||0);
    const participantsRef = useRef(null);
    const [showCaption, setShowCaption] = useState(false);

    useEffect(() => {
        if(images.length > 0) {
            // when we come from images of profile page
            // we already have data of all images and the cur image index
            // so just have already used that
        } else {
            const d = getImages(image, chats.data, setImages, setIndex);
            let participantsMap = d[2];
            if(!participantsMap.has(user._id)) {
                participantsMap.set(user._id, { ...user, contacts: null, groups: null });
            }
            participantsRef.current = participantsMap;
        }

    }, []);

    useEffect(() => {
        const ele = document.getElementById(`if-images-${index}`);
        if(ele) ele.scrollIntoView({ behavior: "smooth" });
    }, [index]);

    const getInfo = () => {
        if(!participantsRef.current) return {};
        return participantsRef.current.get(images[index]?.senderId||image.senderId)||{};
    };

    return (
        <div className='Images_fixed'>
            <div className='IF_Wrapper'>
                <div className='IF_Content'>
                    <div className='if-header'>
                        <div className='if-close' onClick={() => closePage()}>
                            <AiOutlineArrowLeft className='if-icon' />
                        </div>
                        <img src={getInfo().img||defaultImage} alt='if' />
                        <div className='if-header-txts'>
                            <span className='fnt-400 bold white'>
                                {contactName(getInfo()._id, user.contacts)}
                            </span>
                            <span className='fnt-300 grey'>
                                {formatDateTimeFromDate(images[index]?.createdAt||image.createdAt)}
                            </span>
                        </div>
                    </div>
                    <div className='if-main'>
                        {(images.length > 0 && index > 0) && 
                        <div className='if-abs left'
                        onClick={()=> setIndex(prev => Math.max(0, prev - 1))}>
                            <MdKeyboardArrowLeft className='if-abs-icon' />
                        </div>}

                        <div className='if__Img'>
                            <div className='if-img'>
                                <OptimizedImage 
                                data={images.length > 0 ? images[index].img : image.image} />
                            </div>
                        </div>

                        {(images.length > 0 && index < images.length - 1) && 
                        <div className='if-abs right'
                        onClick={()=> setIndex(prev => Math.min(images.length - 1, prev + 1))}>
                            <MdKeyboardArrowRight className='if-abs-icon' />
                        </div>}
                    </div>
                    <div className='if-footer'>
                        <div className='if-absolute-base'>
                            {(images[index]?.message||image.message) &&
                            <div className='if-caption'>
                                <div className='if-absolute-caption' 
                                onClick={() => setShowCaption(true)}>
                                    <MdKeyboardArrowUp className='if-absolute-icon' />
                                    <span>Show Caption</span>
                                </div>
                            </div>}
                            {/* add other images when fetched */}
                            {images.length > 0 && <div className='if-images'>
                                <div className='if-images__'>
                                    <div className={`if-images-overflow`}>
                                        {images.map((val, idx) => (
                                            <div className={`if-images-list ${idx===index}`}
                                            id={`if-images-${idx}`} key={`if-${idx}`}
                                            onClick={() => setIndex(idx)}>
                                                <OptimizedImage data={val.img} />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>}
                        </div>
                    </div>
                </div>
            </div>

            <span><CaptionModal showModal={showCaption ? 'show' : ''} 
            caption={images[index]?.message||image.message||''} 
            closeModal={() => setShowCaption(false)} width={window.innerWidth} /></span>

        </div>
    );
};

export default FixedImages;