export interface Workspace {
  gid: string;
  name: string;
  resource_type: 'workspace';
}

export interface Team {
  gid: string;
  name: string;
  resource_type: 'team';
}

export interface User {
  gid: string;
  name: string;
  email: string;
  resource_type: 'user';
}

export interface Project {
  gid: string;
  name: string;
  owner: Pick<User, 'gid' | 'resource_type'>;
  team: Pick<Team, 'gid' | 'resource_type'>;
  public: boolean;
  created_at: string;
  resource_type: 'project';
}

type WriteAcess = 'full_write' | 'comment_only';

export interface ProjectMembership {
  gid: string;
  project: Pick<Project, 'gid' | 'resource_type'>;
  user: Pick<User, 'gid' | 'resource_type'>;
  write_access: WriteAcess;
  resource_type: 'project_membership';
}

interface PaginationData {
  offset: string;
  path: string;
  uri: string;
}

export type Payload<T> = { data: T };

export type Paginated<T> = { data: T; next_page: PaginationData | null };
