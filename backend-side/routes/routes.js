const departmentController = require('../controllers/departmentController');
const teacherController = require('../controllers/teacherController');
const groupController = require('../controllers/groupController');
const questionController = require('../controllers/questionController');
const evaluationController = require('../controllers/evaluationController');
const authJwt = require("../middleware/authJwt");


module.exports = function(app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "Origin, Content-Type, Accept, Authorization"
        );
        next();
    });
    app.use("/departments", authJwt.verifyToken)
    app.get('/departments', departmentController.getAllDepartments);
    app.post('/departments', departmentController.createDepartment);
    app.put('/departments/:id', departmentController.updateDepartment);
    app.delete('/departments/:id', departmentController.deleteDepartment);

// Teacher Routes
    app.use("/teachers", authJwt.verifyToken)
    app.get('/teachers', teacherController.getAllTeachers);
    app.get('/teachers/:id', teacherController.getTeacherById);
    app.post('/teachers', teacherController.createTeacher);
    app.put('/teachers/:id', teacherController.updateTeacher);
    app.delete('/teachers/:id', teacherController.deleteTeacher);
    app.get('/teachers/suggestions', teacherController.getTeacherSuggestions);

// Group Routes
//     app.use("/groups", authJwt.verifyToken)
    app.get('/groups', groupController.getAllGroups, authJwt.verifyToken);
    app.post('/groups', groupController.createGroup, authJwt.verifyToken);
    app.put('/groups/:id', groupController.updateGroup, authJwt.verifyToken);
    app.delete('/groups/:id', groupController.deleteGroup, authJwt.verifyToken);
    app.post('/groups/teachers', groupController.getTeachersForGroup);

// Question Routes
//     app.use("/questions", authJwt.verifyToken)
    app.get('/questions', questionController.getAllQuestions);
    app.post('/questions', questionController.createQuestion, authJwt.verifyToken);
    app.put('/questions/:id', questionController.updateQuestion, authJwt.verifyToken);
    app.delete('/questions/:id', questionController.deleteQuestion, authJwt.verifyToken);

// Evaluation Routes
//     app.use("/evaluations", authJwt.verifyToken)
    app.get("/evaluations", evaluationController.getAllEvaluationResults)
    app.post('/evaluations', evaluationController.submitEvaluation);
    app.get('/evaluations/status/:teacherId', evaluationController.getEvaluationStatus)
    app.get('/evaluations/pdf/:teacherId', evaluationController.generateEvaluationPDF, authJwt.verifyToken);
    app.get('/evaluations/stats', evaluationController.getEvaluationStats, authJwt.verifyToken);
}

