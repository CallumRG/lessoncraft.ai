import {React, useState, useEffect} from 'react';
import { Link, useParams } from "react-router-dom";
import LessonPage from "../LessonPage";
import DiscussionPage from "../DiscussionPage";
import ClassListPage from "../ClassListPage";

const CoursePage = () => {
    const { course_id } = useParams();
    const [activeSection, setActiveSection] = useState("lesson");
  
    const handleSectionChange = (section) => {
      setActiveSection(section);
    };
  
    return (
      <div>
        <h1>Course/Classroom Page - {course_id}</h1>
  
        {/* Navigation Buttons with dynamic course_id */}
        <div>
          <button onClick={() => handleSectionChange("lesson")}>Lesson Page</button>
          <button onClick={() => handleSectionChange("discussion")}>Discussion Page</button>
          <button onClick={() => handleSectionChange("classlist")}>Class List Page</button>
        </div>
  
        {/* Render content based on active section */}
        {activeSection === "lesson" && <LessonPage />}
        {activeSection === "discussion" && <DiscussionPage />}
        {activeSection === "classlist" && <ClassListPage />}
      </div>
    );
  };
  
  export default CoursePage;