from django.db import models
from datetime import datetime
from django.contrib.auth.models import User
from datetime import date
import json
from django.utils import timezone
from django.core.exceptions import ValidationError
from django.db.models.signals import post_save, pre_delete, pre_save
from django.dispatch import receiver
import json
from django.db.models import F, Q


# Registration models


class Branch(models.Model):
    name = models.CharField(max_length=200, unique=True)
    phone = models.CharField(max_length=200, default=None, null=True, blank=True)
    address = models.TextField(default=None, null=True, blank=True)
    branchtype = models.CharField(max_length=200, default=None, blank=True, null=True)
    branchcategory = models.CharField(
        max_length=200, default=None, blank=True, null=True
    )
    gstin = models.CharField(max_length=200, default=None, blank=True, null=True)
    createddate = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name



class AccountHead(models.Model):
    name = models.CharField(max_length=200,unique=True)
    created_date = models.DateTimeField(default=timezone.now)
    def __str__(self):
        return self.name


class AccountGroup(models.Model):
    account_head = models.ForeignKey(AccountHead, on_delete=models.CASCADE)
    name = models.CharField(max_length=200,unique=True)
    created_date = models.DateTimeField(default=timezone.now)
    def __str__(self):
        return self.name


class AccountLedger(models.Model):
    account_group = models.ForeignKey(AccountGroup, on_delete=models.CASCADE)
    name = models.CharField(max_length=200,unique=True)
    created_date = models.DateTimeField(default=timezone.now)
    def __str__(self):
        return self.name


class CoASubAccounts(models.Model):
    # head_root = models.CharField(max_length=200)
    head_root = models.ForeignKey(AccountLedger, on_delete=models.CASCADE,default=None,null=True,blank=True)
    gstring = models.CharField(max_length=200, blank=True, null=True)
    title = models.CharField(max_length=200, unique=True)
    description = models.CharField(max_length=200, blank=True, null=True)
    created_date = models.DateTimeField(default=timezone.now)
    branch=models.ForeignKey(Branch, on_delete=models.PROTECT,default=None, null=True, blank=True)
    is_adminonly=models.BooleanField(default=False,null=True,blank=True)

    def __str__(self):
        return self.title



class Catagories(models.Model):
    name = models.CharField(max_length=200)
    branch = models.ForeignKey(
        Branch,
        on_delete=models.PROTECT,
        related_name="categories_branch",
        default=None,
        null=True,
        blank=True,
    )
    created_date = models.DateTimeField(default=timezone.now)

    class Meta:
        unique_together = ("name", "branch")

    def __str__(self):
        return self.name


class SubCatagories(models.Model):
    name = models.CharField(max_length=200)
    catagory = models.ForeignKey(Catagories, on_delete=models.PROTECT)
    branch = models.ForeignKey(
        Branch,
        on_delete=models.PROTECT,
        related_name="sub_categories_branch",
        default=None,
        null=True,
        blank=True,
    )
    created_date = models.DateTimeField(default=timezone.now)

    class Meta:
        unique_together = ("name", "branch")

    def __str__(self):
        return self.name


class Brand(models.Model):
    name = models.CharField(max_length=200)
    branch = models.ForeignKey(
        Branch,
        on_delete=models.PROTECT,
        related_name="brand_branch",
        default=None,
        null=True,
        blank=True,
    )
    created_date = models.DateTimeField(default=timezone.now)

    class Meta:
        unique_together = ("name", "branch")

    def __str__(self):
        return self.name


class Packing(models.Model):
    name = models.CharField(max_length=200)
    branch = models.ForeignKey(
        Branch,
        on_delete=models.PROTECT,
        related_name="packing_branch",
        default=None,
        null=True,
        blank=True,
    )
    created_date = models.DateTimeField(default=timezone.now)

    class Meta:
        unique_together = ("name", "branch")

    def __str__(self):
        return self.name


class Tax(models.Model):
    name = models.CharField(max_length=200)
    percentage = models.CharField(max_length=200)
    branch = models.ForeignKey(
        Branch,
        on_delete=models.PROTECT,
        related_name="tax_branch",
        default=None,
        null=True,
        blank=True,
    )
    created_date = models.DateTimeField(default=timezone.now)

    class Meta:
        unique_together = ("name", "branch")

    def __str__(self):
        return self.name


class Type(models.Model):
    name = models.CharField(max_length=200)
    branch = models.ForeignKey(
        Branch,
        on_delete=models.PROTECT,
        related_name="type",
        default=None,
        null=True,
        blank=True,
    )
    created_date = models.DateTimeField(default=timezone.now)

    class Meta:
        unique_together = ("name", "branch")

    def __str__(self):
        return self.name


class Suppliers(models.Model):
    name = models.CharField(max_length=200)
    contact = models.CharField(max_length=200, default=None, null=True, blank=True)
    address = models.TextField(default=None, null=True, blank=True)
    gst = models.CharField(max_length=200, default=None, null=True, blank=True)
    branch = models.ForeignKey(
        Branch,
        on_delete=models.PROTECT,
        related_name="branch_suppliers",
        default=None,
        null=True,
        blank=True,
    )
    created_date = models.DateTimeField(default=timezone.now)

    class Meta:
        unique_together = ("name", "branch")

    def __str__(self):
        return self.name


class Products(models.Model):
    name = models.CharField(max_length=200)
    catagory = models.ForeignKey(Catagories, on_delete=models.PROTECT)
    subcatagory = models.ForeignKey(SubCatagories, on_delete=models.PROTECT)
    brand = models.ForeignKey(Brand, on_delete=models.PROTECT)
    type = models.ForeignKey(Type, on_delete=models.PROTECT)
    packing = models.ForeignKey(Packing, on_delete=models.PROTECT)
    HSN = models.CharField(max_length=200)
    price = models.FloatField(default=None, blank=True, null=True)
    sellingprice = models.FloatField(default=None, blank=True, null=True)
    purchasegst = models.ForeignKey(
        Tax, on_delete=models.PROTECT, related_name="productpurchasegst"
    )
    salegst = models.ForeignKey(
        Tax, on_delete=models.PROTECT, related_name="productsalegst"
    )
    mrp = models.FloatField(blank=True, null=True, default=None)
    mop = models.FloatField(blank=True, null=True, default=None)
    branch = models.ForeignKey(
        Branch,
        on_delete=models.PROTECT,
        related_name="products_branch",
        default=None,
        null=True,
        blank=True,
    )
    created_date = models.DateTimeField(default=timezone.now)

    class Meta:
        unique_together = ("name", "branch")

    def __str__(self):
        return str(self.name)


# stock


