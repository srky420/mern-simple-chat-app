import { SyntheticEvent, useState } from "react";
import styles from "./login.module.css";

const Login = () => {

  // Input state
  const [input, setInput] = useState({
    email: '',
    password: ''
  });
  // Error state
  const [errors, setErrors] = useState<string[]>([]);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
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
        <input type="submit" value="Log in" className={styles.submit} />
      </form>
    </div>
  )
}

export default Login