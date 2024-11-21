import { useState } from 'react'
import SideBar from './Components/SideBar'
import Dashboard from './Pages/Dashboard'
import Homework from './Pages/Homework'
import './App.css'

export default function App() {
  let menuOptions = [
    {icon: <i className="fa-solid fa-house"></i>, text: "Dashboard"},
    {icon: <i className="fa-solid fa-folder-open"></i>, text:"Homework"}
  ]
  const [choice, setChoice] = useState<string>('Dashboard')

  const pages: {[key: string]: React.ReactNode} = {
    Dashboard: <Dashboard/>,
    Homework: <Homework/>
  };
  return (
    <div className='page'>
      <SideBar sideBarInfo={menuOptions} handleChoice={(e)=> setChoice(e)}></SideBar>
      <div className='page-content'>{pages[choice]}</div>

    </div>
  )
}


