import nodemailer from 'nodemailer';

// Configure transporter
// For development, we can use Ethereal or just log to console if no env vars
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.ethereal.email',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER || 'ethereal_user',
        pass: process.env.SMTP_PASS || 'ethereal_pass',
    },
});

export async function sendEmail({ to, subject, html }: { to: string; subject: string; html: string }) {
    if (!process.env.SMTP_HOST) {
        console.log(`[Mock Email] To: ${to}, Subject: ${subject}`);
        console.log(html);
        return;
    }

    try {
        const info = await transporter.sendMail({
            from: process.env.SMTP_FROM || '"Diafat Khulud" <no-reply@diafat-khulud.com>',
            to,
            subject,
            html,
        });
        console.log('Message sent: %s', info.messageId);
    } catch (error) {
        console.error('Error sending email:', error);
    }
}

export async function sendBookingConfirmation(email: string, bookingDetails: any) {
    const html = `
      <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h1 style="color: #047857; text-align: center;">تم تأكيد حجزك بنجاح!</h1>
        <p>عزيزي ${bookingDetails.guestName}،</p>
        <p>شكراً لاختيارك ضيافة خلود. يسعدنا تأكيد حجزك لدينا.</p>
        
        <div style="background-color: #f9fafb; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">تفاصيل الحجز:</h3>
          <p><strong>رقم الحجز:</strong> ${bookingDetails.id}</p>
          <p><strong>الفندق:</strong> ${bookingDetails.hotelName}</p>
          <p><strong>الغرفة:</strong> ${bookingDetails.roomType}</p>
          <p><strong>الوصول:</strong> ${new Date(bookingDetails.checkIn).toLocaleDateString('ar-EG')}</p>
          <p><strong>المغادرة:</strong> ${new Date(bookingDetails.checkOut).toLocaleDateString('ar-EG')}</p>
          <p><strong>الإجمالي:</strong> ${bookingDetails.totalPrice} ر.س</p>
        </div>

        <p>نحن بانتظار تشريفكم لنا.</p>
        <p>مع تحيات،<br>فريق ضيافة خلود</p>
      </div>
    `;

    await sendEmail({
        to: email,
        subject: 'تأكيد الحجز - ضيافة خلود',
        html
    });
}
