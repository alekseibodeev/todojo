import { InputHTMLAttributes } from 'react';

const Input = ({ ...props }: InputHTMLAttributes<HTMLInputElement>) => (
  <input
    className="rounded-sm border border-neutral-400 px-2.5 py-1 placeholder:text-neutral-400
      placeholder:italic hover:border-indigo-400 focus:border-indigo-500 focus:outline
      focus:outline-indigo-500"
    {...props}
  />
);

export default Input;
