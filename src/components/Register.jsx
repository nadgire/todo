import { Formik, Field } from 'formik'
import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useState, useEffect } from 'react'
import { TiDelete } from "react-icons/ti";
import { IoCheckmarkDoneCircle } from "react-icons/io5";

const Register = () => {

    const [enterOTPFlag, setEnterOTPFlag] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [errorMessages, setErrorMessages] = useState('');
    const [successMessages, setSuccessMessages] = useState('');
    const [icon, setIcon] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const [count, setCount] = useState(5);

    async function handleSubmit(values) {
        setIsLoading(true);
        console.log(values);
        const payload = {
            email: values.email, password: values.password, otp: values.otp
        }
        try {
            const response = await axios.post('http://localhost:5000/users/register', payload);
            if (response.data.message === 'User registered successfully') {
                setSuccessMessages(response.data.message);
                setIcon(<IoCheckmarkDoneCircle className='text-green-600 inline' />);
                setShowPopup(true);
            }
            else {
                setErrorMessages(response.data.message);
                setIcon(<TiDelete className='text-red-600 inline' />);
                setShowPopup(true);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    }

    async function requestOTP(values) {

        setIsLoading(true);
        const payload = {
            email: values.email, password: values.password
        }
        try {
            const response = await axios.post('http://localhost:5000/users/register-otp', payload);
            if (response.data.message === 'OTP sent successfully') {
                setEnterOTPFlag(true);
                //disable email and password fields
                disableFields();
                setSuccessMessages(response.data.message);
                setIcon(<IoCheckmarkDoneCircle className='text-green-600 inline' />);
                setShowPopup(true);
            }
            else {
                setErrorMessages(response.data.message);
                setIcon(<TiDelete className='text-red-600 inline' />);
                setShowPopup(true);
            }

        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }

    }

    function disableFields() {
        const txtEmail = document.querySelector('input[name="email"]');
        const txtPassword = document.querySelector('input[name="password"]');
        txtEmail.disabled = true;
        txtPassword.disabled = true;
        txtEmail.classList.add('bg-gray-200');
        txtPassword.classList.add('bg-gray-200');
        txtEmail.classList.add('cursor-not-allowed');
        txtPassword.classList.add('cursor-not-allowed');
    }

    function enableFields() {
        const txtEmail = document.querySelector('input[name="email"]');
        const txtPassword = document.querySelector('input[name="password"]');
        txtEmail.disabled = false;
        txtPassword.disabled = false;
        txtEmail.classList.remove('bg-gray-200');
        txtPassword.classList.remove('bg-gray-200');
        txtEmail.classList.remove('cursor-not-allowed');
        txtPassword.classList.remove('cursor-not-allowed');
        setEnterOTPFlag(false);
    }

    useEffect(() => {
        if (count > 0 && successMessages === "User registered successfully") {
            const interval = setInterval(() => {
                setCount(prevCount => prevCount - 1);
            }, 1000);
    
            return () => clearInterval(interval); // Clean up the interval when count reaches 0
        }
    
        if (count === 0) {
            navigate('/');
        }
    }, [count, successMessages, navigate]);

    return (
        <div className='flex flex-col justify-center items-center h-screen'>
            <h1 className='text-5xl font-bold'>REGISTER</h1>
            <div className='my-10'>

                <Formik initialValues={{ email: '', password: '' }} onSubmit={(values) => { handleSubmit(values) }}>
                    {({ handleChange, handleSubmit, handleReset, values }) => (
                        <form onSubmit={handleSubmit} className='flex flex-col gap-4 w-96'>
                            <Field name='email' type='email' placeholder='Email' className='border-2 border-gray-300 p-2 rounded-md' onChange={handleChange} />
                            <Field name='password' type='password' placeholder='Password' className='border-2 border-gray-300 p-2 rounded-md' onChange={handleChange} />
                            {enterOTPFlag && (
                                <Field name='otp' type='text' placeholder='Enter OTP' className='border-2 border-gray-300 p-2 rounded-md' onChange={handleChange} />
                            )}
                            <div className='flex justify-center items-center'>
                                {!enterOTPFlag && (<button type='button' className={`text-white p-2 rounded-md w-1/3 mx-auto ${isLoading ? 'bg-gray-400' : 'bg-blue-500'}`} disabled={isLoading} onClick={() => { requestOTP(values) }}>
                                    {isLoading ? 'Requesting...' : 'Request OTP'}
                                </button>)}
                                {enterOTPFlag && (<button type='submit' className={`text-white p-2 rounded-md w-1/2 mx-auto whitespace-nowrap ${isLoading ? 'bg-gray-400' : 'bg-blue-500'}`} onClick={handleSubmit}>
                                    {isLoading ? 'Verifying...' : 'Verify & Register'}
                                </button>)}
                                <button type='reset' className='bg-red-500 text-white p-2 rounded-md w-1/3 mx-auto' onClick={() => { handleReset(); enableFields(); }}>
                                    Reset
                                </button>
                            </div>
                            <div className='flex flex-col gap-1'>
                                <Link to={'/'} className='mx-auto w-fit'>
                                    Already a user? Login here!
                                </Link>
                            </div>
                        </form>
                    )}
                </Formik>
            </div>
            {/* creating popup dialog */}
            {showPopup && (
                <div className='fixed top-0 left-0 w-full h-full bg-[rgba(0,0,0,0.9)] flex justify-center items-center'>
                    <div className='bg-white px-20 py-10 rounded-md space-y-5 items-center justify-center flex flex-col'>
                        <h1 className='flex items-center justify-center space-x-2'><span className='text-2xl'>{successMessages == "User registered successfully" ? (successMessages + " Redirecting to login page in " + count + " seconds") : successMessages}</span> <span className='text-5xl'>{icon}</span></h1>
                        <button className='bg-blue-500 text-white p-2 rounded-md w-1/3 mx-auto' onClick={() => { setShowPopup(false) }}>
                            OK
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Register
