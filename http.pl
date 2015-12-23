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
	%sink_tile_aux(X,Y),
	Answer = "Sink Tile: ACK".

slide(StartX, StartY, EndX, EndY, Answer) :-
	%sink_tile_aux(StartX, StartY, EndX, EndY),
	Answer = "Slide Tile: ACK".

move(StartX, StartY, EndX, EndY, Answer) :-
	%move_tower_aux(StartX,StartY,EndX,EndY),
	Answer = "Move tower: ACK".

undo(Answer) :-
	%pop_move(Answer).
	Answer = "Undo: ACK".

pass(Answer) :-
	%pass,
	Answer = "Pass: ACK".
	
sinkstreak([Player, Streak]) :-
	(sink_streak(Player, Streak) -> true ; Player ='white', Streak = 0).

startgame(BoardType, Board) :-
	(board_length(Length) -> purge_database(Length);true), 
	(BoardType is 0 -> create_database(5), randomize_board_minor;create_database(7), randomize_board_major),
	format_board(Board).

botmove(Difficulty, Move) :-
	%current_player(Player), bot_action(Difficulty, Player, Move).
	Move = "I still don't do what I'm supposed to do :( Just uncomment my Prolog code once a funcional board exists to teach me what to do :D".

:- server(8081).