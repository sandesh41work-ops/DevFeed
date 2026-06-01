import { useEffect, useLayoutEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { getStory, getTopStories } from "../../shared/services/api";
import { Story } from "../../shared/types/story";
import StoryCard from "../../shared/components/StoryCard";
import Button from "../../shared/components/Button";
import { useNavigation } from "@react-navigation/native";
import { logOutUser } from "../auth/authService";

const HomeScreen = () => {
  const [loading, setLoading] = useState(true);
  const [stories, setStories] = useState<Story[]>([]);
  const [error, setError] = useState("");

  const navigation = useNavigation();

  useEffect(() => {
    fetchStories();
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button title="Logout" onPress={logOutUser} style={styles.logoutBtn} />
      ),
    });
  }, [navigation]);

  const fetchStories = async () => {
    try {
      setLoading(true);
      const ids = await getTopStories();
      const storyPromises = ids.map((id) => getStory(id));
      const data = await Promise.all(storyPromises);
      setStories(data);
    } catch (error) {
      setError("Failed to load stories");
    } finally {
      setLoading(false);
    }
  };
  if (loading) return <ActivityIndicator />;
  if (error)
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>{error}</Text>
        <Button title="Retry" onPress={fetchStories} />
      </View>
    );
  return (
    <View>
      <FlatList
        data={stories}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <StoryCard story={item} />}
        onRefresh={fetchStories}
        refreshing={loading}
      />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  logoutBtn: {
    backgroundColor: "#ef4444",
    paddingHorizontal: 12,
    height: 36,
  },
});
