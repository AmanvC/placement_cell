const Student = require('../models/Student');
const Interview = require('../models/Interview');
const Result = require('../models/Result');
const ObjectsToCsv = require('objects-to-csv');
const fs = require('fs');

// Render dashboard page
module.exports.dashboard = async function(req, res){
    const students = await Student.find({});
    const interviews = await Interview.find({}).sort('date_of_visit');
    interviews.forEach(interview => {
        interview.company = interview.company.charAt(0) + interview.company.slice(1).toLowerCase();
        interview.date_of_visit = interview.date_of_visit.toLocaleDateString();
    })
    return res.render('dashboard', {
        students: students,
        interviews: interviews
    });
}

// Create a Student
module.exports.createStudent = async function(req, res){
    const student = await Student.findOne({email: req.body.email});
    if(student){
        console.log('Student already exists!');
        return res.redirect('back');
    }
    const data = req.body;
    Student.create({
        email: data.email,
        name: data.name,
        batch: data.batch,
        college: data.college,
        scores: {
            dsa: data.dsa,
            webd: data.webd,
            react: data.react
        }

    }, function(err, student){
        if(err){
            console.log(`Error in creating student: ${err}`);
        }
        return res.redirect('back');
    })
}

// Create an Interview
module.exports.createInterview = async function(req, res){
    console.log(req.body);
    const formData = {
        company: req.body.company.toUpperCase(),
        date_of_visit: req.body.date_of_visit
    }
    const interview = await Interview.findOne(formData);
    console.log(interview);
    if(interview){
        console.log(`Interview is already scheduled for ${req.body.company} on ${req.body.date_of_visit}!`);
        return res.redirect('back');
    }
    Interview.create(formData, function(err, interview){
        if(err){
            console.log(`Error in creating an interview: ${err}`);
            return res.redirect('back');
        }
        Result.create({interview: interview}, function(err, result){
            if(err){
                console.log(`Error in creating a result while creating an interview: ${err}`);
            }
        })
        return res.redirect('back');
    })
}

// Download Report
module.exports.downloadReport = async function(req, res){
   const results = await Result.find({})
    .populate('interview')
    .populate('students.student');

    // console.log(results[2].students[1].student.name);
    const data = [];

    results.map(result => {
        result.students.map(student => {
            const studentDetails = {
                "Email": student.student.email,
                "Name": student.student.name,
                "College": student.student.college,
                "Status": student.student.status,
                "DSA Final Score": student.student.scores.dsa,
                "Web Development Final Score": student.student.scores.webd,
                "React Final Score": student.student.scores.react,
                "Interview Company": result.interview.company,
                "Interview Date": result.interview.date_of_visit.toLocaleDateString(),
                "Interview Result": student.result
            }
            data.push(studentDetails);
        })
    })
    const csv = new ObjectsToCsv(data);

    // Save to file:
    await csv.toDisk('./report.csv');
    
    // Return the CSV file as string:
    // console.log(await csv.toString());

    return res.download("./report.csv", () => {
        fs.unlinkSync('./report.csv')
    });
}