class Stock(models.Model):
    name = models.ForeignKey(Products, on_delete=models.CASCADE)
    quantity = models.IntegerField()
    purchaserate = models.FloatField(null=True, default=None, blank=True)
    salerate = models.FloatField(null=True, default=None, blank=True)
    stockvalue = models.FloatField(null=True, default=None, blank=True)
    created_date = models.DateTimeField(default=timezone.now)

    def save(self, *args, **kwargs):
        if self.quantity is not None and self.purchaserate is not None:
            # self.stockvalue = self.quantity * self.purchaserate

            self.stockvalue = float(
                (
                    (
                        self.purchaserate
                        + (
                            self.purchaserate
                            * (float(self.name.purchasegst.percentage) / 100)
                        )
                    )
                    * self.quantity
                )
            )
        else:
            self.stockvalue = None

        super().save(*args, **kwargs)

    def __str__(self):
        return self.name.name


class BranchStock(models.Model):
    name = models.ForeignKey(Products, on_delete=models.CASCADE)
    quantity = models.IntegerField()
    branch = models.ForeignKey(Branch, on_delete=models.PROTECT)
    purchaserate = models.FloatField(null=True, default=None, blank=True)
    salerate = models.FloatField(null=True, default=None, blank=True)
    stockvalue = models.FloatField(null=True, default=None, blank=True)
    created_date = models.DateTimeField(default=timezone.now)

    def save(self, *args, **kwargs):
        if self.quantity is not None and self.purchaserate is not None:
            # self.stockvalue = self.quantity * self.purchaserate
            self.stockvalue = float(
                (
                    (
                        self.purchaserate
                        + (
                            self.purchaserate
                            * (float(self.name.purchasegst.percentage) / 100)
                        )
                    )
                    * self.quantity
                )
            )
        else:
            self.stockvalue = None

        super().save(*args, **kwargs)

    def __str__(self):
        return self.name.name


class StockTransferList(models.Model):
    frombranch = models.ForeignKey(
        Branch, on_delete=models.PROTECT, related_name="frombranch"
    )
    tobranch = models.ForeignKey(
        Branch, on_delete=models.PROTECT, related_name="tobranch"
    )
    product = models.ForeignKey(
        Products, on_delete=models.PROTECT, related_name="stocktransferproduct"
    )
    quantity = models.IntegerField()
    status = models.CharField(max_length=50)
    createddate = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.frombranch} - {self.tobranch} - {self.product} - {self.quantity}"


# stock model ends here

# Registration model ends here


# Purchase Return Modal

class PurchaseReturn(models.Model):
    purchasereturnid = models.CharField(max_length=200)
    invoicenumber = models.CharField(max_length=200)
    purchaseid = models.CharField(max_length=200,default=None, null=True, blank=True)
    supplier = models.ForeignKey(
        Branch,
        on_delete=models.PROTECT,
        related_name="purchasereturnsupplier",
        null=True,
        blank=True,
    )
    externalsupplier = models.ForeignKey(
        Suppliers,
        on_delete=models.PROTECT,
        related_name="purchasereturnsupplier",
        null=True,
        blank=True,
    )
    product = models.ForeignKey(
        Products, on_delete=models.PROTECT, related_name="productnamepurchasereturn"
    )
    returnquantity = models.IntegerField()
    rate = models.FloatField()
    tax = models.ForeignKey(
        Tax, on_delete=models.PROTECT, related_name="productreturntax"
    )
    refundamount = models.FloatField()
    reason = models.CharField(max_length=200, null=True, blank=True)
    totalamount = models.FloatField()
    paymentmode = models.CharField(max_length=200, null=True, blank=True, default=None)
    adjustment = models.FloatField()
    nettotal = models.FloatField()
    totaltax = models.FloatField()
    totalquantity = models.IntegerField()
    createddate = models.DateField(auto_now_add=True)
    status = models.CharField(max_length=200)
    branch = models.ForeignKey(
        Branch, on_delete=models.PROTECT, related_name="purchasereturnbranch"
    )

    def __str__(self):
        return str(self.purchasereturnid)


class SaleReturn(models.Model):
    salereturnid = models.CharField(max_length=200)
    invoicenumber = models.CharField(max_length=200)
    saleid = models.CharField(max_length=200,default=None, null=True, blank=True)
    barcode = models.CharField(max_length=200)
    customer = models.CharField(max_length=200)
    paymentmode = models.CharField(max_length=200, null=True, blank=True, default=None)
    customerid = models.CharField(max_length=200, null=True, blank=True)
    customertype = models.CharField(max_length=200, null=True, blank=True)
    product = models.ForeignKey(
        Products, on_delete=models.PROTECT, related_name="productnamesalereturn"
    )
    returnquantity = models.IntegerField()
    rate = models.FloatField()
    tax = models.ForeignKey(
        Tax, on_delete=models.PROTECT, related_name="saleproductreturntax"
    )
    refundamount = models.FloatField()
    reason = models.CharField(max_length=200, null=True, blank=True)
    totalamount = models.FloatField()
    discount = models.FloatField()
    nettotal = models.FloatField()
    totaltax = models.FloatField()
    totalquantity = models.IntegerField()
    createddate = models.DateField(auto_now_add=True)
    branch = models.ForeignKey(
        Branch, on_delete=models.PROTECT, related_name="salereturnbranch"
    )

    def __str__(self):
        return str(self.salereturnid)


# Purchase model
class Purchase(models.Model):
    name = models.ForeignKey(
        Products, on_delete=models.PROTECT, related_name="productname"
    )
    paymentmode = models.CharField(blank=True, max_length=200, null=True)  # cash or
    supplier = models.ForeignKey(
        Suppliers, on_delete=models.PROTECT, default=None, null=True, blank=True
    )
    invoicenumber = models.CharField(max_length=200)
    invoicedate = models.DateField(default=datetime.now, blank=True)
    barcodenumber = models.CharField(
        max_length=200, default=None, blank=True, null=True, unique=True
    )
    totalquantity = models.IntegerField()
    price = models.FloatField()
    sellingprice = models.FloatField(default=None, null=True, blank=True)
    purchasegst = models.CharField(max_length=200)
    salegst = models.CharField(max_length=200)
    purchaseid = models.CharField(blank=True, max_length=200, null=True)
    branch = models.ForeignKey(Branch, on_delete=models.PROTECT, null=True)
    totalamount = models.FloatField(default=None, null=True, blank=True)
    totaltax = models.FloatField(default=None, null=True, blank=True)
    totalbillingamount = models.FloatField(default=None, null=True, blank=True)
    amountrecieved = models.FloatField(default=None, null=True, blank=True)
    duebalance = models.FloatField(default=None, null=True, blank=True)
    discount = models.FloatField(default=None, null=True, blank=True)
    discountmethod = models.CharField(
        max_length=200, default=None, null=True, blank=True
    )
    createddate = models.DateField(auto_now_add=True)
    mrp = models.FloatField(blank=True, null=True, default=None)
    mop = models.FloatField(blank=True, null=True, default=None)
    invoice_copy = models.ImageField(
        upload_to="images/", default=None, null=True, blank=True
    )
    purchase_type = models.CharField(
        max_length=200, default=None, blank=True, null=True
    )
 

    def __str__(self):
        return str(self.purchaseid)


