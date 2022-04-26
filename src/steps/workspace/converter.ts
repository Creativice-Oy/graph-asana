import {
  createIntegrationEntity,
  Entity,
} from '@jupiterone/integration-sdk-core';

import { Entities } from '../constants';
import { Workspace } from '../../types';

export function getWorkspaceKey(id: string): string {
  return `asana_workspace:${id}`;
}

export function createWorkspaceEntity(workspace: Workspace): Entity {
  return createIntegrationEntity({
    entityData: {
      source: workspace,
      assign: {
        _key: getWorkspaceKey(workspace.gid),
        _type: Entities.WORKSPACE._type,
        _class: Entities.WORKSPACE._class,
        id: workspace.gid,
        name: workspace.name,
      },
    },
  });
}
