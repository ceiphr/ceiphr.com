import { FunctionComponent, useEffect, useState } from 'react';

import classNames from 'classnames';
import { TbUserCircle as UserIcon } from 'react-icons/tb';
import rehypePrettyCode from 'rehype-pretty-code';
import html from 'rehype-stringify';
import { remark } from 'remark';
import markdown from 'remark-parse';
import rehype from 'remark-rehype';
import type { OpenAIMessage } from 'usellm';

import Logo from '@assets/icons/Logo';

// TODO Get syntax highlighting working

async function markdownToHtml(input: string): Promise<string> {
    const file = remark()
        .use(markdown)
        .use(rehype)
        .use(html)
        .use(rehypePrettyCode)
        .processSync(input);

    return file.toString();
}

const Message: FunctionComponent<
    OpenAIMessage & {
        typing?: boolean;
    }
> = ({ role, content, typing }) => {
    const [formattedContent, setFormattedContent] = useState<string>('');
    const Icon = () =>
        role === 'user' ? (
            <div className="sticky top-[4px] rounded-md border border-gray-700 bg-gray-800 p-1">
                <UserIcon className="text-gray-500 w-4 h-4" />
            </div>
        ) : (
            <div className="sticky top-[4px] rounded-md border border-blue-500 bg-gradient-to-br from-blue-600 to-blue-800 p-1">
                <Logo className="w-4 h-4 fill-blue-400" />
            </div>
        );

    useEffect(() => {
        const reformatContent = async () => {
            setFormattedContent(await markdownToHtml(content));
        };

        reformatContent();
    }, [content]);

    return (
        <div
            className={classNames(
                'flex flex-row',
                role === 'user' ? 'text-gray-500' : 'text-gray-300'
            )}
        >
            <span className="mr-3">
                <Icon />
            </span>
            <div
                className={classNames(
                    'opanai-message cursor',
                    typing && 'cursor'
                )}
                dangerouslySetInnerHTML={{
                    __html: formattedContent
                }}
            />
        </div>
    );
};

export default Message;
