import WebSocket, { CloseEvent } from "ws";
import { IncomingMessage } from "http";
import Faker from "faker";
import * as UUID from "uuid";

interface Message {
  id: string;
  title: string;
  content: string;
  timestamp: string;
}

function createMessage(): string {
  const message: Message = {
    id: UUID.v4(),
    title: `${Faker.name.firstName()} ${Faker.name.lastName()}`,
    content: Faker.lorem.sentence(),
    timestamp: Faker.date.recent().toLocaleString(),
  };

  return JSON.stringify(message);
}

const port = 8080;

const ws = new WebSocket.Server({ port });
ws.on("connection", (socket: WebSocket, _request: IncomingMessage) => {
  console.debug("Client connected");
  let handle: NodeJS.Timeout = setInterval(() => {
    socket.send(createMessage(), {}, (error) => {
      if (error) {
        console.debug("Could not send message", error);
      }
    });
  }, 1500);

  socket.on("close", (event: CloseEvent) => {
    console.debug("Client disconnected", event);
    clearInterval(handle);
  });
});

ws.on("listening", () => {
  console.debug("Server started on port", port);
});
