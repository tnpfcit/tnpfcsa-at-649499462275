var fs = require('fs');
var moment = require('moment');
var PdfPrinter = require('pdfmake');
const { v4: uuidv4 } = require('uuid');
var request = require('request');
var config = require('../config/config.json');
const path = require('path');
var AWS = require('aws-sdk');
var http = require('https');
var url = require('url');

exports.generatePaySlipPdf = (data, callback) => {
    var appDir = path.join(__dirname, "../");
    fontPath = path.join(appDir, "public", "fonts");
    logoPath = path.join(appDir, "public", "logo");
    var logoName = config.logoName; 
    var quattrocentoSansRegular = config.quattrocentoSansRegular;
    var quattrocentoSansBold = config.quattrocentoSansBold;
    var logo = path.join(logoPath,logoName);
    var fontRegular = path.join(fontPath,quattrocentoSansRegular)
    var fontBold = path.join(fontPath,quattrocentoSansBold)
    console.log(path.join(logoPath,logoName));
    console.log(path.join(fontPath,quattrocentoSansRegular));

    var fonts = {
        QuattrocentoSans: {
            normal: fontRegular,
            bold: fontBold
        },
        Symbol: {
            normal: 'Symbol'
        },
        ZapfDingbats: {
            normal: 'ZapfDingbats'
        }
    };


    var printer = new PdfPrinter(fonts);

    var docDefinition = {
        content: [
            {
                image: logo,
                width: 135
            },
            {
                style: 'tableExample',
                table: {
                    body: [
                        [{ text: 'Tamil Nadu Power Finance and Infrastructure', fontSize: 14, bold: true }],
                        [{ text: 'Development Corporation Limited', fontSize: 14, bold: true }],
                        [{ text: '(A Government of Tamil Nadu Undertaking)', fontSize: 11, bold: false }],
                        [{ text: '', fontSize: 11, bold: false }],
                        [{ text: '', fontSize: 11, bold: false }],
                        [{ text: 'No.490/3-4, Anna Salai, Nandanam, Chennai – 600 035', fontSize: 11, bold: false }],
                        [{ text: 'Phone : 044-46312345', fontSize: 11, bold: false }],
                        [{ text: 'E-mail: power@tnpowerfinance.com', fontSize: 11, bold: false }],
                        [{ text: 'Website: https://tnpowerfinance.com', fontSize: 11, bold: false }],
                    ]
                },
                layout: 'noBorders',
                absolutePosition: { x: 200, y: 50 }
            },
            {
                text: "PAYMENT ADVICE FOR NEW FIXED DEPOSIT",
                fontSize: 13,
                bold: true,
                decoration: 'underline',
                alignment: 'center',
                absolutePosition: { y: 200 }
            },
            {
                text: moment().format("YYYY-MM-DD HH:mm:ss"),
                fontSize: 11,
                absolutePosition: { x: 40, y: 220 }
            },
            {
                text: "Dear " + data.depositorName + ",",
                fontSize: 11,
                absolutePosition: { x: 40, y: 240 }
            },
            {
                text: "Thank you for your interest in opening a Fixed Deposit with TNPFC.",
                fontSize: 11,
                absolutePosition: { x: 40, y: 260 }
            },
            {
                style: 'tableExample',
                color: '#444',
                table: {
                    widths: ['*', '*', '*', '*', '*'],
                    headerRows: 1,
                    // keepWithHeaderRows: 1,
                    body: [
                        [{ text: 'Deposit Amount', style: 'tableHeader', alignment: 'center', bold: true }, { text: 'Product', style: 'tableHeader', alignment: 'center', bold: true }, { text: 'Duration', style: 'tableHeader', alignment: 'center', bold: true }, { text: 'Interest Rate', style: 'tableHeader', alignment: 'center', bold: true }, { text: 'Interest Frequency', style: 'tableHeader', alignment: 'center', bold: true }],
                        ['Rs. '+data.depositAmount, data.schemeType, data.duration + ' months', data.interestRate+'%', data.interestfrequency],
                        [{ text: 'Maturity Amount', bold: true }, { colSpan: 4, rowSpan: 1, text: 'Rs. '+data.maturityAmount }],
                    ]
                },
                absolutePosition: { x: 40, y: 280 }
            },
            {
                text: "Kindly initiate RTGS/NEFT/IMPS remittance from your bank to the unique virtual account number created\nfor your request to open and activate your Fixed Deposit Account in Tamil Nadu Power Finance and\nInfrastructure Development Corporation (TNPFCL).",
                fontSize: 11,
                absolutePosition: { x: 40, y: 375 }
            },
            {
                text: "Remittance Details",
                bold: true,
                absolutePosition: { x: 40, y: 430 }
            },
            {
                style: 'tableExample',
                widths: ['200', '200'],
                table: {
                    body: [
                        [{ text: 'Beneficiary Account Number', fontSize: 11 }, { text: data.beneficiaryAccountNumber, fontSize: 11 }],
                        [{ text: 'Amount to be remitted', fontSize: 11 }, { text:'Rs. '+data.amountToBeRemitted, fontSize: 11 }],
                        [{ text: 'Amount in Words', fontSize: 11 }, { text: data.amountinWords, fontSize: 11 }],
                        [{ text: 'Beneficiary Bank', fontSize: 11 }, { text: data.beneficiaryBank, fontSize: 11 }],
                        [{ text: 'IFSC Code', fontSize: 11 }, { text: data.ifscCode, fontSize: 11 }],
                        [{ text: 'Name of Beneficiary Account', fontSize: 11 }, { text: data.nameofBeneficiaryAccount, fontSize: 11 }],
                        [{ text: 'Payment Reference / Narration', fontSize: 11 }, { text: data.paymentReference, fontSize: 11 }],
                    ]
                },
                layout: 'noBorders',
                absolutePosition: { x: 40, y: 450 }
            },
            {
                text: "Payment Advice Terms and Conditions",
                bold: true,
                absolutePosition: { x: 40, y: 580 }
            },
            {
                ol: [
                    'Deposit value would be for actual payment received',
                    'Payment Realization date would be considered the date of deposit',
                    'Only single payment to be made per payment advice',
                    'Payment advice is valid for two business days',
                    'Electronic fixed deposit receipt confirmation would be notified through SMS and Depositors may also login to the web portal or mobile application to download electronic fixed deposit receipt',
                    'For detailed Terms and Conditions of Non-Cumulative and Cumulative Products, visit https://tnpowerfinance.com.',
                ],
                absolutePosition: { x: 40, y: 600 }
            },
        ],
        defaultStyle: {
            font: 'QuattrocentoSans'
        }
    };

    var pdfDoc = printer.createPdfKitDocument(docDefinition);
	//********
	
	//********
    // Uplod to DMS
    docDir = path.join(appDir, "public", "doc");

    var fileName = uuidv4();
    var filePath = path.join(docDir, fileName + '.pdf');
    filePath = filePath.replace("\","/"")
    pdfDoc.pipe(fs.createWriteStream(filePath).on('finish', function() {
		request.post(
        config.dbsUrl,
        { json: { customerId: data.customerId, docType: config.docType, fileName: filePath}},
        function (error, response, body) {
            if (!error && response.statusCode == 200) {
                // upload data				
				request.put({
                    url: body.docLink,
                    formData: {
                        file: fs.createReadStream(filePath)
                    }
                }, function (error, response, body) {
                    if (!error && response.statusCode == 200) {
                        // remove file.
                       // fs.unlink(filePath, (err) => {
                        //    if (err) throw err;
                        //});
                    }
					if(error){
						console.log("error");
					}					
                });
				                
                callback(body.signedURL)
            }
        }
    );
	}));
	
    pdfDoc.end();
	console.log("filePath");
    console.log(filePath);
    
}