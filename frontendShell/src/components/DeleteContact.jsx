'use client'

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios';

export default function DeleteContact(props) {
    const { user } = props;
    const uId = user?.uId;
    const navigate = useNavigate();
    const [message, setMessage] = useState('');
    const [isVisible, setIsVisible] = useState(false);

    const handleDelete = async () => {
        const url = `${process.env.REACT_APP_CONNECTION_URL}/contact/${uId}`;
        try {
            await axios.delete(url);
            setMessage("Contact deleted successfully!");
            setIsVisible(true);
            setTimeout(() => {
                setIsVisible(false);
                navigate('/');
            }, 2000);

        } catch (error) {
            console.error("Error deleting contact:", error);
            setMessage("Error deleting contact.");
            setIsVisible(true);
            setTimeout(() => {
                setIsVisible(false);
            }, 2000);
        }
    };

    useEffect(() => {
        handleDelete()
    }, [uId]);

    return (
        <div className="relative z-10">
            {isVisible && (
                <div className="fixed top-0 left-1/2 transform -translate-x-1/2 mt-4 z-50 bg-green-500 text-white text-center px-4 py-2 rounded-lg shadow-lg">
                    {message}
                </div>
            )}

        </div>
    )
}
