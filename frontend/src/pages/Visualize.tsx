import React, { useRef, useState, useEffect } from "react";
import "./Visualize.css"; // Import the CSS file
import { TextField } from "@mui/material";

const Visualize: React.FC = () => {
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTimeStep, setCurrentTimeStep] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);
  const [playbackRate, setPlaybackRate] = useState<number>(1); // Default playback rate
  const [inputTimeStep, setInputTimeStep] = useState<string>(""); // Time step input state as string

  const videoUrls: { url: string; label: string }[] = [
    { url: "/uwnd_animation.mp4", label: "uwnd" },
    { url: "/density_animation.mp4", label: "dens" },
    { url: "/ptemp_animation.mp4", label: "ptemp" },
    { url: "/wwnd_animation.mp4", label: "wwnd" },
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

  const handlePlaybackRateChange = (rate: number) => {
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

  const handleTimeStepChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Get value as string and remove leading zeros
    let value = event.target.value.replace(/^0+/, "");
    setInputTimeStep(value);
  };

  const jumpToTimeStep = () => {
    if (videoRefs.current[0] && inputTimeStep !== "") {
      const newTimeStep = parseInt(inputTimeStep, 10);
      if (isNaN(newTimeStep) || newTimeStep < 0 || newTimeStep >= totalSteps)
        return; // Validate input
      const newTime = newTimeStep * stepDuration;
      videoRefs.current.forEach((video) => {
        if (video) {
          video.currentTime = newTime;
          updateTimeStepAndProgress();
        }
      });
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter") {
      jumpToTimeStep();
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
            className={`button play-btn ${isPlaying ? "active" : ""}`}
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

      <div className="time-step-controls">
        <TextField
          type="number"
          value={inputTimeStep}
          onChange={handleTimeStepChange}
          onKeyDown={handleKeyDown} // Add key down event listener
          InputProps={{ inputProps: { min: 0, max: totalSteps - 1 } }}
          fullWidth
          variant="outlined"
          margin="normal"
          label="Time Step"
          sx={{
            backgroundColor: "#333", // Dark background color
            color: "#fff", // Light text color
            "& .MuiInputBase-input": {
              color: "#fff", // Light text color inside the input
              "&::-webkit-inner-spin-button": {
                WebkitAppearance: "none",
                margin: 0,
              },
              "&::-webkit-outer-spin-button": {
                WebkitAppearance: "none",
                margin: 0,
              },
            },
            "& .MuiInputLabel-root": {
              color: "#aaa", // Light color for the label
            },
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "#555", // Border color
            },
            "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "#888", // Border color on hover
            },
            "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
              {
                borderColor: "#fff", // Border color when focused
              },
            "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-input": {
              color: "#fff", // Text color when focused
            },
          }}
        />
        <button className="button ts-btn" onClick={jumpToTimeStep}>
          Go to Time Step
        </button>
      </div>
      <div className="time-step">
        <div>Time Step: {currentTimeStep}</div>
        <div className="progress-bar">
          <div
            className="progress-bar-fill"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      <div className="video-container">
        {videoUrls.map((video, index) => (
          <div key={index} className="video-item">
            <video
              ref={(el) => (videoRefs.current[index] = el)}
              src={video.url}
              width="450"
              height="auto"
              loop
              onError={(e) => console.error("Error loading video:", e)}
            />
            <div className="video-label">{video.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Visualize;
