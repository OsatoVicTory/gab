// import { useState, useRef, useEffect } from 'react';
import '../index.css';
import image from '../images/noData.jpg';

const NoData = ({ page, text }) => {

    return (
        <div className='NoData__'>

            <span className='fnt-500'>
                {text ? 
                    text :
                    page ? 
                    'How you get this link ...' :
                    'How you get this ID ...'
                }
            </span>
            <img src={image} alt='explain-tire' />
        </div>
    )
};

export default NoData;