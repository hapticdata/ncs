Notes on setting up an EC2 instance.
===

Notes on setting up an EC2 instance w/ node to run NDS. This is more a collection of notes than a guide; there are quite a few guides on setting up EC2 instances. I was largely following this guide:

[Paul Stamatiou Getting Started With Amazon EC2](http://paulstamatiou.com/how-to-getting-started-with-amazon-ec2)


Set up AWS on your machine
---

I'm using OS X

* Set up account with Amazon AWS
* In your home directory, create a "ec2" folder to hold the ecs tools and your certs.
* Create your X509 Certificate from the amazon security credentials interface in your account web interface.
* Download the Private Key and Cert, keep them safe, put them in ~/ec2.
* Download the Amazon EC2 API Tools from amazon, put the contents of the API tools folder in ~/ec2

* Add ENV vars to your bash profile

		export EC2_HOME=~/ec2
		export PATH=$PATH:$EC2_HOME/bin
		export EC2_PRIVATE_KEY=pk-YOURKEYNAME.pem
		export EC2_CERT=cert-YOURKEYNAME.pem
		export JAVA_HOME=/System/Library/Frameworks/JavaVM.framework/Home/

* Hope you have java?
* Setup a key pair for ssh-ing with the ec2 tools
	* ec2-add-keypair pstam-keypair
	* paste the contents of the private key into a new file "id_rsa-pstam-keypair" (You want the lines with ===== and everything in between)
	* protect the file `sudo chmod 600 id_rsa-pstam-keypair`


Pick Your AMI, Create Your Server!
---

AMI's are full OS images, from which you can initialize your EC2 instance. For this, I'm going with the default linux AMI, US west: `ami-1b814f72` 

[Amazon Linux AMI](http://aws.amazon.com/amazon-linux-ami/)

* Create the instance. (It took like 10 seconds, crazy fast!)

		ec2-run-instances ami-1b814f72 -k pstam-keypair

* Show the instance info, including url
		
		ec2-describe-instances

* Open a port for ssh, might as well get 80 for http as well (At this point http:// doesn't work. There is no web server... yet.)

		ec2-authorize default -p 22 
		ec2-authorize default -p 80


Take a Look Around
---

* Lets ssh in

		ssh -i id_rsa-pstam-keypair ec2-user@ec2-XXX-XXX-XXX-XXX.z-2.compute-1.amazonaws.com

This didn't work for me the first time. It would popup a password field, and i don't have a password to give.
This was because I messed up the copy/paste of the key. Be sure to get copy the start and end lines (the ones with the =====)

* Lets look around 

		ls /
		ls /bin
		ls /usr/bin
		ls /usr/local/bin
		ls /local/bin

* Hell Yeah!


Install Software
---

The Amazon Linux API doesn't have Node. It also doesn't have Apache or PHP. As [Amazon's Description](http://aws.amazon.com/amazon-linux-ami/) says, it is a minimal linux environment; you add what you want. It _is_ set up with tools and configs that make it easy and efficent to use with AWS. Its probably a good idea to look over [Amazon's Intro] (http://docs.amazonwebservices.com/AWSEC2/latest/UserGuide/AmazonLinuxAMIBasics.html?r=6080)

We want to install Node, but need to install some other tools to do this first. Amazon provides yum to help install software. 

* ssh in.
* Lets see what packages are installed.
	
		yum list installed

* While we are here, lets update the packages that are currently installed.

		sudo yum update

* Lets see what packages are available (piping to more lets you page through the results).

		yum list available | more

There are tons of packages ready to install from yum, but not node (but double check, maybe they'll add it). Lets install Node from source. We can get the Node project with git, and we'll need gcc to compile it.

* Install git!
		
		sudo yum install -y git

* Install gcc.
		yum install gcc gcc-c++ autoconf automake

* We need this too.
	yum install openssl-devel

* Get the source.
		
		sudo git clone https://github.com/joyent/node.git

* Switch to the 0.6.13 (I want to use socketio, which can't work with the latest at yet)

		cd node
		sudo git checkout v0.6.13

* Configure it
		
		./configure

* Make it.
		
		sudo make

* Install it.
	
		sudo make install

* Did it work
		
		which node
		which npm

* Yay!


Hello, Node
---
Lets create a dead simple example server.

* Create a file "example_server.js"
* Put this code in it

		var http = require('http');
		http.createServer(function (req, res) {
		  res.writeHead(200, {'Content-Type': 'text/plain'});
		  res.end('Hello, Node\n');
		}).listen(80);
		console.log('Server runnin at: 80');

* Run it!
sudo env PATH=$PATH nohup node example_server.js &>>log &

We need to run the server as root as it talks with port 80. Use `env PATH=$PATH` to tell sudo to use our path, `nohup` so that the application won't be quit by us logging out. Root output to a file called log. Use `&` at the end so our terminal won't wait around for the server to finsih.

* Then loat that ec2-x-x-x-x...com url in a browser and...

> HELLO WORLD


A Silly Benchmark
---

		(function() {
		  var n, start, sum;
		  start = Date.now();
		  sum = 0;
		  for (n = 1; n <= 1000000000; n++) {
		    sum += Math.sqrt(n);
		  }
		  console.log("sum of sqrts of the numbers 1 to 1 billion", sum);
		  console.log("took", Date.now() - start);
		}).call(this);

On my laptop:

> sum of sqrts of the numbers 1 to 1 billion 21081851083600.56
> took 10641

On the ec2 micro:

> sum of sqrts of the numbers 1 to 1 billion 21081851083600.56
> took 24150

Not bad, but now I really wanna try one of ec2's big guns.


More?
---
[LAMP Guide](http://codelikezell.com/setting-up-rails-mysql-php-apache-and-git-on-ec2/)




