from django.shortcuts import render, redirect
from .models import User
from .forms import UserForm

def user_list(request):
	users = User.objects.all()
	return render(request, 'user_list.html', {'users':users})

def user_create(request):
	if request.method == 'POST':
		if 'save' in request.POST:
			form = UserForm(request.POST)
			form.save()
			return redirect('user_list')
	else:
		form = UserForm()
	return render(request, 'user_create.html', {'form': form})

def user_update(request, pk):
	user = User.objects.get(pk=pk)
	if request.method == 'POST':
		if 'save' in request.POST:
			form = UserForm(request.POST, instance=user)
			form.save()
			return redirect('user_list')
	else:
		form = UserForm(instance=user)
	return render(request, 'user_update.html', {'form': form})

def user_delete(request, pk):
	User.objects.get(pk=pk).delete()
	return redirect('user_list')