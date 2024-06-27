import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import authService from "../../Services/authService"
import Header from "../Header";

const AdminLogin = () => {
    const { register, handleSubmit, setError, formState: { errors }, reset } = useForm();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        setMessage("");
        setLoading(true);

        try {
            await authService.login(data.email, data.password);
            navigate("/admin/departments");
            window.location.reload();
        } catch (error) {
            const resMessage =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();

            setError("email", {
                type: "manual",
                message: resMessage,
            });

            setError("password", {
                type: "manual",
                message: resMessage,
            });

            setLoading(false);
            setMessage(resMessage);
        }
    };

    return (
        <div>
            <Header/>
            <div className="container h-100 d-flex justify-content-center align-items-center">
                <div
                    className="card shadow-sm border-0 rounded"
                >
                    <div className="card-body">
                        <h2 className="card-title text-center mb-4">Вхід</h2>
                        <form onSubmit={handleSubmit(onSubmit)} className="login-form">
                            <div className="form-group">
                                <label htmlFor="email">Пошта</label>
                                <input
                                    type="text"
                                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                    {...register('email', { required: 'This field is required!' })}
                                />
                                <div className="invalid-feedback">{errors.email?.message}</div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="password">Пароль</label>
                                <input
                                    type="password"
                                    className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                                    {...register('password', { required: 'This field is required!' })}
                                />
                                <div className="invalid-feedback">{errors.password?.message}</div>
                            </div>

                            <div className="form-group">
                                <button className="btn btn-primary btn-block btn-login" disabled={loading}>
                                    {loading && (
                                        <span className="spinner-border spinner-border-sm"></span>
                                    )}
                                    <span>Вхід</span>
                                </button>
                            </div>

                            {message && (
                                <div className="form-group">
                                    <div className="alert alert-danger" role="alert">
                                        {message}
                                    </div>
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
