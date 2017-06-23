from django.shortcuts import render


def home(request):
    return render(request,'crawler/home.html')
# Create your views here.
