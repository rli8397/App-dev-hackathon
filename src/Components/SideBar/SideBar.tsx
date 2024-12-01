/*
    This will receive a list of objects containing an icon and a string
    each element will represent a different choice
*/

import './SideBar.css'

type Props = { 
    sideBarInfo: {icon:JSX.Element, text: string} [],
    handleChoice: (e: string)=> void
}
export default function SideBar({sideBarInfo, handleChoice}: Props) {
    return (
        <div className='side-bar'>
                <div className='side-bar-content'>
                    {sideBarInfo.map((e)=> (
                        <div className="side-bar-element" onClick={()=> {
                            handleChoice(e.text)
                        }}>
                            <p className='side-bar-icon'>{e.icon}</p>
                            <p className='side-bar-text'>{e.text}</p>
                        </div>
                    ))}
                </div>
        </div>
    )
}