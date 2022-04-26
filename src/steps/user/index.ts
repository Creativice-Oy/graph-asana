import {
  createDirectRelationship,
  IntegrationStep,
  IntegrationStepExecutionContext,
  RelationshipClass,
} from '@jupiterone/integration-sdk-core';

import { IntegrationConfig } from '../../config';
import { createAPIClient } from '../../client';
import { Entities, IntegrationSteps, Relationships } from '../constants';
import { createUserEntity, getUserKey } from './converter';

export async function fetchWorkspaceUsers({
  instance,
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const apiClient = createAPIClient(instance.config);

  await jobState.iterateEntities(
    { _type: Entities.WORKSPACE._type },
    async (workspaceEntity) => {
      const workspaceId = workspaceEntity.id;

      await apiClient.iterateUsersInWorkspace(
        workspaceId as string,
        async (user) => {
          let userEntity = await jobState.findEntity(getUserKey(user.gid));
          if (!userEntity) {
            userEntity = createUserEntity(user);
            await jobState.addEntity(userEntity);
          }

          await jobState.addRelationship(
            createDirectRelationship({
              _class: RelationshipClass.HAS,
              from: workspaceEntity,
              to: userEntity,
            }),
          );
        },
      );
    },
  );
}

export const userSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: IntegrationSteps.FETCH_AND_BUILD_WORKSPACE_USERS,
    name: 'Fetch and Build Workspace Users',
    entities: [Entities.USER],
    relationships: [Relationships.WORKSPACE_HAS_USER],
    dependsOn: [IntegrationSteps.WORKSPACES],
    executionHandler: fetchWorkspaceUsers,
  },
];
