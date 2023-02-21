const createStudent = document.getElementById('create-student-container');

document.getElementById('add-student').addEventListener('click', () => {
    createStudent.style.display = 'flex';
})

document.getElementById('close-student').addEventListener('click', () => {
    createStudent.style.display = 'none';
})


const createInterview = document.getElementById('create-interview-container');

document.getElementById('add-interview').addEventListener('click', () => {
    createInterview.style.display = 'flex';
})

document.getElementById('close-interview').addEventListener('click', () => {
    createInterview.style.display = 'none';
})