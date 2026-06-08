import { useCallback, useEffect, useLayoutEffect, useState } from "react";
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
  const [loading, setLoading] = useState<boolean>(true);
  const [stories, setStories] = useState<Story[]>([]);
  const [error, setError] = useState<string>("");
  const [ids, setIds] = useState<number[]>([]);
  const navigation = useNavigation();
  const PAGE_SIZE = 10;
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);

  const loadMore = useCallback(async () => {
    if (loadingMore) return;
    const nextPage = page + 1;
    const start = page * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    const nextIds = ids.slice(start, end);
    if (nextIds.length === 0) return;
    setLoadingMore(true);
    const newStories = await Promise.all(nextIds.map((id) => getStory(id)));
    setStories((prev) => [...prev, ...newStories]); // append, don't replace
    setPage(nextPage);
    setLoadingMore(false);
  }, [page, ids, loadingMore]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button title="Logout" onPress={logOutUser} style={styles.logoutBtn} />
      ),
    });
  }, [navigation]);

  const renderItem = useCallback(
    ({ item }: { item: Story }) => <StoryCard story={item} />,
    [],
  );

  const fetchStories = useCallback(async () => {
    try {
      setLoading(true);
      const ids = await getTopStories();
      setIds(ids);
      const firstPageIds = ids.slice(0, PAGE_SIZE);
      console.log(firstPageIds);
      const storyPromises = firstPageIds.map((id) => getStory(id));

      const data = await Promise.all(storyPromises);

      setStories(data);
    } catch (error) {
      setError("Failed to load stories");
    } finally {
      setLoading(false);
    }
  }, []); // only run once on mount

  useEffect(() => {
    fetchStories();
  }, [fetchStories]);

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
        renderItem={renderItem}
        onRefresh={fetchStories}
        refreshing={loading}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={loadingMore ? <ActivityIndicator /> : null}
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
