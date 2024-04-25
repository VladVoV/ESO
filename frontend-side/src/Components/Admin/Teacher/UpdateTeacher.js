import React, { useState, useEffect } from 'react';
import teacherService from '../../../Services/teacherService';
import departmentService from '../../../Services/departmentService';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

const UpdateTeacher = ({ teacherId, initialTeacher, onUpdate }) => {
    const [teacher, setTeacher] = useState(initialTeacher);
    const [departments, setDepartments] = useState([]);

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

    const handleInputChange = (e) => {
        setTeacher({ ...teacher, [e.target.name]: e.target.value });
    };

    const handleDepartmentChange = (e) => {
        setTeacher({ ...teacher, department: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await teacherService.updateTeacher(teacherId, teacher);
            onUpdate(); // Call the onUpdate callback function provided by the parent component
        } catch (error) {
            console.error('Error updating teacher:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="row mb-3">
            <div className="col-md-6">
                <label htmlFor="name" className="form-label">
                    Teacher Name
                </label>
                <input
                    type="text"
                    name="name"
                    value={teacher.name}
                    onChange={handleInputChange}
                    placeholder="Teacher Name"
                    className="form-control"
                    id="name"
                />
            </div>
            <div className="col-md-6">
                <label htmlFor="department" className="form-label">
                    Department
                </label>
                <select
                    name="department"
                    value={teacher.department}
                    onChange={handleDepartmentChange}
                    className="form-select"
                    id="department"
                >
                    <option value="">Select Department</option>
                    {departments.map((department) => (
                        <option key={department._id} value={department._id}>
                            {department.name}
                        </option>
                    ))}
                </select>
            </div>
            <div className="col-12 mt-3">
                <button type="submit" className="btn btn-primary">
                    Update Teacher
                </button>
            </div>
        </form>
    );
};

export default UpdateTeacher;
