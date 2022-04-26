import { executeStepWithDependencies } from '@jupiterone/integration-sdk-testing';
import { buildStepTestConfigForStep } from '../../../test/config';
import { Recording, setupProjectRecording } from '../../../test/recording';
import { IntegrationSteps } from '../constants';

let recording: Recording;
afterEach(async () => {
  await recording.stop();
});

test('fetch-and-build-project-memberships', async () => {
  recording = setupProjectRecording({
    directory: __dirname,
    name: 'fetch-and-build-project-memberships',
  });

  const stepConfig = buildStepTestConfigForStep(
    IntegrationSteps.FETCH_AND_BUILD_PROJECT_MEMBERSHIPS,
  );
  const stepResult = await executeStepWithDependencies(stepConfig);
  expect(stepResult).toMatchStepMetadata(stepConfig);
});

test('build-project-membership-and-user-relationship', async () => {
  recording = setupProjectRecording({
    directory: __dirname,
    name: 'build-project-membership-and-user-relationship',
  });

  const stepConfig = buildStepTestConfigForStep(
    IntegrationSteps.BUILD_PROJECT_MEMBERSHIP_AND_USER_RELATIONSHIP,
  );
  const stepResult = await executeStepWithDependencies(stepConfig);
  expect(stepResult).toMatchStepMetadata(stepConfig);
});

test('build-project-membership-allows-project-relationship', async () => {
  recording = setupProjectRecording({
    directory: __dirname,
    name: 'build-project-membership-allows-project-relationship',
  });

  const stepConfig = buildStepTestConfigForStep(
    IntegrationSteps.BUILD_PROJECT_MEMBERSHIP_ALLOWS_PROJECT_RELATIONSHIP,
  );
  const stepResult = await executeStepWithDependencies(stepConfig);
  expect(stepResult).toMatchStepMetadata(stepConfig);
});
