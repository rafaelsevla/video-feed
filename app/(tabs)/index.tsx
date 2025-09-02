import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";

import { useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  ImageStyle,
  ListRenderItemInfo,
  Pressable,
  Share,
  View,
  ViewStyle,
} from "react-native";

import VideoPlayerScreen from "@/components/VideoPlayer";
import { Image } from "expo-image";
import { videos, videos2, videos3 } from "../../assets/data";

const { height } = Dimensions.get("window");

interface VideoWrapper {
  data: ListRenderItemInfo<string>;
  allVideos: string[];
  visibleIndex: number;
  pause: () => void;
  share: (videoURL: string) => void;
  pauseOverride: boolean;
}

export default function HomeScreen() {
  const bottomHeight = useBottomTabBarHeight();

  const [isMuted, setIsMuted] = useState(true);
  const [allVideos, setAllVideos] = useState(videos);
  const [visibleIndex, setVisibleIndex] = useState(0);
  const [pauseOverride, setPauseOverride] = useState(false);

  const numOfRefreshes = useRef(0);

  const fetchMoreData = () => {
    if (numOfRefreshes.current === 0) {
      setAllVideos([...allVideos, ...videos2]);
    }
    if (numOfRefreshes.current === 1) {
      setAllVideos([...allVideos, ...videos3]);
    }

    numOfRefreshes.current += 1;
  };

  const onViewableItemsChanged = (event: any) => {
    const newIndex = Number(event.viewableItems.at(-1).key);
    setVisibleIndex(newIndex);
  };

  const pause = () => {
    setPauseOverride(!pauseOverride);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const share = (videoURL: string) => {
    setPauseOverride(true);
    setTimeout(() => {
      Share.share({
        title: "Share This Video",
        message: `Check out: ${videoURL}`,
      });
    }, 100);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "black" }}>
      <FlatList
        pagingEnabled
        initialNumToRender={1}
        showsVerticalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        data={allVideos}
        onEndReachedThreshold={0.3}
        onEndReached={fetchMoreData}
        renderItem={(data) => {
          return (
            <VideoPlayerScreen
              data={data}
              allVideos={allVideos}
              visibleIndex={visibleIndex}
              pause={pause}
              share={share}
              pauseOverride={pauseOverride}
              onToggleMute={toggleMute}
              isMuted={isMuted}
            />
          );
        }}
      />
      {pauseOverride && (
        <Pressable style={$pauseIndicator}>
          <Image source="pause" style={$playButtonImage} />
        </Pressable>
      )}
    </View>
  );
}

const $pauseIndicator: ViewStyle = {
  position: "absolute",
  alignSelf: "center",
  top: height / 2 - 25,
};

const $playButtonImage: ImageStyle = {
  height: 50,
  width: 50,
  justifyContent: "center",
  alignItems: "center",
  resizeMode: "contain",
};
