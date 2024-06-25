import styles from "./chat.module.css";
import Messages from "./components/Messages";
import SendMessage from "./components/SendMessage";
import Sidebar from "./components/Sidebar";
import LeaveRoom from "./components/LeaveRoom";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

interface Props {
  user: any;
  room: string;
  setUser: (val: object) => void;
  setRoom: (val: string) => void;
  socket: any;
}

const Chat = ({ user, room, socket, setUser, setRoom }: Props) => {
  const [cookies] = useCookies(["token"]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!cookies.token) {
      localStorage.removeItem("chat_room_data");
      navigate("/login");
    }

    // Check localStorage for chat room data
    if (localStorage.getItem("chat_room_data")) {
      if (room === "") {
        let data: any = localStorage.getItem("chat_room_data");
        const { user, room } = JSON.parse(data);
        socket.emit("join_room", { user, room });
        setUser(user);
        setRoom(room);
      }
    } else {
      navigate("/", { replace: true });
    }
  }, [cookies]);

  return (
    <div className={styles.container}>
      <div className={styles.sidebar_full}>
        <Sidebar user={user} room={room} socket={socket} />
        <LeaveRoom user={user} room={room} socket={socket} />
      </div>
      <div className={styles.chatbox}>
        <Messages socket={socket} user={user} />
        <SendMessage socket={socket} user={user} room={room} />
      </div>
      <input
        type="checkbox"
        onChange={() => console.log("changed")}
        id={styles.sidebar_toggle}
      />
      <div className={styles.overlay}></div>
      <label className={styles.sidebaropen} htmlFor={styles.sidebar_toggle}>
        <i className="fa-solid fa-circle-chevron-right"></i>
      </label>
      <aside className={styles.sidebar_mobile}>
        <Sidebar user={user} room={room} socket={socket} />
        <LeaveRoom user={user} room={room} socket={socket} />
      </aside>
    </div>
  );
};

export default Chat;
