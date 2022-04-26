import {
  createIntegrationEntity,
  Entity,
} from '@jupiterone/integration-sdk-core';

import { Entities } from '../constants';
import { ProjectMembership } from '../../types';

export function getProjectMembershipKey(id: string): string {
  return `asana_project_membership:${id}`;
}

export function createProjectMembershipEntity(
  projectMembership: ProjectMembership,
): Entity {
  return createIntegrationEntity({
    entityData: {
      source: projectMembership,
      assign: {
        _key: getProjectMembershipKey(projectMembership.gid),
        _type: Entities.PROJECT_MEMBERSHIP._type,
        _class: Entities.PROJECT_MEMBERSHIP._class,
        id: projectMembership.gid,
        userId: projectMembership.user.gid,
        projectId: projectMembership.project.gid,
        writeAccess: projectMembership.write_access,
        name: projectMembership.write_access,
      },
    },
  });
}
