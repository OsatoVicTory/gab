import { useState, useRef } from 'react';
// import WaveHook from "./hook";
import './new.css';
import { MdPlayArrow, MdSend, MdDelete } from 'react-icons/md';
import { AiOutlinePause } from 'react-icons/ai';
import { BiSolidTrashAlt } from 'react-icons/bi';
import { BsFillPlayFill, BsPause, BsTrashFill, BsFillMicFill, BsFillEyeFill, BsPlayFill } from 'react-icons/bs';
import RecordHook from './hook';

const WaveCapture = ({ show, close }) => {

    const waveRef = useRef(null);
    const audioRef = useRef(null);
    const canvasRef = useRef(null);
    const width = 130;
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
    } = RecordHook(audioRef, canvasRef, waveRef, 3, 50, width, height, '#A5A4A4', close);

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
                    <BsFillMicFill className='wf-icons red' 
                    onClick={() => resumeRecording()} />
                }

                <div className='waveform__Send' onClick={() => stopRecordingAndSend()}>
                    <MdSend className='wf-icons' /> 
                </div>

                <audio ref={audioRef} hidden />
            </div>
        </div>
    )
}

export default WaveCapture;