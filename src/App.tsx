import React, { useEffect, useState } from 'react';
import { SafeAreaView, StatusBar, FlatList } from 'react-native';
import { Message, MessageComponent, MessageService } from './Message';

const App: React.FC = (): React.ReactElement => {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    const service = new MessageService();

    service.onMessage((message: Message) => {
      setMessages((previous: Message[]) => [message, ...previous]);
    });

    service.connect();

    return () => service.disconnect();
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
