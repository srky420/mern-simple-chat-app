import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import { useState } from 'react'
import { io } from 'socket.io-client'

// Define socket
const socket:any = io.connect('http://localhost:3000')

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
            />
          } />
        </Routes>
      </div>
    </Router>
  )
}

export default App
