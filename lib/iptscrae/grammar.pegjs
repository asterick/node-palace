// I need to find a better method of doing this
{ var Types = options.types; }

Ipscrae
	= r:TopComponent* _
		{ return r; }

// === Top-Level Element Group ========
TopComponent
	= Entrance
	/ Room
	/ EventHandler
	/ End
	/ AtomList

WorldComponent
	= Room

RoomComponent
	= Id
	/ Name
	/ Background
	/ Artist
	/ Picture
	/ Flag
	/ Spot
	/ Door
	/ Bolt
	/ MaxMembers
	/ MaxGuests

SpotComponent
	= Id
	/ Name
	/ Outline
	/ PictureSet
	/ Script
	/ Location
	/ Flag
	/ Destination
	/ Script

PictureComponent
	= Id
	/ Name
	/ TransparentColor

ScriptComponent
	= EventHandler

// === Component Tags ===================

Entrance
	= _ "ENTRANCE"i __ id:Number
		{ return { type: "Mansion", entrance: id, body: body }; }

End
	= _ "END"i __
		{ return { type: "End" }; }

Room
	= _ "ROOM"i __ body:RoomComponent* _ "ENDROOM"i __
		{ return { type: "Room", body: body }; }

Spot
	= _ "SPOT"i __ body:SpotComponent* _ "ENDSPOT"i __
		{ return { type: "Spot", body: body }; }

Door
	= _ "DOOR"i __ body:SpotComponent* _ "ENDDOOR"i __
		{ return { type: "Door", body: body }; }

Bolt
	= _ "BOLT"i __ body:SpotComponent* _ "ENDBOLT"i __
		{ return { type: "Bolt", body: body }; }

Script
	= _ "SCRIPT"i __ body:ScriptComponent* _ "ENDSCRIPT"i __
		{ return { type: "Script", body: body }; }

Picture
	= _ "PICTURE"i __ body:PictureComponent* _ "ENDPICTURE"i __
		{ return { type: "Picture", body: body }; }

Id
	= _ "ID"i __ id:Number
		{ return { type: "Identifier", id: id }; }

Name
	= _ "NAME"i __ name:String
		{ return { type: "Name", name: name }; }

Location
	= _ "LOC"i __ vert:Vertex
		{ return { type: "Location", position: vert }; }

TransparentColor
	= _ "TRANSCOLOR"i __ index:Number
		{ return { type: "TransparentColor", color: index }; }

Background
	= _ "PICT"i __ file:String
		{ return { type: "Background", file: file }; }

Artist
	= _ "ARTIST"i __ name:String
		{ return { type: "Artist", name: name }; }

Destination
	= _ "DEST"i __ id:Number
		{ return { type: "Destination", target: id }; }

Outline
	= _ "OUTLINE"i __ list:VertexList
		{ return { type: "Outline", points: list }; }

Flag
	= _ flag:$(FlagWords) __
		{ return { type: "Flag", name: flag.toUpperCase() }; }

FlagWords
	= "PRIVATE"i
	/ "NOCYBORGS"i
	/ "NOGUESTS"i
	/ "NOPAINTING"i
	/ "HIDDEN"i
	/ "DROPZONE"i
	/ "SHUTABLE"i
	/ "LOCKABLE"i
	/ "DONTMOVEHERE"i
	/ "SHOWNAME"i
	/ "SHOWFRAME"i


MaxMembers
	= _ "MAXMEMBERS"i __ value:Number
		{ return { type: "MaxMembers", count:value }; }

MaxGuests
	= _ "MAXGUESTS"i __ value:Number
		{ return { type: "MaxGuests", count:value }; }

EventHandler
	= _ "ON"i __ trigger:Symbol call:ScriptElement
		{ return { type: "EventHandler", trigger: trigger, script: call }; }

PictureSet
	= _ "PICTS"i __ list:Triplet* _ "ENDPICTS"i __
		{ return { type: "PictureSet", triplets: list }; }

Triplet
	= id:Number _ "," x:Number _ "," y:Number
		{ return { type: "Triplet", id: id, x: x, y: y }; }

// === Script Elements ================

ScriptElement
	= AtomList
	/ ValueType
	/ sym:Symbol
		{ return new Types.Symbol(sym.name); }
	/ Operator

ValueType
	= num:Number
		{ return new Types.Number(num.value); }
	/ Array
	/ str:String
		{ return new Types.String(str.value); }

AtomList
	= _ "{" list:ScriptElement* _ "}"
		{ return new Types.AtomList(list); }

Array
	= _ "[" list:ScriptElement* _ "]"
		{ return new Types.ArrayConstruct(list); }

Operator
	= _ op:OperatorType __
		{ return new Types.Symbol(op); }

OperatorType
    = "+=" / "-=" / "*=" / "/=" / "%=" / "++" / "--" / "==" / "!="
    / "<>" / "<=" / ">=" / "=" / "<" / ">" / "+" / "-" / "*" / "/"
    / "%" / "!" / "&"

// === Data Types =====================

Number
	= _ value:$("-"? [0-9]+)
		{ return { type: "Number", value: parseInt(value, 10) }; }

String
	= _ '"' str:(!'"' ch:$(StringCharacter) { return ch ; })* '"'
		{ return { type: "String", value: str.join('') }; }

StringCharacter
	= "\\" .
	/ .

Vertex
	= x:Number _ "," y:Number
		{ return { type: "Vertex", x: x, y: y }; }

VertexList
	= (_ v:Vertex { return v; })*

// === Symbol =========================
Symbol
	= _ name:$([a-z]i SymbolCharacter*)
		{ return { type: "Symbol", name: name }; }

SymbolCharacter
	= [_a-z0-9]i

// === Whitespace Helper ==============
__
	= !SymbolCharacter

_
	= (Whitespace / Comment)*

Whitespace
	= [ \n\r\t\f]

Comment
	= [;#] (![\n\r] .)*
