import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { Linking, Share, View } from "react-native";

jest.mock("react-native-webview", () => {
  const React = require("react");
  const { View } = require("react-native");
  const MockWebView = React.forwardRef((props: any, ref: any) => {
    React.useImperativeHandle(ref, () => ({
      goBack: jest.fn(),
      goForward: jest.fn(),
      reload: jest.fn(),
    }));
    return <View testID="mock-webview" {...props} />;
  });
  return { WebView: MockWebView };
});

jest.mock("expo-observe", () => ({
  useObserve: () => ({ markInteractive: jest.fn() }),
}));

jest.mock("@expo/vector-icons", () => ({
  Ionicons: "Ionicons",
}));

jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: () => ({ bottom: 20, top: 0, left: 0, right: 0 }),
}));

let mockRouteParams: any = { url: "https://example.com", title: "Test Article" };

jest.mock("@react-navigation/native", () => ({
  useRoute: () => ({ params: mockRouteParams }),
}));

jest.mock("../../../shared/hooks/useTheme", () => ({
  useTheme: () => ({
    isDark: true,
    colors: {
      background: "#1a1a1a",
      card: "#2a2a2a",
      text: "#ffffff",
      subtext: "#aaaaaa",
      border: "#333333",
      accent: "#FF6600",
    },
  }),
}));

import ArticleWebViewScreen from "../ArticleWebViewScreen";

describe("ArticleWebViewScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockRouteParams = { url: "https://example.com", title: "Test Article" };
  });

  it("renders empty view when url is missing", () => {
    mockRouteParams = { url: "" };
    const { getByText } = render(<ArticleWebViewScreen />);
    expect(getByText("No article URL available.")).toBeTruthy();
  });

  it("renders progress bar and toolbar action buttons", () => {
    const { getByTestId } = render(<ArticleWebViewScreen />);
    expect(getByTestId("browser-progress-bar")).toBeTruthy();
    expect(getByTestId("browser-back-button")).toBeTruthy();
    expect(getByTestId("browser-forward-button")).toBeTruthy();
    expect(getByTestId("browser-reload-button")).toBeTruthy();
    expect(getByTestId("browser-share-button")).toBeTruthy();
    expect(getByTestId("browser-external-button")).toBeTruthy();
  });

  it("triggers Share when share button is pressed", async () => {
    const shareSpy = jest.spyOn(Share, "share").mockResolvedValue({ action: "sharedAction" });
    const { getByTestId } = render(<ArticleWebViewScreen />);
    fireEvent.press(getByTestId("browser-share-button"));
    expect(shareSpy).toHaveBeenCalledWith({
      title: "Test Article",
      message: "https://example.com",
      url: "https://example.com",
    });
  });

  it("triggers Linking.openURL when open externally button is pressed", async () => {
    const canOpenSpy = jest.spyOn(Linking, "canOpenURL").mockResolvedValue(true);
    const openUrlSpy = jest.spyOn(Linking, "openURL").mockResolvedValue();
    const { getByTestId } = render(<ArticleWebViewScreen />);
    await fireEvent.press(getByTestId("browser-external-button"));
    expect(canOpenSpy).toHaveBeenCalledWith("https://example.com");
    expect(openUrlSpy).toHaveBeenCalledWith("https://example.com");
  });
});
