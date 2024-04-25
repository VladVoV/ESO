import React from 'react';

const Modal = ({ isOpen, children }) => {
    return isOpen ? (
        <div className="modal-overlay">
            <div className="modal-content">{children}</div>
        </div>
    ) : null;
};

export default Modal;
