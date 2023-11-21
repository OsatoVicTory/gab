import { useState, useEffect } from 'react';
import './styles.css';
import './content.css';
import TextWithEmoji from '../../../component/TextWithEmoji';
import image from '../../../images/img1.jpg';
import { LazyLoadImage } from "react-lazy-load-image-component";
import { Blurhash } from "react-blurhash";
import LoadingSpinner from '../../../component/loading/loading';
import { viewStatusReq } from "../../../services/status";
import { useSelector, useDispatch } from "react-redux";
import { responseMessage } from "../../../utils/others";
import { setStatusMessageData } from "../../../store/statusMessage";
import { bindActionCreators } from "redux";

const StatusContent = ({ data, viewStatus, setter, socket, stopRef }) => {

    const [isLoaded, setIsLoaded] = useState(false);
    const [isLoadStarted, setIsLoadStarted] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const dispatch = useDispatch();
    const user = useSelector(state => state.user);
    const setStatusMessage = bindActionCreators(setStatusMessageData, dispatch);

    const runViewStatus = async () => {
        if(error) {
            setError(false);
            setLoading(true);
        }
        try {
            stopRef.current = true;
            if(data.posterId !== user._id && !data.viewed) {
                await viewStatusReq(data._id);
                socket.emit('viewStatus', { 
                    time: String(new Date()), statusId: data._id,
                    viewerId: user._id, posterId: data.posterId, 
                });
            }
            setter(data._id, null);
            setLoading(false);
            stopRef.current = false;
        } catch (err) {
            setError(true);
            responseMessage('error', setStatusMessage, err);
            stopRef.current = true;
        }

    };
    
    useEffect(() => {
        if(viewStatus?.startsWith('running')) {
            setLoading(true);
            runViewStatus();
        } else {
            setLoading(false);
            stopRef.current = false;
        }
    }, [viewStatus]);

    const handleStop = () => {
        stopRef.current = !stopRef.current;
    };

    function getVars(length) {
        const width = Math.min(500, window.innerWidth);
        const fract = 1.373;
        if(length >= 160) return [(( (15 / 300) * width) / fract).toFixed(3), 'st-txt-160'];
        else if(length >= 30) return [(( (18 / 300) * width) / fract).toFixed(3), 'st-txt-30'];
        else return [(( (21 / 300) * width) / fract).toFixed(3), 'st-txt-1'];
    };

    const StatusContentWrite = () => {
        const [font, fontClass] = getVars(data.text.length);

        return (
            <div className='statusContentWrite' onClick={handleStop}>
                <div className={`sCW__Wrapper write`} style={{fontFamily: data.font}}>
                    <div className='sCW__Wrapper__Write hide_scroll_bar'>
                        <TextWithEmoji text={data.text} CLX={fontClass} 
                        clx={'cspm-inner'} font={font} search={null} />

                        {(!data.isDeleted && loading) && 
                        <div className='status__Content__Loading'>
                            <LoadingSpinner width={'20px'} height={'20px'} />
                        </div>}

                        {data.isDeleted && <div className='sc-centered-div deleted'>
                            Deleted by poster
                        </div>}

                        {(!data.isDeleted && error) && <div className='sc-centered-div' 
                        onClick={() => runViewStatus()}>
                            Error, click to reload
                        </div>}

                    </div>
                </div>
            </div>
        )
    };

    const StatusContentImage = () => {
        return (
            <div className='statusContentImage' onClick={handleStop}>
                <div className='sCI__Wrapper'>
                    <div className='sCI__Wrapper__Image'>
                        <LazyLoadImage 
                        src={data.img}
                        width={'100%'}
                        height={'100%'}
                        className={`sciwi__Image ${(loading||data.isDeleted) ? 'blur' : ''}`}
                        onLoad={() => {
                            setIsLoaded(true);
                            stopRef.current = false;
                        }}
                        beforeLoad={() => {
                            setIsLoadStarted(true);
                            stopRef.current = true;
                        }}
                        />
                        {!isLoaded && isLoadStarted && (
                            <div className="Hashed-image">
                                <Blurhash
                                    hash={data.hash}
                                    width={'100%'}
                                    height={'100%'}
                                    resolutionX={32}
                                    resolutionY={32}
                                    punch={1}
                                />
                            </div>
                        )}

                        {(!data.isDeleted && loading) && 
                        <div className='status__Content__Loading'>
                            <LoadingSpinner width={'20px'} height={'20px'} />
                        </div>}

                        {data.isDeleted && <div className='sc-centered-div deleted'>
                            Deleted by poster
                        </div>}

                        {(!data.isDeleted && error) && <div className='sc-centered-div' 
                        onClick={() => runViewStatus()}>
                            Error, click to reload
                        </div>}

                    </div>
                </div>
            </div>
        )
    };

    return (
        <div className='statusContent'>
            {data?.img ? <StatusContentImage /> : <StatusContentWrite />}
        </div>
    )
};

export default StatusContent;