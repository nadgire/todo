import { Formik, Field } from 'formik'
import React, { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import axios from 'axios'
import toast, { Toaster } from 'react-hot-toast';
import * as Yup from 'yup';

const ResetPassword = () => {
    const [enterOTPFlag, setEnterOTPFlag] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [enterPassFlag, setEnterPassFlag] = useState(false);
    const navigate = useNavigate();

    const validationSchema = Yup.object({
        email: Yup.string()
            .email('Invalid email address')
            .required('Email is required'),
        otp: Yup.string()
            .required('OTP is required'),
        newPassword: Yup.string()
            .required('New password is required')
            .min(8, 'Password must be at least 8 characters')
            .matches(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[a-zA-Z\d!@#$%^&*(),.?":{}|<>]{6,}$/,
                'Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character'
            ),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
            .required('Confirm password is required'),
    });

    async function submitOTP(values) {
        setIsLoading(true);

        const payload = {
            email: values.email, otp: values.otp
        }

        try {
            const response = await axios.post('http://localhost:5000/users/confirm-otp', payload);
            if (response.data.message === 'OTP matched') {
                setEnterOTPFlag(false);

                setEnterPassFlag(true);
                $('#otp').prop('disabled', true);
                $('#otp').addClass('bg-gray-200 cursor-not-allowed');
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

    async function requestOTP(values) {
        setIsLoading(true);
        const payload = {
            email: values.email
        }
        try {
            const response = await axios.put('http://localhost:5000/users/forgot-pass-otp', payload);
            if (response.data.message === 'OTP sent successfully') {
                setEnterOTPFlag(true);
                $('#email').prop('disabled', true);
                $('#email').addClass('bg-gray-200 cursor-not-allowed');
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

    async function handleSubmit(values) {
        console.log(values);
        const payload = {
            email: values.email, password: values.newPassword
        }

        try {
            const response = await axios.post('http://localhost:5000/users/reset-password', payload);
            console.log(response);
            if (response.data.message === 'Password reset successful') {
                toast.success(response.data.message);
                setTimeout(() => {
                    navigate('/');
                    window.location.reload();
                }, 2000);
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

    return (
        <div className='flex flex-col justify-center items-center h-screen '>

            <div className='text-center shadow-2xl rounded-2xl p-10'>
                <h1 className='text-3xl font-bold'>RESET PASSWORD</h1>
                <div className='my-10'>

                    <Formik initialValues={{ email: '' }} validationSchema={validationSchema} onSubmit={(values) => { handleSubmit(values) }}>
                        {({ handleChange, handleSubmit, handleReset, values }) => (
                            <form onSubmit={handleSubmit} className='flex flex-col gap-4 w-96'>
                                <Field id='email' name='email' type='email' placeholder='Email' className='border-2 border-gray-300 p-2 rounded-md' onChange={handleChange} />

                                {enterOTPFlag && (
                                    <Field id="otp" name='otp' type='text' placeholder='Enter OTP' className='border-2 border-gray-300 p-2 rounded-md' onChange={handleChange} />
                                )}

                                {!enterOTPFlag && !enterPassFlag && (
                                    <button type='button' className={`text-white p-2 rounded-md w-48 mx-auto ${isLoading ? 'bg-gray-400' : 'bg-blue-500'}`} onClick={() => { requestOTP(values) }} disabled={isLoading}>
                                        {isLoading ? "Requesting..." : "Request OTP"}
                                    </button>
                                )}

                                {enterOTPFlag && (
                                    <button type='button' className={`text-white p-2 rounded-md w-48 mx-auto ${isLoading ? 'bg-gray-400' : 'bg-blue-500'}`} onClick={() => { submitOTP(values) }}>
                                        {isLoading ? "Submitting..." : "Submit OTP"}
                                    </button>
                                )}

                                {enterPassFlag && (
                                    <>
                                        <Field id='newPassword' name='newPassword' type='password' placeholder='New password' className='border-2 border-gray-300 p-2 rounded-md' onChange={handleChange} />
                                        <Field id='confirmPassword' name='confirmPassword' type='password' placeholder='Confirm password' className='border-2 border-gray-300 p-2 rounded-md' onChange={handleChange} />
                                        <button type='button' className={`text-white p-2 rounded-md w-48 mx-auto ${isLoading ? 'bg-gray-400' : 'bg-blue-500'}`} onClick={handleSubmit}>
                                            {isLoading ? "Resetting..." : "Reset password"}
                                        </button></>
                                )}

                                <div className='flex flex-col gap-1'>
                                    <Link to={'/'} className='mx-auto w-fit'>
                                        Already a user? Login here!
                                    </Link>
                                </div>
                            </form>
                        )}
                    </Formik>
                </div>
            </div>

            <div><Toaster position="bottom-right" reverseOrder={false} /></div>
        </div>
    )
}

export default ResetPassword
