import { StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../../shared/hooks/useTheme";
import { Story } from "../../shared/types/story";
import { useCallback, useEffect, useState } from "react";
import { useIsFocused } from "@react-navigation/native";
import SearchBar from "../../shared/components/SearchBar";
import { getBookmarks } from "../../shared/services/bookmarkService";
import { FlatList } from "react-native";
import StoryCard from "../../shared/components/StoryCard";
import { useMemo } from "react";
import SwipeableStoryCard from "../../shared/components/SwipeableStoryCard";
import { removeBookmark } from "../../shared/services/bookmarkService";
import AppHeader from "../../shared/components/AppHeader";

const BookmarksScreen = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [stories, setStories] = useState<Story[]>([]);
  const [error, setError] = useState<string>("");
  const [searchBookMark, setSearchBookMark] = useState<string>("");
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

  const emptyBookMarksListCompnent = useMemo(() => {
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
          No BookMarks Found...
        </Text>
        <Text
          style={[{ fontSize: 16, color: "#262424", marginTop: 25 }, { color: colors.subtext }]}
        >
          Tap the bookmark button on any article
        </Text>
      </View>
    );
  }, []);

const handleDelete = useCallback(async (id: number) => {
  await removeBookmark(id)
  setStories(prev => prev.filter(s => s.id !== id))
}, [])

const renderStoryItem = useCallback(({ item }: { item: Story }) => {
  return (
    <SwipeableStoryCard
      story={item}
      onDelete={handleDelete}
    />
  )
}, [handleDelete])
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await fetchBookMarks();
    } catch (error) {
      console.error(error);
    } finally {
      setRefreshing(false);
    }
  }, [])
  return (
    <View
      style={[
        styles.screenContainer,
        {
          backgroundColor: colors.background,
          // 2. Dynamically push EVERYTHING down past the phone's notch/status bar
          paddingTop: insets.top > 0 ? insets.top : 12,
        },
      ]}
    >
      <AppHeader />
      <SearchBar
        value={searchBookMark}
        onChangeText={setSearchBookMark}
        placeholder="Search stories..."
      />
      <FlatList
        data={stories}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderStoryItem}
        ListEmptyComponent={emptyBookMarksListCompnent}
        onRefresh={onRefresh}
        refreshing={refreshing}
      />
    </View>
  );
};

export default BookmarksScreen;

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
  },
});
