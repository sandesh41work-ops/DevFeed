import React from "react";
import Animated, {
  FadeIn,
  FadeOut,
  LinearTransition,
} from "react-native-reanimated";
import SkeletonCard from "./SkeletonCard";

type FooterProps = {
  loadingMore: boolean;
};

const Footer = ({ loadingMore }: FooterProps) => {
  if (!loadingMore) return null;

  return (
    <Animated.View
      entering={FadeIn}
      exiting={FadeOut}
      layout={LinearTransition.springify().mass(0.5)}
      style={{
        width: "100%",
        overflow: "hidden",
        // paddingBottom: 1,
      }}
    >
      {/* 1 or 2 skeletons are plenty for infinite scrolling updates */}
      <SkeletonCard />
      <SkeletonCard />
    </Animated.View>
  );
};

export default Footer;
