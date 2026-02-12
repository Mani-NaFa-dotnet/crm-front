import React from 'react';

/**
 * Card Component - Reusable card with consistent styling
 * @param {Object} props
 * @param {React.ReactNode} props.children - Card content
 * @param {string} props.title - Optional card title
 * @param {string} props.className - Additional CSS classes
 * @param {React.ReactNode} props.header - Custom header content
 * @param {boolean} props.hoverable - Enable hover effect
 */
export const Card = ({ 
  children, 
  title, 
  className = '', 
  header,
  hoverable = false,
  ...props 
}) => {
  return (
    <div 
      className={`
        bg-white rounded-lg shadow-sm border border-gray-200
        ${hoverable ? 'transition-shadow hover:shadow-md' : ''}
        ${className}
      `}
      {...props}
    >
      {(title || header) && (
        <div className="px-6 py-4 border-b border-gray-200">
          {header || <h3 className="text-lg font-semibold text-gray-900">{title}</h3>}
        </div>
      )}
      <div className="p-6">
        {children}
      </div>
    </div>
  );
};

/**
 * Stats Card - Display statistics with icon
 */
export const StatsCard = ({ 
  title, 
  value, 
  change, 
  icon,
  trend = 'neutral', // 'up' | 'down' | 'neutral'
  className = '' 
}) => {
  const trendColors = {
    up: 'text-green-600 bg-green-50',
    down: 'text-red-600 bg-red-50',
    neutral: 'text-gray-600 bg-gray-50',
  };

  return (
    <Card className={`${className}`} hoverable>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {change && (
            <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-2 ${trendColors[trend]}`}>
              {trend === 'up' && '↑'}
              {trend === 'down' && '↓'}
              {change}
            </div>
          )}
        </div>
        {icon && (
          <div className="ml-4 p-3 bg-primary-50 rounded-lg">
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
};

export default Card;
