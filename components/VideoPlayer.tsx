import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  ListRenderItemInfo,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";

import { ImageStyle } from "expo-image";
import Video, { VideoRef } from "react-native-video";

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

const DOUBLE_PRESS_DELAY = 300;

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

  const handleDoublePress = (direction: "left" | "right") => {
    const now = Date.now();
    const timeBetweenPresses = now - lastPress;

    if (timeBetweenPresses < DOUBLE_PRESS_DELAY) {
      if (pressTimeout.current) {
        clearTimeout(pressTimeout.current);
      }
      setShowText(direction);

      if (videoRef.current) {
        const newTime =
          direction === "left"
            ? Math.max(videoProgress.currentTime - 10, 0)
            : Math.min(
                videoProgress.currentTime + 10,
                videoProgress.seekableDuration
              );

        videoRef.current.seek(newTime);
        setVideoProgress({ ...videoProgress, currentTime: newTime });
      }

      setTimeout(() => {
        setShowText(null);
      }, 250);
    } else {
      pressTimeout.current = setTimeout(() => {
        pause();
      }, DOUBLE_PRESS_DELAY);
    }
    setLastPress(now);
  };

  const handleProgressBarTouch = (event: any) => {
    if (!progressBarWidth || videoProgress.seekableDuration === 0) return;

    // A posição do toque em relação ao componente
    const touchX = event.nativeEvent.locationX;
    const touchPercentage = touchX / progressBarWidth;
    const newTime = touchPercentage * videoProgress.seekableDuration;

    if (videoRef.current) {
      videoRef.current.seek(newTime);
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  useEffect(() => {
    videoRef.current?.seek(0);
  }, [visibleIndex]);

  const progressPercentage =
    videoProgress.seekableDuration > 0
      ? (videoProgress.currentTime / videoProgress.seekableDuration) * 100
      : 0;

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

      <View style={StyleSheet.absoluteFillObject}>
        <Pressable onPress={pause} style={$overlay} />

        <View style={$doublePressContainer}>
          <Pressable
            style={$leftSide}
            onPress={() => handleDoublePress("left")}
          >
            {showText === "left" && <Text style={$secondsText}>-10s</Text>}
          </Pressable>
          <Pressable
            style={$rightSide}
            onPress={() => handleDoublePress("right")}
          >
            {showText === "right" && <Text style={$secondsText}>+10s</Text>}
          </Pressable>
        </View>
      </View>

      <Pressable onPress={() => share(item)} style={$shareButtonContainer}>
        <View style={$shareButtonImage} />
        <Text style={$shareButtonText}>Share</Text>
      </Pressable>
      <Pressable onPress={onToggleMute} style={$muteButtonContainer}>
        <View style={$shareButtonImage} />
        <Text style={$shareButtonText}>Mute</Text>
      </Pressable>

      <View style={$touchContainer}>
        <Pressable onPressIn={handleProgressBarTouch} style={$touchInner} />
      </View>
      <View style={$progressContainer}>
        <View
          onLayout={(event) =>
            setProgressBarWidth(event.nativeEvent.layout.width)
          }
          style={$progressBarContainer}
        >
          <View style={[$progressBar, { width: `${progressPercentage}%` }]} />
        </View>
        <View style={$timeTextContainer}>
          <Text style={$timeText}>{formatTime(videoProgress.currentTime)}</Text>
          <Text style={$timeText}>
            {formatTime(videoProgress.seekableDuration)}
          </Text>
        </View>
      </View>
    </View>
  );
}

const $overlay: ViewStyle = {
  ...StyleSheet.absoluteFillObject,
  backgroundColor: "black",
  opacity: 0.3,
};

const $doublePressContainer: ViewStyle = {
  ...StyleSheet.absoluteFillObject,
  flexDirection: "row",
};

const $leftSide: ViewStyle = {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
};

const $rightSide: ViewStyle = {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
};

const $secondsText: TextStyle = {
  color: "white",
  fontSize: 20,
  fontWeight: "bold",
};

const $shareButtonContainer: ViewStyle = {
  position: "absolute",
  zIndex: 999,
  elevation: 999,
  bottom: Platform.OS === "android" ? 120 : 130,
  right: 10,
  alignItems: "center",
  gap: 8,
};
const $muteButtonContainer: ViewStyle = {
  position: "absolute",
  zIndex: 999,
  elevation: 999,
  bottom: Platform.OS === "android" ? 60 : 70,
  right: 10,
  alignItems: "center",
  gap: 8,
};

const $shareButtonImage: ImageStyle = {
  height: 25,
  width: 25,
  backgroundColor: "white",
};

const $shareButtonText: TextStyle = {
  color: "white",
  fontSize: 12,
  fontWeight: "bold",
};

const $progressContainer: ViewStyle = {
  position: "absolute",
  bottom: Platform.OS === "android" ? 10 : 30,
  left: 0,
  right: 0,
  paddingHorizontal: 10,
  alignItems: "center",
};

const $touchContainer: ViewStyle = {
  position: "absolute",
  bottom: Platform.OS === "android" ? 20 : 30,
  left: 0,
  right: 0,
  height: 30,
  width: "100%",
  paddingHorizontal: 10,
};
const $touchInner: ViewStyle = {
  left: 0,
  right: 0,
  height: 30,
  width: "100%",
};

const $progressBarContainer: ViewStyle = {
  height: 4,
  width: "100%",
  backgroundColor: "rgba(255, 255, 255, 0.3)",
  borderRadius: 2,
};

const $progressBar: ViewStyle = {
  height: "100%",
  backgroundColor: "white",
  borderRadius: 2,
};

const $timeTextContainer: ViewStyle = {
  flexDirection: "row",
  justifyContent: "space-between",
  width: "100%",
  marginTop: 5,
};

const $timeText: TextStyle = {
  color: "white",
  fontSize: 12,
  fontWeight: "bold",
};
