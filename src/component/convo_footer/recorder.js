import { useState, useRef, useEffect } from 'react';
import './recorder.css';
import { AudioIcon, SendIcon } from '../Icons'
import { MdPlayArrow, MdSend, MdDelete } from 'react-icons/md';
import { AiOutlinePause } from 'react-icons/ai';
import { BiSolidTrashAlt, BiSolidMicrophone } from 'react-icons/bi';
import { BsFillPlayFill, BsPause, BsTrashFill, BsFillMicFill, BsFillEyeFill, BsPlayFill } from 'react-icons/bs';
import RecordHook from '../../hooks/useWave';
import LoadingSpinner from '../loading/loading';
import { randomId } from '../../utils/Chat';

const RecorderCapture = ({ 
    close, account, user, tagged, setTagged,
    socket, setChats, setShowEmoji, setStatusMessage 
}) => {

    const waveRef = useRef(null);
    const audioRef = useRef(null);
    const canvasRef = useRef(null);
    const [sendLoading, setSendLoading] = useState(false);
    const [audioToSend, setAudioToSend] = useState(null);
    const width = 120;
    const height = 50;

    const formatTime = (time) => {
        const zeros = (val) => val >= 10 ? val : '0'+val;
        const min = Math.floor(time / 60);
        const sec = time % 60;
        return `${zeros(min)}:${zeros(sec)}`;
    };

    const {
        recordedAudio, isRecording, recordingTime, isPlaying, hasStopped, 
        playbackTime, totalDuration, haltRecording, resumeRecording, 
        stopRecordingAndSend, handlePauseRecording, handlePlayRecording, 
    } = RecordHook(
        audioRef, canvasRef, waveRef, 3, 50, width, height, 
        '#A5A4A4', setAudioToSend, close
    );

    useEffect(() => {
        if(audioToSend) send();
    }, [audioToSend]);

    const send = async () => {
        try {
            const audio = audioToSend;
            setSendLoading(true);
            const formData = {};
            if(tagged) {
                const taggedData = {
                    ...tagged, 
                    images: tagged?.images?.length > 0 ? [tagged.images[0]] : [],
                }
                formData.tagged = taggedData;
            }
            formData.reactions = [];
            formData.images = [];
            formData.senderId = user._id;
            formData.senderPhoneNumber = user.phoneNumber;
            formData.senderColor = user.userColor;
            formData.receiverId = account._id;
            formData.audio = audio;
            formData.audioDuration = totalDuration;
            formData.createdAt = String(new Date());
            formData._id = randomId();
            const userAcct = { ...user, contacts: '' };
            socket.emit('sendMessage', { message: formData, sender: userAcct });
            setChats('iSend', account, formData);
            setTagged(null);
            setStatusMessage({type:'success',text:'Message sent successfully'});
            setSendLoading(false);
            setShowEmoji(false);
            close();
        } catch (err) {
            setStatusMessage({type:'error',text:'Error sending VN. Check internet and try again'});
            setSendLoading(false);
            setShowEmoji(false);
        }
    };


    return (
        <div className='waveform__Capture'>
            <div className='waveform__Capture__Wrapper'>
                <MdDelete className='wf-icons' onClick={() => close()} />

                <div className='wave__form'>
                    {!isRecording && <div className='wave_form_playpause'>
                        {isPlaying ?
                            <AiOutlinePause className='wf-icons' 
                            onClick={() => handlePauseRecording()}/> :
                            <BsPlayFill className='wf-icons' 
                            onClick={() => handlePlayRecording()} />
                        }
                    </div>}
                    <div className={`wave__form__ recorder ${isRecording&&'isRecording'}`}>
                        <canvas ref={canvasRef} height={`${height}`} width={`${width}`} />
                    </div>
                    <div className={`wave__form__ player ${isRecording&&'isRecording'}`}>
                        <div className={`wave__form__player__`} ref={waveRef} />
                    </div>
                    <div className="wave__form__text fnt-400 grey">
                        {formatTime(!isRecording ? playbackTime : recordingTime)}
                    </div>
                </div>

                {isRecording ? 
                    <BsPause className='wf-icons red' 
                    onClick={() => haltRecording()} /> :
                    <BiSolidMicrophone className='wf-icons red' 
                    onClick={() => resumeRecording()} />
                }

                <div className='waveform__Send' onClick={() => stopRecordingAndSend()}>
                    {!sendLoading ? <MdSend className='wf-icons' /> :
                    <LoadingSpinner width={'18px'} height={'18px'} />} 
                </div>

                <audio ref={audioRef} hidden />
            </div>
        </div>
    )
}

export default RecorderCapture;