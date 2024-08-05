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
