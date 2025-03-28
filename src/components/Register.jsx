import { Formik, Field, ErrorMessage } from 'formik'
import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useState } from 'react'
import toast, { Toaster } from 'react-hot-toast';
import * as Yup from 'yup';

const Register = () => {

    const [enterOTPFlag, setEnterOTPFlag] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const validationSchema = Yup.object({
        email: Yup.string()
            .email('Invalid email address')
            .required('Email is required'),
        password: Yup.string()
            .min(8, 'Password must be at least 8 characters')
            .required('Password is required'),
    });

    async function handleSubmit(values) {
        setIsLoading(true);
        console.log(values);
        const payload = {
            email: values.email, password: values.password, otp: values.otp
        }
        try {
            const response = await axios.post('http://localhost:5000/users/register', payload);
            if (response.data.message === 'User registered successfully') {
                toast.success(response.data.message);
                setTimeout(() => {
                    navigate('/');
                }, 3000);
            }
            else {
                console.log(response);
                toast.error(response.data.error);
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
                toast.success(response.data.message);
            }
            else {
                toast.error(response.data.message);
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

    return (
        <div className='flex flex-col justify-center items-center h-screen'>
            <h1 className='text-5xl font-bold'>REGISTER</h1>
            <div className='my-10'>

                <Formik initialValues={{ email: '', password: '' }} validationSchema={validationSchema} onSubmit={(values) => { handleSubmit(values) }}>
                    {({ handleChange, handleSubmit, handleReset, values }) => (
                        <form onSubmit={handleSubmit} className='flex flex-col gap-4 w-96'>
                            <Field id='email' name='email' type='email' placeholder='Email' className='border-2 border-gray-300 p-2 rounded-md' onChange={handleChange} />
                            <ErrorMessage name="email" component="div" className="error text-red-600" />
                            <Field id='password' name='password' type='password' placeholder='Password' className='border-2 border-gray-300 p-2 rounded-md' onChange={handleChange} />
                            <ErrorMessage name="password" component="div" className="error text-red-600" />

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
            <div><Toaster position="bottom-right" reverseOrder={false} /></div>
        </div>
    )
}

export default Register
