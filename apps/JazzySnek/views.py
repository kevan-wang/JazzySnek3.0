from django.shortcuts import render, HttpResponse, redirect
from django.contrib import messages
from time import gmtime, strftime
from . models import User
import re, datetime, bcrypt, random, string


# Create your views here.

def index(request):
	context = {}
	if "userID" not in request.session:		#	Security feature:  This process will not execute without an authentic login.
		context["name"] = "Guest"
	else:
		context["name"] = User.objects.get(id=request.session["userID"]).userName
	return render(request, "JazzySnek/index.html", context)

def loginReg(request):
	return render(request, "JazzySnek/regLogin.html")

def quickGame(request):
	return render(request, "JazzySnek/game.html")

def howTo(request):
	return render(request, "JazzySnek/howToPlay.html")

def storyMode(request):
	context = {}
	if "userID" not in request.session:		#	Security feature:  This process will not execute without an authentic login.
		context["name"] = "Guest"
	else:
		context["name"] = User.objects.get(id=request.session["userID"]).userName
	return render(request, "JazzySnek/storyMode.html")

def highScores(request):
	context = {}
	if "userID" not in request.session:		#	Security feature:  This process will not execute without an authentic login.
		context["name"] = "Guest"
	else:
		context["name"] = User.objects.get(id=request.session["userID"]).userName
	context["users"] = User.objects.order_by("-highScore")[:10]
	return render(request, "JazzySnek/highScores.html", context)


def register(request):
	#	Executed when the registration form is submitted.
	userData = retrieveForms(request)
	errors = User.objects.validatorReg(userData)
	#	If any errors are found, store the errors as messages & redirect to root.
	if len(errors):
		for key, value in errors.items():
			messages.error(request, value)
		return redirect('/login_reg')
	#	If user is not in the database & all the forms are valid, create a new user with the hashed password and store on server database.
	else:
		password = userData['password1']
		hashedPW = bcrypt.hashpw(password.encode(), bcrypt.gensalt())
		securityKey = ''.join(random.choice(string.ascii_uppercase + string.digits) for _ in range(30))
		User.objects.create(userName=userData['userName'], passwordHash=hashedPW, securityKey=securityKey)
		messages.info(request, slangPos() + "  You have successfully registered!")
		return redirect('/login_reg')

def login(request):
	if "userID" in request.session:
		messages.info(request, slangPos() + "  You are already logged in!")
		return redirect("/login_reg")
	errors = User.objects.validatorLogin(request.POST)
	#	If any errors are found, store the errors as messages & redirect to root.
	if len(errors):
		for key, value in errors.items():
			messages.error(request, value)
		return redirect('/login_reg')
	else:
		#	If passwords match, flash a successful login message and redirect to dashboard.
		user = User.objects.filter(userName=request.POST["userName"]).first()
		#	Confirmation of login is the user's ID number stored in the session.
		request.session["userID"] = user.id
		request.session["securityKey"] = user.securityKey
		messages.info(request, slangPos() + "  Welcome back, " + user.userName + "!")
		return redirect("/login_reg")

def logout(request):
	#	Logging out removes he user's ID from session.
	if "userID" in request.session:
		request.session.pop("userID")
		request.session.pop("securityKey")
		messages.error(request, slangPos() + "  You have logged out.")
		return redirect('/')
	else:
		return redirect('/')

def logScore(request):
	if "userID" in request.session:
		score = request.POST["finalScore"]
		print(score)
		if score != "":
			scoreInt = int(score)
			print(scoreInt)
			user = User.objects.get(id=request.session["userID"])
			if scoreInt > user.highScore:
				user.highScore = scoreInt
				if (scoreInt > 50):
					user.status = "Hep Cat!"
				elif (scoreInt > 46):
					user.status = "Rug Cutter!"
				elif (scoreInt > 40):
					user.status = "Jitter Bug!"
				elif (scoreInt > 32):
					user.status = "Buddy Ghee!"
				elif (scoreInt > 24):
					user.status = "Mellow Jack!"
				elif (scoreInt > 18):
					user.status = "Basic Lane!"
				user.save()
	return redirect('/')

def replay(request):
	if "userID" in request.session:
		score = request.POST["finalScore"]
		print(score)
		if score != "":
			scoreInt = int(score)
			print(scoreInt)
			user = User.objects.get(id=request.session["userID"])
			if scoreInt > user.highScore:
				user.highScore = scoreInt
				if (scoreInt > 50):
					user.status = "Hep Cat!"
				elif (scoreInt > 46):
					user.status = "Rug Cutter!"
				elif (scoreInt > 40):
					user.status = "Jitter Bug!"
				elif (scoreInt > 32):
					user.status = "Buddy Ghee!"
				elif (scoreInt > 24):
					user.status = "Mellow Jack!"
				elif (scoreInt > 18):
					user.status = "Basic Lane!"
				user.save()
	return redirect('/quick_game')


#####		HELPER FUNCTIONS

def retrieveForms(request):
	# Returns a dictionary of the fields' names as keys and the fields' values (from registration/login page) as values.
	data = { }
	keys = ['userName', 'password1', 'password2']
	for key in keys:
		data[key] = request.POST[key]
	return data

def slangPos():
	randIndex = random.randint(0, len(positiveSlang)-1)
	return positiveSlang[randIndex]

positiveSlang = [ "Breakin' it Up!",  "Bustin' the Conk!",  "Collarin' the Jive!",
	"Dicty Dukes!", "Friskin' Whiskers!", "Get Your Boots On!", "In the Groove!",
	"Swell Jam!", "Hittin' the Licks!", "Muggin' Heavy!", "Neigho, Pops!", "Ridin' the Riffs!"
]

titles = [ "Square Jeff!", "Basic Lane!", "Basic Lane!", "Mellow Jack!", "Buddy Ghee!", "Jitter Bug!", "Rug Cutter!", "Hep Cat!" ]




