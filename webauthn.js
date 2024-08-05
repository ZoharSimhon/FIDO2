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
        challenge: new Uint8Array(32), // Random challenge
        pubKeyCredParams: [
            { type: "public-key", alg: -7 }, // ES256
        ],
        timeout: 60000,
        authenticatorSelection: {
            authenticatorAttachment: "platform",
            requireResidentKey: true,
            userVerification: "required",
        },
        attestation: "direct",
    };

    try {
        const credential = await navigator.credentials.create({ publicKey });
        console.log('Credential created:', credential);

        // Save the credential in localStorage for this example
        localStorage.setItem('webauthn-credential', JSON.stringify(credential));
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

    const publicKey = {
        challenge: new Uint8Array(32), // Random challenge
        allowCredentials: [
            {
                type: 'public-key',
                id: new Uint8Array(JSON.parse(credentialData).rawId),
            }
        ],
        timeout: 60000,
        userVerification: 'required',
    };

    try {
        const assertion = await navigator.credentials.get({ publicKey });
        console.log('Assertion received:', assertion);

        // Simulate successful login
        localStorage.setItem('role', 'student'); // Adjust role as needed
        window.location.href = 'mark-attendance.html';
    } catch (error) {
        console.error('Error during authentication:', error);
    }
}
