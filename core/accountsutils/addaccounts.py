from core.models import Ledger, CashBook, CoASubAccounts
from . import coa
from datetime import date,datetime
from django.utils import timezone

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
            # ledger.account_subhead = "Cash"
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
            cashbook.save()
        elif type == "Journal":

            try:
                amount = round(params['amount'],2)
            except:
                amount =params['amount']

            cashbook.branch = params['userbranch']
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







            




         




    