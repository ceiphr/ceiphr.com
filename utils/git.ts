import path from 'path';

export const POSTS_HISTORY_PATH = path.join(
    process.cwd(),
    '.generated/posts-history.json'
);

export const HISTORY_PATH = path.join(process.cwd(), '.generated/history.json');
