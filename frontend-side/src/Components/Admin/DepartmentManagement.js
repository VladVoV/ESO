import React, { useState, useEffect } from 'react';
import departmentService from '../../Services/departmentService';
import Header from "../Header";

const DepartmentManagement = () => {
    const [departments, setDepartments] = useState([]);
    const [newDepartment, setNewDepartment] = useState('');

    useEffect(() => {
        fetchDepartments();
    }, []);

    const fetchDepartments = async () => {
        try {
            const response = await departmentService.getAllDepartments();
            setDepartments(response.data);
        } catch (error) {
            console.error('Error fetching departments:', error);
        }
    };

    const handleCreateDepartment = async () => {
        try {
            await departmentService.createDepartment(newDepartment);
            setNewDepartment('');
            fetchDepartments();
        } catch (error) {
            console.error('Error creating department:', error);
        }
    };

    const handleUpdateDepartment = async (id, updatedName) => {
        try {
            await departmentService.updateDepartment(id, updatedName);
            fetchDepartments();
        } catch (error) {
            console.error('Error updating department:', error);
        }
    };

    const handleDeleteDepartment = async (id) => {
        try {
            await departmentService.deleteDepartment(id);
            fetchDepartments();
        } catch (error) {
            console.error('Error deleting department:', error);
        }
    };

    return (
        <div>
            <Header/>
            <div className="container my-5">
                <h2 className="mb-4">Підрозділи</h2>
                <div className="mb-4">
                    <input
                        type="text"
                        className="form-control"
                        value={newDepartment}
                        onChange={(e) => setNewDepartment(e.target.value)}
                        placeholder="Новий підрозділ"
                    />
                    <button className="btn btn-primary mt-2" onClick={handleCreateDepartment}>
                        Створити
                    </button>
                </div>
                <ul className="list-group">
                    {departments.map((department) => (
                        <li key={department._id} className="list-group-item d-flex justify-content-between align-items-center">
                            <div className="form-inline">
                                <input
                                    type="text"
                                    className="form-control"
                                    defaultValue={department.name}
                                    onBlur={(e) => handleUpdateDepartment(department._id, e.target.value)}
                                />
                            </div>
                            <button className="btn btn-danger" onClick={() => handleDeleteDepartment(department._id)}>
                                Видалити
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default DepartmentManagement;
