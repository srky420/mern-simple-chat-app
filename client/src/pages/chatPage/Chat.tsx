import styles from './chat.module.css';
import Messages from './components/Messages';
import SendMessage from './components/SendMessage';
import Sidebar from './components/Sidebar';
import LeaveRoom from './components/LeaveRoom';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface Props {
  username: string;
  room: string;
  setUsername: (val: string) => void;
  setRoom: (val: string) => void;
  socket: any;
}

const Chat = ({ username, room, socket, setUsername, setRoom }: Props) => {

  const navigate = useNavigate();

  useEffect(() => {
    // Check localStorage for chat room data
    if (localStorage.getItem('chat_room_data')) {
      if (username === '' || room === '') {
        let data: any = localStorage.getItem('chat_room_data');
        const { username, room } = JSON.parse(data);
        socket.emit('join_room', { username, room });
        setUsername(username);
        setRoom(room);
      }
    }
    else {
      navigate('/', { replace: true });
    }
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.sidebar_full}>
        <Sidebar room={room} socket={socket} />
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
        <Sidebar room={room} socket={socket} />
        <LeaveRoom username={username} room={room} socket={socket} />
      </aside>
    </div>
  );
};

export default Chat