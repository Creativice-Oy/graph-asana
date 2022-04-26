import { IntegrationSpecConfig } from '@jupiterone/integration-sdk-core';

import { IntegrationConfig } from '../../../src/config';
import { accountSpec } from './account';
import { projectSpec } from './project';
import { projectMembershipSpec } from './project-membership';
import { teamSpec } from './team';
import { userSpec } from './user';
import { workspaceSpec } from './workspace';

export const invocationConfig: IntegrationSpecConfig<IntegrationConfig> = {
  integrationSteps: [
    ...accountSpec,
    ...projectSpec,
    ...projectMembershipSpec,
    ...teamSpec,
    ...userSpec,
    ...workspaceSpec,
  ],
};
