const tailwindcss = require('tailwindcss');
module.exports = {
    purge:{
        enabled: true,     // this will be enabled only if prod env
        content: [
            './src/**/*.js',
        ]
    },
    plugins: [
        tailwindcss('./tailwind.js'),
        require('autoprefixer')
    ],
    theme: {
        minHeight: {
            '0': '0',
            '1/4': '25%',
            '1/2': '50%',
            '3/4': '75%',
            'full': '100%'
        }
    }
};