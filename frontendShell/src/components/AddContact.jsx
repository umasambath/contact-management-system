import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from 'axios';

export default function AddContact() {
    const { uId } = useParams();
    const navigate = useNavigate();
    const [cancel, setCancel] = useState(false);
    const [message, setMessage] = useState(false)
    const [errorMessage, setErrorMessage] = useState(null)

    const [formValues, setFormValues] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
    });

    const onCancel = () => {
        setCancel(true);
    };

    useEffect(() => {
        if (cancel) {
            navigate('/');
        }
    }, [cancel, navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormValues((prevValues) => ({
            ...prevValues,
            [name]: value,
        }));
    };

    const handleSave = async (e) => {
        e.preventDefault();

        const url = `${process.env.REACT_APP_CONNECTION_URL}/contact`;
        try {
            const response = await axios.post(url, formValues);
            console.log("Contact added successfully:", response.data);
            navigate('/');
        } catch (error) {
            if(error?.response?.data?.message){
                setErrorMessage(error?.response?.data?.message)
            setMessage(true)
            setTimeout(() => {
                setErrorMessage(null);
            }, 2000);

            }
            else{
                setMessage(true)
                setErrorMessage("Fill the Mandatory Fields!!")
            }
            
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
                        <h2 className="text-base font-semibold leading-7 text-gray-900">User Information</h2>
                        <p className="mt-1 text-sm leading-6 text-gray-600">Add New User Details</p>

                        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                            <div className="sm:col-span-3">
                                <label htmlFor="first-name" className="block text-sm font-medium leading-6 text-gray-900">
                                    First Name
                                </label>
                                <div className="mt-2">
                                    <input
                                        id="first-name"
                                        name="firstName"
                                        type="text"
                                        autoComplete="given-name"
                                        value={formValues.firstName}
                                        onChange={handleInputChange}
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
                                        autoComplete="family-name"
                                        value={formValues.lastName}
                                        onChange={handleInputChange}
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
                                        autoComplete="email"
                                        value={formValues.email}
                                        onChange={handleInputChange}
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>

                            <div className="sm:col-span-4">
                                <label htmlFor="phoneNo" className="block text-sm font-medium leading-6 text-gray-900">
                                    Phone No
                                </label>
                                <div className="mt-2">
                                    <input
                                        id="phoneNo"
                                        name="phone"
                                        type="text"
                                        autoComplete="phoneNo"
                                        value={formValues.phone}
                                        onChange={handleInputChange}
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-6 flex items-center justify-end gap-x-6">
                    <button type="button" className="text-sm font-semibold leading-6 text-gray-900" onClick={onCancel}>
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

    );
}
