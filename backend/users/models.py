# from django.contrib.auth.models import AbstractUser
# from django.db import models


# from django.utils.translation import gettext_lazy as _

# from .managers import CustomUserManager

# class CustomUser(AbstractUser):
#     bio = models.TextField(blank=True)
#     # profile_pic = models.ImageField(blank=True)
#     email = models.EmailField(_("email address"), unique=True)
    
#     USERNAME_FIELD = "email"
#     REQUIRED_FIELDS = []

#     objects = CustomUserManager()

#     def __str__(self):
#         return self.email