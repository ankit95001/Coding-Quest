import { useEffect } from "react";

export const useFullScreen = () => {
  const enterFullScreen = () => {
    const element = document.documentElement;
    if (element.requestFullscreen) {
      element.requestFullscreen();
    }
  };

  const exitFullScreen = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  };

  const isFullScreen = () => {
    return document.fullscreenElement;
  };

  return { enterFullScreen, exitFullScreen, isFullScreen };
};
