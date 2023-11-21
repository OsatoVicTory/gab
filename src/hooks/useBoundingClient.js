import { useEffect, useState } from 'react';

const useBoundingClient = (eleRef, width, height, space) => {
    
    const initialize = () => {
        let { innerHeight, innerWidth } = window;
        let { top, bottom, right } = eleRef.getBoundingClientRect();
        if(innerHeight - top - (space||20) > height) {
            return { 
                top: `${top + (space||20)}px`, 
                right: `${Math.max(10, innerWidth - right - width)}px`
            };
        } else {
            return { 
                bottom: `${Math.max(20, innerHeight - bottom + (space||20))}px`, 
                right: `${Math.max(10, innerWidth - right - width)}px`
            };
        }
    }
    const [pos, setPos] = useState(initialize());

    const getPosition = () => {
        let { innerHeight, innerWidth } = window;
        let { top, bottom, right } = eleRef.getBoundingClientRect();
        if(innerHeight - top - (space||20) > height) {
            const res = { 
                top: `${top + (space||20)}px`, 
                right: `${Math.max(10, innerWidth - right - width)}px`
            };
            setPos(res);
        } else {
            const res = { 
                bottom: `${Math.max(20, innerHeight - bottom + (space||20))}px`, 
                right: `${Math.max(10, innerWidth - right - width)}px`
            };
            setPos(res);
        }
    };

    useEffect(() => {
        window.addEventListener('resize', getPosition, false);

        return () => window.removeEventListener('resize', getPosition, false);
    }, []);

    return pos;

};

export default useBoundingClient;