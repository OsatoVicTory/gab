import React, { useState, useEffect } from "react";
import "./alert.css";
import { MdCancel } from "react-icons/md";
import { useSelector, useDispatch } from "react-redux";
import { bindActionCreators } from "redux";
import { setStatusMessageData } from '../../store/actions';
import { AiFillCheckCircle } from "react-icons/ai";

const Alerter = () => {
    const alert = useSelector(state => state.statusMessage);
    const [prompt, setPrompt] = useState(false);
    const dispatch = useDispatch();
    const setStatusMessage = bindActionCreators(setStatusMessageData, dispatch);

    useEffect(() => {
        if(alert.text) {
            setPrompt(true);
            setTimeout(() => { 
                setStatusMessage({type:alert.type,text: null});
                setPrompt(false); 
            }, 1500);
        }
    }, [alert.text, alert.type]);

    return (
        <div className={`Alerter ${prompt} bg-white`}>
            <div className="Alerter-container">
                {alert.type === 'success' ?
                    <AiFillCheckCircle className="alerter-svg check" /> :
                    <MdCancel className="alerter-svg danger" /> 
                }
                <span>{alert.text}</span>
            </div>
        </div>
    );
}

export default Alerter;