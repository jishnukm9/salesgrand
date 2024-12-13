
# Root COA constants 
ASSET = {
    'name': 'ASSET',
    'coa_type': 'ROOT',
    'description' : 'Root Asset COA',
    'account_type' : 'DEBIT',
    'code': 100,
    'ledger-cli': 'Assets'
}

EXPENSE = {
    'name': 'EXPENSE',
    'coa_type': 'ROOT',
    'description' : 'Root Expense COA',
    'account_type' : 'DEBIT',
    'code': 101,
    'ledger-cli': 'Expenses'
}

LIABILITY = {
    'name': 'LIABILITY',
    'coa_type': 'ROOT',
    'description' : 'Root Liability COA',
    'account_type' : 'CREDIT',
    'code': 102,
    'ledger-cli': 'Liabilities'
}

CAPITAL = {
    'name': 'CAPITAL',
    'coa_type': 'ROOT',
    'description' : 'Root Capital or Equity COA',
    'account_type' : 'CREDIT',
    'code': 103,
    'ledger-cli': 'Equity'
}

INCOME = {
    'name': 'INCOME',
    'coa_type': 'ROOT',
    'description' : 'Root Income or Revenue COA',
    'account_type' : 'CREDIT',
    'code': 104,
    'ledger-cli': 'Income'
}

ROOT_COA_LIST = [
    ASSET,
    EXPENSE,
    LIABILITY,
    CAPITAL,
    INCOME
]

# COA Custom groups

BORROWINGS = {
    'name': 'BORROWINGS',
    'coa_type': 'GROUP',
    'root': LIABILITY,
    'description' : 'Borrowings from other parties',
    'account_type' : LIABILITY['account_type'],
    'code': 1000
}

BRANCH_ACCOUNTS = {
    'name': 'BRANCH ACCOUNTS',
    'coa_type': 'GROUP',
    'root': ASSET,
    'description' : 'Accounts owned by branches',
    'account_type' : ASSET['account_type'],
    'code': 1001
}

CASH_AT_BANKS = {
    'name': 'CASH AT BANKS',
    'coa_type': 'GROUP',
    'root': ASSET,
    'description' : 'Other assets',
    'account_type' : ASSET['account_type'],
    'code': 1002
}

DEPOSITS = {
    'name': 'DEPOSITS',
    'coa_type': 'GROUP',
    'root': LIABILITY,
    'description' : 'Desposits to banks',
    'account_type' : LIABILITY['account_type'],
    'code': 1004
}

EXPENSES = {
    'name': 'EXPENSES',
    'coa_type': 'GROUP',
    'root': EXPENSE,
    'description' : 'Other expenses',
    'account_type' : EXPENSE['account_type'],
    'code': 1005
}

FIXED_ASSETS = {
    'name': 'FIXED ASSETS',
    'coa_type': 'GROUP',
    'root': ASSET,
    'description' : 'Other fixed assets such as land, building etc. which are long term tangible assets',
    'account_type' : ASSET['account_type'],
    'code': 1006
}

INCOMES = {
    'name': 'INCOMES',
    'coa_type': 'GROUP',
    'root': INCOME,
    'description' : 'Other incomes',
    'account_type' : INCOME['account_type'],
    'code': 1007
}

INVESTMENTS = {
    'name': 'INVESTMENTS',
    'coa_type': 'GROUP',
    'root': ASSET,
    'description' : 'Other Investments',
    'account_type' : ASSET['account_type'],
    'code': 1008
}

LOAN_AND_ADVANCES = {
    'name': 'LOAN AND ADVANCES',
    'coa_type': 'GROUP',
    'root': ASSET,
    'description' : 'Loan and advance amount lent out to others in the company',
    'account_type' : ASSET['account_type'],
    'code': 1009
}

OTHER_ASSETS = {
    'name': 'OTHER ASSETS',
    'coa_type': 'GROUP',
    'root': ASSET,
    'description' : 'Other assets such as intangible assets like investment in other companies, patents, copyright etc.',
    'account_type' : ASSET['account_type'],
    'code': 1010
}

