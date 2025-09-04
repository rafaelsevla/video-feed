import React from "react";
import { Platform, StyleSheet, Text, View } from "react-native";

interface ProgressBarProps {
  total: number;
  progress: number;
  onBarPress: (percentage: number) => void;
  barWidth: number;
  setBarWidth: (width: number) => void;

  handleRelease: () => void;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  total,
  progress,
  onBarPress,
  barWidth,
  setBarWidth,
  handleRelease,
}) => {
  const safeProgress = Math.min(Math.max(progress, 0), total);
  const percentage = (safeProgress / total) * 100;

  return (
    <View
      style={{
        width: "100%",
        alignItems: "center",

        position: "absolute",
        bottom: Platform.OS === "android" ? 20 : 30,
        left: 0,
        right: 0,
        backgroundColor: '#f00f00'
      }}
      onStartShouldSetResponder={() => true}
      onResponderRelease={handleRelease}
    >
      <View style={styles.container}>
        <View
          style={styles.progressBarBackground}
          onLayout={(event) => {
            const { width } = event.nativeEvent.layout;
            if (barWidth === 0) {
              setBarWidth(width);
            }
          }}
          onStartShouldSetResponder={() => true}
          onResponderGrant={(e) => {
            const touchX = e.nativeEvent.locationX;
            onBarPress(touchX / barWidth);
          }}
          onResponderMove={(e) => {
            const touchX = e.nativeEvent.locationX;
            onBarPress(touchX / barWidth);
          }}
        >
          <View
            style={[styles.progressBarFilled, { width: `${percentage}%` }]}
          />
        </View>

        <Text style={styles.progressText}>{`${Math.round(percentage)}%`}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
  },
  progressBarBackground: {
    width: "90%",
    height: 20,
    backgroundColor: "#e0e0e0",
    borderRadius: 10,
    overflow: "hidden",
  },
  progressBarFilled: {
    height: "100%",
    backgroundColor: "#4CAF50",
    borderRadius: 10,
  },
  progressText: {
    marginTop: 8,
    fontSize: 16,
    color: "#333",
    fontWeight: "bold",
  },
});
