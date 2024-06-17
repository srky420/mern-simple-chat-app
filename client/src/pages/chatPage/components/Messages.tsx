import { useEffect, useRef, useState } from "react";
import styles from "./messages.module.css";

interface Props {
  socket: any;
  user: any;
}

const Messages = ({ socket, user }: Props) => {
  const msgContainer = useRef<any>(null);
  const [messagesReceived, setMessagesReceived] = useState<object[]>([]);

  // Updating messages whenever new message received
  useEffect(() => {
    socket.on(
      "receive_message",
      (data: any) => {
        console.log(data);
        setMessagesReceived((prevState) => [...prevState, data]);

        return () => socket.off("receive_message");
      },
      [socket]
    );

    // Clean up
    return () => socket.off("receive_message");
  }, [socket]);

  // Get last 100 messages
  useEffect(() => {
    socket.on("last_100_messages", (data: any) => {
      const messages = JSON.parse(data);
      setMessagesReceived((state) => [...messages, ...state]);
    });

    // Clean up
    return () => socket.off("last_100_messages");
  }, [socket]);

  // Scroll to bottom on new message
  useEffect(() => {
    msgContainer.current.scrollTop = msgContainer.current.scrollHeight;
  }, [messagesReceived]);

  // Parse date
  function parseDate(timestamp: string) {
    const date = new Date(timestamp);
    return date.toLocaleString();
  }

  return (
    <div className={styles.msgs_container} ref={msgContainer}>
      {messagesReceived.map((msg: any, i) => (
        <div
          className={
            msg.username === user.username
              ? styles.message_box_self
              : msg.id === "chat_bot"
              ? styles.message_box_chatbot
              : styles.message_box
          }
          key={"msg" + i}
        >
          <div className={styles.message_header}>
            <small className={styles.message_date}>
              {parseDate(msg.__createdtime__)}
            </small>
            <h3>
              {msg.id === "chat_bot" && <i className="fa-solid fa-robot"></i>}
              {msg.username}
            </h3>
          </div>
          <div className={styles.message_body}>{msg.message}</div>
        </div>
      ))}
    </div>
  );
};

export default Messages;
