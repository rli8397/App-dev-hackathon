import { useEffect, useState } from 'react';

export default function Attendance() {
    // **IMPORTANT: PASSWORD FOR ACCESS TO ATTENDANCE**
    const teacherPassword = 'kimberGoated'; // REPLACE WITH DESIRED PASSWORD
    // **IMPORTANT: PASSWORD FOR ACCESS TO ATTENDANCE**

    const [showPopup, setShowPopup] = useState(false);
    // initialize form
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        graduationYear: '',
        terpmail: ''
    });

    // initialize student table. store the student table if leaving attendance page for future
    const [students, setStudents] = useState<any[]>(() => {
        const savedStudents = localStorage.getItem('students');
        return savedStudents ? JSON.parse(savedStudents) : [];
    });

    // initialize attendance pop up
    const [attendancePopup, setAttendancePopup] = useState<{
        isVisible: boolean;
        studentIndex: number | null;
    }>({ isVisible: false, studentIndex: null });

    const [removePopup, setRemovePopup] = useState<{
        isVisible: boolean;
        studentIndex: number | null;
    }>({ isVisible: false, studentIndex: null });

    const [password, setPassword] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // lecture dates (can be changed later for future semesters)
    const lectureDates = [
        { lecture: "Lecture 1: 9/24", attended: false },
        { lecture: "Lecture 2: 10/1", attended: false },
        { lecture: "Lecture 3: 10/8", attended: false },
        { lecture: "Lecture 4: 10/15", attended: false },
        { lecture: "Lecture 5: 10/22", attended: false },
        { lecture: "Lecture 6: 10/29", attended: false },
        { lecture: "Lecture 7: 11/5", attended: false },
        { lecture: "Lecture 8: 11/12", attended: false },
        { lecture: "Lecture 9: 11/19", attended: false },
        { lecture: "Lecture 10: 11/26", attended: false }
    ];

    useEffect(() => {
        // save students to local storage whenever it changes
        localStorage.setItem('students', JSON.stringify(students));
    }, [students]);

    // checks password for attendance
    const handlePasswordSubmit = () => {
        if (password === teacherPassword) {
            setIsAuthenticated(true);
        } else {
            alert("Incorrect password. Please try again.");
        }
    };

    // handle form answers
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // handle form submits
    const handleSubmit = () => {
        //if the name input had two parts, split them for formatting
        const nameParts = formData.name.trim().split(" ");
        let formattedName = formData.name;
        if (nameParts.length === 2) {
            formattedName = `${nameParts[1]}, ${nameParts[0]}`; // formatted like "last name, first name"
        }

        // initialize new student
        const newStudent = {
            name: formattedName,
            phone: formData.phone,
            terpmail: formData.terpmail,
            graduationYear: formData.graduationYear,
            attendance: lectureDates
        };

        // update students in bootcamp
        const updatedStudents = [...students, newStudent];

        // sort students by last name (the part before the comma)
        updatedStudents.sort((a, b) => {
            const lastNameA = a.name.split(",")[0].trim(); // last name of student A
            const lastNameB = b.name.split(",")[0].trim(); // last name of student B
            return lastNameA.localeCompare(lastNameB); // compare last names alphabetically
        });

        setStudents(updatedStudents);
        setShowPopup(false);
        setFormData({ name: '', phone: '', graduationYear: '', terpmail: '' });
    };

    // make attendance pop up
    const toggleAttendancePopup = (index: number | null) => {
        setAttendancePopup({ isVisible: !attendancePopup.isVisible, studentIndex: index });
    };

    // make attendance checkboxes for each lecture
    const toggleCheckbox = (studentIndex: number, lectureIndex: number) => {
        const updatedStudents = [...students];
        updatedStudents[studentIndex].attendance[lectureIndex].attended =
            !updatedStudents[studentIndex].attendance[lectureIndex].attended;
        setStudents(updatedStudents);
    };

    // make remove popup
    const handleRemoveClick = (index: number) => {
        setRemovePopup({ isVisible: true, studentIndex: index });
    };

    // make confirmation of student removal
    const confirmRemove = () => {
        if (removePopup.studentIndex !== null) {
            const updatedStudents = students.filter((_, index) => index !== removePopup.studentIndex);
            setStudents(updatedStudents);
            setRemovePopup({ isVisible: false, studentIndex: null });
        }
    };

    // or cancel it
    const cancelRemove = () => {
        setRemovePopup({ isVisible: false, studentIndex: null });
    };

    return (
        // ATTENDANCE PAGE (I did not know you could comment in divs using {} lmao)
        <div className="attendance-div">
            {!isAuthenticated ? (
                <div>
                    <h1>Enter Password to Access Attendance</h1>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter password"
                        className="password-input"
                    />
                    <button onClick={handlePasswordSubmit} className="attendance-btn">Submit</button>
                </div>
            ) : (
                <div>
                    <h1>Attendance</h1>
                    <button onClick={() => setShowPopup(true)} className="add-student-btn">
                        Add New Student
                    </button>

                    {showPopup && (
                        <div className="popup-overlay">
                            <div className="popup-content">
                                <h2>Add New Student</h2>
                                <form>
                                    <label>
                                        Name:
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            placeholder="Enter full name"
                                        />
                                    </label>
                                    <label>
                                        Phone Number:
                                        <input
                                            type="text"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            placeholder="Enter phone number"
                                        />
                                    </label>
                                    <label>
                                        Terpmail:
                                        <input
                                            type="email"
                                            name="terpmail"
                                            value={formData.terpmail}
                                            onChange={handleInputChange}
                                            placeholder="Enter terpmail"
                                        />
                                    </label>
                                    <label>
                                        Graduation Year:
                                        <input
                                            type="text"
                                            name="graduationYear"
                                            value={formData.graduationYear}
                                            onChange={handleInputChange}
                                            placeholder="Enter graduation year"
                                        />
                                    </label>
                                    <div className="popup-buttons">
                                        <button type="button" onClick={handleSubmit}>
                                            Submit
                                        </button>
                                        <button type="button" onClick={() => setShowPopup(false)}>
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    <div className="student-table">
                        {students.length > 0 && (
                            <table>
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Phone</th>
                                        <th>Terpmail</th>
                                        <th>Graduation Year</th>
                                        <th>Attendance</th>
                                        <th>Remove</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {students.map((student, index) => (
                                        <tr key={index}>
                                            <td>{student.name}</td>
                                            <td>{student.phone}</td>
                                            <td>{student.terpmail}</td>
                                            <td>{student.graduationYear}</td>
                                            <td>
                                                <button onClick={() => toggleAttendancePopup(index)} className="attendance-btn">
                                                    Attendance
                                                </button>
                                            </td>
                                            <td>
                                                <button onClick={() => handleRemoveClick(index)} className="remove-btn">
                                                    Remove
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                        {students.length === 0 && <p>No students added yet.</p>}
                    </div>

                    {attendancePopup.isVisible && attendancePopup.studentIndex !== null && (
                        <div className="popup-overlay">
                            <div className="popup-content">
                                <h2>Attendance for {students[attendancePopup.studentIndex].name}</h2>
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Date</th>
                                            <th>Attended</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {students[attendancePopup.studentIndex].attendance.map(
                                            (lecture: { lecture: string; attended: boolean }, i: number) => (
                                                <tr key={i}>
                                                    <td>{lecture.lecture}</td>
                                                    <td>
                                                        <input
                                                            type="checkbox"
                                                            checked={lecture.attended}
                                                            onChange={() =>
                                                                toggleCheckbox(attendancePopup.studentIndex!, i)
                                                            }
                                                        />
                                                    </td>
                                                </tr>
                                            )
                                        )}
                                    </tbody>
                                </table>
                                <button onClick={() => toggleAttendancePopup(null)}>Close</button>
                            </div>
                        </div>
                    )}

                    {removePopup.isVisible && (
                        <div className="popup-overlay">
                            <div className="popup-content">
                                <h2>Are you sure you want to remove this student?</h2>
                                <div className="popup-buttons">
                                    <button onClick={confirmRemove}>Yes, Remove</button>
                                    <button onClick={cancelRemove}>Cancel</button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
