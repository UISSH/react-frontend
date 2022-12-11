import { lazy } from "react";

const AceMode = {
  "abap": lazy(() => import("./AceAbap")),
"abc": lazy(() => import("./AceAbc")),
"actionscript": lazy(() => import("./AceActionscript")),
"ada": lazy(() => import("./AceAda")),
"alda": lazy(() => import("./AceAlda")),
"apache_conf": lazy(() => import("./AceApacheConf")),
"apex": lazy(() => import("./AceApex")),
"applescript": lazy(() => import("./AceApplescript")),
"aql": lazy(() => import("./AceAql")),
"asciidoc": lazy(() => import("./AceAsciidoc")),
"asl": lazy(() => import("./AceAsl")),
"assembly_x86": lazy(() => import("./AceAssemblyX86")),
"autohotkey": lazy(() => import("./AceAutohotkey")),
"batchfile": lazy(() => import("./AceBatchfile")),
"bibtex": lazy(() => import("./AceBibtex")),
"c9search": lazy(() => import("./AceC9search")),
"c_cpp": lazy(() => import("./AceCCpp")),
"cirru": lazy(() => import("./AceCirru")),
"clojure": lazy(() => import("./AceClojure")),
"cobol": lazy(() => import("./AceCobol")),
"coffee": lazy(() => import("./AceCoffee")),
"coldfusion": lazy(() => import("./AceColdfusion")),
"crystal": lazy(() => import("./AceCrystal")),
"csharp": lazy(() => import("./AceCsharp")),
"csound_document": lazy(() => import("./AceCsoundDocument")),
"csound_orchestra": lazy(() => import("./AceCsoundOrchestra")),
"csound_score": lazy(() => import("./AceCsoundScore")),
"csp": lazy(() => import("./AceCsp")),
"css": lazy(() => import("./AceCss")),
"curly": lazy(() => import("./AceCurly")),
"d": lazy(() => import("./AceD")),
"dart": lazy(() => import("./AceDart")),
"diff": lazy(() => import("./AceDiff")),
"django": lazy(() => import("./AceDjango")),
"dockerfile": lazy(() => import("./AceDockerfile")),
"dot": lazy(() => import("./AceDot")),
"drools": lazy(() => import("./AceDrools")),
"edifact": lazy(() => import("./AceEdifact")),
"eiffel": lazy(() => import("./AceEiffel")),
"ejs": lazy(() => import("./AceEjs")),
"elixir": lazy(() => import("./AceElixir")),
"elm": lazy(() => import("./AceElm")),
"erlang": lazy(() => import("./AceErlang")),
"forth": lazy(() => import("./AceForth")),
"fortran": lazy(() => import("./AceFortran")),
"fsharp": lazy(() => import("./AceFsharp")),
"fsl": lazy(() => import("./AceFsl")),
"ftl": lazy(() => import("./AceFtl")),
"gcode": lazy(() => import("./AceGcode")),
"gherkin": lazy(() => import("./AceGherkin")),
"gitignore": lazy(() => import("./AceGitignore")),
"glsl": lazy(() => import("./AceGlsl")),
"gobstones": lazy(() => import("./AceGobstones")),
"golang": lazy(() => import("./AceGolang")),
"graphqlschema": lazy(() => import("./AceGraphqlschema")),
"groovy": lazy(() => import("./AceGroovy")),
"haml": lazy(() => import("./AceHaml")),
"handlebars": lazy(() => import("./AceHandlebars")),
"haskell": lazy(() => import("./AceHaskell")),
"haskell_cabal": lazy(() => import("./AceHaskellCabal")),
"haxe": lazy(() => import("./AceHaxe")),
"hjson": lazy(() => import("./AceHjson")),
"html": lazy(() => import("./AceHtml")),
"html_elixir": lazy(() => import("./AceHtmlElixir")),
"html_ruby": lazy(() => import("./AceHtmlRuby")),
"ini": lazy(() => import("./AceIni")),
"io": lazy(() => import("./AceIo")),
"ion": lazy(() => import("./AceIon")),
"jack": lazy(() => import("./AceJack")),
"jade": lazy(() => import("./AceJade")),
"java": lazy(() => import("./AceJava")),
"javascript": lazy(() => import("./AceJavascript")),
"jexl": lazy(() => import("./AceJexl")),
"json": lazy(() => import("./AceJson")),
"json5": lazy(() => import("./AceJson5")),
"jsoniq": lazy(() => import("./AceJsoniq")),
"jsp": lazy(() => import("./AceJsp")),
"jssm": lazy(() => import("./AceJssm")),
"jsx": lazy(() => import("./AceJsx")),
"julia": lazy(() => import("./AceJulia")),
"kotlin": lazy(() => import("./AceKotlin")),
"latex": lazy(() => import("./AceLatex")),
"latte": lazy(() => import("./AceLatte")),
"less": lazy(() => import("./AceLess")),
"liquid": lazy(() => import("./AceLiquid")),
"lisp": lazy(() => import("./AceLisp")),
"livescript": lazy(() => import("./AceLivescript")),
"logiql": lazy(() => import("./AceLogiql")),
"logtalk": lazy(() => import("./AceLogtalk")),
"lsl": lazy(() => import("./AceLsl")),
"lua": lazy(() => import("./AceLua")),
"luapage": lazy(() => import("./AceLuapage")),
"lucene": lazy(() => import("./AceLucene")),
"makefile": lazy(() => import("./AceMakefile")),
"markdown": lazy(() => import("./AceMarkdown")),
"mask": lazy(() => import("./AceMask")),
"matlab": lazy(() => import("./AceMatlab")),
"maze": lazy(() => import("./AceMaze")),
"mediawiki": lazy(() => import("./AceMediawiki")),
"mel": lazy(() => import("./AceMel")),
"mips": lazy(() => import("./AceMips")),
"mixal": lazy(() => import("./AceMixal")),
"mushcode": lazy(() => import("./AceMushcode")),
"mysql": lazy(() => import("./AceMysql")),
"nginx": lazy(() => import("./AceNginx")),
"nim": lazy(() => import("./AceNim")),
"nix": lazy(() => import("./AceNix")),
"nsis": lazy(() => import("./AceNsis")),
"nunjucks": lazy(() => import("./AceNunjucks")),
"objectivec": lazy(() => import("./AceObjectivec")),
"ocaml": lazy(() => import("./AceOcaml")),
"partiql": lazy(() => import("./AcePartiql")),
"pascal": lazy(() => import("./AcePascal")),
"perl": lazy(() => import("./AcePerl")),
"pgsql": lazy(() => import("./AcePgsql")),
"php": lazy(() => import("./AcePhp")),
"php_laravel_blade": lazy(() => import("./AcePhpLaravelBlade")),
"pig": lazy(() => import("./AcePig")),
"plain_text": lazy(() => import("./AcePlainText")),
"powershell": lazy(() => import("./AcePowershell")),
"praat": lazy(() => import("./AcePraat")),
"prisma": lazy(() => import("./AcePrisma")),
"prolog": lazy(() => import("./AceProlog")),
"properties": lazy(() => import("./AceProperties")),
"protobuf": lazy(() => import("./AceProtobuf")),
"puppet": lazy(() => import("./AcePuppet")),
"python": lazy(() => import("./AcePython")),
"qml": lazy(() => import("./AceQml")),
"r": lazy(() => import("./AceR")),
"raku": lazy(() => import("./AceRaku")),
"razor": lazy(() => import("./AceRazor")),
"rdoc": lazy(() => import("./AceRdoc")),
"red": lazy(() => import("./AceRed")),
"redshift": lazy(() => import("./AceRedshift")),
"rhtml": lazy(() => import("./AceRhtml")),
"robot": lazy(() => import("./AceRobot")),
"rst": lazy(() => import("./AceRst")),
"ruby": lazy(() => import("./AceRuby")),
"rust": lazy(() => import("./AceRust")),
"sac": lazy(() => import("./AceSac")),
"sass": lazy(() => import("./AceSass")),
"scad": lazy(() => import("./AceScad")),
"scala": lazy(() => import("./AceScala")),
"scheme": lazy(() => import("./AceScheme")),
"scrypt": lazy(() => import("./AceScrypt")),
"scss": lazy(() => import("./AceScss")),
"sh": lazy(() => import("./AceSh")),
"sjs": lazy(() => import("./AceSjs")),
"slim": lazy(() => import("./AceSlim")),
"smarty": lazy(() => import("./AceSmarty")),
"smithy": lazy(() => import("./AceSmithy")),
"snippets": lazy(() => import("./AceSnippets")),
"soy_template": lazy(() => import("./AceSoyTemplate")),
"space": lazy(() => import("./AceSpace")),
"sparql": lazy(() => import("./AceSparql")),
"sql": lazy(() => import("./AceSql")),
"sqlserver": lazy(() => import("./AceSqlserver")),
"stylus": lazy(() => import("./AceStylus")),
"svg": lazy(() => import("./AceSvg")),
"swift": lazy(() => import("./AceSwift")),
"tcl": lazy(() => import("./AceTcl")),
"terraform": lazy(() => import("./AceTerraform")),
"tex": lazy(() => import("./AceTex")),
"text": lazy(() => import("./AceText")),
"textile": lazy(() => import("./AceTextile")),
"toml": lazy(() => import("./AceToml")),
"tsx": lazy(() => import("./AceTsx")),
"turtle": lazy(() => import("./AceTurtle")),
"twig": lazy(() => import("./AceTwig")),
"typescript": lazy(() => import("./AceTypescript")),
"vala": lazy(() => import("./AceVala")),
"vbscript": lazy(() => import("./AceVbscript")),
"velocity": lazy(() => import("./AceVelocity")),
"verilog": lazy(() => import("./AceVerilog")),
"vhdl": lazy(() => import("./AceVhdl")),
"visualforce": lazy(() => import("./AceVisualforce")),
"wollok": lazy(() => import("./AceWollok")),
"xml": lazy(() => import("./AceXml")),
"xquery": lazy(() => import("./AceXquery")),
"yaml": lazy(() => import("./AceYaml")),
"zeek": lazy(() => import("./AceZeek")),
};

export default AceMode;