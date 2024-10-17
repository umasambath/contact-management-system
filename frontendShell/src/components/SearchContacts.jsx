import axios from "axios";
import { useState } from "react";

export default function SearchContacts(props) {
    const { setSearchResults } = props;

    const [searchText, setSearchText] = useState('');
    const [noSearchResponse, setNoSearchResponse] = useState(false);



    const onSearch = async (e) => {
        e.preventDefault(); // Prevent the form from submitting normally
        console.log("SEARCH TEXT:", searchText);

        try {
            const url = `${process.env.REACT_APP_CONNECTION_URL}/contact?text=${encodeURIComponent(searchText)}`;
            const response = await axios.get(url);
            if (response?.data?.length === 0) {
                setNoSearchResponse(true);
                setTimeout(() => {
                    setNoSearchResponse(false);
                }, 2000);
            } else {
                setSearchResults(response.data);
                setNoSearchResponse(false);
            }
        } catch (error) {
            console.error('Network error:', error);
            setSearchResults([]);
        }
    };

    return (
        <>
            {noSearchResponse && (
                <div className="fixed top-0 left-1/2 transform -translate-x-1/2 mt-4 z-50 bg-red-500 text-white text-center px-4 py-2 rounded-lg shadow-lg">
                    {"Matched Search Text not found"}
                </div>
            )}
            <form class="max-w-l mx-auto">
                <label for="default-search" class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
                <div class="relative">
                    <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                        <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                        </svg>
                    </div>
                    <input
                        type="search"
                        id="default-search"
                        class="block w-full p-4 pl-7 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Search"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        required />
                    <button type="submit" class="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-indigo-700 dark:focus:ring-blue-800"
                        onClick={onSearch}>
                        Search
                    </button>
                </div>
            </form>

        </>
    )
}