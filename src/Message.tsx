import React from 'react';
import { TouchableNativeFeedback, View, StyleSheet, Text } from 'react-native';

export interface Message {
  id: string;
  title: string;
  content: string;
  timestamp: string;
}

export class MessageService {
  private listener?: (message: Message) => void;
  private webSocket: WebSocket;

  public constructor(url = 'ws://localhost:8080/') {
    this.webSocket = new WebSocket(url);
  }

  connect(): void {
    this.webSocket.onmessage = (event: WebSocketMessageEvent): void => {
      if (this.listener) {
        this.listener(JSON.parse(event.data) as Message);
      }
    };

    this.webSocket.onclose = (event: WebSocketCloseEvent): void => {
      console.debug('Connection closed', event);
    };

    this.webSocket.onerror = (error: WebSocketErrorEvent): void => {
      console.debug('Error happened', error);
    };
  }

  disconnect(): void {
    this.webSocket.close();
  }

  onMessage(fn: (message: Message) => void): void {
    this.listener = fn;
  }
}

export const MessageComponent: React.FC<Message> = (props) => {
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
        <Text style={style.timestamp}> {props.timestamp} </Text>
        <Text style={style.title}>{props.title}</Text>
        <Text style={style.content}>{props.content}</Text>
      </View>
    </TouchableNativeFeedback>
  );
};
