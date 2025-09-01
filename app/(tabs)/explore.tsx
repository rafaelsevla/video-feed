import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

const DOUBLE_PRESS_DELAY = 300;

export default function TabTwoScreen() {
  const [lastPress, setLastPress] = useState(0);

  const handleDoublePress = (direction: 'left' | 'right') => {
    const now = Date.now();
    if (now - lastPress < DOUBLE_PRESS_DELAY) {
      console.log("Clique duplo detectado!");
      // Coloque aqui a sua lógica para o clique duplo
    } else {
      setLastPress(now);
    }
  };

  return (
    <View style={styles.container}>
      <Pressable style={styles.leftSide} onPress={() => handleDoublePress('left')}>
        <Text style={styles.text}>Lado Esquerdo</Text>
      </Pressable>
      <Pressable style={styles.rightSide} onPress={() => handleDoublePress('right')}>
        <Text style={styles.text}>Lado Direito</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row", // Alinha os filhos lado a lado
  },
  leftSide: {
    flex: 1, // Ocupa metade do espaço disponível
    backgroundColor: "red",
    justifyContent: "center", // Centraliza o texto verticalmente
    alignItems: "center", // Centraliza o texto horizontalmente
  },
  rightSide: {
    flex: 1, // Ocupa a outra metade do espaço disponível
    backgroundColor: "green",
    justifyContent: "center", // Centraliza o texto verticalmente
    alignItems: "center", // Centraliza o texto horizontalmente
  },
  text: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
});
