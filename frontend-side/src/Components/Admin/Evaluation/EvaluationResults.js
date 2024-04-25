import React, { useState, useEffect } from 'react';
import evaluationService from '../../../Services/evaluationService';
import Header from "../../Header";

const EvaluationResults = () => {
    const [teacherName, setTeacherName] = useState('');
    const [evaluationResponses, setEvaluationResponses] = useState([]);
    const [suggestions, setSuggestions] = useState([]);

    useEffect(() => {
        fetchEvaluationResults();
    }, []);

    const fetchEvaluationResults = async () => {
        try {
            const response = await evaluationService.getAllEvaluationResults();
            setEvaluationResponses(response.data);
        } catch (error) {
            console.error('Error fetching evaluation results:', error);
        }
    };

    const handleSearchChange = async (e) => {
        const searchTerm = e.target.value;
        setTeacherName(searchTerm);

        try {
            const suggestions = await evaluationService.getTeacherSuggestions(searchTerm);
            setSuggestions(suggestions.data);
        } catch (error) {
            console.error('Error fetching teacher suggestions:', error);
        }
    };

    const handleDownloadPDF = async (teacherId) => {
        try {
            const pdfResponse = await evaluationService.generateEvaluationPDF(teacherId);
            const pdfBlob = new Blob([pdfResponse.data], { type: 'application/pdf' });
            const pdfUrl = URL.createObjectURL(pdfBlob);
            window.open(pdfUrl, '_blank');
        } catch (error) {
            console.error('Error generating PDF:', error);
        }
    };

    const filteredResponses = evaluationResponses.filter((response) =>
        response.teacher.name.toLowerCase().includes(teacherName.toLowerCase())
    );

    return (
        <div>
            <Header />
            <h2>Evaluation Results</h2>
            <input
                type="text"
                value={teacherName}
                onChange={handleSearchChange}
                placeholder="Search by teacher name"
            />
            <ul>
                {suggestions.map((suggestion) => (
                    <li key={suggestion._id}>{suggestion.name}</li>
                ))}
            </ul>
            <ul>
                {filteredResponses.map((response) => (
                    <li key={response._id}>
                        <h3>Teacher: {response.teacher.name}</h3>
                        {/*<h4>Group: {response.group.name}</h4>*/}
                        <p>Answers:</p>
                        <ul>
                            {response.answers.map((answer, index) => (
                                <li key={index}>
                                    <p>Question: {answer.question ? answer.question.text : 'Question not found'}</p>
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
                        <button onClick={() => handleDownloadPDF(response.teacher._id)}>
                            Download PDF
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default EvaluationResults;
