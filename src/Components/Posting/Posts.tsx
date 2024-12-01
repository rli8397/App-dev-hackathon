import { useState, useEffect } from 'react';
import './Posts.css';
import Popup from './PopUp'
import './Posts.css'

async function getRequest(thisPostType: String) {
    const response = await fetch(`http://127.0.0.1:8000/posts?postType=${thisPostType}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    return await response.json();
}

async function deleteRequest (thisPostType: String, thisId: number) {
    const response = await fetch('http://127.0.0.1:8000/remove-post', {
        method: 'DELETE',
        body: JSON.stringify({
            postType: thisPostType,
            id: thisId
        }),
        headers: {
            'Content-Type': 'application/json',
        },
    });

    return await response.json();
}

async function patchRequest (thisId: number, thisTitle:string, thisDescription: string) {
    const response = await fetch('http://127.0.0.1:8000/edit-post', {
        method: "PATCH",
        body: JSON.stringify({
            postId: thisId,
            title: thisTitle,
            description: thisDescription
        }),
        headers: {
            'Content-Type': 'application/json'
        },
    });
    
    return await response.json()
}

async function homeworkSubmission (thisId: number) {
    const response = await fetch('')
}

function FormatPost({ data, rerender }: { data: any; rerender: () => void }) {
    const [showAdd, setShowAdd] = useState<boolean>(false);

    const handlePostClick = (newTitle: string, newDescription: string) => {
        patchRequest(data.id, newTitle, newDescription);
        setShowAdd(false);
        rerender();
    };

    return (
        <div className="posts-div">
            <div className="post-content" onClick={() => {setShowAdd(true);}}>
                <div className='post-row'>

                    <h2>{data.title}</h2>
                    <button
                    className="delete-btn button-style"
                    onClick={(e) => {
                        e.stopPropagation(); // Prevent interfering with parent click
                        deleteRequest(data.postType, data.id);
                        rerender();
                    }}>
                    <i className="fa-solid fa-trash-can"></i>
                    </button>

                </div>

                <p className="post-description">{data.description}</p>
                
                <div className="post-row">
                    <p>Posted by {data.sender}</p>
                    <p>{data.date}</p>
                </div>
            </div>

            {/* Popup for editing */}
            {showAdd && (
                <div className='edit-popup'><Popup
                    title="Edit Post"
                    setShowAdd={setShowAdd} // Close the popup by updating state
                    handleSubmit={(title, description) => {
                        handlePostClick(title, description);
                    }}
                /></div>
            )}

            {/* Delete button with click prevention */}
            
        </div>
    );
}


export default function Posts({ postType, rerender }: {postType: String; rerender: number;}) {
    const [data, setData] = useState<any>(null); 
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [deleteRender, setDeleteRender] = useState<number>(0);

    useEffect(() => {
        getRequest(postType)
            .then((fetchedData) => {
                setData(fetchedData.reverse());
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, [postType, rerender, deleteRender]);
    
    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <>
            {data.length > 0 ? 
                <div>
                <h1>Lastest {postType}</h1>
                <FormatPost data={data[0]} rerender={()=>setDeleteRender(deleteRender + 1)}/>
                
                <h1>Previous {postType}s</h1>
                {data.slice(1).map((e:any)=> 
                    <FormatPost data={e} rerender={()=>setDeleteRender(deleteRender + 1)}/>
                )}
                
                </div>
            :
                <div className='posts-div'>
                    <h1>No {postType} yet, try adding a {postType}!</h1>
                </div>
            }   
        </>
        
        
    );
}
