import {
  RelationshipClass,
  StepEntityMetadata,
  StepRelationshipMetadata,
} from '@jupiterone/integration-sdk-core';

export const ACCOUNT_ENTITY_KEY = 'entity:account';

export enum IntegrationSteps {
  ACCOUNT = 'fetch-account',
  WORKSPACES = 'fetch-workspaces',
  FETCH_AND_BUILD_WORKSPACE_USERS = 'fetch-and-build-workspace-users',
  FETCH_AND_BUILD_WORKSPACE_TEAMS = 'fetch-and-build-workspace-teams',
  BUILD_TEAM_AND_USER_RELATIONSHIP = 'build-team-and-user-relationship',
  FETCH_AND_BUILD_WORKSPACE_PROJECTS = 'fetch-and-build-workspace-projects',
  BUILD_TEAM_AND_PROJECT_RELATIONSHIP = 'build-team-and-project-relationship',
  BUILD_USER_OWNS_PROJECT_RELATIONSHIP = 'build-user-owns-project-relationship',
  BUILD_PROJECT_HAS_USER_RELATIONSHIP = 'build-project-has-user-relationship',
  FETCH_AND_BUILD_PROJECT_MEMBERSHIPS = 'fetch-and-build-project-memberships',
  BUILD_PROJECT_MEMBERSHIP_AND_USER_RELATIONSHIP = 'build-project-membership-and-user-relationship',
  BUILD_PROJECT_MEMBERSHIP_ALLOWS_PROJECT_RELATIONSHIP = 'build-project-membership-allows-project-relationship',
}

export const Entities: Record<
  'ACCOUNT' | 'USER' | 'PROJECT' | 'PROJECT_MEMBERSHIP' | 'TEAM' | 'WORKSPACE',
  StepEntityMetadata
> = {
  ACCOUNT: {
    resourceName: 'Account',
    _type: 'asana_account',
    _class: ['Account'],
    schema: {
      properties: {
        id: { type: 'string' },
        name: { type: 'string' },
        email: { type: 'string' },
      },
      required: ['id'],
    },
  },
  USER: {
    resourceName: 'User',
    _type: 'asana_user',
    _class: ['User'],
    schema: {
      properties: {
        id: { type: 'string' },
        name: { type: 'string' },
        email: { type: 'string' },
      },
      required: ['id'],
    },
  },
  PROJECT: {
    resourceName: 'Project',
    _type: 'asana_project',
    _class: ['Project'],
    schema: {
      properties: {
        id: { type: 'string' },
        name: { type: 'string' },
        ownerId: { type: 'string' },
        teamId: { type: 'string' },
        public: { type: 'boolean' },
        createdAt: { type: 'string' },
      },
      required: ['id', 'ownerId', 'teamId'],
    },
  },
  PROJECT_MEMBERSHIP: {
    resourceName: 'Project Membership',
    _type: 'asana_project_membership',
    _class: ['AccessRole'],
    schema: {
      properties: {
        id: { type: 'string' },
        projectId: { type: 'string' },
        userId: { type: 'string' },
        writeAccess: { type: 'string' },
        name: { type: 'string' },
      },
      required: ['id', 'projectId', 'userId', 'writeAccess'],
    },
  },
  TEAM: {
    resourceName: 'Team',
    _type: 'asana_team',
    _class: ['Team'],
    schema: {
      properties: {
        id: { type: 'string' },
        name: { type: 'string' },
      },
      required: ['id'],
    },
  },
  WORKSPACE: {
    resourceName: 'Workspace',
    _type: 'asana_workspace',
    _class: ['Organization'],
    schema: {
      properties: {
        id: { type: 'string' },
        name: { type: 'string' },
      },
      required: ['id'],
    },
  },
};

export const Relationships: Record<
  | 'ACCOUNT_HAS_WORKSPACE'
  | 'WORKSPACE_HAS_USER'
  | 'WORKSPACE_HAS_TEAM'
  | 'TEAM_HAS_USER'
  | 'WORKSPACE_HAS_PROJECT'
  | 'TEAM_ASSIGNED_PROJECT'
  | 'USER_OWNS_PROJECT'
  | 'PROJECT_HAS_PROJECT_MEMBERSHIP'
  | 'USER_ASSIGNED_PROJECT_MEMBERSHIP'
  | 'PROJECT_MEMBERSHIP_ALLOWS_PROJECT',
  StepRelationshipMetadata
> = {
  ACCOUNT_HAS_WORKSPACE: {
    _type: 'asana_account_has_workspace',
    sourceType: Entities.ACCOUNT._type,
    _class: RelationshipClass.HAS,
    targetType: Entities.WORKSPACE._type,
  },
  WORKSPACE_HAS_USER: {
    _type: 'asana_workspace_has_user',
    sourceType: Entities.WORKSPACE._type,
    _class: RelationshipClass.HAS,
    targetType: Entities.USER._type,
  },
  WORKSPACE_HAS_TEAM: {
    _type: 'asana_workspace_has_team',
    sourceType: Entities.WORKSPACE._type,
    _class: RelationshipClass.HAS,
    targetType: Entities.TEAM._type,
  },
  TEAM_HAS_USER: {
    _type: 'asana_team_has_user',
    sourceType: Entities.TEAM._type,
    _class: RelationshipClass.HAS,
    targetType: Entities.USER._type,
  },
  WORKSPACE_HAS_PROJECT: {
    _type: 'asana_workspace_has_project',
    sourceType: Entities.WORKSPACE._type,
    _class: RelationshipClass.HAS,
    targetType: Entities.PROJECT._type,
  },
  TEAM_ASSIGNED_PROJECT: {
    _type: 'asana_team_assigned_project',
    sourceType: Entities.TEAM._type,
    _class: RelationshipClass.ASSIGNED,
    targetType: Entities.PROJECT._type,
  },
  USER_OWNS_PROJECT: {
    _type: 'asana_user_owns_project',
    sourceType: Entities.USER._type,
    _class: RelationshipClass.OWNS,
    targetType: Entities.PROJECT._type,
  },
  PROJECT_HAS_PROJECT_MEMBERSHIP: {
    _type: 'asana_project_has_membership',
    sourceType: Entities.PROJECT._type,
    _class: RelationshipClass.HAS,
    targetType: Entities.PROJECT_MEMBERSHIP._type,
  },
  USER_ASSIGNED_PROJECT_MEMBERSHIP: {
    _type: 'asana_user_assigned_project_membership',
    sourceType: Entities.USER._type,
    _class: RelationshipClass.ASSIGNED,
    targetType: Entities.PROJECT_MEMBERSHIP._type,
  },
  PROJECT_MEMBERSHIP_ALLOWS_PROJECT: {
    _type: 'asana_project_membership_allows_project',
    sourceType: Entities.PROJECT_MEMBERSHIP._type,
    _class: RelationshipClass.ALLOWS,
    targetType: Entities.PROJECT._type,
  },
};
