import React, { useState, useEffect } from 'react';
import { AiOutlineArrowLeft } from 'react-icons/ai';
import OptimizedImage from '../../../component/OptimizedImage';
import { getImagesWithTime } from '../../../utils/helpers';
import './images.css';
import { useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setFixedImagesData } from '../../../store/actions';
import LoadingSpinner from '../../../component/loading/loading';

const ProfileImages = ({ data, closePage }) => {

    const dispatch = useDispatch();
    const setFixedImages = bindActionCreators(setFixedImagesData, dispatch);
    const [images, setImages] = useState([]);
    const [loaded, setLoaded] = useState(false);

    const dispatchImage = (index) => {
        setFixedImages({
            type: 'image',
            index: index,
            images: data,
        })
    }
    useEffect(() => {
        getImagesWithTime(data, setImages, setLoaded);
        
    }, []);

    return (
        <div className='profileImages'>
            <div className='pI__Content'>
                <div className='pic-header'>
                    <div className='pic-icon-div left-arrow' onClick={() => closePage()}>
                        <AiOutlineArrowLeft className='pic-icon' />
                    </div>
                    <span className='fnt-500 bold white'>Images</span>
                </div>
                <div className='pic-main'>
                    {!loaded && <div className='pic-loading'>
                        <LoadingSpinner width={'30px'} height={'30px'} />
                    </div>}
                    {loaded && <ul className='pic-lists'>
                        {images.map((val, idx) => (
                            <li key={`pic-list-${idx}`} 
                            className={`pic-list ${val.month&&'true'}`}>
                                {val.month && <div className='pic-list-div-month white'>
                                    {val.month}
                                </div>}
                                {/* // dont change val.idx as that is what really maps
                                // its index to data array, images contains months 
                                // that could have changed index */}
                                {!val.month && <div className='pic-list-div'
                                onClick={() => dispatchImage(val.idx)}>
                                    <OptimizedImage data={val.img} />
                                </div>}
                            </li>
                        ))}
                    </ul>}
                </div>
            </div>
        </div>
    );
}

export default ProfileImages;