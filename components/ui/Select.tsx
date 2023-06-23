import { FunctionComponent } from 'react';

import { Listbox } from '@headlessui/react';
import classNames from 'classnames';
import { TbCheck as Check, TbSelector as Selector } from 'react-icons/tb';

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
        <Listbox value={selected.value} onChange={onChange}>
            {({ open }) => (
                <div className={classNames('w-full relative', className)}>
                    <Listbox.Button
                        className={classNames(
                            'px-2 py-1 rounded-xl border border-gray-800 flex flex-row justify-between items-center w-28',
                            open && '!rounded-b-none'
                        )}
                    >
                        {selected.label}
                        <Selector className="inline-block" />
                    </Listbox.Button>

                    <Listbox.Options className="absolute z-10 space-y-1 px-2 pt-1 pb-2 w-28 bg-black rounded-b-xl border-x border-b border-gray-800">
                        {options.map((option) => (
                            <Listbox.Option
                                key={option.value}
                                value={option.value}
                                className={({ selected }) =>
                                    classNames(
                                        'cursor-pointer w-full',
                                        selected && '!cursor-default'
                                    )
                                }
                            >
                                {({ selected }) => (
                                    <span className="flex flex-row items-center justify-between">
                                        {option.label}
                                        {selected && (
                                            <Check className="inline-block" />
                                        )}
                                    </span>
                                )}
                            </Listbox.Option>
                        ))}
                    </Listbox.Options>
                </div>
            )}
        </Listbox>
    );
};

export default Select;
