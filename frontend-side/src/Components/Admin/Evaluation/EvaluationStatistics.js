import React, { useState, useEffect } from 'react';
import evaluationService from '../../../Services/evaluationService';
import Header from "../../Header";

const EvaluationStatistics = () => {
    const [stats, setStats] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortedStats, setSortedStats] = useState([]);

    useEffect(() => {
        fetchEvaluationStats();
    }, []);

    useEffect(() => {
        const filtered = stats.filter((teacher) =>
            teacher.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        const sorted = filtered.sort((a, b) =>
            a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })
        );
        setSortedStats(sorted);
    }, [stats, searchTerm]);

    const handleDownloadPDF = async (teacherId) => {
        try {
            const response = await evaluationService.generateEvaluationPDF(teacherId);
            const blob = new Blob([response.data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `teacher_${teacherId}_stats.pdf`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error('Error downloading PDF:', error);
        }
    };

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
            <Header />
        <div className="container">
            <h2>Evaluation Statistics</h2>
            <div className="row">
                <div className="col-md-6">
                    <input
                        type="text"
                        placeholder="Search teachers..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="form-control mb-3"
                    />
                </div>
            </div>
            {sortedStats.map((teacher) => (
                <div key={teacher._id} className="card mb-3">
                    <div className="card-header">
                        <h3>{teacher.name}</h3>
                    </div>
                    <div className="card-body">
                        <div>
                            <h4>Question Ratings:</h4>
                            <ul className="list-group">
                                {Object.entries(teacher.answers).map(([questionId, { questionText, averageRating }]) => (
                                    <li key={questionId} className="list-group-item">
                                        {questionText} - Average Rating: {averageRating.toFixed(2)}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <p>Open-Ended Responses:</p>
                        <ul className="list-group">
                            {teacher.openEndedResponses.map((response, index) => (
                                <li key={index} className="list-group-item">{response}</li>
                            ))}
                        </ul>
                        <div className="card-footer">
                            <button onClick={() => handleDownloadPDF(teacher._id)} className="btn btn-primary">
                                Download PDF
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
        </div>
    );
};

export default EvaluationStatistics;
