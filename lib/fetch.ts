import {
    commitsSchema,
    reposSchema,
    statsSchema,
    stringSchema
} from '@utils/schemas';

export const fetchCommits = async (
    path: string,
    length?: number,
    page?: number
) => {
    const { error } = commitsSchema.validate({ path, page, length });
    if (error) throw error;

    const params = new URLSearchParams();
    if (length) params.append('length', length.toString());
    if (page) params.append('page', page.toString());

    const response = await fetch(
        `/api/github/commits/${path}${params && '?' + params.toString()}`
    );

    if (response.status !== 200) throw new Error('Error fetching comments');

    return response.json();
};

export const fetchProfile = async () => {
    const response = await fetch('/api/github/profile');

    if (response.status !== 200) throw new Error('Error fetching profile');

    return response.json();
};

export const fetchRepos = async (archived?: boolean, length?: number) => {
    const { error } = reposSchema.validate({ archived, length });
    if (error) throw error;

    const params = new URLSearchParams();
    if (archived) params.append('archived', 'true');
    if (length) params.append('length', length.toString());

    const response = await fetch(
        `/api/github/repos${params && '?' + params.toString()}`
    );

    if (response.status !== 200) throw new Error('Error fetching repos');

    return response.json();
};

type Range = 'day' | 'week' | 'month' | 'year';

export const fetchStats = async (route: string, range?: Range) => {
    const { error } = statsSchema.validate({ route, range });
    if (error) throw error;

    const params = new URLSearchParams();
    if (range) params.append('range', range);

    const response = await fetch(
        `/api/simple-analytics/${route}${params && '?' + params.toString()}`,
        {
            headers: {
                'Content-Type': 'application/json',
                'X-Timezone': Intl.DateTimeFormat().resolvedOptions().timeZone
            }
        }
    );

    if (response.status !== 200) throw new Error('Error fetching analytics');

    return response.json();
};

export const fetchLikeCount = async (slug: string) => {
    const { error } = stringSchema.validate(slug);
    if (error) throw error;

    const response = await fetch(`/api/blog/like?slug=${slug}`);

    if (response.status !== 200) throw new Error('Error fetching likes');

    return response.json();
};

export const fetchSendLike = async (slug: string) => {
    const { error } = stringSchema.validate(slug);
    if (error) throw error;

    const response = await fetch('/api/blog/like', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ slug })
    });

    if (response.status !== 200) throw new Error('Error sending like');

    return response.json();
};

export const fetchShareLinks = async (slug: string) => {
    const { error } = stringSchema.validate(slug);
    if (error) throw error;

    const response = await fetch(`/api/blog/share?slug=${slug}`);

    if (response.status !== 200) throw new Error('Error fetching share links');

    return response.json();
};
