import { useRef, useState, useEffect } from "react";
import "./Visualize.css"; // Import the CSS file

const Visualize = () => {
  const videoRefs = useRef([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTimeStep, setCurrentTimeStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1); // Default playback rate
  const [inputTimeStep, setInputTimeStep] = useState(0); // Time step input state

  const videoUrls = [
    "/uwnd_animation.mp4",
    "/density_animation.mp4",
    "/ptemp_animation.mp4",
    "/wwnd_animation.mp4",
  ];

  const totalSteps = 1000; // Number of time steps
  const stepDuration = 100 / totalSteps; // Duration of each step in seconds

  const handlePlayPause = () => {
    setIsPlaying((prevState) => {
      const newPlayState = !prevState;
      videoRefs.current.forEach((video) => {
        if (video) {
          if (newPlayState) {
            video.play();
          } else {
            video.pause();
          }
        }
      });
      return newPlayState;
    });
  };

  const handlePlaybackRateChange = (rate) => {
    setPlaybackRate(rate);
    videoRefs.current.forEach((video) => {
      if (video) {
        video.playbackRate = rate;
      }
    });
  };

  const updateTimeStepAndProgress = () => {
    if (videoRefs.current[0]) {
      const currentTime = videoRefs.current[0].currentTime;
      const duration = videoRefs.current[0].duration;
      const newTimeStep = Math.floor(currentTime / stepDuration);
      const newProgress = (currentTime / duration) * 100; // Progress as percentage

      setCurrentTimeStep(newTimeStep);
      setProgress(newProgress);
    }
  };

  const handleTimeStepChange = (event) => {
    const newTimeStep = Number(event.target.value);
    setInputTimeStep(newTimeStep);
  };

  const jumpToTimeStep = () => {
    if (videoRefs.current[0]) {
      const newTime = inputTimeStep * stepDuration;
      videoRefs.current.forEach((video) => {
        if (video) {
          video.currentTime = newTime;
          updateTimeStepAndProgress();
        }
      });
    }
  };

  useEffect(() => {
    if (isPlaying) {
      const intervalId = setInterval(updateTimeStepAndProgress, 100); // Update every 100ms
      return () => clearInterval(intervalId);
    }
  }, [isPlaying, playbackRate]);

  useEffect(() => {
    // Update progress if currentTime changes
    updateTimeStepAndProgress();
  }, [currentTimeStep, progress]);

  return (
    <div className="vis-container">
      <div className="control-group-container">
        <div className="button-group">
          <h3>Controls</h3>
          <button
            className={`button playback-btn ${isPlaying ? "active" : ""}`}
            onClick={handlePlayPause}
          >
            {isPlaying ? "Pause All" : "Play All"}
          </button>
          <div className="control-btn-container">
            <button
              className={`button playback-btn ${playbackRate === 1 ? "active" : ""}`}
              onClick={() => handlePlaybackRateChange(1)}
            >
              1x Speed
            </button>
            <button
              className={`button playback-btn ${playbackRate === 2 ? "active" : ""}`}
              onClick={() => handlePlaybackRateChange(2)}
            >
              2x Speed
            </button>
            <button
              className={`button playback-btn ${playbackRate === 4 ? "active" : ""}`}
              onClick={() => handlePlaybackRateChange(4)}
            >
              4x Speed
            </button>
            <button
              className={`button playback-btn ${playbackRate === 10 ? "active" : ""}`}
              onClick={() => handlePlaybackRateChange(10)}
            >
              10x Speed
            </button>
          </div>
        </div>
      </div>
      <div className="video-container">
        {videoUrls.map((url, index) => (
          <div key={index} className="video-item">
            <video
              ref={(el) => (videoRefs.current[index] = el)}
              src={url}
              width="450"
              height="auto"
              loop
              onError={(e) => console.error("Error loading video:", e)}
            />
          </div>
        ))}
      </div>
      <div className="time-step">
        <div>Time Step: {currentTimeStep}</div>
        <div className="progress-bar">
          <div
            className="progress-bar-fill"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="time-step-controls">
          <input
            type="number"
            value={inputTimeStep}
            onChange={handleTimeStepChange}
            min="0"
            max={totalSteps - 1}
          />
          <button onClick={jumpToTimeStep}>Go to Time Step</button>
        </div>
      </div>
    </div>
  );
};

export default Visualize;
