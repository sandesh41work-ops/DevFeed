import RenderHTML from "react-native-render-html";
import { useWindowDimensions } from "react-native";
import { useTheme } from "../hooks/useTheme";

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
          lineHeight: 22,
        },
        p: {
          color: colors.text,
          marginVertical: 4,
        },
        a: {
          color: colors.accent,
        },
      }}
    />
  );
};

export default CommentHtml;