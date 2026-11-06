import React from 'react';
import { AssessmentPackage } from '../types';
import { DirectCbtModal } from './DirectCbtModal';

interface StudentSimulatorProps {
  packageData: AssessmentPackage;
  onClose: () => void;
  onOpenGrading?: () => void;
  onOpenShareCbt?: () => void;
}

export const StudentSimulator: React.FC<StudentSimulatorProps> = (props) => {
  return <DirectCbtModal {...props} />;
};
