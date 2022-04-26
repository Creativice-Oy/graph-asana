import {
  IntegrationStep,
  IntegrationStepExecutionContext,
} from '@jupiterone/integration-sdk-core';

import { IntegrationConfig } from '../../config';
import { createAPIClient } from '../../client';
import { ACCOUNT_ENTITY_KEY, IntegrationSteps, Entities } from '../constants';
import { createAccountEntity } from './converter';

export async function fetchAccount({
  instance,
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const apiClient = createAPIClient(instance.config);

  const currentUser = await apiClient.getCurrentUser();
  const accountEntity = createAccountEntity(currentUser);

  await jobState.addEntity(accountEntity);
  await jobState.setData(ACCOUNT_ENTITY_KEY, accountEntity);
}

export const accountSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: IntegrationSteps.ACCOUNT,
    name: 'Fetch Account Details',
    entities: [Entities.ACCOUNT],
    relationships: [],
    dependsOn: [],
    executionHandler: fetchAccount,
  },
];
