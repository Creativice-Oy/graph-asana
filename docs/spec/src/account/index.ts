import { StepSpec } from '@jupiterone/integration-sdk-core';
import { IntegrationConfig } from '../../../../src/config';

export const accountSpec: StepSpec<IntegrationConfig>[] = [
  {
    /**
     * ENDPOINT: https://app.asana.com/api/1.0/users/me
     * PATTERN: Singleton
     */
    id: 'fetch-account',
    name: 'Fetch Account Details',
    entities: [
      {
        resourceName: 'Account',
        _type: 'asana_account',
        _class: ['Account'],
      },
    ],
    relationships: [],
    dependsOn: [],
    implemented: true,
  },
];
