import { FunctionComponent } from 'react';

import { Listbox } from '@headlessui/react';
import classNames from 'classnames';

interface Props {
    options: {
        label: string;
        value: string;
    }[];
    selected: {
        label: string;
        value: string;
    };
    className?: string;
    onChange: (value: string) => void;
}

const Select: FunctionComponent<Props> = ({
    options,
    selected,
    onChange,
    className
}) => {
    return (
        <div className={classNames('w-full', className)}>
            <Listbox
                value={selected.value}
                onChange={() => {
                    onChange(selected.value);
                }}
            >
                <Listbox.Button>{selected.label}</Listbox.Button>
                <Listbox.Options>
                    {options.map((option) => (
                        <Listbox.Option key={option.value} value={option.value}>
                            {option.label}
                        </Listbox.Option>
                    ))}
                </Listbox.Options>
            </Listbox>
        </div>
    );
};

export default Select;
