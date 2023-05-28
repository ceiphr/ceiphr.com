import { FunctionComponent } from 'react';

import riveWASMResource from '@rive-app/canvas/rive.wasm';
import { RiveParameters, RuntimeLoader, useRive } from '@rive-app/react-canvas';

RuntimeLoader.setWasmUrl(riveWASMResource);

const Rive: FunctionComponent<RiveParameters> = (props) => {
    const { RiveComponent } = useRive({ autoplay: true, ...props });

    return (
        <RiveComponent className="w-full h-72 rounded-lg overflow-hidden bg-gray-900" />
    );
};

export default Rive;
