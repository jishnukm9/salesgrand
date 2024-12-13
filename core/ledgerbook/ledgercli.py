import subprocess
try:
    import fcntl
except:
    pass
from pathlib import Path
import os 
import re 

from core.models import Country

BASE_DIR = Path(__file__).resolve().parent.parent.parent

try:
    default_currency = Country.objects.filter(default=True).first().currency
except:
    default_currency='SAR'

class LedgerBook():

    def __init__(self, branch):
        self.branch = branch
        ledgerfile_with_space = os.path.join(f"{BASE_DIR}/ledgerfiles",f"{branch}.ledger")
        self.ledgerfile = ledgerfile_with_space.replace(" ", "_")
        self.currency = default_currency

    def create_ledger(self):
        with open (self.ledgerfile, 'a'):
            #just create an empty ledger file 
            pass 

    def write_file(self,ledgerfile,params):
        with open(ledgerfile, 'a') as ledger_file_handle:
            try:
                fcntl.flock (ledger_file_handle, fcntl.LOCK_EX) # Lock the file 
            except:
                pass
            try:
                ledger_file_handle.write(params + '\n')
                ledger_file_handle.flush()  # flush the buffer to ensure data is written
                os.fsync(ledger_file_handle.fileno()) # Ensure data is written to the disk
            finally:
                try:
                    fcntl.flock(ledger_file_handle, fcntl.LOCK_UN) # Release the lock even if there is an error 
                except:
                    pass
                print ("Ledger has been posted")

    # SALE STARTS
    def post_sale(self,**sale_args):
        if sale_args['duebalance'] != 0:
            #Assuming this is a Credit sale 
            params  = f"{sale_args['invoicedate']} * {sale_args['invoiceno']} (Sale Credit Transaction)\n" 
            params += f"    Assets:Sale:{sale_args['mode']}              {sale_args['amountreceived']} {self.currency}\n"
            params += f"    Assets:Sale:AccountReceivable:{sale_args['customer']}       {sale_args['duebalance']} {self.currency}\n"
            params += f"    Income:Sale\n"
            params += f"    Liabilities:Sale:TaxPayable                                   -{sale_args['taxamount']}  {self.currency}\n"
            
        else:
            params  = f"{sale_args['invoicedate']} * {sale_args['invoiceno']} (Sale Transaction)\n"
            params += f"    Assets:Sale:{sale_args['mode']}              {sale_args['amountreceived']} {self.currency}\n"
            params += f"    Income:Sale\n"
            params += f"    Liabilities:Sale:TaxPayable      -{sale_args['taxamount']}  {self.currency}\n"
        self.write_file(self.ledgerfile, params)
    def post_sale_due(self, **sale_args):
        if sale_args['duebalance'] != 0:
            #If duebalance still there, record the same in the ledger 
            params  = f"{sale_args['invoicedate']} * {sale_args['invoiceno']} (Sale Due Transaction)\n"
            params += f"    Assets:Sale:AccountReceivable:{sale_args['customer']}       -{sale_args['amountreceived']} {self.currency}\n"
            params += f"    Assets:Sale:{sale_args['mode']} \n"
        else:
            params  = f"{sale_args['invoicedate']} * {sale_args['invoiceno']} (Sale Due full Transaction)\n"
            params += f"    Assets:Sale:AccountReceivable:{sale_args['customer']}    -{sale_args['amountreceived']} {self.currency} \n" 
            params += f"    Assets:Sale:{sale_args['mode']} \n"
        self.write_file(self.ledgerfile, params)
    def post_sale_return(self, **sale_args):
        params  = f"{sale_args['invoicedate']} * {sale_args['invoiceno']} (Sale Return Transaction)\n"
        params += f"     Expenses:SaleReturn:{sale_args['mode']}       {sale_args['amountpaid']} {self.currency}\n"
        params += f"     Assets:SaleReturn\n"
        params += f"     Liabilities:Sale:TaxPayable      {sale_args['taxamount']}  {self.currency}\n"
        self.write_file(self.ledgerfile, params)
    # SALE ENDS

    # PURCHASE STARTS

    def post_purchase(self, **purchase_args):
        if purchase_args['duebalance'] != 0:
            params  = f"{purchase_args['billdate']} * {purchase_args['billno']} (Purchase Credit Transaction)\n"
            params += f"     Expenses:Purchase        {purchase_args['totalamount']} {self.currency} \n"
            params += f"     Assets:Purchase:{purchase_args['mode']}\n"
            params += f"     Liabilities:Purchase:AccountPayable:{purchase_args['supplier']}  -{purchase_args['duebalance']} {self.currency}\n"
        else:
            params  = f"{purchase_args['billdate']} * {purchase_args['billno']} (Purchase Transaction)\n"
            params += f"     Expenses:Purchase        {purchase_args['totalamount']}  {self.currency} \n"
            params += f"     Assets:Purchase:{purchase_args['mode']} \n"
        self.write_file(self.ledgerfile, params)
    def post_purchase_due(self, **purchase_args):
        params  = f"{purchase_args['billdate']} * {purchase_args['billno']} (Purchase Due Transaction)\n"
        params += f"     Liabilities:Purchase:AccountPayable:{purchase_args['supplier']}    {purchase_args['amountpaid']} {self.currency}\n"
        params += f"     Assets:Purchase:{purchase_args['mode']}\n"
        self.write_file(self.ledgerfile, params)
    def post_purchase_return(self, **purchase_args):
        params  = f"{purchase_args['billdate']} * {purchase_args['billno']} (Purchase Return Transaction)\n"
        params += f"     Assets:PurchaseReturn:{purchase_args['mode']}      {purchase_args['totalamount']} {self.currency} \n"
        params += f"     Income:PurchaseReturn\n"
        self.write_file(self.ledgerfile, params)


    # PURCHASE ENDS 


    # SERVICE STARTS 
    def post_service(self,**service_args):

        # Check if there is already an entry of the invoice number 
        with open (self.ledgerfile, "r") as fh:
            ledger_content = fh.read()
        count = len(re.findall(rf"{service_args['invoiceno']}", ledger_content, re.IGNORECASE)) 

        if count == 0:
            if service_args['duebalance'] != 0:
                #Assuming this is a Credit service 
                params  = f"{service_args['invoicedate']} * {service_args['invoiceno']} (Service Credit Transaction)\n"
                params += f"    Assets:Service:{service_args['mode']}              {service_args['amountreceived']} {self.currency}\n"
                params += f"    Assets:Service:AccountReceivable:{service_args['customer']}       {service_args['duebalance']} {self.currency}\n"
                params += f"    Income:Service\n"
                params += f"    Liabilities:Service:TaxPayable                     -{service_args['taxamount']}   {self.currency}\n"

            else:
                params  = f"{service_args['invoicedate']} * {service_args['invoiceno']} (Service Transaction)\n"
                params += f"    Assets:Service:{service_args['mode']}   {service_args['amountreceived']} {self.currency}\n"
                params += f"    Income:Service\n"
                params += f"    Liabilities:Service:TaxPayable                     -{service_args['taxamount']}   {self.currency}\n"
            self.write_file(self.ledgerfile, params)
        else:
            paid_amount = service_args['amountreceived'] - service_args['amountprevious_received']
            if service_args['duebalance'] != 0:
                #If duebalance still there, record the same in the ledger 
                params  = f"{service_args['invoicedate']} * {service_args['invoiceno']} (Service Due Transaction)\n"
                params += f"    Assets:Service:AccountReceivable:{service_args['customer']}       -{paid_amount} {self.currency}\n"
                params += f"    Assets:Service:{service_args['mode']}\n"
            else:
                params  = f"{service_args['invoicedate']} * {service_args['invoiceno']} (Service Due full Transaction)\n"
                params += f"    Assets:Service:AccountReceivable:{service_args['customer']}   -{paid_amount}   {self.currency} \n"
                params += f"    Assets:Service:{service_args['mode']}\n"
            self.write_file(self.ledgerfile, params)
    def post_service_due(self, **service_args):
        if service_args['duebalance'] != 0:
            #If duebalance still there, record the same in the ledger 
            params  = f"{service_args['invoicedate']} * {service_args['invoiceno']} (Service Due Transaction)\n"
            params += f"    Assets:Service:AccountReceivable:{service_args['customer']}       -{service_args['amountreceived']} {self.currency}\n"
            params += f"    Assets:Service:{service_args['mode']}\n"
        else:
            params  = f"{service_args['invoicedate']} * {service_args['billno']} (Service Due full Transaction)\n"
            params += f"    Assets:Service:AccountReceivable:{service_args['customer']}   -{service_args['duebalance']}   {self.currency} \n"
            params += f"    Assets:Service:{service_args['mode']}\n"
        self.write_file(self.ledgerfile, params)

    # SERVICE ENDS 

    # PAYMENT STARTS
    # Payment can be multiple types for example 
    # payment for an expense would involve expense and asset (cash)
    # payment for a liability would involve liability and asset (cash)
    def post_payment(self, **payment_args):
        
        debit_head_c = " ".join(payment_args['debit_head'].split())
        debit_coa_level1_c = " ".join(payment_args['debit_coa_level1'].split())
        debit_sub_head_c = " ".join(payment_args['debit_sub_head'].split())
        credit_head_c = " ".join(payment_args['credit_head'].split())
        credit_coa_level1_c = " ".join(payment_args['credit_coa_level1'].split())
        credit_sub_head_c = " ".join(payment_args['credit_sub_head'].split())
        narration_c = " ".join(payment_args['narration'].split())
        
        if payment_args['amount'] == None:
            amount_c = 0
        else:
            amount_c = payment_args['amount']

        params  = f"{payment_args['paymentdate']}   *  {narration_c} (Payment) \n"
        params += f"     {debit_head_c}:{debit_coa_level1_c}:{debit_sub_head_c}     {amount_c} {self.currency}\n"
        params += f"     {credit_head_c}:{credit_coa_level1_c}:{credit_sub_head_c}\n" 
        self.write_file(self.ledgerfile, params)
    # PAYMENT ENDS 

    # RECEIPT STARTS
    def post_receipt(self, **receipt_args):

        narration_c = " ".join(receipt_args['narration'].split())
        debit_head_c = " ".join(receipt_args['debit_head'].split())
        debit_coa_level1_c = " ".join(receipt_args['debit_coa_level1'].split())
        debit_sub_head_c = " ".join(receipt_args['debit_sub_head'].split())
        credit_head_c = " ".join(receipt_args['credit_head'].split())
        credit_coa_level1_c = " ".join(receipt_args['credit_coa_level1'].split())
        credit_sub_head_c = " ".join(receipt_args['credit_sub_head'].split())

        if receipt_args['amount'] == None:
            amount_c = 0
        else:  
            amount_c = receipt_args['amount']

        params  = f"{receipt_args['receiptdate']}  *  {narration_c}  (Receipt) \n"
        params += f"     {debit_head_c}:{debit_coa_level1_c}:{debit_sub_head_c}      {amount_c}  {self.currency}\n"
        params += f"     {credit_head_c}:{credit_coa_level1_c}:{credit_sub_head_c}\n"
        self.write_file(self.ledgerfile, params)
    # RECEIPT ENDS 


    # JOURNAL STARTS
    def post_journal(self, **journal_args):

        narration_c = " ".join(journal_args['narration'].split())
        debit_head_c = " ".join(journal_args['debit_head'].split())
        debit_coa_level1_c = " ".join(journal_args['debit_coa_level1'].split())
        debit_sub_head_c = " ".join(journal_args['debit_sub_head'].split())
        credit_head_c = " ".join(journal_args['credit_head'].split())
        credit_coa_level1_c = " ".join(journal_args['credit_coa_level1'].split())
        credit_sub_head_c = " ".join(journal_args['credit_sub_head'].split())

        if journal_args['amount'] == None:
            amount_c = 0
        else:
            amount_c = journal_args['amount']

        params  = f"{journal_args['journaldate']}   *  {narration_c} (Journal) \n"
        params += f"     {debit_head_c}:{debit_coa_level1_c}:{debit_sub_head_c}     {amount_c} {self.currency}\n"
        params += f"     {credit_head_c}:{credit_coa_level1_c}:{credit_sub_head_c}\n" 
        self.write_file(self.ledgerfile, params)
 
    # JOURNAL ENDS

    # SINGLE LEDGER STARTS
    def post_singledger(self, **singleledger_args):
        pass

    # SINGLE LEDGER ENDS  



