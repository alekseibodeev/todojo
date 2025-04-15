import { ButtonHTMLAttributes } from 'react';

const Button = ({
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button
    className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-sm
      bg-indigo-500 p-2 font-medium text-white hover:bg-indigo-600 focus:outline-2
      focus:outline-offset-2 focus:outline-indigo-500"
    {...props}
  >
    {children}
  </button>
);

export default Button;
