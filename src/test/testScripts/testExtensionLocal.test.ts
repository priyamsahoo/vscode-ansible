import { testDiagnosticsAnsibleLocal } from './diagnostics/testDiagnoticsAnsibleLocal.test';
import { testHoverLocal } from './hover/testHoverLocal.test';

describe('TEST EXTENSION IN LOCAL ENVIRONMENT', () => {
  testHoverLocal();
  testDiagnosticsAnsibleLocal();
});
