import React, { useEffect, useState } from 'react'
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { FaSort } from "react-icons/fa";
import { Formik, Field, ErrorMessage } from 'formik';
import Header from './Header';
import toast, { Toaster } from 'react-hot-toast';
import * as Yup from 'yup';


const Dashboard = () => {

    const [alltasks, setAllTasks] = useState([]);
    const token = localStorage.getItem('token');
    const validationSchema = Yup.object({
        title: Yup.string()
            .required('Title is required'),
        dueDate: Yup.date()
            .required('Due date is required')
            .test('is-future-date', 'Due Date must be today or in the future', (value) => {
                const today = new Date();
                today.setHours(0, 0, 0, 0); // Set hours to 00:00:00 to compare only the date part
                return value && new Date(value) >= today; // Checks if the due date is today or later
            })
    });

    async function getAllTasks(username) {
        const payload = { email: username }
        const response = await axios.post(`https://todo-backend-4atq.onrender.com/users/get-all-tasks`, payload);
        if (response.data.message === 'No tasks found') {
        }
        if (response.data.message === 'Tasks fetched succssfully') {
            const temp = response.data.tasks.filter((x) => {
                return !x.isDeleted;
            });
            setAllTasks(temp);
        }
    }

    async function handleSubmit(values) {
        const payload = { title: values.title, dueDate: values.dueDate, email: jwtDecode(token).username }
        const response = await axios.post(`https://todo-backend-4atq.onrender.com/users/add-task`, payload);
        console.log(response);
        if (response.data.message === 'Task added successfully') {
            toast.success(response.data.message);
            const temp = response.data.tasks.filter((x) => {
                return !x.isDeleted;
            });
            setAllTasks(temp);
        }
        else {
            toast.error("Task is not added.");
        }
    }

    function sort(event) {
        console.log(event.currentTarget.id);
        if (event.currentTarget.id == 'taskID') {

        }
    }

    function funOperation(event, x) {
        if (event.target.id == 'btnComplete') {
            funComplete(x);
        }
        if (event.target.id == 'btnDelete') {
            funDelete(x);
        }
    }

    async function funComplete(x) {
        const payload = { email: jwtDecode(token).username, ID: x.ID }
        const response = await axios.put(`https://todo-backend-4atq.onrender.com/users/updateTaskStatus`, payload)
        const temp = response.data.tasks.filter((x) => {
            return !x.isDeleted;
        });
        if (response.data.message == 'Task status changed to completed') {
            toast.success("Task status changed to completed");
            setAllTasks(temp)
        }
        else {
            toast.error("Task status not changed")
        }
    }

    async function funDelete(x) {
        const payload = { email: jwtDecode(token).username, ID: x.ID }
        const response = await axios.put(`https://todo-backend-4atq.onrender.com/users/deleteTask`, payload)
        const temp = response.data.tasks.filter((x) => {
            return !x.isDeleted;
        });
        if (response.data.message == 'Task deleted successfully') {
            toast.success("Task deleted successfully.")
            setAllTasks(temp);
        }
        else {
            toast.error("Something went wrong. Task not deleted.")
        }
    }

    useEffect(() => {

        if (!token) {
            navigate('/')
        }
        else {
            const decodedToken = jwtDecode(token);
            const currentTime = Date.now() / 1000;
            if (decodedToken.exp < currentTime) {
                localStorage.removeItem('token');
                navigate('/')
            }
            else {
                toast.success("Welcomme " + decodedToken.username, { toastId: 'login-success' });
                getAllTasks(decodedToken.username);
            }
        }
    }, [])

    return (
        <div className='flex flex-col items-center h-screen whitespace-nowrap'>
            <Header loggedUser={jwtDecode(token).username} />
            <h1 className='text-3xl'>Welcome to <strong>ToDo Manager</strong></h1>
            <div className='flex gap-10 p-20 w-full'>
                <div className='flex flex-col gap-4 items-center w-1/3'>
                    <h2 className='text-xl font-semibold'>New Task</h2>
                    <Formik initialValues={{ title: '', dueDate: '', }} validationSchema={validationSchema} onSubmit={(values) => { handleSubmit(values) }} >
                        {({ handleChange, handleSubmit, handleReset, values }) => (
                            <form onSubmit={handleSubmit} className="space-y-4 flex flex-col w-full ">
                                {/* Title Input */}
                                <Field id={'title'} type="text" name="title" placeholder="Title" className="border-2 border-gray-300 p-2 rounded-md w-full" onChange={handleChange} />
                                <ErrorMessage name="title" component="div" className="error text-red-600" />

                                {/* Due Date Input */}
                                <Field id={'dueDate'} type="date" name="dueDate" placeholder="Due Date" className="border-2 border-gray-300 p-2 rounded-md w-full" onChange={handleChange} />
                                <ErrorMessage name="dueDate" component="div" className="error text-red-600" />

                                {/* Submit Button */}
                                <div className='flex justify-around font-semibold'>
                                    <button type="submit" className="bg-blue-500 text-white py-2 px-8 rounded-md w-1/3" >
                                        Add Task
                                    </button>
                                    <button type="reset" className="bg-red-500 text-white py-2 px-8 rounded-md w-1/3" onClick={handleReset}>
                                        Clear
                                    </button>
                                </div>
                            </form>
                        )}
                    </Formik>
                </div>
                <div className='w-3/4 text-center space-y-4'>
                    <h2 className='text-xl font-semibold'>Task Details</h2>
                    <table className='w-full text-center border-2'>
                        <tr className=''>
                            <th className='p-2 border-2' id={'taskID'} onClick={(event) => { sort(event) }}>
                                <div className='flex gap-2 items-center justify-center'>ID <FaSort /></div>
                            </th>
                            <th className='p-2 border-2' id={'taskTitle'} onClick={(event) => { sort(event) }}>
                                <div className='flex gap-2 items-center justify-center'>Title <FaSort /></div>
                            </th>
                            <th className='p-2 border-2' id={'taskDueDate'} onClick={(event) => { sort(event) }}>
                                <div className='flex gap-2 items-center justify-center'>Due Date <FaSort /></div>
                            </th>
                            <th className='p-2 border-2' id={'taskCompletion'} onClick={(event) => { sort(event) }}>
                                <div className='flex gap-2 items-center justify-center'>Status <FaSort /></div>
                            </th>
                            <th className='p-2 border-2'>
                                Operation
                            </th>
                        </tr>

                        {
                            alltasks.map((x) => {
                                return (
                                    <tr>
                                        <td className='p-2 border'>
                                            {x.ID}
                                        </td>
                                        <td className='p-2 border w-1/3'>
                                            {x.title}
                                        </td>
                                        <td className='p-2 border'>
                                            {x.dueDate}
                                        </td>
                                        <td className='p-2 border'>
                                            {x.isCompleted ? 'Completed' : 'Incomplete'}
                                        </td>
                                        <td className='p-1 border grid grid-cols-2 space-x-3' onClick={(event) => { funOperation(event, x) }}>
                                            <button className={`text-white py-2 rounded-md ${x.isCompleted ? 'bg-gray-400' : 'bg-green-700'}`} id={'btnComplete'} disabled={x.isCompleted}>
                                                Complete
                                            </button>
                                            <button className='bg-red-500 text-white py-2 rounded-md' id={'btnDelete'}>
                                                Delete
                                            </button>

                                        </td>
                                    </tr>
                                )
                            })
                        }
                    </table>
                </div>
            </div>
            <div><Toaster position="bottom-right" reverseOrder={false} /></div>
        </div>
    )
}

export default Dashboard
