from django.shortcuts import render
from django.contrib.auth.decorators import login_required


# this decorator deny access for field engineers
def no_fieldengineer(view_func):
    @login_required
    def wrapper(request, *args, **kwargs):
        if request.user.userprofile.role == "Field Engineer":
            # return redirect(reverse('customers'))
            return render(request, "accessdenied.html")
        return view_func(request, *args, **kwargs)

    return wrapper


def no_branchadmin(view_func):
    @login_required
    def wrapper(request, *args, **kwargs):
        if request.user.userprofile.role == "Branch Admin":
            # return redirect(reverse('customers'))
            return render(request, "accessdenied.html")
        return view_func(request, *args, **kwargs)

    return wrapper


def no_franchiseadmin(view_func):
    @login_required
    def wrapper(request, *args, **kwargs):
        if request.user.userprofile.role == "Franchise Admin":
            # return redirect(reverse('customers'))
            return render(request, "accessdenied.html")
        return view_func(request, *args, **kwargs)

    return wrapper


def no_technician(view_func):
    @login_required
    def wrapper(request, *args, **kwargs):
        if request.user.userprofile.role == "Technician":
            # return redirect(reverse('customers'))
            return render(request, "accessdenied.html")
        return view_func(request, *args, **kwargs)

    return wrapper


def no_admin(view_func):
    @login_required
    def wrapper(request, *args, **kwargs):
        if request.user.is_superuser:
            # return redirect(reverse('customers'))
            return render(request, "accessdenied.html")
        return view_func(request, *args, **kwargs)

    return wrapper
