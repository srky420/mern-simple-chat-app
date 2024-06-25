import { SyntheticEvent, useEffect } from "react";
import styles from "./home.module.css";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import { toast } from "react-toastify";
import { roomData } from "../../data/roomData";

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

interface Props {
  user: any;
  room: string;
  setUser: (obj: object) => void;
  setRoom: (val: string) => void;
  socket: any;
}

const Home = ({ user, room, setUser, setRoom, socket }: Props) => {
  // React coookies hook
  const [cookies, _, removeCookie] = useCookies(["token"]);

  // Navigation hook
  const navigate = useNavigate();

  // Ensure user logged in or not
  useEffect(() => {
    async function verifyUser() {
      if (!cookies.token) {
        localStorage.removeItem("chat_room_data");
        navigate("/login");
      }

      // Request backend for index data
      const { data } = await axios.post(
        `${SERVER_URL}/`,
        {},
        {
          withCredentials: true,
        }
      );

      const { status, user } = data;
      if (status) {
        setUser(user);
        console.log(user);
      } else {
        setUser({});
        setRoom("");
        return removeCookie("token"), navigate("/login", { replace: true });
      }
    }
    verifyUser();
  }, [cookies, removeCookie]);

  const handleLogout = () => {
    removeCookie("token");
    setUser({});
    setRoom("");
    navigate("/", { replace: true });
    toast.success("You have logged out.", {
      position: "bottom-right",
    });
  };

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    // Check username and room not empty
    if (room === "") {
      return;
    }

    // Emit socket event join_room, and redirect
    socket.emit("join_room", { user, room });
    localStorage.setItem("chat_room_data", JSON.stringify({ user, room }));
    navigate("/chat", { replace: true });

    // Reset input states
    console.log("Username: " + user.username + ", Room: " + room);
  };

  return (
    <div className={styles.container}>
      <div className={styles.profile_container}>
        <div className={styles.avatar}>
          <img src={`${SERVER_URL}${user.avatar}`} alt="avatar" />
        </div>
        <h3 className={styles.username}>{user.username}</h3>
        <p className={styles.email}>{user.email}</p>
      </div>
      <form onSubmit={handleSubmit} className={styles.form_container}>
        <h1>Join a Room</h1>
        <label htmlFor="room" className={styles.room}>
          Choose Room:
          <select
            name="room"
            id="room"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
          >
            <option value="" selected disabled hidden>
              Choose...
            </option>
            {roomData.map((room, i) => (
              <option value={room.value} key={"room" + i}>
                {room.name}
              </option>
            ))}
          </select>
        </label>
        <input type="submit" value="Join" className={styles.submit} />
      </form>
      <button className={styles.logout} onClick={handleLogout}>
        Log out
      </button>
    </div>
  );
};

export default Home;
