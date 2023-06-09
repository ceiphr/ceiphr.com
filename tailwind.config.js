/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class',
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './content/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}'
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['var(--font-inter)'],
                body: ['var(--font-inter)'],
                mono: ['var(--font-monocraft)'],
                display: ['var(--font-unbounded)'],
                heading: ['var(--font-unbounded)'],
                accent: ['var(--font-monocraft)'],
                alt: ['var(--font-alternate)']
            },
            maxHeight: {
                lg: '32rem',
                xl: '36rem',
                '2xl': '42rem',
                '3xl': '48rem',
                '4xl': '54rem',
                '5xl': '60rem',
                '6xl': '66rem',
                '7xl': '72rem'
            },
            height: {
                lg: '32rem',
                xl: '36rem',
                '2xl': '42rem',
                '3xl': '48rem',
                '4xl': '54rem',
                '5xl': '60rem',
                '6xl': '66rem',
                '7xl': '72rem'
            },
            colors: {
                current: 'currentColor'
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'gradient-conic':
                    'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))'
            }
        }
    },
    plugins: []
};
