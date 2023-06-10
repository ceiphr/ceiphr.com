import { FunctionComponent } from 'react';

import classNames from 'classnames';
import {
    TbCreativeCommons,
    TbCreativeCommonsBy,
    TbCreativeCommonsNc,
    TbCreativeCommonsNd,
    TbCreativeCommonsOff,
    TbCreativeCommonsSa,
    TbCreativeCommonsZero,
    TbNoCreativeCommons
} from 'react-icons/tb';
import { Tooltip } from 'react-tooltip';

interface Props {
    license: string;
    className?: string;
}

const License: FunctionComponent<Props> = ({
    license: ProvidedLicense,
    className
}) => {
    const license = ProvidedLicense.toLowerCase();
    const url = `https://creativecommons.org/licenses/${license}/4.0`;
    const elements = new Set(license.toLowerCase().split('-'));

    // Get license name
    let name = '';
    elements.forEach((element) => {
        switch (element) {
            case 'by':
                name += 'Attribution';
                break;
            case 'nc':
                name += 'NonCommercial';
                break;
            case 'nd':
                name += 'NoDerivatives';
                break;
            case 'sa':
                name += 'ShareAlike';
                break;
            case 'zero':
                name += 'Zero';
                break;
            default:
                break;
        }
        name += '-';
    });

    // Remove trailing dash
    name = name.slice(0, -1);

    if (license === 'none') {
        return (
            <div className={className}>
                No license. <TbNoCreativeCommons className="inline-block" />
            </div>
        );
    }

    return (
        <>
            <Tooltip id="license-details" place="bottom">
                Except where otherwise noted, this work is licensed under a{' '}
                {name} International License.
            </Tooltip>
            <a
                className={classNames('hover:underline', className)}
                data-tooltip-id="license-details"
                href={url}
                target="_blank"
                rel="noopener noreferrer"
            >
                CC {ProvidedLicense} 4.0{' '}
                <span className="inline-block transform -translate-y-0.5">
                    <TbCreativeCommons className="inline-block" />
                    {Array.from(elements).map((element, index) => {
                        const props = {
                            key: `${element}-${index}`,
                            className: 'inline-block'
                        };

                        switch (element) {
                            case 'by':
                                return <TbCreativeCommonsBy {...props} />;
                            case 'nc':
                                return <TbCreativeCommonsNc {...props} />;
                            case 'nd':
                                return <TbCreativeCommonsNd {...props} />;
                            case 'sa':
                                return <TbCreativeCommonsSa {...props} />;
                            case 'zero':
                                return <TbCreativeCommonsZero {...props} />;
                            case 'off':
                                return <TbCreativeCommonsOff {...props} />;
                            default:
                                return <></>;
                        }
                    })}
                </span>
            </a>
        </>
    );
};

export default License;
