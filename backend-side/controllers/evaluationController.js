const EvaluationResponse = require('../models/EvaluationResponse');
const _ = require("lodash");
const PDFDocument = require('pdfkit');
const rgb = require('pdfkit')
const fs = require('fs');
const path = require('path');

exports.submitEvaluation = async (req, res) => {
    const { teacherId, answers, openEndedResponse } = req.body;
    const ipAddress = req.ip;

    try {
        const existingResponse = await EvaluationResponse.findOne({ teacher: teacherId, ipAddress });
        if (existingResponse) {
            return res.status(400).json({ message: 'You have already submitted an evaluation for this teacher.' });
        }

        const newEvaluationResponse = new EvaluationResponse({
            teacher: teacherId,
            answers,
            openEndedResponse,
            ipAddress
        });

        const savedEvaluationResponse = await newEvaluationResponse.save();
        res.status(201).json(savedEvaluationResponse);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.getEvaluationResults = async (req, res) => {
    const { teacherId } = req.params;
    console.log(1)
    try {
        const evaluationResponses = await EvaluationResponse.find({ teacher: teacherId })
            .populate('teacher')
            .populate('answers.question')
        res.json(evaluationResponses);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getAllEvaluationResults = async (req, res) => {
    try {
        const evaluationResponses = await EvaluationResponse.find().populate('teacher').populate('answers.question');
        res.json(evaluationResponses);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getEvaluationStatus = async (req, res) => {
    const { teacherId } = req.params;
    const ipAddress = req.ip;

    try {
        const existingResponse = await EvaluationResponse.findOne({ teacher: teacherId, ipAddress });
        res.json({ hasSubmitted });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


// exports.generateEvaluationPDF = async (req, res) => {
//     const { teacherId } = req.params;
//
//     try {
//         const evaluationResponses = await EvaluationResponse.find({ teacher: teacherId })
//             .populate('teacher')
//             .populate('answers.question');
//
//         const teacher = evaluationResponses[0].teacher;
//         const openEndedResponses = evaluationResponses.flatMap((response) => response.openEndedResponse);
//         const answers = {};
//         const questionAnswers = _.groupBy(evaluationResponses.flatMap((response) => response.answers), 'question._id');
//
//         for (const [questionId, questionResponse] of Object.entries(questionAnswers)) {
//             const ratings = questionResponse.map((answer) => Number(answer.answer));
//             const averageRating = ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;
//             answers[questionId] = {
//                 questionText: questionResponse[0].question.text,
//                 averageRating: averageRating,
//             };
//         }
//
//         const doc = new PDFDocument({ deflateLevel: 9 });
//         const fontPath = path.join(__dirname, 'fonts', 'arial.ttf');
//         doc.font(fontPath);
//
//         res.setHeader('Content-Type', 'application/pdf');
//         res.setHeader('Content-Disposition', `attachment; filename=teacher_${teacher._id}_stats.pdf`);
//         doc.pipe(res);
//
//         doc.fontSize(18).text(teacher.name);
//         doc.moveDown();
//         doc.fontSize(14).text('Рейтинг:');
//         doc.moveDown();
//
//         for (const [{ questionText, averageRating }] of Object.entries(answers)) {
//             doc.fontSize(12).text(`${questionText} - Середній рейтинг: ${averageRating.toFixed(2)}`);
//             doc.moveDown();
//         }
//
//         doc.moveDown();
//         doc.fontSize(14).text('Відкрита відповідь:');
//         doc.moveDown();
//
//         openEndedResponses.forEach((response) => {
//             doc.fontSize(12).text(response);
//             doc.moveDown();
//         });
//
//         doc.end();
//     } catch (err) {
//         console.error('Error generating PDF:', err);
//         res.status(500).json({ message: err.message });
//     }
// };

exports.generateEvaluationPDF = async (req, res) => {
    const { teacherId } = req.params;
    try {
        const evaluationResponses = await EvaluationResponse.find({ teacher: teacherId })
            .populate('teacher')
            .populate('answers.question');
        if (!evaluationResponses.length) {
            return res.status(404).json({ message: 'No evaluation responses found for this teacher.' });
        }

        const teacher = evaluationResponses[0].teacher;
        const openEndedResponses = evaluationResponses.flatMap((response) => response.openEndedResponse);
        const answers = {};
        const questionAnswers = _.groupBy(evaluationResponses.flatMap((response) => response.answers), 'question._id');

        for (const [questionId, questionResponse] of Object.entries(questionAnswers)) {
            const ratings = questionResponse.map((answer) => Number(answer.answer));
            const averageRating = ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;
            answers[questionId] = {
                questionText: questionResponse[0].question.text,
                averageRating: averageRating,
            };
        }

        const overallAverageRating = Object.values(answers).reduce((sum, { averageRating }) => sum + averageRating, 0) / Object.keys(answers).length;


        const doc = new PDFDocument({ deflateLevel: 9 });
        const fontPath = path.join(__dirname, 'fonts', 'arial.ttf');
        doc.font(fontPath);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=teacher_${teacher._id}_stats.pdf`);
        doc.pipe(res);

        // Header
        doc.fontSize(18).text(`Викладач ${teacher.name}`, { underline: true });
        doc.moveDown();
        doc.fontSize(18).text(`Дата останнього тестування: ${teacher.createdAt.toLocaleDateString()}`, { underline: true });
        doc.moveDown();

        // Table Header
        doc.fontSize(12).text('Запитання', { continued: true, underline: true });
        doc.text('Середня оцінка', { continued: true, underline: true, align: 'center' });
        doc.text('Всі оцінки', { underline: true, align: 'right' });
        doc.moveDown();

        // Table Rows
        Object.entries(answers).forEach(([questionId, { questionText, averageRating }]) => {
            const ratingDistribution = questionAnswers[questionId].reduce((counts, { answer }) => {
                counts[answer] = (counts[answer] || 0) + 1;
                return counts;
            }, {});
            const allRatings = Object.entries(ratingDistribution)
                .sort((a, b) => Number(a[0]) - Number(b[0]))
                .map(([rating, count]) => `${rating} - ${count}`)
                .join(', ');

            doc.fontSize(10).text(questionText, { continued: true });
            doc.text(averageRating.toFixed(2), { continued: true, align: 'center' });
            doc.text(allRatings, { align: 'right' });
            doc.moveDown();
        });


        doc.moveDown();

        doc.fontSize(14).text(`Загальна середня оцінка - ${overallAverageRating.toFixed(2)}`);
        doc.moveDown();



        // Open-ended responses
        doc.fontSize(14).text('Питання з відкритою відповіддю');
        doc.moveDown();
        openEndedResponses.forEach((response) => {
            doc.fontSize(12).text(response);
            doc.moveDown();
        });

        doc.end();
    } catch (err) {
        console.error('Error generating PDF:', err);
        res.status(500).json({ message: err.message });
    }
};
const getMedian = (values) => {
    const sortedValues = values.sort((a, b) => a - b);
    const length = sortedValues.length;

    if (length % 2 !== 0) {
        return sortedValues[(length - 1) / 2];
    }

    const middleIndex = length / 2;
    return (sortedValues[middleIndex - 1] + sortedValues[middleIndex]) / 2;
};

exports.getEvaluationStats = async (req, res) => {
    try {
        const evaluationResponses = await EvaluationResponse.find()
            .populate('teacher')
            .populate('answers.question');

        const stats = [];
        const teacherResponses = _.groupBy(evaluationResponses, 'teacher._id');

        for (const [teacherId, responses] of Object.entries(teacherResponses)) {
            const teacher = responses[0].teacher;
            const openEndedResponses = responses.flatMap(
                (response) => response.openEndedResponse
            );
            const answers = {};
            const questionAnswers = _.groupBy(
                responses.flatMap((response) => response.answers),
                'question._id'
            );

            for (const [questionId, questionResponse] of Object.entries(questionAnswers)) {
                const ratings = questionResponse.map((answer) => Number(answer.answer));
                const averageRating =
                    ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;
                answers[questionId] = {
                    questionText: questionResponse[0].question.text,
                    averageRating: averageRating,
                };
            }

            const meanScore =
                responses.reduce(
                    (sum, response) =>
                        sum +
                        response.answers.reduce((scoreSum, answer) => scoreSum + Number(answer.answer), 0) /
                        response.answers.length,
                    0
                ) / responses.length;

            const medianScore = getMedian(
                responses.flatMap((response) =>
                    response.answers.map((answer) => Number(answer.answer))
                )
            );

            const numStudents = new Set(responses.map((response) => response.ipAddress)).size;

            stats.push({
                _id: teacherId,
                name: teacher.name,
                createdAt: teacher.createdAt,
                meanScore,
                medianScore,
                openEndedResponses,
                answers,
                numStudents,
            });
        }

        res.json(stats);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};