class BranchPurchase(models.Model):
    name = models.ForeignKey(
        Products, on_delete=models.PROTECT, related_name="branchproductname"
    )
    paymentmode = models.CharField(blank=True, max_length=200, null=True)  # cash or
    supplier = models.ForeignKey(
        Branch,
        on_delete=models.PROTECT,
        related_name="suppliers",
        default=None,
        null=True,
        blank=True,
    )
    externalsupplier = models.ForeignKey(
        Suppliers,
        on_delete=models.PROTECT,
        related_name="external_suppliers",
        default=None,
        null=True,
        blank=True,
    )
    invoicenumber = models.CharField(max_length=200, blank=True, null=True)
    invoicedate = models.DateField(default=datetime.now, blank=True)
    barcodenumber = models.CharField(
        max_length=200, default=None, blank=True, null=True, unique=True
    )
    totalquantity = models.IntegerField()
    price = models.FloatField()
    sellingprice = models.FloatField(default=None, null=True, blank=True)
    purchasegst = models.CharField(max_length=200)
    salegst = models.CharField(max_length=200)
    saleid = models.CharField(blank=True, max_length=200, null=True)
    purchaseid = models.CharField(blank=True, max_length=200, null=True)
    branch = models.ForeignKey(
        Branch, on_delete=models.PROTECT, null=True, related_name="branches"
    )
    totalamount = models.FloatField(default=None, null=True, blank=True)
    totaltax = models.FloatField(default=None, null=True, blank=True)
    totalbillingamount = models.FloatField(default=None, null=True, blank=True)
    amountrecieved = models.FloatField(default=None, null=True, blank=True)
    duebalance = models.FloatField(default=None, null=True, blank=True)
    discount = models.FloatField(default=None, null=True, blank=True)
    discountmethod = models.CharField(
        max_length=200, default=None, null=True, blank=True
    )
    createddate = models.DateField(auto_now_add=True)
    mrp = models.FloatField(blank=True, null=True, default=None)
    mop = models.FloatField(blank=True, null=True, default=None)
    status = models.CharField(max_length=200, default=None, null=True, blank=True)
    purchase_type = models.CharField(
        max_length=200, default=None, null=True, blank=True
    )
    invoice_copy = models.ImageField(
        upload_to="images/", default=None, null=True, blank=True
    )
    supplier_ledger = models.ForeignKey(CoASubAccounts, on_delete=models.PROTECT, related_name="supplier_leger",default=None,null=True,blank=True)


    def __str__(self):
        return str(self.purchaseid)


# Creating a new table here as we cannot display list of items based on unique value
# here the unique value is purchase id. This is a limitation in mysql/sqlite. It can be done with postgress
class PurchaseList(models.Model):
    purchaseid = models.IntegerField()
    invoicenumber = models.CharField(max_length=200)
    invoicedate = models.DateField(default=datetime.now, blank=True)
    supplier = models.CharField(max_length=200)
    # purchasetype = models.CharField(max_length=200)
    branch = models.ForeignKey(Branch, on_delete=models.PROTECT, null=True)
    createddate = models.DateField(auto_now_add=True)
    totalamount = models.FloatField(default=None, null=True, blank=True)
    totalbillingamount = models.FloatField(default=None, null=True, blank=True)
    amountrecieved = models.FloatField(default=None, null=True, blank=True)
    duebalance = models.FloatField(default=None, null=True, blank=True)
    discount = models.IntegerField(default=None, null=True, blank=True)
    discountmethod = models.CharField(
        max_length=200, default=None, null=True, blank=True
    )


class Country(models.Model):
    name = models.CharField(max_length=200, unique=True)
    code = models.CharField(max_length=50, unique=True)
    calling_code = models.CharField(max_length=10, unique=True)
    phone_number_digit = models.IntegerField(default=10)
    default = models.BooleanField(default=False)
    currency = models.CharField(max_length=50, default=None, null=True, blank=True)
    created_date = models.DateTimeField(default=timezone.now)

    def save(self, *args, **kwargs):
        if self.default:
            # Set all other Country instances' default to False
            Country.objects.filter(~Q(id=self.id)).update(default=False)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


# company modal
class Company(models.Model):
    unique_id = models.CharField(max_length=255, unique=True, default=None, null=True)
    company_name = models.CharField(max_length=200)
    address_line1 = models.CharField(max_length=200)
    address_line2 = models.CharField(max_length=200)
    address_line3 = models.CharField(max_length=200)
    # logo_url = models.CharField(max_length=200,null=True,default=None)
    logo_url = models.ImageField(
        upload_to="images/", default=None, null=True, blank=True
    )
    country = models.ForeignKey(
        Country, on_delete=models.PROTECT, null=True, default=None, blank=True
    )
    created_date = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return self.company_name


# User profile model which is for additional fields
class UserProfile(models.Model):
    user = models.OneToOneField(User, null=True, on_delete=models.CASCADE)
    branch = models.ForeignKey(Branch, on_delete=models.PROTECT, related_name="branch")
    mobile = models.CharField(
        max_length=200, default=None
    )  # branch technician phone number
    role = models.CharField(max_length=50, null=True, blank=True)
    company = models.ForeignKey(Company, on_delete=models.PROTECT, null=True)
    permissions = models.CharField(max_length=1000, null=True, default=None)
    sidebar_status = models.CharField(
        max_length=10, null=True, default="", blank=True
    )
    created_date = models.DateTimeField(default=timezone.now)

    def set_permissions(self, permission_list):
        self.permissions = json.dumps(permission_list)

    def get_permissions(self):
        return json.loads(self.permissions)

    def __str__(self):
        return self.user.username


# Customers model
class Customers(models.Model):
    unique_id = models.CharField(max_length=255, unique=True, default=None, null=True)
    firstname = models.CharField(max_length=200)
    lastname = models.CharField(max_length=200)
    phone = models.CharField(max_length=200)
    phonemodel = models.CharField(max_length=200, null=True)
    purchasedate = models.DateField(max_length=200, default=None, null=True, blank=True)
    address = models.TextField(null=True)
    dob = models.DateField(default=None, null=True, blank=True)
    addedby = models.ForeignKey(User, on_delete=models.PROTECT, null=None)
    branch = models.ForeignKey(Branch, on_delete=models.PROTECT, null=None)
    createddate = models.DateField(auto_now_add=True)
    vatnumber = models.CharField(max_length=200, default=None, null=True)
    customertype = models.CharField(max_length=200, default=None, null=True)

    class Meta:
        unique_together = ("phone", "branch")

    def __str__(self):
        return self.firstname


# Purchase model


