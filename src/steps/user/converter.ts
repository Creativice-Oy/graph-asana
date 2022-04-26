import {
  createIntegrationEntity,
  Entity,
} from '@jupiterone/integration-sdk-core';

import { Entities } from '../constants';
import { User } from '../../types';

export function getUserKey(id: string): string {
  return `asana_user:${id}`;
}

export function createUserEntity(user: User): Entity {
  return createIntegrationEntity({
    entityData: {
      source: user,
      assign: {
        _key: getUserKey(user.gid),
        _type: Entities.USER._type,
        _class: Entities.USER._class,
        username: user.email,
        active: true,
        id: user.gid,
        name: user.name,
        email: user.email,
      },
    },
  });
}
