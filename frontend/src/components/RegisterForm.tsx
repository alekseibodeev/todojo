import Button from './Button';
import FormField from './FormField';
import Input from './Input';
import Link from './Link';
import { FormHTMLAttributes } from 'react';

const RegisterForm = ({
  ...props
}: Omit<FormHTMLAttributes<HTMLFormElement>, 'children'>) => (
  <form className="grid rounded-xl bg-white p-8" {...props}>
    <h1 className="mb-4 text-center text-2xl font-bold">Register</h1>
    <FormField label="Email">
      <Input id="email" type="email" required />
    </FormField>
    <FormField label="Password">
      <Input id="password" type="password" required />
    </FormField>
    <Button>Submit</Button>
    <p className="mt-8 text-center text-sm">
      Already have an account? <Link to="/login">Login</Link>
    </p>
  </form>
);

export default RegisterForm;
