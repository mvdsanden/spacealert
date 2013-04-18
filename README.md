spacealert
==========

This is a Space Alert(tm) game that runs on html/javascript on the clients side and
on NodeJS on the server side. This will not be a comprehensive game only a tool to
play the Space Alert(tm) game over the internet.

The server side is very fast, because the game model is completely in memory. A game has
a dedicated server and everything is served by the async NodeJS engine.

For now I only implemented a few api calls:
- "/api/0/pieces": lists all the pieces of the board.
- "/api/0/pieces?lastStep=N": lists all the pieces that have changed since game step N.
- "/api/0/pieces/N": returns piece number N.
- "/api/0/pieces/N?call=setpos&x=X&y=Y": sets the position of piece N tp (X, Y).

Next to the api call the HTTP server also can serve files. At the moment it only serves
the root ("/") file which correspondes to the www/index.html file.

*Game Step*
To synchronize the game for multiple users we use game steps. This is a very simple
principle in which every time the board is changed, the game step increments. Every api
call returns among other things the current game step (which reflects the game step after
processing that api call). If an api call does not change anything on the board, the game
time will remain the same.

This way a client can find out if he has all the current information. If the client does
not have the current information it can ask for all the pieces that have been updated
since a specified game step.

*TODO*
- Use websockets for an information update stream.
