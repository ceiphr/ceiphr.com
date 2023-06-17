import { useState } from 'react';

const Search = () => {
    const [results, setResults] = useState();

    return (
        <div className="border border-gray-800 bg-black h-8 pl-3 pr-1 rounded-lg text-sm flex flex-row">
            <input
                className="focus:outline-none bg-transparent w-full h-full"
                type="text"
                placeholder="Search"
                onChange={async (e) => {}}
            />
            <span className="text-gray-500 border border-gray-800 whitespace-nowrap rounded text-xs self-center px-1.5 py-0.5 ml-1">
                CTRL K
            </span>
        </div>
    );
};

export default Search;
