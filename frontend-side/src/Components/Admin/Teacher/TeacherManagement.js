import React, { useState, useEffect } from 'react';
import teacherService from '../../../Services/teacherService';
import departmentService from '../../../Services/departmentService';
import UpdateTeacher from "./UpdateTeacher";
import Header from "../../Header";
import Modal from "../../../Common/Modal";

const TeacherManagement = () => {
    const [teachers, setTeachers] = useState([]);
    const [newTeacher, setNewTeacher] = useState({
        name: '',
        department: '',
    });
    const [departments, setDepartments] = useState([]);
    const [teacherToUpdate, setTeacherToUpdate] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);

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

    const handleCreateTeacherModal = () => {
        setShowCreateModal(true);
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
                setShowCreateModal(false);
                await fetchTeachers();
            } else {
                console.error('Department is required');
            }
        } catch (error) {
            console.error('Error creating teacher:', error);
        }
    };

    const handleCloseCreateModal = () => {
        setShowCreateModal(false);
        setNewTeacher({
            name: '',
            department: '',
        });
    };

    const handleUpdateTeacher = (teacher) => {
        setTeacherToUpdate(teacher);
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
        <div>
            <Header/>
            <div className="container my-5">
                <h2 className="mb-4">Teacher Management</h2>
                <div className="card mb-4">
                    <div className="card-body">
                        <h5 className="card-title">Create Teacher</h5>
                        <button className="btn btn-primary" onClick={handleCreateTeacherModal}>
                            Create
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
                                            handleUpdateTeacher(teacher)
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
                <Modal isOpen={teacherToUpdate !== null}>
                    {teacherToUpdate && (
                        <UpdateTeacher
                            teacherId={teacherToUpdate._id}
                            initialTeacher={teacherToUpdate}
                            onUpdate={() => {
                                setTeacherToUpdate(null);
                                fetchTeachers();
                            }}
                        />
                    )}
                </Modal>
                <Modal isOpen={showCreateModal}>
                    <div className="modal-header">
                        <h5 className="modal-title">Create Teacher</h5>
                        <button
                            type="button"
                            className="close"
                            onClick={handleCloseCreateModal}
                        >
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
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
                    </div>
                    <div className="modal-footer">
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={handleCloseCreateModal}
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={handleCreateTeacher}
                        >
                            Create Teacher
                        </button>
                    </div>
                </Modal>
            </div>
        </div>
    );
};

export default TeacherManagement;
