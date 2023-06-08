import { FunctionComponent } from 'react';

import classNames from 'classnames';
import useClipboard from 'react-use-clipboard';

import Icon from '@components/Icon';

interface Props {
    value: string;
    className?: string;
}

const CopyButton: FunctionComponent<Props> = ({ value, className }) => {
    const [copied, setCopied] = useClipboard(value, {
        successDuration: 2000
    });

    return (
        <button onClick={setCopied} className={classNames('', className)}>
            {copied ? <Icon name="check" /> : <Icon name="copy" />}
        </button>
    );
};

export default CopyButton;
