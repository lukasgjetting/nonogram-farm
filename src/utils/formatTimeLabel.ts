const formatTimeLabel = (milliseconds: number) => {
  const remainingSeconds = Math.round(milliseconds / 1000);
  const unroundedMinutes = remainingSeconds / 60;
  const minutes = Math.round(unroundedMinutes);

  if (unroundedMinutes >= 1) {
    return `${unroundedMinutes !== minutes ? "approximately " : ""}${minutes} ${minutes > 1 ? "minutes" : "minute"}`;
  }

  return `${remainingSeconds} ${remainingSeconds === 1 ? "second" : "seconds"}`;
};

export default formatTimeLabel;
