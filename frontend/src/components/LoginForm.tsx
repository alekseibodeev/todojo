import Button from './Button';
import FormField from './FormField';
import Input from './Input';
import Link from './Link';
import { FormHTMLAttributes } from 'react';

const LoginForm = ({
  ...props
}: Omit<FormHTMLAttributes<HTMLFormElement>, 'children'>) => (
  <form className="grid rounded-xl bg-white p-8" {...props}>
    <h1 className="mb-4 text-center text-2xl font-bold">Login</h1>
    <FormField label="Email">
      <Input id="email" type="email" required />
    </FormField>
    <FormField label="Password">
      <Input id="password" type="password" required />
    </FormField>
    <Button>Submit</Button>
    <p className="mt-8 text-center text-sm">
      Don't have an account yet? <Link to="/register">Register</Link>
    </p>
  </form>
);

export default LoginForm;
