import { FunctionComponent } from 'react';

import { RadioGroup } from '@headlessui/react';
import classNames from 'classnames';

interface Props {
    srOnly: string;
    className?: string;
    options: {
        label: string;
        value: string;
    }[];
    selected: {
        label: string;
        value: string;
    };
    onChange: (value: string) => void;
}

const Radio: FunctionComponent<Props> = ({
    srOnly,
    className,
    options,
    selected,
    onChange
}) => {
    return (
        <RadioGroup
            value={selected}
            onChange={() => {
                onChange(selected.value);
            }}
            className={classNames(
                'bg-gray-900 rounded-xl p-1 w-fit flex flex-row items-center space-x-1',
                className
            )}
        >
            <RadioGroup.Label className="sr-only">{srOnly}</RadioGroup.Label>
            {options.map((option) => (
                <RadioGroup.Option key={option.value} value={option.value}>
                    {({ checked }) => (
                        <span
                            className={classNames(
                                'rounded-lg px-3 py-1 text-sm font-semibold',
                                checked && '!bg-gray-800'
                            )}
                        >
                            {option.label}
                        </span>
                    )}
                </RadioGroup.Option>
            ))}
        </RadioGroup>
    );
};

export default Radio;
