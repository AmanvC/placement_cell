const Student = require('../models/Student');
const Result = require('../models/Result');
const Interview = require('../models/Interview');

module.exports.modifyInterview = async function(req, res){
    const result = await Result.findOne({interview: req.params.id}).populate('students.student');
    const allStudents = await Student.find();
    let registeredStudents;
    let unregisteredStudents = [];
    if(result.students){
        registeredStudents = result.students.map(x => x.student);
        allStudents.forEach(student => {
            const position = registeredStudents.map(elem => elem.id).indexOf(student.id)
            if(position === -1){
                unregisteredStudents.push(student);
            }
        });
    }
    const interview = await Interview.findById(req.params.id);
    return res.render('interview', {
        interview: interview,
        registeredStudents: result.students,
        unregisteredStudents: unregisteredStudents
    });
}

module.exports.update = async function(req, res){
    const result = await Result.findOne({interview: req.body.interview});
    if(typeof(req.body.student) === 'string'){
        result.students.push({student: req.body.student});
    }else{
        req.body.student.forEach(stu => {
            result.students.push({student: stu});
        })
    }
    result.save();
    return res.redirect('back');
}

module.exports.updateRegistered = async function(req, res){
    console.log(req.body);
    return res.redirect('back');
}