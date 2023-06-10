import { Unbounded } from 'next/font/google';
import localFont from 'next/font/local';
import {
    Fragment,
    FunctionComponent,
    MutableRefObject,
    ReactNode
} from 'react';

import { Dialog, Transition } from '@headlessui/react';
import classNames from 'classnames';

const unbounded = Unbounded({
    subsets: ['latin'],
    variable: '--font-unbounded'
});
const monocraft = localFont({
    src: '../assets/fonts/Monocraft.ttf',
    variable: '--font-monocraft'
});

interface Props {
    children: ReactNode;
    className?: string;
    isOpen: boolean;
    initialFocus?: MutableRefObject<HTMLElement | null>;
    setClosed: () => void;
}

const Modal: FunctionComponent<Props> = ({
    children,
    className,
    isOpen,
    initialFocus,
    setClosed
}) => {
    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog
                initialFocus={initialFocus}
                as="div"
                className={classNames(
                    'relative z-10',
                    unbounded.variable,
                    monocraft.variable
                )}
                onClose={setClosed}
            >
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel
                                className={classNames(
                                    className,
                                    'w-full max-w-2xl transform overflow-hidden rounded-2xl border border-gray-800 bg-black text-left align-middle shadow-xl transition-all'
                                )}
                            >
                                {children}
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};

export default Modal;
