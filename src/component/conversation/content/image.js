import React from 'react';
import './image.css';
import OptimizedImage from '../../OptimizedImage';
import { setFixedImagesData } from "../../../store/actions";
import { useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';

const MessageImage = ({ message }) => {

    const dispatch = useDispatch();
    const setFixedImages = bindActionCreators(setFixedImagesData, dispatch);
    const { images } = message;
    const lengthWord = ['zero','one','two','three','four'];

    const dispatchImage = (index) => {
        setFixedImages({
            ...message,
            type: 'image',
            image: images[index],
            images: null,
        })
    }

    return (
        <div className={`MessageImage ${lengthWord[images.length]||'four'}`}>
            {images.slice(0, 4).map((val, idx) => (
                <div className={`message__Image_${lengthWord[idx + 1]||'four'}`}
                key={`message-image-${idx}`} onClick={() => dispatchImage(idx)}>
                    <OptimizedImage data={val} />
                    {(images.length > 4 && idx === 3) && <div className='img__Abs'>
                        <span className='img-abs-text'>
                            +{images.length - 4}
                        </span>
                    </div>}
                </div>
            ))}
        </div>
    )
}

export default MessageImage;