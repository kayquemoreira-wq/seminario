// Adoptails - Configuração do Tailwind CSS (carregar depois do CDN do Tailwind)
tailwind.config = {
    theme: {
        extend: {
            colors: {
                brand: {
                    50: '#fffaf0',
                    100: '#feebc8',
                    200: '#fbd38d',
                    500: '#f6ad55',
                    600: '#ed8936',
                    700: '#dd6b20',
                    800: '#c05621',
                },
                tealBrand: {
                    500: '#38b2ac',
                    600: '#319795',
                    700: '#2c7a7b',
                },
                warmGray: {
                    50: '#fafaf9',
                    100: '#f5f5f4',
                    200: '#e7e5e4',
                    800: '#292524',
                    900: '#1c1917'
                }
            },
            fontFamily: {
                title: ['Outfit', 'sans-serif'],
                body: ['Plus Jakarta Sans', 'sans-serif'],
            }
        }
    }
}
