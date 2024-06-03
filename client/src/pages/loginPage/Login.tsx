import { SyntheticEvent, useEffect, useState } from "react";
import styles from "./login.module.css";
import axios from "axios";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import { useCookies } from "react-cookie";

interface Input {
  email: string,
  password: string,
}

interface Error {
  email: boolean,
  password: boolean,
}

const Login = () => {

  const [cookies] = useCookies();
  const navigate = useNavigate();

  // Input state
  const [input, setInput] = useState<Input>({
    email: '',
    password: ''
  });
  // Error state
  const [errors, setErrors] = useState<Error>({
    email: false,
    password: false
  });

  // Check if already logged in
  useEffect(() => {
    if (cookies.token) {
      return navigate('/', { replace: true });
    }
  }, []);

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    // Check valid input
    setErrors({
      email: input.email === '',
      password: input.password === ''
    });
    if (!input.email || !input.password) {
      toast.error('All fields are required.', {
        position: 'bottom-right'
      });
      return;
    }

    try {
      // Request backend for login
      const { data } = await axios.post('http://localhost:3000/login', input, {
        withCredentials: true
      });
      if (data.success) {
        toast.success(data.message, {
          position: 'bottom-right'
        });
        navigate('/', { replace: true });
      }
      else {
        toast.error(data.message, {
          position: 'bottom-right'
        });
      }
    }
    catch (e) {
      console.error(e);
    }
  }

  const hanldeChange = (e: SyntheticEvent) => {
    const { name, value } = e.target as HTMLInputElement;
    setInput((state) => ({
      ...state,
      [name]: value
    }));
  }

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form_container}>
        <h1>Log In</h1>
        <label htmlFor="email">
          Enter Email Address:
          <input 
            className={!errors.email ? "" : "error"}
            type="email" 
            name="email" 
            id="email" 
            placeholder="Email Address..." 
            value={input.email} 
            onChange={hanldeChange} 
          />
        </label>
        <label htmlFor="password">
          Enter Password:
          <input 
            className={!errors.password ? "" : "error"}
            type="password" 
            name="password" 
            id="password" 
            placeholder="Password..." 
            value={input.password} 
            onChange={hanldeChange} 
          />
        </label>
        <input type="submit" value="Log in" className={styles.submit} />
        <p className={styles.link_text}>Don't have an account? <Link to={'/signup'}>Sign up</Link></p>
      </form>
    </div>
  )
}

export default Login