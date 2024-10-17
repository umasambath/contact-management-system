import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from 'axios';

export default function UpdateContact(props) {
    const { uId } = useParams();
    const navigate = useNavigate();
    const [cancel, setCancel] = useState(false)
    const [message, setMessage] = useState(false)
    const [errorMessage, setErrorMessage] = useState(null)
    const [contactById, setContactById] = useState(null)
    const [formValues, setFormValues] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
    });
    

    /*GET Using Params */
    const fetchByUid = async () => {
        const url = `${process.env.REACT_APP_CONNECTION_URL}/contact/${uId}`;
        try {
            const response = await axios.get(url);

            if (response && response?.data) {
                setContactById(response?.data)
                setFormValues({
                    firstName: response?.data?.firstName,
                    lastName: response?.data?.lastName,
                    email: response?.data?.email ,
                    phone: response?.data?.phone ,
                });

            }
        } catch (error) {
            console.error("Error fetching contacts:", error);
        }
    };
    useEffect(() => {
        fetchByUid();
    }, [uId]);

    const oncancel = () => {
        setCancel(true)
    }
    useEffect(() => {
        if (cancel) {
            navigate('/');
        }
    }, [cancel, navigate]);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormValues((prevValues) => ({
            ...prevValues,
            [name]: value,
        }));
    };
    const handleSave = async (e) => {
        e.preventDefault();
        const url = `${process.env.REACT_APP_CONNECTION_URL}/contact/${uId}`;
        try {
            const response = await axios.put(url, formValues);
            navigate('/');
        } catch (error) {
            console.error("Error updating contact:", error?.response?.data?.message);
            setErrorMessage(error?.response?.data?.message)
            setMessage(true)
            setTimeout(() => {
                setErrorMessage(null);
            }, 2000);

        }
    };

    return (
        <>
            {errorMessage && message && (
                <div className="fixed top-0 left-1/2 transform -translate-x-1/2 mt-4 z-50 bg-red-500 text-white text-center px-4 py-2 rounded-lg shadow-lg">
                    {errorMessage}
                </div>
            )}

            <form className="p-10 bg-indigo-200 h-screen w-full" onSubmit={handleSave}>
                <div className="space-y-12">
                    <div className="border-b border-gray-900/10 pb-12">
                        <h2 className="text-base font-semibold leading-7 text-gray-900">Update Details</h2>
                        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                            <div className="sm:col-span-3">
                                <label htmlFor="first-name" className="block text-sm font-medium leading-6 text-gray-900">
                                    First Name
                                </label>
                                <div className="mt-2">
                                    <input
                                        id="first-name"
                                        name="firstName"
                                        value={formValues?.firstName}
                                        onChange={handleInputChange}
                                        type="text"
                                        autoComplete="given-name"
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>

                            <div className="sm:col-span-3">
                                <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900">
                                    Last Name
                                </label>
                                <div className="mt-2">
                                    <input
                                        id="last-name"
                                        name="lastName"
                                        type="text"
                                        value={formValues?.lastName}
                                        onChange={handleInputChange}
                                        autoComplete="family-name"
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>

                            <div className="sm:col-span-4">
                                <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                                    Email address
                                </label>
                                <div className="mt-2">
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={formValues?.email}
                                        onChange={handleInputChange}
                                        autoComplete="email"
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>
                            <div className="sm:col-span-4">
                                <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                                    Phone No
                                </label>
                                <div className="mt-2">
                                    <input
                                        id="phoneNo"
                                        name="phone"
                                        type="phoneNo"
                                        value={formValues?.phone}
                                        onChange={handleInputChange}
                                        autoComplete="phoneNo"
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>

                        </div>
                    </div>


                </div>

                <div className="mt-6 flex items-center justify-end gap-x-6">
                    <button type="button" className="text-sm font-semibold leading-6 text-gray-900"
                        onClick={oncancel}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                        Save
                    </button>
                </div>
            </form>
        </>

    )
}
