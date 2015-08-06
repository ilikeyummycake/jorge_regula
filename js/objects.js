//namespace for location variables
var Location = {
	feed : '#feed',
	question : '#question',
	tries : '#tries',
	points : '#points',
	temp : '#temp',
	hp : '#hp'
};

var Answer = {
	answer : 0,
	question : " ",
	isCorrect : false,
	
	generateQuestion : function(){//handles random question making
		switch(Game.level){
			case 1:
				this.genlvlOne();
			break;
			case 2: 
				this.question = "level 2 question";
			break;
			case 3:
				this.question = "level 3 question";
			break;
		}
		
	},
	genlvlOne : function(){//gets  a random lvl1 question and fills Q & A
		var num1 = this.randNum(100);
		var num2 = this.randNum(100);
		var operator = this.randNum(5);
		
		switch(operator){
			case 1:
				this.question = '<p>' + num1 + ' + ' + num2 + '</p>';
				this.answer = (num1 + num2);
			break;
			case 2:
				this.question = '<p>' + num1 + ' - ' + num2 + '</p>';
				this.answer = (num1 - num2);
			break;
			case 3:
				this.question = '<p>' + num1 + ' * ' + num2 + '</p>';
				this.answer = (num1 * num2);
			break;
			case 4:
				this.question = '<p>' + num1 + ' % ' + num2 + '</p>';
				this.answer = (num1 % num2);
			break;
			case 5:
				if(num1 < num2){
					var temp = num1;
					num1 = num2;
					num2 = temp;
				}
				this.question = '<p>' + num1 + ' / ' + num2 + '</p>';
				this.answer = Math.round(num1 / num2);
			break;			
		}
	},
	randNum : function(num){//returns a random number [0,num]
		return Math.ceil(Math.random() * num);
	}

};

var QuestionBox ={
	userAnswer : 0,
	
	printQuestion: function(){//appends question to QBox
		$(Answer.question).appendTo(Location.question);
	},
	update : function(){
		$(Location.question).empty();
		this.printLevel();
		this.printQuestion();
		this.updateAttemptsMeter();
	},
	updateAttemptsMeter : function(){
		var message = '<p>attempts remaining: ' +  Game.tries + '</p>';
		ProgressBar.update('yellow', Game.tries, Game.maxTries, message,  Location.tries);		
	},
	printLevel : function(){
		$('#question p').remove();
		$('<p>Level ' + Game.level + '</p>').css({
			'margin' : '70px 0px 0px 50px', 
			'color' : 'orange',
			'font-size' : '14px'})
			.appendTo(Location.question);
	}
};

var ProgressBar = {
	
	update : function(color, value, maxValue, status, location){
		$(location).empty();
		var temp = (value / maxValue) * 200;
		
		$(status).css({
			'font-size' : '12px',
			'margin' : '-15px 15px 0px 0px',
			'whiteSpace' : 'pre'}).appendTo(location);
		$('<div></div>').css({
			'background-color' : color,
			'height' : '29px',
			'width' : temp+'px'}).appendTo(location);
	}
};

var Feed = {
	update : function(){
		if(Answer.isCorrect){
			this.printFeed(true);
		} else{
			this.printFeed(false);
		}
	},
	printFeed : function(isCorrectAnswer){
		if(isCorrectAnswer == true){
			var message = $('<p>' + Answer.question + 'your answer: '
				+ Answer.answer + '<br>Correct answer!</p>').css('color' , 'blue');
		}
		else{
			var message = $('<p>' + Answer.question + 'your answer: '
				+ QuestionBox.userAnswer + '<br>Wrong answer!<br>correct answer: ' +
				Answer.answer + '</p>').css({'color' : 'orange'});
		}

		$(message).appendTo(Location.feed);
		$(Location.feed).scrollTop(1E10);
	},
	empty : function(){
		$(Location.feed).empty();
	}
	
};

