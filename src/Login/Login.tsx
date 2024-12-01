import React from 'react';
import './Login.css';
import { useState } from 'react';

type Props = {
  setToken:(e:any)=>void
}

async function loginUser(credentials: Record<string, string>) {
  return fetch('http://127.0.0.1:8000/find-student', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(credentials)
  })
    .then(data => data.json())
 }

export default function Login({ setToken }: Props) {
  const [email, setEmail] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [password,setPassword] = useState<string>('');
  const [clubRole, setClubRole] = useState<string> ('');
  const [loginMsg, setLoginMsg] = useState<string>('')
  const [passwordError, setPasswordError] = useState<string>('Passwords must match');
  const [pageState, setPageState] = useState<string> ('Create an account')
  const [id, setId] = useState<number> (1);
  const handleSubmit = async()=> {
  
  if ((pageState === 'Login' && (email === '' || name === '' || password === '' || clubRole === ''))
      || (pageState === 'Create an account') && (email === '' || password === '')) {
        setLoginMsg('One or more fields is empty')
    } else if(passwordError === '' || (pageState === 'Create an account' && (email !== '' && password !== ''))){
      // e.preventDefault();
      // const token = await loginUser({
      //   'email': email,
      //   'password': password
      // })
      let token = {
        'name': name,
        'id': 0,
        'email': email,
        'password': password
      }
      setId(id + 1)
      setToken(token)
    } else {
      setLoginMsg('')
    }
    
  } 

  return(
    <div className="page-content">
      <button className='page-state-btn button-style' onClick={()=>{
        if (pageState == 'Create an account') {
          setPageState('Login')
        } else {
          setPageState("Create an account")
        }
        setLoginMsg('')
      }}>{pageState}</button>
      { pageState == 'Create an account' ? (
          <div className='login-wrapper'>
            <div className='login-form'>
              <div className='login-header'>
                <h1>Login</h1>
                <p>{loginMsg}</p>
              </div>
              
              <div className="input-section">
                <label className='input-field'>
                  <input type="text" required onChange={(e)=> setEmail(e.target.value)}/>
                  <span className='placeholder'>Email *</span>
                </label>
              </div>
              
              <div className="input-section">
                <label className='input-field'>
                  <input type="password" required onChange={(e)=> setPassword(e.target.value)}/>
                  <span className='placeholder'>Password *</span>
                </label>
              </div>

              <button className='button-style' type="submit" onClick={handleSubmit}>Submit</button>
            </div>
          </div>
        ):(
          <div className="login-wrapper">
            <div className='login-form'>
              <div className='login-header'>
                <h1>Create an account</h1>
                <p>{loginMsg}</p>
              </div>
              
              <div className="input-section">
                <select required onChange={(e)=>{setClubRole(e.target.value)}}>
                  <option value="">Select Club Role</option>
                  <option value="SMember">Member</option>
                  <option value="Admin">Admin</option>
                  <option value="Mentor">Mentor</option>
                </select>
              </div>
              
              <div className="input-section">
                <label className='input-field'>
                  <input type="text" required onChange={(e)=> setEmail(e.target.value)}/>
                  <span className='placeholder'>Email *</span>
                </label>
              </div>
              
              <div className="input-section">
                <label className='input-field'>
                  <input type="text" required onChange={(e)=> setName(e.target.value)}/>
                  <span className='placeholder'>Name *</span>
                </label>
              </div>
              
              <div className="input-section">
                <label className='input-field'>
                  <input type="password" required onChange={(e)=> setPassword(e.target.value)}/>
                  <span className='placeholder'>Password *</span>
                </label>
              </div>
              
              <div className="input-section">
                <label className='input-field'>
                  <input type="password" required onChange={(e)=>{ 
                    let currPass = e.target.value;
                    if (currPass == password){
                      setPasswordError("")
                    } else {
                      setPasswordError('Passwords must match')
                    }
                  }}/>
                  <span className='placeholder'>Re-enter Password *</span>
                </label>
                {<p className='error-msg'>{passwordError}</p>}
              </div>
              
              <button className='button-style' type="submit" onClick={handleSubmit}>Submit</button>
            </div>
          </div>
        )

      }
      
    </div>
  )
}