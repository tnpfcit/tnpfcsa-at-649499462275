var config = require('../config/config.json');
const db = require('../config/db.js');
const sequelize = require('sequelize');
const enums = require('../helpers/enums');



exports.getTransactions = (req, res) => {
    var {roleId , transactionType, purpose }= req.body;
    if (!roleId) {
        return res.status(400).send({ data: null, message: "RoleId should not be null or empty" });
    }
    if (!transactionType) {
        return res.status(400).send({ data: null, message: "Transaction Type should not be null or empty" });
    }

    // get data from DB.
    var query = "";
    
    if (roleId == enums.RolesEnum.GM && purpose == 'DEP_OPEN') {
        
        query = "select substr(b.act_num,1,13) AS \"accountNo\", a.batch_id AS \"txnId\", a.trans_dt AS \"txnDate\", b.particulars AS \"txnDescription\", a.cmd_approval_req AS \"cmdApprovalReq\",\
        case when nvl(a.gm_auth_status,'P')='P' then 'Pending' when a.gm_auth_status='A' then 'Approved' else 'Rejected' end AS \"txnStatus\", da.status_by AS \"maker\",\
        da.authorized_by AS \"checker\",  b.status_dt AS \"checkerDate\", a.gm_timestamp AS \"gmAuthDate\",  a.cmd_timestamp AS \"cmdAuthDate\", a.remarks AS \"checkerRemarks\",\
        a.gm_remarks AS \"gmRemarks\",  a.cmd_remarks AS \"cmdRemarks\", trans_type AS \"transactionType\",da.deposit_no as \"depositNumber\", getcustname(da.deposit_no) as \"custName\",\
        getProdName(da.prod_id) as \"scheme\", fngetpandetails(da.cust_id) as \"panNumber\", dsa.deposit_dt as \"depositDt\",da.constitution as \"custType\", dsa.maturity_dt as \"maturityDt\",\
        dsa.DEPOSIT_PERIOD_MM || 'Months' as \"period\", dsa.rate_of_int as \"interestRate\",dsa.deposit_amt as \"depositAmt\", dsa.maturity_amt as \"maturityAmt\", dsa.tot_int_amt as \"totalIntAmt\"\
		, CASE WHEN (SELECT COUNT(*) FROM TRANSFER_TRANS C WHERE a.batch_id=C.batch_id AND A.TRANS_DT=C.TRANS_DT AND C.TRANS_TYPE='CREDIT')>1 THEN 'The batch that you are approving/rejecting has multiple transactions ('|| \
		(SELECT COUNT(*) FROM TRANSFER_TRANS C WHERE a.batch_id=C.batch_id AND A.TRANS_DT=C.TRANS_DT AND C.TRANS_TYPE='CREDIT') ||'). Ensure you have verified them before clicking the confirm button.' ELSE NULL END AS \"transAlert\"\
        from approval_master a join transfer_trans b on a.batch_id=b.batch_id and a.trans_dt = b.trans_dt\
        join deposit_acinfo da on a.act_num = da.deposit_no and da.authorize_status = 'APPROVAL_PENDING'\
        join deposit_sub_acinfo dsa on a.act_num = dsa.deposit_no and dsa.authorize_status = 'APPROVAL_PENDING'\
        where a.purpose=:purpose AND A.remarks='DEP_OPEN' and a.gm_approval_req = 'Y' and a.gm_auth_status = 'P' and TRANS_TYPE = 'CREDIT'\
        union all\
        select substr(b.act_num,1,13) AS \"accountNo\", a.batch_id AS \"txnId\", a.trans_dt AS \"txnDate\", b.particulars AS \"txnDescription\", a.cmd_approval_req AS \"cmdApprovalReq\",\
        case when nvl(a.gm_auth_status,'P')='P' then 'Pending' when a.gm_auth_status='A' then 'Approved' else 'Rejected' end AS \"txnStatus\", da.status_by AS \"maker\",\
        da.authorized_by AS \"checker\",  b.status_dt AS \"checkerDate\", a.gm_timestamp AS \"gmAuthDate\",  a.cmd_timestamp AS \"cmdAuthDate\", a.remarks AS \"checkerRemarks\",\
        a.gm_remarks AS \"gmRemarks\",  a.cmd_remarks AS \"cmdRemarks\", trans_type AS \"transactionType\",da.deposit_no as \"depositNumber\", getcustname(da.deposit_no) as \"custName\",\
        getProdName(da.prod_id) as \"scheme\", fngetpandetails(da.cust_id) as \"panNumber\", dsa.deposit_dt as \"depositDt\",da.constitution as \"custType\", dsa.maturity_dt as \"maturityDt\",\
        dsa.DEPOSIT_PERIOD_MM || 'Months' as \"period\", dsa.rate_of_int as \"interestRate\",dsa.deposit_amt as \"depositAmt\", dsa.maturity_amt as \"maturityAmt\", dsa.tot_int_amt as \"totalIntAmt\"\
		,CASE WHEN (SELECT COUNT(*) FROM TRANSFER_TRANS C WHERE a.batch_id=C.batch_id AND A.TRANS_DT=C.TRANS_DT AND C.TRANS_TYPE='CREDIT')>1 THEN 'The batch that you are approving/rejecting has multiple transactions ('|| \
		(SELECT COUNT(*) FROM TRANSFER_TRANS C WHERE a.batch_id=C.batch_id AND A.TRANS_DT=C.TRANS_DT AND C.TRANS_TYPE='CREDIT') ||'). Ensure you have verified them before clicking the confirm button.' ELSE NULL END AS \"transAlert\"\
        from approval_master a join transfer_trans b on a.MULTIPLE_batch_id=b.link_batch_id and a.trans_dt=b.trans_dt and a.status!='DELETED' and b.status!='DELETED' and purpose=:purpose\
        and a.MULTIPLE_batch_id = b.link_batch_id and trans_type ='CREDIT' and remarks='MULTIPLE_OPEN' and b.amount = a.amount\
        join deposit_acinfo da on substr(b.act_num,1,13) = da.deposit_no and da.authorize_status = 'APPROVAL_PENDING' AND A.ACT_NUM=DA.DEPOSIT_NO\
        join deposit_sub_acinfo dsa on da.deposit_no = dsa.deposit_no and dsa.authorize_status = 'APPROVAL_PENDING'\
        where a.purpose=:purpose and a.gm_auth_status = 'P' and a.gm_approval_req = 'Y' and TRANS_TYPE = 'CREDIT'";

    } else if (roleId == enums.RolesEnum.CMD && purpose == 'DEP_OPEN'){

        query = "select substr(b.act_num,1,13) AS \"accountNo\", a.batch_id AS \"txnId\", a.trans_dt AS \"txnDate\", b.particulars AS \"txnDescription\", a.cmd_approval_req AS \"cmdApprovalReq\",\
        case when nvl(a.gm_auth_status,'P')='P' then 'Pending' when a.gm_auth_status='A' then 'Approved' else 'Rejected' end AS \"txnStatus\", da.status_by AS \"maker\",\
        da.authorized_by AS \"checker\",  b.status_dt AS \"checkerDate\", a.gm_timestamp AS \"gmAuthDate\",  a.cmd_timestamp AS \"cmdAuthDate\", a.remarks AS \"checkerRemarks\",\
        a.gm_remarks AS \"gmRemarks\",  a.cmd_remarks AS \"cmdRemarks\", trans_type AS \"transactionType\",da.deposit_no as \"depositNumber\", getcustname(da.deposit_no) as \"custName\",\
        getProdName(da.prod_id) as \"scheme\", fngetpandetails(da.cust_id) as \"panNumber\", dsa.deposit_dt as \"depositDt\",da.constitution as \"custType\", dsa.maturity_dt as \"maturityDt\",\
        dsa.DEPOSIT_PERIOD_MM || 'Months' as \"period\", dsa.rate_of_int as \"interestRate\",dsa.deposit_amt as \"depositAmt\", dsa.maturity_amt as \"maturityAmt\", dsa.tot_int_amt as \"totalIntAmt\"\
		, CASE WHEN (SELECT COUNT(*) FROM TRANSFER_TRANS C WHERE a.batch_id=C.batch_id AND A.TRANS_DT=C.TRANS_DT AND C.TRANS_TYPE='CREDIT')>1 THEN 'The batch that you are approving/rejecting has multiple transactions ('|| \
        (SELECT COUNT(*) FROM TRANSFER_TRANS C WHERE a.batch_id=C.batch_id AND A.TRANS_DT=C.TRANS_DT AND C.TRANS_TYPE='CREDIT') ||'). Ensure you have verified them before clicking the confirm button.' ELSE NULL END AS \"transAlert\" \
        from approval_master a join transfer_trans b on a.batch_id=b.batch_id and a.trans_dt = b.trans_dt\
        join deposit_acinfo da on a.act_num = da.deposit_no and da.authorize_status = 'APPROVAL_PENDING'\
        join deposit_sub_acinfo dsa on a.act_num = dsa.deposit_no and dsa.authorize_status = 'APPROVAL_PENDING'\
        where a.purpose=:purpose and a.remarks = 'DEP_OPEN' and a.cmd_approval_req='Y' and NVL(a.gm_auth_status,'P')='A' and a.cmd_auth_status is null  and TRANS_TYPE = 'CREDIT'\
        union all\
        select substr(b.act_num,1,13) AS \"accountNo\", a.batch_id AS \"txnId\", a.trans_dt AS \"txnDate\", b.particulars AS \"txnDescription\", a.cmd_approval_req AS \"cmdApprovalReq\",\
        case when nvl(a.gm_auth_status,'P')='P' then 'Pending' when a.gm_auth_status='A' then 'Approved' else 'Rejected' end AS \"txnStatus\", da.status_by AS \"maker\",\
        da.authorized_by AS \"checker\",  b.status_dt AS \"checkerDate\", a.gm_timestamp AS \"gmAuthDate\",  a.cmd_timestamp AS \"cmdAuthDate\", a.remarks AS \"checkerRemarks\",\
        a.gm_remarks AS \"gmRemarks\",  a.cmd_remarks AS \"cmdRemarks\", trans_type AS \"transactionType\",da.deposit_no as \"depositNumber\", getcustname(da.deposit_no) as \"custName\",\
        getProdName(da.prod_id) as \"scheme\", fngetpandetails(da.cust_id) as \"panNumber\", dsa.deposit_dt as \"depositDt\",da.constitution as \"custType\", dsa.maturity_dt as \"maturityDt\",\
        dsa.DEPOSIT_PERIOD_MM || 'Months' as \"period\", dsa.rate_of_int as \"interestRate\",dsa.deposit_amt as \"depositAmt\", dsa.maturity_amt as \"maturityAmt\", dsa.tot_int_amt as \"totalIntAmt\"\
		, CASE WHEN (SELECT COUNT(*) FROM TRANSFER_TRANS C WHERE a.batch_id=C.batch_id AND A.TRANS_DT=C.TRANS_DT AND C.TRANS_TYPE='CREDIT')>1 THEN 'The batch that you are approving/rejecting has multiple transactions ('|| \
        (SELECT COUNT(*) FROM TRANSFER_TRANS C WHERE a.batch_id=C.batch_id AND A.TRANS_DT=C.TRANS_DT AND C.TRANS_TYPE='CREDIT') ||'). Ensure you have verified them before clicking the confirm button.' ELSE NULL END AS \"transAlert\" \
        from approval_master a join transfer_trans b on a.MULTIPLE_batch_id=b.link_batch_id and a.trans_dt=b.trans_dt and a.status!='DELETED' and b.status!='DELETED' and purpose=:purpose\
        and a.MULTIPLE_batch_id = b.link_batch_id and trans_type ='CREDIT' and remarks='MULTIPLE_OPEN' and b.amount = a.amount\
        join deposit_acinfo da on substr(b.act_num,1,13) = da.deposit_no and da.authorize_status = 'APPROVAL_PENDING' AND A.ACT_NUM=DA.DEPOSIT_NO\
        join deposit_sub_acinfo dsa on da.deposit_no = dsa.deposit_no and dsa.authorize_status = 'APPROVAL_PENDING'\
        where a.purpose=:purpose and a.cmd_approval_req='Y' and NVL(a.gm_auth_status,'P')='A' and a.cmd_auth_status is null  and TRANS_TYPE = 'CREDIT'";
	 
     }   else if (roleId == enums.RolesEnum.GM && purpose == 'SPECIAL_ROI'){      
	 
		query="select substr(b.act_num,1,13) AS \"accountNo\", a.batch_id AS \"txnId\", a.trans_dt AS \"txnDate\", b.particulars AS \"txnDescription\", a.cmd_approval_req AS \"cmdApprovalReq\",\
		case when nvl(a.gm_auth_status,'P')='P' then 'Pending' when a.gm_auth_status='A' then 'Approved' else 'Rejected' end AS \"txnStatus\", da.status_by AS \"maker\", \
        da.authorized_by AS \"checker\",  b.status_dt AS \"checkerDate\", a.gm_timestamp AS \"gmAuthDate\",  a.cmd_timestamp AS \"cmdAuthDate\", a.remarks AS \"checkerRemarks\",\
        a.gm_remarks AS \"gmRemarks\",  a.cmd_remarks AS \"cmdRemarks\", trans_type AS \"transactionType\",da.deposit_no as \"depositNumber\", getcustname(da.deposit_no) as \"custName\", \
        getProdName(da.prod_id) as \"scheme\", fngetpandetails(da.cust_id) as \"panNumber\", dsa.deposit_dt as \"depositDt\",da.constitution as \"custType\", dsa.maturity_dt as \"maturityDt\", \
        dsa.DEPOSIT_PERIOD_MM || 'Months' as \"period\", dsa.rate_of_int as \"interestRate\",(dsa.rate_of_int-DSA.SPECIAL_ROI) as \"originalRoi\",dsa.deposit_amt as \"depositAmt\", dsa.maturity_amt as \"maturityAmt\", dsa.tot_int_amt as \"totalIntAmt\"\
		, CASE WHEN (SELECT COUNT(*) FROM TRANSFER_TRANS C WHERE a.batch_id=C.batch_id AND A.TRANS_DT=C.TRANS_DT AND C.TRANS_TYPE='CREDIT')>1 THEN \
        'The batch that you are approving/rejecting has multiple transactions ('|| \
        (SELECT COUNT(*) FROM TRANSFER_TRANS C WHERE a.batch_id=C.batch_id AND A.TRANS_DT=C.TRANS_DT AND C.TRANS_TYPE='CREDIT') ||'). Ensure you have verified them before clicking the confirm button.' ELSE NULL END AS \"transAlert\" \
        from approval_master a join transfer_trans b on a.batch_id=b.batch_id  and a.trans_dt = b.trans_dt\
        join deposit_acinfo da on a.act_num = da.deposit_no and da.authorize_status = 'APPROVAL_PENDING'\
        join deposit_sub_acinfo dsa on a.act_num = dsa.deposit_no and dsa.authorize_status = 'APPROVAL_PENDING'\
        where a.purpose=:purpose and a.gm_auth_status = 'P' and a.gm_approval_req = 'Y' and TRANS_TYPE = 'CREDIT'";
         
    } else if (roleId == enums.RolesEnum.CMD && purpose == 'SPECIAL_ROI'){

        query="select substr(b.act_num,1,13) AS \"accountNo\", a.batch_id AS \"txnId\", a.trans_dt AS \"txnDate\", b.particulars AS \"txnDescription\", a.cmd_approval_req AS \"cmdApprovalReq\",\
		case when nvl(a.gm_auth_status,'P')='P' then 'Pending' when a.gm_auth_status='A' then 'Approved' else 'Rejected' end AS \"txnStatus\", da.status_by AS \"maker\", \
        da.authorized_by AS \"checker\",  b.status_dt AS \"checkerDate\", a.gm_timestamp AS \"gmAuthDate\",  a.cmd_timestamp AS \"cmdAuthDate\", a.remarks AS \"checkerRemarks\",\
        a.gm_remarks AS \"gmRemarks\",  a.cmd_remarks AS \"cmdRemarks\", trans_type AS \"transactionType\",da.deposit_no as \"depositNumber\", getcustname(da.deposit_no) as \"custName\", \
        getProdName(da.prod_id) as \"scheme\", fngetpandetails(da.cust_id) as \"panNumber\", dsa.deposit_dt as \"depositDt\",da.constitution as \"custType\", dsa.maturity_dt as \"maturityDt\", \
        dsa.DEPOSIT_PERIOD_MM || 'Months' as \"period\", dsa.rate_of_int as \"interestRate\",(dsa.rate_of_int-DSA.SPECIAL_ROI) as \"originalRoi\",dsa.deposit_amt as \"depositAmt\", dsa.maturity_amt as \"maturityAmt\", dsa.tot_int_amt as \"totalIntAmt\"\
		, CASE WHEN (SELECT COUNT(*) FROM TRANSFER_TRANS C WHERE a.batch_id=C.batch_id AND A.TRANS_DT=C.TRANS_DT AND C.TRANS_TYPE='CREDIT')>1 THEN \
        'The batch that you are approving/rejecting has multiple transactions ('|| \
        (SELECT COUNT(*) FROM TRANSFER_TRANS C WHERE a.batch_id=C.batch_id AND A.TRANS_DT=C.TRANS_DT AND C.TRANS_TYPE='CREDIT') ||'). Ensure you have verified them before clicking the confirm button.' ELSE NULL END AS \"transAlert\" \
        from approval_master a join transfer_trans b on a.batch_id=b.batch_id and a.trans_dt = b.trans_dt \
        join deposit_acinfo da on a.act_num = da.deposit_no and da.authorize_status = 'APPROVAL_PENDING'\
        join deposit_sub_acinfo dsa on a.act_num = dsa.deposit_no and dsa.authorize_status = 'APPROVAL_PENDING'\
        where a.purpose=:purpose and a.cmd_approval_req='Y' and NVL(a.gm_auth_status,'P')='A' and a.cmd_auth_status is null  and TRANS_TYPE = 'CREDIT'";
	 
     } else if (roleId == enums.RolesEnum.GM && purpose == 'DEP_CLOSE') {//TO_DATE(a.trans_dt,'DD-MM-YYYY') AS txnDate


	 query="SELECT B.TRANS_ID,SUBSTR(B.ACT_NUM,1,13) AS \"accountNo\", A.BATCH_ID AS \"txnId\", A.TRANS_DT AS \"txnDate\", B.PARTICULARS AS \"txnDescription\", A.CMD_APPROVAL_REQ AS \"cmdApprovalReq\",\
     CASE WHEN NVL(A.GM_AUTH_STATUS,'P')='P' THEN 'Pending' WHEN A.GM_AUTH_STATUS='A' THEN 'Approved' ELSE 'Rejected' END AS \"txnStatus\", B.STATUS_BY AS \"maker\",\
     DA.AUTHORIZED_BY AS \"checker\",  B.STATUS_DT AS \"checkerDate\", A.GM_TIMESTAMP AS \"gmAuthDate\",  A.CMD_TIMESTAMP AS \"cmdAuthDate\", A.REMARKS AS \"checkerRemarks\",\
     A.GM_REMARKS AS \"gmRemarks\",  A.CMD_REMARKS AS \"cmdRemarks\", TRANS_TYPE AS \"transactionType\",DA.DEPOSIT_NO AS \"depositNumber\", GETCUSTNAME(DA.DEPOSIT_NO) AS \"custName\",\
     GETPRODNAME(DA.PROD_ID) AS \"scheme\", FNGETPANDETAILS(DA.CUST_ID) AS \"panNumber\", DSA.DEPOSIT_DT AS \"depositDt\",DA.CONSTITUTION AS \"custType\", DSA.MATURITY_DT AS \"maturityDt\",\
     DSA.DEPOSIT_PERIOD_MM || 'Months' AS \"period\", DSA.RATE_OF_INT AS \"interestRate\",DSA.DEPOSIT_AMT AS \"depositAmt\", DSA.MATURITY_AMT AS \"maturityAmt\", DSA.TOT_INT_AMT AS \"totalIntAmt\",\
     NVL(DCD.DEP_NET_AMOUNT,0) AS \"closureAmt\",DCD.DEP_ROI AS \"closureROI\",NVL(DCD.DEP_INTEREST,0) AS \"intPaid\",NVL(DCD.DEP_TDS,0) AS \"tdsDeducted\",NVL(DCD.LOAN_NO,'-') AS \"loanAcctNumber\",\
     NVL(DCD.LOAN_NET_AMOUNT,0) AS \"loanAmount\",NVL(DCD.LOAN_INTEREST,0) AS \"loanIntAmount\", CASE WHEN DSA.FLEXI_STATUS ='PMW' THEN 'Pre Mature Withdrawal' WHEN DSA.FLEXI_STATUS ='MDC' THEN 'Maturity Date Closure'\
     WHEN DSA.FLEXI_STATUS ='PDC' THEN 'Advance Closure' ELSE 'Normal Closure' END AS \"closingType\"\
	 , CASE WHEN (SELECT COUNT(*) FROM TRANSFER_TRANS C WHERE a.batch_id=C.batch_id AND A.TRANS_DT=C.TRANS_DT AND C.TRANS_TYPE='DEBIT')>1 THEN \
	'The batch that you are approving/rejecting has multiple transactions ('|| \
	(SELECT COUNT(*) FROM TRANSFER_TRANS C WHERE a.batch_id=C.batch_id AND A.TRANS_DT=C.TRANS_DT AND C.TRANS_TYPE='DEBIT') ||'). Ensure you have verified them before clicking the confirm button.' ELSE NULL END AS \"transAlert\" \
     FROM APPROVAL_MASTER A JOIN TRANSFER_TRANS B ON A.BATCH_ID=B.BATCH_ID AND A.TRANS_DT = B.TRANS_DT\
     JOIN DEPOSIT_ACINFO DA ON A.ACT_NUM = DA.DEPOSIT_NO AND DA.AUTHORIZE_STATUS = 'APPROVAL_PENDING'\
     JOIN DEPOSIT_SUB_ACINFO DSA ON A.ACT_NUM = DSA.DEPOSIT_NO AND DSA.AUTHORIZE_STATUS = 'APPROVAL_PENDING'\
     JOIN DEPOSIT_CLOSING_DETAILS DCD ON A.ACT_NUM = DCD.DEPOSIT_NO \
     AND A.STATUS!='DELETED' AND B.STATUS!='DELETED'  AND B.ACT_NUM IS NOT NULL\
     WHERE A.PURPOSE=:purpose AND A.GM_AUTH_STATUS = 'P' AND A.GM_APPROVAL_REQ = 'Y' AND TRANS_TYPE = 'DEBIT'\
	 UNION ALL\
	 SELECT B.TRANS_ID,SUBSTR(B.ACT_NUM,1,13) AS \"accountNo\", A.BATCH_ID AS \"txnId\", B.TRANS_DT AS \"txnDate\", B.PARTICULARS AS \"txnDescription\", A.CMD_APPROVAL_REQ AS \"cmdApprovalReq\",\
     CASE WHEN NVL(A.GM_AUTH_STATUS,'P')='P' THEN 'Pending' WHEN A.GM_AUTH_STATUS='A' THEN 'Approved' ELSE 'Rejected' END AS \"txnStatus\", B.STATUS_BY AS \"maker\",\
     DA.AUTHORIZED_BY AS \"checker\",  B.STATUS_DT AS \"checkerDate\", A.GM_TIMESTAMP AS \"gmAuthDate\",  A.CMD_TIMESTAMP AS \"cmdAuthDate\", A.REMARKS AS \"checkerRemarks\",\
     A.GM_REMARKS AS \"gmRemarks\",  A.CMD_REMARKS AS \"cmdRemarks\", TRANS_TYPE AS \"transactionType\",DA.DEPOSIT_NO AS \"depositNumber\", GETCUSTNAME(DA.DEPOSIT_NO) AS \"custName\",\
     GETPRODNAME(DA.PROD_ID) AS \"scheme\", FNGETPANDETAILS(DA.CUST_ID) AS \"panNumber\", DSA.DEPOSIT_DT AS \"depositDt\",DA.CONSTITUTION AS \"custType\", DSA.MATURITY_DT AS \"maturityDt\",\
     DSA.DEPOSIT_PERIOD_MM || 'Months' AS \"period\", DSA.RATE_OF_INT AS \"interestRate\",DSA.DEPOSIT_AMT AS \"depositAmt\", DSA.MATURITY_AMT AS \"maturityAmt\", DSA.TOT_INT_AMT AS \"totalIntAmt\",\
     NVL(DCD.DEP_NET_AMOUNT,0) AS \"closureAmt\",DCD.DEP_ROI AS \"closureROI\",NVL(DCD.DEP_INTEREST,0) AS \"intPaid\",NVL(DCD.DEP_TDS,0) AS \"tdsDeducted\",NVL(DCD.LOAN_NO,'-') AS \"loanAcctNumber\",\
     NVL(DCD.LOAN_NET_AMOUNT,0) AS \"loanAmount\",NVL(DCD.LOAN_INTEREST,0) AS \"loanIntAmount\", CASE WHEN DSA.FLEXI_STATUS ='PMW' THEN 'Pre Mature Withdrawal' WHEN DSA.FLEXI_STATUS ='MDC' THEN 'Maturity Date Closure'\
     WHEN DSA.FLEXI_STATUS ='PDC' THEN 'Advance Closure' ELSE 'Normal Closure' END AS \"closingType\"\
	 , CASE WHEN (SELECT COUNT(*) FROM TRANSFER_TRANS C WHERE a.batch_id=C.batch_id AND A.TRANS_DT=C.TRANS_DT AND C.TRANS_TYPE='DEBIT')>1 THEN \
	'The batch that you are approving/rejecting has multiple transactions ('|| \
	(SELECT COUNT(*) FROM TRANSFER_TRANS C WHERE a.batch_id=C.batch_id AND A.TRANS_DT=C.TRANS_DT AND C.TRANS_TYPE='DEBIT') ||'). Ensure you have verified them before clicking the confirm button.' ELSE NULL END AS \"transAlert\" \
     FROM APPROVAL_MASTER A, ADVANCE_TRANSFER_TRANS B, DEPOSIT_ACINFO DA,DEPOSIT_SUB_ACINFO DSA, DEPOSIT_CLOSING_DETAILS DCD \
     WHERE DA.DEPOSIT_NO = DSA.DEPOSIT_NO AND A.BATCH_ID=B.BATCH_ID \
     AND DSA.MATURITY_DT=B.TRANS_DT AND DA.DEPOSIT_NO = SUBSTR(B.LINK_BATCH_ID,1,13)\
     AND A.STATUS!='DELETED' AND B.STATUS!='DELETED'  AND DA.AUTHORIZE_STATUS='APPROVAL_PENDING' AND B.ACT_NUM IS NOT NULL\
     AND A.ACT_NUM = DCD.DEPOSIT_NO AND PURPOSE=:purpose AND TRANS_TYPE='DEBIT' AND A.GM_APPROVAL_REQ = 'Y' AND GM_AUTH_STATUS = 'P' \
     AND B.TRANS_TYPE = 'DEBIT'";
	 
	 //commented on 5-jun-2020 after fixing deposit closure listing issue
     /*query = "select b.trans_id,substr(b.act_num,1,13) AS \"accountNo\", a.batch_id AS \"txnId\", a.trans_dt AS \"txnDate\", b.particulars AS \"txnDescription\", a.cmd_approval_req AS \"cmdApprovalReq\",\
     case when nvl(a.gm_auth_status,'P')='P' then 'Pending' when a.gm_auth_status='A' then 'Approved' else 'Rejected' end AS \"txnStatus\", b.status_by AS \"maker\",\
     da.authorized_by AS \"checker\",  b.status_dt AS \"checkerDate\", a.gm_timestamp AS \"gmAuthDate\",  a.cmd_timestamp AS \"cmdAuthDate\", a.remarks AS \"checkerRemarks\",\
     a.gm_remarks AS \"gmRemarks\",  a.cmd_remarks AS \"cmdRemarks\", trans_type AS \"transactionType\",da.deposit_no as \"depositNumber\", getcustname(da.deposit_no) as \"custName\",\
     getProdName(da.prod_id) as \"scheme\", fngetpandetails(da.cust_id) as \"panNumber\", dsa.deposit_dt as \"depositDt\",da.constitution as \"custType\", dsa.maturity_dt as \"maturityDt\",\
     dsa.DEPOSIT_PERIOD_MM || 'Months' as \"period\", dsa.rate_of_int as \"interestRate\",dsa.deposit_amt as \"depositAmt\", dsa.maturity_amt as \"maturityAmt\", dsa.tot_int_amt as \"totalIntAmt\",\
	 NVL(dcd.dep_net_amount,0) as \"closureAmt\",dcd.dep_roi as \"closureROI\",NVL(dcd.dep_interest,0) as \"intPaid\",NVL(dcd.dep_tds,0) as \"tdsDeducted\",nvl(dcd.loan_no,'-') as \"loanAcctNumber\",\
	 nvl(dcd.loan_net_amount,0) as \"loanAmount\",nvl(dcd.loan_interest,0) as \"loanIntAmount\", case when dsa.flexi_Status ='PMW' THEN 'Pre Mature Withdrawal' when dsa.flexi_Status ='MDC' then 'Maturity Date Closure'\
     when dsa.flexi_Status ='PDC' THEN 'Advance Closure' else 'Normal Closure' end as \"closingType\"\
     from approval_master a join transfer_trans b on a.batch_id=b.batch_id and a.trans_dt = b.trans_dt\
     join deposit_acinfo da on a.act_num = da.deposit_no and da.authorize_status = 'APPROVAL_PENDING'\
     join deposit_sub_acinfo dsa on a.act_num = dsa.deposit_no and dsa.authorize_status = 'APPROVAL_PENDING'\
	 join deposit_closing_details dcd on a.act_num = dcd.deposit_no \
     where a.purpose=:purpose and a.gm_auth_status = 'P' and a.gm_approval_req = 'Y' and TRANS_TYPE = 'DEBIT'\
     UNION ALL\
     SELECT b.trans_id,substr(b.act_num,1,13) AS \"accountNo\", a.batch_id AS \"txnId\", a.trans_dt AS \"txnDate\", b.particulars AS \"txnDescription\", a.cmd_approval_req AS \"cmdApprovalReq\",\
     case when nvl(a.gm_auth_status,'P')='P' then 'Pending' when a.gm_auth_status='A' then 'Approved' else 'Rejected' end AS \"txnStatus\", b.status_by AS \"maker\",\
     da.authorized_by AS \"checker\",  b.status_dt AS \"checkerDate\", a.gm_timestamp AS \"gmAuthDate\",  a.cmd_timestamp AS \"cmdAuthDate\", a.remarks AS \"checkerRemarks\",\
     a.gm_remarks AS \"gmRemarks\",  a.cmd_remarks AS \"cmdRemarks\", trans_type AS \"transactionType\",da.deposit_no as \"depositNumber\", getcustname(da.deposit_no) as \"custName\",\
     getProdName(da.prod_id) as \"scheme\", fngetpandetails(da.cust_id) as \"panNumber\", dsa.deposit_dt as \"depositDt\",da.constitution as \"custType\", dsa.maturity_dt as \"maturityDt\",\
     dsa.DEPOSIT_PERIOD_MM || 'Months' as \"period\", dsa.rate_of_int as \"interestRate\",dsa.deposit_amt as \"depositAmt\", dsa.maturity_amt as \"maturityAmt\", dsa.tot_int_amt as \"totalIntAmt\",\
	 NVL(dcd.dep_net_amount,0) as \"closureAmt\",dcd.dep_roi as \"closureROI\",NVL(dcd.dep_interest,0) as \"intPaid\",NVL(dcd.dep_tds,0) as \"tdsDeducted\",nvl(dcd.loan_no,'-') as \"loanAcctNumber\",\
	 nvl(dcd.loan_net_amount,0) as \"loanAmount\",nvl(dcd.loan_interest,0) as \"loanIntAmount\", case when dsa.flexi_Status ='PMW' THEN 'Pre Mature Withdrawal' when dsa.flexi_Status ='MDC' then 'Maturity Date Closure'\
     when dsa.flexi_Status ='PDC' THEN 'Advance Closure' else 'Normal Closure' end as \"closingType\"\
	 from approval_master a, advance_transfer_trans b, deposit_acinfo da,deposit_sub_acinfo dsa, deposit_closing_details dcd where da.deposit_no = dsa.deposit_no and a.batch_id=b.batch_id and dsa.maturity_dt=b.trans_dt and da.deposit_no = substr(b.act_num,1,13) and a.status!='DELETED'\
     and b.status!='DELETED' and a.act_num = dcd.deposit_no and purpose=:purpose and trans_type=case when a.remarks='ADVANCE_DEP_CLOSE' then 'DEBIT' else  'CREDIT' end and a.gm_approval_req = 'Y' and gm_auth_status = 'P' and b.trans_type = 'DEBIT'";*/
		
         
    } else if (roleId == enums.RolesEnum.CMD && purpose == 'DEP_CLOSE'){


	query="SELECT B.TRANS_ID,SUBSTR(B.ACT_NUM,1,13) AS \"accountNo\", A.BATCH_ID AS \"txnId\", A.TRANS_DT AS \"txnDate\", B.PARTICULARS AS \"txnDescription\", A.CMD_APPROVAL_REQ AS \"cmdApprovalReq\",\
     CASE WHEN NVL(A.GM_AUTH_STATUS,'P')='P' THEN 'Pending' WHEN A.GM_AUTH_STATUS='A' THEN 'Approved' ELSE 'Rejected' END AS \"txnStatus\", B.STATUS_BY AS \"maker\",\
     DA.AUTHORIZED_BY AS \"checker\",  B.STATUS_DT AS \"checkerDate\", A.GM_TIMESTAMP AS \"gmAuthDate\",  A.CMD_TIMESTAMP AS \"cmdAuthDate\", A.REMARKS AS \"checkerRemarks\",\
     A.GM_REMARKS AS \"gmRemarks\",  A.CMD_REMARKS AS \"cmdRemarks\", TRANS_TYPE AS \"transactionType\",DA.DEPOSIT_NO AS \"depositNumber\", GETCUSTNAME(DA.DEPOSIT_NO) AS \"custName\",\
     GETPRODNAME(DA.PROD_ID) AS \"scheme\", FNGETPANDETAILS(DA.CUST_ID) AS \"panNumber\", DSA.DEPOSIT_DT AS \"depositDt\",DA.CONSTITUTION AS \"custType\", DSA.MATURITY_DT AS \"maturityDt\",\
     DSA.DEPOSIT_PERIOD_MM || 'Months' AS \"period\", DSA.RATE_OF_INT AS \"interestRate\",DSA.DEPOSIT_AMT AS \"depositAmt\", DSA.MATURITY_AMT AS \"maturityAmt\", DSA.TOT_INT_AMT AS \"totalIntAmt\",\
     NVL(DCD.DEP_NET_AMOUNT,0) AS \"closureAmt\",DCD.DEP_ROI AS \"closureROI\",NVL(DCD.DEP_INTEREST,0) AS \"intPaid\",NVL(DCD.DEP_TDS,0) AS \"tdsDeducted\",NVL(DCD.LOAN_NO,'-') AS \"loanAcctNumber\",\
     NVL(DCD.LOAN_NET_AMOUNT,0) AS \"loanAmount\",NVL(DCD.LOAN_INTEREST,0) AS \"loanIntAmount\", CASE WHEN DSA.FLEXI_STATUS ='PMW' THEN 'Pre Mature Withdrawal' WHEN DSA.FLEXI_STATUS ='MDC' THEN 'Maturity Date Closure'\
     WHEN DSA.FLEXI_STATUS ='PDC' THEN 'Advance Closure' ELSE 'Normal Closure' END AS \"closingType\"\
	 , CASE WHEN (SELECT COUNT(*) FROM TRANSFER_TRANS C WHERE a.batch_id=C.batch_id AND A.TRANS_DT=C.TRANS_DT AND C.TRANS_TYPE='DEBIT')>1 THEN 'The batch that you are approving/rejecting has multiple transactions ('|| \
	(SELECT COUNT(*) FROM TRANSFER_TRANS C WHERE a.batch_id=C.batch_id AND A.TRANS_DT=C.TRANS_DT AND C.TRANS_TYPE='DEBIT') ||'). Ensure you have verified them before clicking the confirm button.' ELSE NULL END AS \"transAlert\" \
     FROM APPROVAL_MASTER A JOIN TRANSFER_TRANS B ON A.BATCH_ID=B.BATCH_ID AND A.TRANS_DT = B.TRANS_DT\
     JOIN DEPOSIT_ACINFO DA ON A.ACT_NUM = DA.DEPOSIT_NO AND DA.AUTHORIZE_STATUS = 'APPROVAL_PENDING'\
     JOIN DEPOSIT_SUB_ACINFO DSA ON A.ACT_NUM = DSA.DEPOSIT_NO AND DSA.AUTHORIZE_STATUS = 'APPROVAL_PENDING'\
     JOIN DEPOSIT_CLOSING_DETAILS DCD ON A.ACT_NUM = DCD.DEPOSIT_NO \
     AND A.STATUS!='DELETED' AND B.STATUS!='DELETED'  AND B.ACT_NUM IS NOT NULL\
     WHERE A.PURPOSE=:purpose and a.cmd_approval_req='Y' and NVL(a.gm_auth_status,'P')='A' and a.cmd_auth_status is null  and TRANS_TYPE = 'DEBIT'\
	 UNION ALL\
	 SELECT B.TRANS_ID,SUBSTR(B.ACT_NUM,1,13) AS \"accountNo\", A.BATCH_ID AS \"txnId\", B.TRANS_DT AS \"txnDate\", B.PARTICULARS AS \"txnDescription\", A.CMD_APPROVAL_REQ AS \"cmdApprovalReq\",\
     CASE WHEN NVL(A.GM_AUTH_STATUS,'P')='P' THEN 'Pending' WHEN A.GM_AUTH_STATUS='A' THEN 'Approved' ELSE 'Rejected' END AS \"txnStatus\", B.STATUS_BY AS \"maker\",\
     DA.AUTHORIZED_BY AS \"checker\",  B.STATUS_DT AS \"checkerDate\", A.GM_TIMESTAMP AS \"gmAuthDate\",  A.CMD_TIMESTAMP AS \"cmdAuthDate\", A.REMARKS AS \"checkerRemarks\",\
     A.GM_REMARKS AS \"gmRemarks\",  A.CMD_REMARKS AS \"cmdRemarks\", TRANS_TYPE AS \"transactionType\",DA.DEPOSIT_NO AS \"depositNumber\", GETCUSTNAME(DA.DEPOSIT_NO) AS \"custName\",\
     GETPRODNAME(DA.PROD_ID) AS \"scheme\", FNGETPANDETAILS(DA.CUST_ID) AS \"panNumber\", DSA.DEPOSIT_DT AS \"depositDt\",DA.CONSTITUTION AS \"custType\", DSA.MATURITY_DT AS \"maturityDt\",\
     DSA.DEPOSIT_PERIOD_MM || 'Months' AS \"period\", DSA.RATE_OF_INT AS \"interestRate\",DSA.DEPOSIT_AMT AS \"depositAmt\", DSA.MATURITY_AMT AS \"maturityAmt\", DSA.TOT_INT_AMT AS \"totalIntAmt\",\
     NVL(DCD.DEP_NET_AMOUNT,0) AS \"closureAmt\",DCD.DEP_ROI AS \"closureROI\",NVL(DCD.DEP_INTEREST,0) AS \"intPaid\",NVL(DCD.DEP_TDS,0) AS \"tdsDeducted\",NVL(DCD.LOAN_NO,'-') AS \"loanAcctNumber\",\
     NVL(DCD.LOAN_NET_AMOUNT,0) AS \"loanAmount\",NVL(DCD.LOAN_INTEREST,0) AS \"loanIntAmount\", CASE WHEN DSA.FLEXI_STATUS ='PMW' THEN 'Pre Mature Withdrawal' WHEN DSA.FLEXI_STATUS ='MDC' THEN 'Maturity Date Closure'\
     WHEN DSA.FLEXI_STATUS ='PDC' THEN 'Advance Closure' ELSE 'Normal Closure' END AS \"closingType\"\
	 , CASE WHEN (SELECT COUNT(*) FROM TRANSFER_TRANS C WHERE a.batch_id=C.batch_id AND A.TRANS_DT=C.TRANS_DT AND C.TRANS_TYPE='DEBIT')>1 THEN 'The batch that you are approving/rejecting has multiple transactions ('|| \
	(SELECT COUNT(*) FROM TRANSFER_TRANS C WHERE a.batch_id=C.batch_id AND A.TRANS_DT=C.TRANS_DT AND C.TRANS_TYPE='DEBIT') ||'). Ensure you have verified them before clicking the confirm button.' ELSE NULL END AS \"transAlert\" \
     FROM APPROVAL_MASTER A, ADVANCE_TRANSFER_TRANS B, DEPOSIT_ACINFO DA,DEPOSIT_SUB_ACINFO DSA, DEPOSIT_CLOSING_DETAILS DCD \
     WHERE DA.DEPOSIT_NO = DSA.DEPOSIT_NO AND A.BATCH_ID=B.BATCH_ID \
     AND DSA.MATURITY_DT=B.TRANS_DT AND DA.DEPOSIT_NO = SUBSTR(B.LINK_BATCH_ID,1,13)\
     AND A.STATUS!='DELETED' AND B.STATUS!='DELETED'  AND DA.AUTHORIZE_STATUS='APPROVAL_PENDING' AND B.ACT_NUM IS NOT NULL\
     AND A.ACT_NUM = DCD.DEPOSIT_NO AND PURPOSE=:purpose AND TRANS_TYPE='DEBIT' and a.cmd_approval_req='Y' and NVL(a.gm_auth_status,'P')='A' and a.cmd_auth_status is null";
	 
      //  query = "select substr(b.act_num,1,13) AS \"accountNo\", a.batch_id AS \"txnId\", a.trans_dt AS \"txnDate\", b.particulars AS \"txnDescription\", a.cmd_approval_req AS \"cmdApprovalReq\",\
      //  case when nvl(a.gm_auth_status,'P')='P' then 'Pending' when a.gm_auth_status='A' then 'Approved' else 'Rejected' end AS \"txnStatus\", b.status_by AS \"maker\",\
      //  da.authorized_by AS \"checker\",  b.status_dt AS \"checkerDate\", a.gm_timestamp AS \"gmAuthDate\",  a.cmd_timestamp AS \"cmdAuthDate\", a.remarks AS \"checkerRemarks\",\
      //  a.gm_remarks AS \"gmRemarks\",  a.cmd_remarks AS \"cmdRemarks\", trans_type AS \"transactionType\",da.deposit_no as \"depositNumber\", getcustname(da.deposit_no) as \"custName\",\
      //  getProdName(da.prod_id) as \"scheme\", fngetpandetails(da.cust_id) as \"panNumber\", dsa.deposit_dt as \"depositDt\",da.constitution as \"custType\", dsa.maturity_dt as \"maturityDt\",\
      //  dsa.DEPOSIT_PERIOD_MM || 'Months' as \"period\", dsa.rate_of_int as \"interestRate\",dsa.deposit_amt as \"depositAmt\", dsa.maturity_amt as \"maturityAmt\", dsa.tot_int_amt as \"totalIntAmt\"\
      //  from approval_master a join transfer_trans b on a.batch_id=b.batch_id and a.trans_dt = b.trans_dt\
      //  join deposit_acinfo da on a.act_num = da.deposit_no and da.authorize_status = 'APPROVAL_PENDING'\
       // join deposit_sub_acinfo dsa on a.act_num = dsa.deposit_no and dsa.authorize_status = 'APPROVAL_PENDING'\
      //  where a.purpose=:purpose and a.cmd_approval_req='Y' and NVL(a.gm_auth_status,'P')='A' and a.cmd_auth_status is null  and TRANS_TYPE = 'DEBIT'\
      //  UNION ALL\
      //  SELECT  substr(b.act_num,1,13) AS \"accountNo\", a.batch_id AS \"txnId\", a.trans_dt AS \"txnDate\", b.particulars AS \"txnDescription\", a.cmd_approval_req AS \"cmdApprovalReq\",\
      //  case when nvl(a.gm_auth_status,'P')='P' then 'Pending' when a.gm_auth_status='A' then 'Approved' else 'Rejected' end AS \"txnStatus\", b.status_by AS \"maker\",\
      //  da.authorized_by AS \"checker\",  b.status_dt AS \"checkerDate\", a.gm_timestamp AS \"gmAuthDate\",  a.cmd_timestamp AS \"cmdAuthDate\", a.remarks AS \"checkerRemarks\",\
      //  a.gm_remarks AS \"gmRemarks\",  a.cmd_remarks AS \"cmdRemarks\", trans_type AS \"transactionType\",da.deposit_no as \"depositNumber\", getcustname(da.deposit_no) as \"custName\",\
      //  getProdName(da.prod_id) as \"scheme\", fngetpandetails(da.cust_id) as \"panNumber\", dsa.deposit_dt as \"depositDt\",da.constitution as \"custType\", dsa.maturity_dt as \"maturityDt\",\
      //  dsa.DEPOSIT_PERIOD_MM || 'Months' as \"period\", dsa.rate_of_int as \"interestRate\",dsa.deposit_amt as \"depositAmt\", dsa.maturity_amt as \"maturityAmt\", dsa.tot_int_amt as \"totalIntAmt\"\
      //  from approval_master a, advance_transfer_trans b, deposit_acinfo da,deposit_sub_acinfo dsa  where da.deposit_no = dsa.deposit_no and a.batch_id=b.batch_id and dsa.maturity_dt=b.trans_dt and da.deposit_no = substr(b.act_num,1,13) and a.status!='DELETED'\
      //  and b.status!='DELETED' and purpose=:purpose and trans_type=case when a.remarks='ADVANCE_DEP_CLOSE' then 'DEBIT' else  'CREDIT' end and a.cmd_approval_req='Y' and NVL(a.gm_auth_status,'P')='A' and a.cmd_auth_status is null  and TRANS_TYPE = 'DEBIT'";
	 
		/*query="select substr(b.act_num,1,13) AS \"accountNo\", a.batch_id AS \"txnId\", a.trans_dt AS \"txnDate\", b.particulars AS \"txnDescription\", a.cmd_approval_req AS \"cmdApprovalReq\",\
		case when nvl(a.gm_auth_status,'P')='P' then 'Pending' when a.gm_auth_status='A' then 'Approved' else 'Rejected' end AS \"txnStatus\", b.status_by AS \"maker\",\
		da.authorized_by AS \"checker\",  b.status_dt AS \"checkerDate\", a.gm_timestamp AS \"gmAuthDate\",  a.cmd_timestamp AS \"cmdAuthDate\", a.remarks AS \"checkerRemarks\",\
		a.gm_remarks AS \"gmRemarks\",  a.cmd_remarks AS \"cmdRemarks\", trans_type AS \"transactionType\",da.deposit_no as \"depositNumber\", getcustname(da.deposit_no) as \"custName\",\
		getProdName(da.prod_id) as \"scheme\", fngetpandetails(da.cust_id) as \"panNumber\", dsa.deposit_dt as \"depositDt\",da.constitution as \"custType\", dsa.maturity_dt as \"maturityDt\",\
		dsa.DEPOSIT_PERIOD_MM || 'Months' as \"period\", dsa.rate_of_int as \"interestRate\",dsa.deposit_amt as \"depositAmt\", dsa.maturity_amt as \"maturityAmt\", dsa.tot_int_amt as \"totalIntAmt\",\
		NVL(dcd.dep_net_amount,0) as \"closureAmt\",dcd.dep_roi as \"closureROI\",NVL(dcd.dep_interest,0) as \"intPaid\",NVL(dcd.dep_tds,0) as \"tdsDeducted\",nvl(dcd.loan_no,'Not Applicable') as \"loanAcctNumber\",\
		nvl(dcd.loan_net_amount,0) as \"loanAmount\",nvl(dcd.loan_interest,0) as \"loanIntAmount\", case when dsa.flexi_Status ='PMW' THEN 'Pre Mature Withdrawal' when dsa.flexi_Status ='MDC' then 'Maturity Date Closure'\
        when dsa.flexi_Status ='PDC' THEN 'Advance Closure' else 'Normal Closure' end as \"closingType\"\
		from approval_master a join transfer_trans b on a.batch_id=b.batch_id and a.trans_dt = b.trans_dt\
		join deposit_acinfo da on a.act_num = da.deposit_no and da.authorize_status = 'APPROVAL_PENDING'\
		join deposit_sub_acinfo dsa on a.act_num = dsa.deposit_no and dsa.authorize_status = 'APPROVAL_PENDING'\
		join deposit_closing_details dcd on a.act_num = dcd.deposit_no \
		where a.purpose=:purpose and a.cmd_approval_req='Y' and NVL(a.gm_auth_status,'P')='A' and a.cmd_auth_status is null  and TRANS_TYPE = 'DEBIT'\
		UNION ALL\
		SELECT  substr(b.act_num,1,13) AS \"accountNo\", a.batch_id AS \"txnId\", a.trans_dt AS \"txnDate\", b.particulars AS \"txnDescription\", a.cmd_approval_req AS \"cmdApprovalReq\",\
		case when nvl(a.gm_auth_status,'P')='P' then 'Pending' when a.gm_auth_status='A' then 'Approved' else 'Rejected' end AS \"txnStatus\", b.status_by AS \"maker\",\
		da.authorized_by AS \"checker\",  b.status_dt AS \"checkerDate\", a.gm_timestamp AS \"gmAuthDate\",  a.cmd_timestamp AS \"cmdAuthDate\", a.remarks AS \"checkerRemarks\",\
		a.gm_remarks AS \"gmRemarks\",  a.cmd_remarks AS \"cmdRemarks\", trans_type AS \"transactionType\",da.deposit_no as \"depositNumber\", getcustname(da.deposit_no) as \"custName\",\
		getProdName(da.prod_id) as \"scheme\", fngetpandetails(da.cust_id) as \"panNumber\", dsa.deposit_dt as \"depositDt\",da.constitution as \"custType\", dsa.maturity_dt as \"maturityDt\",\
		dsa.DEPOSIT_PERIOD_MM || 'Months' as \"period\", dsa.rate_of_int as \"interestRate\",dsa.deposit_amt as \"depositAmt\", dsa.maturity_amt as \"maturityAmt\", dsa.tot_int_amt as \"totalIntAmt\",\
		NVL(dcd.dep_net_amount,0) as \"closureAmt\",dcd.dep_roi as \"closureROI\",NVL(dcd.dep_interest,0) as \"intPaid\",NVL(dcd.dep_tds,0) as \"tdsDeducted\",nvl(dcd.loan_no,'Not Applicable') as \"loanAcctNumber\",\
		nvl(dcd.loan_net_amount,0) as \"loanAmount\",nvl(dcd.loan_interest,0) as \"loanIntAmount\", case when dsa.flexi_Status ='PMW' THEN 'Pre Mature Withdrawal' when dsa.flexi_Status ='MDC' then 'Maturity Date Closure'\
        when dsa.flexi_Status ='PDC' THEN 'Advance Closure' else 'Normal Closure' end as \"closingType\"\
		from approval_master a, advance_transfer_trans b, deposit_acinfo da,deposit_sub_acinfo dsa,deposit_closing_details dcd  where da.deposit_no = dsa.deposit_no and a.batch_id=b.batch_id and dsa.maturity_dt=b.trans_dt and da.deposit_no = substr(b.act_num,1,13) and a.status!='DELETED'\
		and b.status!='DELETED' and a.act_num = dcd.deposit_no and purpose=:purpose and trans_type=case when a.remarks='ADVANCE_DEP_CLOSE' then 'DEBIT' else  'CREDIT' end and a.cmd_approval_req='Y' and NVL(a.gm_auth_status,'P')='A' and a.cmd_auth_status is null  and TRANS_TYPE = 'DEBIT'";*/
			 	 
	 }
     
     else if (roleId == enums.RolesEnum.GM && purpose == 'LOAN_OPEN') {
        
        query = "select b.trans_id, b.batch_id \"txnId\",substr(b.act_num,1,13) as \"accountNo\",b.amount as \"amount\",b.status_dt \"txnDate\",b.particulars \"txnDescription\",\
        case when nvl(gm_auth_status,'P')='P' then 'Pending' when gm_auth_status='A' then 'Approved' else 'Rejected' end \"txnStatus\", b.status_by \"maker\",\
        c.AUTHORIZE_BY_1 as \"checker\", b.status_dt as \"checkerDate\", a.gm_timestamp \"gmAuthDate\",  a.cmd_timestamp \"cmdAuthDate\", b.narration \"narration\", a.gm_remarks \"gmRemarks\",  a.cmd_remarks \"cmdRemarks\",\
        trans_type \"transType\" , CASE WHEN (SELECT COUNT(*) FROM TRANSFER_TRANS C WHERE a.batch_id=C.batch_id AND A.TRANS_DT=C.TRANS_DT AND C.TRANS_TYPE='DEBIT')>1 THEN 'The batch that you are approving/rejecting has multiple transactions ('|| \
        (SELECT COUNT(*) FROM TRANSFER_TRANS C WHERE a.batch_id=C.batch_id AND A.TRANS_DT=C.TRANS_DT AND C.TRANS_TYPE='DEBIT') ||'). Ensure you have verified them before clicking the confirm button.' ELSE NULL END AS \"transAlert\" \
		from approval_master a, transfer_trans b,loans_facility_details c where a.batch_id=b.batch_id and a.trans_dt = b.trans_dt and a.status!='DELETED' and b.status! = 'DELETED' and purpose=:purpose  and trans_type = 'DEBIT'\
        and gm_auth_status = 'P' and a.gm_approval_req = 'Y' and C.ACCT_NUM = B.ACT_NUM and C.authorize_status_1='APPROVAL_PENDING'";

	} else if (roleId == enums.RolesEnum.CMD && purpose =='LOAN_OPEN'){

        query = "select b.trans_id, b.batch_id \"txnId\",substr(b.act_num,1,13) as \"accountNo\",b.amount as \"amount\",b.status_dt \"txnDate\",b.particulars \"txnDescription\",\
        case when nvl(gm_auth_status,'P')='P' then 'Pending' when gm_auth_status='A' then 'Approved' else 'Rejected' end \"txnStatus\", b.status_by \"maker\",\
        c.AUTHORIZE_BY_1 as \"checker\", b.status_dt as \"checkerDate\", a.gm_timestamp \"gmAuthDate\",  a.cmd_timestamp \"cmdAuthDate\", b.narration \"narration\", a.gm_remarks \"gmRemarks\",  a.cmd_remarks \"cmdRemarks\",\
        trans_type \"transType\" , CASE WHEN (SELECT COUNT(*) FROM TRANSFER_TRANS C WHERE a.batch_id=C.batch_id AND A.TRANS_DT=C.TRANS_DT AND C.TRANS_TYPE='DEBIT')>1 THEN 'The batch that you are approving/rejecting has multiple transactions ('|| \
        (SELECT COUNT(*) FROM TRANSFER_TRANS C WHERE a.batch_id=C.batch_id AND A.TRANS_DT=C.TRANS_DT AND C.TRANS_TYPE='DEBIT') ||'). Ensure you have verified them before clicking the confirm button.' ELSE NULL END AS \"transAlert\" \
		from approval_master a, transfer_trans b,loans_facility_details c  where a.batch_id=b.batch_id and a.trans_dt = b.trans_dt and a.status!='DELETED' and b.status! = 'DELETED' and purpose=:purpose  and trans_type = 'DEBIT'\
        and a.cmd_approval_req='Y' and NVL(a.gm_auth_status,'P')='A' and a.cmd_auth_status is null and C.ACCT_NUM = B.ACT_NUM and C.authorize_status_1='APPROVAL_PENDING'";
		
    } else if (roleId == enums.RolesEnum.GM && purpose == 'LOAN_CLOSE') {
        
        query = " select b.trans_id, b.batch_id \"txnId\",substr(b.act_num,1,13) as \"accountNo\",a.amount as \"amount\",b.status_dt \"txnDate\",b.particulars \"txnDescription\",\
        case when nvl(gm_auth_status,'P')='P' then 'Pending' when gm_auth_status='A' then 'Approved' else 'Rejected' end \"txnStatus\", b.status_by \"maker\",\
        c.AUTHORIZE_BY_1 as \"checker\", b.status_dt as \"checkerDate\", a.gm_timestamp \"gmAuthDate\",  a.cmd_timestamp \"cmdAuthDate\", b.narration \"narration\", a.gm_remarks \"gmRemarks\",  a.cmd_remarks \"cmdRemarks\",\
        trans_type \"transType\" , CASE WHEN (SELECT COUNT(*) FROM TRANSFER_TRANS C WHERE a.batch_id=C.batch_id AND A.TRANS_DT=C.TRANS_DT AND C.TRANS_TYPE='CREDIT')>1 THEN 'The batch that you are approving/rejecting has multiple transactions ('|| \
        (SELECT COUNT(*) FROM TRANSFER_TRANS C WHERE a.batch_id=C.batch_id AND A.TRANS_DT=C.TRANS_DT AND C.TRANS_TYPE='CREDIT') ||'). Ensure you have verified them before clicking the confirm button.' ELSE NULL END AS \"transAlert\"	\
		from approval_master a, transfer_trans b,loans_facility_details c  where a.batch_id=b.batch_id and a.trans_dt = b.trans_dt\
        and a.status!='DELETED' and b.status! = 'DELETED' and purpose=:purpose  and trans_type = 'CREDIT' and a.gm_approval_req = 'Y' and b.act_num is not null and gm_auth_status = 'P'and C.ACCT_NUM = B.ACT_NUM and C.authorize_status_1='APPROVAL_PENDING'";
     
    } else if (roleId == enums.RolesEnum.CMD && purpose =='LOAN_CLOSE') {

        query = " select b.trans_id, b.batch_id \"txnId\",substr(b.act_num,1,13) as \"accountNo\",a.amount as \"amount\",b.status_dt \"txnDate\",b.particulars \"txnDescription\",\
        case when nvl(gm_auth_status,'P')='P' then 'Pending' when gm_auth_status='A' then 'Approved' else 'Rejected' end \"txnStatus\", b.status_by \"maker\",\
        c.AUTHORIZE_BY_1 as \"checker\", b.status_dt as \"checkerDate\", a.gm_timestamp \"gmAuthDate\",  a.cmd_timestamp \"cmdAuthDate\", b.narration \"narration\", a.gm_remarks \"gmRemarks\",  a.cmd_remarks \"cmdRemarks\",\
        trans_type \"transType\" , CASE WHEN (SELECT COUNT(*) FROM TRANSFER_TRANS C WHERE a.batch_id=C.batch_id AND A.TRANS_DT=C.TRANS_DT AND C.TRANS_TYPE='CREDIT')>1 THEN 'The batch that you are approving/rejecting has multiple transactions ('|| \
        (SELECT COUNT(*) FROM TRANSFER_TRANS C WHERE a.batch_id=C.batch_id AND A.TRANS_DT=C.TRANS_DT AND C.TRANS_TYPE='CREDIT') ||'). Ensure you have verified them before clicking the confirm button.' ELSE NULL END AS \"transAlert\" \
		from approval_master a, transfer_trans b,loans_facility_details c  where a.batch_id=b.batch_id and a.trans_dt = b.trans_dt\
        and a.status!='DELETED' and b.status! = 'DELETED' and purpose=:purpose  and trans_type = 'CREDIT' and b.act_num is not null and a.cmd_approval_req='Y' and NVL(a.gm_auth_status,'P')='A' and a.cmd_auth_status is null and C.ACCT_NUM = B.ACT_NUM and C.authorize_status_1='APPROVAL_PENDING'";
    
    } else if (roleId == enums.RolesEnum.GM && purpose =='TRANSFER' ){
        
        query = "select b.batch_id \"txnId\", getHdName(b.ac_hd_id) \"debitAccHead\", b.trans_dt \"txnDate\", b.amount as \"transAmt\", b.particulars \"txnDescription\",\
        case when nvl(gm_auth_status,'P')='P' then 'Pending' when gm_auth_status='A' then 'Approved' else 'Rejected' end \"txnStatus\", b.status_by \"maker\",\
        b.authorize_by  \"checker\", b.authorize_dt \"checkerDate\", a.gm_timestamp \"gmAuthDate\",  a.cmd_timestamp \"cmdAuthDate\", b.narration \"narration\", a.gm_remarks \"gmRemarks\",  a.cmd_remarks \"cmdRemarks\"\
		, CASE WHEN (SELECT COUNT(*) FROM TRANSFER_TRANS C WHERE a.batch_id=C.batch_id AND A.TRANS_DT=C.TRANS_DT AND C.TRANS_TYPE='DEBIT')>1 THEN 'The batch that you are approving/rejecting has multiple transactions ('|| \
		(SELECT COUNT(*) FROM TRANSFER_TRANS C WHERE a.batch_id=C.batch_id AND A.TRANS_DT=C.TRANS_DT AND C.TRANS_TYPE='DEBIT') ||'). Ensure you have verified them before clicking the confirm button' ELSE NULL END AS \"transAlert\" \
        from approval_master a, transfer_trans b where a.batch_id=b.batch_id and purpose=:purpose and gm_auth_status = 'P' and a.gm_approval_req = 'Y' and b.AUTHORIZE_STATUS = 'APPROVAL_PENDING' AND b.trans_type = 'DEBIT' AND A.TRANS_DT = B.TRANS_DT";

    } else if (roleId == enums.RolesEnum.CMD && purpose =='TRANSFER'){
        
        query = "select b.batch_id \"txnId\", getHdName(b.ac_hd_id) \"debitAccHead\", b.trans_dt \"txnDate\", b.amount as \"transAmt\", b.particulars \"txnDescription\",\
        case when nvl(gm_auth_status,'P')='P' then 'Pending' when gm_auth_status='A' then 'Approved' else 'Rejected' end \"txnStatus\", b.status_by \"maker\",\
        b.authorize_by  \"checker\", b.authorize_dt \"checkerDate\", a.gm_timestamp \"gmAuthDate\",  a.cmd_timestamp \"cmdAuthDate\", b.narration \"narration\", a.gm_remarks \"gmRemarks\",  a.cmd_remarks \"cmdRemarks\"\
		, CASE WHEN (SELECT COUNT(*) FROM TRANSFER_TRANS C WHERE a.batch_id=C.batch_id AND A.TRANS_DT=C.TRANS_DT AND C.TRANS_TYPE='DEBIT')>1 THEN 'The batch that you are approving/rejecting has multiple transactions ('|| \
		(SELECT COUNT(*) FROM TRANSFER_TRANS C WHERE a.batch_id=C.batch_id AND A.TRANS_DT=C.TRANS_DT AND C.TRANS_TYPE='DEBIT') ||'). Ensure you have verified them before clicking the confirm button.' ELSE NULL END AS \"transAlert\" \
        from approval_master a, transfer_trans b  where a.batch_id=b.batch_id and purpose=:purpose and cmd_approval_req='Y' and nvl(gm_auth_status,'P')='A' and cmd_auth_status is null and b.AUTHORIZE_STATUS = 'APPROVAL_PENDING' AND TRANS_TYPE = 'DEBIT' AND A.TRANS_DT = B.TRANS_DT";
    
    } else if (roleId == enums.RolesEnum.GM && purpose =='DEP_RENEW'){
		
		query="SELECT b.trans_id, b.batch_id as \"txnId\", substr(b.act_num,1,13) as \"accountNo\", b.amount as \"amount\",b.trans_dt as \"txnDate\",\
				case when nvl(gm_auth_status,'P')='P' then 'Pending' when gm_auth_status='A' then 'Approved' else 'Rejected' end as \"txnStatus\", b.status_by as \"maker\",\
				da.authorized_by as \"checker\",  a.remarks AS \"checkerRemarks\", b.status_dt as \"checkerDate\", a.gm_timestamp as \"gmAuthDate\",  a.cmd_timestamp as \"cmdAuthDate\", b.narration as \"narration\", a.gm_remarks as \"gmRemarks\",  a.cmd_remarks as \"cmdRemarks\",\
				trans_type as \"transType\",da.deposit_no as \"depositNumber\", getcustname(da.deposit_no) as \"custName\",\
				getProdName(da.prod_id) as \"scheme\", fngetpandetails(da.cust_id) as \"panNumber\", dsa.deposit_dt as \"depositDt\",\
				da.constitution as \"custType\", dsa.maturity_dt as \"maturityDt\", dsa.DEPOSIT_PERIOD_MM || ' Months' as \"period\",\
				dsa.rate_of_int as \"interestRate\",dsa.deposit_amt as \"depositAmt\", dsa.maturity_amt as \"maturityAmt\", dsa.tot_int_amt as \"totalIntAmt\",\
				a.amount as \"addWithdrawAmount\", rtd.deposit_no as \"newDepNumber\",rtd.renewal_deposit_dt as \"newDepDate\", rtd.renewal_maturity_dt as \"newDepMaturityDate\",\
				rtd.renewal_deposit_amt as \"newDepAmount\",rtd.renewal_maturity_amt as \"newDepMaturityAmount\",rtd.renewal_deposit_months as \"newDepPeriod\", rtd.renewal_tot_intamt as \"newDepIntAmount\"\
				FROM approval_master a, transfer_trans b ,deposit_acinfo da,deposit_sub_acinfo dsa,renewal_temp_details rtd\
				where da.deposit_no = dsa.deposit_no and a.batch_id=b.batch_id \
				and a.trans_dt=b.trans_dt  \
				and da.deposit_no = case when a.remarks='DEP_WITHDRAWAL' then substr(b.LINK_BATCH_ID,1,13) else  substr(b.act_num,1,13)  end \
				and a.status!='DELETED'\
				and b.status!='DELETED' and da.deposit_no = case when a.remarks='DEP_WITHDRAWAL' then rtd.OLD_deposit_no else  rtd.deposit_no  end  \
				AND DSA.AUTHORIZE_STATUS='APPROVAL_PENDING' AND B.ACT_NUM IS NOT NULL\
				and rtd.sl_no =(select max(rd.sl_no) from renewal_temp_details rd where da.deposit_no = case when a.remarks='DEP_WITHDRAWAL' then rd.OLD_deposit_no else rd.deposit_no end ) and purpose=:purpose and trans_type=case when a.remarks='DEP_WITHDRAWAL' then 'DEBIT' else  'CREDIT' end and a.gm_approval_req = 'Y' and gm_auth_status = 'P'\
				UNION ALL \
				SELECT b.trans_id, b.batch_id as \"txnId\", substr(b.act_num,1,13) as \"accountNo\", b.amount as \"amount\",b.trans_dt as \"txnDate\",\
				case when nvl(gm_auth_status,'P')='P' then 'Pending' when gm_auth_status='A' then 'Approved' else 'Rejected' end as \"txnStatus\", b.status_by as \"maker\",\
				da.authorized_by as \"checker\",  a.remarks AS \"checkerRemarks\", b.status_dt as \"checkerDate\", a.gm_timestamp as \"gmAuthDate\",  a.cmd_timestamp as \"cmdAuthDate\", b.narration as \"narration\", a.gm_remarks as \"gmRemarks\",  a.cmd_remarks as \"cmdRemarks\",\
				trans_type as \"transType\",da.deposit_no as \"depositNumber\", getcustname(da.deposit_no) as \"custName\",\
				getProdName(da.prod_id) as \"scheme\", fngetpandetails(da.cust_id) as \"panNumber\", dsa.deposit_dt as \"depositDt\",\
				da.constitution as \"custType\", dsa.maturity_dt as \"maturityDt\", dsa.DEPOSIT_PERIOD_MM || ' Months' as \"period\",\
				dsa.rate_of_int as \"interestRate\",dsa.deposit_amt as \"depositAmt\", dsa.maturity_amt as \"maturityAmt\", dsa.tot_int_amt as \"totalIntAmt\",\
				a.amount as \"addWithdrawAmount\", rtd.deposit_no as \"newDepNumber\",rtd.renewal_deposit_dt as \"newDepDate\", rtd.renewal_maturity_dt as \"newDepMaturityDate\",\
				rtd.renewal_deposit_amt as \"newDepAmount\",rtd.renewal_maturity_amt as \"newDepMaturityAmount\",rtd.renewal_deposit_months as \"newDepPeriod\", rtd.renewal_tot_intamt as \"newDepIntAmount\"\
				FROM approval_master a, advance_transfer_trans b ,deposit_acinfo da,deposit_sub_acinfo dsa,renewal_temp_details rtd\
				where da.deposit_no = dsa.deposit_no and a.batch_id=b.batch_id \
				and a.trans_dt=b.trans_dt\
				and da.deposit_no = case when a.remarks='ADVANCE_DEP_WITHDRAWAL' then substr(b.LINK_BATCH_ID,1,13) else  substr(b.act_num,1,13)  end \
				and a.status!='DELETED'\
				and b.status!='DELETED' and da.deposit_no = case when a.remarks='ADVANCE_DEP_WITHDRAWAL' then rtd.OLD_deposit_no else  rtd.deposit_no  end  \
				AND DSA.AUTHORIZE_STATUS='APPROVAL_PENDING' AND B.ACT_NUM IS NOT NULL\
				and rtd.sl_no =	(select max(rd.sl_no) from renewal_temp_details rd\
				where da.deposit_no = case when a.remarks='ADVANCE_DEP_WITHDRAWAL' then rd.OLD_deposit_no else  rd.deposit_no  end ) and purpose=:purpose and\
				trans_type=case when a.remarks in('ADVANCE_DEP_WITHDRAWAL','MULTIPLE_ADVANCE_DEP_WITHDRAWAL') then 'DEBIT' else  'CREDIT' end \
				and a.gm_approval_req = 'Y' and gm_auth_status = 'P'";
        //commented on 6/2/2020
        /*query = "SELECT b.trans_id, b.batch_id as \"txnId\", substr(b.act_num,1,13) as \"accountNo\", b.amount as \"amount\",b.trans_dt as \"txnDate\",\
		case when nvl(gm_auth_status,'P')='P' then 'Pending' when gm_auth_status='A' then 'Approved' else 'Rejected' end as \"txnStatus\", b.status_by as \"maker\",\
		da.authorized_by as \"checker\",  a.remarks AS \"checkerRemarks\", b.status_dt as \"checkerDate\", a.gm_timestamp as \"gmAuthDate\",  a.cmd_timestamp as \"cmdAuthDate\", b.narration as \"narration\", a.gm_remarks as \"gmRemarks\",  a.cmd_remarks as \"cmdRemarks\",\
		trans_type as \"transType\",da.deposit_no as \"depositNumber\", getcustname(da.deposit_no) as \"custName\",\
		getProdName(da.prod_id) as \"scheme\", fngetpandetails(da.cust_id) as \"panNumber\", dsa.deposit_dt as \"depositDt\",\
		da.constitution as \"custType\", dsa.maturity_dt as \"maturityDt\", dsa.DEPOSIT_PERIOD_MM || ' Months' as \"period\",\
		dsa.rate_of_int as \"interestRate\",dsa.deposit_amt as \"depositAmt\", dsa.maturity_amt as \"maturityAmt\", dsa.tot_int_amt as \"totalIntAmt\",\
		a.amount as \"addWithdrawAmount\", rtd.deposit_no as \"newDepNumber\",rtd.renewal_deposit_dt as \"newDepDate\", rtd.renewal_maturity_dt as \"newDepMaturityDate\",\
		rtd.renewal_deposit_amt as \"newDepAmount\",rtd.renewal_maturity_amt as \"newDepMaturityAmount\",rtd.renewal_deposit_months as \"newDepPeriod\", rtd.renewal_tot_intamt as \"newDepIntAmount\"\
		FROM approval_master a, transfer_trans b ,deposit_acinfo da,deposit_sub_acinfo dsa,renewal_temp_details rtd where da.deposit_no = dsa.deposit_no and a.batch_id=b.batch_id and a.trans_dt=b.trans_dt  and da.deposit_no = substr(b.act_num,1,13) and a.status!='DELETED'\
		and b.status!='DELETED' and da.deposit_no = rtd.old_deposit_no and rtd.sl_no = (select max(a.sl_no) from renewal_temp_details a where a.old_deposit_no = da.deposit_no) and purpose=:purpose and trans_type=case when a.remarks='DEP_WITHDRAWAL' then 'DEBIT' else  'CREDIT' end and a.gm_approval_req = 'Y' and gm_auth_status = 'P'\
		UNION ALL\
		SELECT b.trans_id, b.batch_id as \"txnId\", substr(b.act_num,1,13) as \"accountNo\", b.amount as \"amount\",b.trans_dt as \"txnDate\",\
		case when nvl(gm_auth_status,'P')='P' then 'Pending' when gm_auth_status='A' then 'Approved' else 'Rejected' end as \"txnStatus\", b.status_by as \"maker\",\
		da.authorized_by as \"checker\",  a.remarks AS \"checkerRemarks\", b.status_dt as \"checkerDate\", a.gm_timestamp as \"gmAuthDate\",  a.cmd_timestamp as \"cmdAuthDate\", b.narration as \"narration\", a.gm_remarks as \"gmRemarks\",  a.cmd_remarks as \"cmdRemarks\",\
		trans_type as \"transType\",da.deposit_no as \"depositNumber\", getcustname(da.deposit_no) as \"custName\",\
		getProdName(da.prod_id) as \"scheme\", fngetpandetails(da.cust_id) as \"panNumber\", dsa.deposit_dt as \"depositDt\",\
		da.constitution as \"custType\", dsa.maturity_dt as \"maturityDt\", dsa.DEPOSIT_PERIOD_MM || ' Months' as \"period\",\
		dsa.rate_of_int as \"interestRate\",dsa.deposit_amt as \"depositAmt\", dsa.maturity_amt as \"maturityAmt\", dsa.tot_int_amt as \"totalIntAmt\",\
		a.amount as \"addWithdrawAmount\", rtd.deposit_no as \"newDepNumber\",rtd.renewal_deposit_dt as \"newDepDate\", rtd.renewal_maturity_dt as \"newDepMaturityDate\",\
		rtd.renewal_deposit_amt as \"newDepAmount\",rtd.renewal_maturity_amt as \"newDepMaturityAmount\",rtd.renewal_deposit_months as \"newDepPeriod\", rtd.renewal_tot_intamt as \"newDepIntAmount\"\
		FROM approval_master a, advance_transfer_trans b, deposit_acinfo da,deposit_sub_acinfo dsa,renewal_temp_details rtd  where da.deposit_no = dsa.deposit_no and a.batch_id=b.batch_id and dsa.maturity_dt=b.trans_dt and da.deposit_no = substr(b.act_num,1,13) and a.status!='DELETED'\
		and b.status!='DELETED' and da.deposit_no = rtd.old_deposit_no and rtd.sl_no = (select max(a.sl_no) from renewal_temp_details a where a.old_deposit_no = da.deposit_no) AND\
		purpose=:purpose and trans_type=case when a.remarks='ADVANCE_DEP_WITHDRAWAL' then 'DEBIT' else  'CREDIT' end and a.gm_approval_req = 'Y' and gm_auth_status = 'P'";*/
        
    } else if (roleId == enums.RolesEnum.CMD && purpose == 'DEP_RENEW'){
		
		query="SELECT b.trans_id, b.batch_id as \"txnId\", substr(b.act_num,1,13) as \"accountNo\", b.amount as \"amount\",b.trans_dt as \"txnDate\",\
				case when nvl(gm_auth_status,'P')='P' then 'Pending' when gm_auth_status='A' then 'Approved' else 'Rejected' end as \"txnStatus\", b.status_by as \"maker\",\
				da.authorized_by as \"checker\",  a.remarks AS \"checkerRemarks\", b.status_dt as \"checkerDate\", a.gm_timestamp as \"gmAuthDate\",  a.cmd_timestamp as \"cmdAuthDate\", b.narration as \"narration\", a.gm_remarks as \"gmRemarks\",  a.cmd_remarks as \"cmdRemarks\",\
				trans_type as \"transType\",da.deposit_no as \"depositNumber\", getcustname(da.deposit_no) as \"custName\",\
				getProdName(da.prod_id) as \"scheme\", fngetpandetails(da.cust_id) as \"panNumber\", dsa.deposit_dt as \"depositDt\",\
				da.constitution as \"custType\", dsa.maturity_dt as \"maturityDt\", dsa.DEPOSIT_PERIOD_MM || ' Months' as \"period\",\
				dsa.rate_of_int as \"interestRate\",dsa.deposit_amt as \"depositAmt\", dsa.maturity_amt as \"maturityAmt\", dsa.tot_int_amt as \"totalIntAmt\",\
				a.amount as \"addWithdrawAmount\", rtd.deposit_no as \"newDepNumber\",rtd.renewal_deposit_dt as \"newDepDate\", rtd.renewal_maturity_dt as \"newDepMaturityDate\",\
				rtd.renewal_deposit_amt as \"newDepAmount\",rtd.renewal_maturity_amt as \"newDepMaturityAmount\",rtd.renewal_deposit_months as \"newDepPeriod\", rtd.renewal_tot_intamt as \"newDepIntAmount\"\
				FROM approval_master a, transfer_trans b ,deposit_acinfo da,deposit_sub_acinfo dsa,renewal_temp_details rtd\
				where da.deposit_no = dsa.deposit_no and a.batch_id=b.batch_id \
				and a.trans_dt=b.trans_dt  \
				and da.deposit_no = case when a.remarks='DEP_WITHDRAWAL' then substr(b.LINK_BATCH_ID,1,13) else  substr(b.act_num,1,13)  end \
				and a.status!='DELETED'\
				and b.status!='DELETED' and da.deposit_no = case when a.remarks='DEP_WITHDRAWAL' then rtd.OLD_deposit_no else  rtd.deposit_no  end  \
				AND DSA.AUTHORIZE_STATUS='APPROVAL_PENDING' AND B.ACT_NUM IS NOT NULL\
				and rtd.sl_no =(select max(rd.sl_no) from renewal_temp_details rd where da.deposit_no = case when a.remarks='DEP_WITHDRAWAL' then rd.OLD_deposit_no else rd.deposit_no end ) and purpose=:purpose and trans_type=case when a.remarks='DEP_WITHDRAWAL' then 'DEBIT' else  'CREDIT' end and a.cmd_approval_req='Y' and NVL(a.gm_auth_status,'P')='A' and a.cmd_auth_status is null\
				UNION ALL \
				SELECT b.trans_id, b.batch_id as \"txnId\", substr(b.act_num,1,13) as \"accountNo\", b.amount as \"amount\",b.trans_dt as \"txnDate\",\
				case when nvl(gm_auth_status,'P')='P' then 'Pending' when gm_auth_status='A' then 'Approved' else 'Rejected' end as \"txnStatus\", b.status_by as \"maker\",\
				da.authorized_by as \"checker\",  a.remarks AS \"checkerRemarks\", b.status_dt as \"checkerDate\", a.gm_timestamp as \"gmAuthDate\",  a.cmd_timestamp as \"cmdAuthDate\", b.narration as \"narration\", a.gm_remarks as \"gmRemarks\",  a.cmd_remarks as \"cmdRemarks\",\
				trans_type as \"transType\",da.deposit_no as \"depositNumber\", getcustname(da.deposit_no) as \"custName\",\
				getProdName(da.prod_id) as \"scheme\", fngetpandetails(da.cust_id) as \"panNumber\", dsa.deposit_dt as \"depositDt\",\
				da.constitution as \"custType\", dsa.maturity_dt as \"maturityDt\", dsa.DEPOSIT_PERIOD_MM || ' Months' as \"period\",\
				dsa.rate_of_int as \"interestRate\",dsa.deposit_amt as \"depositAmt\", dsa.maturity_amt as \"maturityAmt\", dsa.tot_int_amt as \"totalIntAmt\",\
				a.amount as \"addWithdrawAmount\", rtd.deposit_no as \"newDepNumber\",rtd.renewal_deposit_dt as \"newDepDate\", rtd.renewal_maturity_dt as \"newDepMaturityDate\",\
				rtd.renewal_deposit_amt as \"newDepAmount\",rtd.renewal_maturity_amt as \"newDepMaturityAmount\",rtd.renewal_deposit_months as \"newDepPeriod\", rtd.renewal_tot_intamt as \"newDepIntAmount\"\
				FROM approval_master a, advance_transfer_trans b ,deposit_acinfo da,deposit_sub_acinfo dsa,renewal_temp_details rtd\
				where da.deposit_no = dsa.deposit_no and a.batch_id=b.batch_id \
				and a.trans_dt=b.trans_dt\
				and da.deposit_no = case when a.remarks='ADVANCE_DEP_WITHDRAWAL' then substr(b.LINK_BATCH_ID,1,13) else  substr(b.act_num,1,13)  end \
				and a.status!='DELETED'\
				and b.status!='DELETED' and da.deposit_no = case when a.remarks='ADVANCE_DEP_WITHDRAWAL' then rtd.OLD_deposit_no else  rtd.deposit_no  end  \
				AND DSA.AUTHORIZE_STATUS='APPROVAL_PENDING' AND B.ACT_NUM IS NOT NULL\
				and rtd.sl_no =	(select max(rd.sl_no) from renewal_temp_details rd\
				where da.deposit_no = case when a.remarks='ADVANCE_DEP_WITHDRAWAL' then rd.OLD_deposit_no else  rd.deposit_no  end ) and purpose=:purpose and\
				trans_type=case when a.remarks in('ADVANCE_DEP_WITHDRAWAL','MULTIPLE_ADVANCE_DEP_WITHDRAWAL') then 'DEBIT' else  'CREDIT' end \
				and a.cmd_approval_req='Y' and NVL(a.gm_auth_status,'P')='A' and a.cmd_auth_status is null";

        /*query = "SELECT b.trans_id, b.batch_id as \"txnId\", substr(b.act_num,1,13) as \"accountNo\", b.amount as \"amount\",b.trans_dt as \"txnDate\",\
        case when nvl(gm_auth_status,'P')='P' then 'Pending' when gm_auth_status='A' then 'Approved' else 'Rejected' end as \"txnStatus\", b.status_by as \"maker\",\
        da.authorized_by as \"checker\", a.remarks AS \"checkerRemarks\", b.status_dt as \"checkerDate\", a.gm_timestamp as \"gmAuthDate\",  a.cmd_timestamp as \"cmdAuthDate\", b.narration as \"narration\", a.gm_remarks as \"gmRemarks\",  a.cmd_remarks as \"cmdRemarks\",\
        trans_type as \"transType\",da.deposit_no as \"depositNumber\", getcustname(da.deposit_no) as \"custName\",\
        getProdName(da.prod_id) as \"scheme\", fngetpandetails(da.cust_id) as \"panNumber\", dsa.deposit_dt as \"depositDt\",\
        da.constitution as \"custType\", dsa.maturity_dt as \"maturityDt\", dsa.DEPOSIT_PERIOD_MM || ' Months' as \"period\",\
        dsa.rate_of_int as \"interestRate\",dsa.deposit_amt as \"depositAmt\", dsa.maturity_amt as \"maturityAmt\", dsa.tot_int_amt as \"totalIntAmt\",\
        a.amount as \"addWithdrawAmount\", rtd.deposit_no as \"newDepNumber\",rtd.renewal_deposit_dt as \"newDepDate\", rtd.renewal_maturity_dt as \"newDepMaturityDate\",\
		rtd.renewal_deposit_amt as \"newDepAmount\",rtd.renewal_maturity_amt as \"newDepMaturityAmount\",rtd.renewal_deposit_months as \"newDepPeriod\", rtd.renewal_tot_intamt as \"newDepIntAmount\"\
		FROM approval_master a, transfer_trans b ,deposit_acinfo da,deposit_sub_acinfo dsa, renewal_temp_details rtd where da.deposit_no = dsa.deposit_no and a.batch_id=b.batch_id and a.trans_dt=b.trans_dt  and da.deposit_no = substr(b.act_num,1,13) and a.status!='DELETED'\
        and b.status!='DELETED' and da.deposit_no = rtd.old_deposit_no and rtd.sl_no = (select max(a.sl_no) from renewal_temp_details a where a.old_deposit_no = da.deposit_no) and purpose=:purpose and trans_type=case when a.remarks='DEP_WITHDRAWAL' then 'DEBIT' else  'CREDIT' end and a.cmd_approval_req='Y' and NVL(a.gm_auth_status,'P')='A' and a.cmd_auth_status is null\
        UNION ALL\
        SELECT b.trans_id, b.batch_id as \"txnId\", substr(b.act_num,1,13) as \"accountNo\", b.amount as \"amount\",b.trans_dt as \"txnDate\",\
        case when nvl(gm_auth_status,'P')='P' then 'Pending' when gm_auth_status='A' then 'Approved' else 'Rejected' end as \"txnStatus\", b.status_by as \"maker\",\
        da.authorized_by as \"checker\",  a.remarks AS \"checkerRemarks\", b.status_dt as \"checkerDate\", a.gm_timestamp as \"gmAuthDate\",  a.cmd_timestamp as \"cmdAuthDate\", b.narration as \"narration\", a.gm_remarks as \"gmRemarks\",  a.cmd_remarks as \"cmdRemarks\",\
        trans_type as \"transType\",da.deposit_no as \"depositNumber\", getcustname(da.deposit_no) as \"custName\",\
        getProdName(da.prod_id) as \"scheme\", fngetpandetails(da.cust_id) as \"panNumber\", dsa.deposit_dt as \"depositDt\",\
        da.constitution as \"custType\", dsa.maturity_dt as \"maturityDt\", dsa.DEPOSIT_PERIOD_MM || ' Months' as \"period\",\
        dsa.rate_of_int as \"interestRate\",dsa.deposit_amt as \"depositAmt\", dsa.maturity_amt as \"maturityAmt\", dsa.tot_int_amt as \"totalIntAmt\",\
        a.amount as \"addWithdrawAmount\", rtd.deposit_no as \"newDepNumber\",rtd.renewal_deposit_dt as \"newDepDate\", rtd.renewal_maturity_dt as \"newDepMaturityDate\",\
		rtd.renewal_deposit_amt as \"newDepAmount\",rtd.renewal_maturity_amt as \"newDepMaturityAmount\",rtd.renewal_deposit_months as \"newDepPeriod\", rtd.renewal_tot_intamt as \"newDepIntAmount\"\
		FROM approval_master a, advance_transfer_trans b, deposit_acinfo da,deposit_sub_acinfo dsa,renewal_temp_details rtd where da.deposit_no = dsa.deposit_no and a.batch_id=b.batch_id and dsa.maturity_dt=b.trans_dt and da.deposit_no = substr(b.act_num,1,13) and a.status!='DELETED'\
        and b.status!='DELETED' and da.deposit_no = rtd.old_deposit_no and rtd.sl_no = (select max(a.sl_no) from renewal_temp_details a where a.old_deposit_no = da.deposit_no) and\
        purpose=:purpose and trans_type=case when a.remarks='ADVANCE_DEP_WITHDRAWAL' then 'DEBIT' else  'CREDIT' end and a.cmd_approval_req='Y' and NVL(a.gm_auth_status,'P')='A' and a.cmd_auth_status is null";*/

    }
 	
    db.sequelize.query(query,{replacements: {purpose: purpose },type: sequelize.QueryTypes.SELECT}
    ).then(results => {
		console.log("results=="+JSON.stringify(results));
		/*if (purpose == 'LOAN_OPEN'){
			for (var i=0; i<results.length;i++){				
			results[i].txnDate = moment(results[i].txnDate).format('DD-MMM-YYYY');
			}
		}*/
        return res.status(200).send({ data: results, message: "Success" });
    }).catch(err => { res.status(500).send({ data: null, message: err.message }); });
}

