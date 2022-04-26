# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Ingest new entities
  - `asana_account`
  - `asana_user`
  - `asana_project`
  - `asana_project_membership`
  - `asana_team`
  - `asana_workspace`
- Build new relationships
  - `asana_account_has_workspace`
  - `asana_workspace_has_user`
  - `asana_workspace_has_team`
  - `asana_team_has_user`
  - `asana_workspace_has_project`
  - `asana_team_assigned_project`
  - `asana_user_owns_project`
  - `asana_project_has_membership`
  - `asana_user_assigned_project_membership`
  - `asana_project_membership_allows_project`
