
export const formatTime = (timeInSeconds: number): string => {
  if (timeInSeconds === Infinity) return '∞';
  let seconds = Math.max(0, timeInSeconds);
  if (seconds < 0) seconds = 0;

  const totalSeconds = Math.floor(seconds);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}시간 ${minutes.toString().padStart(2, '0')}분 ${secs.toString().padStart(2, '0')}초`;
  }
  if (minutes > 0) {
    return `${minutes}분 ${secs.toString().padStart(2, '0')}초`;
  }
  return `${secs}초`;
};

export const formatMinSec = (seconds: number): string => {
    if (seconds < 0) seconds = 0;
    const totalSeconds = Math.floor(seconds);
    const minutes = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;

    if (minutes > 0) {
        return `${minutes}분`;
    }
    return `${secs}초`;
};

export const formatTimeDigital = (seconds: number): string => {
  if (seconds < 0) seconds = 0;
  const safeTime = Math.max(0, seconds);
  const minutes = Math.floor(safeTime / 60);
  const seconds_ = Math.floor(safeTime % 60);
  return `${minutes.toString().padStart(2, '0')}:${seconds_.toString().padStart(2, '0')}`;
};
