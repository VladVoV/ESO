const EvaluationResponse = require('../models/EvaluationResponse');
const Teacher = require('../models/Teacher');
const Department = require('../models/Department');

exports.getEvaluationStats = async () => {
    const stats = {};

    // Overall evaluation statistics
    stats.totalResponses = await EvaluationResponse.countDocuments();

    // Statistics by teacher
    stats.teacherStats = await Teacher.aggregate([
        {
            $lookup: {
                from: 'evaluationresponses',
                localField: '_id',
                foreignField: 'teacher',
                as: 'evaluations',
            },
        },
        {
            $project: {
                name: 1,
                department: 1,
                evaluationCount: {$size: '$evaluations'},
                averageRating: {
                    $avg: {
                        $sum: {
                            $map: {
                                input: '$evaluations',
                                as: 'evaluation',
                                in: {
                                    $avg: {
                                        $map: {
                                            input: '$$evaluation.answers',
                                            as: 'answer',
                                            in: '$$answer.answer',
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
    ]);

    // Statistics by department
    stats.departmentStats = await Department.aggregate([
        {
            $lookup: {
                from: 'teachers',
                localField: '_id',
                foreignField: 'department',
                as: 'teachers',
            },
        },
        {
            $project: {
                name: 1,
                teacherCount: {$size: '$teachers'},
                averageRating: {
                    $avg: {
                        $map: {
                            input: '$teachers',
                            as: 'teacher',
                            in: {
                                $avg: {
                                    $map: {
                                        input: '$$teacher.evaluations',
                                        as: 'evaluation',
                                        in: {
                                            $avg: {
                                                $map: {
                                                    input: '$$evaluation.answers',
                                                    as: 'answer',
                                                    in: '$$answer.answer',
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
    ]);

    return stats;
};
