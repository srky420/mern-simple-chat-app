import { useEffect, useRef, useState } from "react";
import styles from "./messages.module.css"

const Messages = ({ socket }:any) => {

  const msgContainer = useRef<any>(null);
  const [messagesReceived, setMessagesReceived] = useState<object[]>([]);

  // Updating messages whenever new message received
  useEffect(() => {
    socket.on('receive_message', (data:any) => {
      console.log(data);
      setMessagesReceived(prevState => [
          ...prevState,
          {
            id: data.id,
            message: data.message,
            username: data.username,
            __createdtime__: data.__createdtime__,
          }
        ]);

      return () => socket.off('receive_message');
    }, [socket]);

    // Clean up
    return () => socket.off('receive_message');
  }, [socket]);

  // Scroll to bottom on new message
  useEffect(() => {
    msgContainer.current.scrollTop = msgContainer.current.scrollHeight;
  }, [messagesReceived]);

  // Parse date
  function parseDate(timestamp:string) {
    const date = new Date(timestamp);
    return date.toLocaleString()
  }

  return (
    <div className={styles.msgs_container} ref={msgContainer}>
      {messagesReceived.map((msg:any, i) => (
        <div className={msg.id === socket.id ? styles.message_box_self : styles.message_box} key={'msg' + i}>
          <div className={styles.message_header}>
            <h3>{msg.username}</h3>
            <p>{parseDate(msg.__createdtime__)}</p>
          </div>
          <div className={styles.message_body}>
            {msg.message}
          </div>
        </div>
      ))}
    </div>
  )
}

export default Messages