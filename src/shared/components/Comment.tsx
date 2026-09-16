import RenderHTML from "react-native-render-html";
import { useWindowDimensions } from "react-native";
import { useTheme } from "../hooks/useTheme";
import { fonts } from "../constants/fonts";

type Props = {
  html: string;
};

const CommentHtml = ({ html }: Props) => {
  const { width } = useWindowDimensions();
  const { colors } = useTheme();

  return (
    <RenderHTML
      contentWidth={width}
      source={{ html }}
      tagsStyles={{
        body: {
          color: colors.text,
          fontSize: 14,
          lineHeight: 21,
          fontFamily: fonts.regular,
        },
        p: {
          color: colors.text,
          marginVertical: 3,
        },
        a: {
          color: colors.accent,
        },
        pre: {
          fontFamily: fonts.mono,
          backgroundColor: colors.background,
          padding: 8,
          borderRadius: 6,
          fontSize: 12,
        },
        code: {
          fontFamily: fonts.mono,
          fontSize: 12,
        },
        blockquote: {
          borderLeftWidth: 2,
          borderLeftColor: colors.accent,
          paddingLeft: 8,
          marginVertical: 4,
          opacity: 0.85,
        },
      }}
    />
  );
};

export default CommentHtml;
