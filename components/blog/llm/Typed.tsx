import { FunctionComponent, useEffect, useState } from 'react';

interface Props {
    string: string;
}

const Typed: FunctionComponent<Props> = ({ string }) => {
    const [typed, setTyped] = useState<string[]>([]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setTyped([...typed, string[typed.length]]);
        }, 150);

        return () => clearTimeout(timeout);
    }, [typed, string]);

    return <span>{typed.join('')}</span>;
};

export default Typed;
