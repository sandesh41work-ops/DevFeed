import { useIsFocused } from "@react-navigation/native";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
} from "react-native";
import Animated, {
  FadeInDown,
  LinearTransition,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import EmptyState from "../../shared/components/EmptyState";
import SearchBar from "../../shared/components/SearchBar";
import SkeletonCard from "../../shared/components/SkeletonCard";
import SwipeableStoryCard from "../../shared/components/SwipeableStoryCard";
import { useTheme } from "../../shared/hooks/useTheme";
import {
  getBookmarks,
  removeBookmark,
} from "../../shared/services/bookmarkService";
import { Story } from "../../shared/types/story";

const BookmarksScreen = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [stories, setStories] = useState<Story[]>([]);
  const [error, setError] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const isFocused = useIsFocused(); // Fixed typo

  // Separate initial screen load from pull-to-refresh
  const fetchBookmarks = useCallback(async (isInitial = false) => {
    try {
      if (isInitial) setLoading(true);
      const data = await getBookmarks();
      setStories(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      console.warn(err);
    } finally {
      if (isInitial) setLoading(false);
      // setIsini
    }
  }, []);

  useEffect(() => {
    if (isFocused) {
      fetchBookmarks(stories.length == 0);
    }
  }, [isFocused, fetchBookmarks]);

  useEffect(() => {
    const timeOutId = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);

    return () => clearTimeout(timeOutId);
  }, [searchQuery]);

  const filteredStories = useMemo(() => {
    return stories.filter((story) =>
      story.title.toLowerCase().includes(debouncedSearch.toLowerCase())
    );
  }, [stories, debouncedSearch]);

  const handleDelete = useCallback(async (id: number) => {
    await removeBookmark(id);
    setStories((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const renderStoryItem = useCallback(
    ({ item }: { item: Story }) => (
      <SwipeableStoryCard story={item} onDelete={handleDelete} />
    ),
    [handleDelete]
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchBookmarks(false); // Keeps list mounted during refresh
    setRefreshing(false);
  }, [fetchBookmarks]);

  return (
    <KeyboardAvoidingView
      style={[styles.screenContainer, {backgroundColor : colors.background}]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={[styles.screenContainer, { backgroundColor: colors.background }]}>
        {/* Persistent Search Bar Header */}
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search stories..."
        />

        {/* Dynamic Body Content */}
        {loading ? (
          <FlatList
            data={[1, 2, 3, 4, 5, 6]}
            keyExtractor={(item) => item.toString()}
            renderItem={() => (
              <View style={{ backgroundColor: colors.card, marginBottom: 8 }}>
                <SkeletonCard />
              </View>
            )}
            contentContainerStyle={{ paddingBottom: insets.bottom + 16 }}
          />
        ) : (
          <FlatList
            data={filteredStories}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderStoryItem}
            keyboardShouldPersistTaps="handled"
            onRefresh={onRefresh}
            refreshing={refreshing}
            contentContainerStyle={[
              styles.listContent,
              { paddingBottom: insets.bottom + 16 },
            ]}
            ListEmptyComponent={
              <Animated.View
                entering={FadeInDown.duration(250)}
                layout={LinearTransition.springify()}
                style={styles.emptyContainer}
              >
                <EmptyState
                  image={require("../../../assets/illustrations/no-bookmarks.png")}
                  title="Nothing saved yet"
                  subtitle="Tap the bookmark icon on any story to build your personal reading list."
                  imageSize={300}
                />
              </Animated.View>
            }
          />
        )}
      </View>
    </KeyboardAvoidingView>
  );
};

export default BookmarksScreen;

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,

  },
  listContent: {
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});