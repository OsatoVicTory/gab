import { useRef, useState, useEffect } from 'react';
import WaveSurfer from 'wavesurfer.js';

const RecordHook = (
    audioRef, canvasRef, waveRef, WIDTH, 
    HEIGHT, CANVAS_WIDTH, CANVAS_HEIGHT, COLOR, setAudioToSend, close
) => {
    const [isRecording, setIsRecording] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [recordedAudio, setRecordedAudio] = useState(null);
    const [wave, setWave] = useState(null);
    const [recordingTime, setRecordingTime] = useState(0);
    const [totalDuration, setTotalDuration] = useState(0);
    const [playbackTime, setPlaybackTime] = useState(0);
    const rec = useRef();
    const animation = useRef();
    const streamRef = useRef();
    const sourceRef = useRef();
    const audioContextRef = useRef();
    const x = useRef(30);
    const ctrl = useRef();
    const timeRef = useRef();
    const px = 'px';
    const posRef = useRef(130);
    const chunkBucket = useRef([]);
    const nodesRef = useRef([]);
    const amplitudeRef = useRef(new Array(26).fill(0));
    const ctx = useRef();
    const blobRef = useRef();

    useEffect(() => { 
        const Wave = WaveSurfer.create({
            container: waveRef.current,
            waveColor: '#A5A4A4',
            progressColor: '#25d366',
            cursorColor: '#25d366',
            cursorWidth: 4,
            barWidth: 3,
            barGap: 2,
            height: 50,
            responsive: true,
        });
        setWave(Wave);
        timeRef.current = setInterval(() => {
            if(rec.current?.state === 'recording') {
                setRecordingTime((prev) => prev + 1);
                setTotalDuration((prev) => prev + 1);
            }
        }, 1000);

        Wave.on('finish', () => stopPlaying());

        return () => { 
            // cancelAnimationFrame(animation.current);
            clearInterval(animation.current);
            sourceRef.current?.disconnect();
            audioContextRef.current?.close();
            if(rec.current?.state === 'recording') rec.current.stop();
            streamRef.current?.getTracks().forEach((track) => track.stop());
            Wave.destroy();
            wave?.destroy();
            URL.revokeObjectURL(blobRef.current);
            clearInterval(timeRef.current);
        }; 
    }, []);

    useEffect(() => {
        if(wave) start();
    }, [wave]);

    useEffect(() => {
        const updateTime = () => setPlaybackTime(Math.floor(recordedAudio.currentTime));
        if(recordedAudio) recordedAudio.addEventListener('timeupdate', updateTime);
        return () => recordedAudio?.removeEventListener('timeupdate', updateTime);
    }, [recordedAudio]);

    const stopPlaying = () => {
        setIsPlaying(false);
        wave?.stop();
        // do nothing
    };

    const start = () => {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
        if(canvasRef.current.getContext) ctx.current = canvasRef.current.getContext('2d');
        setIsRecording(true);
        navigator.mediaDevices.getUserMedia({ audio: true, video: false }).then((stream) => {
            renderStream(stream);
            rec.current = new MediaRecorder(stream);
            audioRef.current.srcObject = stream;
            rec.current.ondataavailable = (e) => chunkBucket.current.push(e.data);
            rec.current.onpause = () => {
                console.log('paused');
                const blob = new Blob(chunkBucket.current, { type: 'audio/ogg; codecs=opus' });
                const audioUrl = URL.createObjectURL(blob);
                blobRef.current = blob;
                const audio = new Audio(audioUrl);
                setRecordedAudio(audio);
                wave.load(audioUrl);
            };
            rec.current.onstop = () => {
                console.log('stopped');
                const blob = new Blob(chunkBucket.current, { type: 'audio/ogg; codecs=opus' });
                const audioUrl = URL.createObjectURL(blob);
                setAudioToSend(audioUrl);
            };
            rec.current.start();
        }).catch(err => {
            setIsRecording(false);
            console.log(err)
        });
    };

    const renderStream = (stream) => {
        streamRef.current = stream;
        sourceRef.current = audioContextRef.current.createMediaStreamSource(stream);
        const analyser = audioContextRef.current.createAnalyser();
        sourceRef.current.connect(analyser);
        analyser.fftSize = 256;
        const dataArray = new Uint8Array(analyser.fftSize);

        const render = () => {
            if(ctrl.current === 'stop') return;
            analyser.getByteFrequencyData(dataArray);
            renderCanvas(dataArray, 0);
        }
        render();
        animation.current = setInterval(render, 100);
    };

    const renderCanvas = (dataArray, dur) => {
        if(!ctx.current) return;
        const sum = dataArray.reduce((acc, val) => acc + val, 0);
        const pitch = sum / (dataArray.length||1);
        const barHeight = Math.max(1, (HEIGHT * (pitch / 50)).toFixed(2));
        let T = 25;
        const arr = [];
        while(T) arr[T - 1] = amplitudeRef.current[T--];
        arr[25] = barHeight - 0;
        ctx.current.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        T = 0;
        while(T < 26) {
            ctx.current.fillStyle = COLOR;
            ctx.current.fillRect(
                T * (WIDTH + 2), 
                Math.floor((HEIGHT - arr[T]) / 2), 
                WIDTH, arr[T]
            );
            T++;
        }
        
        amplitudeRef.current = arr;
    };
    
    const haltRecording = () => {
        if(rec.current?.state === 'recording') {
            rec.current.requestData();
            rec.current.pause();
            wave.stop();
            ctrl.current = 'stop';
            setIsRecording(false);
        } 
    };

    const handlePlayRecording = () => {
        if(recordedAudio) {
            wave.play();
            recordedAudio.play();
            setIsPlaying(true);
        } 
    };
    const handlePauseRecording = () => {
        if(!rec.current) return;
        wave.pause();
        recordedAudio.pause();
        setIsPlaying(false);
    };
    const resumeRecording = () => {
        if(rec.current?.state !== 'recording') {
            if(!rec.current?.resume) return;
            setIsRecording(true);
            rec.current?.resume();
            ctrl.current = 'resume';
        }
    };

    const stopRecordingAndSend = () => {
        setIsRecording(false);
        rec.current?.stop();
    };

    return {
        recordedAudio, isRecording, recordingTime, isPlaying,   
        playbackTime, haltRecording, resumeRecording, totalDuration, 
        handlePlayRecording, stopRecordingAndSend, handlePauseRecording
    };
}

export default RecordHook;