function checkLogin() {
    const role = localStorage.getItem('role');
    const path = window.location.pathname;

    if (role === 'student' && path.includes('view-attendance.html')) {
        window.location.href = 'mark-attendance.html';
    } else if (role === 'lecturer' && path.includes('mark-attendance.html')) {
        window.location.href = 'view-attendance.html';
    }
}

function logout() {
    localStorage.removeItem('role');
    localStorage.removeItem('username');
    window.location.href = 'index.html';
}
