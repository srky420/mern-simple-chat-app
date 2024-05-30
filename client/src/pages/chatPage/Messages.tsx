import { useEffect, useState } from "react";
import styles from "./messages.module.css"

const Messages = ({ socket }:any) => {

  const [messagesReceived, setMessagesReceived] = useState<object[]>([]);

  // Updating messages whenever new message received
  useEffect(() => {
    socket.on('receive_message', (data:any) => {
      console.log(data);
      setMessagesReceived(prevState => [
          ...prevState,
          {
            message: data.message,
            username: data.username,
            __createdtime__: data.__createdtime__,
          }
        ]);
    });

    // Clean up
    return () => socket.off('receive_message');
  }, [socket]);

  // Parse date
  function parseDate(timestamp:string) {
    const date = new Date(timestamp);
    return date.toLocaleString()
  }

  return (
    <div className={styles.msgs_container}>
      {messagesReceived.map((msg:any, i) => (
        <div className={styles.message_box} key={'msg' + i}>
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