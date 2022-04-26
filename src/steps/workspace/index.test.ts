import { executeStepWithDependencies } from '@jupiterone/integration-sdk-testing';
import { buildStepTestConfigForStep } from '../../../test/config';
import { Recording, setupProjectRecording } from '../../../test/recording';
import { IntegrationSteps } from '../constants';

let recording: Recording;
afterEach(async () => {
  await recording.stop();
});

test('fetch-workspaces', async () => {
  recording = setupProjectRecording({
    directory: __dirname,
    name: 'fetch-workspaces',
  });

  const stepConfig = buildStepTestConfigForStep(IntegrationSteps.WORKSPACES);
  const stepResult = await executeStepWithDependencies(stepConfig);
  expect(stepResult).toMatchStepMetadata(stepConfig);
});