class Sale(models.Model):
    name = models.ForeignKey(
        Products, on_delete=models.PROTECT, related_name="saleproductname"
    )
    paymentmode = models.CharField(blank=True, max_length=200, null=True)
    customer = models.CharField(max_length=200, blank=True, null=True, default=None)
    customerid = models.IntegerField(blank=True, null=True, default=None)
    customertype = models.CharField(max_length=200, blank=True, null=True, default=None)
    invoicenumber = models.CharField(max_length=200)
    invoicedate = models.DateField(default=timezone.now, blank=True)
    barcodenumber = models.CharField(
        max_length=200, default=None, blank=True, null=True
    )
    totalquantity = models.IntegerField()
    price = models.FloatField()
    salegst = models.CharField(max_length=200)
    saleid = models.CharField(blank=True, max_length=200, null=True)
    branch = models.ForeignKey(
        Branch, on_delete=models.PROTECT, null=True, related_name="branch_sales"
    )
    totalamount = models.FloatField(default=None, null=True, blank=True)
    totaltax = models.FloatField(default=None, null=True, blank=True)
    totalbillingamount = models.FloatField(default=None, null=True, blank=True)
    amountrecieved = models.FloatField(default=None, null=True, blank=True)
    duebalance = models.FloatField(default=None, null=True, blank=True)
    discount = models.IntegerField(default=None, null=True, blank=True)
    discountmethod = models.CharField(
        max_length=200, default=None, null=True, blank=True
    )
    createddate = models.DateField(auto_now_add=True)
    mrp = models.FloatField(blank=True, null=True)
    mop = models.FloatField(blank=True, null=True)
    status = models.CharField(max_length=50, blank=True, null=True)
    added_by = models.ForeignKey(
        User,
        null=True,
        on_delete=models.PROTECT,
        default=None,
        blank=True,
        related_name="sales",
    )
    customer_gst_number = models.CharField(
        max_length=50, default=None, blank=True, null=True
    )
    installation_cost = models.FloatField(default=0, null=True, blank=True)
    installation_tax = models.FloatField(default=0, null=True, blank=True)
    purchase_price = models.FloatField(default=0,null=True,blank=True)
    purchase_tax = models.FloatField(default=0,null=True,blank=True)
    customer_ledger = models.ForeignKey(CoASubAccounts, on_delete=models.PROTECT, related_name="customer_leger",default=None,null=True,blank=True)

    def __str__(self):
        return str(self.saleid)


# Unique id generator modal
class UniqueIdGenerator(models.Model):
    model = models.CharField(max_length=200, unique=True)
    prefix = models.CharField(max_length=200, unique=True)
    uniqueid = models.BigIntegerField()
    created_date = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return self.model


class Transaction(models.Model):
    transactionid = models.CharField(blank=True, max_length=200, null=True)
    paymentmode = models.CharField(max_length=200, null=True, blank=True)
    createddate = models.DateField(auto_now_add=True)
    amount = models.FloatField(null=True, blank=True, default=None)
    transactiontype = models.CharField(max_length=50)
    branch = models.ForeignKey(Branch, on_delete=models.PROTECT, null=True)
    invoice_number = models.CharField(
        default=None, blank=True, max_length=200, null=True
    )
    accounts = models.CharField(default=None, blank=True, max_length=200, null=True)
    remarks = models.CharField(default=None, blank=True, max_length=200, null=True)
    transactiondate = models.DateField(null=True, blank=True, default=None)


    def __str__(self):
        return str(self.transactionid)

class Expenses(models.Model):
    expenseid = models.CharField(blank=True, max_length=200, null=True)
    expensedate = models.DateField(max_length=200, default=None, null=True, blank=True)
    expensetype = models.CharField(blank=True, max_length=200, null=True)
    expensecategory = models.CharField(blank=True, max_length=200, null=True)
    remarks = models.CharField(blank=True, max_length=2000, null=True)
    amount = models.FloatField()
    branch = models.ForeignKey(
        Branch, on_delete=models.PROTECT, related_name="expenses"
    )
    billnumber = models.CharField(blank=True, max_length=200, null=True)
    paymentmode = models.CharField(blank=True, max_length=200, null=True)
    created_date = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return self.expenseid


class Payments(models.Model):
    paymentid = models.CharField(blank=True, max_length=200, null=True)
    referenceno = models.CharField(blank=True, max_length=200, null=True)
    paymentdate = models.DateField(max_length=200, default=None, null=True, blank=True)
    creditaccount = models.CharField(blank=True, max_length=200, null=True)
    # debitaccount = models.CharField(blank=True, max_length=200, null=True)
    # creditaccount = models.ForeignKey(CoASubAccounts, on_delete=models.PROTECT, related_name="creditaccount_payment",default=None,null=True,blank=True)
    debitaccount = models.ForeignKey(CoASubAccounts, on_delete=models.PROTECT, related_name="debitaccount_payment",default=None,null=True,blank=True)
    narration = models.CharField(blank=True, max_length=2000, null=True)
    amount = models.FloatField()
    branch = models.ForeignKey(Branch, on_delete=models.PROTECT, related_name="payment")
    description = models.CharField(blank=True, max_length=200, null=True)
    paymentmode = models.CharField(blank=True, max_length=200, null=True)
    created_date = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return self.paymentid


class Journals(models.Model):
    journalid = models.CharField(blank=True, max_length=200, null=True)
    referenceno = models.CharField(blank=True, max_length=200, null=True)
    journaldate = models.DateField(max_length=200, default=None, null=True, blank=True)
    creditaccount = models.ForeignKey(CoASubAccounts, on_delete=models.PROTECT, related_name="creditaccount_journal",default=None,null=True,blank=True)
    debitaccount = models.ForeignKey(CoASubAccounts, on_delete=models.PROTECT, related_name="debitaccount_journal",default=None,null=True,blank=True)
    narration = models.CharField(blank=True, max_length=2000, null=True)
    amount = models.FloatField()
    branch = models.ForeignKey(Branch, on_delete=models.PROTECT, related_name="journal")
    description = models.CharField(blank=True, max_length=200, null=True)
    mode = models.CharField(blank=True, max_length=200, null=True)
    created_date = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return self.journalid


class Receipts(models.Model):
    receiptid = models.CharField(blank=True, max_length=200, null=True)
    referenceno = models.CharField(blank=True, max_length=200, null=True)
    receiptdate = models.DateField(max_length=200, default=None, null=True, blank=True)
    # creditaccount = models.CharField(blank=True, max_length=200, null=True)
    debitaccount = models.CharField(blank=True, max_length=200, null=True)
    creditaccount = models.ForeignKey(CoASubAccounts, on_delete=models.PROTECT, related_name="creditaccount_receipt",default=None,null=True,blank=True)
    # debitaccount = models.ForeignKey(CoASubAccounts, on_delete=models.PROTECT, related_name="debitaccount_receipt",default=None,null=True,blank=True)
    narration = models.CharField(blank=True, max_length=2000, null=True)
    amount = models.FloatField()
    branch = models.ForeignKey(Branch, on_delete=models.PROTECT, related_name="receipt")
    description = models.CharField(blank=True, max_length=200, null=True)
    receiptmode = models.CharField(blank=True, max_length=200, null=True)
    created_date = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return self.receiptid


