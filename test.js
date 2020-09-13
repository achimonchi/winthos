const fs = require('fs');
const path = require('path');
const excel = require("read-excel-file/node");
const PDFDocument = require('pdfkit');
const csv = require("csv-parser");

const directory = path.join(__dirname,'certificate');


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

        fs.createReadStream(`./WINTHOSE-2020/${d.xlsx}`)
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
        
                        doc.image(`certificate/${d.cert}`,{
                            width:1152,
                            height:960
                        });
                        
                        doc.pipe(fs.createWriteStream(`Sharing Session/${d.session}/${dataPDF.name+"-"+dataPDF.email}.pdf`));
                        
                        doc.fontSize(36)
                            .fillColor("#333")
                            .font('fonts/OpenSans-Bold.ttf')
                            .text(`${dataPDF.name.toUpperCase()}`,0,350,{
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
    
        // excel(`./WINTHOSE-2020/${d.xlsx}`).then(async(rows)=>{
            // console.log(rows)
            // await rows.map(async(r,i)=>{
                // console.log(r)
                // if(i!=0){
                //     const dataPDF = {
                //         name : r[2],
                //         email : r[1],
                //         path : `${d.session}/${r[2]+"-"+r[1]}.pdf`,
                //         filename : r[2]+"-"+r[1]+".pdf"
                //     }

                //     try{
                //         if(dataPDF.name !== null){
                //             const doc = new PDFDocument({
                //                 layout:'landscape',
                //                 size:[960,1152],
                //                 margin:0
                //             });
            
                //             doc.image(`certificate/${d.cert}`,{
                //                 width:1152,
                //                 height:960
                //             });
                            
                //             doc.pipe(fs.createWriteStream(`${d.session}/${dataPDF.name+"-"+dataPDF.email}.pdf`));

                //             doc.fontSize(36)
                //                 .fillColor("#333")
                //                 .font('fonts/OpenSans-Bold.ttf')
                //                 .text(`${dataPDF.name.toUpperCase()}`,0,350,{
                //                     width:1152,
                //                     align:'center'
                //                 });
                
                //             doc.end();
                //         }
                //     }catch(err){
                //         console.log(`Error`)
                //     }
                //     // console.log(r)
                // }
            // })
        // }).catch(err=>{
        //     console.log(err)
        // })
    })
})

function splitFiles(files){
    let arr = [];
    files.map((f)=>{
        const fileName = f.split(".")[0];
        const data = {
            fileName,
            xlsx : fileName.split("-")[1].toUpperCase()+".csv",
            cert : fileName+".jpg",
            session : `${fileName}`

        }
        arr.push(data);
    })

    return arr;
}
