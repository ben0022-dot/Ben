# write hello world in python
print("Hello, world!")
#write code that calculates the result of (99^3)*8
result = (99 ** 3) * 8
print(result)
#what is your guess for the output of the following code?
#>>>15<8
print(15 < 8)
#>>>5<3
print(5 < 3)
#>>>3==3
print(3 == 3)
#>>>3=="3"
print(3 == "3")
#>>> "3" > 3
print("3" > 3)
#>>> "Hello" == "hello"
print("Hello" == "hello")

#create a variable called computer_brand which values is the brand of your computer
computer_brand = "Dell"
print(computer_brand)
#using the computer_brand variable, print a sentence that states the following:"I have a [computer_brand] computer"
print(f"I have a {computer_brand} computer.")
#create twovariables a,and b.
a = 10
b = 5
#each variable's should be a number.
print(a)
print(b)
#if a is bigger than b, have your code print "Hello World"
if a > b:
    print("Hello World")
    #write a code that asks the user for their number and determines if the number is even or odd.
number = int(input("Please enter a number: "))
if number % 2 == 0:
    print("The number is even.")
else:
    print("The number is odd.")
    #write a code that asks the user for their name and determines whether or not you have the same name.print out a funny message based on the outcome.
name = input("What is your name? ")
if name == "Alice":
    print("Wow, we have the same name! That's pretty cool!")
else:
    print("Nice to meet you, " + name + "! We have different names, but that's what makes it interesting!")
    #write code that will ask the user for their height in centimeters.
height_cm = float(input("Please enter your height in centimeters: "))
#convert the height to meters and print it out.
height_m = height_cm / 100
print(f"Your height in meters is: {height_m} m")
#if they are over 145cm,print a message that states they are all tall enough to ride.
if height_cm > 145:
    print("You are tall enough to ride!")
else:
    print("Sorry, you are not tall enough to ride.")
    #if they are not tall enough to ride, print a message that states they need to grow some more to ride.
    print("You need to grow some more to ride.")
    
