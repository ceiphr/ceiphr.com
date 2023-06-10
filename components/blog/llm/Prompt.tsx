import {
    FunctionComponent,
    useCallback,
    useContext,
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
import Typed from 'typed.js';
import useLLM, { OpenAIMessage } from 'usellm';

import Logo from '@assets/icons/Logo';
import Modal from '@components/Modal';
import Message from '@components/blog/llm/Message';
import { ActionStatesContext, ActionTypes } from '@contexts/blog/useActions';

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
// TODO Fix extra newline in textarea

const Prompt: FunctionComponent = () => {
    const {
        actionStates: { promptIsOpen = false },
        dispatch
    } = useContext(ActionStatesContext);
    const [input, setInput] = useState('');
    const [history, setHistory] = useState<OpenAIMessage[]>([]);
    const [typing, setTyping] = useState(false);
    const [scrollPosition, setScrollPosition] = useState(0);
    const initialMessageRef = useRef<HTMLDivElement>(null);
    const messageFeedRef = useRef<HTMLDivElement>(null);
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
            onStream: ({ message, isFirst, isLast }) => {
                if (isFirst) setTyping(true);
                else if (isLast) setTyping(false);

                setHistory([...newHistory, message]);
            }
        });
    }, [input, history, llm]);

    const handleScroll = (e: HTMLDivElement) => {
        if (!e) return;

        if (e.scrollTop > 0) setScrollPosition(e.scrollTop);
        else setScrollPosition(0);
    };

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

                dispatch({
                    type: ActionTypes.SET_PROMPT
                });
            }
        }
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [handleSend, dispatch]);

    useEffect(() => {
        if (!messageFeedRef.current) return;

        if (typing)
            messageFeedRef.current.scrollTop =
                messageFeedRef.current.scrollHeight;
    }, [typing]);

    // TODO Check if this works
    useEffect(() => {
        // Load previous scroll position
        if (!messageFeedRef.current) return;

        messageFeedRef.current.scrollTop = scrollPosition;

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [promptIsOpen, messageFeedRef]);

    useEffect(() => {
        const INIT_MESSAGE = 'Ask A.R.I. about this article.';

        // Delay for two reasons:
        // 1. To allow the modal to transition in
        // 2. To allow the ref to be set
        setTimeout(() => {
            if (!initialMessageRef.current) return;

            const typed = new Typed(initialMessageRef.current, {
                strings: [INIT_MESSAGE],
                typeSpeed: 80,
                showCursor: false,
                startDelay: 700,
                onComplete: () => {
                    setTimeout(() => {
                        initialMessageRef.current?.classList.remove(
                            'blinking-cursor'
                        );
                        initialMessageRef.current?.classList.add('mr-2');
                    }, 1000);
                }
            });

            return () => {
                typed.destroy();
            };
        }, 300);
    }, [initialMessageRef, promptIsOpen]);

    return (
        <Modal
            initialFocus={inputRef}
            isOpen={promptIsOpen}
            setClosed={() =>
                dispatch({ type: ActionTypes.SET_PROMPT, payload: false })
            }
            className="h-2xl flex flex-col"
        >
            <div
                className={classNames(
                    'fixed w-full duration-300 flex flex-row items-center justify-between z-10 px-6 py-5 border-b border-transparent text-gray-300',
                    scrollPosition !== 0 &&
                        'bg-black/75 backdrop-blur-lg !py-4 !border-gray-800'
                )}
            >
                <h3 className="text-lg font-medium leading-6">
                    <Logo className="inline-block !w-4 !h-4 mr-2 transform -translate-y-px" />
                    Artificial Reasoning Intelligence{' '}
                    <span className="ml-1 pl-1.5 pr-2.5 py-0.5 text-sm text-gray-500 rounded-full border border-gray-800">
                        <MicroscopeIcon className="inline-block w-4 h-4 mr-1 -translate-y-0.5" />
                        Experimental
                    </span>
                </h3>
                <button
                    className="duration-300 text-gray-500 hover:text-gray-300"
                    onClick={() => dispatch({ type: ActionTypes.SET_PROMPT })}
                >
                    <XIcon className="w-5 h-5" />
                </button>
            </div>
            <div
                ref={messageFeedRef}
                onScroll={(e) =>
                    handleScroll(e.currentTarget as HTMLDivElement)
                }
                className="px-6 pt-16 -mb-2 flex-grow overflow-y-auto"
            >
                <div className="space-y-4 pb-6">
                    {history.map((message, i) => (
                        <Message
                            key={i}
                            {...message}
                            typing={typing && i === history.length - 1}
                        />
                    ))}
                    {history.length === 0 && (
                        <p className="text-gray-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                            <span
                                ref={initialMessageRef}
                                className="blinking-cursor"
                            />
                        </p>
                    )}
                </div>
            </div>
            <div className="px-6 pb-2">
                <div className="relative border rounded-lg border-gray-800 bg-black flex flex-col items-end">
                    <TextareaAutosize
                        ref={inputRef}
                        className="w-full placeholder-gray-700 bg-transparent resize-none focus:outline-none px-3 py-2 h-10"
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
