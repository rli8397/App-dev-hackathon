import { useState } from 'react'
import '../../Components/Posting/Posts.css'

export default function HomeworkSubmissonForm({ setShowAdd, title, handleSubmit } : 
{ 
    setShowAdd:(e:boolean)=> void 
    title: string
    handleSubmit: (submission:string)=> void
}){

    const [addMsg, setAddMsg] = useState<string>('')
    return (
        <div className="blur-background">
            {/* The purpose of this outer container is to blur the background */}
            <div className="add-hw-div">
                <div className="close-div">
                    {/* This is the X button that closes the window */}
                    <button
                        className="close-btn button-style"
                        onClick={() => {
                            setShowAdd(false);
                            document.querySelector('.page-content:not(.add-hw-div)')?.classList.remove('fade');
                        }}
                    >
                        &times;
                    </button>

                    <h2>{title}</h2>

                    {/* An error message will appear if one of the fields is empty */}
                    <p id="add-error-msg">{addMsg}</p>
                </div>

                {/* These are input fields */}
                <textarea placeholder="Enter Homework" id='homework-submit' className="homework-input description"></textarea>

                {/* Submit button */}
                <button
                    className="homework-input button-style"
                    onClick={() => {
                        document.querySelector('.page-content')?.classList.remove('fade');

                        const hwElement = document.querySelector('#homework-submit') as HTMLInputElement;
                        let hw = hwElement?.value ?? '';

                        if (hw === "") {
                            setAddMsg('No content entered')
                        } else {
                            handleSubmit(hw)
                            setShowAdd(false)
                        }
                        console.log(hw)

                    }}
                > {title} </button>
                
            </div>
        </div>
    )
}