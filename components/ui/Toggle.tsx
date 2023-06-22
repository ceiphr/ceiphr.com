import { FunctionComponent } from 'react';

import { Switch } from '@headlessui/react';
import classNames from 'classnames';
import { TbLock as Lock } from 'react-icons/tb';

interface Props {
    checked: boolean;
    disabled?: boolean;
    srOnly: string;
    onChange: () => void;
    className?: string;
}

const Toggle: FunctionComponent<Props> = ({
    checked,
    disabled,
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
                disabled={disabled}
                checked={checked}
                onChange={onChange}
                className={classNames(
                    'relative inline-flex items-center h-6 rounded-full w-12',
                    checked ? 'bg-blue-600' : 'bg-gray-800',
                    disabled ? 'opacity-50' : 'opacity-100'
                )}
            >
                <span className="sr-only">{srOnly}</span>
                <span
                    className={classNames(
                        'inline-block w-5 h-5 transform bg-black rounded-full',
                        checked ? 'translate-x-[26px]' : 'translate-x-0.5'
                    )}
                />
            </Switch>
            <p className="text-sm text-gray-400 flex flex-row items-center">
                {disabled && <Lock className="inline-block mr-0.5" />}
                {checked ? 'Enabled' : 'Disabled'}
            </p>
        </div>
    );
};

export default Toggle;
