import React from "react";
import { View } from "react-native";
import Loader from "./Loader";

type FooterProps = {
  loadingMore: boolean;
};

const Footer = ({ loadingMore }: FooterProps) => (
  <View
    style={{
      height: 60,
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    {loadingMore ? <Loader size="small" /> : null}
  </View>
);
export default Footer;