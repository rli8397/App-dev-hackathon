import './Posts.css'

type Props = {
    title: string
    setShowAdd: (b:boolean)=> void
    handleSubmit: (title: string, description: string)=> void
}
export default function Popup({ title, setShowAdd, handleSubmit }: Props) {

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

                            </div>

                            {/* These are input fields */}
                            <input type="text" placeholder="Enter title" className="homework-input title" />
                            <textarea placeholder="Enter description" className="homework-input description"></textarea>

                            {/* Submit button */}
                            <button
                                className="homework-input button-style"
                                onClick={() => {
                                    document.querySelector('.page-content')?.classList.remove('fade');

                                    const titleElement = document.querySelector('.homework-input.title') as HTMLInputElement;
                                    let title = titleElement?.value ?? '';
                                    const descriptionElement = document.querySelector('.homework-input.description') as HTMLInputElement;
                                    let description = descriptionElement?.value ?? '';

                                    if (title === "") {
                                        title = 'No Title'
                                    }
                                    if (description === "") {
                                        description = "No description"
                                    }
                                    handleSubmit(title, description)
                                    setShowAdd(false)
                                }}
                            > {title} </button>
                            
                        </div>
                    </div>
    )
}