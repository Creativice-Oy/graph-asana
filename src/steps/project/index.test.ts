import { executeStepWithDependencies } from '@jupiterone/integration-sdk-testing';
import { buildStepTestConfigForStep } from '../../../test/config';
import { Recording, setupProjectRecording } from '../../../test/recording';
import { IntegrationSteps } from '../constants';

let recording: Recording;
afterEach(async () => {
  await recording.stop();
});

test('fetch-and-build-workspace-projects', async () => {
  recording = setupProjectRecording({
    directory: __dirname,
    name: 'fetch-and-build-workspace-projects',
  });

  const stepConfig = buildStepTestConfigForStep(
    IntegrationSteps.FETCH_AND_BUILD_WORKSPACE_PROJECTS,
  );
  const stepResult = await executeStepWithDependencies(stepConfig);
  expect(stepResult).toMatchStepMetadata(stepConfig);
});

test('build-team-and-project-relationship', async () => {
  recording = setupProjectRecording({
    directory: __dirname,
    name: 'build-team-and-project-relationship',
  });

  const stepConfig = buildStepTestConfigForStep(
    IntegrationSteps.BUILD_TEAM_AND_PROJECT_RELATIONSHIP,
  );
  const stepResult = await executeStepWithDependencies(stepConfig);
  expect(stepResult).toMatchStepMetadata(stepConfig);
});

test('build-project-user-owns-project-relationship', async () => {
  recording = setupProjectRecording({
    directory: __dirname,
    name: 'build-project-user-owns-project-relationship',
  });

  const stepConfig = buildStepTestConfigForStep(
    IntegrationSteps.BUILD_USER_OWNS_PROJECT_RELATIONSHIP,
  );
  const stepResult = await executeStepWithDependencies(stepConfig);
  expect(stepResult).toMatchStepMetadata(stepConfig);
});
