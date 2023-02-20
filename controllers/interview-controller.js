const Student = require('../models/Student');
const Result = require('../models/Result');

module.exports.modifyInterview = async function(req, res){
    console.log(req.params.id);
    const result = await Result.find({interview: req.params.id}).populate('students.student');
    const allStudents = await Student.find();
    if(result.students){
        var registeredStudents = result.students;
        var unregisteredStudents = allStudents.filter(student => {
            registeredStudents.student.indexOf(student) === -1
        });
    }
    return res.render('interview', {
        interview: req.params.id,
        registeredStudents: registeredStudents,
        unregisteredStudents: unregisteredStudents ? unregisteredStudents : allStudents
    });
}

module.exports.update = function(req, res){
    console.log(req.body);
    return res.redirect('back');
}