class CustomerBookingRepair(models.Model):
    bookingid = models.CharField(max_length=200, default=None, null=True, blank=True)
    name = models.CharField(max_length=200)
    email = models.CharField(max_length=200, null=True, blank=True)
    phone = models.CharField(max_length=50)
    city = models.CharField(max_length=50, null=True, blank=True)
    brand = models.CharField(max_length=50)
    issue = models.TextField(null=True, blank=True, default=None)
    created_date = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=50, default=None, null=True)
    product = models.CharField(max_length=50, default=None, null=True)
    assigned_to = models.ForeignKey(
        User, null=True, on_delete=models.PROTECT, default=None, blank=True
    )
    branch = models.ForeignKey(
        Branch,
        null=True,
        related_name="customer_booking",
        on_delete=models.PROTECT,
        default=None,
        blank=True,
    )
    latitude = models.CharField(max_length=100, null=True, blank=True)
    longitude = models.CharField(max_length=100, null=True, blank=True)
    address = models.TextField(null=True, blank=True)
    modal = models.CharField(max_length=50, default=None, null=True, blank=True)

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        if not self.bookingid:
            self.bookingid = f"BK{self.id}"
            super().save(*args, **kwargs)

    def __str__(self):
        return self.bookingid


class Service(models.Model):
    servicerefnumber = models.CharField(max_length=200, unique=True)
    invoicenumber = models.CharField(
        max_length=200, unique=True, default=None, null=True, blank=True
    )
    customerid = models.CharField(blank=True, max_length=200, null=True)
    firstname = models.CharField(max_length=200)
    lastname = models.CharField(blank=True, max_length=200, null=True)
    address = models.TextField(null=True, blank=True)
    phone = models.CharField(max_length=200, default=None, null=True, blank=True)
    memodate = models.DateField(blank=True, null=True)
    expecteddate = models.DateField(blank=True, null=True)
    product = models.CharField(blank=True, max_length=200, null=True)
    brand = models.CharField(blank=True, max_length=200, null=True)
    model = models.CharField(blank=True, max_length=200, null=True)
    series = models.CharField(blank=True, max_length=200, null=True,default=None)
    imei = models.CharField(blank=True, max_length=200, null=True)
    servicecharge = models.FloatField(null=True, blank=True)
    problem = models.TextField(null=True, blank=True)
    remarks = models.TextField(null=True, blank=True)
    status = models.CharField(null=True, max_length=200, blank=True)
    warrenty = models.CharField(null=True, max_length=200, blank=True)
    totalamount = models.FloatField(null=True, blank=True)
    totaltax = models.FloatField(null=True, blank=True)
    discount = models.FloatField(null=True, blank=True)
    finalamount = models.FloatField(null=True, blank=True)
    amountrecieved = models.FloatField(null=True, blank=True)
    duebalance = models.FloatField(null=True, blank=True)
    branch = models.ForeignKey(
        Branch, on_delete=models.PROTECT, null=True, related_name="services"
    )
    createddate = models.DateField(auto_now_add=True)
    modifieddate = models.DateField(auto_now_add=True)
    accessories = models.CharField(null=True, max_length=200, blank=True)
    paymentmode = models.CharField(blank=True, max_length=50, null=True)
    image1 = models.ImageField(upload_to="images/", default=None, null=True, blank=True)
    image2 = models.ImageField(upload_to="images/", default=None, null=True, blank=True)
    image3 = models.ImageField(upload_to="images/", default=None, null=True, blank=True)
    image4 = models.ImageField(upload_to="images/", default=None, null=True, blank=True)
    image5 = models.ImageField(upload_to="images/", default=None, null=True, blank=True)
    image6 = models.ImageField(upload_to="images/", default=None, null=True, blank=True)
    technician = models.ForeignKey(
        User,
        on_delete=models.PROTECT,
        related_name="service",
        null=True,
        default=None,
        blank=True,
    )
    rack_no = models.CharField(max_length=200, null=True, blank=True)
    shedule_call = models.DateTimeField(null=True, default=None, blank=True)
    reject_code = models.CharField(max_length=50, default=None, null=True)
    technician_remark = models.TextField(default=None, null=True)
    qcok = models.CharField(max_length=2000, default=None, null=True, blank=True)
    qcnotok = models.CharField(max_length=2000, default=None, null=True, blank=True)
    qcremark = models.TextField(default=None, null=True, blank=True)
    qc = models.ForeignKey(
        User,
        on_delete=models.PROTECT,
        related_name="service_qc",
        null=True,
        default=None,
        blank=True,
    )
    cnp = models.ForeignKey(
        User,
        on_delete=models.PROTECT,
        related_name="service_cnp",
        null=True,
        default=None,
        blank=True,
    )
    frontdesk = models.ForeignKey(
        User,
        on_delete=models.PROTECT,
        related_name="service_frontdesk",
        null=True,
        default=None,
        blank=True,
    )
    entry_by = models.ForeignKey(
        User,
        on_delete=models.PROTECT,
        related_name="service_entries",
        null=True,
        default=None,
        blank=True,
    )
    entry_type = models.CharField(max_length=50, default=None, null=True, blank=True)
    entry_validated = models.BooleanField(default=True)
    barcode_number = models.CharField(
        max_length=200, default=None, null=True, blank=True
    )
    servicetax = models.FloatField(null=True, blank=True, default=None)
    pattern = models.CharField(max_length=50, default=None, null=True, blank=True)
    booking = models.ForeignKey(
        CustomerBookingRepair,
        on_delete=models.PROTECT,
        related_name="service",
        null=True,
        default=None,
        blank=True,
    )
    screen_password = models.CharField(
        max_length=50, default=None, null=True, blank=True
    )
    customer_gst_number = models.CharField(
        max_length=50, default=None, blank=True, null=True
    )
    customertype = models.CharField(max_length=50, default=None, blank=True, null=True)
    invoicedate = models.DateTimeField(default=timezone.now, blank=True,null=True)
    discountmethod = models.CharField(max_length=50, default='Flat', blank=True, null=True)
    discountpercentage = models.FloatField(null=True, blank=True, default=None)



    def set_accessories(self, accessories):
        self.accessories = json.dumps(accessories)

    def get_accessories(self):
        return json.loads(self.accessories)

    def set_qcok(self, qcok_list):
        self.qcok = json.dumps(qcok_list)

    def get_qcok(self):
        return json.loads(self.qcok)

    def set_qcnotok(self, qcnotok_list):
        self.qcnotok = json.dumps(qcnotok_list)

    def get_qcnotok(self):
        return json.loads(self.qcnotok)

    def __str__(self):
        return self.servicerefnumber



