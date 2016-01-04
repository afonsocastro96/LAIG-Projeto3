extrai_pos_par(List, Result) :- extrai_pos_par_aux(List, Result, 0).
extrai_pos_par_aux([], [], _).
extrai_pos_par_aux([Elem|List], [Elem|Result], N) :- Rem is mod(N,2), !, Rem is 1, X is N+1, extrai_pos_par_aux(List, Result, X).
extrai_pos_par_aux([_|List], Result, N) :- X is N+1, extrai_pos_par_aux(List, Result, X).

extrai_geral(List, Result, Rule) :- extrai_geral_aux(List, Result, Rule).
extrai_geral_aux([], [], _).
extrai_geral_aux([Elem|List], [Elem|Result], Rule) :- Rule(Elem), extrai_geral_aux(List, Result, Rule).
extrai_geral_aux([_|List], Result, Rule) :- extrai_geral_aux(List, Result, Rule).