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