var Animation = {
	
	update : function(){
		//update points meter
		this.updatePointsMeter();
		this.updateTempGage();
		this.updateHpMeter();
		

	},
	updatePointsMeter : function(){
		var pointsMessage = '<p>points: ' + Game.points + '                 wrong: ' + Game.wrong + '</p>';
		ProgressBar.update('rgb(99, 187, 203)' , Game.points, Game.pointsNextLevel, pointsMessage, Location.points);
	},
	updateTempGage : function(){
		var tempMessage = '<p>temperature: ' + Game.temperature + '&deg; F/ ' + Math.round((5/9)*(Game.temperature  - 32))+'&deg; C</p>';
		ProgressBar.update('coral' , (Game.temperature + 50), 150, tempMessage, Location.temp);
	},
	updateHpMeter : function(){
		var hpMsg = '<p>HP: ' + Game.hp + '                armor: ' + Game.armor + '</p>';
		ProgressBar.update('rgb(248, 71, 71)' , Game.hp, Game.maxHp, hpMsg, Location.hp);
	}
};
var Game = {
		points: 0,
		pointsNextLevel : 15, 
		tries : 20,
		maxTries : 20, 
		wrong : 0, 
		temperature : 32,
		armor : 10,
		level : 1,
		hp : 100,
		maxHp : 100,
		
		update : function(){
			Feed.update();
			this.initialize();
			
		},
		initialize : function(){
			Animation.update();
			
			if(this.tries >= 0 && this.hp > 0 && this.temperature < 100){//run game ONLY when there are tries left and health remaining
				Answer.generateQuestion();
				QuestionBox.update();
			}
			else{this.over();}
		},
		compareAnswer : function(){
			if(QuestionBox.userAnswer == Answer.answer){
				this.handleLevel(true);
				Answer.isCorrect = true;
			}else{
				this.handleLevel(false);
				Answer.isCorrect = false;
			}
			--this.tries;
			if(this.tries == 0){this.over();}
		},
		handleAttributes : function(attr, num){//attr refers to the attribute, num is the number to increase it by
			if(attr == 'points'){this.points+=num;}
			else if(attr == 'tries' ){ this.tries+=num;}
			else if(attr == 'wrong' ){ this.wrong+=num;}
			else if(attr == 'pointsNextLevel' ){ this.pointsNextLevel+=num;}
			else if(attr == 'maxTries' ){ this.maxTries+=num;}
			else if(attr == 'temperature' ){ this.temperature+=num;}
			else if(attr == 'armor' ){this.armor+=num;}
			else if(attr == 'level' ){ this.level+=num;}
			
		},
		handleLevel : function(gainedPoint){
			if(gainedPoint == true){
				--this.temperature;
				++this.points;
				++this.armor;
				if(this.points >= this.pointsNextLevel && this.level < 7){
					Boss.initiate();
					++this.level;
					this.updatePointsNextLevel();
					alert(this.level + ' ' + this.points + ' ' + this.pointsNextLevel);
				}
			}
			else{
				--this.points;
				++this.temperature;
				if(this.armor > 0){--this.armor;}
				else{--this.hp;}
				++this.wrong;
			}
		},
		updatePointsNextLevel : function(){
			switch(this.level){
				case 1:
					this.pointsNextLevel = 15;
				break;
				case 2:
					this.pointsNextLevel = 30;
				break;
				case 3:
					this.pointsNextLevel = 45;
				break;
				case 4:
					this.pointsNextLevel = 75;
				break;
				case 5:
					this.pointsNextLevel = 120;
				break;
				case 6:
					this.pointsNextLevel = 195;
				break;
				case 7:
					this.pointsNextLevel = 315;
				break;
			}
		},
		over : function(){
			
			var dialogBox = '<div id ="gameOver" title = "GAME OVER"><p>SORRY, YOU LOSE!</p></div>';
			$(dialogBox).dialog({
				autoOpen : true,
				modal : true
			});
			this.restart();
		
		},
		restart : function(){
			Feed.empty();
			this.points = 0;
			this.pointsNextLevel = 15;
			this.tries = 20;
			this.maxTries = 20;
			this.wrong = 0;
			this.temperature = 32;
			this.armor = 10;
			this.level = 1;
			this.hp = 100;
			this.maxHp = 100;
			this.initialize();
		}
};

var CHEAT = {
	cheatCode : "",

	cheatMode : function(){
		$('#dialog').dialog('open');
	},
	handleCheatCode : function(){
		if(this.cheatCode == 'nextLevel'){
			Game.points = Game.pointsNextLevel;
			if(Game.level < 7){
				++Game.level;
				Boss.initiate();
			}
			Game.updatePointsNextLevel();
			var msg = 'You are now at level ' + Game.level + ' with ' 
			+ Game.points +' points. You need ' + Game.pointsNextLevel 
			+ ' points to reach the next level';
		}
		else if(this.cheatCode == 'moreTries'){
			var temp = Math.round(prompt("How many tries would you like to gain?"));
			Game.tries += temp;
			if(Game.tries > Game.maxTries){Game.maxTries =Game.tries;}
			var msg = 'You now have ' + Game.tries + ' tries';
			QuestionBox.updateAttemptsMeter();
		}
		else if(this.cheatCode == 'moreHP'){
			var temp = Math.round(prompt("How many HP would you like to add?"));
			Game.hp += temp;
			if(Game.hp > Game.maxHp){Game.maxHp = Game.hp;}
			var msg = 'You now have ' + Game.hp + ' HP';
			if(Game.hp <= 0){Game.over();}
		}
		else if(this.cheatCode == 'morePoints'){
			Game.points +=10;
			if(Game.points >= Game.pointsNextLevel){
				Boss.initiate();
				++Game.level;
				Game.updatePointsNextLevel();
			}
			var msg = 'You now have ' + Game.points + ' points';
		}
		else{var msg = "invalid entry";}
		
		Game.initialize();
		alert(msg) ;
		
	}
	
	
};

var Boss = {
	
	initiate : function(){
		//get a new question/answer first
		//these depend on the level
			$('<div title="Boss">' + Answer.question +
			'<input  name = "Boss" type = "text"><input type="submit" value="Submit"></div>').dialog({
				autoOpen: true,
				modal : true
			});
			$('input:submit').click(function()
			{
				alert('clicked');
			//handle the boss battle input in here
			//check to see if answer is correct
			//if yes, inform and exit dialog and gain stuff
			//if no, try again (each try takes away health/armor)
			//if health goes under after tries, game over
			//if tries run out and still not answered, game over
			});
	}
	
};