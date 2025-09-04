import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useEffect, useRef, useState } from "react";
import { Dimensions, ListRenderItemInfo, Platform, View } from "react-native";

import Video, { VideoRef } from "react-native-video";
import { LateralButtons } from "./VideoPlayerComponents/lateralButtons";
import { ProgressBar } from "./VideoPlayerComponents/progressBarTwoDotZero";
import { ScreenActions } from "./VideoPlayerComponents/screenActions";

const { height, width } = Dimensions.get("window");

interface VideoWrapper {
  data: ListRenderItemInfo<string>;
  allVideos: string[];
  visibleIndex: number;
  pause: () => void;
  share: (videoURL: string) => void;
  pauseOverride: boolean;
  onToggleMute: () => void;
  isMuted: boolean;
}

export default function VideoPlayer({
  data,
  allVideos,
  visibleIndex,
  pause,
  pauseOverride,
  share,
  onToggleMute,
  isMuted,
}: VideoWrapper) {
  const bottomHeight = useBottomTabBarHeight();
  const { index, item } = data;
  const [lastPress, setLastPress] = useState(0);
  const videoRef = useRef<VideoRef>(null);
  const [showText, setShowText] = useState<"left" | "right" | null>(null);
  const pressTimeout = useRef<NodeJS.Timeout | null | number>(null);

  const [videoProgress, setVideoProgress] = useState({
    currentTime: 0,
    seekableDuration: 0,
  });
  const [progressBarWidth, setProgressBarWidth] = useState(0);

  // props pro novo progressbar
  const [isDragging, setIsDragging] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    videoRef.current?.seek(0);
  }, [visibleIndex]);

  const startInterval = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setVideoProgress((prev) => {
        if (prev.currentTime >= prev.seekableDuration) {
          clearInterval(intervalRef.current!);
          return {
            currentTime: prev.seekableDuration,
            seekableDuration: prev.seekableDuration,
          };
        }
        return {
          currentTime: prev.currentTime + 1,
          seekableDuration: prev.seekableDuration,
        };
      });
    }, 1000);
  };

  useEffect(() => {
    if (!isDragging) {
      startInterval();
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isDragging]);

  const handleBarPress = (percentage: number) => {
    if (progressBarWidth === 0) return;
    setIsDragging(true);
    const newProgress = Math.round(percentage * videoProgress.seekableDuration);
    console.log("progress", newProgress);
    videoRef.current?.seek(newProgress);
    setVideoProgress({ ...videoProgress, currentTime: newProgress });
  };

  const handleRelease = () => {
    console.log("handleRelease", JSON.stringify(videoProgress, null, 2));
    setIsDragging(false);
  };

  return (
    <View
      style={{
        height: Platform.OS === "android" ? height - bottomHeight : height,
        width,
      }}
    >
      <Video
        ref={videoRef}
        source={{ uri: allVideos[index] }}
        style={{ height: height - bottomHeight, width }}
        resizeMode="cover"
        paused={visibleIndex !== index || pauseOverride}
        onProgress={(data) => setVideoProgress(data)}
        onEnd={() => videoRef.current?.seek(0)}
        muted={isMuted}
      />

      <ScreenActions
        pause={pause}
        showText={showText}
        setShowText={setShowText}
        videoRef={videoRef}
        videoProgress={videoProgress}
        setVideoProgress={setVideoProgress}
      />

      <LateralButtons onToggleMute={onToggleMute} onShare={() => share(item)} />

      {/* <ProgressPlayer
        videoProgress={videoProgress}
        videoRef={videoRef}
        progressBarWidth={progressBarWidth} // ja foram usadas
        setProgressBarWidth={setProgressBarWidth} // ja foram usadas
      /> */}

      <ProgressBar
        handleRelease={handleRelease}
        total={videoProgress.seekableDuration}
        progress={videoProgress.currentTime}
        onBarPress={handleBarPress}
        barWidth={progressBarWidth}
        setBarWidth={setProgressBarWidth}
      />
    </View>
  );
}
