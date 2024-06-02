import { SyntheticEvent, useState } from "react";
import styles from "./sendmessage.module.css";

interface Props {
  username: string;
  room: string;
  socket: any;
}

const SendMessage = ({ username, room, socket }: Props) => {

  const [message, setMessage] = useState('');

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    // Emit message to the server with data
    const __createdtime__ = Date.now();
    if (message !== '') {
      console.log('Username: ' + username + 'Room: ' + room);
      socket.emit('send_message', { id: socket.id, username, message, room, __createdtime__ });
      setMessage('');
    }
  }

  return (
    <form className={styles.chat_form} onSubmit={handleSubmit}>
      <input 
        type="text" 
        className={styles.chat_input} 
        value={message} 
        onChange={(e) => setMessage(e.target.value)} 
        placeholder="Type message..."
      />
      <input type="submit" value="Send" />
    </form>
  )
}

export default SendMessage