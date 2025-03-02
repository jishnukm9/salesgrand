from core.models import Ledger, CashBook, CoASubAccounts,GeneralLedger,AccountLedger
from . import coa
from datetime import date,datetime
from django.utils import timezone
from django.db.models import F, Q

# date_today = date.today()
date_today = timezone.now().date()



class AccountStatement():
    def add_ledger(self, type, params):
        print ("type identified %s", type)

        ledger = Ledger()
        if type == "Purchase":


            print("params",params)

            try:
                totalbillingamount = round(params["totalbillingamount"],2)
            except:
                totalbillingamount = params["totalbillingamount"]

            try:
                amount_received = round(params["amountrecieved"],2)
            except:
                amount_received  = params["amountrecieved"]

            try:
                due_balance = round(params['duebalance'],2)
            except:
                due_balance = params['duebalance']

            ledger.refernceno    = params["invoicenumber"]
            ledger.date          = params['invoicedate']
            ledger.narration     = "Purchase Transaction"
            ledger.debit_amount  = totalbillingamount
            ledger.credit_amount = 0 
            ledger.account_subhead = "Purchase"
            ledger.account_type  = coa.EXPENSE["account_type"]
            ledger.account_head  = coa.EXPENSE["name"]
            ledger.customer_or_vendor = params["customer_or_vendor"]
            ledger.branch             = str(params["userbranch"])
            ledger.pk = None
            ledger.save()
             
            ledger.credit_amount = amount_received 
            ledger.debit_amount  = 0
            ledger.account_type  = coa.ASSET["account_type"]
            ledger.account_head  = coa.ASSET["name"]
            # ledger.account_subhead  = "Cash"
            ledger.account_subhead  = params['paymentmode']
            ledger.pk = None
            ledger.save()

            if params['duebalance'] != 0:
                ledger.debit_amount  = 0 
                ledger.credit_amount = due_balance
                ledger.account_type = coa.LIABILITY["account_type"]
                ledger.account_head = coa.LIABILITY["name"]
                ledger.account_subhead = "Supplier"
                ledger.pk = None
                ledger.save()

        elif type == "PurchaseDue":


            try:
                amount_received = round(params["amountreceived"],2)
            except:
                amount_received  = params["amountreceived"]


            ledger.refernceno = params['invoicenumber']
            ledger.date = timezone.now().date()
            ledger.narration = "Purchase Credit Transaction"
            ledger.account_type = "DEBIT" # because liability is decreasing
            ledger.debit_amount = amount_received
            ledger.credit_amount = 0
            ledger.account_head = coa.LIABILITY["name"]
            ledger.account_subhead = "Supplier"
            ledger.customer_or_vendor = params["customer_or_vendor"]
            ledger.branch = params['userbranch']
            ledger.pk = None
            ledger.save()

            ledger.account_type = "CREDIT" # because cash is reducing as we are paying to the vendor
            ledger.debit_amount = 0 
            ledger.credit_amount = amount_received
            ledger.account_head = coa.ASSET["name"]
            # ledger.account_subhead = "Cash"
            ledger.account_subhead  = params['paymentmode']
            ledger.pk = None
            ledger.save()

        elif type == "Sale":

            try:
                amount_received = round(params["amountrecieved"],2)
            except:
                amount_received  = params["amountrecieved"]

            try:
                total_amount  = round(params['totalamount'],2)
            except:
                total_amount  = params['totalamount']

            try:
                due_balance = round(params['duebalance'],2)
            except:
                due_balance = params['duebalance']


            ledger.refernceno = params['invoicenumber']
            ledger.date = params['invoicedate']
            ledger.narration = "Sale Transaction"
            ledger.account_type = coa.INCOME["account_type"]
            ledger.debit_amount = 0
            ledger.credit_amount = total_amount
            ledger.account_head = coa.INCOME["name"]
            ledger.account_subhead = "Sale"
            ledger.customer_or_vendor = params['customer_or_vendor']
            ledger.branch = params['userbranch']
            ledger.pk = None
            ledger.save()

            ledger.account_type = coa.ASSET["account_type"]
            ledger.debit_amount = amount_received
            ledger.credit_amount = 0 
            ledger.account_head = coa.ASSET["name"]
            # ledger.account_subhead = "Cash"
            ledger.account_subhead  = params['paymentmode']
            ledger.pk = None
            ledger.save()

            if params['duebalance'] != 0:
                ledger.account_type = coa.ASSET["account_type"]
                ledger.debit_amount = due_balance
                ledger.credit_amount = 0
                ledger.account_head = coa.ASSET["name"]
                ledger.account_subhead = "Customer" 
                ledger.pk = None
                ledger.save()
        elif type == "SaleDue":

            try:
                amount_received = round(params['amountrecieved'],2)
            except:
                amount_received = params['amountrecieved']


            ledger.refernceno = params['invoicenumber']
            ledger.date = timezone.now().date()
            ledger.narration = "Sale Credit Transaction"
            ledger.account_type = coa.ASSET["account_type"]
            ledger.debit_amount = 0
            ledger.credit_amount = amount_received
            ledger.account_head = coa.ASSET["name"]
            ledger.account_subhead = "Customer"
            ledger.customer_or_vendor = params['customer_or_vendor']
            ledger.branch = params['userbranch']
            ledger.pk = None
            ledger.save()

            ledger.account_type = "DEBIT" # because cash is increasing
            ledger.debit_amount = amount_received
            ledger.credit_amount = 0
            # ledger.account_subhead = "Cash"
            ledger.account_subhead  = params['paymentmode']
            ledger.pk = None
            ledger.save()


        elif type == "PurchaseReturn":

            try:
                net_total = round(params['nettotal'],2)
            except:
                net_total  = params['nettotal']

            ledger.refernceno = params['returnid']
            ledger.date = timezone.now().date()
            ledger.narration = "Purchase Return Transaction"
            ledger.account_type = coa.EXPENSE['account_type']
            ledger.debit_amount = 0
            ledger.credit_amount = net_total
            ledger.account_head = coa.EXPENSE["name"]
            ledger.account_subhead = "Purchase"
            ledger.customer_or_vendor = params['customer_or_vendor']
            ledger.branch = params['userbranch']
            ledger.pk = None
            ledger.save()

            ledger.debit_amount = net_total
            ledger.credit_amount = 0
            # ledger.account_subhead = "Cash"
            ledger.account_subhead  = params['paymentmode']
            ledger.pk = None
            ledger.save()

        elif type == "Expense":

            try:
                amount = round(params['amount'],2)
            except:
                amount  = params['amount']


            ledger.refernceno = params['expenseid']
            ledger.date = params['date']
            ledger.narration = "Expense Transaction"
            ledger.account_type = coa.EXPENSE["account_type"]
            ledger.debit_amount = amount
            ledger.credit_amount = 0 
            ledger.account_head = coa.EXPENSE["name"]
            ledger.account_subhead = "Expense"
            ledger.customer_or_vendor = "NA"
            ledger.branch = params['userbranch']
            ledger.pk = None
            ledger.save()

            ledger.debit_amount = 0
            ledger.credit_amount = amount
            ledger.account_head = coa.ASSET["name"]
            # ledger.account_subhead = "Cash"
            ledger.account_subhead  = params['paymentmode']

            ledger.pk = None
            ledger.save()
        elif type == "SaleReturn":

            try:
                amount = round(params['amount'],2)
            except:
                amount  = params['amount']


            ledger.refernceno = params['salereturnid']
            ledger.date = timezone.now().date()
            ledger.narration = "Sale Return Transaction"
            ledger.account_type = coa.INCOME["account_type"]
            ledger.debit_amount = params['amount']
            ledger.credit_amount = 0
            ledger.account_head = coa.INCOME["name"]
            ledger.account_subhead = "Sale"
            ledger.customer_or_vendor = params['customer_or_vendor']
            ledger.branch = params['userbranch']
            ledger.pk = None
            ledger.save()

            ledger.account_type = coa.ASSET["account_type"]
            ledger.debit_amount = 0
            ledger.credit_amount = params['amount']
            ledger.account_head = coa.ASSET["name"]
            # ledger.account_subhead = "Cash"
            ledger.account_subhead  = params['paymentmode']
            ledger.pk = None
            ledger.save()
        elif type == "ServiceEntry":

            try:
                total_amount  = round(params['totalamount'],2)
            except:
                total_amount  = params['totalamount']

            try:
                amount_received = params['amountrecieved']
            except:
                amount_received = params['amountrecieved']

            try:
                due_balance = round(params['duebalance'],2)
            except:
                due_balance = params['duebalance']

            # Currently service entry transaction is recorded in the ledger.
            ledger.refernceno = params['invoicenumber']
            ledger.date = params['invoicedate']
            ledger.narration = "Service Entry Transaction"
            ledger.account_type = coa.INCOME["account_type"]
            ledger.debit_amount = 0
            ledger.credit_amount = total_amount 
            ledger.account_head = coa.INCOME["name"]
            ledger.account_subhead = "Service"
            ledger.customer_or_vendor = params['customer_or_vendor']
            ledger.branch = params['userbranch']
            ledger.pk = None
            ledger.save()

            ledger.account_type = coa.ASSET["account_type"]
            ledger.debit_amount = amount_received
            ledger.credit_amount = 0 
            ledger.account_head = coa.ASSET["name"]
            # ledger.account_subhead = "Cash"
            ledger.account_subhead  = params['paymentmode']
            ledger.pk = None
            ledger.save()

            if params['duebalance'] != 0:
                ledger.account_type = coa.ASSET["account_type"]
                ledger.debit_amount = due_balance
                ledger.credit_amount = 0
                ledger.account_head = coa.ASSET["name"]
                ledger.account_subhead = "Customer" 
                ledger.pk = None
                ledger.save()
        elif type == "ServiceCheckout":

            try:
                total_amount  = round(params['totalamount'],2)
            except:
                total_amount  = params['totalamount']

            try:
                amount_received  = round(params['amountrecieved'],2)
            except:
                amount_received  = params['amountrecieved']

            try:
                previous_received   = round(params['previousreceived'],2)
            except:
                previous_received  = params['previousreceived']

            # Adjust the Service entry during the checkout because the tax and spare added
            adjustLedger = Ledger.objects.filter(refernceno=params['invoicenumber'])
            advanceamount = 0
            balanceamount = 0
            for item in adjustLedger:
                if item.narration == 'Service Entry Transaction' and item.account_subhead == 'Service':
                    item.credit_amount = total_amount
                # ledger cash bank card upi saving 28-11-2024
                # if item.narration == 'Service Entry Transaction' and item.account_subhead == 'Cash':
                #     advanceamount = item.debit_amount
                if item.narration == 'Service Entry Transaction' and (item.account_subhead == 'Cash' or item.account_subhead == 'Bank' or item.account_subhead == 'Card' or item.account_subhead == 'UPI'): 
                    advanceamount = item.debit_amount
                if item.narration == 'Service Entry Transaction' and item.account_subhead == 'Customer':
                    balanceamount = total_amount - advanceamount
                    item.debit_amount = balanceamount
                item.save()

            cashpaid = amount_received - previous_received 

            ledger.refernceno = params['invoicenumber']
            ledger.date = params['invoicedate']
            ledger.narration = "Service Checkout Transaction"
            ledger.account_type = coa.ASSET["account_type"]
            ledger.debit_amount = 0
            ledger.credit_amount = cashpaid
            ledger.account_head = coa.ASSET["name"]
            ledger.account_subhead = "Customer"
            ledger.customer_or_vendor = params['customer_or_vendor']
            ledger.branch = params['userbranch']
            ledger.pk = None
            ledger.save()

            ledger.account_type = coa.ASSET["account_type"]
            ledger.debit_amount = cashpaid
            ledger.credit_amount = 0 
            ledger.account_head = coa.ASSET["name"]
            ledger.account_subhead  = params['paymentmode']
            ledger.pk = None
            ledger.save()

        elif type == "Payment":

            try:
                amount = round(params['amount'],2)
            except:
                amount  = params['amount']

            ledger.refernceno = params['id']
            ledger.date = params['date']
            ledger.narration = params['narration']
            ledger.account_type = "NA"  # its NA because debit and credit will be entered by user
            ledger.debit_amount = amount
            ledger.credit_amount = 0 
            ledger.account_head = params['debitac']
            ledger.account_subhead = params['debitac']
            ledger.customer_or_vendor = "NA"
            ledger.branch = params['userbranch']
            ledger.pk = None
            ledger.save()

            ledger.debit_amount = 0
            ledger.credit_amount = amount
            ledger.account_head = params['creditac']
            # ledger.account_subhead = params['creditac']
            ledger.account_subhead = params['paymentmode']

            ledger.pk = None
            ledger.save()


        elif type == "Receipt":

            try:
                amount = round(params['amount'],2)
            except:
                amount  = params['amount']

            ledger.refernceno = params['id']
            ledger.date = timezone.now().date()
            ledger.narration = params['narration']
            ledger.account_type = 'NA'
            ledger.debit_amount = 0
            ledger.credit_amount = amount
            ledger.account_head = params['creditac']
            ledger.account_subhead = params['creditac']
            ledger.customer_or_vendor = "NA"
            ledger.branch = params['userbranch']
            ledger.pk = None
            ledger.save()

            ledger.account_type = 'NA'
            ledger.debit_amount = amount
            ledger.credit_amount = 0
            ledger.account_head = params['debitac']
            # ledger.account_subhead = params['debitac']
            ledger.account_subhead = params['paymentmode']
            ledger.pk = None
            ledger.save()

        elif type == "Journal":

            try:
                amount = round(params['amount'],2)
            except:
                amount  = params['amount']

            ledger.refernceno = params['id']
            ledger.date = timezone.now().date()
            ledger.narration = params['narration']
            ledger.account_type = 'NA'
            ledger.debit_amount = 0
            ledger.credit_amount = amount
            ledger.account_head = params['creditac']
            ledger.account_subhead = params['creditac']
            ledger.customer_or_vendor = "NA"
            ledger.branch = params['userbranch']
            ledger.pk = None
            ledger.save()

            ledger.account_type = 'NA'
            ledger.debit_amount = amount
            ledger.credit_amount = 0
            ledger.account_head = params['debitac']
            ledger.account_subhead = params['debitac']
            ledger.pk = None
            ledger.save()
        elif type == "SingleLedger":

            try:
                amount = round(params['amount'],2)
            except:
                amount  = params['amount']


            # Only single entry is required for single ledger
            ledger.refernceno = "Single Ledger"
            ledger.date = params['ledger_date']
            ledger.narration = params['narration']
            ledger.account_type = 'NA'
            if params['account_type'] == "Dr":
                ledger.debit_amount = amount
                ledger.credit_amount = 0
            else:
                ledger.credit_amount = amount
                ledger.debit_amount = 0 
            ledger.account_head = "NA"
            ledger.account_subhead = params['account_head']
            ledger.customer_or_vendor = "NA"
            ledger.branch = params['userbranch']
            ledger.save()

    def add_generalledger(self, type, params):
        

        
        cash_subledger = CoASubAccounts.objects.filter(Q(title="Cash") & Q(is_adminonly=True)).first()
        if not cash_subledger:
            data = CoASubAccounts()
            ledgername = "CASH ACCOUNT"
            ledgerobj = AccountLedger.objects.filter(name=ledgername).first()
            title = f"Cash"
            data.head_root = ledgerobj
            gstring = ledgername.replace(" ", "_")
            data.gstring = gstring
            data.title = title
            data.branch = params["userbranch"]
            data.description = title
            data.is_adminonly = True
            data.save()

            cash_subledger = CoASubAccounts.objects.filter(Q(title="Cash") & Q(is_adminonly=True)).first()
            cash_ledger = cash_subledger.head_root
        else:
            cash_ledger = cash_subledger.head_root


        bank_subledger = CoASubAccounts.objects.filter(Q(title="Bank") & Q(is_adminonly=True)).first()
        if not bank_subledger:
            data = CoASubAccounts()
            ledgername = "CASH ACCOUNT"
            ledgerobj = AccountLedger.objects.filter(name=ledgername).first()
            title = f"Bank"
            data.head_root = ledgerobj
            gstring = ledgername.replace(" ", "_")
            data.gstring = gstring
            data.title = title
            data.branch = params["userbranch"]
            data.description = title
            data.is_adminonly = True
            data.save()

            bank_subledger = CoASubAccounts.objects.filter(Q(title="Bank") & Q(is_adminonly=True)).first()
            bank_ledger = bank_subledger.head_root
        else:
            bank_ledger = bank_subledger.head_root


        upi_subledger = CoASubAccounts.objects.filter(Q(title="UPI") & Q(is_adminonly=True)).first()
        if not upi_subledger:
            data = CoASubAccounts()
            ledgername = "CASH ACCOUNT"
            ledgerobj = AccountLedger.objects.filter(name=ledgername).first()
            title = f"UPI"
            data.head_root = ledgerobj
            gstring = ledgername.replace(" ", "_")
            data.gstring = gstring
            data.title = title
            data.branch = params["userbranch"]
            data.description = title
            data.is_adminonly = True
            data.save()

            upi_subledger = CoASubAccounts.objects.filter(Q(title="UPI") & Q(is_adminonly=True)).first()
            upi_ledger = upi_subledger.head_root
        else:
            upi_ledger = upi_subledger.head_root



        card_subledger = CoASubAccounts.objects.filter(Q(title="Card") & Q(is_adminonly=True)).first()
        if not card_subledger:
            data = CoASubAccounts()
            ledgername = "CASH ACCOUNT"
            ledgerobj = AccountLedger.objects.filter(name=ledgername).first()
            title = f"Card"
            data.head_root = ledgerobj
            gstring = ledgername.replace(" ", "_")
            data.gstring = gstring
            data.title = title
            data.branch = params["userbranch"]
            data.description = title
            data.is_adminonly = True
            data.save()

            card_subledger = CoASubAccounts.objects.filter(Q(title="Card") & Q(is_adminonly=True)).first()
            card_ledger = card_subledger.head_root
        else:
            card_ledger = card_subledger.head_root


        sale_subledger = CoASubAccounts.objects.filter(Q(title="Sales") & Q(is_adminonly=True)).first()
        if not sale_subledger:
            data = CoASubAccounts()
            ledgername = "SALES ACCOUNT"
            ledgerobj = AccountLedger.objects.filter(name=ledgername).first()
            title = f"Sales"
            data.head_root = ledgerobj
            gstring = ledgername.replace(" ", "_")
            data.gstring = gstring
            data.title = title
            data.branch = params["userbranch"]
            data.description = title
            data.is_adminonly = True
            data.save()

            sale_subledger = CoASubAccounts.objects.filter(Q(title="Sales") & Q(is_adminonly=True)).first()
            sale_ledger = sale_subledger.head_root
        else:
            sale_ledger = sale_subledger.head_root


        purchase_subledger = CoASubAccounts.objects.filter(Q(title="Purchase") & Q(is_adminonly=True)).first()
        if not purchase_subledger:
            data = CoASubAccounts()
            ledgername = "PURCHASE ACCOUNT"
            ledgerobj = AccountLedger.objects.filter(name=ledgername).first()
            title = f"Purchase"
            data.head_root = ledgerobj
            gstring = ledgername.replace(" ", "_")
            data.gstring = gstring
            data.title = title
            data.branch = params["userbranch"]
            data.description = title
            data.is_adminonly = True
            data.save()

            purchase_subledger = CoASubAccounts.objects.filter(Q(title="Purchase") & Q(is_adminonly=True)).first()
            purchase_ledger = purchase_subledger.head_root
        else:
            purchase_ledger = purchase_subledger.head_root


        service_subledger = CoASubAccounts.objects.filter(Q(title="Service") & Q(is_adminonly=True)).first()
        if not service_subledger:
            data = CoASubAccounts()
            ledgername = "SERVICES ACCOUNT"
            ledgerobj = AccountLedger.objects.filter(name=ledgername).first()
            title = f"Service"
            data.head_root = ledgerobj
            gstring = ledgername.replace(" ", "_")
            data.gstring = gstring
            data.title = title
            data.branch = params["userbranch"]
            data.description = title
            data.is_adminonly = True
            data.save()

            service_subledger = CoASubAccounts.objects.filter(Q(title="Service") & Q(is_adminonly=True)).first()
            service_ledger = service_subledger.head_root
        else:
            service_ledger = service_subledger.head_root

        purchase_return_subledger = CoASubAccounts.objects.filter(Q(title="Purchase Return") & Q(is_adminonly=True)).first()
        if not purchase_return_subledger:
            data = CoASubAccounts()
            ledgername = "PURCHASE ACCOUNT"
            ledgerobj = AccountLedger.objects.filter(name=ledgername).first()
            title = f"Purchase Return"
            data.head_root = ledgerobj
            gstring = ledgername.replace(" ", "_")
            data.gstring = gstring
            data.title = title
            data.branch = params["userbranch"]
            data.description = title
            data.is_adminonly = True
            data.save()

            purchase_return_subledger = CoASubAccounts.objects.filter(Q(title="Purchase Return") & Q(is_adminonly=True)).first()
            purchase_return_ledger = purchase_return_subledger.head_root
        else:
            purchase_return_ledger = purchase_return_subledger.head_root


        sales_return_subledger = CoASubAccounts.objects.filter(Q(title="Sales Return") & Q(is_adminonly=True)).first()
        if not sales_return_subledger:
            data = CoASubAccounts()
            ledgername = "SALES ACCOUNT"
            ledgerobj = AccountLedger.objects.filter(name=ledgername).first()
            title = f"Sales Return"
            data.head_root = ledgerobj
            gstring = ledgername.replace(" ", "_")
            data.gstring = gstring
            data.title = title
            data.branch = params["userbranch"]
            data.description = title
            data.is_adminonly = True
            data.save()

            sales_return_subledger = CoASubAccounts.objects.filter(Q(title="Sales Return") & Q(is_adminonly=True)).first()
            sales_return_ledger = sales_return_subledger.head_root
        else:
            sales_return_ledger = sales_return_subledger.head_root

            

        if type == "Purchase":
       
            try:
                totalbillingamount = round(params["totalbillingamount"],2)
            except:
                totalbillingamount = params["totalbillingamount"]

            try:
                amount_received = round(params["amountrecieved"],2)
            except:
                amount_received  = params["amountrecieved"]

            try:
                due_balance = round(params['duebalance'],2)
            except:
                due_balance = params['duebalance']


            #PURCHASE ACCOUNT
            

            ledger = GeneralLedger()
            ledger.date          = params['invoicedate']
            ledger.voucher_no    = params["invoicenumber"]
            ledger.voucher_id    = params["voucherid"]
            ledger.voucher_type  = "Purchase Transaction"
            ledger.description = params['description']
            ledger.amount  = totalbillingamount
            ledger.amount_type = 'Debit' 
            ledger.ledger = purchase_ledger
            ledger.subledger = purchase_subledger
            ledger.branch = params["userbranch"]
            ledger.save()
             
            #CASH ACCOUNT
            if amount_received != 0:
                ledger = GeneralLedger()
                ledger.date          = params['invoicedate']
                ledger.voucher_no    = params["invoicenumber"]
                ledger.voucher_id    = params["voucherid"]
                ledger.voucher_type  = "Purchase Transaction"
                ledger.description = params['description']
                ledger.amount = amount_received 
                ledger.amount_type = 'Credit'
                payment_mode = params['paymentmode']

                if payment_mode == "Cash":
                    ledger.ledger  = cash_ledger
                    ledger.subledger = cash_subledger
                elif payment_mode == "Card":
                    ledger.ledger  = card_ledger
                    ledger.subledger = card_subledger
                elif payment_mode == "Bank":
                    ledger.ledger  = bank_ledger
                    ledger.subledger = bank_subledger
                elif payment_mode == "UPI":
                    ledger.ledger  = upi_ledger
                    ledger.subledger = upi_subledger
                ledger.branch = params["userbranch"]
                ledger.save()

            #SUPPLIER ACCOUNT
            if params['duebalance'] != 0:
                ledger = GeneralLedger()
                ledger.date          = params['invoicedate']
                ledger.voucher_no    = params["invoicenumber"]
                ledger.voucher_id    = params["voucherid"]
                ledger.voucher_type  = "Purchase Transaction"
                ledger.description = params['description']
                ledger.amount = due_balance
                ledger.amount_type = 'Credit'
                ledger.ledger  = params['supplier'].head_root
                ledger.subledger = params['supplier']
                ledger.branch = params["userbranch"]
                ledger.save()

        elif type == "PurchaseDue":

            try:
                amount_received = round(params["amountreceived"],2)
            except:
                amount_received  = params["amountreceived"]

            #PURCHASE ACCOUNT
            ledger = GeneralLedger()
            ledger.date = timezone.now().date()
            ledger.voucher_no = params['invoicenumber']
            ledger.voucher_id = params['voucherid']
            ledger.voucher_type = "Purchase Due Transaction"
            ledger.amount = amount_received
            ledger.description = params['description']
            ledger.amount_type = 'Debit'
            ledger.ledger = params['supplier'].head_root
            ledger.subledger = params['supplier']
            ledger.branch = params['userbranch']
            ledger.save()

            #CASH ACCOUNT
            ledger = GeneralLedger()
            ledger.date          = timezone.now().date()
            ledger.voucher_no    = params["invoicenumber"]
            ledger.voucher_id    = params["voucherid"]
            ledger.voucher_type  = "Purchase Transaction"
            ledger.description = params['description']
            ledger.amount = amount_received 
            ledger.amount_type = 'Credit'
            payment_mode = params['paymentmode']
            if payment_mode == "Cash":
                ledger.ledger  = cash_ledger
                ledger.subledger = cash_subledger
            elif payment_mode == "Card":
                ledger.ledger  = card_ledger
                ledger.subledger = card_subledger
            elif payment_mode == "Bank":
                ledger.ledger  = bank_ledger
                ledger.subledger = bank_subledger
            elif payment_mode == "UPI":
                ledger.ledger  = upi_ledger
                ledger.subledger = upi_subledger
            ledger.branch = params["userbranch"]
            ledger.save()

        elif type == "Sale":

            try:
                amount_received = round(params["amountrecieved"],2)
            except:
                amount_received  = params["amountrecieved"]
            try:
                total_amount  = round(params['totalamount'],2)
            except:
                total_amount  = params['totalamount']
            try:
                due_balance = round(params['duebalance'],2)
            except:
                due_balance = params['duebalance']

            #SALE ACCOUNT
            

            

            ledger = GeneralLedger()
            ledger.date = params['invoicedate']
            ledger.voucher_no = params['invoicenumber']
            ledger.voucher_id = params['voucherid']
            ledger.voucher_type = "Sale Transaction"
            ledger.amount = total_amount
            ledger.description = params['description']
            ledger.amount_type = 'Credit'
            ledger.ledger = sale_ledger
            ledger.subledger = sale_subledger
            ledger.branch = params['userbranch']
            ledger.save()
            
            #CASH ACCOUNT
            if amount_received != 0:
                ledger = GeneralLedger()
                ledger.date = params['invoicedate']
                ledger.voucher_no = params['invoicenumber']
                ledger.voucher_id = params['voucherid']
                ledger.voucher_type = "Sale Transaction"
                ledger.description = params['description']
                ledger.amount = amount_received
                ledger.amount_type = 'Debit'
                payment_mode = params['paymentmode']
                if payment_mode == "Cash":
                    ledger.ledger  = cash_ledger
                    ledger.subledger = card_subledger
                elif payment_mode == "Card":
                    ledger.ledger  = card_ledger
                    ledger.subledger = card_subledger
                elif payment_mode == "Bank":
                    ledger.ledger  = bank_ledger
                    ledger.subledger = bank_subledger
                elif payment_mode == "UPI":
                    ledger.ledger  = upi_ledger
                    ledger.subledger = upi_subledger         
                ledger.branch = params["userbranch"]
                ledger.save()

            if params['duebalance'] != 0:

                #CUSTOMER ACCOUNT
                ledger = GeneralLedger()
                ledger.date = params['invoicedate']
                ledger.voucher_no = params['invoicenumber']
                ledger.voucher_id = params['voucherid']
                ledger.voucher_type = "Sale Transaction"
                ledger.description = params['description']
                ledger.amount = due_balance
                ledger.amount_type = 'Debit'
                ledger.ledger = params['customer'].head_root
                ledger.subledger = params['customer']
                ledger.branch = params['userbranch']
                ledger.save()

        elif type == "SaleDue":

            try:
                amount_received = round(params['amountrecieved'],2)
            except:
                amount_received = params['amountrecieved']

            #SALE TRANSACTION
            ledger = GeneralLedger()
            ledger.date = timezone.now().date()
            ledger.voucher_no = params['invoicenumber'] 
            ledger.voucher_id = params['voucherid']
            ledger.voucher_type = "Sale Due Transaction"
            ledger.description = params['description']
            ledger.amount = amount_received
            ledger.amount_type = 'Credit'
            ledger.ledger = params['customer'].head_root
            ledger.subledger = params['customer']
            ledger.branch = params['userbranch']
            ledger.save()

            #CASH ACCOUNT
            ledger = GeneralLedger()
            ledger.date = timezone.now().date()
            ledger.voucher_no = params['invoicenumber']
            ledger.voucher_id = params['voucherid']
            ledger.voucher_type = "Sale Due Transaction"
            ledger.description = params['description']
            ledger.amount = amount_received
            ledger.amount_type = 'Debit'
            payment_mode = params['paymentmode']
            if payment_mode == "Cash":
                ledger.ledger  = cash_ledger
                ledger.subledger = cash_subledger
            elif payment_mode == "Card":
                ledger.ledger  = card_ledger
                ledger.subledger = card_subledger
            elif payment_mode == "Bank":
                ledger.ledger  = bank_ledger
                ledger.subledger = bank_subledger
            elif payment_mode == "UPI":
                ledger.ledger  = upi_ledger
                ledger.subledger = upi_subledger
            ledger.branch = params["userbranch"]
            ledger.save()



        elif type == "PurchaseReturn":

            

            try:
                net_total = round(params['nettotal'],2)
            except:
                net_total  = params['nettotal']

            #PURCHASE REURN ACCOUNT
            ledger = GeneralLedger()
            ledger.date = timezone.now().date()
            ledger.voucher_no = params['returnid']
            ledger.voucher_id = params['voucherid']
            ledger.voucher_type = "Purchase Return Transaction"
            ledger.description = params['description']
            ledger.amount = net_total
            ledger.amount_type = 'Credit'
            ledger.ledger = purchase_return_ledger
            ledger.subledger = purchase_return_subledger
            ledger.branch = params['userbranch']
            ledger.save()

            #CASH ACCOUNT
            ledger = GeneralLedger()
            ledger.date = timezone.now().date()
            ledger.voucher_no = params['returnid']
            ledger.voucher_id = params['voucherid']
            ledger.voucher_type = "Purchase Return Transaction"
            ledger.description = params['description']
            ledger.amount = net_total
            ledger.amount_type = 'Debit'
            payment_mode = params['paymentmode']
            if payment_mode == "Cash":
                ledger.ledger  = cash_ledger
                ledger.subledger = cash_subledger
            elif payment_mode == "Card":
                ledger.ledger  = card_ledger
                ledger.subledger = card_subledger
            elif payment_mode == "Bank":
                ledger.ledger  = bank_ledger
                ledger.subledger = bank_subledger
            elif payment_mode == "UPI":
                ledger.ledger  = upi_ledger
                ledger.subledger = upi_subledger
            ledger.branch = params["userbranch"]
            ledger.save()





        elif type == "SaleReturn":

            

            try:
                amount = round(params['amount'],2)
            except:
                amount  = params['amount']


            #SALE RETURN ACCOUNT
            ledger = GeneralLedger()
            ledger.date = timezone.now().date()
            ledger.voucher_no = params['salereturnid']
            ledger.voucher_id = params['voucherid']
            ledger.voucher_type = "Sale Return Transaction"
            ledger.description = params['description']  
            ledger.amount = params['amount']
            ledger.amount_type = 'Debit'
            ledger.ledger = sales_return_ledger
            ledger.subledger = sales_return_subledger
            ledger.branch = params['userbranch']
            ledger.save()

            #CASH ACCOUNT
            ledger = GeneralLedger()
            ledger.date = timezone.now().date()
            ledger.voucher_no = params['salereturnid']
            ledger.voucher_id = params['voucherid']
            ledger.voucher_type = "Sale Return Transaction"
            ledger.description = params['description']  
            ledger.amount = params['amount']
            ledger.amount_type = 'Credit'
            payment_mode = params['paymentmode']
            if payment_mode == "Cash":
                ledger.ledger  = cash_ledger
                ledger.subledger = cash_subledger
            elif payment_mode == "Card":
                ledger.ledger  = card_ledger
                ledger.subledger = card_subledger
            elif payment_mode == "Bank":
                ledger.ledger  = bank_ledger
                ledger.subledger = bank_subledger
            elif payment_mode == "UPI":
                ledger.ledger  = upi_ledger
                ledger.subledger = upi_subledger
            ledger.branch = params["userbranch"]
            ledger.save()


        elif type == "ServiceEntry":

            

            try:
                total_amount  = round(params['totalamount'],2)
            except:
                total_amount  = params['totalamount']

            try:
                amount_received = params['amountrecieved']
            except:
                amount_received = params['amountrecieved']

            try:
                due_balance = round(params['duebalance'],2)
            except:
                due_balance = params['duebalance']


            #SERVICE ACCOUNT
            ledger = GeneralLedger()
            ledger.date = params['invoicedate']
            ledger.voucher_no = params['invoicenumber']
            ledger.voucher_id = params['voucherid']
            ledger.voucher_type = "Service Entry Transaction"
            ledger.description = params['description']
            ledger.amount = total_amount
            ledger.amount_type = 'Credit'
            ledger.ledger = service_ledger
            ledger.subledger = service_subledger
            ledger.branch = params['userbranch']
            ledger.save()

            #CASH ACCOUNT
            ledger = GeneralLedger()
            ledger.date = params['invoicedate']
            ledger.voucher_no = params['invoicenumber']
            ledger.voucher_id = params['voucherid']
            ledger.voucher_type = "Service Entry Transaction"
            ledger.description = params['description']
            ledger.amount = amount_received
            ledger.amount_type = 'Debit'
            payment_mode = params['paymentmode']
            if payment_mode == "Cash":
                ledger.ledger  = cash_ledger
                ledger.subledger = cash_subledger
            elif payment_mode == "Card":
                ledger.ledger  = card_ledger
                ledger.subledger = card_subledger
            elif payment_mode == "Bank":
                ledger.ledger  = bank_ledger
                ledger.subledger = bank_subledger   
            elif payment_mode == "UPI":
                ledger.ledger  = upi_ledger
                ledger.subledger = upi_subledger    
            ledger.branch = params["userbranch"]
            ledger.save()
   

            #CUSTOMER ACCOUNT
            if params['duebalance'] != 0:
                ledger = GeneralLedger()
                ledger.date = params['invoicedate']
                ledger.voucher_no = params['invoicenumber']
                ledger.voucher_id = params['voucherid']
                ledger.voucher_type = "Service Entry Transaction"
                ledger.description = params['description']
                ledger.amount = due_balance
                ledger.amount_type = 'Debit'
                ledger.ledger = params['customer'].head_root
                ledger.subledger = params['customer']
                ledger.branch = params['userbranch']
                ledger.save()


        elif type == "ServiceCheckout":

            try:
                total_amount  = round(params['totalamount'],2)
            except:
                total_amount  = params['totalamount']

            try:
                amount_received  = round(params['amountrecieved'],2)
            except:
                amount_received  = params['amountrecieved']

            try:
                previous_received   = round(params['previousreceived'],2)
            except:
                previous_received  = params['previousreceived']


            #SERVICE ACCOUNT
            adjustLedger = GeneralLedger.objects.filter(voucher_no=params['invoicenumber'])
            advanceamount = 0
            balanceamount = 0
            for item in adjustLedger:
                if item.voucher_type == 'Service Entry Transaction' and item.ledger == service_ledger and item.subledger == service_subledger:
                    item.amount = total_amount
                    item.amount_type  = 'Credit'
                if item.voucher_type == 'Service Entry Transaction' and (item.subledger.title == 'Cash' or item.subledger.title == 'Bank' or item.subledger.title == 'Card' or item.subledger.title == 'UPI'): 
                    advanceamount = item.amount
                if item.voucher_type == 'Service Entry Transaction' and item.ledger.name == 'ACCOUNTS RECEIVABLE':
                    balanceamount = total_amount - advanceamount
                    item.amount = balanceamount
                    item.amount_type    = 'Debit'
                item.save()

            cashpaid = amount_received - previous_received 

            ledger = GeneralLedger()
            ledger.date = params['invoicedate']
            ledger.voucher_no = params['invoicenumber']
            ledger.voucher_id = params['voucherid']
            ledger.voucher_type = "Service Checkout Transaction"
            ledger.description = params['description']
            ledger.amount = cashpaid
            ledger.amount_type = 'Credit'
            ledger.ledger = params['customer'].head_root
            ledger.subledger = params['customer']
            ledger.branch = params['userbranch']
            ledger.save()

            #CASH ACCOUNT
            ledger = GeneralLedger()
            ledger.date = params['invoicedate']
            ledger.voucher_no = params['invoicenumber']
            ledger.voucher_id = params['voucherid']
            ledger.voucher_type = "Service Checkout Transaction"
            ledger.description = params['description']
            ledger.amount = cashpaid
            ledger.amount_type = 'Debit'
            paymentmode = params['paymentmode']
            if  paymentmode == 'Cash':
                ledger.ledger =  cash_ledger
                ledger.subledger = cash_subledger
            elif paymentmode == 'Bank':
                ledger.ledger =  bank_ledger
                ledger.subledger =  bank_subledger
            elif paymentmode == 'Card':
                ledger.ledger =  card_ledger
                ledger.subledger =  card_subledger
            elif paymentmode == 'UPI':
                ledger.ledger =  upi_ledger 
                ledger.subledger =  upi_subledger   
            ledger.branch = params['userbranch']
            ledger.save()



        elif type == "Payment":

            try:
                amount = round(params['amount'],2)
            except:
                amount  = params['amount']

            #PAYMENT ACCOUNT
            ledger = GeneralLedger()
            ledger.date = params['date']
            ledger.voucher_no = params['id']
            ledger.voucher_id = params['voucherid']
            ledger.voucher_type = "Payment Transaction"
            ledger.description = params['description']
            ledger.amount = amount
            ledger.amount_type = 'Debit'
            ledger.ledger = params['debitac'].head_root
            ledger.subledger = params['debitac']
            ledger.branch = params['userbranch']
            ledger.save()


            #CASH ACCOUNT
            ledger = GeneralLedger()
            ledger.date = params['date']
            ledger.voucher_no = params['id']
            ledger.voucher_id = params['voucherid']
            ledger.voucher_type = "Payment Transaction"
            ledger.description = params['description']
            ledger.amount = amount
            ledger.amount_type = 'Credit'
            paymentmode = params['paymentmode']
            if  paymentmode == 'Cash':
                ledger.ledger =  cash_ledger
                ledger.subledger = cash_subledger
            elif paymentmode == 'Bank':
                ledger.ledger =  bank_ledger
                ledger.subledger =  bank_subledger
            elif paymentmode == 'Card':
                ledger.ledger =  card_ledger
                ledger.subledger =  card_subledger
            elif paymentmode == 'UPI':
                ledger.ledger =  upi_ledger
                ledger.subledger =  upi_subledger
            ledger.branch = params['userbranch']
            ledger.save()

        elif type == "Receipt":

            print("receipt params",params)

            try:
                amount = round(params['amount'],2)
            except:
                amount  = params['amount']

            ledger = GeneralLedger()
            ledger.date = timezone.now().date()
            ledger.voucher_no = params['id']
            ledger.voucher_id = params['voucherid']
            ledger.voucher_type = "Receipt Transaction"
            ledger.description = params['description']
            ledger.amount = amount
            ledger.amount_type = 'Credit'
            ledger.ledger  =   params['creditac'].head_root
            ledger.subledger  =   params['creditac']    
            ledger.branch = params['userbranch']
            ledger.save()

            #CASH ACCOUNT
            ledger = GeneralLedger()
            ledger.date = timezone.now().date()
            ledger.voucher_no = params['id']
            ledger.voucher_id = params['voucherid']
            ledger.voucher_type = "Receipt Transaction"
            ledger.description = params['description']
            ledger.amount = amount
            ledger.amount_type = 'Debit'
            paymentmode = params['paymentmode']
            print("paymentmode",paymentmode)
            print("cash_ledger",cash_ledger)
            print("cash_subledger",cash_subledger)
            if  paymentmode == 'Cash':
                ledger.ledger = cash_ledger
                ledger.subledger = cash_subledger
            elif paymentmode == 'Bank':
                ledger.ledger =  bank_ledger
                ledger.subledger =  bank_subledger
            elif paymentmode == 'Card':
                ledger.ledger =  card_ledger
                ledger.subledger =  card_subledger
            elif paymentmode == 'UPI':
                ledger.ledger =  upi_ledger
                ledger.subledger =  upi_subledger
            ledger.branch = params['userbranch']
            ledger.save()

        elif type == "Journal":

            try:
                amount = round(params['amount'],2)
            except:
                amount  = params['amount']

            #credit side
            ledger = GeneralLedger()
            ledger.date = timezone.now().date()
            ledger.voucher_no = params['id']
            ledger.voucher_id = params['voucherid']
            ledger.voucher_type = "Journal Transaction"
            ledger.description = params['description']
            ledger.amount = amount
            ledger.amount_type = 'Credit'
            ledger.ledger  =   params['creditac'].head_root
            ledger.subledger  =   params['creditac']    
            ledger.branch = params['userbranch']
            ledger.save()


            #debit side
            ledger = GeneralLedger()
            ledger.date = timezone.now().date()
            ledger.voucher_no = params['id']
            ledger.voucher_id = params['voucherid']
            ledger.voucher_type = "Journal Transaction"
            ledger.description = params['description']
            ledger.amount = amount
            ledger.amount_type = 'Debit'
            ledger.ledger  =   params['debitac'].head_root 
            ledger.subledger  =   params['debitac']  
            ledger.branch = params['userbranch']
            ledger.save()

        elif type == "Contra":

            try:
                amount = round(params['amount'],2)
            except:
                amount  = params['amount']

            #credit side
            ledger = GeneralLedger()
            ledger.date = timezone.now().date()
            ledger.voucher_no = params['id']
            ledger.voucher_id = params['voucherid']
            ledger.voucher_type = "Contra Entry Transaction"
            ledger.description = params['description']
            ledger.amount = amount
            ledger.amount_type = 'Credit'
            ledger.ledger  =   params['creditac'].head_root
            ledger.subledger  =   params['creditac']    
            ledger.branch = params['userbranch']
            ledger.save()


            #debit side
            ledger = GeneralLedger()
            ledger.date = timezone.now().date()
            ledger.voucher_no = params['id']
            ledger.voucher_id = params['voucherid']
            ledger.voucher_type = "Contra Entry Transaction"
            ledger.description = params['description']
            ledger.amount = amount
            ledger.amount_type = 'Debit'
            ledger.ledger  =   params['debitac'].head_root 
            ledger.subledger  =   params['debitac']  
            ledger.branch = params['userbranch']
            ledger.save()



    def add_cashbook(self, type, params):

        
        cashbook = CashBook()
        if type == "Purchase" or type == "PurchaseDue":
            try:
                amount_recieved = round(params['amountrecieved'],2)
            except:
                amount_recieved =params['amountrecieved']
            cashbook.branch = params['userbranch']
            cashbook.payment = amount_recieved
            cashbook.receipt = 0 # because its purchase so there won't be any payments.
            cashbook.mode = params['paymentmode']
            cashbook.date = params['invoicedate'] 
            cashbook.description = 'Purchase'
            cashbook.branch_wid = params['branch_wid']
            cashbook.save()
        elif type == "PurchaseReturn":
            try:
                net_total = round(params['nettotal'],2)
            except:
                net_total =params['nettotal']
            cashbook.branch = params['userbranch']
            cashbook.payment = 0
            cashbook.receipt = net_total
            cashbook.mode = params['paymentmode']
            # cashbook.date = datetime.now()
            cashbook.description = "Purchase Return"
            cashbook.branch_wid = params['branch_wid']
            cashbook.save()
        elif type == "Sale" or type == "SaleDue":
            try:
                amount_recieved = round(params['amountrecieved'],2)
            except:
                amount_recieved =params['amountrecieved']
            cashbook.branch = params['userbranch']
            cashbook.payment = 0
            cashbook.receipt = amount_recieved
            cashbook.mode = params['paymentmode']
            cashbook.date = params['invoicedate']
            cashbook.description = "Sale"
            cashbook.branch_wid = params['branch_wid']
            cashbook.save()
        elif type == "SaleReturn":

            try:
                amount = round(params['amount'],2)
            except:
                amount =params['amount']

            cashbook.branch = params['userbranch']
            cashbook.payment = amount
            cashbook.receipt = 0
            cashbook.mode = params['paymentmode']
            # cashbook.date = datetime.now()
            cashbook.description = "Sale Return"
            cashbook.branch_wid = params['branch_wid']
            cashbook.save()
        elif type == "ServiceEntry" or type == "ServiceCheckout":

            try:
                amount_recieved = round(params['amountrecieved'],2)
            except:
                amount_recieved =params['amountrecieved']

            cashbook.branch = params['userbranch']
            cashbook.payment = 0
            cashbook.receipt = amount_recieved
            cashbook.mode = params['paymentmode']
            # cashbook.date = datetime.now()
            cashbook.description = "Service"
            cashbook.branch_wid = params['branch_wid']
            cashbook.save()
        elif type == "Expense" or type == "EXPENSE":

            try:
                amount = round(params['amount'],2)
            except:
                amount =params['amount']

            cashbook.branch = params['userbranch']
            cashbook.payment = amount
            cashbook.receipt = 0
            cashbook.mode = params['paymentmode']
            # cashbook.date = datetime.now()
            cashbook.description = params['category']
            cashbook.branch_wid = params['branch_wid']
            cashbook.save()
        elif type == "Payment":

            try:
                amount = round(params['amount'],2)
            except:
                amount =params['amount']


            cashbook.branch = params['userbranch']
            cashbook.payment = amount
            cashbook.receipt = 0
            cashbook.mode = params['paymentmode']
            # cashbook.date = datetime.now()
            cashbook.description = params['category']
            cashbook.branch_wid = params['branch_wid']
            cashbook.save()
        elif type == "Receipt":

            try:
                amount = round(params['amount'],2)
            except:
                amount =params['amount']


            cashbook.branch = params['userbranch']
            cashbook.payment = 0
            cashbook.receipt = amount
            cashbook.mode = params['paymentmode']
            # cashbook.date = datetime.now()
            cashbook.description = params['category']
            cashbook.branch_wid = params['branch_wid']
            cashbook.save()

        elif type == "Contra":

            try:
                amount = round(params['amount'],2)
            except:
                amount =params['amount']


            cashbook.branch = params['userbranch']
            cashbook.payment = 0
            cashbook.receipt = amount
            cashbook.mode = params['debitmode']
            # cashbook.date = datetime.now()
            cashbook.description = params['category']
            cashbook.branch_wid = params['branch_wid']
            cashbook.save()

            cashbook = CashBook()
            cashbook.branch = params['userbranch']
            cashbook.payment = amount
            cashbook.receipt = 0
            cashbook.mode = params['creditmode']
            # cashbook.date = datetime.now()
            cashbook.description = params['category']
            cashbook.branch_wid = params['branch_wid']
            cashbook.save()

        elif type == "Journal":

            try:
                amount = round(params['amount'],2)
            except:
                amount =params['amount']

            cashbook.branch = params['userbranch']
            cashbook.branch_wid = params['branch_wid']
            if params['payment_type'] == "Payment":
                cashbook.payment = amount
                cashbook.receipt = 0
                cashbook.mode = params['mode']
                # cashbook.date = datetime.now()
                cashbook.description = params['category']
                cashbook.save()
            elif params['payment_type'] == "Receipt":
                cashbook.payment = 0
                cashbook.receipt = amount
                cashbook.mode = params['mode']
                # cashbook.date = datetime.now()
                cashbook.description = params['category']
                cashbook.save()







            




         




    