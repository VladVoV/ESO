// TeacherSelection.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const TeacherSelection = () => {
    const [teachers, setTeachers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const storedTeachers = JSON.parse(localStorage.getItem('teachers'));
        setTeachers(storedTeachers || []);
    }, []);

    const handleTeacherSelect = (teacherId) => {
        navigate('/evaluate', { state: { teacherId } });
    };

    return (
        <div>
            <h2>Select a Teacher</h2>
            <ul>
                {teachers.map((teacher) => (
                    <li key={teacher._id}>
                        <button onClick={() => handleTeacherSelect(teacher._id)}>
                            {teacher.name}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TeacherSelection;
