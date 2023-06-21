import {
    Fragment,
    FunctionComponent,
    MutableRefObject,
    ReactNode,
    useEffect,
    useState
} from 'react';

import { Dialog, Transition } from '@headlessui/react';
import classNames from 'classnames';
import { TbX as XIcon } from 'react-icons/tb';

interface Props {
    children?: ReactNode;
    title?: string;
    show: boolean;
    onClose: () => void;
    className?: string;
    initialFocus?: MutableRefObject<HTMLElement | null>;
}

const Modal: FunctionComponent<Props> = ({
    children,
    title,
    show,
    onClose,
    className,
    initialFocus
}) => {
    const [scrolled, setScrolled] = useState(false);

    const handleScroll = (e: HTMLDivElement) => {
        const HEADER_OFFSET = 36;
        if (e.scrollTop > HEADER_OFFSET) setScrolled(true);
        else setScrolled(false);
    };

    useEffect(() => {
        if (!show) setScrolled(false);
    }, [show]);

    return (
        <Transition appear show={show} as={Fragment}>
            <Dialog
                initialFocus={initialFocus}
                as="div"
                className="relative z-10"
                onClose={onClose}
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
                                <div
                                    className={classNames(
                                        'absolute z-20 top-0 left-0 right-0 h-14 flex flex-row justify-between px-6 items-center border-b border-transparent duration-300 bg-black',
                                        scrolled &&
                                            '!border-gray-800 !bg-black/75 backdrop-blur-lg'
                                    )}
                                >
                                    <Dialog.Title
                                        className={classNames(
                                            'text-lg font-bold duration-300',
                                            !scrolled && 'text-transparent'
                                        )}
                                    >
                                        {title || 'Modal'}
                                    </Dialog.Title>
                                    <button
                                        className="text-gray-500 hover:text-gray-300"
                                        onClick={onClose}
                                    >
                                        <XIcon className="w-5 h-5" />
                                    </button>
                                </div>
                                <div
                                    onScroll={(e) =>
                                        handleScroll(
                                            e.currentTarget as HTMLDivElement
                                        )
                                    }
                                    className="p-6 pt-16 pb-12 overflow-y-auto"
                                >
                                    <h1 className="text-4xl font-heading mb-3">
                                        {title || 'Modal'}
                                    </h1>
                                    {children}
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};

export default Modal;
