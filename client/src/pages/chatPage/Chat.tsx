import styles from './chat.module.css';
import Messages from './components/Messages';
import SendMessage from './components/SendMessage';
import Sidebar from './components/Sidebar';
import LeaveRoom from './components/LeaveRoom';

interface Props {
  username: string;
  room: string;
  socket: any;
}

const Chat = ({ username, room, socket }:Props) => {

  console.log(socket.id);

  return (
    <div className={styles.container}>
      <div className={styles.sidebar_full}>
        <Sidebar username={username} room={room} socket={socket} />
        <LeaveRoom username={username} room={room} socket={socket} />
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
      <aside className={styles.sidebar_mobile}>
        <Sidebar username={username} room={room} socket={socket} />
        <LeaveRoom room={room} socket={socket} />
      </aside>
    </div>
  );
};

export default Chat