class ServiceDiscountDetails(models.Model):
    servicerefnumber = models.CharField(max_length=200, blank=True, null=True)
    sparetotal_excltax_afterdiscount  = models.FloatField(default=0,null=True,blank=True)
    sparetaxtotal_afterdiscount = models.FloatField(default=0,null=True,blank=True)
    sparetotal_excltax_beforediscount  = models.FloatField(default=0,null=True,blank=True)
    sparetaxtotal_beforediscount = models.FloatField(default=0,null=True,blank=True)
    servivcecost_excltax_afterdiscount = models.FloatField(default=0,null=True,blank=True)
    servicetaxtotal_afterdiscount = models.FloatField(default=0,null=True,blank=True)
    servivcecost_excltax_beforediscount = models.FloatField(default=0,null=True,blank=True)
    servicetaxtotal_beforediscount = models.FloatField(default=0,null=True,blank=True)
    discount_type =  models.CharField(max_length=200, blank=True, null=True)
    discount =  models.FloatField(default=0,null=True,blank=True)
    created_date =  models.DateTimeField(auto_now_add=True)
    last_modified_date =  models.DateTimeField(default=None, null=True, blank=True)

    def __str__(self):
        return self.servicerefnumber
    


class ServiceHistory(models.Model):
    service = models.ForeignKey(
        Service, on_delete=models.CASCADE, related_name="service_history"
    )
    description = models.CharField(max_length=10000, null=True, blank=True)
    created_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.service


class ServiceInformations(models.Model):
    service = models.ForeignKey(
        Service, on_delete=models.CASCADE, related_name="service_info"
    )
    created_date = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="service_info"
    )
    info = models.CharField(max_length=2000, null=True)

    def __str__(self):
        return self.service


class ServiceCallLogs(models.Model):
    service = models.ForeignKey(
        Service, on_delete=models.CASCADE, related_name="call_logs"
    )
    created_date = models.DateTimeField(auto_now_add=True)
    remark = models.CharField(max_length=1000, null=True)

    def __str__(self):
        return self.service


class ScheduleCallNotifications(models.Model):
    message = models.TextField(default=None, null=True)
    user = models.ForeignKey(
        User, on_delete=models.PROTECT, related_name="notifications"
    )
    serviceref = models.CharField(max_length=200, null=True)
    service = models.ForeignKey(
        Service,
        on_delete=models.CASCADE,
        related_name="schedule_call_notifications",
        default=None,
        null=True,
    )
    created_date = models.DateTimeField(auto_now_add=True)
    notification_type = models.CharField(max_length=200)
    status = models.CharField(max_length=200)
    shedule_call = models.DateTimeField(null=True, blank=True)
    seen = models.BooleanField(default=False)
    sent = models.BooleanField(default=False)

    def __str__(self):
        return self.serviceref


class BroadcastNotification(models.Model):
    message = models.TextField()
    broadcast_on = models.DateTimeField()
    sent = models.BooleanField(default=False)
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="broadcast_notifications"
    )
    created_date = models.DateTimeField(default=timezone.now)
    notification_type = models.CharField(max_length=50, null=True, default=None)
    notification_id = models.CharField(max_length=50, null=True, default=None)
    active = models.BooleanField(default=True)
    seen = models.BooleanField(default=False)

    class Meta:
        ordering = ["-broadcast_on"]


class SpareParts(models.Model):
    name = models.ForeignKey(Products, on_delete=models.PROTECT)
    servicerefnumber = models.CharField(max_length=200, blank=True, null=True)
    # paymentmode = models.CharField(blank=True, max_length=200, null=True)
    customerid = models.CharField(max_length=200, blank=True, null=True)
    barcodenumber = models.CharField(
        max_length=200, default=None, blank=True, null=True
    )
    totalquantity = models.IntegerField(blank=True, null=True)
    price = models.FloatField(blank=True, null=True)
    mrp = models.FloatField(blank=True, null=True)
    mop = models.FloatField(blank=True, null=True)
    salegst = models.CharField(max_length=200, blank=True, null=True)
    branch = models.ForeignKey(Branch, on_delete=models.PROTECT, null=True)
    createddate = models.DateField(auto_now_add=True)
    paymentmode = models.CharField(blank=True, max_length=50, null=True)
    purchase_price = models.FloatField(default=0,null=True,blank=True)
    purchase_tax = models.FloatField(default=0,null=True,blank=True)

    def __str__(self):
        return self.servicerefnumber


class SpareRequests(models.Model):
    spare = models.ForeignKey(Products, on_delete=models.CASCADE)
    service = models.ForeignKey(
        Service, on_delete=models.CASCADE, related_name="requested_spares"
    )
    created_date = models.DateTimeField(default=timezone.now)
    service_created_date = models.DateTimeField()
    service_estimated_date = models.DateTimeField(null=True, blank=True)
    status = models.CharField(max_length=50, null=True, blank=True, default=None)
    requested_qty = models.IntegerField()
    requested_by = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="spare_requests"
    )
    barcodenumber = models.CharField(
        max_length=200, default=None, blank=True, null=True
    )
    price = models.FloatField(blank=True, null=True, default=None)
    mrp = models.FloatField(blank=True, null=True, default=None)
    mop = models.FloatField(blank=True, null=True, default=None)
    salegst = models.ForeignKey(
        Tax,
        on_delete=models.PROTECT,
        related_name="sparerequest",
        null=True,
        blank=True,
        default=None,
    )
    branch = models.ForeignKey(
        Branch,
        on_delete=models.PROTECT,
        related_name="branch_sparerequests",
        null=True,
        blank=True,
        default=None,
    )
    purchase_price = models.FloatField(default=0,null=True,blank=True)
    purchase_tax = models.FloatField(default=0,null=True,blank=True)

    def __str__(self):
        return str(self.service.servicerefnumber)


class ServiceChargeRequests(models.Model):
    service = models.ForeignKey(
        Service, on_delete=models.CASCADE, related_name="requested_service_charge"
    )
    created_date = models.DateTimeField(default=timezone.now)
    status = models.CharField(max_length=50, null=True, blank=True, default=None)
    requested_by = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="service_charge_requests",
        default=None,
        null=True,
        blank=True,
    )
    charge = models.FloatField()
    branch = models.ForeignKey(
        Branch,
        on_delete=models.PROTECT,
        related_name="branch_servicechargerequests",
        null=True,
        blank=True,
        default=None,
    )

    def __str__(self):
        return str(self.service.servicerefnumber)


class ExpenseCategory(models.Model):
    name = models.CharField(max_length=200)
    branch = models.ForeignKey(
        Branch,
        on_delete=models.PROTECT,
        related_name="expensecategory",
        null=True,
        blank=True,
        default=None,
    )
    created_date = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return self.name


class ExpenseType(models.Model):
    category = models.ForeignKey(ExpenseCategory, on_delete=models.CASCADE)
    name = models.CharField(max_length=200)
    branch = models.ForeignKey(
        Branch,
        on_delete=models.PROTECT,
        related_name="expensetype",
        null=True,
        blank=True,
        default=None,
    )
    created_date = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return self.name



