$(document).ready(function(){
		
	Game.initialize();

	$('#dialog').dialog({
		autoOpen : false
	});
	
	
	$('form').submit(function(){return false;});
	
	$('#submitAnswer').click(function(e){
		QuestionBox.userAnswer = $('#answerForm').val();
		if(QuestionBox.userAnswer == "CHEAT"){CHEAT.cheatMode();}//cheat option
		else if(QuestionBox.userAnswer != "" && QuestionBox.userAnswer != " "){
			Game.compareAnswer();
			Game.update();
		}
	});

	$('#submit').click(function(e){
		CHEAT.cheatCode = $('#cheat').val();
		CHEAT.handleCheatCode();
	});
	$('#restart').click(function(){
		Game.restart();
	});
	
});