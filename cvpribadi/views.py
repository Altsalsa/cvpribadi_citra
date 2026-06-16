from django.shortcuts import render

def index(request):
    # Mengambil base template yang menggabungkan include about dan project
    return render(request, 'index.html')