// GitHub API types

/**
 * @typedef {Object} Commit - A commit object.
 */
interface GitHubCommit {
    sha: string;
    message: string;
    date: string;
    verified: boolean;
    url: string;
    author: {
        name: string;
        username: string;
        url: string;
        avatar_url: string;
    };
}

/**
 * @typedef {Object} Profile - A GitHub profile object.
 */
interface GitHubProfile {
    name: string;
    username: string;
    url: string;
    avatar_url: string;
    bio: string;
    company: {
        name: string;
        url: string;
    };
    location: string;
    website: string;
    followers: number;
    following: number;
    public_repos: number;
    public_gists: number;
    socials: {
        provider: string;
        url: string;
    }[];
}

/**
 * @typedef {Object} Repo - A GitHub repository object.
 */
interface GitHubRepo {
    name: string;
    url: string;
    description: string;
    language: string;
    stars: number;
    forks: number;
    watchers: number;
    archived: boolean;
    created_at: string;
    updated_at: string;
}
