import { FunctionComponent } from 'react';

import { Switch } from '@headlessui/react';
import classNames from 'classnames';

interface Props {
    checked: boolean;
    srOnly: string;
    onChange: () => void;
    className?: string;
}

const Toggle: FunctionComponent<Props> = ({
    checked,
    srOnly,
    onChange,
    className
}) => {
    return (
        <div
            className={classNames(
                'flex flex-row items-center space-x-3',
                className
            )}
        >
            <Switch
                checked={checked}
                onChange={onChange}
                className={classNames(
                    'relative inline-flex items-center h-6 rounded-full w-11',
                    checked ? 'bg-blue-600' : 'bg-gray-200'
                )}
            >
                <span className="sr-only">{srOnly}</span>
                <span
                    className={`${
                        checked ? 'translate-x-6' : 'translate-x-1'
                    } inline-block w-4 h-4 transform bg-white rounded-full`}
                />
            </Switch>
            <p className="text-sm text-gray-300">
                {checked ? 'Enabled' : 'Disabled'}
            </p>
        </div>
    );
};

export default Toggle;
