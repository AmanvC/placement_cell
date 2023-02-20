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
    const formData = req.body;
    const keys = Object.keys(formData).splice(1);
    const newData = keys.map(key => {
        return {
            student: key,
            result: formData[key]
        }
    });
    await Result.findOneAndUpdate({interview: formData.interviewID}, {students: newData});
    const newResult = await Result.findOne({interview: formData.interviewID});
    let placed = [];
    newResult.students.forEach(student => {
        if(student.result == 'Pass'){
            placed.push(student.student);
        }
    })
    
    placed.map(student => {
        changePlacedStatus(student);
    })

    return res.redirect('back');
}

async function changePlacedStatus(student){
    await Student.findByIdAndUpdate(student, {status: "Placed"});
}
