import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native'
import { getStory, getTopStories } from '../../shared/services/api';
import { Story } from '../../shared/types/story';
import StoryCard from '../../shared/components/StoryCard';

const HomeScreen = () => {
  const [loading, setLoading] = useState(true);
  const [stories, setStories] = useState<Story[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchStories()
  }, [])
  const fetchStories = async () => {
    try {
      setLoading(true);
      const ids = await getTopStories();
      const storyPromises = ids.map(id => getStory(id))
      const data = await Promise.all(storyPromises);
      setStories(data);

    } catch (error) {
      setError("Failed to load stories");
    } finally {
      setLoading(false);
    }
  }
  if (loading) return <ActivityIndicator />
  if (error) return <Text>{error}</Text>
  return (
    <View>
      <FlatList
        data={stories}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => <StoryCard story={item} />}
      />
    </View>
  )
}

export default HomeScreen

