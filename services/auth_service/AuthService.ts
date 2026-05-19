import { SignJWT, jwtVerify, JWTPayload } from "jose";
import { UserRole } from "../../shared/types/auth";

export interface SovereignTokenPayload extends JWTPayload {
  id: string;
  role: UserRole;
  name: string;
  district?: string;
  state?: string;
  tenant_id: string;
}

export class AuthService {
  private static SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "SOVEREIGN_INFRA_SECRET_DO_NOT_USE_IN_PROD");
  private static ALGO = "HS256";

  static async generateToken(payload: SovereignTokenPayload): Promise<string> {
    return await new SignJWT(payload)
      .setProtectedHeader({ alg: this.ALGO })
      .setIssuedAt()
      .setExpirationTime("24h")
      .sign(this.SECRET);
  }

  static async verifyToken(token: string): Promise<SovereignTokenPayload> {
    const { payload } = await jwtVerify(token, this.SECRET, {
      algorithms: [this.ALGO],
    });
    return payload as SovereignTokenPayload;
  }

  // Keycloak Integration Simulator
  // In a real production environment, this would call Keycloak/Gatekeeper APIs
  static getRealmConfig(tenantId: string) {
    return {
      realm: `RupayKg-${tenantId}`,
      authServerUrl: process.env.KEYCLOAK_URL || "http://keycloak:8080",
      sslRequired: "external",
      resource: "rupaykg-platform",
      publicClient: true,
      confidentialPort: 0
    };
  }
}
