declare module '*.wasm' {
    const content: any;
    export default content;
}

interface Post {
    content: string;
    data: {
        [key: string]: any;
    };
    filePath: string;
}

interface HistoryEntry {
    commit: string;
    author: string;
    date: string;
    message: string;
}

interface HistoryItem {
    slug: string;
    history: HistoryEntry[];
}
