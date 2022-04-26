import fetch, { Response } from 'node-fetch';
import { retry } from '@lifeomic/attempt';

import {
  IntegrationProviderAPIError,
  IntegrationProviderAuthenticationError,
} from '@jupiterone/integration-sdk-core';

import { IntegrationConfig } from './config';
import {
  Workspace,
  User,
  Payload,
  Paginated,
  Team,
  Project,
  ProjectMembership,
} from './types';

export type ResourceIteratee<T> = (each: T) => Promise<void> | void;

class ResponseError extends IntegrationProviderAPIError {
  response: Response;
  constructor(options) {
    super(options);
    this.response = options.response;
  }
}

export class APIClient {
  constructor(readonly config: IntegrationConfig) {}

  private readonly paginateEntitiesPerPage = 30;

  private withBaseUri = (path: string) =>
    'https://app.asana.com/api/1.0' + path;

  public async request<T>(
    uri: string,
    method: 'GET' | 'HEAD' = 'GET',
  ): Promise<T> {
    try {
      const result = await retry<Response>(
        async () => {
          const response = await fetch(uri, {
            method,
            headers: {
              Authorization: `Bearer ${this.config.accessToken}`,
            },
          });
          if (!response.ok) {
            throw new ResponseError({
              endpoint: uri,
              status: response.status,
              statusText: response.statusText,
              response,
            });
          }
          return response;
        },
        {
          delay: 1000,
          maxAttempts: 10,
        },
      );
      return (await result.json()) as T;
    } catch (err) {
      throw new IntegrationProviderAPIError({
        endpoint: uri,
        status: err.status,
        statusText: err.statusText,
      });
    }
  }

  public async verifyAuthentication(): Promise<void> {
    const endpoint = this.withBaseUri('/users/me');
    try {
      await this.request(endpoint);
    } catch (err) {
      throw new IntegrationProviderAuthenticationError({
        cause: err,
        endpoint,
        status: err.status,
        statusText: err.statusText,
      });
    }
  }

  public async getCurrentUser(): Promise<User> {
    const endpoint = this.withBaseUri(
      '/users/me?opt_fields=gid,name,email,resource_type',
    );
    const response = await this.request<Payload<User>>(endpoint);
    return response.data;
  }

  public async iterateUsers(iteratee: ResourceIteratee<User>) {
    const path = '/users?opt_fields=gid,name,email,resource_type';

    const endpoint = this.withBaseUri(path);
    const res = await this.request<Payload<User[]>>(endpoint);
    const userList = res.data;

    for (const user of userList) {
      await iteratee(user);
    }
  }

  public async iterateWorkspaces(iteratee: ResourceIteratee<Workspace>) {
    let body: Paginated<Workspace[]>;
    let path = `/workspaces?limit=${this.paginateEntitiesPerPage}&opt_fields=gid,name,resource_type`;
    let endpoint: string;

    do {
      endpoint = this.withBaseUri(path);
      body = await this.request<Paginated<Workspace[]>>(endpoint);
      for (const workspace of body.data) {
        await iteratee(workspace);
      }
      if (body.next_page !== null) {
        path = body.next_page.path;
      }
    } while (body.next_page !== null);
  }

  public async iterateUsersInWorkspace(
    workspaceId: string,
    iteratee: ResourceIteratee<User>,
  ) {
    let body: Paginated<User[]>;
    let path = `/users?workspace=${workspaceId}&limit=${this.paginateEntitiesPerPage}&opt_fields=gid,name,email,resource_type`;
    let endpoint: string;

    do {
      endpoint = this.withBaseUri(path);
      body = await this.request<Paginated<User[]>>(endpoint);
      for (const user of body.data) {
        await iteratee(user);
      }
      if (body.next_page !== null) {
        path = body.next_page.path;
      }
    } while (body.next_page !== null);
  }

  public async iterateTeamsInWorkspace(
    workspaceId: string,
    iteratee: ResourceIteratee<Team>,
  ) {
    let body: Paginated<Team[]>;
    let path = `/organizations/${workspaceId}/teams?limit=${this.paginateEntitiesPerPage}&opt_fields=gid,name,resource_type`;
    let endpoint: string;

    do {
      endpoint = this.withBaseUri(path);
      body = await this.request<Paginated<Team[]>>(endpoint);
      for (const team of body.data) {
        await iteratee(team);
      }
      if (body.next_page !== null) {
        path = body.next_page.path;
      }
    } while (body.next_page !== null);
  }

  public async iterateUsersInTeam(
    teamId: string,
    iteratee: ResourceIteratee<User>,
  ) {
    const path = `/teams/${teamId}/users?opt_fields=gid,name,email,resource_type`;

    const endpoint = this.withBaseUri(path);
    const body = await this.request<Payload<User[]>>(endpoint);
    for (const user of body.data) {
      await iteratee(user);
    }
  }

  public async iterateProjectsInWorkspace(
    workspaceId: string,
    iteratee: ResourceIteratee<Project>,
  ) {
    let body: Paginated<Project[]>;
    let path = `/workspaces/${workspaceId}/projects?limit=${this.paginateEntitiesPerPage}&opt_fields=gid,resource_type,name,owner,created_at,public,members,team`;
    let endpoint: string;

    do {
      endpoint = this.withBaseUri(path);
      body = await this.request<Paginated<Project[]>>(endpoint);
      for (const project of body.data) {
        await iteratee(project);
      }
      if (body.next_page !== null) {
        path = body.next_page.path;
      }
    } while (body.next_page !== null);
  }

  public async iterateMembershipsInProject(
    projectId: string,
    iteratee: ResourceIteratee<ProjectMembership>,
  ) {
    let body: Paginated<ProjectMembership[]>;
    let path = `/projects/${projectId}/project_memberships?limit=${this.paginateEntitiesPerPage}&opt_fields=write_access,gid,resource_type,user,project`;
    let endpoint: string;

    do {
      endpoint = this.withBaseUri(path);
      body = await this.request<Paginated<ProjectMembership[]>>(endpoint);
      for (const projectMembership of body.data) {
        await iteratee(projectMembership);
      }
      if (body.next_page !== null) {
        path = body.next_page.path;
      }
    } while (body.next_page !== null);
  }
}

export function createAPIClient(config: IntegrationConfig): APIClient {
  return new APIClient(config);
}
