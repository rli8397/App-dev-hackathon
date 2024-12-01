import { useState } from 'react'
import SideBar from './Components/SideBar'
import Dashboard from './Pages/Dashboard'
import Homework from './Pages/Homework'
import Lecture from './Pages/Lecture'
import Attendance from './Pages/Attendance'
import './App.css'

export default function App() {
  let menuOptions = [
    {icon: <i className="fa-solid fa-house"></i>, text: "Dashboard"},
    {icon: <i className="fa-solid fa-folder-open"></i>, text: "Homework"},
    {icon: <i className="fa-solid fa-book"></i>, text: "Lecture"},
    {icon: <i className="fa-solid fa-list-check"></i>, text: "Attendance"}
  ]
  const [choice, setChoice] = useState<string>('Dashboard')

  const pages: {[key: string]: React.ReactNode} = {
    Dashboard: <Dashboard/>,
    Homework: <Homework/>,
    Lecture: <Lecture/>,
    Attendance: <Attendance/>
  };
  return (
    <div className='page'>
      <SideBar sideBarInfo={menuOptions} handleChoice={(e)=> setChoice(e)}></SideBar>
      <div className='page-content'>{pages[choice]}</div>

    </div>
  )
}
