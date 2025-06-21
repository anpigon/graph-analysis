import * as React from 'react';

interface ExtensionIconProps {
  path: string;
}

const ExtensionIcon: React.FC<ExtensionIconProps> = ({ path }) => {
  if (!path) return null;

  const fileExt = path.split('.').pop()?.toLowerCase();
  let iconClass = 'file-icon';

  switch (fileExt) {
    case 'md':
      iconClass += ' svg-icon svg-markdown';
      break;
    case 'png':
    case 'jpg':
    case 'jpeg':
    case 'gif':
      iconClass += ' svg-icon svg-image';
      break;
    case 'pdf':
      iconClass += ' svg-icon svg-pdf';
      break;
    default:
      iconClass += ' svg-icon svg-text';
  }

  return <span className={iconClass}></span>;
};

export default ExtensionIcon;
