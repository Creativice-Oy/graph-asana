import { RelationshipClass, StepSpec } from '@jupiterone/integration-sdk-core';
import { IntegrationConfig } from '../../../../src/config';

export const workspaceSpec: StepSpec<IntegrationConfig>[] = [
  {
    /**
     * ENDPOINT: https://app.asana.com/api/1.0/workspaces
     * PATTERN: Fetch Entities
     */
    id: 'fetch-workspaces',
    name: 'Fetch Workspace Details',
    entities: [
      {
        resourceName: 'Workspace',
        _type: 'asana_workspace',
        _class: ['Organization'],
      },
    ],
    relationships: [
      {
        _type: 'asana_account_has_workspace',
        sourceType: 'asana_account',
        _class: RelationshipClass.HAS,
        targetType: 'asana_workspace',
      },
    ],
    dependsOn: ['fetch-account'],
    implemented: true,
  },
];
