import type { FunctionComponent } from 'react';

import SplineCanvas, { SplineProps } from '@splinetool/react-spline';

const Spline: FunctionComponent<SplineProps> = (props) => {
    return (
        <div className="w-full h-96 my-6 rounded-lg overflow-hidden bg-gray-900">
            <SplineCanvas {...props} />
        </div>
    );
};

export default Spline;
