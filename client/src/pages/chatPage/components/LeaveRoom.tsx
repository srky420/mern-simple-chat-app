import { useNavigate } from "react-router-dom";
import styles from "./leaveroom.module.css";

interface Props {
  user: any,
  room: string,
  socket: any,
}

const LeaveRoom = ({ user, room, socket }: Props) => {

  const navigate = useNavigate();

  const handleClick = () => {
    localStorage.removeItem('chat_room_data');
    socket.emit('leave_room', { user, room });
    navigate('/', { replace: true });
  }

  return (
    <div className={styles.leaveroom_container}>
      <button onClick={handleClick}>Leave Room</button>
    </div>
  )
}

export default LeaveRoom