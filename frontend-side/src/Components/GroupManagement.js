import React, { useState, useEffect } from 'react';
import groupService from '../Services/groupService';
import departmentService from '../Services/departmentService';
import teacherService from '../Services/teacherService';

const GroupManagement = () => {
    const [groups, setGroups] = useState([]);
    const [newGroup, setNewGroup] = useState({
        name: '',
        department: '',
        password: '',
        teachers: [],
    });
    const [departments, setDepartments] = useState([]);
    const [teachers, setTeachers] = useState([]);

    useEffect(() => {
        fetchGroups();
        fetchDepartments();
        fetchTeachers();
    }, []);

    const fetchGroups = async () => {
        try {
            const response = await groupService.getAllGroups();
            setGroups(response.data);
        } catch (error) {
            console.error('Error fetching groups:', error);
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

    const fetchTeachers = async () => {
        try {
            const response = await teacherService.getAllTeachers();
            setTeachers(response.data);
        } catch (error) {
            console.error('Error fetching teachers:', error);
        }
    };

    const handleCreateGroup = async () => {
        try {
            await groupService.createGroup(newGroup);
            setNewGroup({
                name: '',
                department: '',
                password: '',
                teachers: [],
            });
            fetchGroups();
        } catch (error) {
            console.error('Error creating group:', error);
        }
    };

    const handleUpdateGroup = async (id, updatedGroup) => {
        try {
            await groupService.updateGroup(id, updatedGroup);
            fetchGroups();
        } catch (error) {
            console.error('Error updating group:', error);
        }
    };

    const handleDeleteGroup = async (id) => {
        try {
            await groupService.deleteGroup(id);
            fetchGroups();
        } catch (error) {
            console.error('Error deleting group:', error);
        }
    };

    const handleAssignTeachersToGroup = async (groupId, teacherIds) => {
        try {
            await groupService.assignTeachersToGroup(groupId, teacherIds);
            fetchGroups();
        } catch (error) {
            console.error('Error assigning teachers to group:', error);
        }
    };

    return (
        <div className="container my-5">
            <h2 className="mb-4">Group Management</h2>
            <div className="card mb-4">
                <div className="card-body">
                    <h5 className="card-title">Create Group</h5>
                    <div className="form-group">
                        <input
                            type="text"
                            className="form-control"
                            value={newGroup.name}
                            onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
                            placeholder="Group Name"
                        />
                    </div>
                    <div className="form-group">
                        <select
                            className="form-control"
                            value={newGroup.department}
                            onChange={(e) => setNewGroup({ ...newGroup, department: e.target.value })}
                        >
                            <option value="">Select Department</option>
                            {departments.map((department) => (
                                <option key={department._id} value={department._id}>
                                    {department.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <input
                            type="text"
                            className="form-control"
                            value={newGroup.password}
                            onChange={(e) => setNewGroup({ ...newGroup, password: e.target.value })}
                            placeholder="Group Password"
                        />
                    </div>
                    <div className="form-group">
                        <select
                            className="form-control"
                            multiple
                            value={newGroup.teachers}
                            onChange={(e) =>
                                setNewGroup({ ...newGroup, teachers: Array.from(e.target.selectedOptions, (option) => option.value) })
                            }
                        >
                            {teachers.map((teacher) => (
                                <option key={teacher._id} value={teacher._id}>
                                    {teacher.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <button className="btn btn-primary" onClick={handleCreateGroup}>
                        Create Group
                    </button>
                </div>
            </div>
            <ul className="list-group">
                {groups.map((group) => (
                    <li key={group._id} className="list-group-item">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <div>
                                <h5>{group.name}</h5>
                                <p className="mb-0">Department: {group.department.name}</p>
                                <p className="mb-0">Password: {group.password}</p>
                            </div>
                            <div>
                                <button
                                    className="btn btn-primary mr-2"
                                    onClick={() =>
                                        handleAssignTeachersToGroup(group._id, [
                                            // Select teacher IDs to assign
                                        ])
                                    }
                                >
                                    Assign Teachers
                                </button>
                                <button
                                    className="btn btn-primary mr-2"
                                    onClick={() =>
                                        handleUpdateGroup(group._id, {
                                            name: 'Updated Group Name',
                                            department: group.department._id,
                                            password: 'newpassword',
                                            teachers: group.teachers.map((teacher) => teacher._id),
                                        })
                                    }
                                >
                                    Update Group
                                </button>
                                <button className="btn btn-danger" onClick={() => handleDeleteGroup(group._id)}>
                                    Delete Group
                                </button>
                            </div>
                        </div>
                        <div>
                            <h6>Teachers:</h6>
                            <ul className="list-group list-group-flush">
                                {group.teachers.map((teacher) => (
                                    <li key={teacher._id} className="list-group-item">
                                        {teacher.name}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default GroupManagement;