class Rack(models.Model):
    name = models.CharField(max_length=200)
    branch = models.ForeignKey(
        Branch,
        on_delete=models.PROTECT,
        related_name="rack_nos",
        null=True,
        blank=True,
        default=None,
    )
    # serviceref =models.CharField(max_length=200,null=True,blank=True)
    created_date = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return self.name


# Accounts
class Ledger(models.Model):
    date = models.DateField()
    refernceno = models.CharField(max_length=200)
    narration = models.CharField(max_length=200)
    account_type = models.CharField(max_length=200)
    account_head = models.CharField(max_length=200)
    account_subhead = models.CharField(max_length=200)
    debit_amount = models.FloatField()
    credit_amount = models.FloatField()
    customer_or_vendor = models.CharField(max_length=200)
    branch = models.CharField(max_length=200)
    created_date = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return self.account_head


class GeneralLedger(models.Model):
    date = models.DateField()
    voucher_no = models.CharField(max_length=200)
    voucher_id = models.CharField(max_length=200)
    voucher_type = models.CharField(max_length=200)
    description = models.CharField(max_length=200)
    amount = models.FloatField()
    amount_type = models.CharField(max_length=200)
    ledger = models.ForeignKey(AccountLedger, on_delete=models.PROTECT)
    subledger = models.ForeignKey(CoASubAccounts, on_delete=models.PROTECT)
    branch = models.ForeignKey(
        Branch, on_delete=models.PROTECT, related_name="general_ledger"
    )
    created_date = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return self.voucher_no 


class CashBook(models.Model):
    branch = models.CharField(max_length=200)
    payment = models.FloatField()
    receipt = models.FloatField()
    mode = models.CharField(max_length=200)
    date = models.DateField(default=timezone.now)
    description = models.CharField(max_length=200)
    created_date = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return self.description





class SingleLedger(models.Model):
    account_head = models.CharField(max_length=200)
    narration = models.CharField(max_length=200)
    date = models.DateField()
    amount = models.FloatField()
    account_type = models.CharField(max_length=200)
    branch = models.CharField(max_length=200)
    created_date = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return self.narration


### End Accounts


class City(models.Model):
    country = models.ForeignKey(
        Country, on_delete=models.CASCADE, related_name="cities"
    )
    name = models.CharField(max_length=200)
    code = models.CharField(max_length=50, unique=True)
    created_date = models.DateTimeField(default=timezone.now)

    class Meta:
        unique_together = ("country", "name")

    def __str__(self):
        return self.name


class ServiceIssues(models.Model):
    name = models.CharField(max_length=200, unique=True)
    code = models.CharField(max_length=50, unique=True)
    created_date = models.DateTimeField(default=timezone.now)
    arabic_name = models.TextField(max_length=200, default=None, null=True, blank=True)

    def __str__(self):
        return self.name


class ServiceProduct(models.Model):
    name = models.CharField(max_length=200, unique=True)
    code = models.CharField(max_length=50, unique=True)
    arabic_name = models.TextField(max_length=200, default=None, null=True, blank=True)
    created_date = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return self.name


class PhoneBrand(models.Model):
    product = models.ForeignKey(
        ServiceProduct,
        on_delete=models.CASCADE,
        related_name="brands",
        default=None,
        null=True,
        blank=True,
    )
    name = models.CharField(max_length=200)
    code = models.CharField(max_length=50, unique=True)
    arabic_name = models.TextField(max_length=200, default=None, null=True, blank=True)
    created_date = models.DateTimeField(default=timezone.now)

    class Meta:
        unique_together = ("product", "name")

    def __str__(self):
        return self.name


class PhoneModal(models.Model):
    product = models.ForeignKey(
        ServiceProduct,
        on_delete=models.CASCADE,
        related_name="modals",
        default=None,
        null=True,
        blank=True,
    )
    brand = models.ForeignKey(
        PhoneBrand, on_delete=models.CASCADE, related_name="modals"
    )
    name = models.CharField(max_length=200)
    code = models.CharField(max_length=50, unique=True)
    arabic_name = models.TextField(max_length=200, default=None, null=True, blank=True)
    created_date = models.DateTimeField(default=timezone.now)

    class Meta:
        unique_together = ("brand", "name")

    def __str__(self):
        return self.name


class ServiceCharge(models.Model):
    product = models.ForeignKey(
        ServiceProduct,
        on_delete=models.CASCADE,
        related_name="servicecharge",
        default=None,
        null=True,
        blank=True,
    )
    brand = models.ForeignKey(PhoneBrand, on_delete=models.CASCADE)
    modal = models.ForeignKey(PhoneModal, on_delete=models.CASCADE)
    issue = models.ForeignKey(ServiceIssues, on_delete=models.CASCADE)
    charge = models.FloatField()
    created_date = models.DateTimeField(default=timezone.now)

    class Meta:
        unique_together = ("product", "brand", "modal", "issue")

    def __str__(self):
        return str(self.charge)


class ServiceChat(models.Model):
    service = models.ForeignKey(
        Service, on_delete=models.CASCADE, related_name="service_chat"
    )
    chat_message = models.TextField()
    created_date = models.DateTimeField(default=timezone.now)
    user = models.ForeignKey(
        User, null=True, on_delete=models.PROTECT, default=None, blank=True
    )

    def __str__(self):
        return self.service


class ServiceTax(models.Model):
    tax = models.FloatField()
    created_date = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return str(self.tax)


class PaymentMode(models.Model):
    name = models.CharField(max_length=50, unique=True)
    created_date = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return str(self.name)


class StockTransaction(models.Model):
    product = models.ForeignKey(
        Products, on_delete=models.CASCADE, related_name="stock_transaction"
    )
    initial_quantity = models.IntegerField()
    purchase_rate = models.FloatField()
    purchase_tax = models.ForeignKey(
        Tax, on_delete=models.PROTECT, related_name="stock_transaction_purchase"
    )
    sale_rate = models.FloatField()
    sale_tax = models.ForeignKey(
        Tax, on_delete=models.PROTECT, related_name="stock_transaction_sale"
    )
    quantity = models.IntegerField()
    transaction_value = models.FloatField()
    transactiontype = models.CharField(max_length=50)
    branch = models.ForeignKey(
        Branch, on_delete=models.PROTECT, related_name="stock_transaction"
    )
    created_date = models.DateTimeField(default=timezone.now)
    reference_number = models.CharField(max_length=200,default=None,null=True,blank=True)
    transaction_category = models.CharField(max_length=200,default=None,null=True,blank=True)

    def save(self, *args, **kwargs):
        if self.product is not None:
            self.purchase_rate = self.product.price
            self.purchase_tax = self.product.purchasegst
            self.sale_rate = self.product.sellingprice
            self.sale_tax = self.product.salegst

            if self.quantity is not None:

                self.transaction_value = float(
                    (
                        (
                            self.product.price
                            + (
                                self.product.price
                                * (float(self.product.purchasegst.percentage) / 100)
                            )
                        )
                        * self.quantity
                    )
                )

        super().save(*args, **kwargs)

    def __str__(self):
        return self.product.name


