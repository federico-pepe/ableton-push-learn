// Bootstrap color mode switcher
    (() => {
    'use strict'

    const getStoredTheme = () => localStorage.getItem('theme')
    const setStoredTheme = theme => localStorage.setItem('theme', theme)

    const getPreferredTheme = () => {
        const storedTheme = getStoredTheme()
        if (storedTheme) {
        return storedTheme
        }

        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }

    const setTheme = theme => {
        if (theme === 'auto') {
        document.documentElement.setAttribute('data-bs-theme', (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'))
        } else {
        document.documentElement.setAttribute('data-bs-theme', theme)
        }
    }

    setTheme(getPreferredTheme())

    const showActiveTheme = (theme, focus = false) => {
        const themeSwitchers = document.querySelectorAll('[data-bs-theme-value]')
        if (themeSwitchers.length === 0) {
        return
        }

        themeSwitchers.forEach(element => {
        element.classList.remove('active')
        element.setAttribute('aria-pressed', 'false')
        })

        const btnToActive = document.querySelector(`[data-bs-theme-value="${theme}"]`)
        if (btnToActive) {
        btnToActive.classList.add('active')
        btnToActive.setAttribute('aria-pressed', 'true')
        if (focus) {
            btnToActive.focus()
        }
        }
    }

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
        const storedTheme = getStoredTheme()
        if (storedTheme !== 'light' && storedTheme !== 'dark') {
        setTheme(getPreferredTheme())
        }
    })

    window.addEventListener('DOMContentLoaded', () => {
        const themeSwitcher = document.getElementById('themeSwitcher');
        const currentTheme = getPreferredTheme();

        // 1. Set initial state of the checkbox
        if (themeSwitcher) {
            themeSwitcher.checked = currentTheme === 'dark';

            // 2. Listen for the toggle change
            themeSwitcher.addEventListener('change', () => {
                const newTheme = themeSwitcher.checked ? 'dark' : 'light';
                setStoredTheme(newTheme);
                setTheme(newTheme);
            });
        }

        // Optional: Keep the theme synced if system preferences change
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            const storedTheme = getStoredTheme();
            if (!storedTheme) {
                const newTheme = e.matches ? 'dark' : 'light';
                setTheme(newTheme);
                if(themeSwitcher) themeSwitcher.checked = e.matches;
            }
        });
    });
})()
