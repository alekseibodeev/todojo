import { Project } from '../types/api';
import ProjectItem from './ProjectItem';

const ProjectList = ({ projects }: { projects: Project[] }) => (
  <ul className="grid gap-2">
    {projects.map((project) => (
      <ProjectItem key={project.id} project={project} />
    ))}
  </ul>
);

export default ProjectList;
