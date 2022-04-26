import { RelationshipClass, StepSpec } from '@jupiterone/integration-sdk-core';
import { IntegrationConfig } from '../../../../src/config';

export const projectMembershipSpec: StepSpec<IntegrationConfig>[] = [
  {
    /**
     * ENDPOINT: https://app.asana.com/api/1.0/projects/{projectId}/project_memberships
     * PATTERN: Fetch Child Entities
     */
    id: 'fetch-and-build-project-memberships',
    name: 'Fetch and Build Project Memberships',
    entities: [
      {
        resourceName: 'Project Membership',
        _type: 'asana_project_membership',
        _class: ['AccessRole'],
      },
    ],
    relationships: [
      {
        _type: 'asana_project_has_membership',
        sourceType: 'asana_project',
        _class: RelationshipClass.HAS,
        targetType: 'asana_project_membership',
      },
    ],
    dependsOn: ['fetch-and-build-workspace-projects'],
    implemented: true,
  },
  {
    /**
     * ENDPOINT: https://app.asana.com/api/1.0/projects/{projectId}/project_memberships
     * PATTERN: Build Child Relationships
     */
    id: 'build-project-membership-and-user-relationship',
    name: 'Build Project Membership and User Relationship',
    entities: [],
    relationships: [
      {
        _type: 'asana_user_assigned_project_membership',
        sourceType: 'asana_user',
        _class: RelationshipClass.ASSIGNED,
        targetType: 'asana_project_membership',
      },
    ],
    dependsOn: [
      'fetch-and-build-project-memberships',
      'fetch-and-build-workspace-users',
    ],
    implemented: true,
  },
  {
    /**
     * ENDPOINT: https://app.asana.com/api/1.0/projects/{projectId}/project_memberships
     * PATTERN: Build Child Relationships
     */
    id: 'build-project-membership-allows-project-relationship',
    name: 'Build Project Membership allows Project Relationship',
    entities: [],
    relationships: [
      {
        _type: 'asana_project_membership_allows_project',
        sourceType: 'asana_project_membership',
        _class: RelationshipClass.ALLOWS,
        targetType: 'asana_project',
      },
    ],
    dependsOn: [
      'fetch-and-build-project-memberships',
      'fetch-and-build-workspace-projects',
    ],
    implemented: true,
  },
];
