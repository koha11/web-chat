import React from 'react'

type TypingIndicatorProps = {
  dotColor?: string
  dotSize?: number
  className?: string
}

export const TypingIndicator: React.FC<TypingIndicatorProps> = ({
  dotColor = 'bg-gray-400',
  dotSize = 2,
  className = '',
}) => {
  // We’ll stagger the animation for each dot
  const delays = ['0s', '0.2s', '0.4s']

  return (
    <div className={`flex items-center ${className}`}>
      {delays.map((delay, i) => (
        <span
          key={i}
          className={`
            ${dotColor} 
            rounded-full 
            inline-block 
            w-${dotSize} 
            h-${dotSize} 
            mr-1 
            animate-bounce
          `}
          style={{ animationDelay: delay }}
        />
      ))}
    </div>
  )
}