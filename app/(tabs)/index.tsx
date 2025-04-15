import React, { useCallback, useReducer, useEffect } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  Share,
  Image,
  TouchableOpacity,
} from 'react-native';
import { Icon } from 'react-native-elements';
import { useRouter } from 'expo-router';
import { Meme } from '../../shared/types';
import { baseUrl } from '../../shared/baseUrl';

// Initial State

const initialState: State = {
  memes: [],
};

type State = {
  memes: Meme[];
};

// Actions
const ADD_MEMES = 'ADD_MEMES';


// Reducer
type Action = { type: 'ADD_MEMES'; payload: Meme[] };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'ADD_MEMES':
      return { ...state, memes: action.payload };
    default:
      return state;
  }
};

// Mocked fetch function — replace with actual API
const fetchMemes = async () => {
  const response = await fetch(baseUrl + 'memes');
  if (!response.ok) throw new Error('Failed to fetch memes');
  return await response.json();
};

const shareMeme = (title: string, url: string) => {
  Share.share(
    {
      title,
      message: `Check out this meme ---- "${title}": ${url}`,
    },
    {
      dialogTitle: 'Share ' + title,
    }
  );
};

export default function PopularMemesScreen() {
  const router = useRouter();
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const loadMemes = async () => {
      try {
        const memes = await fetchMemes();
        dispatch({ type: ADD_MEMES, payload: memes });
      } catch (err) {
        console.error('Error loading memes:', err);
      }
    };
    loadMemes();
  }, []);

  const renderMeme = useCallback(({ item }: { item: Meme }) => {
    return (
      <View>
        <View style={styles.titleView}>
          <Text
            style={styles.titleText}
            onPress={() => router.push({ pathname: '/comments', params: { memeId: item.id } })}
          >
            {item.name}
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => router.push({ pathname: '/comments', params: { memeId: item.id } })}
        >
          <Image
            source={{ uri: baseUrl + item.image }}
            style={styles.imageStyle}
            resizeMode="cover"
          />
        </TouchableOpacity>

        <View style={styles.cardRow}>
          <Icon name="arrow-up" type="font-awesome" raised reverse size={15} color="#9d9fa3" />
          <Text style={{ marginRight: 10 }}>{item.upvotes}</Text>
          <Icon name="arrow-down" type="font-awesome" raised reverse size={15} color="#9d9fa3" />
          <Text style={{ marginRight: 80 }}>{item.downvotes}</Text>
          <Icon
            name="comments"
            type="font-awesome"
            raised
            reverse
            size={15}
            color="#9d9fa3"
            onPress={() => router.push({ pathname: '/comments', params: { memeId: item.id } })}
          />
          <Icon
            name="share"
            type="font-awesome"
            raised
            size={15}
            reverse
            color="#9d9fa3"
            onPress={() => shareMeme(item.name, baseUrl + item.image)}
          />
        </View>

        <View style={styles.dividerView} />
      </View>
    );
  }, []);

  return (
    <FlatList
      data={state.memes}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderMeme}
      contentContainerStyle={{ paddingBottom: 16 }}
    />
  );
}

const styles = StyleSheet.create({
  cardRow: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginTop: 6,
    marginBottom: 6,
  },
  titleView: {
    alignItems: 'center',
    justifyContent: 'center',
    margin: 19,
  },
  titleText: {
    fontSize: 25,
    fontWeight: 'bold',
  },
  imageStyle: {
    width: '100%',
    height: 365,
  },
  dividerView: {
    height: 10,
    backgroundColor: '#e6e6e6',
  },
});
