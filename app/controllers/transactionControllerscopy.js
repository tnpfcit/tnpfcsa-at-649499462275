var config = require('../config/config.json');
const db = require('../config/db.js');
const sequelize = require('sequelize');
const enums = require('../helpers/enums');

exports.getTransactions = (req, res) => {
    var roleId = req.body.roleId;
    var transactionType = req.body.transactionType;
	var purpose = req.body.purpose;
	console.log(purpose);
    if (!roleId) {
        return res.status(400).send({ data: null, message: "roleId should not be null or empty" });
    }
    if (!transactionType) {
        return res.status(400).send({ data: null, message: "transactionType should not be null or empty" });
    }

    // get data from DB.
    var query = "";
    if (roleId == enums.RolesEnum.GM && purpose !='LOAN_OPEN') {
		
		query="select substr(b.act_num,1,13) AS \"accountNo\", a.batch_id AS \"txnId\", a.trans_dt AS \"txnDate\", b.particulars AS \"txnDescription\", a.cmd_approval_req AS \"cmdApprovalReq\",\
		case when nvl(a.gm_auth_status,'P')='P' then 'Pending' when a.gm_auth_status='A' then 'Approved' else 'Rejected' end AS \"txnStatus\", da.status_by AS \"maker\", \
        da.authorized_by AS \"checker\",  da.authorized_dt AS \"checkerDate\", a.gm_timestamp AS \"gmAuthDate\",  a.cmd_timestamp AS \"cmdAuthDate\", a.remarks AS \"checkerRemarks\",\
        a.gm_remarks AS \"gmRemarks\",  a.cmd_remarks AS \"cmdRemarks\", trans_type AS \"transactionType\",da.deposit_no as \"depositNumber\", getcustname(da.deposit_no) as \"custName\", \
        getProdName(da.prod_id) as \"scheme\", fngetpandetails(da.cust_id) as \"panNumber\", dsa.deposit_dt as \"depositDt\",da.constitution as \"custType\", dsa.maturity_dt as \"maturityDt\", \
        dsa.DEPOSIT_PERIOD_MM || 'Months' as \"period\", dsa.rate_of_int as \"interestRate\",dsa.deposit_amt as \"depositAmt\", dsa.maturity_amt as \"maturityAmt\", dsa.tot_int_amt as \"totalIntAmt\"\
        from approval_master a join transfer_trans b on a.batch_id=b.batch_id \
        join deposit_acinfo da on a.act_num = da.deposit_no and da.authorize_status = 'APPROVAL_PENDING'\
        join deposit_sub_acinfo dsa on a.act_num = dsa.deposit_no and dsa.authorize_status = 'APPROVAL_PENDING'\
        where a.purpose=:purpose and a.gm_auth_status = 'P' and TRANS_TYPE = 'CREDIT'";
         
    } else if (roleId == enums.RolesEnum.CMD && purpose !='LOAN_OPEN'){
		query= "select substr(B.act_num,1,13) AS \"accountNo\", a.batch_id AS \"txnId\", a.trans_dt AS \"txnDate\", b.particulars AS \"txnDescription\",a.cmd_approval_req AS \"cmdApprovalReq\"\
        case when nvl(a.cmd_auth_status,'P')='P' then 'Pending' when a.cmd_auth_status='A' then 'Approved' else 'Rejected' end AS \"txnStatus\", \
		da.status_by AS \"maker\",da.authorized_by  AS \"checker\", da.authorized_dt AS \"checkerDate\", a.gm_timestamp AS \"gmAuthDate\", \
		a.cmd_timestamp AS \"cmdAuthDate\", a.remarks AS \"checkerRemarks\",a.gm_remarks AS \"gmRemarks\",  a.cmd_remarks AS \"cmdRemarks\",\
		trans_type AS \"transactionType\",da.deposit_no as \"depositNumber\", getcustname(da.deposit_no) as \"custName\", \
        getProdName(da.prod_id) as \"scheme\", fngetpandetails(da.cust_id) as \"panNumber\", dsa.deposit_dt as \"depositDt\",\
		da.constitution as \"custType\", dsa.maturity_dt as \"maturityDt\", dsa.DEPOSIT_PERIOD_MM || ' Months' as \"period\", \
		dsa.rate_of_int as \"interestRate\",dsa.deposit_amt as \"depositAmt\", dsa.maturity_amt as \"maturityAmt\", dsa.tot_int_amt as \"totalIntAmt\" \
        from approval_master a join transfer_trans b on a.batch_id=b.batch_id \
        join deposit_acinfo da on a.act_num = da.deposit_no and da.authorize_status = 'APPROVAL_PENDING'\
        join deposit_sub_acinfo dsa on a.act_num = dsa.deposit_no and dsa.authorize_status = 'APPROVAL_PENDING'\
        where a.purpose=:purpose and a.cmd_approval_req='Y' and NVL(a.gm_auth_status,'P')='A' and a.cmd_auth_status is null  and TRANS_TYPE = 'CREDIT'";
		
    } else if (roleId == enums.RolesEnum.GM && purpose =='LOAN_OPEN') {
		query = "";
	} else if (roleId == enums.RolesEnum.CMD && purpose =='LOAN_OPEN'){
		query = "";
	}
 	
    db.sequelize.query(query,
        //{ type: sequelize.QueryTypes.SELECT }
		{replacements: {purpose: purpose },type: sequelize.QueryTypes.SELECT}
    ).then(results => {
        return res.status(200).send({ data: results, message: "Success" });
    }).catch(err => { res.status(500).send({ data: null, message: err.message }); });
}

exports.getTransactionDetail = (req, res) => {
    var accountNumber = req.body.accountNumber;
    var transactionType = req.body.transactionType;
    if (!accountNumber) {
        return res.status(400).send({ data: null, message: "accountNumber should not be null or empty" });
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