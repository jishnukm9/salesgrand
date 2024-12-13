"""sensefrog URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.contrib import admin
from django.urls import path, include
from core.views import *
from django.conf.urls import handler500, handler404
from django.conf import settings
from django.conf.urls.static import static


admin.site.site_header = "Salesgrand Authentication"
admin.site.site_title = "Salesgrand Authentication"
admin.site.index_title = "Salesgrand Authentication"
handler404 = "core.views.custom_404"
handler500 = "core.views.custom_500"

urlpatterns = [
    path("accounts/", include("django.contrib.auth.urls")),
    path("admin/", admin.site.urls),
    path("api-auth/", include("api.urls")),
    path("myprofile/", myprofile, name="myprofile"),
    path("userdetails/<id>", userdetails, name="userdetails"),
    path("userupdateform/<id>", userupdateform, name="userupdateform"),
    path("userupdate", userupdate, name="userupdate"),
    path("update_user_status/", update_user_status, name="update_user_status"),
    path("get_user_by_branch/", get_user_by_branch, name="get_user_by_branch"),
    path(
        "get_technician_by_branch/",
        get_technician_by_branch,
        name="get_technician_by_branch",
    ),
    path("deletecustomer/<id>", deletecustomer, name="deletecustomer"),
    path("get_customers_monthly/", get_customers_monthly, name="get_customers_monthly"),
    path("get_purchase_monthly/", get_purchase_monthly, name="get_purchae_monthly"),
    path("get_sales_monthly/", get_sales_monthly, name="get_sales_monthly"),
    path("", index, name="index"),
    path("products/", products, name="products"),
    path("productform/", productForm, name="productform"),
    path("addproduct/", addProduct, name="addproduct"),
    path("catagories/", catagories, name="catagories"),
    path("catagoryform/", catagoryForm, name="catagoryform"),
    path("addcatagory/", addCatagory, name="addcatagory"),
    path("subcatagories/", subCatagories, name="subcatagories"),
    path("subcatagoryform/", subCatagoryForm, name="subcatagoryform"),
    path("addsubcatagory/", addSubCatagory, name="addsubcatagory"),
    path("supplier/", supplier, name="supplier"),
    path("supplierform/", supplierForm, name="supplierform"),
    path("addsupplier/<page>/", addSupplier, name="addsupplier"),
    path("brand/", brand, name="brand"),
    path("brandform/", brandForm, name="brandform"),
    path("addbrand/", addBrand, name="addbrand"),
    path("packing/", packing, name="packing"),
    path("packingform/", packingForm, name="packingform"),
    path("addpacking/", addPacking, name="addpacking"),
    path("tax/", tax, name="tax"),
    path("taxform/", taxForm, name="taxform"),
    path("addtax/", addTax, name="addtax"),
    path("type/", type, name="type"),
    path("typeform/", typeForm, name="typeform"),
    path("addtype/", addType, name="addtype"),
    path("purchase/", purchase, name="purchase"),
    path("purchaseform/", purchaseForm, name="purchaseform"),
    path("addpurchase/", addPurchase, name="addpurchase"),
    path("addbranchpurchase/", addBranchPurchase, name="addbranchpurchase"),
    path("users/", Users, name="users"),
    path("adduserpage/", addUserPage, name="adduserpage"),
    path("adduser", addUser, name="adduser"),
    path("branch/", branch, name="branch"),
    path("branchform/", branchForm, name="branchform"),
    path("addbranch/<page>", addBranch, name="addbranch"),
    path("stock/", stock, name="stock"),
    path("branchstock/", branchStock, name="branchstock"),
    path("branchoutofstock/", branchOutOfStock, name="branchoutofstock"),
    path("sale/", sale, name="sale"),
    path("purchaseview/<pid>/", purchaseview, name="purchaseview"),
    path("reports/", report, name="report"),
    path("settings/", settings_view, name="settings"),
    path("customers/", customers, name="customers"),
    path("customerform/", customerform, name="customerform"),
    path("addcustomer/", addcustomer, name="addcustomer"),
    path("customerview/<int:cid>/", customerview, name="customerview"),
    path("exportcustomer/", exportcustomer, name="exportcustomer"),
    path("editcustomer/<int:id>/", editcustomer, name="editcustomer"),
    path("updatecustomer/<int:id>", updatecustomer, name="updatecustomer"),
    path(
        "generate_purchase_pdf/<id>/<action>/",
        generate_purchase_pdf,
        name="generate_purchase_pdf",
    ),
    path("updateproductform/<id>/", updateProductForm, name="updateproductform"),
    path("updateproduct/<id>/", updateProduct, name="updateproduct"),
    path("deleteproduct/<id>/", deleteProduct, name="deleteproduct"),
    path("updatecatagoryform/<id>/", updateCatagoryForm, name="updatecatagoryform"),
    path("updatecatagory/<id>/", updateCatagory, name="updatecatagory"),
    path(
        "updatesubcatagoryform/<id>/",
        updateSubCatagoryForm,
        name="updatesubcatagoryform",
    ),
    path("updatesubcatagory/<id>/", updateSubCatagory, name="updatesubcatagory"),
    path("updatesupplierform/<id>/", updateSupplierForm, name="updatesupplierform"),
    path("updatesupplier/<id>/", updateSupplier, name="updatesupplier"),
    path("updatebrandform/<id>/", updateBrandForm, name="updatebrandform"),
    path("updatebrand/<id>/", updateBrand, name="updatebrand"),
    path("updatepackingform/<id>/", updatePackingForm, name="updatepackingform"),
    path("updatepacking/<id>/", updatePacking, name="updatepacking"),
    path("updatetypeform/<id>/", updateTypeForm, name="updatetypeform"),
    path("updatetype/<id>/", updateType, name="updatetype"),
    path("updatebranchform/<id>/", updateBranchForm, name="updatebranchform"),
    path("updatebranch/<id>/", updateBranch, name="updatebranch"),
    path("updatetaxform/<id>/", updateTaxForm, name="updatetaxform"),
    path("updatetax/<id>/", updateTax, name="updatetax"),
    path("deletetax/<id>/", deleteTax, name="deletetax"),
    path("editcustomeridprefix/", editcustomeridprefix, name="editcustomeridprefix"),
    path(
        "addmultiplecustomersform/",
        addMultipleCustomersForm,
        name="addmultiplecustomersform",
    ),
    path(
        "downloadcustomerformcsv/",
        downloadCustomerFormCsv,
        name="downloadcustomerformcsv",
    ),
    path("editcompanydetails/", editCompanyDetails, name="editcompanydetails"),
    path("customersettings/", customerSettings, name="customersettings"),
    path("saleform/", saleForm, name="saleform"),
    path("accounts/", accounts, name="accounts"),
    path("purchasedueform/<purchaseid>", purchaseDueForm, name="purchasedueform"),
    path("addpurchasedue/", addPurchaseDue, name="addpurchasedue"),
    path("addsale/", addSale, name="addsale"),
    path("saledueform/<saleid>", saleDueForm, name="saledueform"),
    path("addsaledue/", addSaleDue, name="addsaledue"),
    path("saleview/<pid>/", saleview, name="saleview"),
    path("serviceform/", serviceForm, name="serviceform"),
    path("get_customer_details/", get_customer_details, name="get_customer_details"),
    path(
        "get_customer_details_by_id/",
        get_customer_details_by_id,
        name="get_customer_details_by_id",
    ),
    path("get_notifications/", get_notifications, name="get_notifications"),
    path(
        "get_notifications_unseen/",
        get_notifications_unseen,
        name="get_notifications_unseen",
    ),
    path(
        "update_notifications_seen/",
        update_notifications_seen,
        name="update_notifications_seen",
    ),
    path(
        "update_notifications_active/",
        update_notifications_active,
        name="update_notifications_active",
    ),
    path("addservice/", addService, name="addservice"),
    path("service/", service, name="service"),
    path(
        "serviceupdateform/<servicerefnumber>/",
        serviceUpdateForm,
        name="serviceupdateform",
    ),
    path("serviceupdate/", serviceUpdate, name="serviceupdate"),
    path("salesstatusupdate/", StalesStatusUpdate, name="salesstatusupdate"),
    path("comingsoon/", comingSoon, name="comingsoon"),
    path("accessdenied/", access_denied, name="accessdenied"),
    path(
        "generate_sale_pdf/<id>/<action>/", generate_sale_pdf, name="generate_sale_pdf"
    ),
    path(
        "get_subcategory_by_category/",
        get_subcategory_by_category,
        name="get_subcategory_by_category",
    ),
    path(
        "get_subcategory_by_category_id/",
        get_subcategory_by_category_id,
        name="get_subcategory_by_category_id",
    ),
    path("service_print/<serviceref>/", serviceprint, name="serviceprint"),
    path("service_print_page/<serviceref>/", service_print_page, name="serviceprintpage"),
    path("servicecompleted/", serviceCompleted, name="servicecompleted"),
    path("servicedelivered/", serviceDelivered, name="servicedelivered"),
    path("servicepending/", servicePending, name="servicepending"),
    path("serviceinprogress/", serviceInProgress, name="serviceinprogress"),
    path("servicerejected/", serviceRejected, name="servicerejected"),
    path("serviceassigned/", serviceAssigned, name="serviceassigned"),
    path("servicecomplete_rack/", serviceCompleteRack, name="servicecompleterack"),
    path("rack_list/", rackList, name="racklist"),
    path("service_calllogs/<serviceref>/", serviceCallLogs, name="servicecalllogs"),
    path("schedulecall/", scheduleCall, name="schedulecall"),
    path("notifications/", notificationsList, name="notifications"),
    path(
        "deletenotification/<notificationid>/",
        deleteNotification,
        name="deletenotification",
    ),
    path(
        "savecalllogs/<serviceref>/<remark>/<notificationid>/",
        saveCallLogs,
        name="savecalllogs",
    ),
    path("change_sidebar_status/", change_sidebar_status, name="changesidebarstatus"),
    path(
        "get_call_schedule_notifications/",
        get_call_schedule_notifications,
        name="get_call_schedule_notifications",
    ),
    path("get_service_status/", get_service_status, name="get_service_status"),
    path("search_money_reciept/", search_money_reciept, name="search_money_reciept"),
    path("search_customers/", search_customers, name="search_customers"),
    path("search_sale/", search_sale, name="search_sale"),
    path(
        "branch_purchase_status_update/",
        BranchPurchaseStatusUpdate,
        name="branchpurchasestatusupdate",
    ),
    path("service_report/", serviceReport, name="servicereport"),
    path(
        "get_service_status_daily/",
        get_service_status_daily,
        name="get_service_status_daily",
    ),
    path(
        "get_service_status_monthly/",
        get_service_status_monthly,
        name="get_service_status_monthly",
    ),
    path(
        "get_service_status_yearly/",
        get_service_status_yearly,
        name="get_service_status_yearly",
    ),
    path("get_product_details/", get_product_details, name="get_product_details"),
    path(
        "get_product_details_by_barcode/",
        get_product_details_by_barcode,
        name="get_product_details_by_barcode",
    ),
    path(
        "get_product_details_by_id/",
        get_product_details_by_id,
        name="get_product_details_by_id",
    ),
    path(
        "get_product_details_stocktransfer/",
        get_product_details_stocktransfer,
        name="get_product_details_stocktransfer",
    ),
    path(
        "dashboard_yearly_purchase/",
        dashboard_yearly_purchase,
        name="dashboard_yearly_purchase",
    ),
    path(
        "search_yearly_purchase/<page>/",
        search_yearly_purchase,
        name="search_yearly_purchase",
    ),
    path(
        "dashboard_monthly_purchase/",
        dashboard_monthly_purchase,
        name="dashboard_monthly_purchase",
    ),
    path(
        "search_monthly_purchase/<page>/",
        search_monthly_purchase,
        name="search_monthly_purchase",
    ),
    path(
        "dashboard_daily_purchase/",
        dashboard_daily_purchase,
        name="dashboard_daily_purchase",
    ),
    path(
        "search_daily_purchase/<page>/",
        search_daily_purchase,
        name="search_daily_purchase",
    ),
    path(
        "dashboard_yearly_sales/", dashboard_yearly_sales, name="dashboard_yearly_sales"
    ),
    path(
        "search_yearly_sales/<page>/", search_yearly_sales, name="search_yearly_sales"
    ),
    path(
        "dashboard_monthly_sales/",
        dashboard_monthly_sales,
        name="dashboard_monthly_sales",
    ),
    path(
        "search_monthly_sales/<page>/",
        search_monthly_sales,
        name="search_monthly_sales",
    ),
    path("dashboard_daily_sales/", dashboard_daily_sales, name="dashboard_daily_sales"),
    path("search_daily_sales/<page>/", search_daily_sales, name="search_daily_sales"),
    path("stock_transfer/", stock_transfer, name="stocktransfer"),
    path("save_stock_transfer/", save_stock_transfer, name="savestocktransfer"),
    path("stock_transfer_list/", stock_transfer_list, name="stocktransferlist"),
    path("stock_recieved/<id>/", stock_recieved, name="stockrecieved"),
    path("stock_not_recieved/<id>/", stock_not_recieved, name="stocknotrecieved"),
    path(
        "reports_daily_purhchase/", reports_daily_purchase, name="reportsdailypurchase"
    ),
    path(
        "reports_monthly_purhchase/",
        reports_monthly_purchase,
        name="reportsmonthlypurchase",
    ),
    path(
        "reports_yearly_purhchase/",
        reports_yearly_purchase,
        name="reportsyearlypurchase",
    ),
    path("reports_daily_sales/", reports_daily_sales, name="reportsdailysales"),
    path("reports_monthly_sales/", reports_monthly_sales, name="reportsmonthlysales"),
    path("reports_yearly_sales/", reports_yearly_sales, name="reportsyearlysales"),
    path("purchase_return/", purchaseReturn, name="purchasereturn"),
    path("purchase_return_search/", purchaseReturnSearch, name="purchasereturnsearch"),
    path("add_purchase_return/", addPurchaseReturn, name="addpurchasereturn"),
    path("sales_return/", salesReturn, name="salesreturn"),
    path("sales_return_search/", salesReturnSearch, name="salesreturnsearch"),
    path("add_sales_return/", addSalesReturn, name="addsalesreturn"),
    path("purchase_return_list/", purchaseReturnList, name="purchasereturnlist"),
    path("sales_return_list/", salesReturnList, name="salesreturnlist"),
    path(
        "purchase_return_details/<returnid>/",
        purchaseReturnDetails,
        name="purchasereturndetails",
    ),
    path(
        "sales_return_details/<returnid>/",
        salesReturnDetails,
        name="salesreturndetails",
    ),
    path(
        "change_purchase_return_status/",
        changePurchaseReturnStatus,
        name="changepurchasereturnstatus",
    ),
    path("chartofaccounts/", ChartofAccounts, name="chartofaccounts"),
    path("chartofaccountsform/", ChartofAccountsForm, name="chartofaccountsform"),
    path("addchartofaccounts/", addChartOfAccounts, name="addchartofaccounts"),
    path("generalledger/", general_ledger, name="generalledger"),
    path("generalledgersearch", generalLedgerSearch, name="generalledgersearch"),
    path("placcount/", pl_accounts, name="placcount"),
    path("cashbook/", cash_book, name="cashbook"),
    path("balancesheet/", balance_sheet, name="balancesheet"),
    path("updateuserpermissions/", updateUserPermissions, name="updateuserpermissions"),
    path("addserviceinfo/", addServiceInfo, name="addserviceinfo"),
    path(
        "addservicecompletereject/",
        addServiceCompleteReject,
        name="addservicecompletereject",
    ),
    path("verifyqcform/", verifyQcForm, name="verifyqcform"),
    path("serviceqcstatusupdate/", serviceQcStatusUpdate, name="serviceqcstatusupdate"),
    path("serviceacknoledgecnp/", serviceAcknoledgeCnp, name="serviceacknoledgecnp"),
    path("servicerejectreassign/", serviceRejectReassign, name="servicerejectreassign"),
    path("servicecnppending/", serviceCnpPending, name="servicecnppending"),
    path("servicecnp/", serviceCnp, name="servicecnp"),
    path("addsparerequest/", addSpareRequest, name="addsparerequest"),
    path(
        "addsparerequeststandard/",
        addSpareRequestStandard,
        name="addsparerequeststandard",
    ),
    path("sparerequests/", spareRequests, name="sparerequests"),
    path(
        "sparerequestdetails/<serviceref>/",
        spareRequestDetails,
        name="sparerequestdetails",
    ),
    path(
        "sparerequestupdate/<serviceref>/",
        spareRequestUpdate,
        name="sparerequestupdate",
    ),
    path("payment/", payment, name="payment"),
    path("paymentform/", payment_form, name="paymentform"),
    path("addpayment/", add_payment, name="addpayment"),
    path("journal/", journal, name="journal"),
    path("journalform/", journal_form, name="journalform"),
    path("addjournal/", add_journal, name="addjournal"),
    path("journaldetails/<id>/", journal_details, name="journaldetails"),
    path("receipt/", receipt, name="receipt"),
    path("receiptform/", receipt_form, name="receiptform"),
    path("addreceipt/", add_receipt, name="addreceipt"),
    path(
        "deletesparerequest/<id>/<serviceref>/<page>/",
        deleteSpareRequest,
        name="deletesparerequest",
    ),
    path("servicecompletedfd/", serviceCompletedFd, name="servicecompletedfd"),
    path(
        "servicecheckout/<servicerefnumber>/", serviceCheckout, name="servicecheckout"
    ),
    path(
        "servicebillingcheckout/<servicerefnumber>/",
        serviceBillingCheckout,
        name="servicebillingcheckout",
    ),
    path("serviceassignreassign/", serviceAssignReassign, name="serviceassignreassign"),
    path("acknoledgeservice/", acknoledgeService, name="acknoledgeservice"),
    path("addservicecharge/", addServiceCharge, name="addservicecharge"),
    path(
        "addservicechargestandard/",
        addServiceChargeStandard,
        name="addservicechargestandard",
    ),
    path(
        "servicechargeestimationlist/",
        serviceChargeEstimationList,
        name="servicechargeestimationlist",
    ),
    path(
        "servicechargeestimationdetails/<serviceref>/",
        serviceChargeEstimationDetails,
        name="servicechargeestimationdetails",
    ),
    path(
        "servicechargeestimationupdate/",
        serviceChargeEstimationUpdate,
        name="servicechargeestimationupdate",
    ),
    path("servicedetailssearch/", serviceDetailsSearch, name="servicedetailssearch"),
    path("booking/", customerServiceEntry, name="customerserviceentry"),
    path(
        "save_customer_service_booking/",
        save_customer_service_booking,
        name="save_customer_service_booking",
    ),
    path("servicebooking/", serviceBooking, name="servicebooking"),
    path(
        "verifyrejectservicebooking/",
        verifyRejectServiceBooking,
        name="verifyrejectservicebooking",
    ),
    path("servicesettings/", serviceSettings, name="servicesettings"),
    path("addcountry/", addCountry, name="addcountry"),
    path("addphonebrand/", addPhoneBrand, name="addphonebrand"),
    path("addphonemodal/", addPhoneModal, name="addphonemodal"),
    path("addissues/", addIssues, name="addissues"),
    path("addcity/", addCity, name="addcity"),
    path("get_phone_modals/", get_phone_modals, name="get_phone_modals"),
    path("saveservicecharge/", saveServiceCharge, name="saveservicecharge"),
    path("get_service_charge/", get_service_charge, name="get_service_charge"),
    path("servicechat/", serviceChat, name="servicechat"),
    path(
        "generate_purchase_barcode/",
        generate_purchase_barcode,
        name="generate_purchase_barcode",
    ),
    path("send_email/", send_support_email, name="send_support_email"),
    path(
        "print_purchase_barcode/<id>/",
        print_purchase_barcode,
        name="print_purchase_barcode",
    ),
    path("get_all_service/", get_all_service, name="getallservice"),
    path("printbarcode/", printBarcode, name="printbarcode"),
    path("addrack/", addRack, name="addrack"),
    path("addPaymentMode/", addPaymentMode, name="addpaymentmode"),
    path("documentation/", documentation, name="documentation"),
    # path('search_pl_account/',searchPlAccount, name='searchplaccount'),
    path("social/", include("social.urls")),
    path(
        "print_service_barcode/<serviceref>/",
        printServiceBarcode,
        name="printservicebarcode",
    ),
    path("get_service_tax/", get_service_tax, name="get_service_tax"),
    path("editservicetax/", editservicetax, name="editservicetax"),
    path(
        "get_technician_performance/",
        get_technician_performance,
        name="gettechnicianperformance",
    ),
    path("dashboardtable/", dashboardTable, name="dashboardtable"),
    # path('searchdashboardtable/',searchDashboardTable,name='searchdashboardtable'),
    # path('searchservicereport/',searchServiceReport,name='searchservicereport'),
    path("deleterack/<id>/", deleteRack, name="deleterack"),
    path("deletepaymentmode/<id>/", deletePaymentMode, name="deletepaymentmode"),
    path("deletecountry/<id>/", deleteCountry, name="deletecountry"),
    path("deletephonebrand/<id>/", deletePhoneBrand, name="deletephonebrand"),
    path("deletephonemodal/<id>/", deletePhoneModal, name="deletephonemodal"),
    path("deleteissues/<id>/", deleteIssues, name="deleteissues"),
    path("deletecity/<id>/", deleteCity, name="deletecity"),
    path("deleteservicecharge/<id>/", deleteServiceCharge, name="deleteservicecharge"),
    path("paymentdetails/<id>/", payment_details, name="paymentdetails"),
    path("receiptdetails/<id>/", receipt_details, name="receiptdetails"),
    path(
        "deletechartofaccounts/<id>/",
        deleteChartofAccounts,
        name="deletechartofaccounts",
    ),
    path("editchartofaccounts/<id>/", editChartofAccounts, name="editchartofaccounts"),
    path("updatechartofaccounts/", updateChartOfAccounts, name="updatechartofaccounts"),
    path("addbulkpurchaseform/", addBulkPurchaseForm, name="addbulkpurchaseform"),
    path(
        "downloadbulkpurchaseformcsv/",
        downloadBulkPurchaseFormCsv,
        name="downloadbulkpurchaseformcsv",
    ),
    path("addbulkstockform/", addBulkStock, name="addbulkstockform"),
    path(
        "downloadbulkstockformcsv/",
        downloadBulkStockFormCsv,
        name="downloadbulkstockformcsv",
    ),
    path(
        "deleteserviceproduct/<id>/", deleteServiceProduct, name="deleteserviceproduct"
    ),
    path("addserviceproduct/", addServiceProduct, name="addserviceproduct"),
    path("get_brands_by_product/", get_brands_by_product, name="get_brands_by_product"),
    path(
        "customerserviceentryservices/<service>/",
        customerServiceEntryServices,
        name="customerserviceentryservices",
    ),
    path("assignservicebooking/", assignServiceBooking, name="assignservicebooking"),
    path(
        "get_customer_booking_details/",
        get_customer_booking_details,
        name="get_customer_booking_details",
    ),
    path(
        "print_purchase_barcode_new/<barcode_number>/<purchaseid>/",
        print_purchase_barcode_new,
        name="print_purchase_barcode_new",
    ),
    path("addcatagorymodal/", addCatagoryModal, name="addcatagorymodal"),
    path("addsubcatagorymodal/", addSubCatagoryModal, name="addsubcatagorymodal"),
    path("addbrandmodal/", addBrandModal, name="addbrandmodal"),
    path("addtypemodal/", addTypeModal, name="addtypemodal"),
    path("addpackingmodal/", addPackingModal, name="addpackingmodal"),
    path("addtaxmodal/", addTaxModal, name="addtaxmodal"),
    path("singleledger/", single_ledger, name="singleledger"),
    path("singleledgerform/", single_ledger_form, name="singleledgerform"),
    path("addsingleledger/", add_single_ledger, name="addsingleledger"),
    path("updatelanguage/", update_language, name="updatelanguage"),
    path(
        "reportsindividualsales/",
        reports_individual_sales,
        name="reportsindividualsales",
    ),
    path(
        "get_salespersons_branch/",
        get_salespersons_branch,
        name="get_salespersons_branch",
    ),
    path("bulkstocklist/", bulkStockList, name="bulkstocklist"),
    path("bulkstockview/<pid>/", bulkStockView, name="bulkstockview"),
    path("transferedstocklist/", transferedStockList, name="transferedstocklist"),
    path("transferedstockview/<pid>/", transferedStockView, name="transferedstockview"),
    path("addcatagorymodalajax/", addCatagoryModalAjax, name="addcatagorymodalajax"),
    path(
        "addsubcatagorymodalajax/",
        addSubCatagoryModalAjax,
        name="addsubcatagorymodalajax",
    ),
    path("addbrandmodalajax/", addBrandModalAjax, name="addbrandmodalajax"),
    path("addtypemodalajax/", addTypeModalAjax, name="addtypemodalajax"),
    path("addpackingmodalajax/", addPackingModalAjax, name="addpackingmodalajax"),
    path(
        "addpurchasetaxmodalajax/",
        addPurchaseTaxModalAjax,
        name="addpurchasetaxmodalajax",
    ),
    path("addsaletaxmodalajax/", addSaleTaxModalAjax, name="addsaletaxmodalajax"),
    path("modalproductlist/", modal_product_list, name="modalproductlist"),
    path("modalproductform/", modal_product_form, name="modalproductform"),
    path("addproductpricelist/", add_product_price_list, name="addproductpricelist"),
    path(
        "updatemodalproductprice/<id>/",
        update_modal_product_price,
        name="updatemodalproductprice",
    ),
    path(
        "updateproductpricelist/",
        update_product_price_list,
        name="updateproductpricelist",
    ),
    path(
        "deletemodalproductprice/<id>/",
        delete_modal_product_price,
        name="deletemodalproductprice",
    ),
    path("addcustomerfromsales/", addcustomerfromsales, name="addcustomerfromsales"),
    path("saletaxreport/", saletaxreport, name="saletaxreport"),
    path("editlivestreamurl/", editlivestreamurl, name="editlivestreamurl"),
    path(
        "deletelivestreamurl/<url_id>/", deleteLivestreamUrl, name="deletelivestreamurl"
    ),
    path("purchasetaxreport/", purchasetaxreport, name="purchasetaxreport"),
    path(
        "purchasereturntaxreport/",
        purchasereturntaxreport,
        name="purchasereturntaxreport",
    ),
    path("salereturntaxreport/", salereturntaxreport, name="salereturntaxreport"),
    path(
        "addexternalfranchisefromsales/",
        addexternalfranchisefromsales,
        name="addexternalfranchisefromsales",
    ),
    path(
        "addsupplierfrompurchase/",
        addsupplierfrompurchase,
        name="addsupplierfrompurchase",
    ),
    path("sevicetaxreport/", servicetaxreport, name="servicetaxreport"),
    path("sparetaxreport/", sparetaxreport, name="sparetaxreport"),
    path("externalcustomers/", externalcustomers, name="externalcustomers"),
    path(
        "updateexternalcustomerform/<id>/",
        updateexternalcustomerform,
        name="updateexternalcustomerform",
    ),
    path(
        "updateexternalcustomer/<id>/",
        updateexternalcustomer,
        name="updateexternalcustomer",
    ),
    path(
        "cancelsparerequeststandard/<id>/<serviceref>/",
        cancelsparerequeststandard,
        name="cancelsparerequeststandard",
    ),
    path(
        "addProductStockTransfer/",
        addProductStockTransfer,
        name="addProductStockTransfer",
    ),
    path("addStockStockTransfer/", addStockStockTransfer, name="addStockStockTransfer"),
    path("stockadjustment/", stockadjustment, name="stockadjustment"),
    path(
        "get_product_list_by_branchid/",
        get_product_list_by_branchid,
        name="get_product_list_by_branchid",
    ),
    path(
        "get_product_stock_details/",
        get_product_stock_details,
        name="get_product_stock_details",
    ),
    path("savestockadjustment/", savestockadjustment, name="savestockadjustment"),
    path("lcashbook/", l_cashbook, name="lcashbook"),
    path("lledger/", l_ledger, name="lledger"),
    path("stockadjustmentlist/", stockadjustmentlist, name="stockadjustmentlist"),
    path(
        "stockadjustmentview/<sa_number>/",
        stockadjustmentview,
        name="stockadjustmentview",
    ),
    path(
        "confirmstockadjustment/", confirmstockadjustment, name="confirmstockadjustment"
    ),
    path("setdefaultcountry/", setdefaultcountry, name="setdefaultcountry"),
    path("map/<latitude>/<longitude>/", show_map, name="show_map"),
    path(
        "deliveredServiceBooking/",
        deliveredServiceBooking,
        name="deliveredservicebooking",
    ),
    path(
        "get_service_product_by_id/",
        get_service_product_by_id,
        name="get_service_product_by_id",
    ),
    path("editserviceproduct/", editserviceproduct, name="editserviceproduct"),
    path("get_phone_brand_by_id/", get_phone_brand_by_id, name="get_phone_brand_by_id"),
    path("editphonebrand/", editphonebrand, name="editphonebrand"),
    path("get_phone_modal_by_id/", get_phone_modal_by_id, name="get_phone_modal_by_id"),
    path("editphonemodal/", editphonemodal, name="editphonemodal"),
    path(
        "get_product_details_by_product/",
        get_product_details_by_product,
        name="get_product_details_by_product",
    ),
    path(
        "get_service_issue_by_id/",
        get_service_issue_by_id,
        name="get_service_issue_by_id",
    ),
    path("editissue/", editissue, name="editissue"),
    path("updatepagesize/", update_pagesize, name="updatepagesize"),
    path(
        "get_service_booking_count/",
        getServiceBookingCount,
        name="get_service_booking_count",
    ),
    path(
        "update_whatsapp_status/", update_whatsapp_status, name="update_whatsapp_status"
    ),
    path("deletepurchasereturn/<returnid>/", DeletePurchaseReturn, name="deletepurchasereturn"),
      path("detailed_sales_report/", detailed_sales_report, name="detailedsalesreport"),
            path("detailed_service_report/", detailed_service_report, name="detailedservicereport"),
             path("payment_print/<paymentid>/", payment_print, name="paymentprint"),
             path("receipt_print/<receiptid>/", receipt_print, name="receiptprint"),
               path("all_in_one_report/", all_in_one_report, name="allinonereport"),

                path("sale_invoice_page/<id>/", sale_invoice_page, name="saleinvoicepage"),
                 path("search_daybook/", search_daybook, name="search_daybook"),
                 path("daybook/", daybook, name="daybook"),
                  path("balancesheet_new/", balancesheet, name="balancesheet_new"),
                  path("placcount_new/", placcountnew, name="placcount_new"),
                  path("cashtocash_form/", cashtocash_form, name="cashtocash_form"),
]


if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
