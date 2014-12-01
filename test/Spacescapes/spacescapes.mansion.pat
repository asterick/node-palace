; Mansion Layout
;
ENTRANCE 810


ROOM
	ID 810
	DROPZONE
	NAME "Carinda"
	PICT "carinda.gif"
	ARTIST "StuShepherd"
	PICTURE ID 4 NAME "roomright.gif" TRANSCOLOR 181 ENDPICTURE
	PICTURE ID 5 NAME "roomleft.gif" TRANSCOLOR 181 ENDPICTURE
	PICTURE ID 6 NAME "star1.gif" TRANSCOLOR 181 ENDPICTURE
	PICTURE ID 7 NAME "star2.gif" TRANSCOLOR 181 ENDPICTURE
	PICTURE ID 8 NAME "star3.gif" TRANSCOLOR 181 ENDPICTURE
	PICTURE ID 12 NAME "star4.gif" TRANSCOLOR 181 ENDPICTURE
	PICTURE ID 18 NAME "starset1.gif" TRANSCOLOR 0 ENDPICTURE
	PICTURE ID 19 NAME "starset2.gif" TRANSCOLOR 0 ENDPICTURE
	PICTURE ID 20 NAME "starset3.gif" TRANSCOLOR 0 ENDPICTURE
	PICTURE ID 21 NAME "starset4.gif" TRANSCOLOR 0 ENDPICTURE
	PICTURE ID 16 NAME "redlight1.gif" TRANSCOLOR 181 ENDPICTURE
	PICTURE ID 17 NAME "redlight2.gif" TRANSCOLOR 181 ENDPICTURE
	DOOR
		ID 4
		NAME "Next"
		DONTMOVEHERE
		DEST 820
		OUTLINE 473,349  509,349  509,381  473,381
		PICTS 4,0,0 ENDPICTS
		ENDDOOR
	DOOR
		ID 5
		NAME "Previous"
		DONTMOVEHERE
		DEST 840
		OUTLINE 3,349  39,349  39,381  3,381
		PICTS 5,0,0 ENDPICTS
		SCRIPT
ON SIGNON
{
"Welcome to " SERVERNAME + ", " + USERNAME + "!" + LOCALMSG
}
		ENDSCRIPT
		ENDDOOR
	SPOT
		ID 3
		NAME "Right Star"
		OUTLINE 445,6  457,6  457,14  445,14
		PICTS 6,0,0 7,0,0 8,0,0 7,0,0 8,0,0 ENDPICTS
		SCRIPT
ON ENTER { 5 ME SETALARM }
ON ALARM {
{ 0 ME SETSPOTSTATELOCAL }
{ ME GETSPOTSTATE 1 + ME SETSPOTSTATELOCAL }
ME GETSPOTSTATE 3 > IFELSE
24 ME SETALARM
}
		ENDSCRIPT
		ENDSPOT
	SPOT
		ID 9
		NAME "Left Star"
		OUTLINE 44,27  55,27  55,35  44,35
		PICTS 7,0,0 12,0,0 8,0,0 ENDPICTS
		SCRIPT
ON ENTER { 5 ME SETALARM }
ON ALARM {
{ 0 ME SETSPOTSTATELOCAL }
{ ME GETSPOTSTATE 1 + ME SETSPOTSTATELOCAL }
ME GETSPOTSTATE 1 > IFELSE
44 ME SETALARM
}
		ENDSCRIPT
		ENDSPOT
	SPOT
		ID 7
		NAME "Ground Light"
		OUTLINE 277,292  290,292  290,300  277,300
		PICTS 6,0,0 7,0,0 6,0,0 12,0,0 ENDPICTS
		SCRIPT
ON ENTER { 9 ME SETALARM }
ON ALARM {
{ 0 ME SETSPOTSTATELOCAL }
{ ME GETSPOTSTATE 1 + ME SETSPOTSTATELOCAL }
ME GETSPOTSTATE 2 > IFELSE
24 ME SETALARM
}
		ENDSCRIPT
		ENDSPOT
	SPOT
		ID 6
		NAME "Mid Cluster"
		OUTLINE 149,34  175,34  175,51  149,51
		PICTS 18,0,0 20,0,0 19,0,0 21,0,0 18,0,0 19,0,0 21,0,0 ENDPICTS
		SCRIPT
ON ENTER { 9 ME SETALARM }
ON ALARM {
{ 0 ME SETSPOTSTATELOCAL }
{ ME GETSPOTSTATE 1 + ME SETSPOTSTATELOCAL }
ME GETSPOTSTATE 5 > IFELSE
84 ME SETALARM
}
		ENDSCRIPT
		ENDSPOT
	SPOT
		ID 8
		NAME "Right Cluster"
		OUTLINE 268,29  299,29  299,49  268,49
		PICTS 18,0,0 19,0,0 20,0,0 21,0,0 ENDPICTS
		SCRIPT
