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
                    'relative inline-flex items-center h-6 rounded-full w-12',
                    checked ? 'bg-blue-600' : 'bg-gray-800'
                )}
            >
                <span className="sr-only">{srOnly}</span>
                <span
                    className={`${
                        checked ? 'translate-x-[26px]' : 'translate-x-0.5'
                    } inline-block w-5 h-5 transform bg-black rounded-full`}
                />
            </Switch>
            <p className="text-sm text-gray-400">
                {checked ? 'Enabled' : 'Disabled'}
            </p>
        </div>
    );
};

export default Toggle;
