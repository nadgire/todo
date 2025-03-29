import { Formik, Field, ErrorMessage } from 'formik'
import React from 'react'
import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import toast, { Toaster } from 'react-hot-toast';
import * as Yup from 'yup';

const Login = () => {

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
        const payload = {
            email: values.email, password: values.password
        }
        try {
            console.log(values);

            const response = await axios.post(`https://todo-backend-4atq.onrender.com/users/login`, payload);
            console.log(response)
            if (response.data.message === 'Login successful') {
                localStorage.setItem('token', response.data.token);

                navigate('https://simplytodomanager.netlify.app/dashboard');
                window.location.reload();

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
        <div className='flex flex-col justify-center items-center h-screen'>
            <h1 className='text-5xl font-bold my-16'>ToDo Manager</h1>
            <div className='p-10 rounded-2xl shadow-2xl'>
                <h2 className='text-3xl font-bold text-center'>LOGIN</h2>
                <div className='my-10'>

                    <Formik initialValues={{ email: '', password: '' }} validationSchema={validationSchema} onSubmit={(values) => { handleSubmit(values) }}>
                        {({ handleChange, handleSubmit, handleReset }) => (
                            <form onSubmit={handleSubmit} className='flex flex-col gap-4 w-96'>
                                <Field id={'email'} name='email' type='email' placeholder='Email' className='border-2 border-gray-300 p-2 rounded-md' onChange={handleChange} />
                                <ErrorMessage name="email" component="div" className="error text-red-600" />

                                <Field id={'password'} name='password' type='password' placeholder='Password' className='border-2 border-gray-300 p-2 rounded-md' onChange={handleChange} />
                                <ErrorMessage name="password" component="div" className="error text-red-600" />

                                <div className='flex gap-4 items-center justify-center'>
                                    <button type='submit' className={`text-white p-2 rounded-md w-1/3 ${isLoading ? 'bg-gray-400' : 'bg-blue-500'}`} disabled={isLoading}>
                                        {isLoading ? 'Logging in...' : 'Login'}
                                    </button>
                                    <button type='reset' className='bg-red-500 text-white p-2 rounded-md w-1/3' onClick={handleReset}>
                                        Reset
                                    </button>
                                </div>
                                <div className='flex flex-col gap-1'>
                                    <Link to={'https://simplytodomanager.netlify.app/register'} className='mx-auto w-fit'>
                                        New user? Register here!
                                    </Link>
                                    <Link to={'https://simplytodomanager.netlify.app/reset-password'} className='mx-auto w-fit'>
                                        Forgot password?
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

export default Login
