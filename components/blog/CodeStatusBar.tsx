import { FunctionComponent } from 'react';

import classNames from 'classnames';
import {
    SiHtml5 as HtmlIcon,
    SiJavascript as JavascriptIcon,
    SiMarkdown as MarkdownIcon,
    SiMdx as MdxIcon,
    SiGnubash as ShellIcon,
    SiTypescript as TypescriptIcon
} from 'react-icons/si';
import {
    TbFileText as PlainTextIcon,
    TbBrandReact as ReactIcon
} from 'react-icons/tb';

import CopyButton from './CopyButton';

interface Props {
    value: string;
    language: string;
    path: string;
    className?: string;
}

const CodeStatusBar: FunctionComponent<Props> = ({
    value,
    language,
    path,
    className
}) => {
    let Icon = null;
    switch (language) {
        case 'html':
            Icon = HtmlIcon;
            break;
        case 'js':
            Icon = JavascriptIcon;
            break;
        case 'tsx':
        case 'jsx':
            Icon = ReactIcon;
            break;
        case 'md':
            Icon = MarkdownIcon;
            break;
        case 'mdx':
            Icon = MdxIcon;
            break;
        case 'sh':
            Icon = ShellIcon;
            break;
        case 'txt':
            Icon = PlainTextIcon;
            break;
        case 'ts':
            Icon = TypescriptIcon;
            break;
        default:
            Icon = PlainTextIcon;
            break;
    }

    return (
        <div
            className={classNames(
                'flex flex-row justify-between py-3 px-4 w-full border-b border-gray-800 text-gray-400',
                className
            )}
        >
            <div className="flex flex-row">
                <Icon className="mr-2 w-5 h-5" />
                <span className="mr-2 text-gray-500">{path}</span>
            </div>
            <div className="flex flex-row">
                <CopyButton className="w-5 h-5" value={value} />
            </div>
        </div>
    );
};

export default CodeStatusBar;
