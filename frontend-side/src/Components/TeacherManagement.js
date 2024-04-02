import React, { useState, useEffect } from 'react';
import teacherService from '../Services/teacherService';
import departmentService from '../Services/departmentService';

const TeacherManagement = () => {
    const [teachers, setTeachers] = useState([]);
    const [newTeacher, setNewTeacher] = useState({
        name: '',
        department: '',
    });
    const [departments, setDepartments] = useState([]);

    useEffect(() => {
        fetchTeachers();
        fetchDepartments();
    }, []);

    const fetchTeachers = async () => {
        try {
            const response = await teacherService.getAllTeachers();
            setTeachers(response.data);
        } catch (error) {
            console.error('Error fetching teachers:', error);
        }
    };

    const fetchDepartments = async () => {
        try {
            const response = await departmentService.getAllDepartments();
            setDepartments(response.data);
        } catch (error) {
            console.error('Error fetching departments:', error);
        }
    };

    const handleCreateTeacher = async () => {
        try {
            const { name, department } = newTeacher;
            if (department) {
                await teacherService.createTeacher({ name, department });
                setNewTeacher({
                    name: '',
                    department: '',
                });
                await fetchTeachers();
            } else {
                console.error('Department is required');
            }
        } catch (error) {
            console.error('Error creating teacher:', error);
        }
    };

    const handleUpdateTeacher = async (id, updatedTeacher) => {
        try {
            await teacherService.updateTeacher(id, updatedTeacher);
            await fetchTeachers();
        } catch (error) {
            console.error('Error updating teacher:', error);
        }
    };

    const handleDeleteTeacher = async (id) => {
        try {
            await teacherService.deleteTeacher(id);
            await fetchTeachers();
        } catch (error) {
            console.error('Error deleting teacher:', error);
        }
    };

    return (
        <div className="container my-5">
            <h2 className="mb-4">Teacher Management</h2>
            <div className="card mb-4">
                <div className="card-body">
                    <h5 className="card-title">Create Teacher</h5>
                    <div className="form-group">
                        <input
                            type="text"
                            className="form-control"
                            value={newTeacher.name}
                            onChange={(e) => setNewTeacher({ ...newTeacher, name: e.target.value })}
                            placeholder="Teacher Name"
                        />
                    </div>
                    <div className="form-group">
                        <select
                            className="form-control"
                            value={newTeacher.department}
                            onChange={(e) => setNewTeacher({ ...newTeacher, department: e.target.value })}
                        >
                            <option value="">Select Department</option>
                            {departments.map((department) => (
                                <option key={department._id} value={department._id}>
                                    {department.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <button className="btn btn-primary" onClick={handleCreateTeacher}>
                        Create Teacher
                    </button>
                </div>
            </div>
            <ul className="list-group">
                {teachers.map((teacher) => (
                    <li key={teacher._id} className="list-group-item">
                        <div className="d-flex justify-content-between align-items-center">
                            <div>
                                <h5>{teacher.name}</h5>
                                <p className="mb-0">Department: {teacher.department.name}</p>
                            </div>
                            <div>
                                <button
                                    className="btn btn-primary mr-2"
                                    onClick={() =>
                                        handleUpdateTeacher(teacher._id, {
                                            name: 'Updated Teacher Name',
                                            department: teacher.department._id,
                                        })
                                    }
                                >
                                    Update Teacher
                                </button>
                                <button
                                    className="btn btn-danger"
                                    onClick={() => handleDeleteTeacher(teacher._id)}
                                >
                                    Delete Teacher
                                </button>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TeacherManagement;
