import {
  IntegrationExecutionContext,
  IntegrationValidationError,
  IntegrationInstanceConfigFieldMap,
  IntegrationInstanceConfig,
} from '@jupiterone/integration-sdk-core';
import { createAPIClient } from './client';

export const instanceConfigFields: IntegrationInstanceConfigFieldMap = {
  accessToken: {
    type: 'string',
    mask: true,
  },
};
export interface IntegrationConfig extends IntegrationInstanceConfig {
  /**
   * OAuth provided token for request authentication
   */
  accessToken: string;
}

export async function validateInvocation(
  context: IntegrationExecutionContext<IntegrationConfig>,
) {
  const { config } = context.instance;

  if (!config.accessToken) {
    throw new IntegrationValidationError(
      'Config requires all of the following {accessToken}. Please generate tokens from OAuth server or provide client id and secret.',
    );
  }

  const apiClient = createAPIClient(config);
  await apiClient.verifyAuthentication();
}
