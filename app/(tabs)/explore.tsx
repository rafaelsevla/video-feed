import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

interface ProgressBarProps {
  total: number;
  progress: number;
  onBarPress: (percentage: number) => void;
  barWidth: number;
  setBarWidth: (width: number) => void;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  total,
  progress,
  onBarPress,
  barWidth,
  setBarWidth,
}) => {
  const safeProgress = Math.min(Math.max(progress, 0), total);
  const percentage = (safeProgress / total) * 100;

  return (
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
        <View style={[styles.progressBarFilled, { width: `${percentage}%` }]} />
      </View>

      <Text style={styles.progressText}>{`${Math.round(percentage)}%`}</Text>
    </View>
  );
};

export default function TabTwoScreen() {
  const [currentProgress, setCurrentProgress] = useState<number>(0);
  const [barWidth, setBarWidth] = useState<number>(0);
  const totalSteps = 100;
  const [isDragging, setIsDragging] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startInterval = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setCurrentProgress((prev) => {
        if (prev >= totalSteps) {
          clearInterval(intervalRef.current!);
          return totalSteps;
        }
        return prev + 1;
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
    if (barWidth === 0) return;
    setIsDragging(true);
    const newProgress = Math.round(percentage * totalSteps);
    setCurrentProgress(Math.min(Math.max(newProgress, 0), totalSteps));
  };

  const handleRelease = () => {
    setIsDragging(false);
  };

  return (
    <View style={appStyles.container}>
      <View
        style={{ width: "100%", alignItems: "center" }}
        onStartShouldSetResponder={() => true}
        onResponderRelease={handleRelease}
      >
        <ProgressBar
          total={totalSteps}
          progress={currentProgress}
          onBarPress={handleBarPress}
          barWidth={barWidth}
          setBarWidth={setBarWidth}
        />
      </View>
    </View>
  );
}

const appStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
});

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
