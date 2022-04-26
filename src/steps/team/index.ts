import {
  createDirectRelationship,
  IntegrationStep,
  IntegrationStepExecutionContext,
  RelationshipClass,
} from '@jupiterone/integration-sdk-core';

import { IntegrationConfig } from '../../config';
import { createAPIClient } from '../../client';
import { Entities, IntegrationSteps, Relationships } from '../constants';
import { createTeamEntity } from './converter';
import { getUserKey } from '../user/converter';

export async function fetchWorkspaceTeams({
  instance,
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const apiClient = createAPIClient(instance.config);

  await jobState.iterateEntities(
    { _type: Entities.WORKSPACE._type },
    async (workspaceEntity) => {
      const workspaceId = workspaceEntity.id;
      await apiClient.iterateTeamsInWorkspace(
        workspaceId as string,
        async (team) => {
          const teamEntity = createTeamEntity(team);

          await jobState.addEntity(teamEntity);
          await jobState.addRelationship(
            createDirectRelationship({
              _class: RelationshipClass.HAS,
              from: workspaceEntity,
              to: teamEntity,
            }),
          );
        },
      );
    },
  );
}

export async function buildTeamAndUsersRelationship({
  instance,
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const apiClient = createAPIClient(instance.config);

  await jobState.iterateEntities(
    { _type: Entities.TEAM._type },
    async (teamEntity) => {
      const teamId = teamEntity.id;

      await apiClient.iterateUsersInTeam(teamId as string, async (user) => {
        const userEntity = await jobState.findEntity(getUserKey(user.gid));

        if (userEntity) {
          await jobState.addRelationship(
            createDirectRelationship({
              _class: RelationshipClass.HAS,
              from: teamEntity,
              to: userEntity,
            }),
          );
        }
      });
    },
  );
}

export const teamSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: IntegrationSteps.FETCH_AND_BUILD_WORKSPACE_TEAMS,
    name: 'Fetch and Build Workspace Teams',
    entities: [Entities.TEAM],
    relationships: [Relationships.WORKSPACE_HAS_TEAM],
    dependsOn: [IntegrationSteps.WORKSPACES],
    executionHandler: fetchWorkspaceTeams,
  },
  {
    id: IntegrationSteps.BUILD_TEAM_AND_USER_RELATIONSHIP,
    name: 'Build Team and User Relationship',
    entities: [],
    relationships: [Relationships.TEAM_HAS_USER],
    dependsOn: [
      IntegrationSteps.FETCH_AND_BUILD_WORKSPACE_USERS,
      IntegrationSteps.FETCH_AND_BUILD_WORKSPACE_TEAMS,
    ],
    executionHandler: buildTeamAndUsersRelationship,
  },
];
