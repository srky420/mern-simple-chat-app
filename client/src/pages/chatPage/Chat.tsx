import { useState } from 'react';
import styles from './chat.module.css';
import Messages from './Messages';
import SendMessage from './SendMessage';

interface Props {
  username: string;
  room: string;
  socket: any;
}

const Chat = ({ username, room, socket }:Props) => {

  return (
    <div className={styles.container}>
      <div className={styles.userslist}>

      </div>
      <div className={styles.chatbox}>
        <Messages socket={socket} />
        <SendMessage socket={socket} username={username} room={room} />
      </div>
      <input type="checkbox" onChange={() => console.log('changed')} id={styles.sidebar_toggle} />
      <div className={styles.overlay}></div>
      <label className={styles.sidebaropen} htmlFor={styles.sidebar_toggle}>
        <i className="fa-solid fa-circle-chevron-right"></i>
      </label>
      <aside className={styles.sidebar}>

      </aside>
    </div>
  );
};

export default Chat