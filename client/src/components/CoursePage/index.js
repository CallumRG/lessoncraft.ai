import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { API_URL } from "../../config";
import { toast } from 'react-toastify'
import LessonPage from '../LessonPage';
import DiscussionPage from '../DiscussionPage';
import ClassListPage from '../ClassListPage';
;

const CoursePage = () => {

    //states
    const { course_id } = useParams();
    const [activeSection, setActiveSection] = useState('lesson');
    const [courseInfo, setCourseInfo] = useState(null);
    const [courseNotFound, setCourseNotFound] = useState(false);

    // fetch course details when the component starts
    useEffect(() => {
        
        const fetchCourseInfo = async () => {
            try {
                const response = await fetch(`${API_URL}/courseInfo`, {
                    method: 'POST',
                    headers: {
                    'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ course_id }),
                });
        
                if (response.ok) {
                    const data = await response.json();
                    setCourseInfo(data.courseInfo);
                } else if (response.status === 404) {
                    // Course not found
                    setCourseNotFound(true);
                } else {
                    console.error('Error fetching course info:', response.statusText);
                    toast.error('Error fetching course info');
                }
                } catch (error) {
                console.error('Error fetching course info:', error);
                toast.error('Error fetching course info');
                }
    };

        fetchCourseInfo();
    }, [course_id]);

    const handleSectionChange = (section) => {
        setActiveSection(section);
    };

    return (
        <div>
          {courseNotFound ? (
            <p>{`Course with ID ${course_id} not found.`}</p>
          ) : courseInfo ? (
            <>
              <h1>{`Course Page - ${courseInfo.course_name}`}</h1>
    
              {/* renders course inforamtion */}
              <div>
                <p>{`Course ID: ${courseInfo.id}`}</p>
                <p>{`Instructor: ${courseInfo.first_name} ${courseInfo.last_name}`}</p>
                <p>{`Email: ${courseInfo.email}`}</p>
              </div>
    
              {/* navigation buttons */}
              <div>
                <button onClick={() => handleSectionChange('lesson')}>Lesson Page</button>
                <button onClick={() => handleSectionChange('discussion')}>Discussion Page</button>
                <button onClick={() => handleSectionChange('classlist')}>Class List Page</button>
              </div>
    
              {/* render selection*/}
              {activeSection === 'lesson' && <LessonPage />}
              {activeSection === 'discussion' && <DiscussionPage />}
              {activeSection === 'classlist' && <ClassListPage />}
            </>
          ) : (
            <p>Loading course information...</p>
          )}
        </div>
      );
    };

export default CoursePage;
