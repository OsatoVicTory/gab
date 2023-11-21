import { useState } from 'react';
import linkImg from '../../../images/link.jpg';
import SkeletonLoader from '../../loading/skeleton';
import './content.css';
// import { LazyLoadImage } from "react-lazy-load-image-component";


const Scrapped = ({ data }) => {

    const [isLoaded, setIsLoaded] = useState(false);
    // const [isLoadStarted, setIsLoadStarted] = useState(false);
    const [error, setError] = useState(false);
    function handleError() {
        setError(true);
        setIsLoaded(true);
    };

    return (
        <div className='Scrapped' onClick={() => window.open(data.site, '_blank')}>
            <div className='scrapped__img'>
                {!error ? <img src={data.img||linkImg} alt='scrapped' 
                onLoad={() => setIsLoaded(true)} loading='lazy' onError={handleError} /> :
                <img src={linkImg} alt='scrapped-default' />}

                {!isLoaded && <div className='scrapped_img_loading'>
                    <SkeletonLoader height={70} />
                </div>}
                
            </div>
            <div className='scrapped__text'>
                <span className='sT_title'>{data.title}</span> 
                <span className='sT_p'>{data.pTag}</span>
                <span className='sT_txt'>{data.site}</span> 
            </div>
        </div>
    )
};

export default Scrapped;