import { RelationshipClass, StepSpec } from '@jupiterone/integration-sdk-core';
import { IntegrationConfig } from '../../../../src/config';

export const userSpec: StepSpec<IntegrationConfig>[] = [
  {
    /**
     * ENDPOINT: https://app.asana.com/api/1.0/users?workspace={workspaceId}
     * PATTERN: Fetch Child Entities
     */
    id: 'fetch-and-build-workspace-users',
    name: 'Fetch and Build Workspace Users',
    entities: [
      {
        resourceName: 'User',
        _type: 'asana_user',
        _class: ['User'],
      },
    ],
    relationships: [
      {
        _type: 'asana_workspace_has_user',
        sourceType: 'asana_workspace',
        _class: RelationshipClass.HAS,
        targetType: 'asana_user',
      },
    ],
    dependsOn: ['fetch-workspaces'],
    implemented: true,
  },
];
