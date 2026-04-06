/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./resources/**/*.blade.php",
    "./resources/**/*.js",
    "./resources/**/*.vue",
  ],
  theme: {
    extend: {
      colors: {
        'primary-blue': '#1e40af',
        'secondary-blue': '#3b82f6',
        'light-blue': '#60a5fa',
        'accent-blue': '#1d4ed8',
        'dark-blue': '#1e3a8a',
        'text-dark': '#1f2937',
        'text-light': '#6b7280',
        'surface': '#f8fafc',
        'border': '#e5e7eb'
      },
      fontFamily: {
        'inter': ['Inter', 'sans-serif']
      },
      animation: {
        'float-particle': 'float-particle linear infinite',
        'code-pulse': 'code-pulse 2s ease-in-out infinite',
        'underline-expand': 'underline-expand 2s cubic-bezier(0.4, 0, 0.2, 1) 1.5s forwards',
        'bounce': 'bounce 2s ease-in-out infinite',
        'geometric-float': 'geometric-float 20s ease-in-out infinite',
        'slideInLeft': 'slideInLeft 1s cubic-bezier(0.4, 0, 0.2, 1) 0.5s forwards',
        'slideInRight': 'slideInRight 1s cubic-bezier(0.4, 0, 0.2, 1) 0.7s forwards',
        'fadeInUp': 'fadeInUp 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards',
        'code-appear': 'code-appear 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards',
        'cursor-blink': 'cursor-blink 1s infinite',
        'pulse': 'pulse 2s ease-in-out infinite',
        'tech-float': 'tech-float 3s ease-in-out infinite',
        'testimonial-float': 'testimonial-float 4s ease-in-out infinite',
        'stats-bg': 'stats-bg 15s ease-in-out infinite'
      },
      keyframes: {
        'float-particle': {
          '0%': { transform: 'translateY(100vh) scale(0)', opacity: '0' },
          '10%': { opacity: '0.6' },
          '90%': { opacity: '0.6' },
          '100%': { transform: 'translateY(-10vh) scale(1)', opacity: '0' }
        },
        'code-pulse': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.1)' }
        },
        'underline-expand': {
          'to': { transform: 'scaleX(1)' }
        },
        'bounce': {
          '0%, 20%, 50%, 80%, 100%': { transform: 'translateY(0)' },
          '40%': { transform: 'translateY(-5px)' },
          '60%': { transform: 'translateY(-3px)' }
        },
        'geometric-float': {
          '0%, 100%': { transform: 'translateX(0) translateY(0) rotate(0deg)' },
          '33%': { transform: 'translateX(-20px) translateY(-30px) rotate(120deg)' },
          '66%': { transform: 'translateX(20px) translateY(-20px) rotate(240deg)' }
        },
        'slideInLeft': {
          'from': { opacity: '0', transform: 'translateX(-50px)' },
          'to': { opacity: '1', transform: 'translateX(0)' }
        },
        'slideInRight': {
          'from': { opacity: '0', transform: 'translateX(50px)' },
          'to': { opacity: '1', transform: 'translateX(0)' }
        },
        'fadeInUp': {
          'from': { opacity: '0', transform: 'translateY(30px)' },
          'to': { opacity: '1', transform: 'translateY(0)' }
        },
        'code-appear': {
          'to': { opacity: '1', transform: 'translateX(0)' }
        },
        'cursor-blink': {
          '0%, 50%': { opacity: '1' },
          '51%, 100%': { opacity: '0' }
        },
        'pulse': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' }
        },
        'tech-float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-5px)' }
        },
        'testimonial-float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-3px)' }
        },
        'stats-bg': {
          '0%, 100%': { transform: 'scale(1) rotate(0deg)' },
          '50%': { transform: 'scale(1.1) rotate(5deg)' }
        }
      }
    }
  },
  plugins: [],
}
