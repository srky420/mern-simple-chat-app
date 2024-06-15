import { useEffect, useState } from "react";
import styles from "./sidebar.module.css";

interface Props {
  user: any;
  room: string;
  socket: any;
}

const Sidebar = ({ user, room, socket }: Props) => {

  // Users list
  const [usersList, setUsersList] = useState<object[]>([]);

  // Users list event listener for socket
  useEffect(() => {
    socket.on('chatroom_users', (data: object[]) => {
      console.log(data);
      setUsersList(data);
    });
  }, [socket, room]);

  return (
    <div className={styles.sidebar}>
      <h1>{room && room.split('')[0].toUpperCase() + room.slice(1,)}</h1>
      <hr />
      <div className={styles.users_list}>
        <h2>Users Online</h2>
        <ul>
          {usersList.map((_user: any, i) => (
            <li key={'user' + i}>
              <i className="fa-solid fa-circle"></i>
              <span>{_user.username} {_user.username === user.username && <small style={ {color: 'var(--primary)'} }>You</small>}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default Sidebar