import React, { useState, useEffect } from 'react';
import evaluationService from '../Services/evaluationService';

const EvaluationResults = () => {
    const [teacherId, setTeacherId] = useState('');
    const [evaluationResponses, setEvaluationResponses] = useState([]);

    useEffect(() => {
        fetchEvaluationResults();
    }, [teacherId]);

    const fetchEvaluationResults = async () => {
        try {
            const response = await evaluationService.getEvaluationResults(teacherId);
            setEvaluationResponses(response.data);
        } catch (error) {
            console.error('Error fetching evaluation results:', error);
        }
    };

    const handleDownloadPDF = async () => {
        try {
            const pdfResponse = await evaluationService.generateEvaluationPDF(teacherId);
            const pdfBlob = new Blob([pdfResponse.data], { type: 'application/pdf' });
            const pdfUrl = URL.createObjectURL(pdfBlob);
            window.open(pdfUrl, '_blank');
        } catch (error) {
            console.error('Error generating PDF:', error);
        }
    };

    return (
        <div>
            <h2>Evaluation Results</h2>
            <input
                type="text"
                value={teacherId}
                onChange={(e) => setTeacherId(e.target.value)}
                placeholder="Teacher ID"
            />
            <button onClick={fetchEvaluationResults}>Get Results</button>
            <button onClick={handleDownloadPDF}>Download PDF</button>
            <ul>
                {evaluationResponses.map((response) => (
                    <li key={response._id}>
                        <h3>Teacher: {response.teacher.name}</h3>
                        <h4>Group: {response.group.name}</h4>
                        <p>Answers:</p>
                        <ul>
                            {response.answers.map((answer, index) => (
                                <li key={index}>
                                    <p>Question: {answer.question.text}</p>
                                    <p>Answer: {answer.answer}</p>
                                </li>
                            ))}
                        </ul>
                        {response.openEndedResponse && (
                            <div>
                                <p>Open-ended Response:</p>
                                <p>{response.openEndedResponse}</p>
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default EvaluationResults;
