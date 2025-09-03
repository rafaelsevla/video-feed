import { Platform, Pressable, Text, TextStyle, View, ViewStyle } from "react-native";

const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
};

export function ProgressPlayer({
  videoProgress,
  videoRef,
  progressBarWidth,
  setProgressBarWidth,
}: any) {
  const progressPercentage =
    videoProgress.seekableDuration > 0
      ? (videoProgress.currentTime / videoProgress.seekableDuration) * 100
      : 0;

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

  return (
    <View>
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
