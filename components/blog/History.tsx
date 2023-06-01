import { FunctionComponent, useEffect, useState } from 'react';

interface Props {
    path?: string;
}

/**
 * History will render the commit history for a given file. If no file is
 * specified, the history for the entire repository will be rendered.
 *
 * @param param0    The props object contains the `path` to the file.
 * @returns         The commit history for the file.
 */
const History: FunctionComponent<Props> = ({ path }) => {
    const [history, setHistory] = useState<GitHubCommit[]>([]);

    // Fetch initial git commit history
    useEffect(() => {
        const requestPath = path ? `?path=${path}` : '';

        fetch(`/api/gh/commits${requestPath}`)
            .then((response) => {
                if (response.status !== 200) {
                    return;
                }

                return response.json();
            })
            .then((history) => {
                setHistory(history);
            })
            .catch((error) => {});
    }, [path]);

    return (
        <div className="mb-4">
            <h2 className="text-3xl mt-4 mb-2">History</h2>
            <ul>
                {history &&
                    history.map((item) => (
                        <li key={item.sha.slice(0, 7)} className="py-2">
                            <p>
                                {item.message} ~ @{item.author.username}
                            </p>
                            <p>
                                {item.date} - {item.sha.slice(0, 7)}
                            </p>
                        </li>
                    ))}
            </ul>
        </div>
    );
};

export default History;
