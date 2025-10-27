// src/components/WorkoutMedia.jsx
import React, { useState } from "react";

// Helper: convert YouTube watch/short/embed links into embed with autoplay/mute/loop
const getYouTubeEmbedUrl = (url, start, end) => {
  if (!url) return null;
  const idMatch = url.match(/(?:v=|\/|embed\/|shorts\/)([a-zA-Z0-9_-]{11})/);
  const videoId = idMatch ? idMatch[1] : null;
  if (!videoId) return url;

  let embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0&loop=1&playlist=${videoId}`;
  if (start) embedUrl += `&start=${start}`;
  if (end) embedUrl += `&end=${end}`;
  return embedUrl;
};

const WorkoutMedia = ({ workoutMeta, workoutName, collapsed, isOnline }) => {
  const [videoError, setVideoError] = useState(false);

  // If offline, error, or no video URL → fallback image
  if (!isOnline || videoError || !workoutMeta?.videoUrl) {
    return workoutMeta?.imageUrl ? (
      <img
        src={workoutMeta.imageUrl}
        alt={`${workoutName} fallback`}
        className="video-fallback"
      />
    ) : null;
  }

  // YouTube handling
  if (
    workoutMeta.videoUrl.includes("youtube") ||
    workoutMeta.videoUrl.includes("youtu.be")
  ) {
    const idMatch = workoutMeta.videoUrl.match(
      /(?:v=|\/|embed\/|shorts\/)([a-zA-Z0-9_-]{11})/
    );
    const videoId = idMatch ? idMatch[1] : null;
    if (!videoId) {
      return workoutMeta?.imageUrl ? (
        <img
          src={workoutMeta.imageUrl}
          alt={`${workoutName} fallback`}
          className="video-fallback"
        />
      ) : null;
    }

    return (
      <div className="video-wrapper">
        {!collapsed && (
          <iframe
            src={getYouTubeEmbedUrl(
              workoutMeta.videoUrl,
              workoutMeta.videoStart,
              workoutMeta.videoEnd
            )}
            title={`${workoutName} demo`}
            frameBorder="0"
            allow="autoplay; encrypted-media"
            allowFullScreen
            loading="lazy"
            onError={() => setVideoError(true)} // 👈 triggers fallback
            className="workout-demo"
          />
        )}
      </div>
    );
  }

  // Direct video file
  return (
    !collapsed && (
      <video
        className="workout-demo"
        src={workoutMeta.videoUrl}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        onError={() => setVideoError(true)} // 👈 triggers fallback
      />
    )
  );
};

export default WorkoutMedia;
