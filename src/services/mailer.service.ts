import { ErrorHandler } from "../errors/errors";
import transport from "../config/mailer.config";
import { Course, User } from "../entities";
import path from "path";
import handlebars, {
  NodemailerExpressHandlebarsOptions,
} from "nodemailer-express-handlebars";

class MailerService {
  enrollmentEmail = (user: User, course: Course) => {
    const handlebarOptions: NodemailerExpressHandlebarsOptions = {
      viewEngine: {
        partialsDir: path.resolve("./src/views/"),
        defaultLayout: false,
      },
      viewPath: path.resolve("./src/views/"),
    };

    transport.use("compile", handlebars(handlebarOptions));

    const mailOption = {
      from: "coursekenzie@mail.com",
      to: user.email,
      subject: "New course enrollment",
      template: "emailCourseEnrollment",
      context: {
        firstName: user.firstName,
        courseName: course.courseName,
        courseDuration: course.duration,
      },
    };

    transport.sendMail(mailOption, (err) => {
      if (err) {
        throw new ErrorHandler(424, "Email could not be sent.");
      }
    });
  };
}

export default new MailerService();
