import {
  createDirectRelationship,
  Entity,
  IntegrationStep,
  IntegrationStepExecutionContext,
  RelationshipClass,
} from '@jupiterone/integration-sdk-core';

import { IntegrationConfig } from '../../config';
import { createAPIClient } from '../../client';
import {
  IntegrationSteps,
  Entities,
  Relationships,
  ACCOUNT_ENTITY_KEY,
} from '../constants';
import { createWorkspaceEntity } from './converter';

export async function fetchWorkspaces({
  instance,
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const apiClient = createAPIClient(instance.config);

  const accountEntity = (await jobState.getData(ACCOUNT_ENTITY_KEY)) as Entity;

  await apiClient.iterateWorkspaces(async (workspace) => {
    const workspaceEntity = createWorkspaceEntity(workspace);
    await jobState.addEntity(workspaceEntity);

    if (accountEntity && workspaceEntity) {
      await jobState.addRelationship(
        createDirectRelationship({
          _class: RelationshipClass.HAS,
          from: accountEntity,
          to: workspaceEntity,
        }),
      );
    }
  });
}

export const workspaceSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: IntegrationSteps.WORKSPACES,
    name: 'Fetch Workspace Details',
    entities: [Entities.WORKSPACE],
    relationships: [Relationships.ACCOUNT_HAS_WORKSPACE],
    dependsOn: [IntegrationSteps.ACCOUNT],
    executionHandler: fetchWorkspaces,
  },
];