exports.getTransactionDetail = (req, res) => {
    var accountNumber = req.body.accountNumber;
    var transactionType = req.body.transactionType;
    if (!accountNumber) {
        return res.status(400).send({ data: null, message: "Account Number should not be null or empty" });
    }

    // get data from DB.
    var query = "";
	query = "select a.deposit_no as \"depositNumber\", getcustname(a.deposit_no) as \"custName\", getProdName(prod_id) as \"scheme\",\
	fngetpandetails(a.cust_id) as \"panNumber\", deposit_dt as \"depositDt\",constitution as \"custType\", maturity_dt as \"maturityDt\",\
	DEPOSIT_PERIOD_MM || ' Months' as \"period\", rate_of_int as \"interestRate\",deposit_amt as \"depositAmt\", maturity_amt as \"maturityAmt\",\
	tot_int_amt as \"totalIntAmt\" from deposit_acinfo a join deposit_sub_acinfo b on a.deposit_no = b.deposit_no where a.deposit_no = :accountNumber \
	and a.authorize_status = 'APPROVAL_PENDING' and b.authorize_status = 'APPROVAL_PENDING'";
    db.sequelize.query(query,
        { replacements: { accountNumber: accountNumber },type: sequelize.QueryTypes.SELECT }
    ).then(results => {
        return res.status(200).send({ data: results, message: "Success" });
    }).catch(err => { res.status(500).send({ data: null, message: err.message }); });
}


exports.updateTransactionStatus = (req, res) => {
    return res.status(200).send({ data: null, message: "Success" });
}