import { RelationshipClass, StepSpec } from '@jupiterone/integration-sdk-core';
import { IntegrationConfig } from '../../../../src/config';

export const teamSpec: StepSpec<IntegrationConfig>[] = [
  {
    /**
     * ENDPOINT: https://app.asana.com/api/1.0/organizations/{workspaceId}/teams
     * PATTERN: Fetch Child Entities
     */
    id: 'fetch-and-build-workspace-teams',
    name: 'Fetch and Build Workspace Teams',
    entities: [
      {
        resourceName: 'Team',
        _type: 'asana_team',
        _class: ['Team'],
      },
    ],
    relationships: [
      {
        _type: 'asana_workspace_has_team',
        sourceType: 'asana_workspace',
        _class: RelationshipClass.HAS,
        targetType: 'asana_team',
      },
    ],
    dependsOn: ['fetch-workspaces'],
    implemented: true,
  },
  {
    /**
     * ENDPOINT: https://app.asana.com/api/1.0/teams/{teamId}/users
     * PATTERN: Fetch Relationships
     */
    id: 'build-team-and-user-relationship',
    name: 'Build Team and User Relationship',
    entities: [],
    relationships: [
      {
        _type: 'asana_team_has_user',
        sourceType: 'asana_team',
        _class: RelationshipClass.HAS,
        targetType: 'asana_user',
      },
    ],
    dependsOn: [
      'fetch-and-build-workspace-users',
      'fetch-and-build-workspace-teams',
    ],
    implemented: true,
  },
];
