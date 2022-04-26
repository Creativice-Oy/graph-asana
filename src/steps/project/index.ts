import {
  createDirectRelationship,
  IntegrationStep,
  IntegrationStepExecutionContext,
  RelationshipClass,
} from '@jupiterone/integration-sdk-core';

import { IntegrationConfig } from '../../config';
import { createAPIClient } from '../../client';
import { IntegrationSteps, Entities, Relationships } from '../constants';
import { createProjectEntity } from './converter';
import { getTeamKey } from '../team/converter';
import { getUserKey } from '../user/converter';

export async function fetchWorkspaceProjects({
  instance,
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const apiClient = createAPIClient(instance.config);

  await jobState.iterateEntities(
    { _type: Entities.WORKSPACE._type },
    async (workspaceEntity) => {
      const workspaceId = workspaceEntity.id;
      await apiClient.iterateProjectsInWorkspace(
        workspaceId as string,
        async (project) => {
          const projectEntity = createProjectEntity(project);

          await jobState.addEntity(projectEntity);
          await jobState.addRelationship(
            createDirectRelationship({
              _class: RelationshipClass.HAS,
              from: workspaceEntity,
              to: projectEntity,
            }),
          );
        },
      );
    },
  );
}

export async function buildTeamAndProjectsRelationship({
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  await jobState.iterateEntities(
    { _type: Entities.PROJECT._type },
    async (projectEntity) => {
      const teamId = projectEntity.teamId;
      const teamEntity = await jobState.findEntity(
        getTeamKey(teamId as string),
      );

      if (teamEntity) {
        await jobState.addRelationship(
          createDirectRelationship({
            _class: RelationshipClass.ASSIGNED,
            from: teamEntity,
            to: projectEntity,
          }),
        );
      }
    },
  );
}

export async function buildUserOwnsProjectRelationship({
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  await jobState.iterateEntities(
    { _type: Entities.PROJECT._type },
    async (projectEntity) => {
      const userId = projectEntity.ownerId;
      const userEntity = await jobState.findEntity(
        getUserKey(userId as string),
      );

      if (userEntity) {
        await jobState.addRelationship(
          createDirectRelationship({
            _class: RelationshipClass.OWNS,
            from: userEntity,
            to: projectEntity,
          }),
        );
      }
    },
  );
}

export const projectSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: IntegrationSteps.FETCH_AND_BUILD_WORKSPACE_PROJECTS,
    name: 'Fetch and Build Workspace Projects',
    entities: [Entities.PROJECT],
    relationships: [Relationships.WORKSPACE_HAS_PROJECT],
    dependsOn: [IntegrationSteps.WORKSPACES],
    executionHandler: fetchWorkspaceProjects,
  },
  {
    id: IntegrationSteps.BUILD_TEAM_AND_PROJECT_RELATIONSHIP,
    name: 'Build Team and Project Relationship',
    entities: [],
    relationships: [Relationships.TEAM_ASSIGNED_PROJECT],
    dependsOn: [
      IntegrationSteps.FETCH_AND_BUILD_WORKSPACE_TEAMS,
      IntegrationSteps.FETCH_AND_BUILD_WORKSPACE_PROJECTS,
    ],
    executionHandler: buildTeamAndProjectsRelationship,
  },
  {
    id: IntegrationSteps.BUILD_USER_OWNS_PROJECT_RELATIONSHIP,
    name: 'Build User owns Project Relationship',
    entities: [],
    relationships: [Relationships.USER_OWNS_PROJECT],
    dependsOn: [
      IntegrationSteps.FETCH_AND_BUILD_WORKSPACE_USERS,
      IntegrationSteps.FETCH_AND_BUILD_WORKSPACE_PROJECTS,
    ],
    executionHandler: buildUserOwnsProjectRelationship,
  },
];
