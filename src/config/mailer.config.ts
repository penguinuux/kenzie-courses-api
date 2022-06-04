import nodemailer from "nodemailer";

const transport = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "4b795887c3e0b3",
    pass: "fb9e7fb27fd29f",
  },
});

export default transport;
