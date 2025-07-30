export const theme = {
  colors: {
    primary: {
      light: '#6366f1',
      main: '#4f46e5',
      dark: '#4338ca',
    },
    secondary: {
      light: '#f43f5e',
      main: '#e11d48',
      dark: '#be123c',
    },
    background: {
      light: '#ffffff',
      dark: '#111827',
    },
    text: {
      light: '#1f2937',
      dark: '#f3f4f6',
    },
    card: {
      light: 'rgba(255, 255, 255, 0.8)',
      dark: 'rgba(17, 24, 39, 0.8)',
    }
  },
  transitions: {
    default: 'all 0.3s ease',
    smooth: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
    bounce: 'all 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
  }
};
