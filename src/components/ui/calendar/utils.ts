
// Helper function to generate crew letter codes
export const getCrewLetterCode = (index: number): string => {
  // For the first 26 crews, use A-Z
  if (index < 26) {
    return String.fromCharCode(65 + index); // A = 65 in ASCII
  } 
  
  // For crews beyond 26, use A2, B2, C2, etc.
  const cycle = Math.floor(index / 26);
  const letter = String.fromCharCode(65 + (index % 26));
  return `${letter}${cycle + 1}`;
};

// Type guard to check if a value is a Date object
export const isDateObject = (value: any): value is Date => {
  return value instanceof Date;
};

// Helper function to resolve props for DayPicker
export const resolveProps = (props: any) => {
  // Extract and prepare class names, components, and styles from props
  const classNames = props.classNames || {};
  const components = props.components || {};
  const styles = props.styles || {};
  
  return { classNames, components, styles };
};
