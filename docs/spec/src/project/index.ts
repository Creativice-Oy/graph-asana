import { RelationshipClass, StepSpec } from '@jupiterone/integration-sdk-core';
import { IntegrationConfig } from '../../../../src/config';

export const projectSpec: StepSpec<IntegrationConfig>[] = [
  {
    /**
     * ENDPOINT: https://app.asana.com/api/1.0/workspaces/{workspaceId}/projects
     * PATTERN: Fetch Child Entities
     */
    id: 'fetch-and-build-workspace-projects',
    name: 'Fetch and Build Workspace Projects',
    entities: [
      {
        resourceName: 'Project',
        _type: 'asana_project',
        _class: ['Project'],
      },
    ],
    relationships: [
      {
        _type: 'asana_workspace_has_project',
        sourceType: 'asana_workspace',
        _class: RelationshipClass.HAS,
        targetType: 'asana_project',
      },
    ],
    dependsOn: ['fetch-workspaces'],
    implemented: true,
  },
  {
    /**
     * ENDPOINT: https://app.asana.com/api/1.0/workspaces/{workspaceId}/projects
     * PATTERN: Build Child Relationships
     */
    id: 'build-team-and-project-relationship',
    name: 'Build Team and Project Relationship',
    entities: [],
    relationships: [
      {
        _type: 'asana_team_assigned_project',
        sourceType: 'asana_team',
        _class: RelationshipClass.ASSIGNED,
        targetType: 'asana_project',
      },
    ],
    dependsOn: [
      'fetch-and-build-workspace-teams',
      'fetch-and-build-workspace-projects',
    ],
    implemented: true,
  },
  {
    /**
     * ENDPOINT: https://app.asana.com/api/1.0/workspaces/{workspaceId}/projects
     * PATTERN: Build Child Relationships
     */
    id: 'build-user-owns-project-relationship',
    name: 'Build User owns Project Relationship',
    entities: [],
    relationships: [
      {
        _type: 'asana_user_owns_project',
        sourceType: 'asana_user',
        _class: RelationshipClass.OWNS,
        targetType: 'asana_project',
      },
    ],
    dependsOn: [
      'fetch-and-build-workspace-users',
      'fetch-and-build-workspace-projects',
    ],
    implemented: true,
  },
];
