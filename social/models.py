
from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver
from .utils import sendnotification

class UserProfileSocial(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE,related_name="userprofilesocial")
    college = models.CharField(max_length=200,null=True,blank=True,default=None)
    college_passed_year = models.IntegerField(null=True,blank=True,default=None) 
    highschool = models.CharField(max_length=200,null=True,blank=True,default=None)
    highschool_passed_year = models.IntegerField(null=True,blank=True,default=None)
    city = models.CharField(max_length=50,null=True,blank=True,default=None)
    district = models.CharField(max_length=50,null=True,blank=True,default=None)
    state = models.CharField(max_length=50,null=True,blank=True,default=None)
    country = models.CharField(max_length=50,null=True,blank=True,default=None)
    phone = models.CharField(max_length=15,null=True,blank=True,default=None)  
    SINGLE = 'Single'
    IN_A_RELATIONSHIP = 'In a relationship'
    MARRIED = 'Married'
    DIVORCED = 'Divorced'
    ENGAGED='Engaged'
    MALE='Male'
    FEMALE='Female'
    
    RELATIONSHIP_STATUS_CHOICES = [
        (SINGLE, 'Single'),
        (IN_A_RELATIONSHIP, 'In a relationship'),
        (MARRIED, 'Married'),
        (DIVORCED, 'Divorced'),
        (ENGAGED, 'Engaged'),
    ]

    GENDER_CHOICES=[
        (MALE, 'Male'),
        (FEMALE, 'Female'),
    ]
    
    relationship_status = models.CharField(
        max_length=20,
        choices=RELATIONSHIP_STATUS_CHOICES,
        default=SINGLE,
    )
    profile_picture = models.URLField(max_length=500,default='https://images2.imgbox.com/7f/dd/zU4bMETS_o.png')
    cover_picture = models.URLField(max_length=500,default='https://images2.imgbox.com/db/dc/nLkyji55_o.jpeg')
    created_at = models.DateTimeField(auto_now_add=True)
    last_modified_at = models.DateTimeField(auto_now_add=True)
    dob=models.DateField(null=True,blank=True,default=None)
    gender=models.CharField(max_length=10,choices=GENDER_CHOICES,default=MALE)
    online=models.BooleanField(default=True)
    contributions = models.IntegerField(default=0)
    verified_contributions = models.IntegerField(default=0)
    
    

    def __str__(self):
        return self.user.first_name  





class Post(models.Model):
    user=models.ForeignKey(User, on_delete=models.CASCADE,related_name="posts")
    text=models.TextField(null=True,blank=True)
    feeling=models.CharField(max_length=50,null=True,blank=True)
    image=models.URLField(max_length=500,null=True,blank=True)
    video=models.URLField(max_length=500,null=True,blank=True)
    IMAGE='Image'
    VIDEO='Video'
    TEXT='Text'
    POST_TYPE_CHOICES = [
         (IMAGE, 'Image'),
        (VIDEO, 'Video'),
        (TEXT, 'Text'),
    ]
    post_type=models.CharField(max_length=20,choices=POST_TYPE_CHOICES,default=TEXT)
    PUBLIC='Public'
    FRIENDS='Friends'
    SHARE_TO_CHOICES = [
         (PUBLIC, 'Public'),
        (FRIENDS, 'Friends'),
    ]
    share_to=models.CharField(max_length=20,choices=SHARE_TO_CHOICES,default=PUBLIC)
    created_at = models.DateTimeField(auto_now_add=True)
    last_modified_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return str(self.id)


class Like(models.Model):
    post=models.ForeignKey(Post, on_delete=models.CASCADE,related_name="post_likes")
    user=models.ForeignKey(User, on_delete=models.CASCADE,related_name="user_likes")
    created_at = models.DateTimeField(auto_now_add=True)
    last_modified_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['post', 'user']



class Comment(models.Model):
    post=models.ForeignKey(Post, on_delete=models.CASCADE,related_name="post_comments")
    user=models.ForeignKey(User, on_delete=models.CASCADE,related_name="user_comments")
    comment=models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    last_modified_at = models.DateTimeField(auto_now_add=True)
    verified=models.BooleanField(default=False)

