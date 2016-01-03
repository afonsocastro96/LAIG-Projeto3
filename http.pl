:- use_module(library(http/thread_httpd)).
:- use_module(library(http/http_dispatch)).
:- use_module(library(http/http_path)).
:- use_module(library(http/http_client)).
:- use_module(library(http/http_server_files)).
:- use_module(library(lists)).

:- consult('board.pl').

:- http_handler(root(game), prepReplyStringToJSON, []).						% Predicate to handle requests on server/game (for Prolog Game Logic)
:- http_handler(javascript(.), serve_files_in_directory(javascript), [prefix]).			% Serve files in /pub as requested (for WebGL Game Interface)
http:location(javascript, root(javascript), []).											% Location of /pub alias on server
user:file_search_path(document_root, '.').									% Absolute location of HTTP server document root
user:file_search_path(javascript, document_root(javascript)).								% location of /pub in relation to document root

server(Port) :- http_server(http_dispatch, [port(Port)]).		% Start server on port Port

%Receive Request as String via POST
prepReplyStringToJSON(Request) :- 
		member(method(post), Request), !,						% if POST
        http_read_data(Request, Data, []),						% Retrieve POST Data
		processString(Data, Reply),								% Call processing predicate
		format('Content-type: application/json~n~n'),			% Reply will be JSON
		formatAsJSONTest(Reply).									% Send Reply as JSON

prepReplyStringToJSON(_Request) :-								% Fallback for non-POST Requests
		format('Content-type: text/plain~n~n'),					% Start preparing reply - reply type
		write('Can only handle POST Requests'),					% Standard Reply
		format('~n').											% End Reply

formatAsJSONTest(Reply):-
		write('{'),												% Start JSON Object
		Fields = [answer],										% Response Field Names
		writeJSON(Fields, Reply).								% Format content as JSON 
		
writeJSON([Prop], [Val]):-
	write('"'), write(Prop),
	write('":"'), write(Val), write('"}').						% Last element
writeJSON([Prop|PT], [Val|VT]):-
	write('"'), write(Prop),
	write('":"'), write(Val), write('", '),						% Separator for next element
	writeJSON(PT, VT).

processString([_Par=Val], R) :-
		term_string(List, Val),
		R = [_M],
		append(List, R, ListR),
		Term =.. ListR,
		Term.
%---------------------------------------------

/* Nota, as chamadas as funcoes auxiliares pressupoem que todos os X e Y sao numeros de 0 a length-1.
Tranformacoes necessarias devem ser feitas no javascript */
sink(X,Y, Answer) :-
	push_move(['sink', X, Y]),
	push_sinked_tile(X, Y),
	sink_tile_aux(X,Y),
	push_sink_streak,
	push_number_passes,
	Answer = "Sink Tile: ACK".

slide(StartX, StartY, EndX, EndY, Answer) :-
	push_move(['slide', StartX, StartY, EndX, EndY]),
	slide_tile_aux(StartX, StartY, EndX, EndY),
	push_sink_streak,
	push_number_passes,
	Answer = "Slide Tile: ACK".

move(StartX, StartY, EndX, EndY, Answer) :-
	push_move(['movetower', StartX, StartY, EndX, EndY]),
	move_tower_aux(StartX,StartY,EndX,EndY),
	push_sink_streak,
	push_number_passes,
	Answer = "Move tower: ACK".

undo(Answer) :-
	undo_move(Answer),
	pop_sink_streak,
	pop_number_passes.

pass(Answer) :-
	pass,
	push_move(['pass']),
	push_sink_streak,
	push_number_passes,
	Answer = "Pass: ACK".


available_moves(Answer) :- current_player(Player), available_actions(Player, Actions), convert_actions(Actions, Answer).

sinkstreak(Answer) :-
	sink_streak(Answer).

numberpasses(Answer) :- number_pass(Answer).

sinkstreakstack(Answer) :- convert_sink_streak_stack(Answer).
numberpassesstack(Answer) :- convert_number_passes_stack(Answer).

startgame(BoardType, Answer) :-
	(board_length(Length) -> purge_database(Length);true), 
	(BoardType is 0 -> create_database(5), randomize_board_minor;create_database(7), randomize_board_major),
	push_sink_streak,
	push_number_passes,
	format_board(Answer).

setuptowers(Answer) :- get_towers_status(Answer).
gettowers(Answer) :- get_towers(Answer).

addtower('light', Row, Col, 'addtower: ACK') :- insert_tower(Row, Col, 'L').
addtower('dark', Row, Col, 'addtower: ACK') :- insert_tower(Row, Col, 'T').

gamemode(Mode, 'Gamemode: ACK') :- Mode == 'MvM', set_mode(Mode), randomize_towers.
gamemode(Mode, 'Gamemode: ACK') :- Mode == 'HvM', set_mode(Mode).
gamemode(Mode, 'Gamemode: ACK') :- Mode == 'HvH', set_mode(Mode).

setDifficulty(Difficulty, 'Difficulty: ACK') :- set_difficulty(Difficulty).

finishsetup([SinkStreak, NumberPasses]) :- sink_streak_stack(_), game_mode('HvH'), sinkstreakstack(SinkStreak), numberpassesstack(NumberPasses).
finishsetup([SinkStreak, NumberPasses]) :- sink_streak_stack(_), game_mode('HvM'), difficulty(BotDifficulty), bot_pick_colour(BotDifficulty, Colour), assert(is_bot(Colour)), sinkstreakstack([SinkStreak]), numberpassesstack([NumberPasses]).
finishsetup([SinkStreak, NumberPasses]) :- sink_streak_stack(_), game_mode('MvM'), difficulty(_), assert(is_bot('white'), assert(is_bot('black'))), sinkstreakstack(SinkStreak), numberpassesstack(NumberPasses).
finishsetup('Finish Setup: REJ').

nextplay([GameOver, Winner, Condition]) :- check_winning_condition(Winner), GameOver = 2, win_condition(Condition).
nextplay([CurrentPlayer,Moves]) :- current_player(CurrentPlayer), is_bot(CurrentPlayer), Moves = 0.
nextplay([CurrentPlayer,Moves]) :- current_player(CurrentPlayer), available_moves(Moves).

:- server(8081).