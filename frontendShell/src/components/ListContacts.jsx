import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import SearchContacts from "./SearchContacts";
import axios from 'axios';

export default function ListContacts() {
    const [selectedUser, setSelectedUser] = useState(null);
    const [contacts, setContacts] = useState([]);
    const [message, setMessage] = useState('');
    const [isVisible, setIsVisible] = useState(false);
    const [searchResults, setSearchResults] = useState([]);

    const navigate = useNavigate();
    const fetchAllContacts = async () => {
        const url = `${process.env.REACT_APP_CONNECTION_URL}/contacts`;
        try {
            const response = await axios.get(url);
            if (response && response.data) {
                setContacts(response.data);
            }
        } catch (error) {
            console.error("Error fetching contacts:", error);
        }
    };

    useEffect(() => {
        fetchAllContacts();
    }, []);

    useEffect(() => {
        const fetchAllContacts = async () => {
            const url = `${process.env.REACT_APP_CONNECTION_URL}/contacts`;
            const response = await axios.get(url);
            setContacts(response.data);
        };
        fetchAllContacts();
    }, []);

    const handleSearchResults = (results) => {
        setSearchResults(results);
    };

    const onEditClick = (person) => {
        setSelectedUser(person);
        let uId = person.uId;
        navigate(`/edit/${uId}`);
    };

    const onDeleteClick = async (person) => {
        const confirmDelete = window.confirm(`Are you sure you want to delete ${person.firstName} ${person.lastName}?`);
        if (confirmDelete) {
            const url = `${process.env.REACT_APP_CONNECTION_URL}/contact/${person.uId}`;
            console.log("url")
            console.log(url)
            try {
                await axios.delete(url);
                setMessage("Contact deleted successfully!");
                setIsVisible(true);
                fetchAllContacts();

                setTimeout(() => {
                    setIsVisible(false);
                }, 2000);
            } catch (error) {
                console.error("Error deleting contact:", error);
                setMessage("Error deleting contact.");
                setIsVisible(true);
                fetchAllContacts();
                setTimeout(() => {
                    setIsVisible(false);
                }, 2000);
            }
        }
    };

    const CreateUser = () => {
        navigate(`/add/user`);
    };

    return (
        <>
            {isVisible && (
                <div className="fixed top-0 left-1/2 transform -translate-x-1/2 mt-4 z-50 bg-green-500 text-white text-center px-4 py-2 rounded-lg shadow-lg">
                    {message}
                </div>
            )}
            <div className="overflow-y-auto bg-indigo-200 h-screen w-full">
                <div className="px-4 sm:px-6 lg:px-8">
                    <div className="sm:flex sm:items-center">
                        <div className="sm:flex-auto">
                            <h1 className="text-base font-semibold leading-6 text-gray-900">Users Contact Information</h1>
                            <p className="mt-2 text-sm text-gray-700">
                                Contact Management System.
                            </p>
                        </div>
                        <SearchContacts setSearchResults={handleSearchResults} />
                        <div className="p-10 mt-5 sm:ml-16 sm:mt-0 sm:flex-none">
                            <button
                                type="button"
                                className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                onClick={CreateUser}
                            >
                                Add Contact
                            </button>
                        </div>
                    </div>
                    <div className="mt-8 flow-root">
                        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                                <table className="min-w-full divide-y divide-gray-300">
                                    <thead>
                                        <tr>
                                            <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                                                First Name
                                            </th>
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                Last Name
                                            </th>
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                Email
                                            </th>
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                Phone No
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {(searchResults?.length > 0 ? searchResults : contacts).map((person) => (
                                            <tr key={person.uId}>
                                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                                                    {person.firstName}
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{person.lastName}</td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{person.email}</td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{person.phone}</td>
                                                <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                                                    <a href="#" className="text-indigo-600 hover:text-indigo-900"
                                                        onClick={() => onEditClick(person)}>
                                                        Edit<span className="sr-only">, {person?.uId}</span>
                                                    </a>
                                                    <a href="#" className="p-4 text-indigo-600 hover:text-indigo-900"
                                                        onClick={() => onDeleteClick(person)}
                                                        data-testid={`delete-${person.uId}`}
                                                    >
                                                        Delete<span className="sr-only">, {person?.uId}</span>
                                                    </a>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
