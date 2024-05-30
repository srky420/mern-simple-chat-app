import { SyntheticEvent, useRef } from "react";
import styles from "./home.module.css";
import { useNavigate } from "react-router-dom";

interface Props {
  username: string;
  room: string;
  setUsername: any;
  setRoom: any;
  socket: any;
}

const Home = ({ username, room, setUsername, setRoom, socket }:Props) => {
  // Navigation hook
  const navigate = useNavigate();

  // Reference to input fields
  const usernameField = useRef<any>(null);
  const roomField = useRef<any>(null);

  const handleSubmit = (e:SyntheticEvent) => {
    e.preventDefault();

    // Check username and password not empty
    if (username === '' || room === '') {
      !username ? 
        usernameField.current.classList.add('error') : 
        usernameField.current.classList.remove('error');
      !room ? 
        roomField.current.classList.add('error') :
        roomField.current.classList.remove('error');
      return;
    }

    // Emit socket event join_room, and redirect
    socket.emit('join_room', { username, room });
    navigate('/chat', { replace: true });

    // Reset input states
    console.log('Username: ' + username + ', Room: ' + room);
    usernameField.current.classList.remove('error');
    roomField.current.classList.remove('error');
    setUsername('');
    setRoom('');
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form_container}>
        <h1 className="heading">Join a Room</h1>
        <label htmlFor="username">
          Enter Username:
          <input 
            className={styles.username}
            type="text" 
            name="username" 
            id="username" 
            placeholder="Username..." 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            ref={usernameField} />
        </label>
        <label htmlFor="room">
          Choose Room:
          <select 
            className={styles.room}
            name="room" id="room" 
            value={room} 
            onChange={(e) => setRoom(e.target.value)} 
            ref={roomField}>
            <option value="" selected disabled hidden>Choose...</option>
            <option value="frontend">Frontend</option>
            <option value="backend">Backend</option>
          </select>
        </label>
        <input type="submit" value="Join" className={styles.submit} />
      </form>
    </div>
  );
};

export default Home;
