import { onDocumentCreated } from "firebase-functions/v2/firestore";
import * as logger from "firebase-functions/logger";
import * as admin from "firebase-admin";
import * as nodemailer from "nodemailer";

admin.initializeApp();
const db = admin.firestore();

interface InquiryData {
  name: string;
  email: string;
  subject?: string;
  message: string;
  service?: string;
  budget?: string;
  timeline?: string;
  status?: string;
  read?: boolean;
  createdAt?: any;
  notificationSent?: boolean;
}

/**
 * Cloud Function triggered when a new inquiry document is created in Firestore
 * 1. Reads the new inquiry
 * 2. Finds registered notification tokens in adminNotificationTokens
 * 3. Sends FCM push notification with inquiry metadata
 * 4. Cleans up stale/invalid FCM tokens automatically
 * 5. Sends HTML/Text email notification to admin via secure SMTP
 */
export const onInquiryCreated = onDocumentCreated("inquiries/{inquiryId}", async (event) => {
  const snapshot = event.data;
  if (!snapshot) {
    logger.warn("No document data found for inquiry event.");
    return;
  }

  const inquiryId = event.params.inquiryId;
  const inquiry = snapshot.data() as InquiryData;

  // Prevent duplicate notifications
  if (inquiry.notificationSent) {
    logger.info(`Inquiry ${inquiryId} notification already handled.`);
    return;
  }

  logger.info(`New inquiry received: ${inquiryId} from ${inquiry.name} (${inquiry.email})`);

  const inquirySubject = inquiry.subject || inquiry.service || "Portfolio Project Inquiry";
  const notificationTitle = "New Contact Inquiry";
  const notificationBody = `New message from ${inquiry.name}: ${inquirySubject}`;

  // 1. Deliver FCM Push Notification to registered admin devices
  try {
    const tokensSnapshot = await db.collection("adminNotificationTokens")
      .where("active", "==", true)
      .get();

    if (!tokensSnapshot.empty) {
      const tokens: string[] = [];
      const tokenDocIds: string[] = [];

      tokensSnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.token && typeof data.token === "string" && !data.token.startsWith("local-")) {
          tokens.push(data.token);
          tokenDocIds.push(doc.id);
        }
      });

      if (tokens.length > 0) {
        logger.info(`Dispatching FCM push notification to ${tokens.length} device(s).`);

        const response = await admin.messaging().sendEachForMulticast({
          tokens,
          notification: {
            title: notificationTitle,
            body: notificationBody,
          },
          data: {
            inquiryId: inquiryId,
            url: `/admin?view=contact-inquiries&id=${inquiryId}`,
            name: inquiry.name || "",
            email: inquiry.email || "",
            subject: inquirySubject,
          },
          webpush: {
            fcmOptions: {
              link: `/admin?view=contact-inquiries&id=${inquiryId}`,
            },
            notification: {
              icon: "/favicon.ico",
              badge: "/favicon.ico",
              tag: inquiryId,
            },
          },
        });

        logger.info(`FCM response: ${response.successCount} succeeded, ${response.failureCount} failed.`);

        // Handle invalid or expired tokens - clean them up from Firestore
        if (response.failureCount > 0) {
          const batch = db.batch();
          let cleanedCount = 0;
          response.responses.forEach((resp, idx) => {
            if (!resp.success) {
              const errorCode = resp.error?.code;
              if (
                errorCode === "messaging/invalid-registration-token" ||
                errorCode === "messaging/registration-token-not-registered"
              ) {
                logger.info(`Pruning invalid token document: ${tokenDocIds[idx]}`);
                const badTokenRef = db.collection("adminNotificationTokens").doc(tokenDocIds[idx]);
                batch.delete(badTokenRef);
                cleanedCount++;
              }
            }
          });
          if (cleanedCount > 0) {
            await batch.commit();
            logger.info(`Pruned ${cleanedCount} expired notification token(s).`);
          }
        }
      }
    } else {
      logger.info("No active admin notification tokens registered yet.");
    }
  } catch (pushErr) {
    logger.error("Error dispatching FCM push notification:", pushErr);
  }

  // 2. Deliver Email Notification to Admin
  try {
    const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || "saurabh22102@gmail.com";
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = parseInt(process.env.SMTP_PORT || "587", 10);
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;

    if (smtpHost && smtpUser && smtpPass) {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      const submissionDate = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
      const emailSubject = `New Portfolio Contact: ${inquirySubject}`;

      const textBody = `
New Contact Inquiry Received

Name: ${inquiry.name}
Email: ${inquiry.email}
Subject: ${inquirySubject}
Service: ${inquiry.service || "General Inquiry"}
Budget: ${inquiry.budget || "Flexible"}
Timeline: ${inquiry.timeline || "Immediate"}
Date: ${submissionDate} IST

Message:
${inquiry.message}

---
Manage Inquiries in Admin Dashboard:
https://saurabhprotfolio.web.app/admin?view=contact-inquiries
      `.trim();

      const htmlBody = `
<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #0c0c10; color: #f5f5f4; border: 1px solid #27272a; border-radius: 12px; overflow: hidden;">
  <div style="background-color: #18181b; padding: 24px 32px; border-bottom: 1px solid #27272a;">
    <span style="font-family: monospace; font-size: 11px; letter-spacing: 0.2em; color: #a1a1aa; text-transform: uppercase;">PORTFOLIO ALERT</span>
    <h2 style="margin: 6px 0 0 0; font-size: 20px; font-weight: 700; color: #ffffff; text-transform: uppercase;">New Contact Inquiry</h2>
  </div>
  <div style="padding: 32px;">
    <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 14px;">
      <tr>
        <td style="padding: 8px 0; color: #a1a1aa; width: 100px;"><strong>Name:</strong></td>
        <td style="padding: 8px 0; color: #ffffff; font-weight: 600;">${inquiry.name}</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; color: #a1a1aa;"><strong>Email:</strong></td>
        <td style="padding: 8px 0;"><a href="mailto:${inquiry.email}" style="color: #60a5fa; text-decoration: underline;">${inquiry.email}</a></td>
      </tr>
      <tr>
        <td style="padding: 8px 0; color: #a1a1aa;"><strong>Subject:</strong></td>
        <td style="padding: 8px 0; color: #ffffff;">${inquirySubject}</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; color: #a1a1aa;"><strong>Service:</strong></td>
        <td style="padding: 8px 0; color: #ffffff;">${inquiry.service || "General Inquiry"}</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; color: #a1a1aa;"><strong>Budget:</strong></td>
        <td style="padding: 8px 0; color: #ffffff;">${inquiry.budget || "Flexible"}</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; color: #a1a1aa;"><strong>Timeline:</strong></td>
        <td style="padding: 8px 0; color: #ffffff;">${inquiry.timeline || "Immediate"}</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; color: #a1a1aa;"><strong>Date:</strong></td>
        <td style="padding: 8px 0; color: #a1a1aa; font-family: monospace; font-size: 12px;">${submissionDate} IST</td>
      </tr>
    </table>

    <div style="background-color: #18181b; border: 1px solid #27272a; border-radius: 8px; padding: 20px; margin-bottom: 28px;">
      <span style="font-family: monospace; font-size: 10px; color: #a1a1aa; text-transform: uppercase; letter-spacing: 0.1em; display: block; margin-bottom: 8px;">PROJECT BRIEF</span>
      <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #e4e4e7; white-space: pre-wrap;">${inquiry.message}</p>
    </div>

    <div style="text-align: center;">
      <a href="mailto:${inquiry.email}?subject=Re: ${encodeURIComponent(inquirySubject)}" style="display: inline-block; background-color: #ffffff; color: #09090b; font-family: monospace; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin-right: 12px;">Reply via Email</a>
    </div>
  </div>
</div>
      `.trim();

      await transporter.sendMail({
        from: `"Saurabh Portfolio" <${smtpUser}>`,
        to: adminEmail,
        replyTo: inquiry.email,
        subject: emailSubject,
        text: textBody,
        html: htmlBody,
      });

      logger.info(`Email notification successfully dispatched to ${adminEmail}`);
    } else {
      logger.info(
        "SMTP environment variables not configured. Skipping email dispatch. (Configure SMTP_HOST, SMTP_USER, SMTP_PASS, and ADMIN_NOTIFICATION_EMAIL in Cloud Functions)."
      );
    }
  } catch (emailErr) {
    logger.error("Error dispatching email notification:", emailErr);
  }

  // 3. Mark inquiry as notification processed
  try {
    await snapshot.ref.update({
      notificationSent: true,
      notificationSentAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  } catch (updErr) {
    logger.warn("Could not mark inquiry notificationSent:", updErr);
  }
});
