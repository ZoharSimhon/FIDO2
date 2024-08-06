async function registerFingerprint() {
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
        challenge: generateChallenge(), // Random challenge
        pubKeyCredParams: [
            { type: "public-key", alg: -7 }, // ES256
        ],
        timeout: 60000,
        authenticatorSelection: {
            authenticatorAttachment: "platform",
            requireResidentKey: false,
            userVerification: "required",
        },
        attestation: "direct",
    };

    try {
        const credential = await navigator.credentials.create({ publicKey });
        console.log('Credential created:', credential);

        // Convert rawId to base64 for storage
        const rawIdBase64 = btoa(String.fromCharCode(...new Uint8Array(credential.rawId)));

        // Save the credential in localStorage
        localStorage.setItem('webauthn-credential', JSON.stringify({
            id: rawIdBase64,
            type: credential.type,
            rawId: rawIdBase64, // Store rawId in base64
            response: {
                attestationObject: btoa(String.fromCharCode(...new Uint8Array(credential.response.attestationObject))),
                clientDataJSON: btoa(String.fromCharCode(...new Uint8Array(credential.response.clientDataJSON))),
            }
        }));
        alert('Fingerprint registered successfully!');
    } catch (error) {
        console.error('Error during registration:', error);
    }
}

async function loginWithFingerprint() {
    const credentialData = localStorage.getItem('webauthn-credential');
    if (!credentialData) {
        alert('No fingerprint registered. Please register first.');
        return;
    }

    const username = document.getElementById('username').value;

    if (!username) {
        alert('You must enter username.');
        return;
    }
    
    if(!username in users){
        alert('This user name does not exist.');
        return;
    }

    const { id: rawIdBase64 } = JSON.parse(credentialData);

    // Convert base64 rawId to Uint8Array
    const rawId = new Uint8Array(atob(rawIdBase64).split('').map(char => char.charCodeAt(0)));

    const publicKey = {
        challenge: generateChallenge(), // Random challenge
        allowCredentials: [
            {
                type: 'public-key',
                id: rawId,
            }
        ],
        timeout: 60000,
        userVerification: 'required',
    };

    try {
        const assertion = await navigator.credentials.get({ publicKey });
        console.log('Assertion received:', assertion);

        localStorage.setItem('role', users[username].role);
        localStorage.setItem('username', username);
        window.location.href = users[username].role === 'student' ? 'mark-attendance.html' : 'view-attendance.html';

    } catch (error) {
        console.error('Error during authentication:', error);
    }
}

// Utility function to generate a random challenge
function generateChallenge(size = 32) {
    const challenge = new Uint8Array(size);
    window.crypto.getRandomValues(challenge);
    return challenge;
}
