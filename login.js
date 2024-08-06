document.getElementById('login-form').addEventListener('submit', function (event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (username in users && password === users[username].password) {
        localStorage.setItem('role', users[username].role);
        localStorage.setItem('username', username);
        window.location.href = users[username].role === 'student' ? 'mark-attendance.html' : 'view-attendance.html';
    } else {
        document.getElementById('error-message').style.display = 'block';
    }
});

function checkLogin() {
    const username = localStorage.getItem('username');
    const role = localStorage.getItem('role');

    if (username) {
        // Show fingerprint buttons if logged in
        document.getElementById('register-fingerprint').style.display = 'inline-block';
        document.getElementById('login-fingerprint').style.display = 'inline-block';
    }
}

async function register() {
    const username = localStorage.getItem('username');
    if (!username) {
        alert('You must be logged in to register a fingerprint.');
        return;
    }

    const publicKey = {
        rp: {
            name: "Example App",
        },
        user: {
            id: new Uint8Array(16), // Random ID for the user
            name: username,
            displayName: username,
        },
        challenge: new Uint8Array([0x05]), // Random challenge
        pubKeyCredParams: [
            { type: "public-key", alg: -7 }, // ES256
        ],
        timeout: 60000,
        authenticatorSelection: {
            authenticatorAttachment: "platform",
            requireResidentKey: false,
            userVerification: "preferred",
        },
        attestation: "direct",
    };

    const credential = await navigator.credentials.create({ publicKey });
    console.log('Credential created:', credential);

    localStorage.setItem('webauthn-credential', JSON.stringify(credential));
    alert('Registration successful!');
}

async function loginWithFingerprint() {
    const username = document.getElementById('username').value;

    if (!username) {
        alert('You must enter username.');
        return;
    }
    
    if(!(username in users)){
        alert('This user name does not exist.');
        return;
    }

    const publicKey = {
        challenge: new Uint8Array([0x05]), // Random challenge
        allowCredentials: [
            {
                type: 'public-key',
                id: new Uint8Array(JSON.parse(localStorage.getItem('webauthn-credential')).rawId),
            }
        ],
        timeout: 60000,
        userVerification: 'preferred',
    };
    
    localStorage.setItem('role', users[username].role);
    localStorage.setItem('username', username);
    window.location.href = users[username].role === 'student' ? 'mark-attendance.html' : 'view-attendance.html';
    
    const assertion = await navigator.credentials.get({ publicKey });
    console.log('Assertion received:', assertion);


    alert('Login successful!');

}
