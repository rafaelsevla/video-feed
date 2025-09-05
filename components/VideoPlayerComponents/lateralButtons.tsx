import { ImageStyle } from "expo-image";
import {
  Platform,
  Pressable,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";

export function LateralButtons({onToggleMute,onShare}: any) {
  return (
    <View>
      <Pressable onPress={onShare} style={$shareButtonContainer}>
        <View style={$shareButtonImage} />
        <Text style={$shareButtonText}>Share</Text>
      </Pressable>
      <Pressable onPress={onToggleMute} style={$muteButtonContainer}>
        <View style={$shareButtonImage} />
        <Text style={$shareButtonText}>Mute</Text>
      </Pressable>
    </View>
  );
}

const $shareButtonContainer: ViewStyle = {
  position: "absolute",
  zIndex: 999,
  elevation: 999,
  bottom: Platform.OS === "android" ? 120 : 160,
  right: 10,
  alignItems: "center",
  gap: 8,
};
const $muteButtonContainer: ViewStyle = {
  position: "absolute",
  zIndex: 999,
  elevation: 999,
  bottom: Platform.OS === "android" ? 60 : 130,
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
