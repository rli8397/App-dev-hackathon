import Posts from '../../Components/Posting/Posts'
import { useState } from 'react'
import AddPost from '../../Components/Posting/addPost'
import './Homework.css'
import '../../Components/Posting/Popup'
type Props = {
    token: Record<string, string>
    view: string
}


export default function Homework({ token, view }: Props){
    const [rerenderTracker, handleRerender] = useState<number> (0)

    return (
        <div className='homework-div'>
            
            {/* this div contains the rest of the content display on the homework screen */}
            <div className="homework-content">
                <div>
                    {/* 
                      * The following statement will control the condition of whether
                      * it's student or teacher view
                      */}
                    {view == 'Teacher' ? 
                        <AddPost postType="homework" token={token} rerenderTracker={rerenderTracker} handleRerender={handleRerender}/>
                    : 
                        <div></div>
                    }
                </div>
                <Posts postType='homework' rerender={rerenderTracker} view={view} token={token}/>
            </div>
        </div>
    )

}