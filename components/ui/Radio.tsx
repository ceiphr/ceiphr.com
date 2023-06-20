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
        <div className={classNames('w-full', className)}>
            <RadioGroup
                value={selected}
                onChange={() => {
                    onChange(selected.value);
                }}
            >
                <RadioGroup.Label className="sr-only">
                    {srOnly}
                </RadioGroup.Label>
                {options.map((option) => (
                    <RadioGroup.Option
                        key={option.value}
                        value={option.value}
                        className="flex items-center space-x-3"
                    >
                        {({ checked }) => (
                            <span className={checked ? 'bg-blue-200' : ''}>
                                {option.label}
                            </span>
                        )}
                    </RadioGroup.Option>
                ))}
            </RadioGroup>
        </div>
    );
};

export default Radio;
