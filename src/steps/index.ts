import { accountSteps } from './account';
import { userSteps } from './user';
import { workspaceSteps } from './workspace';
import { teamSteps } from './team';
import { projectSteps } from './project';
import { projectMembershipSteps } from './project-membership';

const integrationSteps = [
  ...accountSteps,
  ...userSteps,
  ...workspaceSteps,
  ...teamSteps,
  ...projectSteps,
  ...projectMembershipSteps,
];

export { integrationSteps };