class FinReport():

    def __init__(self, branch):
        self.branch = branch
        ledgerfile_with_space = os.path.join(f"{BASE_DIR}/ledgerfiles",f"{branch}.ledger")
        self.ledgerfile = ledgerfile_with_space.replace(" ", "_")

    def balance_sheet(self, startdate, enddate):
        if startdate is not None and enddate is not None:
            assets = subprocess.check_output(['ledger -f %s bal ^Assets -b %s -e %s' % (self.ledgerfile, startdate, enddate)], shell = True)
            liabilities = subprocess.check_output(['ledger -f %s bal ^Liabilities -b %s -e %s' % (self.ledgerfile, startdate, enddate)], shell = True)
            equity = subprocess.check_output(['ledger -f %s bal ^Equity -b %s -e %s' % (self.ledgerfile, startdate, enddate)], shell = True)
        else:
            assets = subprocess.check_output(['ledger -f %s bal ^Assets' % (self.ledgerfile)], shell = True)
            liabilities = subprocess.check_output(['ledger -f %s bal ^Liabilities' % (self.ledgerfile)], shell = True)
            equity = subprocess.check_output(['ledger -f %s bal ^Equity' % (self.ledgerfile)], shell = True)

        assets = assets.decode("utf-8")
        liabilities = liabilities.decode("utf-8")
        equity = equity.decode("utf-8")
        return assets, liabilities, equity
        
    def cash_book(self):
        cb = subprocess.check_output(['ledger -f %s bal ^Expenses ^Income' % (self.ledgerfile)], shell = True)
        cb = cb.decode("utf-8")
        return cb 


    def ledger_report(self):
        lr = subprocess.check_output(['ledger -f %s reg' % (self.ledgerfile)], shell = True)
        lr = lr.decode("utf-8")
        return lr 

