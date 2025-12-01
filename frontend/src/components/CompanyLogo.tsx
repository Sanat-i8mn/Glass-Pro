
import React from 'react';

interface CompanyLogoProps {
  companyName: string;
}

const CompanyLogo: React.FC<CompanyLogoProps> = ({ companyName }) => {
  // Generate initials for fallback logo
  const initials = companyName
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);

  return (
    <div className="flex items-center">
      <div className="bg-primary text-primary-foreground h-12 w-12 rounded-md flex items-center justify-center font-bold text-xl">
        {initials}
      </div>
      <div className="ml-3">
        <h2 className="text-lg font-bold text-gray-800">{companyName}</h2>
        <p className="text-xs text-gray-600">Glass Invoice Generator</p>
      </div>
    </div>
  );
};

export default CompanyLogo;
