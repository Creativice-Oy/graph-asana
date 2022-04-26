import {
  createIntegrationEntity,
  Entity,
} from '@jupiterone/integration-sdk-core';

import { Entities } from '../constants';
import { User } from '../../types';

export function getAccountKey(id: string): string {
  return `asana_account:${id}`;
}

export function createAccountEntity(account: User): Entity {
  return createIntegrationEntity({
    entityData: {
      source: account,
      assign: {
        _key: getAccountKey(account.gid),
        _type: Entities.ACCOUNT._type,
        _class: Entities.ACCOUNT._class,
        id: account.gid,
        name: account.name,
        email: account.email,
      },
    },
  });
}
