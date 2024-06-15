import { SyntheticEvent, useEffect, useRef } from "react";
import styles from "./home.module.css";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import { toast } from "react-toastify";

interface Props {
  user: any;
  room: string;
  setUser: (obj: object) => void;
  setRoom: (val: string) => void;
  socket: any;
}

const Home = ({ user, room, setUser, setRoom, socket }: Props) => {
  
  // React coookies hook
  const [cookies, setCookie, removeCookie] = useCookies(['token']);
  
  // Navigation hook
  const navigate = useNavigate();

  // Ensure user logged in or not
  useEffect(() => {
    async function verifyUser() {
      if (!cookies.token) {
        localStorage.removeItem('chat_room_data');
        navigate('/login');
      }
      
      // Request backend for index data
      const { data } = await axios.post('http://localhost:3000/', {}, {
        withCredentials: true
      });

      const { status, user } = data;
      if (status) {
        toast.success(`Welcome!, ${user.username}`, {
          position: 'bottom-right'
        });
        setUser(user);
        console.log(user);
      }
      else {
        return (removeCookie('token'), navigate('/login', { replace: true }));
      }
    }
    verifyUser();

  }, [cookies, removeCookie]);

  const handleLogout = () => {
    removeCookie('token');
    navigate('/', { replace: true });
    toast.success('You have logged out.', {
      position: 'bottom-right'
    });
  }

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    // Check username and room not empty
    if (room === '') {
      return;
    }

    // Emit socket event join_room, and redirect
    socket.emit('join_room', { user, room });
    localStorage.setItem('chat_room_data', JSON.stringify({ user, room }));
    navigate('/chat', { replace: true });

    // Reset input states
    console.log('Username: ' + user.username + ', Room: ' + room);
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form_container}>
        <h1>Join a Room</h1>
        <label htmlFor="username">
          Username:
          <input 
            className={styles.username}
            type="text" 
            name="username" 
            id="username" 
            placeholder="Username..." 
            value={user.username} 
            disabled 
            readOnly
          />
        </label>
        <label htmlFor="room">
          Choose Room:
          <select 
            className={styles.room}
            name="room" id="room" 
            value={room} 
            onChange={(e) => setRoom(e.target.value)}>
            <option value="" selected disabled hidden>Choose...</option>
            <option value="frontend">Frontend</option>
            <option value="backend">Backend</option>
          </select>
        </label>
        <input type="submit" value="Join" className={styles.submit} />
      </form>
      <button className={styles.logout} onClick={handleLogout}>Log out</button>
    </div>
  );
};

export default Home;
