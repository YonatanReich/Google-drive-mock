import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FcCheckmark } from "react-icons/fc";


function Signup({ setToken, setUser }) {
    // Refs for form data
    const firstNameRef = useRef();
    const lastNameRef = useRef();
    const usernameRef = useRef();
    const emailRef = useRef();
    const passwordRef = useRef();
    const confirmPasswordRef = useRef();
    const phoneRef = useRef();
    const dateOfBirthRef = useRef();
    // const imageRef = useRef(); // Keeping as URL input based on your code
    const [profileImageBase64, setProfileImageBase64] = useState(null);

    const [error, setError] = useState('');
    const [passwordsMatch, setPasswordsMatch] = useState(null); // null, true, or false
    const [usernameValid, setUsernameValid] = useState(null);
    const [emailValid, setEmailValid] = useState(null);
    const [passwordValid, setPasswordValid] = useState(null);
    const [phoneValid, setPhoneValid] = useState(null);
    const [firstNameValid, setFirstNameValid] = useState(null);
    const [lastNameValid, setLastNameValid] = useState(null);
    const [dateOfBirthValid, setDateOfBirthValid] = useState(null);
    const navigate = useNavigate();


    // Reusable styles to remove clutter
    const commonInputClass = "form-control form-control-lg bg-transparent text-white border-secondary fs-6";



    const convertImageToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    };

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            try {
                const base64 = await convertImageToBase64(file);
                setProfileImageBase64(base64);
            } catch (error) {
                console.error('Error converting image to base64:', error);
            }
        }
    };

    //Validations
    const handlePasswordChange = () => {
        const pass = passwordRef.current.value;
        const confirm = confirmPasswordRef.current.value;
        const regex = /^(?=.*[a-zA-Z])(?=.*\d).+$/;
        if (!pass) {
            setPasswordValid(null);
        } else {
            setPasswordValid(pass.length >= 8 && regex.test(pass));
        }
        if (!confirm) {
            setPasswordsMatch(null);
        } else {
            setPasswordsMatch(pass === confirm);
        }
    };
    const handleUsernameChange = () => {
        const val = usernameRef.current.value.trim();
        if (!val) setUsernameValid(null);
        else setUsernameValid(val.length >= 3);
    };

    const handleFirstNameChange = () => {
        const val = firstNameRef.current.value.trim();
        if (!val) setFirstNameValid(null);
        else setFirstNameValid(val.length >= 1);
    };

    const handleLastNameChange = () => {
        const val = lastNameRef.current.value.trim();
        if (!val) setLastNameValid(null);
        else setLastNameValid(val.length >= 1);
    };

    const handleEmailChange = () => {
        const val = emailRef.current.value.trim();
        if (!val) setEmailValid(null);
        else setEmailValid(val.includes('@') && val.includes('.'));
    };

    const handlePhoneChange = () => {
        const val = phoneRef.current.value.trim();
        if (!val) setPhoneValid(null);
        else setPhoneValid(val.length >= 9);
    };

    const handleDateOfBirthChange = () => {
        const val = dateOfBirthRef.current.value.trim();
        if (!val) setDateOfBirthValid(false);
        else setDateOfBirthValid(true);
    };

    const handleSignup = async () => {

        // Gather values directly
        const userFirstName = firstNameRef.current.value.trim();
        const userLastName = lastNameRef.current.value.trim();
        const username = usernameRef.current.value.trim();
        const userEmail = emailRef.current.value.trim();
        const userPassword = passwordRef.current.value;
        const confirmPassword = confirmPasswordRef.current.value;
        const userPhoneNumber = phoneRef.current.value.trim();
        const userDateOfBirth = dateOfBirthRef.current.value;

        if (userPassword.length < 8) {
            setError("Password too short");
            return;
        }
        const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d).+$/;
        if (!passwordRegex.test(userPassword)) {
            setError("Password must include letters and digits");
            return;
        }
        if (userPassword !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        if (username.length < 3) {
            setError("Username must be at least 3 letters long");
            return;
        }

        if (!userEmail.includes('@') || !userEmail.includes('.')) {
            setError("Email address invalid");
            return;
        }

        if (userPhoneNumber.length < 9) {
            setError("Phone number too short");
            return;
        }

        if (!userFirstName) {
            setError("First name is required");
            return;
        }

        if (!userLastName) {
            setError("Last name is required");
            return;
        }

        if (!userDateOfBirth) {
            setError("Date of birth is required");
            return;
        }

        // Send to server (Validation happens there)
        const res = await fetch('http://localhost:3000/api/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userFirstName,
                userLastName,
                username,
                userEmail,
                userPassword,
                userImage: profileImageBase64,
                userDateOfBirth,
                userPhoneNumber
            })
        });

        const data = await res.json();
        if (res.ok) {
            setToken(data.token);
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            setUser(data.user);
            navigate('/files');
        } else {
            setError(data.message);
        }
    };

    return (
        <div className="min-vh-100 d-flex justify-content-center align-items-center" style={{ backgroundColor: '#1A1A1A' }}>

            <div className="card shadow-lg p-4" style={{ width: '1000px', borderRadius: '16px', backgroundColor: '#0F0F0F', color: 'white' }}>
                <div className="row g-0">

                    {/* LEFT COLUMN: Logo & Title */}
                    <div className="col-md-5 d-flex flex-column align-items-start justify-content-start">
                        <img
                            src="/first_logo.png"
                            alt="Logo"
                            style={{ width: '100px', marginBottom: '10px' }}
                        />
                        <h2 className="mb-0 fw-bold">Create an account</h2>
                    </div>

                    {/* RIGHT COLUMN: Inputs */}
                    <div className="col-md-7 ps-md-5">

                        <div className="mb-3">
                            <label className="form-label text-secondary small fw-bold">First Name <span className="text-danger">*</span></label>
                            <input type="text" className={commonInputClass} placeholder="Enter first name" ref={firstNameRef} onChange={handleFirstNameChange} />
                            {firstNameValid === false && <small className="text-danger mt-1 d-block">You must enter a first name!</small>}
                            {firstNameValid === true && <small className="text-success mt-1 d-block"><FcCheckmark /></small>}
                        </div>

                        <div className="mb-3">
                            <label className="form-label text-secondary small fw-bold">Last Name <span className="text-danger">*</span></label>
                            <input type="text" className={commonInputClass} placeholder="Enter last name" ref={lastNameRef} onChange={handleLastNameChange} />
                            {lastNameValid === false && <small className="text-danger mt-1 d-block">You must enter a last name! </small>}
                            {lastNameValid === true && <small className="text-success mt-1 d-block"><FcCheckmark /></small>}
                        </div>

                        <div className="mb-3">
                            <label className="form-label text-secondary small fw-bold">Email <span className="text-danger">*</span></label>
                            <input type="email" className={commonInputClass} placeholder="Enter email" ref={emailRef} onChange={handleEmailChange} />
                            {emailValid === false && <small className="text-danger mt-1 d-block">Email address invalid</small>}
                            {emailValid === true && <small className="text-success mt-1 d-block">Valid email address <FcCheckmark /></small>}
                        </div>

                        <div className="mb-3">
                            <label className="form-label text-secondary small fw-bold">Username <span className="text-danger">*</span></label>
                            <input type="text" className={commonInputClass} placeholder="Enter username" ref={usernameRef} onChange={handleUsernameChange} />
                            {usernameValid === false && <small className="text-danger mt-1 d-block">Username too short</small>}
                            {usernameValid === true && <small className="text-success mt-1 d-block">Valid username <FcCheckmark /></small>}
                        </div>

                        <div className="mb-3">
                            <label className="form-label text-secondary small fw-bold">Password <span className="text-danger">*</span></label>
                            <div className="position-relative group">
                                <input
                                    type="password"
                                    className={commonInputClass}
                                    placeholder="Enter password"
                                    ref={passwordRef}
                                    onChange={handlePasswordChange}
                                />
                                {passwordValid === false && <small className="text-danger mt-1 d-block">Password must be at least 8 characters long and include letters and numbers</small>}
                                {passwordValid === true && <small className="text-success mt-1 d-block">Valid password <FcCheckmark /></small>}
                            </div>
                        </div>

                        <div className="mb-3">
                            <label className="form-label text-secondary small fw-bold">Confirm Password <span className="text-danger">*</span></label>
                            <input
                                type="password"
                                className={commonInputClass}
                                style={{
                                    borderColor: passwordsMatch === true ? '#28a745' : passwordsMatch === false ? '#dc3545' : '#6c757d'
                                }}
                                placeholder="Confirm password"
                                ref={confirmPasswordRef}
                                onChange={handlePasswordChange}
                            />
                            {passwordsMatch === false && <small className="text-danger mt-1 d-block">Passwords do not match</small>}
                            {passwordsMatch === true && <small className="text-success mt-1 d-block">Passwords match! <FcCheckmark /></small>}
                        </div>

                        {/* SIMPLIFIED PHONE: Single Input */}
                        <div className="mb-3">
                            <label className="form-label text-secondary small fw-bold">Phone Number <span className="text-danger">*</span></label>
                            <input type="tel" className={commonInputClass} placeholder="Enter phone number" ref={phoneRef} onChange={handlePhoneChange} />
                            {phoneValid === false && <small className="text-danger mt-1 d-block">Phone number too short</small>}
                            {phoneValid === true && <small className="text-success mt-1 d-block">Valid phone number <FcCheckmark /></small>}
                        </div>

                        {/* SIMPLIFIED DATE: Native Date Picker */}
                        <div className="mb-3">
                            <label className="form-label text-secondary small fw-bold">Date of Birth <span className="text-danger">*</span></label>
                            <input
                                type="date"
                                className={commonInputClass}
                                ref={dateOfBirthRef}
                                style={{ colorScheme: 'dark' }}
                                onChange={handleDateOfBirthChange}
                            />
                            {dateOfBirthValid === false && <small className="text-danger mt-1 d-block">You must enter a date of birth!</small>}
                            {dateOfBirthValid === true && <small className="text-success mt-1 d-block"><FcCheckmark /></small>}
                        </div>

                        {error && <p className="text-danger small text-center">{error}</p>}

                        <button
                            onClick={handleSignup}
                            className="btn btn-primary w-100 btn-lg mb-3"
                            style={{ backgroundColor: '#1a73e8', borderColor: '#1a73e8' }}
                        >
                            create account
                        </button>

                        <p className="text-center mt-3" style={{ color: 'white' }}>
                            Already have an account? <Link to="/login" style={{ color: '#1a73e8' }}>Sign in instead</Link>
                        </p>

                    </div>
                </div>
            </div>
        </div >
    );
}

export default Signup;