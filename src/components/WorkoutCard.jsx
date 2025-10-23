import React, { useState, useEffect } from "react";
import EditWorkoutForm from "./EditWorkoutForm";
import NumberAdjuster from "./NumberAdjuster";
import DeleteButton from "./DeleteButton";
import SetRow from "./SetRow";
import Button from "./Button/Button";
import { capitalizeWords } from "../utils/format";
import { adjustRepsForSets } from "../hooks/useSetsRepsWeights";
import { workouts } from "../data/workouts";
import "./WorkoutCard.scss";

// Helper: convert YouTube watch/short links into embed with autoplay/mute/loop
const getYouTubeEmbedUrl = (url, start, end) => {
  if (!url) return null;
  const idMatch = url.match(/(?:v=|\.be\/)([a-zA-Z0-9_-]{11})/);
  const videoId = idMatch ? idMatch[1] : null;
  if (!videoId) return url;
  let embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0&loop=1&playlist=${videoId}`;
  if (start) embedUrl += `&start=${start}`;
  if (end) embedUrl += `&end=${end}`;
  return embedUrl;
};

const WorkoutCard = ({
  workout,
  editingId,
  editData,
  setEditData,
  saveEdit,
  cancelEdit,
  startEditing,
  updateWorkout,
  hasWeeks,
  dayIdParam,
  weekIdParam,
  holdingId,
  progress,
  handleHoldStart,
  handleHoldEnd,
  getColor,
  estimateWorkoutSeconds,
  collapsed,
}) => {
  const [preview, setPreview] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // ✅ Track online/offline state
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const repsArr = workout.reps || [];
  const weightsArr =
    workout.weights && workout.weights.length
      ? workout.weights
      : Array(repsArr.length).fill(0);

  const workoutMinutes = Math.round(estimateWorkoutSeconds(workout) / 60);
  const workoutMeta = workouts.find((w) => w.name === workout.name);

  const togglePreview = () => {
    setVideoError(false);
    setPreview((prev) => !prev);
  };

  const renderMedia = () => {
    // ✅ If offline or video error, show fallback image
    if (!isOnline || videoError || !workoutMeta?.videoUrl) {
      return workoutMeta?.imageUrl ? (
        <img
          src={workoutMeta.imageUrl}
          alt={`${workout.name} fallback`}
          className="video-fallback"
        />
      ) : null;
    }

    // ✅ YouTube case
    if (
      workoutMeta.videoUrl.includes("youtube") ||
      workoutMeta.videoUrl.includes("youtu.be")
    ) {
      const idMatch = workoutMeta.videoUrl.match(
        /(?:v=|\.be\/)([a-zA-Z0-9_-]{11})/
      );
      const videoId = idMatch ? idMatch[1] : null;
      if (!videoId) return null;

      const thumbUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

      return (
        <div className="video-wrapper">
          {preview ? (
            <iframe
              src={getYouTubeEmbedUrl(
                workoutMeta.videoUrl,
                workoutMeta.videoStart,
                workoutMeta.videoEnd
              )}
              title={`${workout.name} demo`}
              frameBorder="0"
              allow="autoplay; encrypted-media"
              allowFullScreen
              onError={() => setVideoError(true)}
            />
          ) : (
            <img
              src={thumbUrl}
              alt={`${workout.name} thumbnail`}
              className="video-fallback"
              onError={() => setVideoError(true)}
            />
          )}
        </div>
      );
    }

    // ✅ Local MP4 fallback
    return (
      <video
        className="workout-demo"
        src={workoutMeta.videoUrl}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        onError={() => setVideoError(true)}
      />
    );
  };

  return (
    <div className={`workout-card ${collapsed ? "collapsed" : ""}`}>
      {editingId === workout.id ? (
        <EditWorkoutForm
          editData={editData}
          setEditData={setEditData}
          saveEdit={saveEdit}
          cancelEdit={cancelEdit}
          workoutId={workout.id}
        />
      ) : preview ? (
        <div className="preview-mode">
          <h3>{capitalizeWords(workout.name)}</h3>
          {renderMedia()}
          <p className="description">
            {workoutMeta?.description || "No description available."}
          </p>
          <Button variant="secondary" onClick={togglePreview}>
            Back to Workout
          </Button>
        </div>
      ) : (
        <>
          <div>
            <h3>{capitalizeWords(workout.name)}</h3>
            <div className="collapsed-summary">
              <p>
                <strong>Weights:</strong>{" "}
                {weightsArr.length
                  ? weightsArr.map((w) => `${w}kg`).join(", ")
                  : "—"}
              </p>
              <p>
                <strong>Sets:</strong>{" "}
                {workout.sets}: {repsArr.map((r) => `${r} reps`).join(", ")}
              </p>
            </div>
            <div className="collapsible-content">
              <div className="sets-weights-header">
                <div className="header-spacer" />
                <div className="weights-col-label">Weights</div>
                <div className="sets-control">
                  <label>Sets:</label>
                  <NumberAdjuster
                    value={Number(workout.sets)}
                    min={1}
                    onChange={(nextSets) => {
                      const nextReps = adjustRepsForSets(
                        workout.name,
                        repsArr,
                        nextSets
                      );
                      const nextWeights = adjustRepsForSets(
                        workout.name,
                        weightsArr,
                        nextSets
                      );
                      const updated = {
                        ...workout,
                        sets: nextSets,
                        reps: nextReps,
                        weights: nextWeights,
                      };
                      if (hasWeeks) {
                        updateWorkout(dayIdParam, updated, weekIdParam);
                      } else {
                        updateWorkout(dayIdParam, updated);
                      }
                    }}
                  />
                </div>
              </div>
              <div className="set-list">
                {repsArr.map((r, i) => (
                  <SetRow
                    key={i}
                    index={i}
                    rep={r}
                    weight={weightsArr[i]}
                    workout={workout}
                    updateWorkout={updateWorkout}
                    hasWeeks={hasWeeks}
                    dayIdParam={dayIdParam}
                    weekIdParam={weekIdParam}
                  />
                ))}
              </div>
              <p
                className="workout-time"
                style={{ color: getColor(workoutMinutes) }}
              >
                ~{workoutMinutes} min
              </p>
            </div>
          </div>
          <div className="delete-wrapper">
            <div className="top-actions">
              <DeleteButton
                workoutId={workout.id}
                holdingId={holdingId}
                progress={progress}
                handleHoldStart={handleHoldStart}
                handleHoldEnd={handleHoldEnd}
              />
              <Button variant="primary" onClick={() => startEditing(workout)}>
                Edit
              </Button>
            </div>
            <div className="actions-divider" />
            <Button
              variant="secondary"
              className={`preview-btn ${preview ? "preview-active" : ""}`}
              onClick={togglePreview}
            >
              {preview ? "Back to Workout" : "Preview"}
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default WorkoutCard;
