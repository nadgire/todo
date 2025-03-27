import { Formik } from 'formik'
import React from 'react'
import { Link } from 'react-router-dom'

const ResetPassword = () => {
  return (
    <div className='flex flex-col justify-center items-center h-screen'>
            <h1 className='text-5xl font-bold'>RESET PASSWORD</h1>
            <div className='my-10'>

                <Formik initialValues={{ username: '', password: '' }} onSubmit={() => { }}>
                    {({ handleChange, handleSubmit, handleReset }) => (
                        <form className='flex flex-col gap-4 w-96'>
                            <input type='email' placeholder='Email' className='border-2 border-gray-300 p-2 rounded-md' />
                            <button type='submit' className='bg-blue-500 text-white p-2 rounded-md w-48 mx-auto'>
                                Login
                            </button>
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
  )
}

export default ResetPassword
