$(document).ready(function(){
var previous;
toggleSelectedMenu(previous,'#play');
previous = '#play';
hideElements('#helps', '#feed-back', '#instruct');

$('#instructions').click(function(){
	hideElements('#playGame','#helps','#feed-back');
	$('#instruct').show();
});	
$('#play').click(function(){
	hideElements('#instruct', '#helps', '#feed-back');
	$('#playGame').show();
});
$('#help').click(function(){
	hideElements('#instruct', '#playGame', '#feed-back');
	$('#helps').show();
});
$('#feedback').click(function(){
	hideElements('#instruct', '#playGame', '#helps');
	$('#feed-back').show();
});

	
$('#menu ul li').hover(function(){
	$(this).css({
		'background-color' :'rgb(99, 187, 203)',
		'color' :'white'});
	}, function(){
	$(this).css({
		'background-color' :'white',
		'color' : 'rgb(99, 187, 203)'});
	});
$('#menu ul li').click(function(){
		toggleSelectedMenu(previous, this);
		previous = this;
	});
	


 
});//end doc ready
 
 
 function hideElements(a,b,c){
	 $(a).hide();
	 $(b).hide();
	 $(c).hide();
	 
 }
 function toggleSelectedMenu(previous, current){
	$(previous).css('border-bottom' , '0px solid white');
	$(current).css('border-bottom' , '3px solid orange');
	
}
