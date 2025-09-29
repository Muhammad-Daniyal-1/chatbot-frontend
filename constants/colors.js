// Chat component color constants
export const CHAT_COLORS = {
  // User message bubble gradient
  userMessage: {
    start: '#4452F9',  // Main blue
    end: '#6B73FF'     // Lighter blue
  },
  
  // Suggested questions
  suggestedQuestions: {
    default: 'bg-[#e0e0e0]',  // Light gray
    hover: 'bg-gradient-to-r from-[#4452F9] to-[#6B73FF] text-white',
    loading: {
      start: '#4452F9',  // Main blue
      end: '#6B73FF'     // Lighter blue
    }
  },
  
  // Loading animation classes
  loadingAnimation: {
    gradient: 'from-[#4452F9] via-[#6B73FF] to-[#8B9FFF]',
    glow: 'bg-[radial-gradient(circle,rgba(255,255,255,0.3)_0%,transparent_70%)]',
    blur: 'blur-[5px]',
    opacity: 'opacity-50'
  },

  // Loading dots animation
  loadingDots: {
    gradient: {
      start: '#4452F9',  // Main blue
      end: '#6B73FF'     // Lighter blue
    },
    className: 'bg-gradient-to-r from-[#4452F9] to-[#6B73FF]'
  }
}; 