from django.forms import ModelForm
from .models import *
from django.contrib.auth.forms import UserCreationForm
from django import forms


class ProductForm(ModelForm):
    class Meta:
        model = Products
        fields = "__all__"


class CatagoriesForm(ModelForm):
    class Meta:
        model = Catagories
        fields = "__all__"


class SubCatagoriesForm(ModelForm):
    class Meta:
        model = SubCatagories
        fields = "__all__"


class SupplierForm(ModelForm):
    class Meta:
        model = Suppliers
        fields = "__all__"


class BrandForm(ModelForm):
    class Meta:
        model = Brand
        fields = "__all__"


class PackingForm(ModelForm):
    class Meta:
        model = Packing
        fields = "__all__"


class TaxForm(ModelForm):
    class Meta:
        model = Tax
        fields = "__all__"


class TypeForm(ModelForm):
    class Meta:
        model = Type
        fields = "__all__"


class BranchForm(ModelForm):
    class Meta:
        model = Branch
        fields = "__all__"


class PurchaseForm(ModelForm):
    class Meta:
        model = Purchase
        fields = "__all__"


class UserForm(UserCreationForm):
    email = forms.EmailField()

    class Meta:
        model = User
        fields = ("username", "email")


class UserProfileForm(forms.ModelForm):
    class Meta:
        model = UserProfile
        fields = ("branch", "mobile", "role")
