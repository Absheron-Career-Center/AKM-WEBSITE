import React, { useRef, useState, useEffect } from 'react'
import BackwardImg from '../../../assets/svg/gobackward.10.svg'
import ForwardImg from '../../../assets/svg/goforward.10.svg'
import PlayImg from '../../../assets/svg/play.svg'
import PauseImg from '../../../assets/svg/pause.svg'
import SpeakerWave3Img from '../../../assets/svg/speaker.wave.3.svg'
import SpeakerWave2Img from '../../../assets/svg/speaker.wave.2.svg'
import SpeakerWave1Img from '../../../assets/svg/speaker.wave.1.svg'
import SpeakerWave0Img from '../../../assets/svg/speaker.svg'
import SpeakerOffImg from '../../../assets/svg/speaker.slash.svg'

const Video = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [currentVideoId, setCurrentVideoId] = useState("V1weM308rZ0");
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [progress, setProgress] = useState(0);
    const [volume, setVolume] = useState(50);
    const [showVolumeSlider, setShowVolumeSlider] = useState(false);

    const playerRef = useRef(null);
    const playerRefReal = useRef(null); 
    const progressInterval = useRef(null);
    const volumeTimeout = useRef(null);
    const isPlayerReady = useRef(false);

    const videoPlaylist = [
        { id: "V1weM308rZ0", title: "Abşeron Logistika Mərkəzinə səyahət" },
        { id: "PmhuEW9U88E", title: "Korporativ yeni il tədbiri" },
        { id: "9me_E4Y6cds", title: "2024 - sürətli inkişaf və böyük addımlar ili" },
        { id: "rmiyKn_79Ts", title: "Gələcəyimizə qayğı ilə ili" },
        { id: "wznmZBX9Ek0", title: "Abşeron Logistika Mərkəzi - tanıtım" },
        { id: "IWaJEkVE1jY", title: "Abşeron Logistika Mərkəzi – Biznesiniz üçün etibarlı dəstək!" },
    ];

    const formatTime = (time) => {
        if (isNaN(time) || time === Infinity || time === undefined) return "0:00";
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    const startProgressTracking = () => {
        if (progressInterval.current) clearInterval(progressInterval.current);
        progressInterval.current = setInterval(() => {
            if (playerRefReal.current && playerRefReal.current.getCurrentTime && isPlayerReady.current) {
                try {
                    const time = playerRefReal.current.getCurrentTime();
                    const dur = playerRefReal.current.getDuration();
                    if (!isNaN(time) && !isNaN(dur)) {
                        setCurrentTime(time);
                        setDuration(dur);
                        setProgress((time / dur) * 100);
                    }
                } catch (e) {
                    console.error("Error getting player time:", e);
                }
            }
        }, 250);
    };

    const handleProgressClick = (e) => {
        if (!playerRefReal.current || !isPlayerReady.current) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const seekPercentage = (e.clientX - rect.left) / rect.width;
        const seekTime = duration * seekPercentage;

        playerRefReal.current.seekTo(seekTime, true);
        setCurrentTime(seekTime);
        setProgress(seekPercentage * 100);
    };

    useEffect(() => {
        if (window.YT) {
            initializePlayer();
            return;
        }

        const tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        document.body.appendChild(tag);
        window.onYouTubeIframeAPIReady = initializePlayer;

        return () => {
            if (progressInterval.current) clearInterval(progressInterval.current);
            if (volumeTimeout.current) clearTimeout(volumeTimeout.current);
            if (playerRefReal.current) playerRefReal.current.destroy();
        };
    }, []);

    const initializePlayer = () => {
        playerRefReal.current = new window.YT.Player(playerRef.current, {
            videoId: currentVideoId,
            playerVars: {
                autoplay: 0,
                controls: 0,
                disablekb: 1,
                fs: 0,
                modestbranding: 1,
                rel: 0
            },
            events: {
                'onReady': onPlayerReady,
                'onStateChange': onPlayerStateChange
            }
        });
    };

    const onPlayerReady = (event) => {
        isPlayerReady.current = true;
        startProgressTracking();
        event.target.setVolume(volume);
        setDuration(event.target.getDuration());
    };

    const onPlayerStateChange = (event) => {
        const playerState = event.data;
        setIsPlaying(playerState === window.YT.PlayerState.PLAYING);

        if (playerState === window.YT.PlayerState.PLAYING) {
            startProgressTracking();
        } else {
            if (progressInterval.current) clearInterval(progressInterval.current);
        }

        if (playerRefReal.current && playerRefReal.current.getCurrentTime) {
            const time = playerRefReal.current.getCurrentTime();
            const dur = playerRefReal.current.getDuration();
            setCurrentTime(time);
            setDuration(dur);
            setProgress((time / dur) * 100);
        }
    };

    const togglePlay = () => {
        if (!playerRefReal.current || !isPlayerReady.current) return;
        if (isPlaying) {
            playerRefReal.current.pauseVideo();
        } else {
            playerRefReal.current.playVideo();
        }
    };

    const toggleMute = () => {
        if (!playerRefReal.current || !isPlayerReady.current) return;
        if (isMuted) {
            playerRefReal.current.unMute();
            playerRefReal.current.setVolume(volume);
        } else {
            playerRefReal.current.mute();
        }
        setIsMuted(!isMuted);
    };

    const handleVolumeChange = (e) => {
        const newVolume = parseInt(e.target.value);
        setVolume(newVolume);

        if (!playerRefReal.current || !isPlayerReady.current) return;

        if (isMuted && newVolume > 0) {
            setIsMuted(false);
            playerRefReal.current.unMute();
        }

        playerRefReal.current.setVolume(newVolume);

        if (volumeTimeout.current) clearTimeout(volumeTimeout.current);
        volumeTimeout.current = setTimeout(() => {
            setShowVolumeSlider(false);
        }, 2000);
    };

    const toggleVolumeSlider = () => {
        setShowVolumeSlider(!showVolumeSlider);
        if (volumeTimeout.current) clearTimeout(volumeTimeout.current);
        if (showVolumeSlider) {
            volumeTimeout.current = setTimeout(() => {
                setShowVolumeSlider(false);
            }, 2000);
        }
    };

    const seek = (seconds) => {
        if (!playerRefReal.current || !isPlayerReady.current) return;

        try {
            const currentTime = playerRefReal.current.getCurrentTime();
            const dur = playerRefReal.current.getDuration();
            let newTime = currentTime + seconds;
            newTime = Math.max(0, Math.min(newTime, dur));

            playerRefReal.current.seekTo(newTime, true);
            setCurrentTime(newTime);
            setProgress((newTime / dur) * 100);
        } catch (e) {
            console.error("Error seeking:", e);
        }
    };

    const loadVideo = (videoId) => {
        if (!playerRefReal.current || !isPlayerReady.current) return;

        playerRefReal.current.loadVideoById({ videoId, startSeconds: 0 });
        setCurrentVideoId(videoId);
        setIsPlaying(true);
        setCurrentTime(0);
        setProgress(0);
        startProgressTracking()
    };

    const getVolumeIcon = () => {
        if (isMuted || volume === 0) return SpeakerOffImg;
        else if (volume > 70) return SpeakerWave3Img;
        else if (volume > 30) return SpeakerWave2Img;
        else if (volume > 10) return SpeakerWave1Img;
        else return SpeakerWave0Img;
    };

    return (
        <div className='Video-Group'>
            <div className="Video-Section">
                <div className="Video-Container">
                    <div className="Video-Player">
                        <div ref={playerRef} className='Video'></div>
                        <div className="Main-Outline"></div>

                        <div className="Video-Items">
                            <div className="Video-Controls">
                                <img src={BackwardImg} onClick={() => seek(-10)} className="Control-Icon" />
                                <img src={isPlaying ? PauseImg : PlayImg} onClick={togglePlay} className="Control-Icon" />
                                <img src={ForwardImg} onClick={() => seek(10)} className="Control-Icon" />

                                <div className="Volume-Control">
                                    <img src={getVolumeIcon()} onClick={toggleVolumeSlider} className="Control-Icon" />
                                    {showVolumeSlider && (
                                        <div className="Volume-Slider-Container">
                                            <div className="Volume-Slider-Fill" style={{ width: `${isMuted ? 0 : volume}%` }}></div>
                                            <input
                                                type="range"
                                                min="0"
                                                max="100"
                                                value={isMuted ? 0 : volume}
                                                onChange={handleVolumeChange}
                                                className="Volume-Slider"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="Video-Track">
                                <div className="Video-Progress" onClick={handleProgressClick}>
                                    <progress className='Progress' value={progress} max="100" />
                                </div>
                                <div className="Video-Time">
                                    <p>{formatTime(currentTime)} / {formatTime(duration)}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="Video-Playlist">
                    <div className="Video-Grid">
                        {videoPlaylist.map((video) => (
                            <div key={video.id} className={`Video-Grid-Item ${currentVideoId === video.id ? 'active' : ''}`} onClick={() => loadVideo(video.id)}>
                                <img src={`https://img.youtube.com/vi/${video.id}/mqdefault.jpg`} alt={video.title} />
                                <div className="Video-Grid-Title">{video.title}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Video
