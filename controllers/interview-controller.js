const Student = require('../models/Student');
const Result = require('../models/Result');
const Interview = require('../models/Interview');

// Render Interview Page for a company
module.exports.modifyInterview = async function(req, res){
    const result = await Result.findOne({interview: req.params.id}).populate('students.student');
    //get all students
    const allStudents = await Student.find();
    let registeredStudents;
    let unregisteredStudents = [];
    if(result.students){
        //get all registered students for a that particular interview
        registeredStudents = result.students.map(x => x.student);
        allStudents.forEach(student => {
            //get all unregistered students for that interview
            const position = registeredStudents.map(elem => elem.id).indexOf(student.id)
            if(position === -1){
                unregisteredStudents.push(student);
            }
        });
    }
    //get interview detail
    const interview = await Interview.findById(req.params.id);
    interview.company = interview.company.charAt(0) + interview.company.slice(1).toLowerCase();
    return res.render('interview', {
        //render interview with interview details, registered and unregistered students
        interview: interview,
        registeredStudents: result.students,
        unregisteredStudents: unregisteredStudents
    });
}

//update an interview with students (add new students to the interview)
module.exports.update = async function(req, res){
    try{
        //if no students selected
        if(!req.body.student){
            req.flash('error', 'Please select atleast one student to Register.')
            return res.redirect('back');
        }
        //find result with interview id
        const result = await Result.findOne({interview: req.body.interview});
        //add selected students to the interview
        if(typeof(req.body.student) === 'string'){
            result.students.push({student: req.body.student});
        }else{
            req.body.student.forEach(stu => {
                result.students.push({student: stu});
            })
        }
        result.save();
        req.flash('success', 'Selected students added to the interview.')
        return res.redirect('back');
    }catch(err){
        req.flash('error', 'Something went wrong!');
        return res.redirect('back');
    }
}

//update status of registered students
module.exports.updateRegistered = async function(req, res){
    try{
        const formData = req.body;
        const keys = Object.keys(formData).splice(1);
        const newData = keys.map(key => {
            return {
                student: key,
                result: formData[key]
            }
        });
        //find the result and update with new status of students
        await Result.findOneAndUpdate({interview: formData.interviewID}, {students: newData});
        const newResult = await Result.findOne({interview: formData.interviewID});
        let placed = [];
        newResult.students.forEach(student => {
            if(student.result == 'Pass'){
                placed.push(student.student);
            }
        })
        
        //if student is placed, update its status in profile
        placed.map(student => {
            changePlacedStatus(student);
        })
        req.flash('success', 'Updated student results successfully.')
        return res.redirect('back');
    }catch(err){
        req.flash('error', 'Something went wrong!')
        return res.redirect('back');
    }
}

//update placed status
async function changePlacedStatus(student){
    await Student.findByIdAndUpdate(student, {status: "Placed"});
}
