import React, { useState } from 'react'
import { IoPersonCircleSharp } from "react-icons/io5";
import { FaCaretDown } from "react-icons/fa";
import { Link, Navigate, useNavigate } from 'react-router-dom';

const Header = (props) => {

    const [menuDiv, setMenuDiv] = useState(false);
    const navigate = useNavigate();
    async function funLogout() {
        try {
            localStorage.removeItem('token');
            navigate('/');
            window.location.reload();
        } catch (error) {
            console.error('Logout failed:', error);
        }
    }

    return (
        <div className='flex justify-end mb-20 bg-gray-300 w-full pr-10 py-4 items-center gap-2 relative shadow-lg'>
            <div className="font-semibold">
                {
                    props.loggedUser
                }
            </div>
            <div className='flex text-2xl items-center' onClick={() => { setMenuDiv(!menuDiv) }}>
                <IoPersonCircleSharp />
                <FaCaretDown />
            </div>

            {menuDiv && (
                <div className='bg-[rgba(0,0,0,0.8)] grid absolute top-14 right-0 w-72 p-5 gap-5 text-white rounded-b-md shadow-xl'>
                    <div className='inline-block cursor-pointer w-fit'>
                        Change Password
                    </div>
                    <div className='inline-block cursor-pointer w-fit'>
                        Delete Account
                    </div>
                    <hr />
                    <div className='inline-block cursor-pointer w-fit' onClick={funLogout}>
                        Logout
                    </div>
                </div>
            )}
        </div>
    )
}

export default Header
