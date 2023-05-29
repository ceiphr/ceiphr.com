import type { FunctionComponent } from 'react';

import riveWASMResource from '@rive-app/canvas/rive.wasm';
import { RiveParameters, RuntimeLoader, useRive } from '@rive-app/react-canvas';
import classNames from 'classnames';

RuntimeLoader.setWasmUrl(riveWASMResource);

const Rive: FunctionComponent<RiveParameters & { className: string }> = (
    props
) => {
    const { RiveComponent } = useRive({ autoplay: true, ...props });

    return (
        <RiveComponent
            className={classNames(
                'w-full h-96 my-6 rounded-lg overflow-hidden bg-gray-900',
                props.className
            )}
        />
    );
};

export default Rive;
