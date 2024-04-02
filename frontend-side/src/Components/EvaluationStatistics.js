import React, { useState, useEffect } from 'react';
import evaluationService from '../Services/evaluationService';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const EvaluationStatistics = () => {
    const [stats, setStats] = useState(null);

    useEffect(() => {
        fetchEvaluationStats();
    }, []);

    const fetchEvaluationStats = async () => {
        try {
            const response = await evaluationService.getEvaluationStats();
            setStats(response.data);
        } catch (error) {
            console.error('Error fetching evaluation statistics:', error);
        }
    };

    return (
        <div>
            <h2>Evaluation Statistics</h2>
            {stats && (
                <div>
                    <p>Total Responses: {stats.totalResponses}</p>
                    <h3>Teacher Statistics</h3>
                    <ul>
                        {stats.teacherStats.map((teacher) => (
                            <li key={teacher._id}>
                                <p>
                                    {teacher.name} ({teacher.department.name})
                                </p>
                                <p>Number of Evaluations: {teacher.evaluationCount}</p>
                                <p>Average Rating: {teacher.averageRating}</p>
                            </li>
                        ))}
                    </ul>
                    <h3>Department Statistics</h3>
                    <ul>
                        {stats.departmentStats.map((department) => (
                            <li key={department._id}>
                                <p>{department.name}</p>
                                <p>Number of Teachers: {department.teacherCount}</p>
                                <p>Average Rating: {department.averageRating}</p>
                            </li>
                        ))}
                    </ul>
                    <h3>Average Rating by Department (Line Chart)</h3>
                    <LineChart
                        width={600}
                        height={400}
                        data={stats.departmentStats}
                        margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="averageRating" stroke="#8884d8" />
                    </LineChart>
                </div>
            )}
        </div>
    );
};

export default EvaluationStatistics;
