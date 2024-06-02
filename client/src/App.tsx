import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import Home from './pages/homePage/Home'
import { useState } from 'react'
import { io } from 'socket.io-client'
import Chat from './pages/chatPage/Chat'
import Login from './pages/loginPage/Login'
import Signup from './pages/signupPage/Signup'

// Define socket
const socket = io('http://localhost:3000');

function App() {
  const [username, setUsername] = useState<string>('');
  const [room, setRoom] = useState<string>('');

  return (
    <Router>
      <div>
        <Routes>
          <Route path='/' element={
            <Home 
              username={username} 
              room={room} 
              setUsername={setUsername} 
              setRoom={setRoom} 
              socket={socket}
            />} 
          />
          <Route path='/chat' element={
            <Chat 
              socket={socket} 
              username={username} 
              room={room} 
              setUsername={setUsername} 
              setRoom={setRoom} 
            />} 
          />
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<Signup />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
