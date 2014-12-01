Top
	= list:Instance* _
		{ return list; }

// Reserved Words
ReservedWords
	= "struct"
	/ "string"
	/ "union"
	/ "switch"
	/ "case"
	/ "default"
	/ "int"
	/ "uint"
	/ "const"


// Instances
Instance
	= name:Identifier type:Type init:Initializer? _ ";"?
		{ return { type: "Instance", name: name, type:type, initializer: init }; }

ArraySize
	= ("[" exp:Expression "]" { return exp; })*

Type
	= type:BaseType size:ArraySize
		{ type.size = size; return type; }

Encoded
	= _ "encoded"
		{ return true; }
	/
		{ return false; }

Reversed
	= _ "reversed"
		{ return true; }
	/
		{ return false; }

Initializer
	= _ "=" value:Expression
		{ return value; }

// Type decls
BaseType
	= ValueType
	/ StringType
	/ Structure
	/ Union
	/ Switch
	/ Constant

ValueType
	= encoded:Encoded _ unsigned:Unsigned "int"i size:Number
		{ return { type: "IntegerType", encoded: encoded, signed: !unsigned, width:size } }

Unsigned
	= _ "u"i
		{ return true; }
	/
		{ return false; }

StringType
	= encoded:Encoded _ reversed:Reversed _ "string" _ "(" encoding:Encoding ")"
		{ return { type: "StringType", reversed: reversed, encoded: encoded, encoding: encoding }; }

Structure
	= _ "struct" __ alignment:Alignment _ "{" body:Instance* _ "}"
		{ return { type: "StructureType", alignment: alignment, body: body }; }

Union
	= _ "union" __ alignment:Alignment _ "{" body:Instance* _ "}"
		{ return { type: "UnionType", alignment: alignment, body: body }; }

Alignment
	=  _ "align" value:Expression
		{ return value; }
	/
		{ return { type: "Number", value: 1 }; }

Constant
	= _ "const" _ "=" value:Expression
		{ return { type: "ConstantType", value: value }; }

Switch
	= _ "switch" __ _ test:Expression _ "{" clauses:SwitchClause* _ "}"
		{ return { type: "SwitchStatement", test: test, clauses: clauses }; }

SwitchClause
	= _ "default" _ ":" value:Type
		{ return { type: "DefaultClause", body: value }; }
	/ _ "case" __ test:Expression _ ":" value:Type
		{ return { type: "CaseClause", test:test, body: value }; }

// Expression values
ExpressionList
	= first:Expression rest:(_ "," r:Expression { return r; })*
		{ return [first].concat(rest); }

Expression
	= AdditionExpression

AdditionExpression
	= left:MultiplicationExpression _ op:("+" / "-") right:AdditionExpression
		{ return { type: "BinaryOperator", operator: op, left: left, right: right }; }
	/ MultiplicationExpression

MultiplicationExpression
	= left:AtomicValue _ op:("*" / "/" / "%") right:MultiplicationExpression
		{ return { type: "BinaryOperator", operator: op, left: left, right: right }; }
	/ AtomicValue

UnaryExpression
	= op:"-" value:AtomicValue
		{ return { type: "UnaryOperator", operator: op, value: value }; }

AtomicValue
	= _ "(" exp:Expression _ ")"
		{ return exp; }
	/ FunctionCall
	/ Symbol
	/ Number
	/ String

Symbol
	= name:Identifier
		{ return { type: "Symbol", name: name}; }

FunctionCall
	= _ name:Identifier _ "(" args:ExpressionList _ ")"
		{ return { type: "FunctionCall", name: name, args: args }; }

// Atomic values

Identifier
	= _ !Reserved v:$([a-z_]i [a-z0-9_]i*)
		{ return v; }

Reserved
	= (ReservedWords __)

Encoding
	= _ v:$([a-z\-0-9]i*)
		{ return v.toLowerCase() }

Number
	= _ r:$[0-9]+
		{ return { type: "Number", value: parseInt(r, 10) }; }

String
	= _ '"' v:(!'"' ch:StringChar { return ch; })* '"'
		{ return { type: "String", value: v.join("") } }
	/ _ "'" v:(!"'" ch:StringChar { return ch; })* "'"
		{ return { type: "String", value: v.join("") } }

StringChar
	= "\\" ch:.
		{ return ch; }
	/ .

// Whitespace helper
_
	= WhiteSpace*

__
	= ![a-z0-9_]i

WhiteSpace
	= WhiteSpaceCharacter
	/ SingleLineComment
	/ MultiLineComment

SingleLineComment
	= "//" (![\n\r] .)* [\n\r]

MultiLineComment
	= "/*" (!"*/" .)* "*/"

WhiteSpaceCharacter
	= [ \n\r\t]
