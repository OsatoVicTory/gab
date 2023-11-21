import React from 'react';
import { CircularProgressbarWithChildren, buildStyles } from 'react-circular-progressbar';
import RadialSeperators from './RadialSeperators';
// import OptimizedImage from '../OptimizedImage';
import defaultImage from '../../images/avatar.png';
import './styles.css';

const Image = ({ len, viewed, image }) => {
    
    const cover = ((viewed / len) * 100).toFixed(2);

    return (
        <div className='circular__Progressbar'>
            <CircularProgressbarWithChildren value={cover}
            strokeWidth={5} styles={buildStyles({
                strokeLinecap: 'butt', trailColor: '#25d366', pathColor: '#A5A4A4',
            })}>
                {<div className='inner-image'>
                    <img src={image || defaultImage} alt='dp' />
                </div>}

                {len > 1 && <RadialSeperators count={len}
                style={{background: 'white', width: '3px', height: '5px'}} />}
            </CircularProgressbarWithChildren>
        </div>
    )
}

export default Image;