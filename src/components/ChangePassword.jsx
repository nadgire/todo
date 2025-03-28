import React, { useState } from 'react'
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { Formik, Field, ErrorMessage } from 'formik';
import toast from 'react-hot-toast';
import * as Yup from 'yup';

const ChangePassword = (props) => {

    const [isSubmitting, setIsSubmitting] = useState(false);
    const token = localStorage.getItem('token');

    const validationSchema =
        Yup.object({
            currentPassword: Yup.string()
                .required('Current password is required'),
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

    async function handleSubmit(values) {
        setIsSubmitting(true);
        try {
            const payload = { email: jwtDecode(token).username, oldPassword: values.currentPassword, newPassword: values.newPassword }
            const response = await axios.post('http://localhost:5000/users/change-password', payload)
            if (response.data.message === 'Password changed successfully') {
                toast.success(response.data.message);
                props.divFlag(false);
            }
            else {
                toast.error(response.data.message);
            }
        } catch (error) {

        } finally {
            setIsSubmitting(false);
        }

    }

    return (
        <div className='absolute flex items-center h-screen w-screen left-0 top-0'>
            <div className='bg-[rgba(0,0,0,0.9)] p-10 mx-auto text-center w-1/4 text-white rounded-lg'>
                <Formik initialValues={{ currentPassword: '', newPassword: '', confirmPassword: '', }} validationSchema={validationSchema} onSubmit={(values) => { handleSubmit(values); }}>

                    {({ handleChange, handleSubmit, handleReset, values, handleBlur }) => (
                        <form onSubmit={handleSubmit}>
                            <h3 className='text-xl font-semibold mb-5'>Change Password</h3>

                            <Field
                                type="password"
                                id="currentPassword"
                                placeholder="Enter old password"
                                name="currentPassword"
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm placeholder:text-gray-300"

                                onChange={handleChange}
                                onBlur={handleBlur}
                            />
                            <ErrorMessage name="currentPassword" component="div" className="error text-red-600" />

                            <Field
                                type="password"
                                id="newPassword"
                                name="newPassword"
                                placeholder="Enter new password"

                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm placeholder:text-gray-300"

                                onChange={handleChange}
                                onBlur={handleBlur}
                            />
                            <ErrorMessage name="newPassword" component="div" className="error text-red-600" />

                            <Field
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                placeholder="Confirm new password"

                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm placeholder:text-gray-300"

                                onChange={handleChange}
                                onBlur={handleBlur}
                            />
                            <ErrorMessage name="confirmPassword" component="div" className="error text-red-600" />

                            <div className='flex gap-2 py-10'>
                                <button
                                    type="submit"
                                    className="w-1/2 bg-indigo-500 text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 hover:bg-indigo-600"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'Changing...' : 'Change Password'}
                                </button>

                                <button
                                    type="button"
                                    className="w-1/2 bg-indigo-500 text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 hover:bg-indigo-600"
                                >
                                    Cancel
                                </button>
                            </div>

                        </form>
                    )}

                </Formik>
            </div>
        </div >
    )
}

export default ChangePassword
