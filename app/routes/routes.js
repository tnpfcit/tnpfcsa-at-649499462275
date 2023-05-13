module.exports = function(app){

    require('./customerDetails.js')(app);
    require('./customerNominee.js')(app);
    require('./fdDetails.js')(app);
    require('./fdLoans.js')(app);
    require('./fdSummary.js')(app);
	require('./productDetails.js')(app);
	require('./customerCreation.js')(app);
	require('./customerCreation.js')(app);
    require('./customerAddress.js')(app);
	require('./lookupMasters.js')(app);
    require('./getageList.js')(app);
	require('./depositCreation.js')(app);
	require('./otpLogin.js')(app);
    require('./otpverify.js')(app);
	require('./bankDetails.js')(app);
	require('./depositbankCreation.js')(app);
	require('./depositClosure.js')(app);
	require('./depositRenewFd.js')(app);
    require('./loanAgainstDeposit.js')(app);
    require('./requestStatus.js')(app);
	require('./paymentGateway.js')(app);
	require('./hdfcPaymentResponse.js')(app);
	require('./dmsImageUpload.js')(app);
	require('./paymentSucess.js')(app);
	require('./documentVerification.js')(app);
	require('./newCustomer.js')(app);
	require('./healthCheckup.js')(app);
	require('./serviceRequest.js')(app);
	require('./firstCustomer.js')(app);
	require('./phoneVerification.js')(app);
	require('./phoneVerify.js')(app);
	require('./inrPaymentService.js')(app);
	require('./inrPaymentResponse.js')(app);
	require('./authRoutes.js')(app);    
    require('./menuRoutes.js')(app);
    require('./transactionRoutes.js')(app);
	require('./userRoutes.js')(app);
	require('./approved.js')(app);
	require('./customerSearch.js')(app);
	require('./transactionApproval.js')(app);
	require('./qrcodeScanning.js')(app);
	require('./qrcodeScanningResponse.js')(app);
	require('./serviceAuthenticationOtp.js')(app);
	require('./appUpdation.js')(app);
	require('./onePayTransactionStatus.js')(app);
	require('./payStatisticsSummary.js')(app);
	require('./paymentRejectionStatistics.js')(app);
	require('./currentBankDetails.js')(app);
	require('./logout.js')(app);
	require('./nonIndividualCustomer.js')(app);
	require('./fdInterest.js')(app);
	require('./panDocumentVerify.js')(app);
	require('./depositLoanSummary.js')(app);
	require('./websiteStastics.js')(app);
	require('./checkStatus.js')(app);
	require('./depositInterestDetails.js')(app);
	require('./onlineTransactionStatus.js')(app);
	require('./feedBack.js')(app);
	require('./financialYear.js')(app);
	require('./currentNomineeDetails.js')(app);
	require('./authSignatoryDetails.js')(app);
	require('./depositListing.js')(app);
	require('./customerProfile.js')(app);
	require('./powerbiMenu.js')(app);
	require('./form16A.js')(app);
	require('./customerSearchNew.js')(app);	
	require('./customerFdDetails.js')(app);	
	require('./customerFdSummary.js')(app);	
	require('./customerInterestDetails.js')(app);
	require('./customerFyIntDetails.js')(app);	
}