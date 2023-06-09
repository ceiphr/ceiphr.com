import Image from 'next/image';
import { Fragment, FunctionComponent, useEffect, useState } from 'react';

import classNames from 'classnames';

import { fetchCommits } from '@utils/fetch';
import { groupByTimeSince } from '@utils/time';

/**
 * JSX for a single GitHub commit.
 *
 * @param commit    The commit object contains the `author`, `sha`, `message`, and `url`.
 * @returns         A commit message with the author and sha.
 */
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
            <span className="text-sm text-gray-400 w-64 truncate">
                {commit.message.split('\n')[0]}
            </span>
        </div>
    );
};

interface Props {
    commits?: GitHubCommit[];
    path?: string;
    page?: number;
    length?: number;
    className?: string;
}

/**
 * Changelog will render the commit history for a given file. If no file is
 * specified, the history for the entire repository will be rendered.
 *
 * @param param0    The props object contains the `path` to the file.
 * @returns         The commit history for the file.
 */
const Changelog: FunctionComponent<Props> = ({
    commits,
    path,
    page,
    length,
    className
}) => {
    const [groupedCommits, setGroupedCommits] =
        useState<Record<string, GitHubCommit[]>>();

    // Validate attributes
    if (commits && path) {
        throw new Error(
            'You cannot specify both `commits` and `path` at the same time.'
        );
    }

    // Fetch initial git commit history
    useEffect(() => {
        // If commits are provided, use them instead of fetching
        if (commits) {
            const historyByTime: Record<string, GitHubCommit[]> =
                groupByTimeSince(commits);
            setGroupedCommits(historyByTime);
            return;
        }

        fetchCommits(path ?? 'main', length ?? 10, page ?? 1)
            .then((history) => {
                // Group commits by time since commit
                const historyByTime: Record<string, GitHubCommit[]> =
                    groupByTimeSince(history);
                setGroupedCommits(historyByTime);
            })
            .catch((error) => {
                // TODO: Handle error
                console.error(error);
            });
    }, [path, page, length, commits]);

    return (
        <div
            className={classNames(
                'relative max-h-full overflow-y-auto',
                className
            )}
        >
            {groupedCommits &&
                Object.entries(groupedCommits).map(([time, commits]) => {
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
        </div>
    );
};

export default Changelog;
