import { FunctionComponent } from 'react';

import classNames from 'classnames';
import ArrowUp from 'pixelarticons/svg/arrow-up.svg';
import Work from 'pixelarticons/svg/briefcase-account.svg';
import Check from 'pixelarticons/svg/check.svg';
import ExternalLink from 'pixelarticons/svg/external-link.svg';
import Copy from 'pixelarticons/svg/file.svg';
import Heart from 'pixelarticons/svg/heart.svg';
import Keyboard from 'pixelarticons/svg/keyboard.svg';
import Message from 'pixelarticons/svg/message-text.svg';
import Location from 'pixelarticons/svg/pin.svg';
import Share from 'pixelarticons/svg/radio-signal.svg';
import Zap from 'pixelarticons/svg/zap.svg';

interface Props {
    className?: string;
    name:
        | 'arrow-up'
        | 'check'
        | 'copy'
        | 'work'
        | 'location'
        | 'heart'
        | 'share'
        | 'message'
        | 'external-link'
        | 'keyboard'
        | 'zap';
    size?: number;
}

const Icon: FunctionComponent<Props> = ({ className, name, size = 16 }) => {
    let SVGIcon = null;
    switch (name) {
        case 'arrow-up':
            SVGIcon = ArrowUp;
            break;
        case 'check':
            SVGIcon = Check;
            break;
        case 'copy':
            SVGIcon = Copy;
            break;
        case 'work':
            SVGIcon = Work;
            break;
        case 'location':
            SVGIcon = Location;
            break;
        case 'heart':
            SVGIcon = Heart;
            break;
        case 'share':
            SVGIcon = Share;
            break;
        case 'message':
            SVGIcon = Message;
            break;
        case 'external-link':
            SVGIcon = ExternalLink;
            break;
        case 'keyboard':
            SVGIcon = Keyboard;
            break;
        case 'zap':
            SVGIcon = Zap;
            break;
        default:
            throw new Error(`Icon ${name} not found`);
    }

    if (!SVGIcon) {
        return <></>;
    }

    return (
        <SVGIcon
            style={{
                width: size,
                height: size
            }}
            className={classNames('', className)}
        />
    );
};

export default Icon;
