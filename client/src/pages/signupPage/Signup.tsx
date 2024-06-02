import { SyntheticEvent, useState } from "react";
import styles from "./signup.module.css";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

interface Input {
  username: string,
  email: string,
  password: string,
  confirmation: string
}

const Signup = () => {

  const navigate = useNavigate();

  // Input state
  const [input, setInput] = useState<Input>({
    username: '',
    email: '',
    password: '',
    confirmation: ''
  });
  // Error state
  const [errors, setErrors] = useState<string[]>([]);

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    if (!input.username || !input.email || !input.password || !input.confirmation) {
      return;
    }

    try {
      // Request backend for sign up
      const { data } = await axios.post('http://localhost:4000/signup', input, {
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
        <h1>Sign up</h1>
        <label htmlFor="username">
          Enter Username:
          <input 
            className={errors.includes("username") ? "error" : ""}
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
            className={errors.includes("email") ? "error" : ""}
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
            className={errors.includes("password") ? "error" : ""}
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
            className={errors.includes("confirmation") ? "error" : ""}
            type="password" 
            name="confirmation" 
            id="confirmation" 
            placeholder="Confirm Password..." 
            value={input.confirmation} 
            onChange={hanldeChange} 
          />
        </label>
        <input type="submit" value="Sign up" className={styles.submit} />
      </form>
      <ToastContainer />
    </div>
  )
}

export default Signup