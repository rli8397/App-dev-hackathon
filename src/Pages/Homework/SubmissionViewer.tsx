import { useState, useEffect } from 'react'
import '../../Components/Posting/Posts.css'

export default function SubmissionViewer({ setShowSubmissions, hwId } : {setShowSubmissions: (e:boolean)=> void, hwId: number}){
    
    const getSubmissions = async ()=> {
        const response = await fetch(`http://127.0.0.1:8000/homeworkSubmissions?hwId=${hwId}`, {
            method: "GET",
            headers: { 
                "Content-Type": "application/json"
            }
        })
        return await response.json()
    }
    
    const [data, setData] = useState([])
    const [loading, setLoading] = useState<boolean>(true)

    useEffect(() => {
        getSubmissions()
            .then((fetchedData) => {
                setData(fetchedData);
                setLoading(false);
            })
            .catch((err) => {
                setLoading(false);
            });
    }, [hwId]);
    
    if (loading) return <div>Loading...</div>;

    return (
        <div className="blur-background">
            {/* The purpose of this outer container is to blur the background */}
            <div className="add-hw-div">
                <div className="close-div">
                    {/* This is the X button that closes the window */}
                    <button
                        className="close-btn button-style"
                        onClick={() => {
                            setShowSubmissions(false);
                            document.querySelector('.page-content:not(.add-hw-div)')?.classList.remove('fade');
                        }}
                    >
                        &times;
                    </button>

                    <h2>Homework Submissions</h2>
                    {data.length > 0 ? (
                        <div className='submissions-container'>
                            {data.map((e:any, index: number)=>(
                                <div key={`${e.studentId}-${e.submission}-${index}`}>
                                    <div className="submission-div">
                                        <p> Student: {e.name} </p>
                                        <button onClick={()=>{
                                            document.querySelector( `#${CSS.escape(e.studentId)}-${CSS.escape(e.submission)}-${index}`)?.classList.toggle('show-submission')
                                        }}> Show Submission ⮟</button>
                                    </div>
                                    <p id={`${e.studentId}-${e.submission}-${index}`} className='submission-text'>{e.submissions}</p>
                                </div>
                            ))}
                        </div>
                    ) 
                    : 
                    (
                        <div>
                            No Submissions yet
                        </div>
                    )}
                </div>
                
            </div>
        </div>
    )
}