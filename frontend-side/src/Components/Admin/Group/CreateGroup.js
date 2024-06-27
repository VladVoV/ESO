import React, { useState, useEffect } from 'react';
import departmentService from '../../../Services/departmentService';
import teacherService from '../../../Services/teacherService';
import groupService from "../../../Services/groupService";

const CreateGroup = ({ onCreateGroup, onCloseModal }) => {
    const [newGroup, setNewGroup] = useState({
        name: '',
        department: '',
        password: '',
        teachers: [],
    });
    const [departments, setDepartments] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [availableTeachers, setAvailableTeachers] = useState([]);

    useEffect(() => {
        fetchDepartments();
        fetchTeachers();
    }, []);

    useEffect(() => {
        setAvailableTeachers(teachers);
    }, [teachers]);

    const fetchDepartments = async () => {
        try {
            const response = await departmentService.getAllDepartments();
            setDepartments(response.data);
        } catch (error) {
            console.error('Error fetching departments:', error);
        }
    };

    const fetchTeachers = async () => {
        try {
            const response = await teacherService.getAllTeachers();
            setTeachers(response.data);
        } catch (error) {
            console.error('Error fetching teachers:', error);
        }
    };

    const handleInputChange = (e) => {
        setNewGroup({ ...newGroup, [e.target.name]: e.target.value });
    };

    const handleDepartmentChange = (e) => {
        setNewGroup({ ...newGroup, department: e.target.value });
    };

    const handleAddTeacher = (teacherId) => {
        setNewGroup({ ...newGroup, teachers: [...newGroup.teachers, teacherId] });
        setAvailableTeachers(availableTeachers.filter((teacher) => teacher._id !== teacherId));
    };

    const handleRemoveTeacher = (teacherId) => {
        setNewGroup({ ...newGroup, teachers: newGroup.teachers.filter((id) => id !== teacherId) });
        setAvailableTeachers([...availableTeachers, teachers.find((teacher) => teacher._id === teacherId)]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await groupService.createGroup(newGroup);
            setNewGroup({
                name: '',
                department: '',
                password: '',
                teachers: [],
            });
            onCreateGroup(); // Call the onCreateGroup callback function provided by the parent component
        } catch (error) {
            console.error('Error creating group:', error);
        }
    };

    const handleClose = () => {
        onCloseModal();
    };

    return (
        <div>
            <button className="close-button" onClick={handleClose}>
                X
            </button>
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                name="name"
                value={newGroup.name}
                onChange={handleInputChange}
                placeholder="Ім'я групи"
            />

            <select name="department" value={newGroup.department} onChange={handleDepartmentChange}>
                <option value="">Підрозділ</option>
                {departments.map((department) => (
                    <option key={department._id} value={department._id}>
                        {department.name}
                    </option>
                ))}
            </select>


            <div className="teacher-columns">
                <div className="teacher-column">
                    <h5>Доступні викладачі</h5>
                    {availableTeachers.map((teacher) => (
                        <div key={teacher._id} className="teacher-row">
              <span className="add-icon" onClick={() => handleAddTeacher(teacher._id)}>
                +
              </span>
                            <span>{teacher.name}</span>
                        </div>
                    ))}
                </div>
                <div className="teacher-column">
                    <h5>Призначені викладачі</h5>
                    {newGroup.teachers.map((teacherId) => (
                        <div key={teacherId} className="teacher-row">
              <span className="remove-icon" onClick={() => handleRemoveTeacher(teacherId)}>
                -
              </span>
                            <span>{teachers.find((teacher) => teacher._id === teacherId)?.name}</span>
                        </div>
                    ))}
                </div>
            </div>

            <button type="submit">Створити</button>
        </form>
        </div>
    );
}

export default CreateGroup;
