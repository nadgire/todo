import React, { useState } from 'react'
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { Formik, Field, ErrorMessage } from 'formik';
import toast, { Toaster } from 'react-hot-toast';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';

const DeleteAccount = (props) => {

    const [isSubmitting, setIsSubmitting] = useState(false);
    const token = localStorage.getItem('token');
    const navigate = useNavigate();
    const validationSchema =
        Yup.object({
            currentPassword: Yup.string()
                .required('Current password is required'),
        });

    async function handleSubmit(values) {
        setIsSubmitting(true);
        try {
            const payload = { email: jwtDecode(token).username, oldPassword: values.currentPassword }
            const response = await axios.put(`https://todo-backend-4atq.onrender.com/users/delete-account`, payload)
            if (response.data.message === 'Account deleted successfully') {
                props.divFlag(false);
                toast.success(response.data.message);
                localStorage.removeItem('token');
                navigate('/');
                window.location.reload();
            }
            else {
                toast.error(response.data.message);
            }
        } catch (error) {

        } finally {
            setIsSubmitting(false);
        }
    }

    function funClose() {
        props.divFlag(false);
    }

    return (
        <div className='absolute flex items-center h-screen w-screen left-0 top-0'>
            <div className='bg-[rgba(0,0,0,0.9)] p-10 mx-auto text-center w-1/4 text-white rounded-lg'>
                <Formik initialValues={{ currentPassword: '' }} validationSchema={validationSchema} onSubmit={(values) => { handleSubmit(values); }}>

                    {({ handleChange, handleSubmit, handleReset, values, handleBlur }) => (
                        <form onSubmit={handleSubmit}>
                            <h3 className='text-xl font-semibold mb-5'>Delete Account</h3>

                            <Field
                                type="password"
                                id="currentPassword"
                                placeholder="Enter password"
                                name="currentPassword"
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm placeholder:text-gray-300"

                                onChange={handleChange}
                                onBlur={handleBlur}
                            />
                            <ErrorMessage name="currentPassword" component="div" className="error text-red-600" />

                            <div className='flex gap-2 py-10'>
                                <button
                                    type="submit"
                                    className="w-1/2 bg-indigo-500 text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 hover:bg-indigo-600"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'Deleting...' : 'Delete Account'}
                                </button>

                                <button
                                    type="button"
                                    className="w-1/2 bg-indigo-500 text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 hover:bg-indigo-600"
                                    onClick={funClose}
                                >
                                    Cancel
                                </button>
                            </div>

                        </form>
                    )}

                </Formik>
            </div>
            <div><Toaster position="bottom-right" reverseOrder={false} /></div>
        </div >
    )
}

export default DeleteAccount
