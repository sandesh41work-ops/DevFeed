import React from "react";
import { View } from "react-native";
import Loader from "./Loader";
import Animated, { FadeInDown, LinearTransition } from "react-native-reanimated";

type FooterProps = {
  loadingMore: boolean;
};

const Footer = ({ loadingMore }: FooterProps) => (
  <Animated.View
    layout={LinearTransition.springify()}
    style={{
      height: 40,
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    {loadingMore ? <Loader size="small" /> : null}
  </Animated.View>
);
export default Footer;