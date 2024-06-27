import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from "./Header";

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
            <Header/>
        <div className="container">
            <h2 className="text-center">Вибрати викладача</h2>
            <ul className="list-group">
                {teachers.map((teacher) => (
                    <li key={teacher._id} className="list-group-item">
                        <button
                            className="btn btn-primary btn-block"
                            onClick={() => handleTeacherSelect(teacher._id)}
                        >
                            {teacher.name}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
        </div>
    );
};

export default TeacherSelection;
