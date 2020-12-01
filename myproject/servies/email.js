export const userEmail = app.post('/send', (name,email, res) => {
    const output = `
      <p>You have a new contact request</p>
      <h3>Contact Details</h3>
      <ul>  
        <li>Name: ${name}</li>
        <li>Email: ${email}</li>

      </ul>
      <h3>Message</h3>
      <p>check your email</p>
    `;
  
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      host: 'mail.https://www.000webhost.com/members/website/list',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
          user: 'syedashab80@gmail.com', // generated ethereal user
          pass: 'ashab'  // generated ethereal password
      },
      tls:{
        rejectUnauthorized:false
      }
    });
  
    // setup email data with unicode symbols
    let mailOptions = {
        from: '"Nodemailer Contact" <syedashab80@gmail.com>', // sender address
        to: 'ashab.mavia@ivolve.io', // list of receivers
        subject: 'Node Contact Request', // Subject line
        text: 'Hello world?', // plain text body
        html: output // html body
    };
  
    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);   
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  
        res.render('contact', {msg:'Email has been sent'});
    });
    });
  
 