import { Formik, Field } from 'formik'
import React from 'react'
import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { TiDelete } from "react-icons/ti";
import { IoCheckmarkDoneCircle } from "react-icons/io5";

const Login = () => {

    const [isLoading, setIsLoading] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [errorMessages, setErrorMessages] = useState('');
    const [successMessages, setSuccessMessages] = useState('');
    const navigate = useNavigate();
    const [icon, setIcon] = useState();


    async function handleSubmit(values) {
        setIsLoading(true);
        const payload = {
            email: values.email, password: values.password
        }
        try {
            console.log(values);

            const response = await axios.post('http://localhost:5000/users/login', payload);
            console.log(response.data);

            if (response.data.message === 'Login successful') {
                setSuccessMessages(response.data.message);
                setShowPopup(true);
                setTimeout(() => {
                    navigate('/dashboard');
                }, 2000);
            }
            else {
                setErrorMessages(response.message);
                setShowPopup(true);
            }

        } catch (error) {
            console.log(error);

        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className='flex flex-col justify-center items-center h-screen'>
            <h1 className='text-5xl font-bold'>LOGIN</h1>
            <div className='my-10'>

                <Formik initialValues={{ email: '', password: '' }} onSubmit={(values) => { handleSubmit(values) }}>
                    {({ handleChange, handleSubmit, handleReset }) => (
                        <form onSubmit={handleSubmit} className='flex flex-col gap-4 w-96'>
                            <Field name='email' type='email' placeholder='Email' className='border-2 border-gray-300 p-2 rounded-md' onChange={handleChange} />
                            <Field name='password' type='password' placeholder='Password' className='border-2 border-gray-300 p-2 rounded-md' onChange={handleChange} />
                            <div className='flex gap-4 items-center justify-center'>
                                <button type='submit' className={`text-white p-2 rounded-md w-1/3 ${isLoading ? 'bg-gray-400' : 'bg-blue-500'}`} disabled={isLoading}>
                                    {isLoading ? 'Logging in...' : 'Login'}
                                </button>
                                <button type='reset' className='bg-red-500 text-white p-2 rounded-md w-1/3' onClick={handleReset}>
                                    Reset
                                </button>
                            </div>
                            <div className='flex flex-col gap-1'>
                                <Link to={'/register'} className='mx-auto w-fit'>
                                    New user? Register here!
                                </Link>
                                <Link to={'/reset-password'} className='mx-auto w-fit'>
                                    Forgot password?
                                </Link>
                            </div>
                        </form>
                    )}
                </Formik>
            </div>
            {showPopup && (
                <div className='fixed top-0 left-0 w-full h-full bg-[rgba(0,0,0,0.9)] flex justify-center items-center'>
                    <div className='bg-white px-20 py-10 rounded-md space-y-5 items-center justify-center flex flex-col'>
                        <h1 className='flex items-center justify-center space-x-2'><span className='text-2xl'>{successMessages}</span> <span className='text-5xl'>{icon}</span></h1>
                        <button className='bg-blue-500 text-white p-2 rounded-md w-1/3 mx-auto' onClick={() => { setShowPopup(false) }}>
                            OK
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Login
