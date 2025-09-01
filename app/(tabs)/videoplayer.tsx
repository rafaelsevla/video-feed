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

import { Image, ImageStyle } from "expo-image";
import Video, { VideoRef } from "react-native-video";

const { height, width } = Dimensions.get("window");

interface VideoWrapper {
  data: ListRenderItemInfo<string>;
  allVideos: string[];
  visibleIndex: number;
  pause: () => void;
  share: (videoURL: string) => void;
  pauseOverride: boolean;
}

const DOUBLE_PRESS_DELAY = 300;

export default ({
  data,
  allVideos,
  visibleIndex,
  pause,
  pauseOverride,
  share,
}: VideoWrapper) => {
  const bottomHeight = useBottomTabBarHeight();
  const { index, item } = data;
  const [lastPress, setLastPress] = useState(0);
  const videoRef = useRef<VideoRef>(null);
  const [showText, setShowText] = useState<"left" | "right" | null>(null);
  const pressTimeout = useRef<NodeJS.Timeout | null | number>(null);
  const [currentTime, setCurrentTime] = useState(0);

  const handleDoublePress = (direction: "left" | "right") => {
    const now = Date.now();
    const timeBetweenPresses = now - lastPress;

    if (timeBetweenPresses < DOUBLE_PRESS_DELAY) {
      if (pressTimeout.current) {
        clearTimeout(pressTimeout.current);
      }
      setShowText(direction);

      if (videoRef.current) {
        console.log('current', currentTime)

        const newTime = direction === 'left' ? Math.min(currentTime - 10) : Math.min(currentTime + 10);

        videoRef.current.seek(newTime);
        setCurrentTime(newTime)
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

  const handleProgress = (data: any) => {
    setCurrentTime(data.currentTime);
  };

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
        onProgress={handleProgress}
        onEnd={() => videoRef.current?.seek(0)}
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
        <Image
          source={{
            uri: "https://cdn-icons-png.flaticon.com/512/3592/3592813.png",
          }}
          style={$shareButtonImage}
        />
        <Text style={$shareButtonText}>Share</Text>
      </Pressable>
    </View>
  );
};

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
  bottom: Platform.OS === "android" ? 70 : 100,
  right: 10,
  alignItems: "center",
  gap: 8,
};

const $shareButtonImage: ImageStyle = {
  height: 25,
  width: 25,
  justifyContent: "center",
  alignItems: "center",
  resizeMode: "contain",
  tintColor: "white",
};

const $shareButtonText: TextStyle = {
  color: "white",
  fontSize: 12,
  fontWeight: "bold",
};
