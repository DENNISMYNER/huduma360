export type IdentityCheckResult = {
  matched: boolean;
  fullNameOnRecord?: string;
};

/**
 * Represents a lookup against an external government identity registry (e.g. IPRS).
 * Isolated behind this interface so a real government API can be dropped in later
 * without touching application submission logic.
 */
export interface IdentityProvider {
  verify(nationalId: string, fullName: string): Promise<IdentityCheckResult>;
}

/**
 * Mock implementation. Does NOT call any real government system — it is a local stand-in
 * so the application-submission flow can be demonstrated end to end. It accepts any
 * well-formed Kenyan-style national ID (7–8 digits) and reports a match.
 */
export class MockIdentityProvider implements IdentityProvider {
  async verify(nationalId: string, fullName: string): Promise<IdentityCheckResult> {
    const wellFormed = /^\d{7,8}$/.test(nationalId);
    return { matched: wellFormed, fullNameOnRecord: wellFormed ? fullName : undefined };
  }
}

let instance: IdentityProvider | null = null;

export function getIdentityProvider(): IdentityProvider {
  if (!instance) instance = new MockIdentityProvider();
  return instance;
}
