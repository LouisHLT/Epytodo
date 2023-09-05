import React, { useEffect, useState } from 'react';
import './App.css';
import backgroundImage from './background.jpg';

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [todos, setTodos] = useState([]);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isLoginView, setIsLoginView] = useState(true);

  const handleFormSwitch = () => {
    setIsLoginView(!isLoginView);
    setError(null);
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    try {
      const endpoint = isLoginView ? 'login' : 'register';
      const response = await fetch(`http://localhost:3000/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (isLoginView) {
        if (data.token) {
          setToken(data.token);
          setIsLoggedIn(true);
        } else {
          throw new Error('Login failed');
        }
      } else {
        if (data.success) {
          setIsRegistered(true);
        } else {
          throw new Error('Registration failed');
        }
      }
    } catch (error) {
      setError(`Failed to ${isLoginView ? 'login' : 'register'}: ${error}`);
    }
  };

  useEffect(() => {
    if (!token) return;

    fetch('http://localhost:3000/todos', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => setTodos(data))
      .catch(error => setError(error.toString()));
  }, [token]);

  return (
    <div className="App">
      <div className="background">
        <h1 style={{ color: 'grey' }}>Todo List</h1>
        {error && <p style={{ color: 'grey' }}>Error: {error}</p>}
        {!isLoggedIn && !isRegistered && (
          <form onSubmit={handleFormSubmit}>
            <label>
              Email:
              <input
                type="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                style={{ color: 'grey' }}
              />
            </label>
            <label>
              Password:
              <input
                type="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                style={{ color: 'grey' }}
              />
            </label>
            <input
              type="submit"
              value={isLoginView ? 'Log In' : 'Register'}
              style={{ color: 'grey' }}
            />
            <p onClick={handleFormSwitch} style={{ color: 'grey' }}>
              {isLoginView ? "Don't have an account? Register here." : "Already have an account? Log in here."}
            </p>
          </form>
        )}
        {isRegistered && (
          <div>
            <h2 style={{ color: 'grey' }}>Registration Successful!</h2>
            <form onSubmit={handleFormSubmit}>
              <label>
                Email:
                <input
                  type="Email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  style={{ color: 'grey' }}
                />
              </label>
              <label>
                Password:
                <input
                  type="Password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  style={{ color: 'grey' }}
                />
              </label>
              <input type="submit" value="Log In" style={{ color: 'grey' }} />
              <p onClick={handleFormSwitch} style={{ color: 'grey' }}>
                {isLoginView ? "Already have an account? Log in here." : "Click here to log in."}
              </p>
            </form>
            <img src={backgroundImage} alt="Background" className="background-image" />
          </div>
        )}
        {isLoggedIn && (
          <React.Fragment>
            <button onClick={() => setIsLoggedIn(false)} style={{ color: 'grey' }}>Log Out</button>
            <ul>
              {todos.map(todo => (
                <li key={todo.id} style={{ color: 'grey' }}>{todo.title}</li>
              ))}
            </ul>
          </React.Fragment>
        )}
      </div>
    </div>
  );
}

export default App;