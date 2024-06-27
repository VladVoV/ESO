import React, { useState, useEffect } from 'react';
import groupService from '../../../Services/groupService';
import UpdateGroup from './UpdateGroup';
import Header from "../../Header";
import Modal from "../../../Common/Modal";
import CreateGroup from "./CreateGroup";

const GroupManagement = () => {
    const [groups, setGroups] = useState([]);
    const [groupToUpdate, setGroupToUpdate] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);

    useEffect(() => {
        fetchGroups();
    }, []);

    const fetchGroups = async () => {
        try {
            const response = await groupService.getAllGroups();
            setGroups(response.data);
        } catch (error) {
            console.error('Error fetching groups:', error);
        }
    };

    const toggleCreateModal = () => {
        setShowCreateModal(!showCreateModal);
    };

    const handleUpdateGroup = (group) => {
        setGroupToUpdate(group);
    };

    const handleDeleteGroup = async (id) => {
        try {
            await groupService.deleteGroup(id);
            fetchGroups();
        } catch (error) {
            console.error('Error deleting group:', error);
        }
    };

    const handleCloseCreateModal = () => {
        setShowCreateModal(false);
    };

    const handleCloseUpdateModal = () => {
        setGroupToUpdate(null);
    };

    return (
        <div>
            <Header/>
            <div className="container my-5">
                <h2 className="mb-4">Групи</h2>
                <div className="card mb-4">
                    <div className="card-body">
                        <button className="btn btn-primary" onClick={toggleCreateModal}>
                            Створити
                        </button>
                    </div>
                </div>
                <ul className="list-group">
                    {groups.map((group) => (
                        <li key={group._id} className="list-group-item">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <div>
                                    <h5>{group.name}</h5>
                                    <p className="mb-0">Підрозділ: {group.department.name}</p>
                                    <p className="mb-0">Пароль: {group.password}</p>
                                </div>
                                <div>
                                    <button
                                        className="btn btn-primary mr-2"
                                        onClick={() =>
                                            handleUpdateGroup(group)
                                        }
                                    >
                                        Оновити
                                    </button>
                                    <button className="btn btn-danger" onClick={() => handleDeleteGroup(group._id)}>
                                        Видалити
                                    </button>
                                </div>
                            </div>
                            <div>
                                <h6>Викладачі:</h6>
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
                <Modal isOpen={groupToUpdate !== null}>
                    {groupToUpdate && (
                        <UpdateGroup
                            groupId={groupToUpdate._id}
                            initialGroup={groupToUpdate}
                            onUpdate={() => {
                                setGroupToUpdate(null);
                                fetchGroups();
                            }}
                            onCloseModal={handleCloseUpdateModal}
                        />
                    )}
                </Modal>
                <Modal isOpen={showCreateModal}>
                    <CreateGroup
                        onCreateGroup={() => {
                            setShowCreateModal(false);
                            fetchGroups();
                        }}
                        onCloseModal={handleCloseCreateModal}
                    />
                </Modal>
            </div>
        </div>
    );
};

export default GroupManagement;