class SubLike(models.Model):
    post=models.ForeignKey(Post, on_delete=models.CASCADE,related_name="cpost_ommentlikes")
    user=models.ForeignKey(User, on_delete=models.CASCADE,related_name="user_commentlikes")
    comment=models.ForeignKey(Comment, on_delete=models.CASCADE,related_name="comment_commentlikes")
    created_at = models.DateTimeField(auto_now_add=True)
    last_modified_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['comment', 'user']

class SubComments(models.Model):
    post=models.ForeignKey(Post, on_delete=models.CASCADE,related_name="post_commentcomments")
    user=models.ForeignKey(User, on_delete=models.CASCADE,related_name="user_commentcomments")
    comment=models.ForeignKey(Comment, on_delete=models.CASCADE,related_name="comment_commentcomments")
    created_at = models.DateTimeField(auto_now_add=True)
    comment_text=models.TextField(default=None,null=True,blank=True)
    last_modified_at = models.DateTimeField(auto_now_add=True)


class Save(models.Model):
    post=models.ForeignKey(Post, on_delete=models.CASCADE,related_name="post_saves")
    user=models.ForeignKey(User, on_delete=models.CASCADE,related_name="user_saves")
    created_at = models.DateTimeField(auto_now_add=True)
    last_modified_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['post', 'user']


class Share(models.Model):
    post=models.ForeignKey(Post, on_delete=models.CASCADE,related_name="post_shares")
    user=models.ForeignKey(User, on_delete=models.CASCADE,related_name="user_shares")
    created_at = models.DateTimeField(auto_now_add=True)
    last_modified_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['post', 'user']



class Friendship(models.Model):
    sender = models.ForeignKey(User, related_name='friendship_sender', on_delete=models.CASCADE)
    receiver = models.ForeignKey(User, related_name='friendship_receiver', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    last_modified_at = models.DateTimeField(auto_now_add=True)
    code=models.CharField(max_length=500,default=None,null=True,blank=True)
    FRIENDS='Friends'
    PENDING='Pending'
    STATUS_CHOICES=[
        (PENDING, 'Pending'),
        (FRIENDS, 'Friends'),
    ]
    status=models.CharField(max_length=20,choices=STATUS_CHOICES,default=PENDING)

    class Meta:
        unique_together = ['sender', 'receiver']

    def __str__(self):
        return f"{self.sender} -> {self.receiver}"
    

class UniqueIdGeneratorSocial(models.Model):
    model = models.CharField(max_length=200,unique=True)
    prefix =models.CharField(max_length=200,unique=True)
    uniqueid =models.IntegerField()

    def __str__(self):
        return self.model
        

class Ad(models.Model):
    image=models.URLField(max_length=500,null=True,blank=True)
    description=models.TextField(max_length=200)
    website=models.URLField(max_length=100,null=True,blank=True)
    company=models.TextField(max_length=200,null=True,blank=True)
    created_at = models.DateTimeField(auto_now_add=True,null=True,blank=True)

    def __str__(self):
        return self.company



class ChatDetails(models.Model):
    message=models.TextField()
    roomname=models.CharField(max_length=200)
    userid=models.IntegerField()
    userimage=models.URLField(max_length=2000)
    userfullname=models.CharField(max_length=200)
    created_at=models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.roomname


class BroadcastNotificationSocial(models.Model):
    message = models.TextField()
    sent = models.BooleanField(default=False)
    user = models.ForeignKey(User,on_delete=models.CASCADE,related_name='social_broadcast_notifications')
    created_date = models.DateTimeField(auto_now_add=True)
    notification_type = models.CharField(max_length=50,null=True,default=None)
    notification_id =models.CharField(max_length=50,null=True,default=None)
    seen = models.BooleanField(default=False)
    from_user=models.ForeignKey(User,on_delete=models.CASCADE,related_name='notifications_social',default=None,null=True,blank=True)
    active=models.BooleanField(default=True,null=True,blank=True)

    def __str__(self):
        return self.notification_type

# @receiver(post_save, sender=BroadcastNotificationSocial)
# def notification_handler(sender, instance, created, **kwargs):
    
#     if created:
#         sendnotification(instance.message,str(instance.user.id))


    


    

