import { useState } from 'react'
import SideBar from './Components/SideBar/SideBar'
import Dashboard from './Pages/Dashboard'
import Homework from './Pages/Homework/Homework'
import Lecture from './Pages/Lecture/Lecture'
import './App.css'
import Login from './Login/Login'
import Announcements from './Pages/Announcements/Announcements'
import Toggle from './Components/Toggle/Toggle'

export default function App() {
  const [view, setView] = useState<string>('Teacher');
  let menuOptions = [
    {icon: <i className="fa-solid fa-house"></i>, text: "Dashboard"},
    {icon: <i className="fa-solid fa-folder-open"></i>, text:"Homework"},
    {icon: <i className="fa-solid fa-book"></i>, text: "Lecture"},
    {icon: <i className="fa-solid fa-bullhorn"></i>, text: "Announcements"}
  ]
  const [choice, setChoice] = useState<string>('Dashboard')
  const [token, setToken] = useState();
  if (!token) {
    return <div className="page-content"><Login setToken={(e:any)=>setToken(e)}/></div>
  }
  const pages: {[key: string]: React.ReactNode} = {
    Dashboard: <Dashboard/>,
    Homework: <Homework view={view} token={token}/>,
    Lecture: <Lecture/>,
    Announcements: <Announcements view={view} token={token}/>
  };
  return (
    <div className='page'>
      <SideBar sideBarInfo={menuOptions} handleChoice={(e)=> setChoice(e)}></SideBar>
      <div className='page-content'>{pages[choice]}</div>
      <div className='view-toggle'><Toggle setView={(e)=>setView(e)}/></div>
    </div>
  )
}
