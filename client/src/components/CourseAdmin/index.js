import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { API_URL } from "../../config";
import Firebase from '../Firebase/firebase';
import { toast } from 'react-toastify'

const CourseAdmin = () => {

    //set states and stuff
    const firebase = new Firebase();
    const navigate = useNavigate();
    const { course_id } = useParams();
    const [administrators, setAdministrators] = useState([]);
    const [newAdminEmail, setNewAdminEmail] = useState('');
    const [adminsNotFound, setAdminsNotFound] = useState(false)

    useEffect(() => {
        // fetch administrators from the server when the component mounts
        fetchAdministrators();
    }, [course_id]);

    //grabs administrators
    const fetchAdministrators = async () => {
        try {
            const response = await fetch(`${API_URL}/courseFetchAdmin`, {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify({ course_id }),
            });

            if (response.ok) {
                const data = await response.json();
                setAdminsNotFound(false);
                setAdministrators(data.courseAdmins);
            } else if (response.status === 404) {
                // admins not found
                setAdminsNotFound(true);
                setAdministrators([]);
            } else {
                console.error('Error fetching course admins:', response.statusText);
                toast.error('Error fetching course admins');
            }
            } catch (error) {
            console.error('Error fetching course admins:', error);
            toast.error('Error fetching course admins');
            }
    };

    //add new admin
    const handleAddAdministrator = async () => {
        try {
            const response = await fetch(`${API_URL}/courseAddAdmin`, {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    course_id,
                    newAdminEmail,
                    current_id : firebase.auth.currentUser.uid
                }),
            });

            if (response.ok) {
                setNewAdminEmail('');
                fetchAdministrators()
            } else if (response.status === 404) {
                toast.error('Admin does not exist');
            } else if (response.status === 403) {
                toast.error('Current User Not Course Owner');
            } else if (response.status === 400) {
                toast.error('User already course admin');
            } else {
                console.error('Error adding course admins:', response.statusText);
                toast.error('Error adding course admin');
            }
            } catch (error) {
            console.error('Error adding course admins:', error);
            toast.error('Error adding course admins');
            }
    };

    //delete admin
    const handleDeleteAdministrator = async (admin_id) => {
        // Show confirmation dialog
        const confirmDelete = window.confirm("Are you sure you want to delete this administrator?");

        if (!confirmDelete) {
            return; // User canceled deletion
    }

        try {
            const response = await fetch(`${API_URL}/courseDeleteAdmin`, {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    course_id,
                    admin_id,
                    current_id : firebase.auth.currentUser.uid
                }),
            });

            if (response.ok) {
                fetchAdministrators()
            } else if (response.status === 403) {
                toast.error('Current User Not Course Owner');
            } else {
                console.error('Error deleting course admins:', response.statusText);
                toast.error('Error deleting course admin');
            }
            } catch (error) {
            console.error('Error deleting course admins:', error);
            toast.error('Error deleting course admins');
            }
    };

    return (
        <div>
            <Link to={`/course/${course_id}`}>
                <button>Return to Course</button>
            </Link>

            <h1>Edit Administrators - Course ID: {course_id}</h1>
            {/* add admins */}
            <div>
                <input
                type="email"
                placeholder="Enter User Email"
                value={newAdminEmail}
                onChange={(e) => setNewAdminEmail(e.target.value)}
                />
                <button onClick={handleAddAdministrator}>Add Administrator</button>
            </div>

            {/* display admins */}
            <div>
                {adminsNotFound ? (
                    <p>No admins in course ({course_id}).</p>
                ) : (
                    // Render your administrators list here
                    <ul>
                        {administrators.map((admin) => (
                            <li key={admin.admin_id}>
                                {admin.email}
                                <button onClick={() => handleDeleteAdministrator(admin.admin_id)}>Delete</button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default CourseAdmin;
