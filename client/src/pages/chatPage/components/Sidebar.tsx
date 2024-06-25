import { useEffect, useState } from "react";
import styles from "./sidebar.module.css";

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

interface Props {
  user: any;
  room: string;
  socket: any;
}

const Sidebar = ({ room, socket }: Props) => {
  // Users list
  const [usersList, setUsersList] = useState<object[]>([]);

  // Users list event listener for socket
  useEffect(() => {
    socket.on("chatroom_users", (data: object[]) => {
      console.log(data);
      setUsersList(data);
    });
  }, [socket, room]);

  return (
    <div className={styles.sidebar}>
      <h1>{room && room.split("")[0].toUpperCase() + room.slice(1)}</h1>
      <hr />
      <div className={styles.users_list}>
        <h2>Users Online</h2>
        <ul>
          {usersList.map((_user: any, i) => (
            <li key={"user" + i}>
              <i className="fa-solid fa-circle"></i>
              {" "}
              <div className={styles.avatar}>
                <img src={`${SERVER_URL}${_user.avatar}`} alt="avatar" />
              </div>
              <span>
                {_user.username}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
