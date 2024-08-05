async function registerFingerprint() {
    const username = document.getElementById('username').value;
    if (!username) {
        alert('Please enter a username to register fingerprint.');
        return;
    }

    const publicKey = {
        rp: {
            name: "Example App",
        },
        user: {
            id: new Uint8Array(16), // Generate a unique ID for the user
            name: username,
            displayName: username,
        },
        challenge: new Uint8Array(32), // Generate a random challenge
        pubKeyCredParams: [
            { type: "public-key", alg: -7 }, // ES256
        ],
        timeout: 60000,
        authenticatorSelection: {
            authenticatorAttachment: "platform", // Platform authenticators (like built-in fingerprint readers)
            requireResidentKey: false, // Not requiring a resident key
            userVerification: "required", // Require user verification (such as biometrics)
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

    const credential = JSON.parse(credentialData);

    const publicKey = {
        challenge: new Uint8Array(32), // Generate a random challenge
        allowCredentials: [
            {
                type: 'public-key',
                id: new Uint8Array(credential.rawId), // Use the ID from the stored credential
            }
        ],
        timeout: 60000,
        userVerification: 'required',
    };

    try {
        const assertion = await navigator.credentials.get({ publicKey });
        console.log('Assertion received:', assertion);

        // Validate the assertion and simulate successful login
        localStorage.setItem('role', 'student'); // Adjust role as needed
        window.location.href = 'mark-attendance.html';
    } catch (error) {
        console.error('Error during authentication:', error);
    }
}
