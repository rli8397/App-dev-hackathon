import { useState, useEffect } from 'react';
import './Posts.css';
import Popup from './Popup'
import './Posts.css'
import HomeworkSubmissonForm from '../../Pages/Homework/HomeworkSubmissionForm';
import SubmissionViewer from '../../Pages/Homework/SubmissionViewer';

async function getRequest(thisPostType: string, title: string = '') {
    const params = new URLSearchParams();
    params.append('postType', thisPostType);
    if (title) params.append('title', title);

    const response = await fetch(`http://127.0.0.1:8000/posts?${params.toString()}`, {
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

async function submitHomework (hwId:number, studentId: number, studentName: string, submission: string) {
    const response = await fetch('http://127.0.0.1:8000/add-homeworkSubmission', {
        method: "POST",
        body: JSON.stringify({
            hwId: hwId,
            studentId: studentId,
            name: studentName,
            submission: submission
          }),
        headers: {
            'Content-Type': 'application/json'
        }
    })

    return await response.json()
}

function FormatPost({ data, rerender, view, token }: { data: any; rerender: () => void; view:string; token:any; }) {
    const [showAdd, setShowAdd] = useState<boolean>(false);
    const [showSubmissions, setShowSubmissions] = useState<boolean>(false);

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
            
            {/* Button to see submissions */}
            {view === 'Admin' && data.postType === 'homework' && (
                        <button 
                            id='see-submissions'
                            className='button-style'
                            onClick={()=>{setShowSubmissions(true)}}
                        >Show Submissions</button>)}

            {showSubmissions && (
                <SubmissionViewer setShowSubmissions={setShowSubmissions} hwId={data.id}/>
            )}
            {/* Popup for editing */}
            {(showAdd && view === 'Admin') && (
                <div>
                    <Popup
                        title="Edit Post"
                        setShowAdd={setShowAdd} // Close the popup by updating state
                        handleSubmit={(title, description) => {
                            handlePostClick(title, description);
                    }}
                    />
                </div>
            )}
            {(showAdd && view == 'Member' && data.postType === 'homework') && (
                <div>
                    <HomeworkSubmissonForm 
                        title="Submit Homework" 
                        setShowAdd={setShowAdd} 
                        handleSubmit={(submission)=> {submitHomework(data.id, token.UID, token.name, submission)}}
                    />
                </div>
            )}
            {/* Delete button with click prevention */}
            
        </div>
    );
}


export default function Posts({ postType, rerender, view, token }: {postType: string; rerender: number; view: string; token:any;}) {
    const [data, setData] = useState<any>(null); 
    const [loading, setLoading] = useState<boolean>(true);
    const [deleteRender, setDeleteRender] = useState<number>(0);

    async function fetchPosts(postType: string, title: string = '') {
        setLoading(true); // Start loading
        const fetchedData = await getRequest(postType, title);
        setData(fetchedData.reverse()); // Reverse if necessary
        setLoading(false); // Stop loading
    }
    
    useEffect(() => {
        fetchPosts(postType);
    }, [postType, rerender, deleteRender]);
    
    return (
        <>
            <div className="search-posts-div">
                <input type="text" id="search-bar" placeholder="Search by title" />
                <button
                    onClick={() => {
                        const titleElement = document.querySelector('#search-bar') as HTMLInputElement;
                        fetchPosts(postType, titleElement?.value ?? '');
                    }}
                >
                    Search
                </button>
            </div>
            {loading ? (
                <div>Loading...</div>
            ) : data.length > 0 ? (
                <div>
                    <h1>Latest {postType}</h1>
                    <FormatPost
                        data={data[0]}
                        rerender={() => setDeleteRender(deleteRender + 1)}
                        view={view}
                        token={token}
                    />
                    <h1>Previous {postType}s</h1>
                    {data.slice(1).map((e: any) => (
                        <FormatPost
                            key={e.id}
                            data={e}
                            rerender={() => setDeleteRender(deleteRender + 1)}
                            view={view}
                            token={token}
                        />
                    ))}
                </div>
            ) : (
                <div className="posts-div">
                    <h1>No {postType} found. Try adding a {postType}!</h1>
                </div>
            )}
        </>
    );
    
}
