import {
  createIntegrationEntity,
  Entity,
} from '@jupiterone/integration-sdk-core';

import { Entities } from '../constants';
import { Project } from '../../types';

export function getProjectKey(id: string): string {
  return `asana_project:${id}`;
}

export function createProjectEntity(project: Project): Entity {
  return createIntegrationEntity({
    entityData: {
      source: project,
      assign: {
        _key: getProjectKey(project.gid),
        _type: Entities.PROJECT._type,
        _class: Entities.PROJECT._class,
        id: project.gid,
        ownerId: project.owner.gid,
        teamId: project.team.gid,
        public: project.public,
        createdAt: project.created_at,
      },
    },
  });
}
