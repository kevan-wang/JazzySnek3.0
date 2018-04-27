from __future__ import unicode_literals
from django.db import models
import re, datetime, bcrypt, random

# Create your models here.

class UserManager(models.Manager):
	def validatorReg(self, userData):
		#	Checks form validity.
		errors = {}
		for key in userData:		#  Checks that all the forms have been filled out.  Adds error to the errors dictionary if found.
			if userData[key] == "":
				errors["emptyField"] = slangNeg() + "  All forms must be filled out!"
				break
		errors.update(validName(userData["userName"]))		#  Check validity of email, add all errors found to the errors dictionary.
		errors.update(validPassword(userData["password1"]))	#  Check validity of password, add all errors found to the errors dictionary.
		if userData["password1"] != userData["password2"]:			#  Checks that the passwords match, adds error to the errors dictionary if found..
			errors["passMatch"] = slangNeg() + "  Confirmation password does not match!"
		if User.objects.filter(userName=userData['userName']).count() != 0:	#  Checks if the user is already registered.
			errors["register"] = slangNeg() + "  User already exists in database!"
		return errors
	def validatorLogin(self, postData):
		errors = {}
		userName = postData["userName"]
		userPassword = postData["password"]
		#	Check if the email is found in the database of registered users.
		if User.objects.filter(userName=userName).count() == 0:
			errors["login"] = slangNeg() + "  Invalid login info!"
		else:
			user = User.objects.filter(userName=userName).first()
			hashedPW = user.passwordHash
			#	Check if the password matches the hashed password in the database.
			if not bcrypt.checkpw(userPassword.encode('utf-8'), hashedPW.encode('utf-8')):
				errors["login"] = slangNeg() + "  Invalid login info!"
		return errors

class User(models.Model):
	userName = models.CharField(max_length=255)
	passwordHash = models.TextField()
	securityKey = models.CharField(max_length=255)
	highScore = models.IntegerField(default=0)
	fastestTime = models.IntegerField(default=0)
	status = models.CharField(max_length=30, default="Square Jeff")
	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)
	objects = UserManager()






#####  HELPER FUNCTIONS

def hasNumber(string):
	#	Helper function.  Checks if a string has a number in it.
	#	Input:  
	for char in string:
		if char.isnumeric():
			return True
	return False

def hasCap(string):
	#	Helper function.  Checks if a string has a capitalized letter in it.
	capitals = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
	for char in string:
		if char in capitals:
			return True
	return False

def validName(name):
	#	Helper function.  Checks if name is valid (only alphabetic letters and name length is 2 characters or more)
	#	Input:  String.  Either first name or last name.
	#	Output:  Dictionary of error messages.
	errors = {}
	if len(name) < 3 or len(name) > 18:
		errors["nameLen"] = slangNeg() + "  Name must be between 3 to 18 characters in length!"
	return errors

def validPassword(password):
	#	Helper function.  Checks if email is valid (at least 1 capital letter, 1 number)
	#	Input:  String.  Password.
	#	Output:  Dictionary of error messages.
	errors = {}
	if len(password) < 8:
		errors["passLen"] = slangNeg() + "  Password must be at least 8 characters long!"
	if not hasNumber(password):
		errors["passNum"] = slangNeg() + "  Password requires at least one number!"
	if not hasCap(password):
		errors["passCap"] = slangNeg() + "  Password requires at least one capitalized letter!"
	return errors

def slangNeg():
	randIndex = random.randint(0, len(negativeSlang)-1)
	return negativeSlang[randIndex]

negativeSlang = [ "Sad and Salty!", "Off Time Jive!", "Nixed Out!",
	"Wrong Riff!", "Beat for the Doss!"
]


