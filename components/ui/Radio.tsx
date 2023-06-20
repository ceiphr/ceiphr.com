import { FunctionComponent } from 'react';

import { RadioGroup } from '@headlessui/react';

interface Props {
    srOnly: string;
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
        >
            <RadioGroup.Label className="sr-only">{srOnly}</RadioGroup.Label>
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
    );
};

export default Radio;
