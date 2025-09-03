import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useEffect, useRef, useState } from "react";
import { Dimensions, ListRenderItemInfo, Platform, View } from "react-native";

import Video, { VideoRef } from "react-native-video";
import { LateralButtons } from "./VideoPlayerComponents/lateralButtons";
import { ProgressPlayer } from "./VideoPlayerComponents/progress";
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

  useEffect(() => {
    videoRef.current?.seek(0);
  }, [visibleIndex]);

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

      <ProgressPlayer
        videoProgress={videoProgress}
        videoRef={videoRef}
        progressBarWidth={progressBarWidth}
        setProgressBarWidth={setProgressBarWidth}
      />
    </View>
  );
}
