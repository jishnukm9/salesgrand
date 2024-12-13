
from django.urls import path
from social import views

urlpatterns = [
    path('login/',views.login,name='login'),
    path('',views.home,name='home'),
    path('logout/',views.logout_view,name='logoutuser'),
    path('register/',views.registration_view,name='registeruser'),
    path('like-post/',views.like_post,name='likepost'),
    path('dislike-post/',views.dislike_post,name='dislikepost'),
    path('upload-post/<page>/',views.upload_post,name='uploadpost'),
    path('profile/<id>/',views.profile,name='profile'),
    path('addfriend/<receiver>/',views.addfriend,name='addfriend'),
    path('friendrequest/',views.friend_request,name='friendrequest'),
    path('acceptrequest/<sender>/',views.accept_request,name='acceptrequest'),
    path('friends/<id>/',views.friends,name='friends'),
    path('unfriend/<id>/',views.unfriend,name='unfriend'),
    path('photos/<id>/',views.photos,name='photos'),
    path('videos/<id>/',views.videos,name='videos'),
    path('about/<id>/',views.about,name='about'),
    path('edit-profile/<page>/',views.edit_profile,name='editprofile'),
    path('save-post/',views.save_post,name='savepost'),
    path('unsave-post/',views.unsave_post,name='unsavepost'),
    path('savedposts/<id>/',views.saved_posts,name='savedposts'),
    path('get-post/',views.get_post,name='getpost'),
    path('add-comment/',views.addcomment,name='addcomment'),
    path('chatroom/<code>/',views.chatroom,name='chatroom'),
     path('savechat/',views.savechat,name='savechat'),
     path('postdetails/<postid>/',views.postdetails,name='postdetails'),
     path('get-notifications/',views.get_notifications,name='getnotifications'),
     path('update_notifications_seen/',views.update_notifications_seen,name='update_notifications_seen'),
     path('verifycomment/',views.verifycomment,name='verifycomment'),
]
