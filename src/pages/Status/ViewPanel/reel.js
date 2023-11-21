import { useState, useEffect, useRef } from 'react';
import './styles.css';

const Reel = ({ data, index, setFinished, viewStatus, stopRef, stopperRef, timerRef }) => {

    const [time, setTime] = useState(0);
    // const timerRef = useRef();
    const timeRef = useRef(0);
     
    useEffect(() => {
        if(timerRef.current) clearInterval(timerRef.current);
        timeRef.current = 0;
        setFinished(0);
        setTime(0);
        
        if(viewStatus?.startsWith('completed')) {
            timerRef.current = setInterval(() => {
                if(!stopRef.current && !stopperRef.current) {
                    timeRef.current++;
                    if(timeRef.current >= 7) setFinished(7);
                    setTime(timeRef.current);
                }
            }, 1000);
        }

    }, [ viewStatus ]);

    const getProgressWidth = (_index) => {
        if(_index > index) return "0%";
        else if(_index === index) return `${((time / 6) * 100).toFixed(2)}%`; 
        else return "100%";
    };

    const getWidths = (len) => `calc(${(100 / len).toFixed(2)}% - 3px)`;

    return (
        <div className="trail__Track">
            {data.map((val, idx) => (
                <div className="trail" key={`reel-${idx}`} 
                style={{width: getWidths(data.length)}}>
                    <div style={{width: getProgressWidth(idx)}}></div>
                </div>
            ))}
        </div>
    )
};

export default Reel;