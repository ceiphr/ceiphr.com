interface Post {
    content: string;
    data: {
        [key: string]: any;
    };
    filePath: string;
}

interface Heading {
    title: string;
    id: string;
}

interface Frontmatter {
    title: string;
    description: string;
    date: string;
    license?: string;
    ads?: boolean;
}
