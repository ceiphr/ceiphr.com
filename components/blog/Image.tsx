import NextImage from 'next/image';
import type { FunctionComponent } from 'react';

interface Props {
    src: string;
    alt: string;
}

const Image: FunctionComponent<Props> = (props) => {
    return (
        <NextImage
            priority
            className="h-auto w-auto mx-auto rounded-lg my-6"
            {...props}
            alt={props.alt}
            width={500}
            height={500}
        />
    );
};

export default Image;
