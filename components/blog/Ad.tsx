import { useEffect } from 'react';

const SCRIPT_ID = '_carbonads_js';

const Ad = () => {
    useEffect(() => {
        // Check if the carbon ads script is already loaded or
        // if we're not in production.
        if (
            document.getElementById(SCRIPT_ID) ||
            process.env.NODE_ENV !== 'production'
        ) {
            return;
        }

        // Load the carbon ads script.
        const ad = document.getElementById('carbon');
        const script = document.createElement('script');
        script.async = true;
        script.id = '_carbonads_js';
        script.type = 'text/javascript';
        script.src = `//cdn.carbonads.com/carbon.js?serve=${process.env.NEXT_PUBLIC_CARBON_ADS_SCRIPT_ID}&placement=${process.env.NEXT_PUBLIC_CARBON_ADS_PLACEMENT}`;

        ad!.appendChild(script);
    }, []);

    return <div id="carbon" className="no-print" aria-hidden="true" />;
};

export default Ad;