class Language(models.Model):
    language = models.CharField(max_length=20, default="en", null=True, blank=True)
    created_date = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return self.language


class ProductPriceList(models.Model):
    brand = models.CharField(max_length=100)
    modal = models.CharField(max_length=100)
    product = models.CharField(max_length=100)
    price1 = models.CharField(max_length=100)
    price2 = models.CharField(max_length=100)
    price3 = models.CharField(max_length=100)
    created_date = models.DateTimeField(auto_now_add=True)
    modified_date = models.DateTimeField(default=None, null=True, blank=True)
    branch = models.ForeignKey(
        Branch, on_delete=models.CASCADE, related_name="productpricelist"
    )
    added_by = models.ForeignKey(
        User, on_delete=models.PROTECT, related_name="productpricelist"
    )

    def __str__(self):
        return f"{self.product.brand} {self.product.modal} {self.product.product}"


class LiveStreamUrl(models.Model):
    url = models.CharField(max_length=200, default=None, null=True, blank=True)
    created_date = models.DateTimeField(default=timezone.now)

    # def __str__(self):
    #     return self.url


class InstallationTax(models.Model):
    tax = models.FloatField()
    created_date = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return str(self.tax)


# @receiver(pre_delete, sender=Tax)
# def prevent_tax_delete_if_related_exists(sender, instance, **kwargs):
#     print("deleted", instance, instance.branch)
#     if (
#         Products.objects.filter(
#             Q(purchasegst=instance) & Q(branch=instance.branch)
#         ).exists()
#         or Products.objects.filter(
#             Q(salegst=instance) & Q(branch=instance.branch)
#         ).exists()
#         or Sale.objects.filter(
#             Q(salegst=instance.name) & Q(branch=instance.branch)
#         ).exists()
#         or Purchase.objects.filter(
#             Q(purchasegst=instance.name) & Q(branch=instance.branch)
#         ).exists()
#         or Purchase.objects.filter(
#             Q(salegst=instance.name) & Q(branch=instance.branch)
#         ).exists()
#         or BranchPurchase.objects.filter(
#             Q(purchasegst=instance.name) & Q(branch=instance.branch)
#         ).exists()
#         or BranchPurchase.objects.filter(
#             Q(salegst=instance.name) & Q(branch=instance.branch)
#         ).exists()
#     ):

#         raise ValidationError(
#             "Cannot delete Tax entry as it is referenced by Product entries."
#         )


# @receiver(pre_save, sender=Tax)
# def prevent_tax_update_if_related_exists(sender, instance, **kwargs):
#     if instance.pk:  # If the Tax instance already exists (not a new entry)
#         old_instance = Tax.objects.get(pk=instance.pk)
#         if (
#             Sale.objects.filter(
#                 Q(salegst=old_instance.name) & Q(branch=old_instance.branch)
#             ).exists()
#             or Purchase.objects.filter(
#                 Q(purchasegst=old_instance.name) & Q(branch=old_instance.branch)
#             ).exists()
#             or Purchase.objects.filter(
#                 Q(salegst=old_instance.name) & Q(branch=old_instance.branch)
#             ).exists()
#             or BranchPurchase.objects.filter(
#                 Q(purchasegst=old_instance.name) & Q(branch=old_instance.branch)
#             ).exists()
#             or BranchPurchase.objects.filter(
#                 Q(salegst=old_instance.name) & Q(branch=old_instance.branch)
#             ).exists()
#         ):
#             raise ValidationError(
#                 "Cannot update Tax entry as it is referenced by Sale,Purchase or BranchPurchase entries."
#             )


# @receiver(pre_delete, sender=Products)
# def prevent_product_delete_if_related_exists(sender, instance, **kwargs):
#     if (
#         Sale.objects.filter(name=instance).exists()
#         or Purchase.objects.filter(name=instance).exists()
#         or BranchPurchase.objects.filter(name=instance).exists()
#     ):
#         raise ValidationError(
#             "Cannot delete Product entry as it is referenced by Sale,Purchase or BranchPurchase entries."
#         )


# @receiver(pre_save, sender=Products)
# def prevent_product_update_if_related_exists(sender, instance, **kwargs):
#     if instance.pk:  # If the Product instance already exists (not a new entry)
#         old_instance = Products.objects.get(pk=instance.pk)
#         if (
#             Sale.objects.filter(name=old_instance).exists()
#             or Purchase.objects.filter(name=old_instance).exists()
#             or BranchPurchase.objects.filter(name=old_instance).exists()
#         ):
#             raise ValidationError(
#                 "Cannot update Product entry as it is referenced by Sale,Purchase or BranchPurchase entries."
#             )


class StockAdjustment(models.Model):
    sa_number = models.CharField(max_length=100)
    product = models.ForeignKey(
        Products, on_delete=models.PROTECT, related_name="stock_adjustment"
    )
    adjustment = models.CharField(max_length=100)
    quantity = models.IntegerField()
    reason = models.CharField(max_length=100)
    created_date = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=100)
    branch = models.ForeignKey(Branch, on_delete=models.PROTECT, default=None)
    purchase_rate = models.FloatField(default=None, null=True, blank=True)
    sale_rate = models.FloatField(default=None, null=True, blank=True)
    purchase_tax = models.FloatField(default=None, null=True, blank=True)
    sale_tax = models.FloatField(default=None, null=True, blank=True)

    def __str__(self):
        return self.sa_number


class BroadcastNotificationMobileApp(models.Model):
    message = models.TextField()
    broadcast_on = models.DateTimeField()
    sent = models.BooleanField(default=False)
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="broadcast_notifications_mob"
    )
    created_date = models.DateTimeField(default=timezone.now)
    notification_type = models.CharField(max_length=50, null=True, default=None)
    notification_id = models.CharField(max_length=50, null=True, default=None)
    active = models.BooleanField(default=True)
    seen = models.BooleanField(default=False)

    class Meta:
        ordering = ["-broadcast_on"]


# def save(self, *args, **kwargs):
#     if self.default:
#         # Set all other Country instances' default to False
#         Country.objects.filter(~Q(id=self.id)).update(default=False)
#     super().save(*args, **kwargs)


class PageSize(models.Model):
    size = models.CharField(max_length=50)
    created_date = models.DateTimeField(default=timezone.now)
    active = models.BooleanField(default=False)

    def save(self, *args, **kwargs):
        if self.active:
            PageSize.objects.filter(~Q(id=self.id)).update(active=False)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.size


class WhatsappStatus(models.Model):
    active = models.BooleanField(default=False)
    created_date = models.DateTimeField(default=timezone.now)

    def __str__(self):
        if self.active == True:
            return "Active"
        else:
            return "InActive"





