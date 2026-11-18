package com.Booking.booking_service.service;

import com.Booking.booking_service.entity.Booking;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Value("${app.name:StayEase}")
    private String appName;

    // ─────────────────────────────────────────────────────────────────
    //  PUBLIC METHODS — called from BookingService
    // ─────────────────────────────────────────────────────────────────

    /** Sent to tenant right after they submit a request */
    @Async
    public void sendBookingRequestedEmail(Booking booking, String tenantEmail, String tenantFirstName) {
        String subject = "📋 Booking Request Received — " + booking.getPropertyName();
        String body = bookingRequestedTemplate(tenantFirstName, booking);
        sendHtmlEmail(tenantEmail, subject, body);
    }

    /** Sent to tenant when owner approves */
    @Async
    public void sendBookingApprovedEmail(Booking booking, String tenantEmail, String tenantFirstName) {
        String subject = "✅ Booking Approved! — " + booking.getPropertyName();
        String body = bookingApprovedTemplate(tenantFirstName, booking);
        sendHtmlEmail(tenantEmail, subject, body);
    }

    /** Sent to tenant when owner rejects */
    @Async
    public void sendBookingRejectedEmail(Booking booking, String tenantEmail, String tenantFirstName) {
        String subject = "❌ Booking Request Update — " + booking.getPropertyName();
        String body = bookingRejectedTemplate(tenantFirstName, booking);
        sendHtmlEmail(tenantEmail, subject, body);
    }

    /** Sent to tenant when they cancel their own request */
    @Async
    public void sendBookingCancelledEmail(Booking booking, String tenantEmail, String tenantFirstName) {
        String subject = "🚫 Booking Cancelled — " + booking.getPropertyName();
        String body = bookingCancelledTemplate(tenantFirstName, booking);
        sendHtmlEmail(tenantEmail, subject, body);
    }

    /** Sent to owner when a new booking request arrives on their property */
    @Async
    public void sendNewRequestToOwnerEmail(Booking booking, String ownerEmail, String ownerFirstName) {
        String subject = "🔔 New Booking Request — " + booking.getPropertyName();
        String body = newRequestOwnerTemplate(ownerFirstName, booking);
        sendHtmlEmail(ownerEmail, subject, body);
    }

    // ─────────────────────────────────────────────────────────────────
    //  CORE SEND METHOD
    // ─────────────────────────────────────────────────────────────────

    private void sendHtmlEmail(String toEmail, String subject, String htmlBody) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail, appName);
            helper.setTo(toEmail);
            helper.setSubject(subject);
            helper.setText(htmlBody, true); // true = HTML

            mailSender.send(message);
            log.info("Email sent to {} | Subject: {}", toEmail, subject);

        } catch (MessagingException e) {
            // Non-critical — log the error but don't break the booking flow
            log.error("Failed to send email to {} | Error: {}", toEmail, e.getMessage());
        } catch (Exception e) {
            log.error("Unexpected error sending email to {}: {}", toEmail, e.getMessage());
        }
    }

    // ─────────────────────────────────────────────────────────────────
    //  HTML EMAIL TEMPLATES
    // ─────────────────────────────────────────────────────────────────

    private String bookingRequestedTemplate(String name, Booking b) {
        return baseTemplate(
                "#f59e0b", "📋", "Request Submitted!",
                name,
                "Your booking request has been sent to the property owner. " +
                        "You'll receive an email once they review it.",
                propertyInfoBlock(b) +
                        infoRow("Check-In",  b.getCheckInDate())  +
                        infoRow("Check-Out", b.getCheckOutDate()) +
                        infoRow("Rooms",     b.getNumberOfRooms() != null ? String.valueOf(b.getNumberOfRooms()) : "—") +
                        infoRow("Guests",    b.getNumberOfGuests() != null ? String.valueOf(b.getNumberOfGuests()) : "—") +
                        infoRow("Total Rent", b.getTotalPrice() != null ? "₹" + formatAmount(b.getTotalPrice()) : "—"),
                "We'll notify you as soon as the owner responds."
        );
    }

    private String bookingApprovedTemplate(String name, Booking b) {
        return baseTemplate(
                "#16a34a", "✅", "Booking Approved!",
                name,
                "Great news! The owner has approved your booking request. " +
                        "You can now contact the owner to arrange your move-in.",
                propertyInfoBlock(b) +
                        infoRow("Check-In",     b.getCheckInDate()) +
                        infoRow("Check-Out",    b.getCheckOutDate()) +
                        infoRow("Owner",        b.getOwnerName()) +
                        infoRow("Total Rent",   b.getTotalPrice() != null ? "₹" + formatAmount(b.getTotalPrice()) : "—") +
                        infoRow("Approved On",  b.getApprovalDate() != null ? b.getApprovalDate().toLocalDate().toString() : "—"),
                "Use the <strong>Contact</strong> button in your bookings dashboard to get the owner's details."
        );
    }

    private String bookingRejectedTemplate(String name, Booking b) {
        return baseTemplate(
                "#dc2626", "❌", "Request Not Approved",
                name,
                "Unfortunately, the owner was unable to approve your booking request for <strong>" +
                        b.getPropertyName() + "</strong> at this time.",
                propertyInfoBlock(b) +
                        infoRow("Check-In",  b.getCheckInDate()) +
                        infoRow("Check-Out", b.getCheckOutDate()),
                "Don't worry — browse other available properties on StayEase and find your perfect stay!"
        );
    }

    private String bookingCancelledTemplate(String name, Booking b) {
        return baseTemplate(
                "#6b7280", "🚫", "Booking Cancelled",
                name,
                "Your booking request for <strong>" + b.getPropertyName() + "</strong> has been cancelled as requested.",
                propertyInfoBlock(b),
                "You can submit a new booking request anytime from your dashboard."
        );
    }

    private String newRequestOwnerTemplate(String name, Booking b) {
        return baseTemplate(
                "#e53e3e", "🔔", "New Booking Request",
                name,
                "You have received a new booking request for your property. " +
                        "Log in to your dashboard to approve or reject it.",
                infoRow("Property",   b.getPropertyName()) +
                        infoRow("Tenant",     maskUsername(b.getTenantUsername())) +
                        infoRow("Check-In",   b.getCheckInDate()) +
                        infoRow("Check-Out",  b.getCheckOutDate()) +
                        infoRow("Rooms",      b.getNumberOfRooms() != null ? String.valueOf(b.getNumberOfRooms()) : "—") +
                        infoRow("Guests",     b.getNumberOfGuests() != null ? String.valueOf(b.getNumberOfGuests()) : "—") +
                        infoRow("Total Rent", b.getTotalPrice() != null ? "₹" + formatAmount(b.getTotalPrice()) : "—"),
                "Please respond within 48 hours to give tenants a timely update."
        );
    }

    // ─────────────────────────────────────────────────────────────────
    //  BASE TEMPLATE + HELPERS
    // ─────────────────────────────────────────────────────────────────

    private String baseTemplate(String accentColor, String icon, String title,
                                String recipientName, String intro,
                                String details, String footer) {
        return """
            <!DOCTYPE html>
            <html lang="en">
            <head>
              <meta charset="UTF-8"/>
              <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
            </head>
            <body style="margin:0;padding:0;background:#f0f2f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
              <table width="100%%" cellpadding="0" cellspacing="0" style="background:#f0f2f5;padding:32px 16px;">
                <tr><td align="center">
                  <table width="100%%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
                    
                    <!-- Header -->
                    <tr><td style="background:%s;padding:28px 32px;text-align:center;">
                      <div style="font-size:36px;margin-bottom:8px;">%s</div>
                      <h1 style="color:#ffffff;margin:0;font-size:22px;font-weight:700;letter-spacing:-0.3px;">%s</h1>
                      <p style="color:rgba(255,255,255,0.85);margin:6px 0 0;font-size:13px;">StayEase · Accommodation Platform</p>
                    </td></tr>
                    
                    <!-- Body -->
                    <tr><td style="padding:28px 32px;">
                      <p style="color:#374151;font-size:15px;margin:0 0 6px;">Hi <strong>%s</strong>,</p>
                      <p style="color:#6b7280;font-size:14px;line-height:1.7;margin:0 0 20px;">%s</p>
                      
                      <!-- Details card -->
                      <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:10px;padding:16px;margin-bottom:20px;">
                        %s
                      </div>
                      
                      <p style="color:#6b7280;font-size:13px;line-height:1.7;margin:0;padding:14px 16px;background:#fff7ed;border-left:3px solid %s;border-radius:0 8px 8px 0;">
                        %s
                      </p>
                    </td></tr>
                    
                    <!-- Footer -->
                    <tr><td style="background:#f9fafb;padding:16px 32px;text-align:center;border-top:1px solid #f0f0f0;">
                      <p style="color:#9ca3af;font-size:12px;margin:0;">
                        © 2026 StayEase · You're receiving this because you have an account on StayEase.
                      </p>
                    </td></tr>
                    
                  </table>
                </td></tr>
              </table>
            </body>
            </html>
            """.formatted(accentColor, icon, title, recipientName, intro, details, accentColor, footer);
    }

    private String propertyInfoBlock(Booking b) {
        return """
            <div style="margin-bottom:8px;">
              <span style="font-size:11px;color:#9ca3af;text-transform:uppercase;letter-spacing:0.06em;font-weight:600;">Property</span>
              <p style="color:#111827;font-size:14px;font-weight:700;margin:2px 0 0;">%s</p>
              %s
            </div>
            """.formatted(
                b.getPropertyName(),
                (b.getPropertyCity() != null)
                        ? "<p style=\"color:#6b7280;font-size:13px;margin:2px 0 0;\">" + b.getPropertyCity() + (b.getPropertyState() != null ? ", " + b.getPropertyState() : "") + "</p>"
                        : ""
        );
    }

    private String infoRow(String label, String value) {
        if (value == null || value.isBlank()) return "";
        return """
            <div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid #f0f0f0;">
              <span style="color:#9ca3af;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;">%s</span>
              <span style="color:#111827;font-size:13px;font-weight:500;">%s</span>
            </div>
            """.formatted(label, value);
    }

    private String formatAmount(Double amount) {
        return String.format("%,.0f", amount);
    }

    private String maskUsername(String username) {
        if (username == null || username.length() <= 3) return username;
        return username.substring(0, 3) + "****";
    }
}
