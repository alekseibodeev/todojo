import { Popover, PopoverContent, PopoverTrigger } from '../components/Popover';
import { Project } from '../types/api';
import Button from './Button';
import { Ellipsis } from 'lucide-react';
import { MouseEventHandler } from 'react';
import { NavLink } from 'react-router';

const ProjectItem = ({
  project,
  onEdit,
  onDelete,
}: {
  project: Project;
  onEdit: MouseEventHandler<HTMLButtonElement>;
  onDelete: MouseEventHandler<HTMLButtonElement>;
}) => (
  <li className="flex">
    <NavLink
      className={({ isActive }) =>
        `flex-auto rounded-sm px-4 py-2 hover:bg-indigo-50
        ${isActive ? 'bg-indigo-100 text-indigo-600 hover:bg-indigo-100' : ''}`
      }
      to={`${project.id}`}
    >
      {project.title}
    </NavLink>
    <Popover>
      <PopoverTrigger asChild>
        <button>
          <Ellipsis />
        </button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="grid w-48 gap-2 p-4">
          <Button onClick={onEdit}>Edit</Button>
          <Button onClick={onDelete}>Delete</Button>
        </div>
      </PopoverContent>
    </Popover>
  </li>
);

export default ProjectItem;
