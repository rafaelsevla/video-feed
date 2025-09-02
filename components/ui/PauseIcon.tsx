import { View, ViewStyle } from "react-native";

export function PauseIcon() {
  return (
    <View style={$pauseContainer}>
      <View style={$pauseIndicator}></View>
      <View style={$pauseIndicator}></View>
    </View>
  );
}

const $pauseContainer: ViewStyle = {
  height: 40,
  width: 30,
  display: 'flex',
  justifyContent: 'space-between',
  flexDirection: 'row',
};

const $pauseIndicator: ViewStyle = {
  height: 40,
  width: 10,
  backgroundColor: "white",
};


