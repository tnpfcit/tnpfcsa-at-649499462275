module.exports = {
    key:"5M51M4KG6KG3BN4PBWNAD9BCTLDMK29H",
    iv:"5M51M4KG6KG3BN4P",
    //appkey:"QENSEGY3FOF7FTRLQENSEGY3FOF7FTRL",
    //appiv:"QENSEGY3FOF7FTRL",
	appkey:"SBN59A2O0WBZLULJSBN59A2O0WBZLULJ",
    appiv:"SBN59A2O0WBZLULJ",
    androidmerchantId:"M00035",
	appmerchantId:"M00035",
    merchantId:"M00034",
	iosmerchantId:"M00093",
	iosappkey:"rC2sB0pl2UY4Zb0TR0cC6EH7Um5QF6ek",
	iosappiv:"rC2sB0pl2UY4Zb0T",
    hdfctestReturnUrl : "https://test-node-api.tnpowerfinance.com/tnpfc/v1/processPGResponse", 
    hdfcprodReturnUrl : "https://portal-api.tnpowerfinance.com/tnpfc/v1/processPGResponse",
    newurl :"https://www.tnpowerfinance.com/tnpfc-web/paymentpage?transactionId=", 
    existurl :"https://www.tnpowerfinance.com/tnpfc-db/paymentpage?transactionId=",
    BeneficiaryBank :"HDFC",
    IFSCCode: "HDFC0000082",
    NameofBeneficiaryAccount:"TAMILNADU POWER FIN AND INF DEV COR LTD",
    PaymentReference:"New FD",
    secretValue   :"FINCURO_API_TNPFC",  // this secret key is used for token generation 
    username      :'Pallavim@amiainfotech.com', 
    //hash          :'8537c38575a09969ff49dee3cabfe46dcc070db98b86bae94f9996e138b096b5',
	hash          :'968e4acc0bc24f5308b1f5e0d2d05a1511cee5a2d03f26ec70dc90b930b53673', /* The hash key could be found under Help->All Documentation->Your hash key.*/
    sender        :'TNPFCL',
    responseMessage:"Bad request check request payload/parameters", // 400 bad request message
    //message:"Looks like you have a deposit with us. Please use Depositor Login.", // document verify message
	message:"Looks like You are a registered user, Please login to the portal to avail Online Services",
    activeDetailsPan:"PAN is Active and the details are matching with PAN database.",
    activeDetailsMissedPan:"PAN is Active but the details are not matching with PAN database.",
    panMessage:"Video based Customer Identification Process will be initiated by TNPF.",
    sucessCode:"200",
    resourceNotFoundcode:"404",
    badRequestcode:"400",
    validAadhaar:"Aadhaar number verified successfully.",
    invalidAadhaar:"Please enter a valid Aadhaar number.",
    invalidPan:"Please enter a valid Pan number.",
    validPan:"Pan number verified successfully.",
    technicalError:"Technical error. Please try again.",
    videoIdentification:"Video based Customer Identification Process will be initiated by TNPF.",
    panUrl:"http://test-pan-bot-elb-1259185693.ap-south-1.elb.amazonaws.com/verifyPAN?pan=",
    aadhaarurl:"http://test-aadhar-bot-elb-1308754516.ap-south-1.elb.amazonaws.com/verifyAADHAR?aadhar=",
    qrUrl:"https://test-node-api.tnpowerfinance.com/tnpfc/v1/getQRData?fdId=",
	NoRecords:"No Records Found"
}
       