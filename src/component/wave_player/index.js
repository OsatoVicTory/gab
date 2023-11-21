import { useState, useEffect } from 'react';
import WaveSurfer from 'wavesurfer.js';
import './styles.css';
import defaultImage from '../../images/avatar.png';
// import { BsPlayFill, BsPause } from 'react-icons/bs';
import { FaPlay } from 'react-icons/fa';
import { AiOutlinePause } from 'react-icons/ai';
import SkeletonLoader from '../loading/skeleton';

const WavePlayer = ({ 
    waveColor, progressColor, audio, waveHeight, audioDuration, userImg, _id 
}) => {

    const [state, setState] = useState('stopped');
    const [waveIsDrawn, setWaveIsDrawn] = useState(false);
    const [playingTime, setPlayingTime] = useState(0);
    const [wave, setWave] = useState();

    useEffect(() => { 
        const Wave = WaveSurfer.create({
            container: `#waveform-${_id}`,
            waveColor,
            progressColor,
            cursorColor: progressColor,
            cursorWidth: 4,
            barWidth: 3,
            barGap: 2,
            height: waveHeight||33,
            responsive: true,
        });
        setWave(Wave);

        // Wave.on('finish', () => stopPlaying());

        return () => { 
            Wave?.destroy(); 
            wave?.destroy(); 
        }

    }, []);

    useEffect(() => {
        if(wave) {
            wave.load(audio);
            wave.on('timeupdate', (currentTime) => setPlayingTime(currentTime));
            wave.on('redraw', () => {
                if(!waveIsDrawn) setWaveIsDrawn(true);
            });
            // wave.on('ready', (durationTime) => {
            //     if(!waveIsReady) setWaveIsReady(true);
            // });
            wave.on('finish', () => setState('stopped'));
        }
    }, [wave]);

    // useEffect(() => {
    //     const updateTime = () => setPlayingTime(Math.floor(audioRef.current.currentTime));
    //     if(state === 'playing') audioRef.current?.addEventListener('timeupdate', updateTime);
    //     return () => audioRef.current?.removeEventListener('timeupdate', updateTime);
    // }, [state]);

    function formatTime(time) {
        const zeros = (val) => val >= 10 ? val : '0'+val;
        const min = Math.floor(time / 60);
        const sec = Math.floor(time % 60);
        return `${zeros(min)}:${zeros(sec)}`;
    };

    function togglePlayPause() {
        wave?.playPause();
        if(state === 'playing') {
            // audioRef.current.pause();
            setState('paused');
        } else {
            // audioRef.current.play();
            setState('playing');
        }
    };

    return (
        <div className='wavePlayer'>
            <div className='wP__playpause' onClick={togglePlayPause}>
                {state === 'playing' ? 
                <AiOutlinePause className='wP__icon' /> : 
                <FaPlay className='wP__icon' />}
            </div>
            <div className={`wP__waveform__`}>
                <div className='_waveform_' id={`waveform-${_id}`}></div>
                {!waveIsDrawn && <div className='_waveform_loader_'>
                    <SkeletonLoader height={30} />
                </div>}
                <div className='_waveform_time'>
                    {formatTime(state === 'stopped' ? audioDuration : playingTime)}
                </div>
            </div>
            <div className='wP__img'>
                <img src={userImg||defaultImage} alt='dp' />
            </div>
        </div>
    )
};
export default WavePlayer;