# Below class and functions are deprecated 
class OpeningBalance():
    def __init__(self, branch):
        self.branch = branch
        ledgerfile_with_space = os.path.join(f"{BASE_DIR}/ledgerfiles",f"{branch}.ledger")
        self.ledgerfile = ledgerfile_with_space.replace(" ", "_")

    def get_cash_opening(self):
        cash_balance = subprocess.check_output(['ledger -f %s bal ^"Equity:OPENING CASH EQUITY" ^"Assets:OPENING CASH ASSET"' % (self.ledgerfile)], shell = True)
        cash_balance = cash_balance.decode("utf-8")
        try:
            cash_balance_lastline = cash_balance.splitlines()[-1]
            balance = cash_balance_lastline.split()[0].replace("-", "")
        except:
            balance = 0 
        return balance
    
    def get_upi_opening(self):
        upi_balance = subprocess.check_output(['ledger -f %s bal ^"Equity:OPENING UPI EQUITY" ^"Assets:OPENING UPI ASSET"' % (self.ledgerfile)], shell = True)
        upi_balance = upi_balance.decode("utf-8")
        try:
            upi_balance_lastline = upi_balance.splitlines()[-1]
            balance = upi_balance_lastline.split()[0].replace("-", "")
        except:
            balance = 0
        return balance 

    def get_bank_opening(self):
        bank_balance = subprocess.check_output(['ledger -f %s bal ^"Equity:OPENING BANK EQUITY" ^"Assets:OPENING BANK ASSET"' % (self.ledgerfile)], shell = True)
        bank_balance = bank_balance.decode("utf-8")
        try:
            bank_balance_lastline = bank_balance.splitlines()[-1]
            balance = bank_balance_lastline.split()[0].replace("-", "")
        except:
            balance = 0
        return balance 
    



            

