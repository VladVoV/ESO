import React, { useState, useEffect } from 'react';
import departmentService from '../../../Services/departmentService';
import teacherService from '../../../Services/teacherService';
import groupService from "../../../Services/groupService";

const UpdateGroup = ({ groupId, initialGroup, onUpdate, onCloseModal }) => {
    const [group, setGroup] = useState(initialGroup);
    const [departments, setDepartments] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [availableTeachers, setAvailableTeachers] = useState([]);

    useEffect(() => {
        fetchDepartments();
        fetchTeachers();
        setAvailableTeachers(teachers.filter((teacher) => !group.teachers.includes(teacher._id)));
    }, [teachers, group.teachers]);

    useEffect(() => {
        const fetchAssignedTeachers = async () => {
            try {
                const assignedTeachersData = await Promise.all(
                    group.teachers.map((teacherId) => teacherService.getTeacherById(teacherId))
                );
                setTeachers(assignedTeachersData);
            } catch (error) {
                console.error('Error fetching assigned teachers:', error);
            }
        };

        fetchAssignedTeachers();
    }, [group.teachers]);

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
        setGroup({ ...group, [e.target.name]: e.target.value });
    };

    const handleDepartmentChange = (e) => {
        setGroup({ ...group, department: e.target.value });
    };

    const handleAddTeacher = (teacherId) => {
        setGroup({ ...group, teachers: [...group.teachers, teacherId] });
        setAvailableTeachers(availableTeachers.filter((teacher) => teacher._id !== teacherId));
    };

    const handleRemoveTeacher = (teacherId) => {
        setGroup({ ...group, teachers: group.teachers.filter((id) => id !== teacherId) });
        setAvailableTeachers([...availableTeachers, teachers.find((teacher) => teacher._id === teacherId)]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await groupService.updateGroup(groupId, group);
            onUpdate(); // Call the onUpdate callback function provided by the parent component
        } catch (error) {
            console.error('Error updating group:', error);
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
                value={group.name}
                onChange={handleInputChange}
                placeholder="Group Name"
            />

            <select name="department" value={group.department} onChange={handleDepartmentChange}>
                <option value="">Select Department</option>
                {departments.map((department) => (
                    <option key={department._id} value={department._id}>
                        {department.name}
                    </option>
                ))}
            </select>

            <div className="teacher-columns">
                <div className="teacher-column">
                    <h5>Available Teachers</h5>
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
                    <h5>Assigned Teachers</h5>
                    {group.teachers.map((teacherId) => (
                        <div key={teacherId} className="teacher-row">
              <span className="remove-icon" onClick={() => handleRemoveTeacher(teacherId)}>
                -
              </span>
                            <span>{teachers.find((teacher) => teacher._id === teacherId)?.name}</span>
                        </div>
                    ))}
                </div>
            </div>

            <button type="submit">Update Group</button>
        </form>
        </div>
    );
};

export default UpdateGroup;
