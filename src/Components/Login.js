import React, { useState } from 'react';
import { attemptLogin } from '../store';
import { useDispatch } from 'react-redux';

const Login = ()=> {
  const dispatch = useDispatch();
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });

  const [error, setError] = useState('');

  const onChange = ev => {
    setCredentials({...credentials, [ ev.target.name ]: ev.target.value });
  };

  const login = async (ev)=> {
    ev.preventDefault();
    const response = await dispatch(attemptLogin(credentials));
    if(response.error){
      setError(response.payload.message);
    }
  };
  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={ login }>
        <input
          placeholder='username'
          value = { credentials.username }
          name = 'username'
          onChange = { onChange }
          />
        <input
          placeholder='password'
          name = 'password'
          value={ credentials.password }
          onChange = { onChange }
        />
        { !!error && <div style={{ color: 'red'}}>{ error}</div> }
        <button>Login</button>
      </form>
      <a href={`https://github.com/login/oauth/authorize?client_id=${window.CLIENT_ID}`}>Login Via Github</a>
    </div>
  );
};

export default Login;
