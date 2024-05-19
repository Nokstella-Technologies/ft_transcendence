from django.db import models

class User(models.Model):
	username = models.CharField(max_length=200)
	email = models.EmailField()
	password_hash = models.CharField(max_length=200)
	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)
	is_auth = models.BooleanField(default=False)
	profile_picture = models.URLField()


