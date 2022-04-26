import { executeStepWithDependencies } from '@jupiterone/integration-sdk-testing';
import { buildStepTestConfigForStep } from '../../../test/config';
import { Recording, setupProjectRecording } from '../../../test/recording';
import { IntegrationSteps } from '../constants';

let recording: Recording;
afterEach(async () => {
  await recording.stop();
});

test('fetch-and-build-workspace-users', async () => {
  recording = setupProjectRecording({
    directory: __dirname,
    name: 'fetch-and-build-workspace-users',
  });

  const stepConfig = buildStepTestConfigForStep(
    IntegrationSteps.FETCH_AND_BUILD_WORKSPACE_USERS,
  );
  const stepResult = await executeStepWithDependencies(stepConfig);
  expect(stepResult).toMatchStepMetadata(stepConfig);
});
