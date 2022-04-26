import {
  createIntegrationEntity,
  Entity,
} from '@jupiterone/integration-sdk-core';

import { Entities } from '../constants';
import { Team } from '../../types';

export function getTeamKey(id: string): string {
  return `asana_team:${id}`;
}

export function createTeamEntity(team: Team): Entity {
  return createIntegrationEntity({
    entityData: {
      source: team,
      assign: {
        _key: getTeamKey(team.gid),
        _type: Entities.TEAM._type,
        _class: Entities.TEAM._class,
        id: team.gid,
        name: team.name,
      },
    },
  });
}
