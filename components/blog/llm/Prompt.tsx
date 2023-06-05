import {
    FunctionComponent,
    useCallback,
    useEffect,
    useRef,
    useState
} from 'react';

import classNames from 'classnames';
import {
    TbInfoOctagon as InfoIcon,
    TbMicroscope as MicroscopeIcon,
    TbSend as SendIcon,
    TbX as XIcon
} from 'react-icons/tb';
import TextareaAutosize from 'react-textarea-autosize';
import useLLM, { OpenAIMessage } from 'usellm';

import Logo from '@assets/icons/Logo';
import Modal from '@components/Modal';
import Message from '@components/blog/llm/Message';
import Typed from '@components/blog/llm/Typed';

const createPrompt = (paragraphs: string[], question: string) => `
Read the following technical article and answer the question below.

--DOCUMENT BEGINS--

${paragraphs.join('\n\n')}

--DOCUMENT ENDS--

Question: ${question}
`;

// TODO https://github.com/usellm/usellm/blob/main/usellm.org/app/demo/document-qna/page.tsx
// TODO Add loading indicator
// TODO Add "stay at bottom" while outputting messages
// TODO Add remember scroll position when closing

const Prompt: FunctionComponent = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState('');
    const [history, setHistory] = useState<OpenAIMessage[]>([]);
    const [scrolled, setScrolled] = useState(false);
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const llm = useLLM({ serviceUrl: '/api/llm' });

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
    }, [handleSend, isOpen]);

    const handleScroll = (e: HTMLDivElement) => {
        if (!e) return;

        if (e.scrollTop > 0) setScrolled(true);
        else setScrolled(false);
    };

    return (
        <Modal
            initialFocus={inputRef}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            className="h-2xl flex flex-col"
        >
            <div
                className={classNames(
                    'fixed w-full duration-300 flex flex-row items-center justify-between z-10 px-6 py-5 border-b border-transparent text-gray-300',
                    scrolled &&
                        'bg-black/75 backdrop-blur-lg !py-4 !border-gray-800'
                )}
            >
                <h3 className="text-lg font-medium leading-6">
                    Artificial Reasoning Intelligence{' '}
                    <span className="ml-1 pl-1.5 pr-2.5 py-0.5 text-sm text-gray-500 rounded-full border border-gray-800">
                        <MicroscopeIcon className="inline-block w-4 h-4 mr-1 -translate-y-0.5" />
                        Experimental
                    </span>
                </h3>
                <button
                    className="duration-300 text-gray-500 hover:text-gray-300"
                    onClick={() => setIsOpen(false)}
                >
                    <XIcon className="w-5 h-5" />
                </button>
            </div>
            <div
                onScroll={(e) =>
                    handleScroll(e.currentTarget as HTMLDivElement)
                }
                className="px-6 pt-16 -mb-2 flex-grow overflow-y-auto"
            >
                <div className="space-y-4 pb-6">
                    {history.map((message, i) => (
                        <Message key={i} {...message} />
                    ))}
                    {history.length === 0 && (
                        <p className="text-gray-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                            <Typed string="Ask A.R.I. about this article." />
                            <Logo className="inline-block w-4 h-4 ml-1 fill-gray-400 transform -translate-y-0.5" />
                        </p>
                    )}
                </div>
            </div>
            <div className="px-6 pb-2">
                <div className="relative border rounded-lg border-gray-800 bg-black flex flex-col items-end">
                    <TextareaAutosize
                        ref={inputRef}
                        className="w-full placeholder-gray-700 bg-transparent resize-none focus:outline-none px-3 py-2"
                        maxRows={5}
                        placeholder="Send a message."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                    />
                    <button
                        disabled={input.length === 0}
                        onClick={handleSend}
                        className="duration-500 absolute bottom-0 p-1.5 m-1 bg-gray-800 rounded-md disabled:opacity-50 disabled:text-gray-500 disabled:hover:bg-gray-800 text-gray-300 hover:bg-gray-700 focus:outline-none"
                    >
                        <SendIcon className="w-5 h-5" />
                    </button>
                </div>
                <div className="flex flex-row justify-center py-2">
                    <p className="text-sm text-gray-600">
                        <InfoIcon className="inline-block mr-1 w-4 h-4 transform -translate-y-px" />
                        A.R.I. is powered by{' '}
                        <a
                            href="https://openai.com/blog/openai-api/"
                            target="_blank"
                            rel="noreferrer"
                            className="underline hover:text-gray-400"
                        >
                            ChatGPT 3.5
                        </a>{' '}
                        and may produce inaccurate information.
                    </p>
                </div>
            </div>
        </Modal>
    );
};

export default Prompt;
