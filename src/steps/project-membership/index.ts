import {
  createDirectRelationship,
  IntegrationStep,
  IntegrationStepExecutionContext,
  RelationshipClass,
} from '@jupiterone/integration-sdk-core';

import { IntegrationConfig } from '../../config';
import { createAPIClient } from '../../client';
import { IntegrationSteps, Entities, Relationships } from '../constants';
import { createProjectMembershipEntity } from './converter';
import { getUserKey } from '../user/converter';
import { getProjectKey } from '../project/converter';

export async function fetchProjectMemberships({
  instance,
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const apiClient = createAPIClient(instance.config);

  await jobState.iterateEntities(
    { _type: Entities.PROJECT._type },
    async (projectEntity) => {
      const projectId = projectEntity.id;
      await apiClient.iterateMembershipsInProject(
        projectId as string,
        async (projectMembership) => {
          const projectMembershipEntity =
            createProjectMembershipEntity(projectMembership);

          await jobState.addEntity(projectMembershipEntity);
          await jobState.addRelationship(
            createDirectRelationship({
              _class: RelationshipClass.HAS,
              from: projectEntity,
              to: projectMembershipEntity,
            }),
          );
        },
      );
    },
  );
}

export async function buildUserAndMembershipRelationship({
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  await jobState.iterateEntities(
    { _type: Entities.PROJECT_MEMBERSHIP._type },
    async (projectMembershipEntity) => {
      const userId = projectMembershipEntity.userId;
      const userEntity = await jobState.findEntity(
        getUserKey(userId as string),
      );

      if (userEntity) {
        await jobState.addRelationship(
          createDirectRelationship({
            _class: RelationshipClass.ASSIGNED,
            from: userEntity,
            to: projectMembershipEntity,
          }),
        );
      }
    },
  );
}

export async function buildProjectMembershipAllowsProjectRelationship({
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  await jobState.iterateEntities(
    { _type: Entities.PROJECT_MEMBERSHIP._type },
    async (projectMembershipEntity) => {
      const projectId = projectMembershipEntity.projectId;
      const projectentity = await jobState.findEntity(
        getProjectKey(projectId as string),
      );

      if (projectentity) {
        await jobState.addRelationship(
          createDirectRelationship({
            _class: RelationshipClass.ALLOWS,
            from: projectMembershipEntity,
            to: projectentity,
          }),
        );
      }
    },
  );
}

export const projectMembershipSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: IntegrationSteps.FETCH_AND_BUILD_PROJECT_MEMBERSHIPS,
    name: 'Fetch and Build Project Memberships',
    entities: [Entities.PROJECT_MEMBERSHIP],
    relationships: [Relationships.PROJECT_HAS_PROJECT_MEMBERSHIP],
    dependsOn: [IntegrationSteps.FETCH_AND_BUILD_WORKSPACE_PROJECTS],
    executionHandler: fetchProjectMemberships,
  },
  {
    id: IntegrationSteps.BUILD_PROJECT_MEMBERSHIP_AND_USER_RELATIONSHIP,
    name: 'Build Project Membership and User Relationship',
    entities: [],
    relationships: [Relationships.USER_ASSIGNED_PROJECT_MEMBERSHIP],
    dependsOn: [
      IntegrationSteps.FETCH_AND_BUILD_PROJECT_MEMBERSHIPS,
      IntegrationSteps.FETCH_AND_BUILD_WORKSPACE_USERS,
    ],
    executionHandler: buildUserAndMembershipRelationship,
  },
  {
    id: IntegrationSteps.BUILD_PROJECT_MEMBERSHIP_ALLOWS_PROJECT_RELATIONSHIP,
    name: 'Build Project Membership allows Project Relationship',
    entities: [],
    relationships: [Relationships.PROJECT_MEMBERSHIP_ALLOWS_PROJECT],
    dependsOn: [
      IntegrationSteps.FETCH_AND_BUILD_PROJECT_MEMBERSHIPS,
      IntegrationSteps.FETCH_AND_BUILD_WORKSPACE_PROJECTS,
    ],
    executionHandler: buildProjectMembershipAllowsProjectRelationship,
  },
];
