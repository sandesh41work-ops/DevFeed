import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { getStory } from "../../shared/services/hackerNewsServices";
import { Story } from "../../shared/types/story";
import StoryCard from "../../shared/components/StoryCard";
import Button from "../../shared/components/Button";
import { useNavigation } from "@react-navigation/native";
import { logOutUser } from "../auth/authService";
import SearchBar from "../../shared/components/SearchBar";
import SkeletonCard from "../../shared/components/SkeletonCard";
import { useTheme } from "../../shared/hooks/useTheme";
import { useNetworkStatus } from "../../shared/hooks/useNetworkState";
import { useStoriesQuery } from "./useStoriesQuery";
import Footer from "../../shared/components/Footer";
import Animated, {
  FadeInDown,
  LinearTransition,
  SlideInDown,
  SlideOutUp,
} from "react-native-reanimated";
import EmptyState from "../../shared/components/EmptyState";

const HomeScreen = () => {
  const [stories, setStories] = useState<Story[]>([]);
  const navigation = useNavigation();
  const PAGE_SIZE = 10;
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const isFetching = useRef(false);
  const { isConnected } = useNetworkStatus();
  const { colors } = useTheme();
  const { data: allIds = [], isLoading, error, refetch } = useStoriesQuery();
  const [loading, setLoading] = useState(false);
  const [fetchingFirstPage, setFetchingFirstPage] = useState(true);
  const showSkeletons =
    stories.length === 0 && (isLoading || fetchingFirstPage);

  useEffect(() => {
    // console.log(
    //   "isLoading : ",
    //   isLoading,
    //   "Fetchign first page : ",
    //   fetchingFirstPage,
    // );
    setLoading(isLoading || fetchingFirstPage);
  }, [isLoading, fetchingFirstPage]);

  const loadFirstPage = useCallback(
    async (ids: number[]) => {
      setFetchingFirstPage(true);
      try {
        const firstPageIds = ids.slice(0, PAGE_SIZE);
        const data = await Promise.all(firstPageIds.map((id) => getStory(id)));
        setStories(data);
        setPage(1);
      } catch (e) {
        console.warn(e);
      } finally {
        // console.log("Finallly Called...");
        setFetchingFirstPage(false);
      }
    },
    [fetchingFirstPage],
  );

  useEffect(() => {
    if (allIds.length > 0) {
      loadFirstPage(allIds);
    }
  }, [allIds]);
  const sleep = (ms: number) =>

    new Promise((resolve) => setTimeout(resolve, ms));
  const loadMore = useCallback(async () => {
    if (isFetching.current || loadingMore || searchQuery.length > 0) return;
    const nextPage = page + 1;
    const start = page * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    const nextIds = allIds.slice(start, end); // use allIds from React Query
    if (nextIds.length === 0) return;
    try {
      isFetching.current = true;
      setLoadingMore(true);
      // await sleep(1500);

      const newStories = await Promise.all(
        nextIds.map((id: number) => getStory(id)),
      );
      setStories((prev) => [...prev, ...newStories]);
      setPage(nextPage);
      // await sleep(1500);
    } catch (e) {
      console.warn(e);
    } finally {
      isFetching.current = false;
      setLoadingMore(false);
    }
  }, [page, allIds, loadingMore, searchQuery]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button title="Logout" onPress={logOutUser} style={styles.logoutBtn} />
      ),
    });
  }, [navigation]);

  const renderItem = useCallback(
    ({ item }: { item: Story }) => (
      <Animated.View entering={FadeInDown.duration(400)}>
        <StoryCard story={item} />
      </Animated.View>
    ),
    [],
  );
  const emptyListComponent = useMemo(() => {
    return (
      <Animated.View
        entering={FadeInDown.duration(250)}
        layout={LinearTransition.springify()}
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          // marginTop: 50,
        }}
      >
        <EmptyState
               image={require("../../../assets/illustrations/no_results_light.png")}
               
             />
      </Animated.View>
    );
  }, []);

  useEffect(() => {
    const timeOutId = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500); // debounce by 500ms

    return () => clearTimeout(timeOutId); // cleanup on unmount or query change
  }, [searchQuery]);

  const filteredStories = useMemo(() => {
    // console.log("Filtering stories with query:", debouncedSearch);
    return stories.filter((story) =>
      story.title.toLowerCase().includes(debouncedSearch.toLowerCase()),
    );
  }, [stories, debouncedSearch]);

  return (
    <>
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <View
          style={[
            styles.screenContainer,
            {
              backgroundColor: colors.background,
            },
          ]}
        >
          {!isConnected && (
            <Animated.View
              entering={SlideInDown}
              exiting={SlideOutUp}
              style={styles.networkBanner}
            >
              <Text style={styles.networkBannerText}>
                No internet connection
              </Text>
            </Animated.View>
          )}
          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search stories..."
          />

          {showSkeletons ? (
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
              <Text style={{ color: colors.text }}>{"error"}</Text>
              {/* refetch from react query */}
              <Button
                title="Retry"
                onPress={() => {
                  refetch;
                }}
              />
            </View>
          ) : (
            <View style={[{ flex: 1 }, { backgroundColor: colors.background }]}>
              <FlatList
                initialNumToRender={12}
                maxToRenderPerBatch={10}
                windowSize={10}
                updateCellsBatchingPeriod={30}
                removeClippedSubviews
                decelerationRate="normal"
                bounces={true}
                overScrollMode="always"
                data={filteredStories}
                // data={[]}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
                onRefresh={refetch}
                refreshing={loading}
                onEndReached={loadMore}
                onEndReachedThreshold={1}
                // ListFooterComponent={
                //   filteredStories.length > 0 ? (
                //     <Footer loadingMore={loadingMore} />
                //   ) : null

                // } 
                // 
                 ListFooterComponent={
                  filteredStories.length > 0 ? (
                    <Footer loadingMore={loadingMore} />
                  ) : null
                }
                // ListFooterComponent={null}
                ListEmptyComponent={emptyListComponent}
              />
            </View>
          )}
        </View>
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
  networkBanner: {
    backgroundColor: "#dc2626",
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
  },

  networkBannerText: {
    color: "#fff",
    fontWeight: "600",
  },
});