OTHER_LIABILITIES = {
    'name': 'OTHER LIABILITIES',
    'coa_type': 'GROUP',
    'root': LIABILITY,
    'description' : 'Other liabilities',
    'account_type' : LIABILITY['account_type'],
    'code': 1011
}

PURCHASE_ACCOUNTS = {
    'name': 'PURCHASE ACCOUNTS',
    'coa_type': 'GROUP',
    'root': EXPENSE,
    'description' : 'Other Purchases',
    'account_type' : EXPENSE['account_type'],
    'code': 1012
}

PURCHASE_RETURN = {
    'name': 'PURCHASE RETURN',
    'coa_type': 'GROUP',
    'root': EXPENSE,
    'description' : 'Other Purchase returns',
    'account_type' : EXPENSE['account_type'],
    'code': 1013
}

RESERVES_AND_SURPLUSES = {
    'name': 'RESERVES AND SURPLUSES',
    'coa_type': 'GROUP',
    'root': CAPITAL,
    'description' : 'Reserve and surpluse amounts',
    'account_type' : CAPITAL['account_type'],
    'code': 1014
}

SALARY_AND_WAGES = {
    'name': 'SALARY AND WAGES',
    'coa_type': 'GROUP',
    'root': EXPENSE,
    'description' : 'Salary paid to employees',
    'account_type' : EXPENSE['account_type'],
    'code': 1015
}

SALES_ACCOUNT = {
    'name': 'SALES ACCOUNT',
    'coa_type': 'GROUP',
    'root': INCOME,
    'description' : 'Other Sales',
    'account_type' : INCOME['account_type'],
    'code': 1016
}

SALES_RETURN = {
    'name': 'SALES RETURN',
    'coa_type': 'GROUP',
    'root': EXPENSE,
    'description' : 'Other Sale returns',
    'account_type' : EXPENSE['account_type'],
    'code': 1017
}

SHARE_CAPITAL = {
    'name': 'SHARE CAPITAL',
    'coa_type': 'GROUP',
    'root': CAPITAL,
    'description' : 'Share Capital Amounts',
    'account_type' : CAPITAL['account_type'],
    'code': 1018
}

STOCK_IN_HAND = {
    'name': 'STOCK IN HAND',
    'coa_type': 'GROUP',
    'root': ASSET,
    'description' : 'Inhand stock amount',
    'account_type' : ASSET['account_type'],
    'code': 1019
}

TRADE_EXPENSES = {
    'name': 'TRADE EXPENSES',
    'coa_type': 'GROUP',
    'root': EXPENSE,
    'description' : 'All trade expenses',
    'account_type' : EXPENSE['account_type'],
    'code': 1020
}

CASH_ACCOUNT = {
    'name': 'CASH ACCOUNT',
    'coa_type': 'GROUP',
    'root': ASSET,
    'description' : 'Cash account',
    'account_type' : ASSET['account_type'],
    'code': 1021
}

SERVICE_ACCOUNT = {
    'name': 'SERVICE ACCOUNT',
    'coa_type': 'GROUP',
    'root': INCOME,
    'description' : 'Service income account',
    'account_type' : INCOME['account_type'],
    'code': 1022
}


COA_GROUP_LIST = [
    BORROWINGS,
    BRANCH_ACCOUNTS,
    # CASH_AT_BANKS,
    DEPOSITS,
    EXPENSES,
    FIXED_ASSETS,
    INCOMES,
    INVESTMENTS,
    LOAN_AND_ADVANCES,
    OTHER_ASSETS,
    OTHER_LIABILITIES,
    PURCHASE_ACCOUNTS,
    PURCHASE_RETURN,
    RESERVES_AND_SURPLUSES,
    SALARY_AND_WAGES,
    SALES_ACCOUNT,
    SALES_RETURN,
    SHARE_CAPITAL,
    STOCK_IN_HAND,
    TRADE_EXPENSES,  
    CASH_ACCOUNT,
    SERVICE_ACCOUNT,
]


