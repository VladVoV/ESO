import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';

const ConfirmationMessage = () => {
    const [show, setShow] = useState(true);
    const navigate = useNavigate();

    const handleClose = () => {
        setShow(false);
    };

    const handleAccept = () => {
        handleClose();
        navigate('/teacher-selection');
    };

    const handleDecline = () => {
        handleClose();
        navigate('/');
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Підтвердження участі</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>
                    Ви стали учасником соціологічного дослідження "Викладач очима студента" з
                    проблем удосконалення навчально-виховного процесу в університеті. Отримані дані
                    будуть використані для вивчення ставлення студентів до різних сторін навчального
                    процесу. Це дозволить керівництву університету врахувати запити і побажання
                    студентів щодо його подальшого удосконалення. Анкета носить анонімний характер.
                    Вам не треба вказувати своє прізвище. Уважно прочитайте запитання та відмітьте
                    відповідь, яка вам найбільше підходить. Наукова цінність дослідження залежить від
                    точності та щирості ваших відповідей.
                </p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={handleAccept}>
                    Прийняти
                </Button>
                <Button variant="secondary" onClick={handleDecline}>
                    Відхилити
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ConfirmationMessage;
