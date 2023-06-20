import { FunctionComponent } from 'react';

import { Switch } from '@headlessui/react';
import classNames from 'classnames';

interface Props {
    checked: boolean;
    srOnly: string;
    onChange: () => void;
    className: string;
}

const Toggle: FunctionComponent<Props> = ({
    checked,
    srOnly,
    onChange,
    className
}) => {
    return (
        <Switch
            checked={checked}
            onChange={onChange}
            className={classNames(
                'relative inline-flex items-center h-6 rounded-full w-11 mt-2',
                checked ? 'bg-blue-600' : 'bg-gray-200',
                className
            )}
        >
            <span className="sr-only">{srOnly}</span>
            <span
                className={`${
                    checked ? 'translate-x-6' : 'translate-x-1'
                } inline-block w-4 h-4 transform bg-white rounded-full`}
            />
        </Switch>
    );
};

export default Toggle;
