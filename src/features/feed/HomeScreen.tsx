import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { getStory, getTopStories } from "../../shared/services/api";
import { Story } from "../../shared/types/story";
import StoryCard from "../../shared/components/StoryCard";
import Button from "../../shared/components/Button";
import { useNavigation } from "@react-navigation/native";
import { logOutUser } from "../auth/authService";
import SearchBar from "../../shared/components/SearchBar";
import Loader from "../../shared/components/Loader";
import SkeletonCard from "../../shared/components/SkeletonCard";
import { useTheme } from "../../shared/hooks/useTheme";
import { useSafeAreaInsets } from "react-native-safe-area-context";
const HomeScreen = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [stories, setStories] = useState<Story[]>([]);
  const [error, setError] = useState<string>("");
  const [ids, setIds] = useState<number[]>([]);
  const navigation = useNavigation();
  const PAGE_SIZE = 10;
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const isFetching = useRef(false);

  const { colors } = useTheme();
  const reRenderCount = useRef(0);
  useEffect(() => {
    reRenderCount.current += 1;
    // console.log("HomeScreen re-rendered", reRenderCount.current);
  });

  const loadMore = useCallback(async () => {
    // console.log("Load more triggered. Current page:", page);
    // console.log("serach query : ", searchQuery);
    // console.log("loadingMore:", loadingMore);

    if (isFetching.current || loadingMore || searchQuery.length > 0) return;
    const nextPage = page + 1;
    const start = page * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    const nextIds = ids.slice(start, end);
    if (nextIds.length === 0) return;
    try {
      isFetching.current = true;
      setLoadingMore(true);
      console.log("page ", page);
      const newStories = await Promise.all(nextIds.map((id) => getStory(id)));
      setPage(nextPage);

      setStories((prev) => [...prev, ...newStories]); // append, don't replace
    } catch (error) {
      console.warn(error);
    } finally {
      isFetching.current = false;
      setLoadingMore(false);
    }
  }, [page, ids, loadingMore, searchQuery]);

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

  const emptyListComponent = useMemo(() => {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          marginTop: 50,
        }}
      >
        <Text
          style={[{ fontSize: 16, color: "#262424" }, { color: colors.text }]}
        >
          No stories found.
        </Text>
      </View>
    );
  }, []);

  const fetchStories = useCallback(async () => {
    try {
      setLoading(true);
      const ids = await getTopStories();
      setIds(ids);
      const firstPageIds = ids.slice(0, PAGE_SIZE);
      // console.log(firstPageIds);
      const storyPromises = firstPageIds.map((id) => getStory(id));

      const data = await Promise.all(storyPromises);

      setStories(data);
    } catch (error) {
      setError((error as Error)?.toString());
    } finally {
      setLoading(false);
    }
  }, []); // only run once on mount

  useEffect(() => {
    const timeOutId = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500); // debounce by 500ms

    return () => clearTimeout(timeOutId); // cleanup on unmount or query change
  }, [searchQuery]);

  useEffect(() => {
    fetchStories();
  }, [fetchStories]);

  const filteredStories = useMemo(() => {
    // console.log("Filtering stories with query:", debouncedSearch);
    return stories.filter((story) =>
      story.title.toLowerCase().includes(debouncedSearch.toLowerCase()),
    );
  }, [stories, debouncedSearch]);
  const insets = useSafeAreaInsets();
  return (
    <>
      <View style={[
        styles.screenContainer,
        {
          backgroundColor: colors.background,
          // 2. Dynamically push EVERYTHING down past the phone's notch/status bar
          paddingTop: insets.top > 0 ? insets.top : 12
        }
      ]}>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search stories..."
        />
        {loading ? (
          <FlatList
            data={[1, 2, 3, 4, 5, 6, 7, 8]}
            keyExtractor={(item) => item.toString()}
            renderItem={() => (
              <View style={[{ flex: 1 }, { backgroundColor: colors.card }]}>
                <SkeletonCard />
              </View>
            )}
          />
        ) : error ? (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: colors.background,
            }}
          >
            <Text style={{ color: colors.text }}>{error}</Text>
            <Button title="Retry" onPress={fetchStories} />
          </View>
        ) : (
          <View style={[{ flex: 1 }, { backgroundColor: colors.background }]}>
            <FlatList
              data={filteredStories}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderItem}
              onRefresh={fetchStories}
              refreshing={loading}
              onEndReached={loadMore}
              onEndReachedThreshold={0.5}
              ListFooterComponent={loadingMore ? <Loader size="small" /> : null}
              ListEmptyComponent={emptyListComponent}
            />
          </View>
        )}
      </View>
    </>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  logoutBtn: {
    backgroundColor: "#ef4444",
    paddingHorizontal: 12,
    height: 36,
  },
  screenContainer: {
    flex: 1, // Ensures the layout takes up the full display height
  },
});