ON ENTER { 9 ME SETALARM }
ON ALARM {
{ 0 ME SETSPOTSTATELOCAL }
{ ME GETSPOTSTATE 1 + ME SETSPOTSTATELOCAL }
ME GETSPOTSTATE 2 > IFELSE
64 ME SETALARM
}
		ENDSCRIPT
		ENDSPOT
	SPOT
		ID 11
		NAME "Upper Red Light"
		OUTLINE 381,17  394,17  394,29  381,29
		PICTS 16,0,0 16,0,0 17,0,0 ENDPICTS
		SCRIPT
ON ENTER { 10 ME SETALARM }
ON ALARM {
{ 0 ME SETSPOTSTATELOCAL }
{ ME GETSPOTSTATE 1 + ME SETSPOTSTATELOCAL }
ME GETSPOTSTATE 1 > IFELSE
24 ME SETALARM
}
		ENDSCRIPT
		ENDSPOT
	SPOT
		ID 12
		NAME "Left Cluster"
		OUTLINE 47,40  70,40  70,60  47,60
		PICTS 21,0,0 20,0,0 19,0,0 18,0,0 20,0,0 19,0,0 ENDPICTS
		SCRIPT
ON ENTER { 10 ME SETALARM }
ON ALARM {
{ 0 ME SETSPOTSTATELOCAL }
{ ME GETSPOTSTATE 1 + ME SETSPOTSTATELOCAL }
ME GETSPOTSTATE 4 > IFELSE
104 ME SETALARM
}
		ENDSCRIPT
		ENDSPOT
	SPOT
		ID 10
		OUTLINE 397,98  409,98  409,110  397,110
		PICTS 16,0,0 17,0,0 17,0,0 16,0,0 ENDPICTS
		SCRIPT
ON ENTER { 10 ME SETALARM }
ON ALARM {
{ 0 ME SETSPOTSTATELOCAL }
{ ME GETSPOTSTATE 1 + ME SETSPOTSTATELOCAL }
ME GETSPOTSTATE 2 > IFELSE
24 ME SETALARM
}
		ENDSCRIPT
		ENDSPOT
	ENDROOM


ROOM
	ID 820
	DROPZONE
	NAME "Synura"
	PICT "synura.gif"
	ARTIST "StuShepherd"
	PICTURE ID 4 NAME "roomright.gif" TRANSCOLOR 0 ENDPICTURE
	PICTURE ID 5 NAME "roomleft.gif" TRANSCOLOR 0 ENDPICTURE
	DOOR
		ID 4
		NAME "Next"
		DONTMOVEHERE
		DEST 830
		OUTLINE 473,349  509,349  509,381  473,381
		PICTS 4,0,0 ENDPICTS
		ENDDOOR
	DOOR
		ID 5
		NAME "Previous"
		DONTMOVEHERE
		DEST 810
		OUTLINE 3,349  39,349  39,381  3,381
		PICTS 5,0,0 ENDPICTS
		ENDDOOR
	ENDROOM


ROOM
	ID 830
	DROPZONE
	NAME "Vesparia"
	PICT "vesparia.gif"
	ARTIST "StuShepherd"
	PICTURE ID 4 NAME "roomright.gif" TRANSCOLOR 0 ENDPICTURE
	PICTURE ID 5 NAME "roomleft.gif" TRANSCOLOR 0 ENDPICTURE
	DOOR
		ID 4
		NAME "Next"
		DONTMOVEHERE
		DEST 840
		OUTLINE 473,349  509,349  509,381  473,381
		PICTS 4,0,0 ENDPICTS
		ENDDOOR
	DOOR
		ID 5
		NAME "Previous"
		DONTMOVEHERE
		DEST 820
		OUTLINE 3,349  39,349  39,381  3,381
		PICTS 5,0,0 ENDPICTS
		ENDDOOR
	ENDROOM


ROOM
	ID 840
	DROPZONE
	NAME "Cascadia"
	PICT "cascadia.gif"
	ARTIST "StuShepherd"
	PICTURE ID 4 NAME "roomright.gif" TRANSCOLOR 0 ENDPICTURE
	PICTURE ID 5 NAME "roomleft.gif" TRANSCOLOR 0 ENDPICTURE
	DOOR
		ID 4
		NAME "Next"
		DONTMOVEHERE
		DEST 810
		OUTLINE 473,349  509,349  509,381  473,381
		PICTS 4,0,0 ENDPICTS
		ENDDOOR
	DOOR
		ID 5
		NAME "Previous"
		DONTMOVEHERE
		DEST 830
		OUTLINE 3,349  39,349  39,381  3,381
		PICTS 5,0,0 ENDPICTS
		ENDDOOR
	ENDROOM

END