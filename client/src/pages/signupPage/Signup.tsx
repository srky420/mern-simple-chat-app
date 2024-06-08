import { SyntheticEvent, useEffect, useState } from "react";
import styles from "./signup.module.css";
import axios from "axios";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import { useCookies } from "react-cookie";

interface Input {
  username: string,
  email: string,
  password: string,
  confirmation: string
}

interface Error {
  username: boolean,
  email: boolean,
  password: boolean,
  confirmation: boolean
}

const Signup = () => {

  const navigate = useNavigate();
  const [cookies, setCookie, removeCookie] = useCookies(['token']);

  // Input state
  const [input, setInput] = useState<Input>({
    username: '',
    email: '',
    password: '',
    confirmation: ''
  });
  // Error state
  const [errors, setErrors] = useState<Error>({
    username: false,
    email: false,
    password: false,
    confirmation: false
  });
  // Processing state
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Check if already logged in
  useEffect(() => {
    if (cookies.token) {
      return navigate('/');
    }
  }, []);

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    // Check valid input
    setErrors({
      username: input.username === '',
      email: input.email === '',
      password: input.password === '',
      confirmation: input.confirmation === ''
    });
    if (!input.username || !input.email || !input.password || !input.confirmation) {
      toast.error('All fields are required.', {
        position: 'bottom-right'
      });
      setIsProcessing(false);
      return;
    }
    if (input.password !== input.confirmation) {
      setErrors((state) => ({
        ...state,
        password: true,
        confirmation: true
      }));
      toast.error('Passwords do not match.', {
        position: 'bottom-right'
      });
      return;
    }

    setIsProcessing(true);
    try {
      // Request backend for sign up
      const { data } = await axios.post('http://localhost:3000/signup', input, {
        withCredentials: true
      });

      // If user signed up succesfully
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
      setTimeout(() => setIsProcessing(false), 1500);
    }
    catch (e) {
      console.error(e);
      setTimeout(() => setIsProcessing(false), 1500);
    }
  }

  const hanldeChange = (e: SyntheticEvent) => {
    const { name, value } = e.target as HTMLInputElement;
    setInput((state) => ({
      ...state,
      [name]: value
    }));
    setErrors((state) => ({
      ...state,
      [name]: false
    }));
  }

  return (
    <div className={styles.container}>
      {isProcessing ? 
      <div className="loading"></div>
      :
      <form onSubmit={handleSubmit} className={styles.form_container}>
        <h1>Sign up</h1>
        <label htmlFor="username">
          Enter Username:
          <input 
            className={errors.username ? "error" : ""}
            type="text" 
            name="username" 
            id="username" 
            placeholder="Username..." 
            value={input.username} 
            onChange={hanldeChange} 
          />
        </label>
        <label htmlFor="email">
          Enter Email Address:
          <input 
            className={errors.email ? "error" : ""}
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
            className={errors.password ? "error" : ""}
            type="password" 
            name="password" 
            id="password" 
            placeholder="Password..." 
            value={input.password} 
            onChange={hanldeChange} 
          />
        </label>
        <label htmlFor="confirmation">
          Enter Confirmation:
          <input 
            className={errors.confirmation ? "error" : ""}
            type="password" 
            name="confirmation" 
            id="confirmation" 
            placeholder="Confirm Password..." 
            value={input.confirmation} 
            onChange={hanldeChange} 
          />
        </label>
        <input type="submit" value="Sign up" className={styles.submit} />
        <p className={styles.link_text}>Already have an account? <Link to={'/login'}>Log in</Link></p>
      </form>
      }
    </div>
  )
}

export default Signup