export interface LtiLaunchParams {
  iss: string; // Issuer (CyberAI Academy)
  sub: string; // Subject (User ID)
  aud: string; // Audience (Cisco NetAcad LTI Platform)
  exp: number; // Expiry
  iat: number; // Issued At
  nonce: string;
  'https://purl.imsglobal.org/spec/lti/claim/deployment_id': string;
  'https://purl.imsglobal.org/spec/lti/claim/target_link_uri': string;
  'https://purl.imsglobal.org/spec/lti/claim/context': {
    id: string;
    label: string;
    title: string;
    type: string[];
  };
  'https://purl.imsglobal.org/spec/lti/claim/resource_link': {
    id: string;
    title: string;
  };
  'https://purl.imsglobal.org/spec/lti/claim/roles': string[];
}

export interface SyncStatus {
  isLinked: boolean;
  netacadUserId: string | null;
  lastSynced: string | null;
  syncedCoursesCount: number;
}

class NetacadService {
  private syncStatus: SyncStatus = {
    isLinked: true,
    netacadUserId: "NET-ACAD-8849201",
    lastSynced: new Date().toISOString().split('T')[0],
    syncedCoursesCount: 2
  };

  getSyncStatus(): SyncStatus {
    return this.syncStatus;
  }

  /**
   * Generates a standard LTI 1.3 launch payload for secure redirection or iframe embedding
   * of Cisco NetAcad content.
   */
  generateLtiLaunch(userId: string, courseId: string, courseTitle: string): LtiLaunchParams {
    const iat = Math.floor(Date.now() / 1000);
    const exp = iat + 3600; // 1 hour token
    
    return {
      iss: "https://cyberaiacademy.com",
      sub: userId,
      aud: "https://api.netacad.com/lti",
      iat,
      exp,
      nonce: Math.random().toString(36).substring(7),
      'https://purl.imsglobal.org/spec/lti/claim/deployment_id': "dep-cyberai-01",
      'https://purl.imsglobal.org/spec/lti/claim/target_link_uri': `https://netacad.com/courses/${courseId}/launch`,
      'https://purl.imsglobal.org/spec/lti/claim/context': {
        id: `context-${courseId}`,
        label: courseId.toUpperCase(),
        title: courseTitle,
        type: ["CourseSection"]
      },
      'https://purl.imsglobal.org/spec/lti/claim/resource_link': {
        id: `res-${courseId}-01`,
        title: `${courseTitle} - Integrated Labs`
      },
      'https://purl.imsglobal.org/spec/lti/claim/roles': [
        "http://purl.imsglobal.org/vocab/lis/v2/membership#Learner"
      ]
    };
  }

  /**
   * Simulates LTI 1.3 AGS (Assignment and Grade Services) LineItem score sync back to Cisco NetAcad.
   */
  async syncScoreToNetAcad(userId: string, courseId: string, score: number): Promise<{ success: boolean; transactionId: string }> {
    console.log(`[LTI AGS] Initiating score sync for user ${userId} in course ${courseId}. Score: ${score}%`);
    
    // Simulate API request delay
    return new Promise((resolve) => {
      setTimeout(() => {
        this.syncStatus.lastSynced = new Date().toISOString().split('T')[0];
        resolve({
          success: true,
          transactionId: "tx-ags-" + Math.random().toString(36).substring(2, 10).toUpperCase()
        });
      }, 1000);
    });
  }

  /**
   * Mocks dynamic co-enrollment check. If user enrolls in a local course,
   * we verify if they should be automatically assigned the corresponding Cisco NetAcad track.
   */
  checkCoEnrollment(localCourseId: string): { requiresNetAcadSync: boolean; netacadCourseCode: string | null } {
    const mappings: Record<string, string> = {
      'cyberops': 'SEC-CYBEROPS',
      'net-auto': 'DEV-NET-ASSOC',
      'intro-cyber': 'INTRO-CYBERSEC'
    };

    if (localCourseId in mappings) {
      return {
        requiresNetAcadSync: true,
        netacadCourseCode: mappings[localCourseId]
      };
    }

    return {
      requiresNetAcadSync: false,
      netacadCourseCode: null
    };
  }
}

export const netacadService = new NetacadService();
