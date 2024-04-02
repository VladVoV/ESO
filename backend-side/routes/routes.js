const authRole = require('../middleware/authRole');
const departmentController = require('../controllers/departmentController');
const teacherController = require('../controllers/teacherController');
const groupController = require('../controllers/groupController');
const questionController = require('../controllers/questionController');
const evaluationController = require('../controllers/evaluationController');


module.exports = function(app) {
    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "Origin, Content-Type, Accept"
        );
        next();
    });
    app.get('/departments', departmentController.getAllDepartments);
    app.post('/departments', departmentController.createDepartment);
    app.put('/departments/:id', departmentController.updateDepartment);
    app.delete('/departments/:id', departmentController.deleteDepartment);

// Teacher Routes
    app.get('/teachers', teacherController.getAllTeachers);
    app.post('/teachers', teacherController.createTeacher);
    app.put('/teachers/:id', teacherController.updateTeacher);
    app.delete('/teachers/:id', teacherController.deleteTeacher);

// Group Routes
    app.get('/groups', groupController.getAllGroups);
    app.post('/groups', groupController.createGroup);
    app.put('/groups/:id', groupController.updateGroup);
    app.delete('/groups/:id', groupController.deleteGroup);
    app.post('/groups/:id/teachers', groupController.assignTeachersToGroup);

// Question Routes
    app.get('/questions', questionController.getAllQuestions);
    app.post('/questions', questionController.createQuestion);
    app.put('/questions/:id', questionController.updateQuestion);
    app.delete('/questions/:id', questionController.deleteQuestion);

// Evaluation Routes
    app.post('/evaluations', evaluationController.submitEvaluation);
    app.get('/evaluations/:teacherId', evaluationController.getEvaluationResults);
    app.get('/evaluations/pdf/:teacherId', evaluationController.generateEvaluationPDF);
    app.get('/evaluations/stats', evaluationController.getEvaluationStats);


//     app.get('/departments', authRole('admin'), departmentController.getAllDepartments);
//     app.post('/departments', authRole('admin'), departmentController.createDepartment);
//     app.put('/departments/:id', authRole('admin'), departmentController.updateDepartment);
//     app.delete('/departments/:id', authRole('admin'), departmentController.deleteDepartment);
//
// // Teacher Routes
//     app.get('/teachers', authRole('admin', 'student'), teacherController.getAllTeachers);
//     app.post('/teachers', authRole('admin'), teacherController.createTeacher);
//     app.put('/teachers/:id', authRole('admin'), teacherController.updateTeacher);
//     app.delete('/teachers/:id', authRole('admin'), teacherController.deleteTeacher);
//
// // Group Routes
//     app.get('/groups', authRole('admin'), groupController.getAllGroups);
//     app.post('/groups', authRole('admin'), groupController.createGroup);
//     app.put('/groups/:id', authRole('admin'), groupController.updateGroup);
//     app.delete('/groups/:id', authRole('admin'), groupController.deleteGroup);
//     app.post('/groups/:id/teachers', authRole('admin'), groupController.assignTeachersToGroup);
//
// // Question Routes
//     app.get('/questions', authRole('admin'), questionController.getAllQuestions);
//     app.post('/questions', authRole('admin'), questionController.createQuestion);
//     app.put('/questions/:id', authRole('admin'), questionController.updateQuestion);
//     app.delete('/questions/:id', authRole('admin'), questionController.deleteQuestion);
//
// // Evaluation Routes
//     app.post('/evaluations', authRole('student'), evaluationController.submitEvaluation);
//     app.get('/evaluations/:teacherId', authRole('admin'), evaluationController.getEvaluationResults);
//     app.get('/evaluations/pdf/:teacherId', authRole('admin'), evaluationController.generateEvaluationPDF);
//     app.get('/evaluations/stats', authRole('admin'), evaluationController.getEvaluationStats);
}
// Department Routes

