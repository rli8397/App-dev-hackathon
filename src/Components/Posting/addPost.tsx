import { useState } from 'react'
import './Posts.css'
import Popup from './Popup'
async function addPost(postType: string, title: string, description: string, name:string ) {
    let date = new Date()
    fetch("http://127.0.0.1:8000/add-post", {
        method: "POST",
        body: JSON.stringify({
            postType: postType,
            title: title,
            description: description,
            sender: name,
            date: `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`
        }),
        headers: {
            'Content-type': 'application/json',
        }
    })
    
}

type Props = {
    postType: string
    token: Record<string, string> 
    rerenderTracker: number
    handleRerender: (e: number)=>void
}
export default function AddPost({ postType, token, rerenderTracker, handleRerender }: Props) {
    const [showAdd, setShowAdd] = useState<boolean>(false);

    return (
        <div className="homework-submit">
            {/* This is the button that first appears that allows you to open up the add homework popup */}
            <button
                className="homework-input button-style"
                onClick={() => {
                    setShowAdd(true);
                    document.querySelector('.page-content')?.classList.add('fade');
                }}
            >
                Add {postType}
            </button>
            {showAdd && (
                <Popup title={`Add ${postType}`} setShowAdd={setShowAdd} handleSubmit={(title, description)=> {
                    addPost(postType, title, description, token.name);
                    setShowAdd(false);
                    handleRerender(rerenderTracker + 1);
                }}/>
            )}
        </div>
    );
}
