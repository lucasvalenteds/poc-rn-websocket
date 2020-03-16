import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  StatusBar,
  FlatList,
  Text,
  View,
  StyleSheet,
  TouchableNativeFeedback,
} from 'react-native';

export interface Message {
  id: string;
  title: string;
  content: string;
  timestamp: string;
}

export const MessageComponent: React.FC<Message> = (
  props,
): React.ReactElement => {
  const style = StyleSheet.create({
    notification: {
      padding: 16,
      width: '100%',
    },
    timestamp: {
      fontSize: 12,
      fontStyle: 'italic',
    },
    title: {
      fontSize: 16,
      fontStyle: 'normal',
      fontWeight: 'bold',
    },
    content: {
      fontSize: 16,
      fontStyle: 'normal',
    },
  });

  return (
    <TouchableNativeFeedback>
      <View style={style.notification}>
        <Text style={style.timestamp}>{props.timestamp}</Text>
        <Text style={style.title}>{props.title}</Text>
        <Text style={style.content}>{props.content}</Text>
      </View>
    </TouchableNativeFeedback>
  );
};

const App: React.FC = (): React.ReactElement => {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    const ws: WebSocket = new WebSocket('ws://localhost:8080/');

    ws.onmessage = (event: WebSocketMessageEvent): void => {
      setMessages((previous: Message[]) => [
        JSON.parse(event.data),
        ...previous,
      ]);
    };

    ws.onclose = (event: WebSocketCloseEvent): void => {
      console.debug('Connection closed', event);
    };

    ws.onerror = (error: WebSocketErrorEvent): void => {
      console.debug('Error happened', error);
    };

    return () => {
      ws.close();
    };
  }, []);

  return (
    <>
      <StatusBar />
      <SafeAreaView>
        <FlatList
          data={messages}
          keyExtractor={(prop) => prop.id}
          renderItem={(prop) => MessageComponent(prop.item)}
        />
      </SafeAreaView>
    </>
  );
};

export default App;
