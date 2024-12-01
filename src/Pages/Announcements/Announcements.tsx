import Posts from '../../Components/Posting/Posts'
import { useState } from 'react'
import AddPost from '../../Components/Posting/addPost'
import './Announcements.css'

type Props = {
    token: Record<string, string>
    view: string
}
export default function Announcements({ token, view }: Props){
    const [rerenderTracker, handleRerender] = useState<number> (0)

    return (
        <div className='announcements-div'>
            
            {/* this div contains the rest of the content display on the announcements screen */}
            <div className="announcements-content">
                <div>
                    {/* 
                      * The following statement will control the condition of whether
                      * it's student or teacher view
                      */}
                    {view == 'Teacher' ? 
                        <AddPost postType="Announcements" token={token} rerenderTracker={rerenderTracker} handleRerender={handleRerender}/>
                    : 
                                
                        <div></div>
                    }
                </div>
                <Posts postType='Announcements' rerender={rerenderTracker}/>
            </div>
        </div>
    )

}