Ipscrae
	= r:TopComponent* _
		{ return r; }

// === Top-Level Element Group ========
TopComponent
	= World
	/ Room
	/ EventHandler

WorldComponent
	= Room

RoomComponent
	= Id
	/ Name
	/ Background
	/ Artist
	/ Picture
	/ RoomFlag
	/ Spot
	/ Door

SpotComponent
	= Id
	/ Name
	/ Outline
	/ PictureSet
	/ Script

DoorComponent
	= SpotComponent
	/ Destination
	/ DoorFlag
	/ Script

PictureComponent
	= Id
	/ Name
	/ TransparentColor

ScriptComponent
	= EventHandler

// === Component Tags ===================

World
	= _ "ENTRANCE"i __ id:Number body:WorldComponent* _ "END"i __
		{ return { type: "World", entrance: id, body: body }; }

Room
	= _ "ROOM"i __ body:RoomComponent* _ "ENDROOM"i __
		{ return { type: "Room", body: body }; }

Spot
	= _ "SPOT"i __ body:SpotComponent* _ "ENDSPOT"i __
		{ return { type: "Spot", body: body }; }

Door
	= _ "DOOR"i __ body:DoorComponent* _ "ENDDOOR"i __
		{ return { type: "Door", body: body }; }

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

RoomFlag
	= _ flag:$("PRIVATE"i / "NOPAINTING"i / "NOCYBORGS"i / "HIDDEN"i / "NOGUESTS"i / "DROPZONE"i) __
		{ return { type: "Flag", name: flag.toUpperCase() }; }

DoorFlag
	= _ flag:$("DONTMOVEHERE"i) __
		{ return { type: "Flag", name: flag.toUpperCase() }; }

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
	/ Symbol
	/ Operator

ValueType
	= Number
	/ Array
	/ String

AtomList
	= _ "{" list:ScriptElement* _ "}"
		{ return { type: "AtomList", list: list }; }

Array
	= _ "[" list:ValueType* _ "]"
		{ return { type: "Array", value: list }; }

Operator
	= _ op:OperatorType __
		{ return { type: "Operator", operator: op }; }

OperatorType
    = "+="
        { return "AddAndAssign"; }
    / "-="
        { return "SubtractAndAssign"; }
    / "*="
        { return "MultipleAndAssign"; }
    / "/="
        { return "DivideAndAssign"; }
    / "%="
        { return "ModuloAndAssign"; }
    / "="
        { return "Assign"; }
    / "++"
        { return "Increment"; }
    / "--"
        { return "Decrement"; }
    / "=="
        { return "Equal"; }
    / ( "!=" / "<>" )
        { return "NotEqual"; }
    / "<="
        { return "LessThanEqual"; }
    / ">="
        { return "GreaterThanEqual"; }
    / "<"
        { return "Less"; }
    / ">"
        { return "Greater"; }
    / "+"
        { return "Add"; }
    / "-"
        { return "Subtract"; }
    / "*"
        { return "Multiply"; }
    / "/"
        { return "Divide"; }
    / "%"
        { return "Modulo"; }
    / "!"
        { return "Not"; }
    / "&"
        { return "Concatinate"; }

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
