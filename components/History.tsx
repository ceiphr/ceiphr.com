import Image from 'next/image';
import { Fragment, FunctionComponent, useEffect, useState } from 'react';

import classNames from 'classnames';

import { timeSince } from '@utils/time';

const Commit: FunctionComponent<GitHubCommit> = (commit) => {
    const author = commit.author;

    return (
        <div className="flex flex-row space-x-2 py-1">
            <div className="flex items-center">
                <Image
                    src={author.avatar_url}
                    alt={author.username}
                    width={32}
                    height={32}
                    className="w-5 h-5 rounded-full mr-2 border border-gray-700"
                />
                <a
                    className="text-sm font-bold hover:underline"
                    href={author.url}
                    target="_blank"
                >
                    {author.username}
                </a>
            </div>
            <a
                className="text-sm text-gray-400 hover:underline"
                href={commit.url}
                target="_blank"
            >
                <code>{commit.sha.slice(0, 7)}</code>
            </a>
            <span className="text-sm text-gray-400 w-52 truncate">
                {commit.message.split('\n')[0]}
            </span>
        </div>
    );
};

interface Props {
    path?: string;
    length?: number;
    className?: string;
}

/**
 * History will render the commit history for a given file. If no file is
 * specified, the history for the entire repository will be rendered.
 *
 * @param param0    The props object contains the `path` to the file.
 * @returns         The commit history for the file.
 */
const History: FunctionComponent<Props> = ({ path, length, className }) => {
    const [history, setHistory] = useState<Record<string, GitHubCommit[]>>();

    // Fetch initial git commit history
    useEffect(() => {
        fetch(
            `/api/gh/commits/${path ? path : 'main'}${
                length ? `?len=${length}` : ''
            }`
        )
            .then((response) => {
                if (response.status !== 200) {
                    return;
                }

                return response.json();
            })
            .then((history) => {
                // Group commits by time since commit
                const historyByTime: Record<string, GitHubCommit[]> = {};
                history.forEach((commit: GitHubCommit) => {
                    const relTime: string = timeSince(new Date(commit.date));
                    if (!historyByTime[relTime]) {
                        historyByTime[relTime] = [];
                    }

                    historyByTime[relTime].push(commit);
                });

                setHistory(historyByTime);
            })
            .catch((error) => {});
    }, [path, length]);

    return (
        <div className={classNames('my-4 pl-8', className)}>
            <h2 className="text-3xl mt-4 mb-2">History</h2>
            <ul className="relative max-h-[276px] overflow-y-auto">
                {history &&
                    Object.entries(history).map(([time, commits]) => {
                        return (
                            <Fragment key={time}>
                                <div className="sticky top-0 bg-black text-gray-500 py-1 text-sm">
                                    {time}
                                </div>
                                {commits.map((commit) => (
                                    <Commit key={commit.sha} {...commit} />
                                ))}
                            </Fragment>
                        );
                    })}
                <div className="sticky bottom-0 w-full h-8 bg-gradient-to-t from-5% from-black" />
            </ul>
        </div>
    );
};

export default History;
