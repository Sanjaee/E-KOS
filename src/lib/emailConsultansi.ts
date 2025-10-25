import nodemailer from "nodemailer";
import { simpleParser, ParsedMail } from "mailparser";
import Imap from "imap";
import { Stream } from "stream";
import { db } from "@/index";
import { consultations, users } from "@/db/schema";
import { eq } from "drizzle-orm";

// Define a proper type for the consultation object based on the database schema
// This will help prevent 'property does not exist' errors
type Consultation = {
  id: string;
  userId: string;
  consultationType: string;
  consultationContent: string;
  phoneNumber: string | null;
  status: string;
  adminResponse: string | null;
  adminId: string | null;
  responseDate: Date | null;
  notificationSentToAdmin: boolean;
  notificationSentToUser: boolean;
  createdAt: Date;
  updatedAt: Date;
};

// Define user type based on the database schema
type User = {
  id: string;
  email: string; // Keep email as non-nullable since it's used extensively
  name: string | null;
  emailVerified: boolean;
  image: string | null;
  role: string;
  password: string | null;
  otpCode: string | null;
  otpExpiry: Date | null;
  resetPasswordCode: string | null;
  resetPasswordExpiry: Date | null;
  loginMethod: string | null;
};

// Define email parameters type
type EmailParams = {
  to: string;
  subject: string;
  body: string;
  cc?: string[];
  replyTo?: string;
  fromName?: string; // Add optional fromName parameter
};

