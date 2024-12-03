import { useState } from 'react'
import SideBar from './Components/SideBar/SideBar'
import Dashboard from './Pages/Dashboard'
import Homework from './Pages/Homework/Homework'
import Lecture from './Pages/Lecture/Lecture'
import './App.css'
import Login from './Login/Login'
import Announcements from './Pages/Announcements/Announcements'
import Toggle from './Components/Toggle/Toggle'
import Attendance from './Pages/Attendance/Attendance'
export default function App() {
  const [choice, setChoice] = useState<string>('Dashboard')
  const [token, setToken] = useState();
  const [view, setView] = useState<string>('');
  const [userAccess, setUserAccess] = useState<string>('')
  let menuOptions = [
    {icon: <i className="fa-solid fa-house"></i>, text: "Dashboard"},
    {icon: <i className="fa-solid fa-folder-open"></i>, text:"Homework"},
    {icon: <i className="fa-solid fa-book"></i>, text: "Lecture"},
    {icon: <i className="fa-solid fa-bullhorn"></i>, text: "Announcements"},
    {icon: <i className="fa-solid fa-list-check"></i>, text: "Attendance"}
  ]
  
  if (!token) {
    return <div className="page-content"><Login setToken={(e:any)=>setToken(e)} setView={(e:string)=>setUserAccess(e)}/></div>
  }
  const pages: {[key: string]: React.ReactNode} = {
    Dashboard: <Dashboard token={token}/>,
    Homework: <Homework view={view} token={token}/>,
    Lecture: <Lecture/>,
    Announcements: <Announcements view={view} token={token}/>,
    Attendance: <Attendance view={view}/>
  };
  return (
    <div className='page'>
      <SideBar sideBarInfo={menuOptions} handleChoice={(e)=> setChoice(e)}></SideBar>
      <div className='page-content'>{pages[choice]}</div>
      {userAccess == 'Admin' && <div className='view-toggle'><Toggle setView={(e)=>setView(e)}/></div>}
    </div>
  )
}
