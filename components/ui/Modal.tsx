import { Unbounded } from 'next/font/google';
import localFont from 'next/font/local';
import {
    Fragment,
    FunctionComponent,
    MutableRefObject,
    ReactNode,
    useState
} from 'react';

import { Dialog, Transition } from '@headlessui/react';
import classNames from 'classnames';
import { TbX as XIcon } from 'react-icons/tb';
import { Transform } from 'stream';

const unbounded = Unbounded({
    subsets: ['latin'],
    variable: '--font-unbounded'
});
const monocraft = localFont({
    src: '../../assets/fonts/Monocraft.ttf',
    variable: '--font-monocraft'
});

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
    const [scrollPos, setScrollPos] = useState(0);
    const handleScroll = (e: HTMLDivElement) => setScrollPos(e.scrollTop);
    const titleSize = 44 - scrollPos / 1.8;
    const titleTransform = 44 - scrollPos / 1.2;
    const scrolledHeader = scrollPos > 60;

    return (
        <Transition appear show={show} as={Fragment}>
            <Dialog
                initialFocus={initialFocus}
                as="div"
                className={classNames(
                    'relative z-10',
                    unbounded.variable,
                    monocraft.variable
                )}
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
                                        'absolute top-0 left-0 right-0 h-14 z-10 flex flex-row justify-between px-6 items-center border-b border-transparent duration-200',
                                        scrolledHeader &&
                                            '!border-gray-800 bg-black/75 backdrop-blur-lg'
                                    )}
                                >
                                    <Dialog.Title
                                        className="font-heading"
                                        style={{
                                            fontSize:
                                                titleSize < 18 ? 18 : titleSize,
                                            transform:
                                                titleTransform < 0
                                                    ? 'translateY(0)'
                                                    : `translateY(${titleTransform}px)`
                                        }}
                                    >
                                        {title || 'Modal'}
                                    </Dialog.Title>
                                    <button
                                        className={classNames(
                                            'text-gray-500 hover:text-gray-300',
                                            !scrolledHeader &&
                                                'absolute top-0 right-0 h-14 px-6'
                                        )}
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
                                    className="p-6 pt-20 overflow-y-auto"
                                >
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
