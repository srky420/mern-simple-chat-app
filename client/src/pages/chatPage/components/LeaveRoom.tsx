import { useNavigate } from "react-router-dom";
import styles from "./leaveroom.module.css";

const LeaveRoom = ({ username, room, socket }:any) => {

  const navigate = useNavigate();

  const handleClick = () => {
    localStorage.removeItem('chat_room_data');
    socket.emit('leave_room', { username, room });
    navigate('/', { replace: true });
  }

  return (
    <div className={styles.leaveroom_container}>
      <button onClick={handleClick}>Leave Room</button>
    </div>
  )
}

export default LeaveRoom