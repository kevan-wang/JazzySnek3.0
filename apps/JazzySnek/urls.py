from django.conf.urls import url
from . import views           # This line is new!


urlpatterns = [
	url(r'^$', views.index),	# This line has changed! Notice that urlpatterns is a list, the comma is in anticipation of all the routes that will be coming soon
	url(r'^login_reg$', views.loginReg),	# This line has changed! Notice that urlpatterns is a list, the comma is in anticipation of all the routes that will be coming soon
	url(r'^register$', views.register),	# This line has changed! Notice that urlpatterns is a list, the comma is in anticipation of all the routes that will be coming soon
	url(r'^login$', views.login),	# This line has changed! Notice that urlpatterns is a list, the comma is in anticipation of all the routes that will be coming soon
	url(r'^logout$', views.logout),	# This line has changed! Notice that urlpatterns is a list, the comma is in anticipation of all the routes that will be coming soon
	url(r'^quick_game$', views.quickGame),	# This line has changed! Notice that urlpatterns is a list, the comma is in anticipation of all the routes that will be coming soon
	url(r'^how_to$', views.howTo),	# This line has changed! Notice that urlpatterns is a list, the comma is in anticipation of all the routes that will be coming soon
	url(r'^story_mode$', views.storyMode),	# This line has changed! Notice that urlpatterns is a list, the comma is in anticipation of all the routes that will be coming soon
	url(r'^log_score$', views.logScore),	# This line has changed! Notice that urlpatterns is a list, the comma is in anticipation of all the routes that will be coming soon
	url(r'^high_scores$', views.highScores),	# This line has changed! Notice that urlpatterns is a list, the comma is in anticipation of all the routes that will be coming soon
	url(r'^replay$', views.replay),	# This line has changed! Notice that urlpatterns is a list, the comma is in anticipation of all the routes that will be coming soon
]


# /{{number}}/delete - Have this be handled by a method named 'destroy'. For now, have this url redirect to /. 
