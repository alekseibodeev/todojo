import { Project } from '../types/api';
import { NavLink } from 'react-router';

const ProjectItem = ({ project }: { project: Project }) => (
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
  </li>
);

export default ProjectItem;
