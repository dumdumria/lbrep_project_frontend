from django.contrib.auth import get_user_model
User = get_user_model()
from .models import Profile
from django.db.models.signals import post_save
from django.dispatch import receiver





@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        print("Signal fired: Creating profile")
        Profile.objects.create(seller = instance)

@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    instance.profile.save()
