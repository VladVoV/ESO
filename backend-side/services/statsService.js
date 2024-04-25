const EvaluationResponse = require('../models/EvaluationResponse');
const _ = require('lodash');
// const Teacher = require('../models/Teacher');
// const Department = require('../models/Department');
//
// exports.getEvaluationStats = async () => {
//     const stats = {};
//
//     // Overall evaluation statistics
//     stats.totalResponses = await EvaluationResponse.countDocuments();
//
//     // Statistics by teacher
//     stats.teacherStats = await Teacher.aggregate([
//         {
//             $lookup: {
//                 from: 'evaluationresponses',
//                 localField: '_id',
//                 foreignField: 'teacher',
//                 as: 'evaluations',
//             },
//         },
//         {
//             $project: {
//                 name: 1,
//                 department: 1,
//                 evaluationCount: {$size: '$evaluations'},
//                 averageRating: {
//                     $avg: {
//                         $sum: {
//                             $map: {
//                                 input: '$evaluations',
//                                 as: 'evaluation',
//                                 in: {
//                                     $avg: {
//                                         $map: {
//                                             input: '$$evaluation.answers',
//                                             as: 'answer',
//                                             in: '$$answer.answer',
//                                         },
//                                     },
//                                 },
//                             },
//                         },
//                     },
//                 },
//             },
//         },
//     ]);
//
//     // Statistics by department
//     stats.departmentStats = await Department.aggregate([
//         {
//             $lookup: {
//                 from: 'teachers',
//                 localField: '_id',
//                 foreignField: 'department',
//                 as: 'teachers',
//             },
//         },
//         {
//             $project: {
//                 name: 1,
//                 teacherCount: {$size: '$teachers'},
//                 averageRating: {
//                     $avg: {
//                         $map: {
//                             input: '$teachers',
//                             as: 'teacher',
//                             in: {
//                                 $avg: {
//                                     $map: {
//                                         input: '$$teacher.evaluations',
//                                         as: 'evaluation',
//                                         in: {
//                                             $avg: {
//                                                 $map: {
//                                                     input: '$$evaluation.answers',
//                                                     as: 'answer',
//                                                     in: '$$answer.answer',
//                                                 },
//                                             },
//                                         },
//                                     },
//                                 },
//                             },
//                         },
//                     },
//                 },
//             },
//         },
//     ]);
//
//     return stats;
// };

// const EvaluationResponse = require('../models/EvaluationResponse');
//
// exports.getEvaluationStats = async () => {
//     try {
//         const evaluationResponses = await EvaluationResponse.find()
//             .populate('teacher')
//             .populate('answers.question');
//
//         const teacherStats = {};
//
//         evaluationResponses.forEach((response) => {
//             const teacherId = response.teacher._id;
//             const teacherName = response.teacher.name;
//
//             if (!teacherStats[teacherId]) {
//                 teacherStats[teacherId] = {
//                     name: teacherName,
//                     meanScore: 0,
//                     openEndedResponses: [],
//                     answers: {},
//                 };
//             }
//
//             const answerSum = response.answers.reduce((sum, answer) => {
//                 const questionId = answer.question._id.toString();
//                 const answerValue = Array.isArray(answer.answer)
//                     ? answer.answer.reduce((a, b) => a + b, 0)
//                     : answer.answer;
//
//                 if (!teacherStats[teacherId].answers[questionId]) {
//                     teacherStats[teacherId].answers[questionId] = [];
//                 }
//
//                 teacherStats[teacherId].answers[questionId].push(answerValue);
//                 return sum + answerValue;
//             }, 0);
//
//             const meanScore = answerSum / response.answers.length;
//             teacherStats[teacherId].meanScore += meanScore;
//
//             if (response.openEndedResponse) {
//                 teacherStats[teacherId].openEndedResponses.push(response.openEndedResponse);
//             }
//         });
//
//         return Object.values(teacherStats);
//     } catch (err) {
//         console.error('Error fetching evaluation statistics:', err);
//         throw err;
//     }
// };


// const getMedian = (values) => {
//     // Sort the values in ascending order
//     const sortedValues = values.sort((a, b) => a - b);
//     const length = sortedValues.length;
//
//     // If the length is odd, return the middle value
//     if (length % 2 !== 0) {
//         return sortedValues[(length - 1) / 2];
//     }
//
//     // If the length is even, return the average of the two middle values
//     const middleIndex = length / 2;
//     return (sortedValues[middleIndex - 1] + sortedValues[middleIndex]) / 2;
// };
//
// exports.getEvaluationStats = async () => {
//     const evaluationResponses = await EvaluationResponse.find()
//         .populate('teacher')
//         .populate('answers.question');
//     const stats = [];
//
//     // Group responses by teacher
//     const teacherResponses = _.groupBy(evaluationResponses, 'teacher._id');
//
//     for (const [teacherId, responses] of Object.entries(teacherResponses)) {
//         const teacher = responses[0].teacher;
//         const openEndedResponses = responses.flatMap(
//             (response) => response.openEndedResponse
//         );
//         const answers = {};
//
//         // Group answers by question
//         const questionAnswers = _.groupBy(
//             responses.flatMap((response) => response.answers),
//             'question._id'
//         );
//
//         for (const [questionId, questionResponse] of Object.entries(questionAnswers)) {
//             answers[questionId] = questionResponse.map((answer) => answer.answer);
//         }
//
//         const meanScore = responses.reduce(
//             (sum, response) =>
//                 sum +
//                 response.answers.reduce((scoreSum, answer) => scoreSum + answer.answer, 0) /
//                 response.answers.length,
//             0
//         ) / responses.length;
//
//         const medianScore = getMedian(
//             responses.flatMap((response) =>
//                 response.answers.map((answer) => answer.answer)
//             )
//         );
//
//         stats.push({
//             _id: teacherId,
//             name: teacher.name,
//             meanScore,
//             medianScore,
//             openEndedResponses,
//             answers,
//         });
//     }
//     return stats;
// };
