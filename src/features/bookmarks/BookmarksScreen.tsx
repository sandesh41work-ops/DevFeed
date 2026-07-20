import { useIsFocused } from "@react-navigation/native";
import { useCallback, useEffect, useMemo, useState } from "react";
import Animated, { FlatList, Keyboard, KeyboardAvoidingView, Platform, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import EmptyState from "../../shared/components/EmptyState";
import SearchBar from "../../shared/components/SearchBar";
import SwipeableStoryCard from "../../shared/components/SwipeableStoryCard";
import { useTheme } from "../../shared/hooks/useTheme";
import { getBookmarks, removeBookmark } from "../../shared/services/bookmarkService";
import { Story } from "../../shared/types/story";
import { useSharedValue } from "react-native-reanimated";
const BookmarksScreen = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [stories, setStories] = useState<Story[]>([]);
  const [error, setError] = useState<string>("");
 const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const isFocuesed = useIsFocused();


  const fetchBookMarks = async () => {
    try {
      setLoading(true);
      let data = await getBookmarks();
      setStories(data);
      // console.log(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Something went wrong");
      console.warn(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (isFocuesed) {
      //load all stories on screen mount
      fetchBookMarks();
      // console.log("Fetching bookMarks on every render");
    }
  }, [isFocuesed]);

  useEffect(() => {
    const timeOutId = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500); // debounce by 500ms

    return () => clearTimeout(timeOutId);
  }, [searchQuery]);

  const filteredStories = useMemo(() => {
    return stories.filter((story) =>
      story.title.toLowerCase().includes(debouncedSearch.toLowerCase()),
    );
  }, [stories, debouncedSearch]);
  const emptyBookMarksListCompnent = useMemo(() => {
    return (
      <Animated.View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          alignContent: "center",
          // borderWidth : 1
        }}
      >
        <EmptyState
          image={require("../../../assets/illustrations/no-bookmarks.png")}
          title="Nothing saved yet"
          subtitle="Tap the bookmark icon on any story to build your personal reading list."
          imageSize={300}
        />
      </Animated.View>
    );
  }, []);

  const handleDelete = useCallback(async (id: number) => {
    await removeBookmark(id);
    setStories((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const renderStoryItem = useCallback(
    ({ item }: { item: Story }) => {
      return <SwipeableStoryCard story={item} onDelete={handleDelete} />;
    },
    [handleDelete],
  );
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await fetchBookMarks();
    } catch (error) {
      console.error(error);
    } finally {
      setRefreshing(false);
    }
  }, []);
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >

      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <View
          style={[
            styles.screenContainer,
            {
              backgroundColor: colors.background,
            },
          ]}
        >
          {/* <AppHeader /> */}
          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search stories..."
          />

          <FlatList
            contentContainerStyle={{ flexGrow: 1 }}
            data={filteredStories}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderStoryItem}
            ListEmptyComponent={emptyBookMarksListCompnent}
            onRefresh={onRefresh}
            refreshing={refreshing}
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default BookmarksScreen;

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
  },
});
