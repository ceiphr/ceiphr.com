import { useCallback, useEffect, useState } from 'react';

import classNames from 'classnames';
import { TbSend as SendIcon, TbUserCircle as UserIcon } from 'react-icons/tb';
import TextareaAutosize from 'react-textarea-autosize';
import useLLM, { OpenAIMessage } from 'usellm';

import Logo from '@assets/icons/Logo';
import Modal from '@components/Modal';

// TODO https://github.com/usellm/usellm/blob/main/usellm.org/app/demo/document-qna/page.tsx
// TODO Add markdown support

const createPrompt = (paragraphs: string[], question: string) => `
Read the following technical article and answer the question below.

--DOCUMENT BEGINS--

${paragraphs.join('\n\n')}

--DOCUMENT ENDS--

Question: ${question}
`;

const Message = ({ role, content }: OpenAIMessage) => {
    const iconProps = {
        className: 'text-gray-500 w-5 h-6'
    };
    const Icon = () =>
        role === 'user' ? <UserIcon {...iconProps} /> : <Logo {...iconProps} />;

    return (
        <p
            className={classNames(
                'flex flex-row',
                role === 'user' && 'text-gray-500'
            )}
        >
            <span className="mr-2">
                <Icon />
            </span>
            {content}
        </p>
    );
};

const Prompt = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState('');
    const [history, setHistory] = useState<OpenAIMessage[]>([]);
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
                setIsOpen(!isOpen);
            }
        }
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [handleSend, isOpen]);

    return (
        <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
            <h3 className="text-lg font-medium leading-6 text-gray-300">
                Ask A.R.I. (Artificial Reasoning Intelligence) about this
                article.
            </h3>
            <div className="mt-2">
                {history.map((message, i) => (
                    <Message key={i} {...message} />
                ))}
            </div>
            <div className="flex flex-row justify-center pt-2 pb-5 -mb-2 bg-gradient-to-t from-5% from-black">
                <p className="text-sm text-gray-600">
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
            <div className="relative border rounded-lg border-gray-800 flex flex-col flex-grow items-end">
                <TextareaAutosize
                    className="w-full placeholder-gray-700 bg-transparent resize-none focus:outline-none px-3 py-2"
                    maxRows={5}
                    placeholder="Send a message..."
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
        </Modal>
    );
};

export default Prompt;
