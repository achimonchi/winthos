const fs = require('fs');
const path = require('path');
const excel = require("read-excel-file/node");
const PDFDocument = require('pdfkit');
const csv = require("csv-parser");

// ini nama directory / folder untuk sertifikat
// IPC-Cert diganti
const directory = path.join(__dirname,'IPC-Cert');


fs.readdir(directory, (err, files)=>{
    const data = splitFiles(files);
    data.map((d)=>{
        if(fs.existsSync(`Sharing Session`)){

        } else {
            fs.mkdirSync(`./Sharing Session`);
        }

        if(fs.existsSync(`Sharing Session/${d.session}`)){
            console.log("Sudah Ada");
        } else {
            fs.mkdirSync(`./Sharing Session/${d.session}`);
            console.log(`Try to creating ${d.session}`)
        }

        // IPC adalah folder CSV
        fs.createReadStream(`./IPC/${d.xlsx}`)
            .pipe(csv())
            .on('data', (row)=>{
                const dataPDF = {
                    name : row["NAMA LENGKAP"],
                    email : row["Nama pengguna"],
                    path : `${d.session}/${row["NAMA LENGKAP"]+"-"+row["Nama pengguna"]}.pdf`,
                    filename : row["NAMA LENGKAP"]+"-"+row["Nama pengguna"]+".pdf"
                }

                try{
                    if(dataPDF.name !== null && dataPDF.name !== undefined){
                        const doc = new PDFDocument({
                            layout:'landscape',
                            size:[960,1152],
                            margin:0
                        });
                        
                        // IPC-Cert folder sertifikat
                        doc.image(`IPC-Cert/${d.cert}`,{
                            width:1152,
                            height:960
                        });
                        
                        doc.pipe(fs.createWriteStream(`Sharing Session/${d.session}/${dataPDF.name+"-"+dataPDF.email}.pdf`));
                        
                        doc.fontSize(36)
                            .fillColor("#000000")
                            .font('fonts/OpenSans-Bold.ttf') // 400, adalah ukuran jarak nama ke atas
                            .text(`${dataPDF.name.toUpperCase()}`,0,400,{
                                width:1152,
                                align:'center'
                            });
            
                        doc.end();
                    } else {
                        console.log(dataPDF)
                    }
                } catch(err){
                    console.log(err);
                }
            })
            .on('end',()=>{
                console.log(`Success ${d.xlsx}`)
            })
    })
})

function splitFiles(files){
    let arr = [];
    files.map((f)=>{
        const fileName = f.split(".")[0];
        const data = {
            fileName,
            xlsx : fileName.toUpperCase()+".csv",
            cert : fileName+".png",
            session : `${fileName}`

        }
        arr.push(data);
    })

    return arr;
}
