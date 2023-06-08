declare module '*.wasm' {
    const content: any;
    export default content;
}

declare module '*.svg' {
    import { FunctionComponent, SVGProps } from 'react';

    export const ReactComponent: FunctionComponent<SVGProps<SVGSVGElement>>;
    const src: string;
    export default src;
}
