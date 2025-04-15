import Label from './Label';
import { InputHTMLAttributes, ReactElement } from 'react';

const FormField = ({
  label,
  children,
}: {
  label: string;
  children: ReactElement<InputHTMLAttributes<HTMLInputElement>>;
}) => (
  <div className="mb-4 grid">
    <div>
      <Label htmlFor={children.props.id}>{label}</Label>
      {children.props.required && (
        <span className="font-bold text-pink-700">*</span>
      )}
    </div>
    {children}
  </div>
);

export default FormField;
