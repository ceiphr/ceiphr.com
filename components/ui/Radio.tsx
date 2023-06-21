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
        <RadioGroup value={selected.value} onChange={onChange}>
            <RadioGroup.Label className="sr-only">{srOnly}</RadioGroup.Label>
            <div
                className={classNames(
                    'border border-gray-800 flex items-center w-fit leading-4 space-x-1 py-3 px-1.5 rounded-xl',
                    className
                )}
            >
                {options.map((option) => (
                    <RadioGroup.Option key={option.value} value={option.value}>
                        {({ checked }) => (
                            <span
                                className={classNames(
                                    'cursor-pointer rounded-lg py-1 px-2',
                                    checked && '!bg-gray-900 !cursor-default'
                                )}
                            >
                                {option.label}
                            </span>
                        )}
                    </RadioGroup.Option>
                ))}
            </div>
        </RadioGroup>
    );
};

export default Radio;