// Create email transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Function to send email
export async function sendEmail({
  to,
  subject,
  body,
  cc,
  replyTo,
  fromName = "Zacode Support", // Default from name
}: EmailParams) {
  const mailOptions = {
    from: `"${fromName}" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html: body,
    ...(cc && cc.length > 0 ? { cc } : {}),
    ...(replyTo ? { replyTo } : {}),
  };

  const info = await transporter.sendMail(mailOptions);
  return info;
}

// Unified function to handle email notifications for consultations
export async function handleConsultationEmail(
  type: "newConsultation" | "adminResponse",
  consultation: Consultation,
  userInfo?: User,
  adminInfo?: { name: string }
) {
  if (type === "newConsultation") {
    // Notification to admin about new consultation
    await notifyAdminOfNewConsultation(consultation, userInfo);
  } else if (type === "adminResponse") {
    // Notification to user about admin response
    await notifyUserOfConsultationResponse(consultation, userInfo, adminInfo);
  }
}

// Function to send notification to admin about new consultation
export async function notifyAdminOfNewConsultation(
  consultation: Consultation,
  userInfo?: User
) {
  const adminEmail = "afrizaahmad18@gmail.com"; // Set your fixed admin email

  // Get user information
  let userName = "Unknown User";
  let userEmail = "";

  if (userInfo) {
    userName =
      userInfo.name ||
      (userInfo.email ? userInfo.email.split("@")[0] : "Unknown User");
    userEmail = userInfo.email;
  } else if (consultation.userId) {
    // If userInfo not provided but userId exists, fetch user
    try {
      const user = await db
        .select()
        .from(users)
        .where(eq(users.id, consultation.userId))
        .limit(1);

      if (user.length > 0) {
        // Add null checks for email
        userName =
          user[0].name ||
          (user[0].email ? user[0].email.split("@")[0] : "Unknown User");
        userEmail = user[0].email || "";
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  }

  // Format date nicely
  const formattedDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  // Use the ID as the ticket identifier (ticketNumber doesn't exist in schema)
  const ticketIdentifier = consultation?.id
    ? `TKT-${consultation.id.substring(0, 8).toUpperCase()}`
    : consultation?.id;

  await sendEmail({
    to: adminEmail,
    subject: `New Consultation Request #${ticketIdentifier} from ${userName}`,
    body: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <div style="background-color: #007bff; padding: 15px; border-radius: 6px 6px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 24px;">New Consultation Request</h1>
          <p style="color: #e6f2ff; margin: 5px 0 0 0;">Received on ${formattedDate}</p>
        </div>
        
        <div style="padding: 20px; background-color: #f9f9f9;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #eeeeee; width: 40%;"><strong>Ticket Number:</strong></td>
              <td style="padding: 10px; border-bottom: 1px solid #eeeeee;"><span style="background-color: #e6f2ff; padding: 3px 8px; border-radius: 4px;">${ticketIdentifier}</span></td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #eeeeee;"><strong>User Name:</strong></td>
              <td style="padding: 10px; border-bottom: 1px solid #eeeeee;">${userName}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #eeeeee;"><strong>User Email:</strong></td>
              <td style="padding: 10px; border-bottom: 1px solid #eeeeee;">${userEmail}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #eeeeee;"><strong>Consultation Type:</strong></td>
              <td style="padding: 10px; border-bottom: 1px solid #eeeeee;"><span style="background-color: #f0f0f0; padding: 3px 8px; border-radius: 4px;">${
                consultation.consultationType
              }</span></td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #eeeeee;"><strong>Phone Number:</strong></td>
              <td style="padding: 10px; border-bottom: 1px solid #eeeeee;">${
                consultation.phoneNumber || "Not provided"
              }</td>
            </tr>
          </table>
        </div>
        
        <div style="padding: 20px;">
          <h2 style="color: #333; font-size: 18px; margin-top: 0;">Request Details:</h2>
          <div style="padding: 15px; background-color: #f5f5f5; border-left: 4px solid #007bff; margin: 10px 0; border-radius: 4px;">
            ${consultation.consultationContent}
          </div>
          
          <div style="margin-top: 30px; text-align: center;">
            <a href="${process.env.NEXTAUTH_URL}/admin/consultations/${
      consultation.id
    }" 
               style="display: inline-block; padding: 12px 24px; background-color: #007bff; color: white; text-decoration: none; border-radius: 4px; font-weight: bold;">
               Respond Now
            </a>
          </div>
          
          <p style="margin-top: 20px; font-size: 15px;">
            <strong>Note:</strong> You can reply directly to this email to respond to the consultation.
            Your reply will be sent using your configured Gmail account (${
              process.env.EMAIL_USER
            }).
          </p>
          
          <p style="color: #666; font-size: 14px; margin-top: 30px; text-align: center; border-top: 1px solid #eee; padding-top: 20px;">
            This is an automated message from your consultation system.
          </p>
        </div>
      </div>
    `,
    replyTo: userEmail || adminEmail, // Setup reply-to for easier responding
    fromName: "Zacode Support Team", // Custom from name for admin notifications
  });
}

// Function to notify user of admin response
export async function notifyUserOfConsultationResponse(
  consultation: Consultation,
  userInfo: User | undefined,
  adminInfo: { name: string } = { name: "Admin" }
) {
  // Get user email
  let userEmail = "";
  if (userInfo && userInfo.email) {
    userEmail = userInfo.email;
  } else if (consultation.userId) {
    // If userInfo not provided but userId exists, fetch user
    try {
      const user = await db
        .select()
        .from(users)
        .where(eq(users.id, consultation.userId))
        .limit(1);

      if (user.length > 0 && user[0].email) {
        userEmail = user[0].email;
      }
    } catch (error) {
      console.error("Error fetching user email:", error);
      return; // Can't proceed without user email
    }
  }

  if (!userEmail) {
    console.error("Cannot send response notification: No user email found");
    return;
  }

  // Get admin name
  const adminName = adminInfo?.name || "Admin";

  // Format response date nicely
  const responseDate = new Date(
    consultation.responseDate || new Date()
  ).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  // For a consultation object you already have
  const ticketIdentifier = consultation?.id
    ? `TKT-${consultation.id.substring(0, 8).toUpperCase()}`
    : consultation?.id;

  await sendEmail({
    to: userEmail,
    subject: `Your Consultation #${ticketIdentifier} Has Been Answered`,
    body: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <div style="background-color: #28a745; padding: 15px; border-radius: 6px 6px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 24px;">Your Consultation Has Been Answered</h1>
          <p style="color: #e6ffe6; margin: 5px 0 0 0;">Ticket #${ticketIdentifier}</p>
        </div>
        
        <div style="padding: 20px;">
          <p style="font-size: 16px;">Dear User,</p>
          <p>We're pleased to inform you that your consultation request has been reviewed and answered by our team.</p>
          
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 4px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #444;">Consultation Summary</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #eeeeee; width: 40%;"><strong>Type:</strong></td>
                <td style="padding: 8px; border-bottom: 1px solid #eeeeee;"><span style="background-color: #f0f0f0; padding: 3px 8px; border-radius: 4px;">${
                  consultation.consultationType
                }</span></td>
              </tr>
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #eeeeee;"><strong>Responded by:</strong></td>
                <td style="padding: 8px; border-bottom: 1px solid #eeeeee;">${adminName}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #eeeeee;"><strong>Response Date:</strong></td>
                <td style="padding: 8px; border-bottom: 1px solid #eeeeee;">${responseDate}</td>
              </tr>
            </table>
          </div>
          
          <h3 style="color: #333; margin-top: 25px;">Your Consultation:</h3>
          <div style="padding: 15px; background-color: #f5f5f5; border-left: 4px solid #007bff; margin: 10px 0; border-radius: 4px;">
            ${consultation.consultationContent}
          </div>
          
          <h3 style="color: #333; margin-top: 25px;">Admin Response:</h3>
          <div style="padding: 15px; background-color: #f5f5f5; border-left: 4px solid #28a745; margin: 10px 0; border-radius: 4px;">
            ${consultation.adminResponse || "No response provided yet."}
          </div>
          
          <div style="margin-top: 30px; text-align: center;">
            <a href="${process.env.NEXTAUTH_URL}/consultations/history" 
               style="display: inline-block; padding: 12px 24px; background-color: #28a745; color: white; text-decoration: none; border-radius: 4px; font-weight: bold;">
               View Your Consultations
            </a>
          </div>
          
          <div style="margin-top: 30px; padding: 15px; background-color: #f9f9f9; border-radius: 4px;">
            <p style="margin-top: 0;"><strong>Need more help?</strong></p>
            <p style="margin-bottom: 0;">If you have any further questions, please don't hesitate to create a new consultation. We're here to help!</p>
          </div>
          
          <p style="color: #666; font-size: 14px; margin-top: 30px; text-align: center; border-top: 1px solid #eee; padding-top: 20px;">
            Thank you for using our service!<br>
            This is an automated message. Please do not reply directly to this email.
          </p>
        </div>
      </div>
    `,
    fromName: "Zacode Support", // Custom from name for user notifications
  });
}

// Setup email reply handling with IMAP
let imapClient: Imap | null = null;

export function setupEmailListener() {
  // Check if already initialized
  if (imapClient) {
    try {
      imapClient.end();
    } catch (e) {
      // Ignore errors when closing
    }
  }

  // Create IMAP client
  imapClient = new Imap({
    user: process.env.EMAIL_USER as string,
    password: process.env.EMAIL_PASS as string,
    host: "imap.gmail.com",
    port: 993,
    tls: true,
    tlsOptions: { rejectUnauthorized: false },
  });

  function openInbox(cb: (err: Error | null, box: Imap.Box) => void) {
    if (!imapClient) return;
    imapClient.openBox("INBOX", false, cb);
  }

  imapClient.once("ready", () => {
    openInbox((err, box) => {
      if (err) {
        console.error("Error opening inbox:", err);
        return;
      }

      // Listen for new emails
      if (!imapClient) return;

      imapClient.on("mail", () => {
        if (!imapClient) return;

        const fetch = imapClient.seq.fetch("1:*", {
          bodies: "",
          markSeen: true,
        });

        fetch.on("message", (msg) => {
          msg.on("body", async (stream: Stream) => {
            try {
              // Parse the email - fixed the Stream type issue
              const parsed = await simpleParser(stream);

              // Check if this is a reply to a consultation (looking for ticket number in subject)
              const subject = parsed.subject || "";
              const ticketMatch = subject.match(/Request #([A-Za-z0-9-]+)/i);

              if (ticketMatch && ticketMatch[1]) {
                const ticketId = ticketMatch[1];

                // Extract response content from email body
                let responseContent = parsed.text || "";

                // Remove email threading/quoting if present
                responseContent = cleanEmailResponse(responseContent);

                // Process the admin response
                await processAdminEmailResponse(ticketId, responseContent);
              }
            } catch (error) {
              console.error("Error processing email:", error);
            }
          });
        });
      });
    });
  });

  imapClient.once("error", (err: Error) => {
    console.error("IMAP error:", err);
    // Reconnect after an error
    setTimeout(setupEmailListener, 10000);
  });

  imapClient.once("end", () => {
    console.log("IMAP connection ended");
    // Reconnect after a normal end
    setTimeout(setupEmailListener, 10000);
  });

  // Start the connection
  imapClient.connect();
  console.log("Email listener started");

  return imapClient;
}

// Clean email response by removing quoted content
function cleanEmailResponse(text: string): string {
  // Basic email reply cleaning
  // 1. Remove everything after the first occurrence of common reply delimiters
  const commonDelimiters = [
    /^\s*On.*wrote:$/m,
    /^\s*>.*$/m,
    /^\s*From:.*$/m,
    /^\s*Sent:.*$/m,
    /^\s*To:.*$/m,
    /^\s*Subject:.*$/m,
    /^\s*-+Original Message-+.*$/m,
    /^\s*-+Reply Above This Line-+.*$/m,
  ];

  let cleanedText = text;

  for (const delimiter of commonDelimiters) {
    const parts = cleanedText.split(delimiter);
    if (parts.length > 1) {
      cleanedText = parts[0].trim();
    }
  }

  // 2. Remove quoted text (lines beginning with >)
  cleanedText = cleanedText
    .split("\n")
    .filter((line) => !line.trim().startsWith(">"))
    .join("\n");

  // 3. Trim whitespace and remove signature
  cleanedText = cleanedText
    .split("--\n")[0] // Remove signature
    .trim();

  return cleanedText;
}

// Process admin email response and update the consultation
async function processAdminEmailResponse(
  ticketId: string,
  responseContent: string
) {
  try {
    // Find consultation by id (there is no ticketNumber field in the schema)
    const consultation = await db
      .select()
      .from(consultations)
      .where(eq(consultations.id, ticketId))
      .limit(1);

    if (consultation.length === 0) {
      console.error(`Consultation with ticket ID ${ticketId} not found`);
      return;
    }

    const existingConsultation = consultation[0];

    // Update the consultation
    const updatedConsultation = await db
      .update(consultations)
      .set({
        adminResponse: responseContent,
        status: "success",
        responseDate: new Date(),
        updatedAt: new Date(),
        notificationSentToUser: false, // Will set to true after sending notification
      })
      .where(eq(consultations.id, existingConsultation.id))
      .returning();

    if (updatedConsultation.length === 0) {
      console.error(`Failed to update consultation ${ticketId}`);
      return;
    }

    // Get user info to send notification
    const userInfo = await db
      .select()
      .from(users)
      .where(eq(users.id, existingConsultation.userId))
      .limit(1);

    if (userInfo.length === 0) {
      console.error(`User for consultation ${ticketId} not found`);
      return;
    }

    // Send notification to user
    await notifyUserOfConsultationResponse(
      updatedConsultation[0] as unknown as Consultation,
      userInfo[0] as User
    );

    // Update notification sent status
    await db
      .update(consultations)
      .set({ notificationSentToUser: true })
      .where(eq(consultations.id, existingConsultation.id));

    console.log(
      `Successfully processed email response for consultation ${ticketId}`
    );
  } catch (error) {
    console.error("Error processing admin email response:", error);
  }
}

// Export an initialization function for the server startup
export function initEmailConsultationSystem() {
  // Start the email listener
  setupEmailListener();
  console.log("Email consultation system initialized");
}
