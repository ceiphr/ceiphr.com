export const groupByTimeSince = (commits: GitHubCommit[]) => {
    const historyByTime: Record<string, GitHubCommit[]> = {};
    commits.forEach((commit: GitHubCommit) => {
        // Get the relative time since the commit and
        // used it as the key for the commit history
        const relTime: string = timeSince(new Date(commit.date));
        if (!historyByTime[relTime]) {
            historyByTime[relTime] = [];
        }

        historyByTime[relTime].push(commit);
    });

    return historyByTime;
};

export const timeSince = (timestamp: Date): string => {
    const now = new Date();
    const secondsPast = (now.getTime() - timestamp.getTime()) / 1000;

    // TODO Make sure nouns are correct
    if (secondsPast < 60) {
        let noun = 'second';
        if (secondsPast !== 1) {
            noun += 's';
        }

        return `${Math.floor(secondsPast)} ${noun} ago`;
    } else if (secondsPast < 3600) {
        let noun = 'minute';
        if (secondsPast / 60 !== 1) {
            noun += 's';
        }

        return `${Math.floor(secondsPast / 60)} ${noun} ago`;
    } else if (secondsPast <= 86400) {
        let noun = 'hour';
        if (secondsPast / 3600 !== 1) {
            noun += 's';
        }

        return `${Math.floor(secondsPast / 3600)} ${noun} ago`;
    } else {
        const day = timestamp.getDate();
        const monthMatch = timestamp.toDateString().match(/ [a-zA-Z]*/);
        const month = monthMatch ? monthMatch[0].replace(' ', '') : '';
        const year =
            timestamp.getFullYear() == now.getFullYear()
                ? ''
                : ' ' + timestamp.getFullYear();
        return `${month} ${day} ${year && ', ' + year}`;
    }
};
