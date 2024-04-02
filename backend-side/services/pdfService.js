const fs = require('fs');
const path = require('path');
const pdfkit = require('pdfkit');

exports.generateEvaluationPDF = async (evaluationResponses) => {
    return new Promise((resolve, reject) => {
        const pdfBuffer = [];

        const doc = new pdfkit();
        doc.pipe(pdfBuffer);

        doc.fontSize(16).text('Evaluation Results', { align: 'center' });
        doc.moveDown();

        evaluationResponses.forEach((response) => {
            doc.fontSize(14).text(`Teacher: ${response.teacher.name}`);
            doc.fontSize(12).text(`Group: ${response.group.name}`);
            doc.moveDown();

            response.answers.forEach((answer) => {
                doc.fontSize(12).text(`Question: ${answer.question.text}`);
                doc.fontSize(10).text(`Answer: ${answer.answer}`);
                doc.moveDown();
            });

            if (response.openEndedResponse) {
                doc.fontSize(12).text('Open-ended Response:');
                doc.fontSize(10).text(response.openEndedResponse);
                doc.moveDown();
            }

            doc.addPage();
        });

        doc.end();

        doc.on('data', (data) => {
            pdfBuffer.push(data);
        });

        doc.on('end', () => {
            const pdfData = Buffer.concat(pdfBuffer);
            resolve(pdfData);
        });

        doc.on('error', (err) => {
            reject(err);
        });
    });
};
