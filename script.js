const users = {
    lecturer: { password: 'lecturer', role: 'lecturer' },
    student1: { password: 'student1', role: 'student' },
    student2: { password: 'student2', role: 'student' },
    student3: { password: 'student3', role: 'student' }
};

// This object will store the attendance data
let attendanceData = loadAttendanceData();

function loadAttendanceData() {
    const data = localStorage.getItem('attendanceData');
    return data ? JSON.parse(data) : {};
}

function saveAttendanceData() {
    localStorage.setItem('attendanceData', JSON.stringify(attendanceData));
}

function viewAttendance() {
    const time = document.getElementById('lecture-time').value;
    if (!time) {
        alert('Please select a lecture time.');
        return;
    }

    const attendanceList = document.getElementById('attendance-list');
    attendanceList.innerHTML = '';

    if (attendanceData[time]) {
        attendanceData[time].forEach(student => {
            const li = document.createElement('li');
            li.textContent = student;
            attendanceList.appendChild(li);
        });
    } else {
        const li = document.createElement('li');
        li.textContent = 'No attendance recorded.';
        attendanceList.appendChild(li);
    }

    document.getElementById('selection').style.display = 'none';
    document.getElementById('attendance').style.display = 'block';
}

function markAttendance() {
    const time = document.getElementById('mark-time').value;
    const username = localStorage.getItem('username');

    if (!time) {
        alert('Please select a lecture time.');
        return;
    }

    if (!attendanceData[time]) {
        attendanceData[time] = [];
    }

    if (attendanceData[time].includes(username)) {
        alert('You have already marked attendance for this time.');
        return;
    }

    attendanceData[time].push(username);
    saveAttendanceData();
    alert('Attendance marked successfully!');
}

function displayUsername() {
    // Get the username from local storage
    var username = localStorage.getItem('username');
    
    // Check if username exists in local storage
    if (username) {
        // Update the content of the <h2> element with the username
        document.getElementById('welcome-message').textContent = `Hello, ${username}`;
    }
}

