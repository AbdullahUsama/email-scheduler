
import nodemailer from 'nodemailer'
import cron from 'node-cron'

const mailOptions = {
    from:'ausama.bese22seecs@seecs.edu.pk',
    to:'demo.abdullah.dev@gmail.com',
    subject:'Test Email',
    text:'Hello World'
};

const transporter = nodemailer.createTransport({
    service:'gmail',
    auth:{ 
        user:'ausama.bese22seecs@seecs.edu.pk',
        pass:'Kushim@03000',
    }
});


cron.schedule('* * * * * *', () => {
    transporter.sendMail(mailOptions, (error, info) => {
        if(error){
            console.log(error);
        }else{
            console.log('Email sent: ' + info.response);
        }
    } );
  });

