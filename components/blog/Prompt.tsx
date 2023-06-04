import {
    Fragment,
    FunctionComponent,
    useCallback,
    useEffect,
    useRef,
    useState
} from 'react';

import { Dialog, Transition } from '@headlessui/react';
import { TbSend as SendIcon } from 'react-icons/tb';
import useLLM, { OpenAIMessage } from 'usellm';

const createPrompt = (paragraphs: string[], question: string) => `
Read the following technical article and answer the question below.

--DOCUMENT BEGINS--

${paragraphs.join('\n\n')}

--DOCUMENT ENDS--

Question: ${question}
`;

interface ExpandingTextareaProps {
    input: string;
    handleInput: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

// TODO Get the textarea to expand and shrink based on the content
const ExpandingTextarea: FunctionComponent<ExpandingTextareaProps> = ({
    input,
    handleInput
}) => {
    const DEFAULT_HEIGHT = 32,
        MAX_HEIGHT = 128;
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    return (
        <textarea
            ref={textareaRef}
            onChange={handleInput}
            value={input}
            placeholder="Ask ChatGPT about this article..."
            className="w-full h-full overflow-hidden placeholder-gray-700 bg-transparent resize-none focus:outline-none px-3 py-2"
        />
    );
};

interface ModalProps {
    children: React.ReactNode;
}

const Modal: FunctionComponent<ModalProps> = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        function handleKeyDown(e: KeyboardEvent) {
            // Check if either ctrl or cmd is pressed along with 'k'
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                setIsOpen((isOpen) => !isOpen);
            }
        }
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog
                as="div"
                className="relative z-10"
                onClose={() => setIsOpen(false)}
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
                            <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl border border-gray-800 bg-black p-6 text-left align-middle shadow-xl transition-all">
                                {children}
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};

const Prompt = () => {
    const [input, setInput] = useState('');
    const [history, setHistory] = useState<OpenAIMessage[]>([]);
    const llm = useLLM({ serviceUrl: '/api/llm' });

    const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInput(e.target.value);
    };

    const handleSend = useCallback(() => {
        if (input.length === 0) return;

        const newHistory: OpenAIMessage[] = [
            ...history,
            { role: 'user', content: input }
        ];
        setHistory(newHistory);
        setInput('');

        llm.chat({
            messages: newHistory,
            stream: true,
            onStream: ({ message }) => setHistory([...newHistory, message])
        });
    }, [input, history, llm]);

    useEffect(() => {
        function handleKeyDown(e: KeyboardEvent) {
            // Check if the enter key is pressed
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
            }
        }
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [handleSend]);

    return (
        <Modal>
            <Dialog.Title
                as="h3"
                className="text-lg font-medium leading-6 text-gray-300"
            >
                ChatGPT{' '}
                <code className="ml-1 px-1 py-0.5 bg-gray-900 border-gray-800 border rounded-md">
                    3.5
                </code>
            </Dialog.Title>
            <div className="mt-2">
                {history.map((message, i) => (
                    <p key={`message-${i}`} className="text-sm text-gray-500">
                        {message.role === 'user' ? (
                            <span className="text-gray-300">You: </span>
                        ) : (
                            <span className="text-gray-400">ChatGPT: </span>
                        )}
                        {message.content}
                    </p>
                ))}
            </div>
            <div className="relative mt-4 border rounded-lg border-gray-800 flex flex-col flex-grow items-end">
                <ExpandingTextarea input={input} handleInput={handleInput} />
                <button
                    disabled={input.length === 0}
                    className="duration-500 absolute bottom-0 p-2 m-1 bg-gray-800 rounded-md disabled:opacity-50 disabled:text-gray-500 disabled:hover:bg-gray-800 text-gray-300 hover:bg-gray-700 focus:outline-none"
                >
                    <SendIcon className="w-5 h-5" />
                </button>
            </div>
        </Modal>
    );
};

export default Prompt;
