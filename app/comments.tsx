import React, { useState, useReducer } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ScrollView,
  TextInput,
  Modal,
  Share,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { baseUrl } from '../shared/baseUrl';
import { Divider, Input, Button, Icon, Image } from 'react-native-elements';

type Meme = {
  id: number;
  name: string;
  image: string;
  upvotes: number;
  downvotes: number;
};

type Comment = {
  id: number;
  memeId: number;
  author: string;
  text: string;
  date: string;
};

type CommentAction =
  | { type: 'ADD_COMMENT'; payload: Comment };

type CommentState = Comment[];

function commentReducer(state: CommentState, action: CommentAction): CommentState {
  switch (action.type) {
    case 'ADD_COMMENT':
      return [...state, action.payload];
    default:
      return state;
  }
}

const mockMemes: Meme[] = [
  { id: 1, name: 'Pepe Laugh', image: 'images/sample.jpg', upvotes: 10, downvotes: 2 },
  { id: 2, name: 'Shrek Vibes', image: 'images/shrek.jpg', upvotes: 6, downvotes: 3 },
];

export default function Comments() {
  const { memeId } = useLocalSearchParams();
  const memeIdNum = Number(memeId);

  const meme = mockMemes.find((m) => m.id === memeIdNum);

  const [comments, dispatch] = useReducer(commentReducer, []);
  const [author, setAuthor] = useState('');
  const [text, setText] = useState('');
  const [showModal, setShowModal] = useState(false);

  const handleComment = () => {
    const newComment: Comment = {
      id: Date.now(),
      memeId: memeIdNum,
      author,
      text,
      date: new Date().toISOString(),
    };
    dispatch({ type: 'ADD_COMMENT', payload: newComment });
    setShowModal(false);
    setAuthor('');
    setText('');
  };

  const shareMeme = (title: string, url: string) => {
    Share.share(
      { title, message: `Check out this meme ---- "${title}": ${url}` },
      { dialogTitle: 'Share ' + title }
    );
  };

  const renderCommentItem = ({ item }: { item: Comment }) => (
    <View style={{ margin: 10 }}>
      <Text style={{ fontSize: 10, fontWeight: 'bold' }}>
        {item.author}, {item.date}
      </Text>
      <Text style={{ fontSize: 18 }}>{item.text}</Text>
      <Divider style={{ height: 20 }} />
    </View>
  );

  if (!meme) return <Text>Meme not found</Text>;

  const memeComments = comments.filter((c) => c.memeId === memeIdNum);

  return (
    <ScrollView>
      <View>
        <View style={styles.titleView}>
          <Text style={styles.titleText}>{meme.name}</Text>
        </View>
        <Image
          style={styles.imageStyle}
          source={{ uri: baseUrl + meme.image }}
          resizeMode='cover'
        />
        <View style={styles.cardRow}>
          <Icon name='arrow-up' type='font-awesome' raised reverse size={15} color='#9d9fa3' />
          <Text style={{ marginRight: 10 }}>{meme.upvotes}</Text>
          <Icon name='arrow-down' type='font-awesome' raised reverse size={15} color='#9d9fa3' />
          <Text style={{ marginRight: 80 }}>{meme.downvotes}</Text>
          <Icon
            name='pencil'
            type='font-awesome'
            raised
            reverse
            size={15}
            color='#9d9fa3'
            onPress={() => setShowModal(true)}
          />
          <Icon
            name='share'
            type='font-awesome'
            raised
            reverse
            size={15}
            color='#9d9fa3'
            onPress={() => shareMeme(meme.name, baseUrl + meme.image)}
          />
        </View>
        <View style={styles.dividerView} />
      </View>

      <FlatList
        data={memeComments}
        renderItem={renderCommentItem}
        keyExtractor={(item) => item.id.toString()}
      />

      {/* Comment Input */}
      <View style={{ padding: 10 }}>
        <TextInput
          placeholder='Comment'
          multiline
          numberOfLines={4}
          onChangeText={setText}
          value={text}
          style={{
            borderColor: '#ccc',
            borderWidth: 1,
            padding: 10,
            borderRadius: 5,
          }}
        />
        <Button title='Submit' onPress={handleComment} style={{ marginTop: 10 }} />
      </View>

      {/* Modal */}
      <Modal
        animationType='slide'
        visible={showModal}
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modal}>
          <Text style={styles.modalTitle}>Add a comment</Text>
          <Input
            placeholder='Author'
            leftIcon={{ type: 'font-awesome', name: 'user-o' }}
            leftIconContainerStyle={{ paddingRight: 10 }}
            onChangeText={setAuthor}
            value={author}
          />
          <Input
            placeholder='Comment'
            multiline
            numberOfLines={4}
            leftIcon={{ type: 'font-awesome', name: 'comment-o' }}
            leftIconContainerStyle={{ paddingRight: 10 }}
            onChangeText={setText}
            value={text}
          />
          <View style={{ margin: 10 }}>
            <Button title='Submit' onPress={handleComment} />
            <Button
              title='Cancel'
              type='outline'
              onPress={() => {
                setShowModal(false);
                setAuthor('');
                setText('');
              }}
              containerStyle={{ marginTop: 10 }}
            />
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  cardRow: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginTop: 6,
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
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  modal: {
    justifyContent: 'center',
    marginTop: 100,
    paddingHorizontal: 20,
  },
});
