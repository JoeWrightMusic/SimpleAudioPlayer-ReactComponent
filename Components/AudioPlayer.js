import React, {useState, useRef, useEffect} from "react"
import styles from "../Styles/AudioPlayer.module.css"
import {MdKeyboardArrowLeft, MdKeyboardArrowRight} from "react-icons/md"
import {IoPlayOutline} from "react-icons/io5"
import {IoPauseOutline} from "react-icons/io5"


function AudioPlayer(){
    // state
    const [isPlaying, setIsPlaying] = useState(false);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);

    // references
    const audioPlayer = useRef(); //reference audio component
    const progressBar = useRef(); //reference progress bar
    const animationRef = useRef(); //reference animation

    // effect
    useEffect(() => {
        const seconds = Math.floor(audioPlayer.current.duration)
        setDuration(seconds)
        progressBar.current.max = seconds;
    }, [audioPlayer?.current?.loadedmetadata, audioPlayer?.current?.readyState]);

    const onLoadedMetadata = () => {
        const seconds = Math.floor(audioPlayer.current.duration)
        setDuration(seconds)
        progressBar.current.max = seconds;
    }

    //calc time
    const calculateTime = (secs) => {
        const minutes = Math.floor(secs/60)
        const returnMinutes = minutes<10 ? `0${minutes}` : `${minutes}`
        const seconds = Math.floor(secs%60)
        const returnSeconds = seconds<10 ? `0${seconds}` : `${seconds}`
        return `${returnMinutes}:${returnSeconds}`
    }

    //toggle playback
    const togglePlayPause = () => {
        const prevPlayValue = isPlaying;
        setIsPlaying(!prevPlayValue)
        if(!prevPlayValue){
            audioPlayer.current.play();
            animationRef.current = requestAnimationFrame(whilePlaying)
        } else {
            audioPlayer.current.pause();
            cancelAnimationFrame(animationRef.current)
        }
    }

    const whilePlaying = () => {
        progressBar.current.value = audioPlayer.current.currentTime
        changePlayerCurrentTime()
        if (audioPlayer.current.ended){
            setIsPlaying(false)
        }
        animationRef.current = requestAnimationFrame(whilePlaying)

    }

    //change range
    const changeRange = () => {
        audioPlayer.current.currentTime = progressBar.current.value
        changePlayerCurrentTime();
    }

    const changePlayerCurrentTime = () => {
        progressBar.current.style.setProperty('--seekBeforeWidth', `${progressBar.current.value / duration * 100}%`)
        setCurrentTime(progressBar.current.value)
    }


    //30s nav buttons
    const backThirty = () => {
        progressBar.current.value = Number(progressBar.current.value - 30)
        changeRange();
    }
    const forwardThirty = () => {
        progressBar.current.value = Number(progressBar.current.value + 30)
        changeRange();
    }

    
    return(
        <div className={styles.audioPlayer}>
            <audio 
                src=">>LINK TO SF HERE<<" 
                preload="metadata"
                ref={audioPlayer}
                onLoadedMetadata={onLoadedMetadata}
            />
            {/* TRANSPORT */}
            <button 
                className={styles.forwardBackward}
                onClick={backThirty}
            >
                <MdKeyboardArrowLeft/> 30
            </button>
            <button
                onClick={togglePlayPause}
                className={styles.playPause}
            >
                {isPlaying ? <IoPauseOutline/> : <IoPlayOutline className={styles.play}/>}
            </button>
            <button 
                className={styles.forwardBackward}
                onClick={forwardThirty}
            >
                30 <MdKeyboardArrowRight/>
            </button>

            {/* CURRENT TIME */}
            <div className={styles.currentTime}>{calculateTime(currentTime)}</div>

            {/* PROGRESS BAR */}
            <div>
                <input 
                    className={styles.progressBar} 
                    type="range"
                    defaultValue="0"
                    ref={progressBar}
                    onChange={changeRange}
                />
            </div>
            {/* DURATION */}
            <div className={styles.duration}>
                {!isNaN(duration) ? calculateTime(duration) : "loading..."}
            </div>

        </div>
    )
}

export default AudioPlayer 