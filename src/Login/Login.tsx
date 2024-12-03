import './Login.css';
import { useState } from 'react';

type Props = {
  setToken:(e:any)=>void
  setView: (e:string)=> void
}



export default function Login({ setToken, setView }: Props) {
  const [email, setEmail] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [UID, setUID] = useState<string>('');
  const [password,setPassword] = useState<string>('');
  const [clubRole, setClubRole] = useState<string> ('');
  const [loginMsg, setLoginMsg] = useState<string>('')
  const [passwordError, setPasswordError] = useState<string>('Passwords must match');
  const [buttonState, setbuttonState] = useState<string> ('Create an account')

  const handleSubmit= async()=> {
    if ((buttonState === 'Login' && (email === '' || name === '' || password === '' || clubRole === ''))
        || (buttonState === 'Create an account') && (email === '' || password === '')) {
          setLoginMsg('One or more fields is empty')
      } else if(buttonState === 'Create an account' && (email !== '' && password !== '')){
        const response = await fetch(`http://127.0.0.1:8000/get-student/${email}?password=${password}`,{
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        })
        let token = await response.json()
        if(token.length == 0) {
          setLoginMsg('Either the email or password is incorrect')
        } else {
          setView(token[0].clubRole)
          setToken({
            'name': token[0].name,
            'email': token[0].email,
            'UID': token[0].UID,
            'clubRole': token[0].clubRole
          })
        }

      } else if(buttonState === 'Login' && passwordError === '') {
        const response = await fetch('http://127.0.0.1:8000/add-student', {
          method: 'POST',
          headers: {
            'Content-Type' : 'application/json'
          },
          body: JSON.stringify({
            'name': name,
            'email': email,
            'UID': UID,
            'password': password,
            'clubRole': clubRole
          })
        })

        await response.json()
        setView(clubRole)
        setToken({
            'name': name,
            'email': email,
            'UID': UID,
            'clubRole': clubRole
        })

      } else {
        setLoginMsg('')
      }
  } 
  
  return(
    <div className="page-content">
      <button className='page-state-btn button-style' onClick={()=>{
        if (buttonState == 'Create an account') {
          setbuttonState('Login')
        } else {
          setbuttonState("Create an account")
        }
        setLoginMsg('')
      }}>{buttonState}</button>
      { buttonState == 'Create an account' ? (
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
                  <option value="Member">Member</option>
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
                  <input type="text" required onChange={(e)=> setUID(e.target.value)}/>
                  <span className='placeholder'>UID *</span>
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