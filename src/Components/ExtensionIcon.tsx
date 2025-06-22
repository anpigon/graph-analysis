import * as React from 'react';
import { isImg } from '../Utility';
import { DiHtml5 } from 'react-icons/di';
import {
  FaFile,
  FaFileAudio,
  FaFileCode,
  FaFileCsv,
  FaFileExcel,
  FaFileImage,
  FaFilePdf,
  FaFilePowerpoint,
  FaFileVideo,
  FaFileWord,
  FaStickyNote,
} from 'react-icons/fa';
import { ICON } from '../Constants';

interface ExtensionIconProps {
  path: string;
}

const ExtensionIcon: React.FC<ExtensionIconProps> = ({ path }) => {
  if (!path || path.endsWith('.md')) return null;

  if (isImg(path)) return <FaFileImage className={ICON} />;
  if (path.endsWith('.html')) return <DiHtml5 className={ICON} />;
  if (path.endsWith('.xls') || path.endsWith('.xlsx'))
    return <FaFileExcel className={ICON} />;
  if (path.endsWith('.csv')) return <FaFileCsv className={ICON} />;
  if (path.endsWith('.pdf')) return <FaFilePdf className={ICON} />;
  if (path.endsWith('.txt')) return <FaStickyNote className={ICON} />;
  if (path.endsWith('.mp3') || path.endsWith('.opus'))
    return <FaFileAudio className={ICON} />;
  if (path.endsWith('.mp4') || path.endsWith('.webm'))
    return <FaFileVideo className={ICON} />;
  if (path.endsWith('.docx') || path.endsWith('.doc'))
    return <FaFileWord className={ICON} />;
  if (path.endsWith('.ppt') || path.endsWith('.pptx'))
    return <FaFilePowerpoint className={ICON} />;
  if (
    path.endsWith('.js') ||
    path.endsWith('.ts') ||
    path.endsWith('.c') ||
    path.endsWith('.py')
  )
    return <FaFileCode className={ICON} />;

  return <FaFile className={ICON} />;
};

export default ExtensionIcon;
