import { executeStepWithDependencies } from '@jupiterone/integration-sdk-testing';
import { buildStepTestConfigForStep } from '../../../test/config';
import { Recording, setupProjectRecording } from '../../../test/recording';
import { IntegrationSteps } from '../constants';

let recording: Recording;
afterEach(async () => {
  await recording.stop();
});

test('fetch-and-build-workspace-teams', async () => {
  recording = setupProjectRecording({
    directory: __dirname,
    name: 'fetch-and-build-workspace-teams',
  });

  const stepConfig = buildStepTestConfigForStep(
    IntegrationSteps.FETCH_AND_BUILD_WORKSPACE_TEAMS,
  );
  const stepResult = await executeStepWithDependencies(stepConfig);
  expect(stepResult).toMatchStepMetadata(stepConfig);
});

test('build-team-and-user-relationship', async () => {
  recording = setupProjectRecording({
    directory: __dirname,
    name: 'build-team-and-user-relationship',
  });

  const stepConfig = buildStepTestConfigForStep(
    IntegrationSteps.BUILD_TEAM_AND_USER_RELATIONSHIP,
  );
  const stepResult = await executeStepWithDependencies(stepConfig);
  expect(stepResult).toMatchStepMetadata(stepConfig);
});
