import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const sendVerificationEmail = async (user, token) => {
  const verificationUrl = `https://gastro-reservation-system-production.up.railway.app/api/users/verify-email?token=${token}`;
  const msg = {
    to: user.email,
    from: "heiner@kru360.com",
    subject: "Verify Your Email",
    html: `<h3>Hola ${user.email}!</h3>
    <p>Please verify your email by clicking on the following link:</p>
    <form action="${verificationUrl}" method="POST">
        <input type="hidden" name="token" value="${token}">
        <button type="submit">Verify email</button>
    </form>`,
  };

  try {
    await sgMail.send(msg);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
  }
};
