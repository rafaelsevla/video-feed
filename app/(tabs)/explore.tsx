import React, { useEffect, useState } from "react";
import { GestureResponderEvent, StyleSheet, Text, TouchableWithoutFeedback, View } from "react-native";

// Define a interface para as props do componente ProgressBar
interface ProgressBarProps {
  total: number;
  progress: number;
  onBarPress: (event: GestureResponderEvent) => void;
  barWidth: number;
  setBarWidth: (width: number) => void;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ total, progress, onBarPress, barWidth, setBarWidth }) => {
  const safeProgress = Math.min(Math.max(progress, 0), total);
  const percentage = (safeProgress / total) * 100;

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={onBarPress}>
        <View 
          style={styles.progressBarBackground}
          onLayout={(event) => {
            const { width } = event.nativeEvent.layout;
            if (barWidth === 0) { // Apenas define a largura na primeira vez
              setBarWidth(width);
            }
          }}
        >
          <View style={[styles.progressBarFilled, { width: `${percentage}%` }]} />
        </View>
      </TouchableWithoutFeedback>

      <Text style={styles.progressText}>{`${Math.round(percentage)}%`}</Text>
    </View>
  );
};

export default function TabTwoScreen() {
  const [currentProgress, setCurrentProgress] = useState<number>(0);
  const [barWidth, setBarWidth] = useState<number>(0);
  const totalSteps = 100;

  // Simula o progresso por 5 minutos ou continua de onde foi clicado
  useEffect(() => {
    // 5 minutos = 300 segundos = 300,000 milissegundos
    const interval = setInterval(() => {
      setCurrentProgress((prevProgress) => {
        if (prevProgress >= totalSteps) {
          clearInterval(interval);
          return totalSteps;
        }
        return prevProgress + 1;
      });
    }, 3000); // Incrementa 1 a cada 3 segundos

    return () => clearInterval(interval);
  }, [currentProgress]); // A dependência em currentProgress reinicia o timer ao clicar

  const handleBarPress = (event: GestureResponderEvent) => {
    if (barWidth === 0) return; // Não faz nada se a largura ainda não foi definida

    const tapLocationX = event.nativeEvent.locationX;
    const newProgressPercentage = (tapLocationX / barWidth);
    const newProgress = newProgressPercentage * totalSteps;

    setCurrentProgress(Math.min(Math.round(newProgress), totalSteps));
  };

  return (
    <View style={appStyles.container}>
      <Text style={appStyles.title}>Baixando Arquivos</Text>

      <ProgressBar 
        total={totalSteps} 
        progress={currentProgress} 
        onBarPress={handleBarPress}
        barWidth={barWidth}
        setBarWidth={setBarWidth}
      />

      <Text style={appStyles.subtitle}>
        {`Progresso: ${currentProgress} de ${totalSteps}`}
      </Text>
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
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  subtitle: {
    marginTop: 20,
    fontSize: 18,
    color: "#666",
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
