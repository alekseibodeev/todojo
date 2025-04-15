import { LabelHTMLAttributes } from 'react';

const Label = ({
  children,
  ...props
}: LabelHTMLAttributes<HTMLLabelElement>) => (
  <label className="font-medium" {...props}>
    {children}
  </label>
);

export default Label;
