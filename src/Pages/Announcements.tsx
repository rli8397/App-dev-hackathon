export default function Announcements(){

    

    return (
        <div className='announcement-div'>
            <h1>ANNOUNCEMENTS</h1>
            <p>Here is where we will have announcements</p>
            <button onClick={handleNewAnnouncementClick}>
                New Announcement
            </button>
        </div>
    )
}