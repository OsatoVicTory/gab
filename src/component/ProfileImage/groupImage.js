import React, { useState, useEffect } from 'react';
import './styles.css';
import defaultImage from '../../images/img1.jpg';

const GroupImage = ({ img, id, socket }) => {
    const [url, setUrl] = useState(img);

    useEffect(() => {
        // socket.on('changedPicture', (data) => {
        //     if(data._id == id) {
        //         setUrl(data.img_url);
        //     }
        // });
        setUrl(img||defaultImage);
    }, []);

    return (
        <div className='profile__Img'>
            <div className='Img'>
                <img src={url||defaultImage} alt={url} />
            </div>
        </div>
    )
}

export default GroupImage;