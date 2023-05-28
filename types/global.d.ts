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
