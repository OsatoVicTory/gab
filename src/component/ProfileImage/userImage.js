import React, { useState, useEffect } from 'react';
import './styles.css';
import defaultImage from '../../images/avatar.png';

const UserImage = ({ img, id, socket, status }) => {
    const [url, setUrl] = useState(img||defaultImage);

    useEffect(() => {
        if(img) setUrl(img);
        return () => {
            if(url && typeof url === 'object') URL.revokeObjectURL(url);
        }
    }, [img]);

    return (
        <div className='profile__Img'>
            <div className={`Img ${status}`}>
                <img alt={`profile-avatar`} 
                src={url && typeof url === 'object' ? URL.createObjectURL(url) : url} />
            </div>
        </div>
    )
}

export default UserImage;