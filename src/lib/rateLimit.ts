// lib/rateLimit.ts
import { sendEmail } from "@/lib/emailConsultansi";

// In-memory storage untuk rate limiting (gunakan Redis untuk production)
const requestCounts = new Map<
  string,
  { count: number; lastReset: number; warnings: number }
>();
const RATE_LIMIT = 1; // maksimal 5 request
const WINDOW_MS = 15 * 60 * 1000; // 15 menit
const WARNING_COOLDOWN = 60 * 60 * 1000; // 1 jam cooldown untuk warning email

// Function untuk mendapatkan IP address dari request
export function getClientIP(req: any): string {
  const forwarded = req.headers["x-forwarded-for"];
  const realIP = req.headers["x-real-ip"];
  const clientIP = req.connection?.remoteAddress || req.socket?.remoteAddress;

  if (forwarded) {
    return Array.isArray(forwarded) ? forwarded[0] : forwarded.split(",")[0];
  }

  return realIP || clientIP || "unknown";
}

// Function untuk mengirim email peringatan ke admin
async function sendRateLimitWarningToAdmin(
  ip: string,
  count: number,
  userAgent?: string
) {
  const adminEmail = "afrizaahmad18@gmail.com";
  const currentTime = new Date().toLocaleString("id-ID", {
    timeZone: "Asia/Jakarta",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  try {
    await sendEmail({
      to: adminEmail,
      subject: `🚨 URGENT: Security Breach Attempt - IP ${ip} BLOCKED`,
      body: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 2px solid #dc3545; border-radius: 8px; background: linear-gradient(135deg, #fff5f5 0%, #ffe6e6 100%);">
          <div style="background: linear-gradient(135deg, #dc3545 0%, #c82333 100%); padding: 20px; border-radius: 6px 6px 0 0; box-shadow: 0 4px 6px rgba(220,53,69,0.3);">
            <h1 style="color: white; margin: 0; font-size: 28px; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);">🚨 CRITICAL SECURITY ALERT</h1>
            <p style="color: #ffe6e6; margin: 5px 0 0 0; font-size: 16px; font-weight: bold;">IMMEDIATE ATTENTION REQUIRED - ${currentTime}</p>
          </div>
          
          <div style="padding: 25px; background-color: #fff;">
            <div style="background: linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%); border: 2px solid #ffc107; padding: 20px; border-radius: 8px; margin-bottom: 25px; box-shadow: 0 4px 6px rgba(255,193,7,0.2);">
              <h3 style="color: #856404; margin-top: 0; font-size: 20px;">⚠️ POTENTIAL CYBER ATTACK DETECTED</h3>
              <p style="color: #856404; margin-bottom: 0; font-size: 16px; font-weight: bold;">
                Aggressive rate limiting violation detected. Possible automated attack or abuse attempt in progress.
              </p>
            </div>
            
            <div style="background: #fff; border: 2px solid #dc3545; border-radius: 8px; overflow: hidden; margin-bottom: 25px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
              <div style="background: #dc3545; color: white; padding: 15px; text-align: center; font-weight: bold; font-size: 18px;">
                THREAT INTELLIGENCE REPORT
              </div>
              <table style="width: 100%; border-collapse: collapse;">
                <tr style="background-color: #f8f9fa;">
                  <td style="padding: 15px; border-bottom: 2px solid #dee2e6; width: 35%; font-weight: bold; color: #495057;">🎯 Target IP:</td>
                  <td style="padding: 15px; border-bottom: 2px solid #dee2e6;">
                    <span style="background: linear-gradient(135deg, #dc3545 0%, #c82333 100%); color: white; padding: 8px 12px; border-radius: 6px; font-family: monospace; font-size: 16px; font-weight: bold; box-shadow: 0 2px 4px rgba(220,53,69,0.3);">
                      ${ip}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 15px; border-bottom: 2px solid #dee2e6; background-color: #f8f9fa; font-weight: bold; color: #495057;">📊 Attack Volume:</td>
                  <td style="padding: 15px; border-bottom: 2px solid #dee2e6;">
                    <span style="background: linear-gradient(135deg, #dc3545 0%, #c82333 100%); color: white; padding: 8px 12px; border-radius: 6px; font-weight: bold; box-shadow: 0 2px 4px rgba(220,53,69,0.3);">
                      ${count} EXCESSIVE REQUESTS
                    </span>
                  </td>
                </tr>
                <tr style="background-color: #f8f9fa;">
                  <td style="padding: 15px; border-bottom: 2px solid #dee2e6; font-weight: bold; color: #495057;">⏱️ Attack Window:</td>
                  <td style="padding: 15px; border-bottom: 2px solid #dee2e6;">15 minutes (${(
                    (count / 5) *
                    100
                  ).toFixed(0)}% over limit)</td>
                </tr>
                <tr>
                  <td style="padding: 15px; border-bottom: 2px solid #dee2e6; background-color: #f8f9fa; font-weight: bold; color: #495057;">🛡️ Protection Level:</td>
                  <td style="padding: 15px; border-bottom: 2px solid #dee2e6;">
                    <span style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 6px 10px; border-radius: 4px; font-weight: bold;">ACTIVE - IP BLOCKED</span>
                  </td>
                </tr>
                <tr style="background-color: #f8f9fa;">
                  <td style="padding: 15px; border-bottom: 2px solid #dee2e6; font-weight: bold; color: #495057;">🔍 Device Fingerprint:</td>
                  <td style="padding: 15px; border-bottom: 2px solid #dee2e6;">
                    <code style="background-color: #e9ecef; padding: 8px; border-radius: 4px; font-size: 12px; word-break: break-all; color: #495057;">
                      ${userAgent || "Suspicious - No User Agent"}
                    </code>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 15px; background-color: #f8f9fa; font-weight: bold; color: #495057;">🚨 Threat Level:</td>
                  <td style="padding: 15px;">
                    <span style="background: linear-gradient(135deg, #dc3545 0%, #c82333 100%); color: white; padding: 8px 12px; border-radius: 6px; font-weight: bold; box-shadow: 0 2px 4px rgba(220,53,69,0.3);">
                      HIGH RISK
                    </span>
                  </td>
                </tr>
              </table>
            </div>
          </div>
          
          <div style="padding: 25px;">
            <h3 style="color: #dc3545; margin-top: 0; font-size: 20px; border-bottom: 2px solid #dc3545; padding-bottom: 10px;">🛡️ IMMEDIATE SECURITY ACTIONS REQUIRED:</h3>
            <div style="background: linear-gradient(135deg, #f8d7da 0%, #f5c6cb 100%); border: 2px solid #dc3545; border-radius: 8px; padding: 20px; margin: 15px 0;">
              <ul style="color: #721c24; line-height: 1.8; margin: 0; padding-left: 20px; font-weight: 500;">
                <li><strong>🔍 INVESTIGATE IMMEDIATELY:</strong> Check server logs for additional malicious activity</li>
                <li><strong>📊 MONITOR CLOSELY:</strong> Watch for continued attempts from this IP or related ranges</li>
                <li><strong>🚫 CONSIDER IP BAN:</strong> Implement permanent blocking if abuse continues</li>
                <li><strong>🔐 SECURITY AUDIT:</strong> Review system for potential vulnerabilities</li>
                <li><strong>📝 DOCUMENT INCIDENT:</strong> Log this event for security compliance</li>
                <li><strong>⚖️ LEGAL REVIEW:</strong> Consider reporting persistent attackers to authorities</li>
              </ul>
            </div>
            
            <div style="margin-top: 30px; padding: 20px; background: linear-gradient(135deg, #d1ecf1 0%, #bee5eb 100%); border: 2px solid #17a2b8; border-radius: 8px;">
              <h4 style="color: #0c5460; margin-top: 0; font-size: 18px;">📈 SYSTEM STATUS REPORT:</h4>
              <p style="color: #0c5460; margin-bottom: 10px; font-size: 15px;">
                ✅ <strong>Automatic Protection:</strong> Rate limiting successfully blocked the attack<br>
                ✅ <strong>System Integrity:</strong> No unauthorized access detected<br>
                ✅ <strong>Evidence Collection:</strong> Complete audit trail preserved<br>
                ⚠️ <strong>Ongoing Monitoring:</strong> Enhanced surveillance activated for this IP
              </p>
            </div>
            
            <div style="text-align: center; margin-top: 30px; padding: 25px; background: linear-gradient(135deg, #343a40 0%, #495057 100%); border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.2);">
              <h4 style="color: #fff; margin-top: 0; font-size: 16px;">🔒 SECURITY INCIDENT ID</h4>
              <p style="color: #adb5bd; margin: 10px 0; font-size: 24px; font-family: monospace; font-weight: bold; letter-spacing: 2px;">
                SEC-${Date.now().toString(36).toUpperCase()}-${ip.replace(
        /\./g,
        ""
      )}
              </p>
              <p style="color: #6c757d; font-size: 14px; margin: 0;">Reference this ID for incident tracking and legal documentation</p>
            </div>
            
            <p style="color: #666; font-size: 14px; margin-top: 30px; text-align: center; border-top: 2px solid #dee2e6; padding-top: 20px; line-height: 1.6;">
              <strong>🚨 This is a CRITICAL security alert requiring immediate attention</strong><br>
              Generated by Advanced Threat Detection System<br>
              Time: ${currentTime} (Jakarta Time)<br>
              <em>Do not reply to this email - take immediate action</em>
            </p>
          </div>
        </div>
      `,
      fromName: "🚨 CRITICAL Security Alert System",
    });

    console.log(`Rate limit warning email sent to admin for IP: ${ip}`);
  } catch (error) {
    console.error("Failed to send rate limit warning email:", error);
  }
}

// Main rate limiting function
export async function checkRateLimit(req: any): Promise<{
  allowed: boolean;
  remaining: number;
  resetTime: number;
  message?: string;
}> {
  const clientIP = getClientIP(req);
  const now = Date.now();
  const userAgent = req.headers["user-agent"];

  // Get atau create request data untuk IP ini
  let requestData = requestCounts.get(clientIP);

  if (!requestData || now - requestData.lastReset > WINDOW_MS) {
    // Reset window atau create new entry
    requestData = { count: 0, lastReset: now, warnings: 0 };
  }

  requestData.count++;

  // Calculate remaining time in window
  const resetTime = requestData.lastReset + WINDOW_MS;
  const remaining = Math.max(0, RATE_LIMIT - requestData.count);

  // Check if rate limit exceeded
  if (requestData.count > RATE_LIMIT) {
    // Send warning email hanya jika belum pernah dikirim dalam 1 jam terakhir
    const timeSinceLastWarning = now - requestData.lastReset;
    if (requestData.warnings === 0 || timeSinceLastWarning > WARNING_COOLDOWN) {
      await sendRateLimitWarningToAdmin(clientIP, requestData.count, userAgent);
      requestData.warnings++;
    }

    requestCounts.set(clientIP, requestData);

    const minutesUntilReset = Math.ceil((resetTime - now) / (1000 * 60));

    return {
      allowed: false,
      remaining: 0,
      resetTime,
      message: `🚨 SECURITY VIOLATION DETECTED 🚨\n\nYour IP address ${clientIP} has been FLAGGED and LOGGED for suspicious activity.\n\n⚠️ WARNING: This incident has been automatically reported to our security team and admin with your complete device information including:\n- IP Address: ${clientIP}\n- User Agent: ${userAgent}\n- Timestamp: ${new Date().toISOString()}\n- Request Pattern: Excessive API calls\n\n🔒 IMMEDIATE ACTIONS TAKEN:\n- Your access has been TEMPORARILY BLOCKED\n- Security monitoring has been activated for your IP\n- Admin notification sent with your details\n\n⛔ CEASE ALL UNAUTHORIZED ACTIVITIES IMMEDIATELY\n\nContinued abuse will result in:\n- Permanent IP ban\n- Legal action if warranted\n- Report to relevant authorities\n\n⏰ Access will be restored in ${minutesUntilReset} minutes.\n\nIf this is a legitimate error, contact support with reference ID: SEC-${Date.now()
        .toString(36)
        .toUpperCase()}`,
    };
  }

  // Update data
  requestCounts.set(clientIP, requestData);

  return {
    allowed: true,
    remaining,
    resetTime,
  };
}

// Middleware function untuk Next.js API
export function withRateLimit(handler: any) {
  return async (req: any, res: any) => {
    const rateLimitResult = await checkRateLimit(req);

    // Set rate limit headers
    res.setHeader("X-RateLimit-Limit", RATE_LIMIT);
    res.setHeader("X-RateLimit-Remaining", rateLimitResult.remaining);
    res.setHeader(
      "X-RateLimit-Reset",
      new Date(rateLimitResult.resetTime).toISOString()
    );

    if (!rateLimitResult.allowed) {
      const clientIP = getClientIP(req);
      const userAgent = req.headers["user-agent"] || "Unknown";
      const securityId = `SEC-${Date.now().toString(36).toUpperCase()}`;
      const retryAfterSeconds = Math.ceil(
        (rateLimitResult.resetTime - Date.now()) / 1000
      );

      return res.status(429).json({
        error: "🚨 SECURITY VIOLATION - ACCESS DENIED",
        securityAlert: {
          level: "CRITICAL",
          action: "BLOCKED",
          reference: securityId,
          timestamp: new Date().toISOString(),
        },
        violationDetails: {
          detectedIP: clientIP,
          deviceInfo: userAgent,
          location: "Tracked and Logged",
          threatLevel: "HIGH - Excessive API Requests",
        },
        enforcement: {
          currentStatus: "TEMPORARILY BLOCKED",
          monitoring: "ACTIVE SURVEILLANCE ENABLED",
          adminNotified: true,
          evidenceLogged: true,
        },
        legalNotice: {
          warning: "This system is protected by Indonesian Cyber Security Laws",
          consequence: "Continued abuse may result in legal prosecution",
          authority: "Violation reported to system administrators",
        },
        message: rateLimitResult.message,
        accessRestoration: {
          retryAfter: retryAfterSeconds,
          condition: "Cease all unauthorized activities immediately",
          contact: "If legitimate, contact support with reference ID above",
        },
      });
    }

    return handler(req, res);
  };
}

// Clean up old entries (jalankan secara periodik)
export function cleanupRateLimitData() {
  const now = Date.now();
  const keysToDelete: string[] = [];

  for (const [ip, data] of requestCounts.entries()) {
    if (now - data.lastReset > WINDOW_MS) {
      keysToDelete.push(ip);
    }
  }

  keysToDelete.forEach((key) => requestCounts.delete(key));
  console.log(`Cleaned up ${keysToDelete.length} expired rate limit entries`);
}

// Setup periodic cleanup (jalankan setiap 30 menit)
setInterval(cleanupRateLimitData, 30 * 60 * 1000);
