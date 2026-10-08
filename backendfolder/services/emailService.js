import dotenv from "dotenv";
dotenv.config();

/**
 * Pet Adoption Portal - Centralized Email Dispatcher using Resend REST API
 */

const renderEmailLayout = ({ title, preheader, bodyContent }) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; color: #1e293b; }
    .email-container { max-width: 600px; margin: 30px auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.06); border: 1px solid #e2e8f0; }
    .email-header { background: linear-gradient(135deg, #ea580c 0%, #f97316 100%); padding: 32px 24px; text-align: center; color: #ffffff; }
    .email-header h1 { margin: 0 0 6px; font-size: 24px; font-weight: 800; letter-spacing: -0.5px; }
    .email-header p { margin: 0; font-size: 14px; opacity: 0.9; }
    .email-body { padding: 32px 28px; }
    .badge { display: inline-block; padding: 6px 14px; border-radius: 20px; font-size: 13px; font-weight: 700; text-transform: uppercase; margin-bottom: 18px; }
    .badge-approved { background-color: #dcfce7; color: #15803d; border: 1px solid #bbf7d0; }
    .badge-reviewed { background-color: #e0f2fe; color: #0369a1; border: 1px solid #bae6fd; }
    .badge-pending { background-color: #fef3c7; color: #b45309; border: 1px solid #fde68a; }
    .badge-rejected { background-color: #fee2e2; color: #b91c1c; border: 1px solid #fecaca; }
    .badge-donation { background-color: #ffedd5; color: #c2410c; border: 1px solid #fed7aa; }
    .info-card { background: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0; padding: 18px 20px; margin: 20px 0; }
    .info-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px dashed #e2e8f0; font-size: 14px; }
    .info-row:last-child { border-bottom: none; }
    .info-label { color: #64748b; font-weight: 500; }
    .info-val { color: #0f172a; font-weight: 700; text-align: right; }
    .email-footer { background: #f1f5f9; padding: 24px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; }
    .email-footer a { color: #ea580c; text-decoration: none; font-weight: 600; }
  </style>
</head>
<body>
  <div style="display:none;font-size:1px;color:#f8fafc;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;">
    ${preheader || title}
  </div>
  <div class="email-container">
    <div class="email-header">
      <h1>🐾 PetCare Rescue Shelter</h1>
      <p>Compassionate care & loving forever homes</p>
    </div>
    <div class="email-body">
      ${bodyContent}
    </div>
    <div class="email-footer">
      <p>PetCare Shelter & Adoption Center • Sector 14, Main Road, City Center</p>
      <p>Need support? Contact us at <a href="mailto:support@petcare.com">support@petcare.com</a> or call +91 98765 43210</p>
      <p style="margin-top: 10px; font-size: 11px; color: #94a3b8;">© ${new Date().getFullYear()} PetCare Animal Welfare Trust. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
  `.trim();
};

export const sendEmail = async ({ to, subject, html, text }) => {
  const preferredFrom = process.env.EMAIL_FROM || "PetCare Support <support@petcare.com>";
  const fallbackFrom = "PetCare Support <onboarding@resend.dev>";
  const replyTo = "support@petcare.com";
  const resendApiKey = process.env.RESEND_API_KEY;

  if (!resendApiKey) {
    console.log(`ℹ️ [Email Dispatcher] No RESEND_API_KEY provided. Skipped sending to ${to}`);
    return { success: false, reason: "NO_API_KEY" };
  }

  const trySend = async (fromAddress) => {
    return await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: fromAddress,
        to: [to],
        reply_to: replyTo,
        subject,
        html,
        text,
      }),
    });
  };

  try {
    let response = await trySend(preferredFrom);
    let data = await response.json();

    // If custom domain is not yet verified in Resend, automatically fallback to sandbox sender
    if (!response.ok && data.message && (data.message.includes("domain") || data.message.includes("verify") || data.statusCode === 403)) {
      console.log(`ℹ️ Custom domain unverified, retrying with verified sandbox sender: ${fallbackFrom}`);
      response = await trySend(fallbackFrom);
      data = await response.json();
    }

    if (response.ok) {
      console.log(`✉️ [Resend] Email sent to ${to} (ID: ${data.id})`);
      return { success: true, id: data.id };
    } else {
      console.warn(`⚠️ [Resend API Notice]: ${data.message || JSON.stringify(data)}`);
      return { success: false, error: data.message };
    }
  } catch (error) {
    console.error("❌ Failed to dispatch email via Resend:", error.message);
    return { success: false, error: error.message };
  }
};

/**
 * 1. Adoption Application Received Confirmation
 */
export const sendAdoptionConfirmationEmail = async ({ applicantName, applicantEmail, petName, referenceId, mobile }) => {
  const subject = `🐾 Application Received: Adoption Request for ${petName}`;
  const preheader = `Thank you ${applicantName}! We have received your adoption request for ${petName}.`;

  const bodyContent = `
    <span class="badge badge-pending">Application Received</span>
    <h2 style="font-size: 20px; margin-top: 0; color: #0f172a;">Dear ${applicantName},</h2>
    <p style="font-size: 15px; line-height: 1.6; color: #334155;">
      Thank you for choosing to adopt! We have safely received your adoption application for <strong>${petName}</strong>.
      Our shelter adoption team is currently reviewing your profile to ensure the best companion match.
    </p>

    <div class="info-card">
      <div class="info-row">
        <span class="info-label">Application Ref ID</span>
        <span class="info-val">#${referenceId ? referenceId.slice(-8).toUpperCase() : "ADOPT"}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Pet Preference</span>
        <span class="info-val">${petName}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Contact Mobile</span>
        <span class="info-val">${mobile}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Current Status</span>
        <span class="info-val" style="color: #d97706;">Pending Verification</span>
      </div>
    </div>

    <h3 style="font-size: 16px; color: #0f172a; margin-top: 24px; margin-bottom: 8px;">What to expect next:</h3>
    <ol style="font-size: 14px; line-height: 1.6; color: #475569; padding-left: 20px; margin-top: 4px;">
      <li>Our adoption coordinator will review your submitted contact details.</li>
      <li>You will receive a phone or WhatsApp call within 24–48 hours to discuss home environment suitability.</li>
      <li>Upon pre-approval, you can schedule an in-person shelter visit to meet your new pet!</li>
    </ol>
  `;

  const html = renderEmailLayout({ title: subject, preheader, bodyContent });
  return sendEmail({ to: applicantEmail, subject, html, text: `Thank you ${applicantName}! Your adoption application for ${petName} is received.` });
};

/**
 * 2. Adoption Status Updated Notification (Approved / Reviewed / Rejected)
 */
export const sendAdoptionStatusUpdateEmail = async ({ applicantName, applicantEmail, petName, newStatus, referenceId }) => {
  let badgeClass = "badge-pending";
  let statusHeadline = "";
  let statusMessage = "";
  let subject = "";

  if (newStatus === "approved") {
    badgeClass = "badge-approved";
    subject = `🎉 Great News! Your Adoption for ${petName} has been APPROVED!`;
    statusHeadline = "Congratulations! Your Adoption Request is Approved! 🐾";
    statusMessage = `
      We are overjoyed to inform you that your adoption application for <strong>${petName}</strong> has been officially <strong>APPROVED</strong>!
      Your future companion is eagerly waiting to start their new chapter with you.
      <br/><br/>
      <strong>Next Steps for Collection:</strong>
      <ul style="padding-left: 20px; margin-top: 8px;">
        <li>Please visit our Shelter Center between <strong>10:00 AM - 5:00 PM (Mon-Sat)</strong>.</li>
        <li>Bring a valid Government Photo ID and proof of address.</li>
        <li>Bring a pet carrier (for cats) or collar & leash (for dogs).</li>
      </ul>
    `;
  } else if (newStatus === "reviewed") {
    badgeClass = "badge-reviewed";
    subject = `📋 Update on your Adoption Request for ${petName}`;
    statusHeadline = "Application Under Active Review";
    statusMessage = `
      Your adoption application for <strong>${petName}</strong> has been reviewed by our staff.
      Our adoption coordinator will reach out to you shortly via phone/WhatsApp to coordinate the next interview step.
    `;
  } else if (newStatus === "rejected") {
    badgeClass = "badge-rejected";
    subject = `Update regarding your adoption application for ${petName}`;
    statusHeadline = "Application Update";
    statusMessage = `
      Thank you for your heartfelt interest in adopting <strong>${petName}</strong>. 
      At this time, this specific pet has been paired with another applicant or requires specialized housing conditions.
      We encourage you to explore other rescued pets looking for caring homes on our platform.
    `;
  } else {
    badgeClass = "badge-pending";
    subject = `Adoption Status Notice for ${petName}`;
    statusHeadline = `Application Status: ${newStatus.toUpperCase()}`;
    statusMessage = `Your adoption request for ${petName} is currently marked as ${newStatus}.`;
  }

  const bodyContent = `
    <span class="badge ${badgeClass}">${newStatus.toUpperCase()}</span>
    <h2 style="font-size: 20px; margin-top: 0; color: #0f172a;">${statusHeadline}</h2>
    <p style="font-size: 15px; line-height: 1.6; color: #334155;">
      Dear ${applicantName},
    </p>
    <div style="font-size: 14.5px; line-height: 1.6; color: #334155;">
      ${statusMessage}
    </div>

    <div class="info-card" style="margin-top: 24px;">
      <div class="info-row">
        <span class="info-label">Pet Name</span>
        <span class="info-val">${petName}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Application ID</span>
        <span class="info-val">#${referenceId ? referenceId.slice(-8).toUpperCase() : "ADOPT"}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Updated Status</span>
        <span class="info-val" style="text-transform: capitalize;">${newStatus}</span>
      </div>
    </div>
  `;

  const html = renderEmailLayout({ title: subject, preheader: `Your adoption application status for ${petName} has been updated to ${newStatus}.`, bodyContent });
  return sendEmail({ to: applicantEmail, subject, html, text: `Status update for your adoption of ${petName}: ${newStatus}` });
};

/**
 * 3. Donation Contribution Acknowledgment Email
 */
export const sendDonationReceiptEmail = async ({ donorName, donorEmail, type, amount, item, quantity, description, donationId }) => {
  const receiptNo = `REC-${new Date().getFullYear()}-${donationId ? donationId.slice(-6).toUpperCase() : Math.floor(100000 + Math.random() * 900000)}`;
  const isMoney = type === "money";
  const subject = isMoney
    ? `🧾 Donation Acknowledgment #${receiptNo} - PetCare Shelter`
    : `📦 Supply Donation Acknowledgment #${receiptNo} - PetCare Shelter`;

  const formattedAmount = isMoney ? `₹${Number(amount).toLocaleString("en-IN")}` : `${item} (Qty: ${quantity || 1})`;

  const bodyContent = `
    <span class="badge badge-donation">Contribution Recorded</span>
    <h2 style="font-size: 20px; margin-top: 0; color: #0f172a;">Thank you for your generosity, ${donorName}! 🧡</h2>
    <p style="font-size: 15px; line-height: 1.6; color: #334155;">
      On behalf of all the rescued animals at PetCare Shelter, we express our heartfelt gratitude for your contribution.
    </p>

    <div class="info-card">
      <div class="info-row">
        <span class="info-label">Reference Number</span>
        <span class="info-val" style="font-family: monospace; font-size: 15px;">${receiptNo}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Donor Name</span>
        <span class="info-val">${donorName}</span>
      </div>
      <div class="info-row">
        <span class="info-label">${isMoney ? "Amount Contributed" : "Item & Quantity"}</span>
        <span class="info-val" style="color: #ea580c; font-size: 16px;">${formattedAmount}</span>
      </div>
      ${description ? `
      <div class="info-row">
        <span class="info-label">Notes</span>
        <span class="info-val">${description}</span>
      </div>` : ""}
    </div>
  `;

  const html = renderEmailLayout({ title: subject, preheader: `Donation acknowledgment #${receiptNo} for ${donorName}`, bodyContent });
  return sendEmail({ to: donorEmail, subject, html, text: `Thank you ${donorName}! Your contribution of ${formattedAmount} is recorded.` });
};
