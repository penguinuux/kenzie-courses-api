import { ErrorHandler } from "../errors/errors";
import transport from "../config/mailer.config";

class MailerService {
  enrollmentEmail = ({ firstName, email }) => {
    const mailOption = {
      from: "coursekenzie@mail.com",
      to: email,
      subject: "New course enrollment",
      text: `${firstName}, you subscribed to a new course.`,
    };

    transport.sendMail(mailOption, (err) => {
      if (err) {
        throw new ErrorHandler(424, "Email could not be sent.");
      }
    });
  };
}

export default new MailerService();
