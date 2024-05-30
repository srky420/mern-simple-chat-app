import { useState } from 'react';
import styles from './chat.module.css';

const Chat = () => {

  const [input, setInput] = useState('');

  return (
    <div className={styles.container}>
      <div className={styles.userslist}>

      </div>
      <div className={styles.chatbox}>
        <div className={styles.msgs_container}>

        </div>
        <form className={styles.chat_form}>
          <input 
            type="text" 
            className={styles.chat_input} 
            value={input} 
            onChange={(e) => setInput(e.target.value)} 
            placeholder="Type message..."
          />
          <input type="submit" value="Send" />
        </form>

      </div>
      <input type="checkbox" onChange={() => console.log('changed')} id={styles.sidebar_toggle} />
      <div className={styles.overlay}></div>
      <label className={styles.sidebaropen} htmlFor={styles.sidebar_toggle}>
        <i className="fa-solid fa-circle-chevron-right"></i>
      </label>
      <aside className={styles.sidebar}>

      </aside>
    </div>
  );
};

export default Chat