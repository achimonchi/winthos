const PDFDocument = require('pdfkit');
const nodemailer = require('nodemailer');
const fs = require("fs");
const excel = require("read-excel-file/node");
const {email, seminar} = require('./config.js')

// baca file excel
try{
    if(fs.existsSync(seminar.session)){
        console.log("Sudah Ada")
        
    } else {
        fs.mkdirSync(`./${seminar.session}`)
        // fs.mkdirSync(seminar.session)
    }

    excel(`./listPeserta/${seminar.xlsx}`).then(async(rows)=>{
        await rows.map(async (r,i)=>{
            if(i!=0){
                const data = {
                    name : r[2],
                    email : r[1],
                    path : `${seminar.session}/${r[2]+"-"+r[1]}.pdf`,
                    filename : r[2]+"-"+r[1]+".pdf"
                }
                const doc = new PDFDocument({
                    layout:'landscape',
                    size:[960,1152],
                    margin:0
                });

                doc.image(`certificate/${seminar.cert}`,{
                    width:1152,
                    height:960
                });
                
                doc.pipe(fs.createWriteStream(`${seminar.session}/${data.name+"-"+data.email}.pdf`));
                
                doc.fontSize(36)
                    .font('fonts/OpenSans-Bold.ttf')
                    .text(`${data.name}`,0,350,{
                        width:1152,
                        align:'center'
                    });
    
                doc.end();
                
                // await sendMail(data)
            }
        })
    })
    
} catch(err){
    console.log(err)
}

// setup transporter
const transporter = nodemailer.createTransport({
    service : 'gmail',
    secure:false,
    port : 587,
    auth:{
        user : email.user,
        pass : email.password
    },
    tls : {
        rejectUnauthorized : false
    }
});

// function sendMail
const sendMail=async(data)=>{
    return new Promise((resolve, reject)=>{
        // configuration pada mail
        const mailOptions = {
            from : '"Support Winthose" <no-reply@winthose.org>',
            to : `${data.email}`,
            subject : `Thanks For Join in ${seminar.name}`,
            text : '',
            html : `PDF Certificate For <b>Winthose</b>`,
            attachments: [
                {
                    filename:data.filename,
                    path:data.path,
                    contentType:"application/pdf"
                }
            ]
        };

        console.log(`Prepare send to ${data.email} `)

        // // kirim email
        transporter.sendMail(mailOptions,(err,info)=>{
            if(err) reject(err);
            resolve(true);
            console.log(`Email sent to :  ${data.email}`)
        })
    })
}
