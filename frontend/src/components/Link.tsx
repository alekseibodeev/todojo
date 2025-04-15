import { LinkProps, Link as RouterLink } from 'react-router';

const Link = ({ children, ...props }: LinkProps) => (
  <RouterLink className="font-medium text-indigo-700" {...props}>
    {children}
  </RouterLink>
);

export default Link;
