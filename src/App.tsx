import React, { useEffect, useState } from 'react';
import { SafeAreaView, StatusBar, FlatList, View } from 'react-native';
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
          ItemSeparatorComponent={() => (
            <View style={{ height: 1, backgroundColor: '#22222222' }} />
          )}
        />
      </SafeAreaView>
    </>
  );
};

export default App;
