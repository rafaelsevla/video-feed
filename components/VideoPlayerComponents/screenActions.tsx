import { useRef, useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";

const DOUBLE_PRESS_DELAY = 300;

export function ScreenActions({
  pause,
  showText,
  setShowText,
  videoRef,
  videoProgress,
  setVideoProgress,
}: any) {
  const [lastPress, setLastPress] = useState(0);
  const pressTimeout = useRef<NodeJS.Timeout | null | number>(null);

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

  return (
    <View style={StyleSheet.absoluteFillObject}>
      <Pressable onPress={pause} style={$overlay} />

      <View style={$doublePressContainer}>
        <Pressable style={$leftSide} onPress={() => handleDoublePress("left")}>
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
