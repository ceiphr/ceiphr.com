import { FunctionComponent } from 'react';

import classNames from 'classnames';
import Work from 'pixelarticons/svg/briefcase-account.svg';
import Check from 'pixelarticons/svg/check.svg';
import Copy from 'pixelarticons/svg/file.svg';
import Location from 'pixelarticons/svg/pin.svg';

interface Props {
    className?: string;
    name: 'check' | 'copy' | 'work' | 'location';
    size?: number;
}

const Icon: FunctionComponent<Props> = ({ className, name, size = 24 }) => {
    let SVGIcon = null;
    switch (name) {
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
            className={classNames(
                'p-0.5 transform -translate-y-[2px] -translate-x-[2px]',
                className
            )}
        />
    );
};

export default Icon;
