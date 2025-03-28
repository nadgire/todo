import React from 'react'
import { FaHeart } from "react-icons/fa";
import { GiBrain } from "react-icons/gi";


const Footer = () => {
    return (
        <div className='bg-gray-800 text-white text-center p-4'>
            <p className='font-semibold'>
                Made with <FaHeart className='inline text-red-500' /> and  <GiBrain className='inline text-red-300 text-xl' /> by Abhishek Nadgire
            </p>
        </div>
    )
}

export default Footer
    