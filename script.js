// =============================================
//  PART 1: STATE, LESSONS, CORE FUNCTIONS
// =============================================

// === STATE ===
var currentLang = 'python';
var currentTopic = 0;
var activeTimers = {};
var completionState = {};
var previewVisible = false;

function loadState() {
    try {
        var saved = localStorage.getItem('codelab_state');
        if (saved) {
            var parsed = JSON.parse(saved);
            completionState = parsed.completionState || {};
            currentLang = parsed.currentLang || 'python';
            currentTopic = parsed.currentTopic || 0;
        }
    } catch (e) { completionState = {}; }
}

function saveState() {
    try {
        localStorage.setItem('codelab_state', JSON.stringify({
            completionState: completionState,
            currentLang: currentLang,
            currentTopic: currentTopic
        }));
    } catch (e) {}
}

function getState(lang, topic) {
    var k = lang + '_' + topic;
    if (!completionState[k]) {
        completionState[k] = { timerDone: false, remainingTime: -1, conceptsChecked: false, quizPassed: false, completed: false };
    }
    if (completionState[k].remainingTime === undefined) completionState[k].remainingTime = -1;
    return completionState[k];
}

loadState();

// === LESSON HELPERS ===
function buildLesson(title, subtitle, body) {
    return '<h2>' + title + '</h2><p class="subtitle">' + subtitle + '</p>' + body;
}
function buildCode(code) {
    return '<div class="code-container"><button class="copy-btn" onclick="copyCode(this)">📋 Copy</button><div class="code-block">' + code + '</div></div>';
}
function buildOutput(text) { return '<div class="output-box">' + text + '</div>'; }
function buildHow(text) { return '<div class="how-it-works">' + text + '</div>'; }
function buildTip(text) { return '<div class="tip-box">' + text + '</div>'; }
function kw(t) { return '<span class="keyword">' + t + '</span>'; }
function fn(t) { return '<span class="function">' + t + '</span>'; }
function st(t) { return '<span class="string">' + t + '</span>'; }
function nm(t) { return '<span class="number">' + t + '</span>'; }
function cm(t) { return '<span class="comment">' + t + '</span>'; }
function tp(t) { return '<span class="type">' + t + '</span>'; }
function op(t) { return '<span class="operator">' + t + '</span>'; }

// === ALL LESSON DATA ===
var lessons = {
python: {
    name: "Python", icon: "🐍",
    topics: [
        { title: "Introduction to Python", readTime: 45, concepts: ["Python is a programming language", "print() displays output", "Code runs top to bottom", "# starts a comment"], gateQuiz: { question: "What does print() do?", options: ["Sends to printer", "Displays output on screen", "Creates variable", "Deletes code"], correct: 1, explanation: "print() displays text on screen." },
            content: buildLesson('🐍 Introduction to Python', 'What is Python?', '<p>Python was created by <strong>Guido van Rossum</strong> in 1991.</p><h3>Why Python?</h3><ul><li>Easy to read</li><li>Used in AI, web, data science</li><li>Huge community</li></ul><h3>First Program</h3>' + buildCode(cm('# My first program') + '\n' + fn('print') + '(' + st('"Hello, World!"') + ')\n' + fn('print') + '(' + st('"I am Samuel!"') + ')') + buildOutput('Hello, World!\nI am Samuel!') + buildHow('<code>print()</code> displays text. <code>#</code> starts a comment.') + buildTip('Python uses 4 spaces for indentation!')) },
        { title: "Variables & Data Types", readTime: 60, concepts: ["Variables store data", "4 types: str, int, float, bool", "type() checks type", "Names are case-sensitive"], gateQuiz: { question: "What type is True/False?", options: ["String", "Integer", "Float", "Boolean"], correct: 3, explanation: "Boolean stores True or False." },
            content: buildLesson('📦 Variables & Data Types', 'Storing data', buildCode('name = ' + st('"Samuel"') + '  ' + cm('# String') + '\nage = ' + nm('13') + '       ' + cm('# Integer') + '\nheight = ' + nm('5.4') + '   ' + cm('# Float') + '\nis_student = ' + kw('True') + '  ' + cm('# Boolean') + '\n\n' + fn('print') + '(' + st('"Name:"') + ', name)\n' + fn('print') + '(' + fn('type') + '(age))') + buildOutput('Name: Samuel\n<class \'int\'>') + buildHow('<code>=</code> assigns values. <code>type()</code> shows the data type.')) },
        { title: "Operators & Math", readTime: 50, concepts: ["7 operators: + - * / // % **", "/ gives decimals, // removes them", "% gives remainder", "== compares values"], gateQuiz: { question: "What is 17 % 5?", options: ["3.4", "3", "2", "5"], correct: 2, explanation: "17÷5 = 3 remainder 2." },
            content: buildLesson('🔢 Operators & Math', 'Calculations', buildCode('a = ' + nm('15') + '\nb = ' + nm('4') + '\n' + fn('print') + '(a + b)   ' + cm('# 19') + '\n' + fn('print') + '(a / b)   ' + cm('# 3.75') + '\n' + fn('print') + '(a // b)  ' + cm('# 3') + '\n' + fn('print') + '(a % b)   ' + cm('# 3') + '\n' + fn('print') + '(a ** b)  ' + cm('# 50625')) + buildOutput('19\n3.75\n3\n3\n50625') + buildHow('<code>//</code> floor division. <code>%</code> remainder. <code>**</code> power.')) },
        { title: "If-Else Conditions", readTime: 55, concepts: ["if, elif, else keywords", "Checks top to bottom", "Indentation matters", "Colon after conditions"], gateQuiz: { question: "marks=75. What prints?\nif marks>=90: 'A'\nelif marks>=70: 'C'\nelse: 'D'", options: ["A", "B", "C", "D"], correct: 2, explanation: "75>=90 False, 75>=70 True → C" },
            content: buildLesson('🔀 If-Else Conditions', 'Decision making', buildCode('marks = ' + nm('85') + '\n\n' + kw('if') + ' marks >= ' + nm('90') + ':\n    ' + fn('print') + '(' + st('"A+"') + ')\n' + kw('elif') + ' marks >= ' + nm('80') + ':\n    ' + fn('print') + '(' + st('"A"') + ')\n' + kw('else') + ':\n    ' + fn('print') + '(' + st('"Try harder"') + ')') + buildOutput('A') + buildHow('First true condition runs, rest skipped.')) },
        { title: "Loops", readTime: 60, concepts: ["for iterates sequences", "range(start, stop)", "while runs until False", "Avoid infinite loops"], gateQuiz: { question: "range(1,5) gives?", options: ["1,2,3,4,5", "1,2,3,4", "0,1,2,3,4", "0,1,2,3,4,5"], correct: 1, explanation: "Starts at 1, stops BEFORE 5." },
            content: buildLesson('🔄 Loops', 'Repeating actions', buildCode(kw('for') + ' i ' + kw('in') + ' ' + fn('range') + '(' + nm('1') + ', ' + nm('6') + '):\n    ' + fn('print') + '(i)\n\ncount = ' + nm('3') + '\n' + kw('while') + ' count > ' + nm('0') + ':\n    ' + fn('print') + '(count)\n    count -= ' + nm('1')) + buildOutput('1\n2\n3\n4\n5\n3\n2\n1') + buildHow('<code>for</code>: fixed iterations. <code>while</code>: runs until False.')) },
        { title: "Functions", readTime: 55, concepts: ["def creates functions", "Parameters are inputs", "return sends values back", "Functions avoid repetition"], gateQuiz: { question: "What sends a value back?", options: ["send", "output", "return", "give"], correct: 2, explanation: "return sends values back." },
            content: buildLesson('🧩 Functions', 'Reusable code', buildCode(kw('def') + ' ' + fn('greet') + '(name):\n    ' + fn('print') + '(' + st('"Hello"') + ', name)\n\n' + fn('greet') + '(' + st('"Samuel"') + ')\n\n' + kw('def') + ' ' + fn('add') + '(a, b):\n    ' + kw('return') + ' a + b\n\nresult = ' + fn('add') + '(' + nm('10') + ', ' + nm('20') + ')\n' + fn('print') + '(result)') + buildOutput('Hello Samuel\n30') + buildHow('<code>def</code> defines. <code>return</code> sends value back.')) },
        { title: "Lists", readTime: 55, concepts: ["Lists store ordered items", "Index starts at 0", "append() adds items", "len() gets length"], gateQuiz: { question: "First index in a list?", options: ["1", "0", "-1", "First"], correct: 1, explanation: "Lists start at index 0." },
            content: buildLesson('📋 Lists', 'Ordered collections', buildCode('fruits = [' + st('"apple"') + ', ' + st('"banana"') + ', ' + st('"cherry"') + ']\n' + fn('print') + '(fruits[' + nm('0') + '])\nfruits.' + fn('append') + '(' + st('"mango"') + ')\n' + fn('print') + '(' + fn('len') + '(fruits))\n\n' + kw('for') + ' f ' + kw('in') + ' fruits:\n    ' + fn('print') + '(f)') + buildOutput('apple\n4\napple\nbanana\ncherry\nmango') + buildHow('Lists use <code>[]</code>. Index starts at 0.')) },
        { title: "Dictionaries", readTime: 50, concepts: ["Key-value pairs", "Use {} curly braces", "Access by key name", "Can store any type"], gateQuiz: { question: "How to access dict value?", options: ["dict(key)", "dict.key", "dict[key]", "dict->key"], correct: 2, explanation: "Use square brackets with key." },
            content: buildLesson('📖 Dictionaries', 'Key-value storage', buildCode('student = {\n    ' + st('"name"') + ': ' + st('"Samuel"') + ',\n    ' + st('"age"') + ': ' + nm('13') + '\n}\n' + fn('print') + '(student[' + st('"name"') + '])\nstudent[' + st('"hobby"') + '] = ' + st('"Coding"') + '\n' + fn('print') + '(student)') + buildOutput("Samuel\n{'name': 'Samuel', 'age': 13, 'hobby': 'Coding'}") + buildHow('Dictionaries store key-value pairs.')) },
        { title: "String Methods", readTime: 45, concepts: ["upper() and lower()", "split() breaks strings", "f-strings for formatting", "len() gets length"], gateQuiz: { question: "What does .upper() do?", options: ["Lowercase", "UPPERCASE", "Reverses", "Splits"], correct: 1, explanation: ".upper() converts to uppercase." },
            content: buildLesson('🔤 String Methods', 'Working with text', buildCode('name = ' + st('"Samuel Giftson"') + '\n' + fn('print') + '(name.' + fn('upper') + '())\n' + fn('print') + '(name.' + fn('lower') + '())\n' + fn('print') + '(name.' + fn('split') + '())\n\nage = ' + nm('13') + '\n' + fn('print') + '(' + st('f"I am {name}, age {age}"') + ')') + buildOutput('SAMUEL GIFTSON\nsamuel giftson\n[\'Samuel\', \'Giftson\']\nI am Samuel Giftson, age 13') + buildHow('f-strings embed variables inside strings.')) },
        { title: "File Handling", readTime: 50, concepts: ["open() opens files", "read() reads content", "write() writes content", "with auto-closes"], gateQuiz: { question: "What does 'w' mode do?", options: ["Reads", "Writes (overwrites)", "Appends", "Deletes"], correct: 1, explanation: "'w' overwrites file content." },
            content: buildLesson('📂 File Handling', 'Reading and writing files', buildCode(kw('with') + ' ' + fn('open') + '(' + st('"test.txt"') + ', ' + st('"w"') + ') ' + kw('as') + ' f:\n    f.' + fn('write') + '(' + st('"Hello Samuel!"') + ')\n\n' + kw('with') + ' ' + fn('open') + '(' + st('"test.txt"') + ', ' + st('"r"') + ') ' + kw('as') + ' f:\n    ' + fn('print') + '(f.' + fn('read') + '())') + buildOutput('Hello Samuel!') + buildHow('<code>with</code> auto-closes. <code>"w"</code>=write, <code>"r"</code>=read.')) }
    ],
    quiz: [
        { question: "What displays output?", options: ["echo()", "print()", "display()", "show()"], correct: 1 },
        { question: "Which stores True/False?", options: ["str", "int", "float", "bool"], correct: 3 },
        { question: "What does // do?", options: ["Division", "Floor division", "Power", "Modulus"], correct: 1 },
        { question: "range(2,6) gives?", options: ["2,3,4,5,6", "2,3,4,5", "1,2,3,4,5", "0,2,4,6"], correct: 1 },
        { question: "Which defines a function?", options: ["function", "func", "def", "define"], correct: 2 },
        { question: "First list index?", options: ["1", "0", "-1", "First"], correct: 1 }
    ]
},
javascript: {
    name: "JavaScript", icon: "⚡",
    topics: [
        { title: "Introduction to JS", readTime: 45, concepts: ["JS runs in browsers", "console.log() prints", "Semicolons end statements", "F12 opens console"], gateQuiz: { question: "Where does console.log() show?", options: ["Webpage", "Dev console (F12)", "Popup", "File"], correct: 1, explanation: "console.log() outputs to F12 console." },
            content: buildLesson('⚡ Introduction to JavaScript', 'Language of the web', '<p>JavaScript makes websites interactive!</p>' + buildCode(cm('// Print to console') + '\n' + fn('console') + '.' + fn('log') + '(' + st('"Hello, World!"') + ');\n' + fn('console') + '.' + fn('log') + '(' + st('"I am Samuel"') + ');') + buildOutput('Hello, World!\nI am Samuel') + buildHow('<code>console.log()</code> prints to browser console.')) },
        { title: "Variables & Types", readTime: 50, concepts: ["let vs const vs var", "const can't change", "typeof checks type", "One number type"], gateQuiz: { question: "Unchangeable variable?", options: ["let", "var", "const", "static"], correct: 2, explanation: "const creates constants." },
            content: buildLesson('📦 Variables', 'Storing data', buildCode(kw('let') + ' age = ' + nm('13') + ';\n' + kw('const') + ' name = ' + st('"Samuel"') + ';\n' + fn('console') + '.' + fn('log') + '(' + kw('typeof') + ' age);   ' + cm('// "number"')) + buildHow('<code>let</code> for changing values. <code>const</code> for constants.')) },
        { title: "Conditions", readTime: 50, concepts: ["if/else uses {}", "=== checks value AND type", "Ternary operator", "switch for cases"], gateQuiz: { question: "=== checks?", options: ["Only value", "Only type", "Value AND type", "Assignment"], correct: 2, explanation: "=== checks both." },
            content: buildLesson('🔀 Conditions', 'Decision making', buildCode(kw('let') + ' marks = ' + nm('85') + ';\n' + kw('if') + ' (marks >= ' + nm('90') + ') {\n    ' + fn('console') + '.' + fn('log') + '(' + st('"A+"') + ');\n} ' + kw('else if') + ' (marks >= ' + nm('80') + ') {\n    ' + fn('console') + '.' + fn('log') + '(' + st('"A"') + ');\n}') + buildOutput('A') + buildHow('Use <code>{}</code> for blocks. <code>===</code> is strict equality.')) },
        { title: "Loops", readTime: 50, concepts: ["for(init;cond;update)", "while loop", "for...of for arrays", "break and continue"], gateQuiz: { question: "i++ means?", options: ["i = i - 1", "i = i + 1", "i = i * 2", "i = 0"], correct: 1, explanation: "i++ is i = i + 1." },
            content: buildLesson('🔄 Loops', 'Repeating code', buildCode(kw('for') + ' (' + kw('let') + ' i = ' + nm('1') + '; i <= ' + nm('5') + '; i++) {\n    ' + fn('console') + '.' + fn('log') + '(i);\n}') + buildOutput('1\n2\n3\n4\n5') + buildHow('For loop: start, condition, increment.')) },
        { title: "Functions", readTime: 50, concepts: ["function keyword", "Arrow functions =>", "return sends back", "Default parameters"], gateQuiz: { question: "Valid arrow function?", options: ["function(a)=>a+1", "(a)=>a+1", "arrow(a){a+1}", "=>(a)a+1"], correct: 1, explanation: "(params) => expression" },
            content: buildLesson('🧩 Functions', 'Reusable code', buildCode(kw('function') + ' ' + fn('greet') + '(name) {\n    ' + kw('return') + ' ' + st('"Hello, "') + ' + name;\n}\n' + kw('const') + ' ' + fn('add') + ' = (a, b) => a + b;\n' + fn('console') + '.' + fn('log') + '(' + fn('greet') + '(' + st('"Samuel"') + '));\n' + fn('console') + '.' + fn('log') + '(' + fn('add') + '(' + nm('10') + ', ' + nm('20') + '));') + buildOutput('Hello, Samuel\n30') + buildHow('Arrow functions <code>=></code> are shorter.')) },
        { title: "Arrays", readTime: 50, concepts: ["Arrays store lists", "push() adds", "map() transforms", "filter() selects"], gateQuiz: { question: "Add to array end?", options: [".add()", ".push()", ".append()", ".insert()"], correct: 1, explanation: ".push() adds to end." },
            content: buildLesson('📋 Arrays', 'Ordered lists', buildCode(kw('const') + ' nums = [' + nm('1') + ', ' + nm('2') + ', ' + nm('3') + '];\nnums.' + fn('push') + '(' + nm('4') + ');\n' + kw('const') + ' doubled = nums.' + fn('map') + '(n => n * ' + nm('2') + ');\n' + fn('console') + '.' + fn('log') + '(doubled);') + buildOutput('[2, 4, 6, 8]') + buildHow('<code>map()</code> transforms each item.')) },
        { title: "Objects", readTime: 50, concepts: ["Key-value pairs", "Dot notation", "Methods in objects", "Destructuring"], gateQuiz: { question: "Access property?", options: ["obj(key)", "obj.key", "obj->key", "obj::key"], correct: 1, explanation: "Use dot notation: obj.key" },
            content: buildLesson('🏗️ Objects', 'Structured data', buildCode(kw('const') + ' student = {\n    name: ' + st('"Samuel"') + ',\n    age: ' + nm('13') + ',\n    greet() {\n        ' + fn('console') + '.' + fn('log') + '(' + st('`Hi, I\'m ${this.name}`') + ');\n    }\n};\nstudent.greet();') + buildOutput("Hi, I'm Samuel") + buildHow('Objects group related data and methods.')) },
        { title: "DOM Manipulation", readTime: 55, concepts: ["querySelector() selects", "innerHTML changes content", "addEventListener handles events", "classList toggles styles"], gateQuiz: { question: "What selects an element?", options: ["getElement()", "querySelector()", "findElement()", "selectNode()"], correct: 1, explanation: "querySelector() selects DOM elements." },
            content: buildLesson('🌐 DOM Manipulation', 'Changing web pages', buildCode(kw('const') + ' heading = ' + fn('document') + '.' + fn('querySelector') + '(' + st('"h1"') + ');\nheading.innerHTML = ' + st('"New Title!"') + ';\nheading.' + fn('addEventListener') + '(' + st('"click"') + ', ' + kw('function') + '() {\n    ' + fn('alert') + '(' + st('"Clicked!"') + ');\n});') + buildHow('<code>querySelector()</code> finds elements. <code>addEventListener()</code> handles events.')) }
    ],
    quiz: [
        { question: "Unchangeable variable?", options: ["let", "var", "const", "fixed"], correct: 2 },
        { question: "typeof 42?", options: ['"integer"', '"number"', '"float"', '"num"'], correct: 1 },
        { question: "Arrow function?", options: ["function(){}", "def f():", "(a)=>a+1", "func(a)"], correct: 2 },
        { question: "Add to array end?", options: [".add()", ".push()", ".append()", ".put()"], correct: 1 }
    ]
},
html: {
    name: "HTML & CSS", icon: "🌐",
    topics: [
        { title: "HTML Basics", readTime: 45, concepts: ["HTML uses tags", "Tags have open/close pairs", "head vs body", "Common tags: h1, p, a"], gateQuiz: { question: "HTML stands for?", options: ["Hyper Text Making Language", "HyperText Markup Language", "Home Tool ML", "Hyper Transfer ML"], correct: 1, explanation: "HyperText Markup Language" },
            content: buildLesson('🌐 HTML Basics', 'Structure of websites', buildCode(op('&lt;!DOCTYPE html&gt;') + '\n' + op('&lt;html&gt;') + '\n' + op('&lt;body&gt;') + '\n    ' + op('&lt;h1&gt;') + 'Hello!' + op('&lt;/h1&gt;') + '\n    ' + op('&lt;p&gt;') + 'Welcome.' + op('&lt;/p&gt;') + '\n' + op('&lt;/body&gt;') + '\n' + op('&lt;/html&gt;')) + buildHow('Tags come in pairs. <code>&lt;body&gt;</code> = visible content.')) },
        { title: "Text & Links", readTime: 40, concepts: ["h1-h6 headings", "p for paragraphs", "a for links", "strong and em"], gateQuiz: { question: "Which makes bold?", options: ["<strong>", "<bold>", "<heavy>", "<em>"], correct: 0, explanation: "<strong> makes text bold." },
            content: buildLesson('📝 Text & Links', 'Content elements', buildCode(op('&lt;h1&gt;') + 'Title' + op('&lt;/h1&gt;') + '\n' + op('&lt;p&gt;') + 'Paragraph.' + op('&lt;/p&gt;') + '\n' + op('&lt;strong&gt;') + 'Bold' + op('&lt;/strong&gt;') + '\n' + op('&lt;a href="https://google.com"&gt;') + 'Google' + op('&lt;/a&gt;')) + buildHow('<code>a</code> creates clickable links.')) },
        { title: "CSS Basics", readTime: 50, concepts: ["CSS styles HTML", "Selectors target elements", "Properties change look", "Classes use .name"], gateQuiz: { question: "CSS text color property?", options: ["text-color", "font-color", "color", "text-style"], correct: 2, explanation: "The color property changes text color." },
            content: buildLesson('🎨 CSS Basics', 'Making HTML beautiful', buildCode('body {\n    background: ' + st('#1a1a2e') + ';\n    color: ' + st('white') + ';\n}\nh1 {\n    color: ' + st('#667eea') + ';\n}\n.card {\n    padding: ' + st('20px') + ';\n    border-radius: ' + st('10px') + ';\n}') + buildHow('CSS: selectors + properties. <code>.class</code> with dots, <code>#id</code> with hash.')) },
        { title: "Flexbox Layout", readTime: 50, concepts: ["display: flex", "justify-content", "align-items", "gap adds spacing"], gateQuiz: { question: "What enables flexbox?", options: ["display: block", "display: flex", "display: grid", "display: inline"], correct: 1, explanation: "display: flex enables flexbox." },
            content: buildLesson('📐 Flexbox', 'Modern layout', buildCode('.container {\n    display: ' + st('flex') + ';\n    justify-content: ' + st('center') + ';\n    gap: ' + st('20px') + ';\n}') + buildHow('<code>flex</code> arranges items. <code>justify-content</code> = horizontal.')) },
        { title: "Forms & Input", readTime: 45, concepts: ["form collects data", "input types vary", "label describes", "button submits"], gateQuiz: { question: "Text input?", options: ["<text>", '<input type="text">', "<textbox>", "<field>"], correct: 1, explanation: 'input with type="text" creates text field.' },
            content: buildLesson('📝 Forms', 'Collecting data', buildCode(op('&lt;form&gt;') + '\n  ' + op('&lt;label&gt;') + 'Name:' + op('&lt;/label&gt;') + '\n  ' + op('&lt;input type="text"&gt;') + '\n  ' + op('&lt;button&gt;') + 'Send' + op('&lt;/button&gt;') + '\n' + op('&lt;/form&gt;')) + buildHow('Different <code>type</code> attributes create different inputs.')) },
        { title: "CSS Grid", readTime: 50, concepts: ["display: grid", "grid-template-columns", "gap for spacing", "span for merging"], gateQuiz: { question: "3-column grid?", options: ["columns: 3", "grid-template-columns: 1fr 1fr 1fr", "display: 3-grid", "grid: 3"], correct: 1, explanation: "grid-template-columns defines columns." },
            content: buildLesson('🔲 CSS Grid', '2D layouts', buildCode('.grid {\n    display: ' + st('grid') + ';\n    grid-template-columns: ' + st('1fr 1fr 1fr') + ';\n    gap: ' + st('15px') + ';\n}') + buildHow('Grid creates 2D layouts. <code>1fr</code> = 1 fraction of space.')) }
    ],
    quiz: [
        { question: "HTML stands for?", options: ["Hyper Text Making Lang", "HyperText Markup Language", "Home Tool ML", "Hyper Transfer ML"], correct: 1 },
        { question: "CSS text color?", options: ["text-color", "font-color", "color", "text-style"], correct: 2 },
        { question: "Select class in CSS?", options: ["#class", ".class", "class", "*class"], correct: 1 }
    ]
},
java: {
    name: "Java", icon: "☕",
    topics: [
        { title: "Introduction to Java", readTime: 50, concepts: ["Java needs a class", "main() entry point", "println() prints", "Filename = class name"], gateQuiz: { question: "Java entry point?", options: ["start()", "main()", "run()", "begin()"], correct: 1, explanation: "main() starts Java." },
            content: buildLesson('☕ Introduction to Java', 'Write once, run anywhere', buildCode(kw('public class') + ' ' + tp('Main') + ' {\n    ' + kw('public static void') + ' ' + fn('main') + '(' + tp('String') + '[] args) {\n        System.out.' + fn('println') + '(' + st('"Hello, World!"') + ');\n    }\n}') + buildOutput('Hello, World!') + buildHow('Every Java program needs a <code>class</code> and <code>main()</code>.')) },
        { title: "Variables & Types", readTime: 50, concepts: ["Must declare types", "int, double, String, boolean", "String capital S", "Strictly typed"], gateQuiz: { question: "Decimal type?", options: ["int", "String", "double", "boolean"], correct: 2, explanation: "double stores decimals." },
            content: buildLesson('📦 Java Variables', 'Typed variables', buildCode(tp('int') + ' age = ' + nm('13') + ';\n' + tp('String') + ' name = ' + st('"Samuel"') + ';\nSystem.out.' + fn('println') + '(' + st('"Name: "') + ' + name);') + buildOutput('Name: Samuel') + buildHow('Java requires type before variable name.')) },
        { title: "Conditions & Loops", readTime: 55, concepts: ["if/else like JS", "for loop", "Enhanced for loop", "switch"], gateQuiz: { question: "Enhanced for?", options: ["for(i=0;i<5;i++)", "for(item : array)", "while(true)", "foreach(item)"], correct: 1, explanation: "for(Type item : array) iterates arrays." },
            content: buildLesson('🔄 Conditions & Loops', 'Control flow', buildCode(tp('String') + '[] subjects = {' + st('"Math"') + ', ' + st('"Science"') + '};\n' + kw('for') + ' (' + tp('String') + ' s : subjects) {\n    System.out.' + fn('println') + '(s);\n}') + buildOutput('Math\nScience') + buildHow('Enhanced for: <code>for(Type item : array)</code>.')) },
        { title: "Methods", readTime: 50, concepts: ["Methods = functions", "Return type required", "static for class", "void = no return"], gateQuiz: { question: "void means?", options: ["Returns int", "Returns nothing", "Returns String", "Error"], correct: 1, explanation: "void = no return value." },
            content: buildLesson('🧩 Methods', 'Reusable code', buildCode(kw('static') + ' ' + tp('int') + ' ' + fn('add') + '(' + tp('int') + ' a, ' + tp('int') + ' b) {\n    ' + kw('return') + ' a + b;\n}\n' + cm('// In main():') + '\nSystem.out.' + fn('println') + '(' + fn('add') + '(' + nm('10') + ', ' + nm('20') + '));') + buildOutput('30') + buildHow('Specify return type. <code>void</code>=no return.')) }
    ],
    quiz: [
        { question: "Java entry point?", options: ["start()", "main()", "run()", "init()"], correct: 1 },
        { question: "Decimal type?", options: ["int", "String", "double", "boolean"], correct: 2 }
    ]
},
c: {
    name: "C Language", icon: "⚙️",
    topics: [
        { title: "Introduction to C", readTime: 50, concepts: ["#include brings libraries", "main() starts", "printf() prints", "\\n = new line"], gateQuiz: { question: "#include <stdio.h> does?", options: ["Creates var", "Includes I/O library", "Starts program", "Defines function"], correct: 1, explanation: "stdio.h provides printf()." },
            content: buildLesson('⚙️ Introduction to C', 'Mother of all languages', buildCode(kw('#include') + ' ' + st('&lt;stdio.h&gt;') + '\n\n' + tp('int') + ' ' + fn('main') + '() {\n    ' + fn('printf') + '(' + st('"Hello, World!\\n"') + ');\n    ' + kw('return') + ' ' + nm('0') + ';\n}') + buildOutput('Hello, World!') + buildHow('<code>printf()</code> prints. <code>\\n</code> = new line.')) },
        { title: "Variables & Types", readTime: 50, concepts: ["int, float, char", "Format specifiers: %d %f %s", "Must declare types", "Arrays use []"], gateQuiz: { question: "%d prints?", options: ["String", "Float", "Integer", "Char"], correct: 2, explanation: "%d for integers." },
            content: buildLesson('📦 C Variables', 'Typed data', buildCode(tp('int') + ' age = ' + nm('13') + ';\n' + tp('char') + ' name[] = ' + st('"Samuel"') + ';\n' + fn('printf') + '(' + st('"Name: %s, Age: %d\\n"') + ', name, age);') + buildOutput('Name: Samuel, Age: 13') + buildHow('<code>%d</code>=int, <code>%f</code>=float, <code>%s</code>=string.')) },
        { title: "Control Flow", readTime: 50, concepts: ["if/else", "for loop", "while and do-while", "switch"], gateQuiz: { question: "do-while runs at least?", options: ["Zero", "Once", "Twice", "Infinite"], correct: 1, explanation: "do-while always runs once." },
            content: buildLesson('🔄 Control Flow', 'Conditions and loops', buildCode(kw('for') + ' (' + tp('int') + ' i = ' + nm('1') + '; i <= ' + nm('5') + '; i++) {\n    ' + fn('printf') + '(' + st('"%d\\n"') + ', i);\n}') + buildOutput('1\n2\n3\n4\n5') + buildHow('<code>do-while</code> runs body first, then checks.')) },
        { title: "Functions", readTime: 50, concepts: ["Return type required", "Prototypes first", "Pass by value", "void = no return"], gateQuiz: { question: "return 0 means?", options: ["Error", "Restart", "Success", "Zero output"], correct: 2, explanation: "return 0 = program succeeded." },
            content: buildLesson('🧩 C Functions', 'Modular code', buildCode(tp('int') + ' ' + fn('add') + '(' + tp('int') + ' a, ' + tp('int') + ' b) {\n    ' + kw('return') + ' a + b;\n}\n\n' + tp('int') + ' ' + fn('main') + '() {\n    ' + fn('printf') + '(' + st('"Sum: %d\\n"') + ', ' + fn('add') + '(' + nm('10') + ', ' + nm('20') + '));\n}') + buildOutput('Sum: 30') + buildHow('C requires return type and parameter types.')) }
    ],
    quiz: [
        { question: "Header for printf()?", options: ["stdlib.h", "stdio.h", "string.h", "math.h"], correct: 1 },
        { question: "%d prints?", options: ["String", "Float", "Integer", "Char"], correct: 2 }
    ]
},
typescript: {
    name: "TypeScript", icon: "🔷",
    topics: [
        { title: "Intro to TypeScript", readTime: 45, concepts: ["TS adds types to JS", "Compiles to JS", "Catches errors early", "Used in big projects"], gateQuiz: { question: "TS compiles to?", options: ["Python", "Java", "JavaScript", "C++"], correct: 2, explanation: "TypeScript compiles to JavaScript." },
            content: buildLesson('🔷 Introduction to TypeScript', 'JS with superpowers', '<p>TypeScript = JavaScript + types!</p>' + buildCode(kw('let') + ' name: ' + tp('string') + ' = ' + st('"Samuel"') + ';\n' + kw('let') + ' age: ' + tp('number') + ' = ' + nm('13') + ';\n' + fn('console') + '.' + fn('log') + '(name, age);') + buildOutput('Samuel 13') + buildHow('Add <code>: type</code> after variable names.')) },
        { title: "Typed Functions", readTime: 50, concepts: ["Parameter types", "Return types", "Optional params", "Interfaces"], gateQuiz: { question: "Type a parameter?", options: ["name(string)", "(name: string)", "(string name)", "name = string"], correct: 1, explanation: "Colon syntax: (param: type)" },
            content: buildLesson('🧩 Typed Functions', 'Safe functions', buildCode(kw('function') + ' ' + fn('greet') + '(name: ' + tp('string') + '): ' + tp('string') + ' {\n    ' + kw('return') + ' ' + st('`Hello, ${name}!`') + ';\n}\n' + fn('console') + '.' + fn('log') + '(' + fn('greet') + '(' + st('"Samuel"') + '));') + buildOutput('Hello, Samuel!') + buildHow('Specify parameter types and return type.')) },
        { title: "Interfaces", readTime: 50, concepts: ["Define object shapes", "Properties and types", "Optional with ?", "Extends others"], gateQuiz: { question: "What defines object shape?", options: ["class", "interface", "type", "shape"], correct: 1, explanation: "Interfaces define object structure." },
            content: buildLesson('📋 Interfaces', 'Object blueprints', buildCode(kw('interface') + ' ' + tp('Student') + ' {\n    name: ' + tp('string') + ';\n    age: ' + tp('number') + ';\n    grade?: ' + tp('number') + ';\n}\n' + kw('const') + ' samuel: ' + tp('Student') + ' = {\n    name: ' + st('"Samuel"') + ',\n    age: ' + nm('13') + '\n};\n' + fn('console') + '.' + fn('log') + '(samuel.name);') + buildOutput('Samuel') + buildHow('<code>?</code> makes properties optional.')) }
    ],
    quiz: [
        { question: "TS compiles to?", options: ["Python", "Java", "JavaScript", "C++"], correct: 2 },
        { question: "Type annotation?", options: ["var(int)", "let x: number", "int x", "number x"], correct: 1 }
    ]
},
lua: {
    name: "Lua", icon: "🌙",
    topics: [
        { title: "Introduction to Lua", readTime: 45, concepts: ["Lua is lightweight", "Used in Roblox", "print() outputs", "Comments use --"], gateQuiz: { question: "Lua is used in?", options: ["Office", "Roblox games", "iOS apps", "Databases"], correct: 1, explanation: "Lua powers Roblox!" },
            content: buildLesson('🌙 Introduction to Lua', 'Game scripting', '<p>Lua powers <strong>Roblox</strong> games!</p>' + buildCode(cm('-- This is a comment') + '\n' + fn('print') + '(' + st('"Hello, World!"') + ')\n' + fn('print') + '(' + st('"Learning Lua!"') + ')') + buildOutput('Hello, World!\nLearning Lua!') + buildHow('<code>print()</code> displays text. <code>--</code> starts comments.')) },
        { title: "Variables & Types", readTime: 50, concepts: ["local creates vars", "Dynamic typing", "nil means nothing", ".. joins strings"], gateQuiz: { question: "Local variable?", options: ["var x", "let x", "local x", "dim x"], correct: 2, explanation: "Lua uses 'local' keyword." },
            content: buildLesson('📦 Lua Variables', 'Storing data', buildCode(kw('local') + ' name = ' + st('"Samuel"') + '\n' + kw('local') + ' age = ' + nm('13') + '\n' + fn('print') + '(' + st('"Name: "') + ' .. name)\n' + fn('print') + '(' + st('"Age: "') + ' .. age)') + buildOutput('Name: Samuel\nAge: 13') + buildHow('<code>local</code> creates variables. <code>..</code> joins strings.')) },
        { title: "Conditions & Loops", readTime: 50, concepts: ["if-then-end", "for i=start,stop", "while-do-end", "~= means not equal"], gateQuiz: { question: "Not equal in Lua?", options: ["!=", "~=", "<>", "=/="], correct: 1, explanation: "Lua uses ~= for not equal." },
            content: buildLesson('🔄 Control Flow', 'Conditions and loops', buildCode(kw('local') + ' score = ' + nm('85') + '\n' + kw('if') + ' score >= ' + nm('90') + ' ' + kw('then') + '\n    ' + fn('print') + '(' + st('"A+"') + ')\n' + kw('elseif') + ' score >= ' + nm('80') + ' ' + kw('then') + '\n    ' + fn('print') + '(' + st('"A"') + ')\n' + kw('end') + '\n\n' + kw('for') + ' i = ' + nm('1') + ', ' + nm('5') + ' ' + kw('do') + '\n    ' + fn('print') + '(i)\n' + kw('end')) + buildOutput('A\n1\n2\n3\n4\n5') + buildHow('Lua uses <code>then</code>, <code>end</code> instead of <code>{}</code>.')) },
        { title: "Functions & Tables", readTime: 55, concepts: ["function keyword", "Tables = arrays AND objects", "Tables start at 1!", "#table = length"], gateQuiz: { question: "Lua arrays start at?", options: ["0", "1", "-1", "Depends"], correct: 1, explanation: "Lua tables start at index 1!" },
            content: buildLesson('🧩 Functions & Tables', 'Core features', buildCode(kw('function') + ' ' + fn('greet') + '(name)\n    ' + fn('print') + '(' + st('"Hello, "') + ' .. name)\n' + kw('end') + '\n' + fn('greet') + '(' + st('"Samuel"') + ')\n\n' + kw('local') + ' fruits = {' + st('"apple"') + ', ' + st('"banana"') + '}\n' + fn('print') + '(fruits[' + nm('1') + '])  ' + cm('-- starts at 1!')) + buildOutput('Hello, Samuel\napple') + buildHow('Tables start at 1, not 0!')) },
        { title: "Roblox Basics", readTime: 60, concepts: ["Scripts in ServerScriptService", "game.Workspace", "Properties", "Events like Touched"], gateQuiz: { question: "Server scripts go in?", options: ["Workspace", "ServerScriptService", "StarterGui", "ReplicatedStorage"], correct: 1, explanation: "Server scripts go in ServerScriptService." },
            content: buildLesson('🎮 Roblox Scripting', 'Making games', buildCode(kw('local') + ' part = script.Parent\npart.Touched:' + fn('Connect') + '(' + kw('function') + '(hit)\n    ' + kw('local') + ' player = game.Players:' + fn('GetPlayerFromCharacter') + '(hit.Parent)\n    ' + kw('if') + ' player ' + kw('then') + '\n        ' + fn('print') + '(player.Name .. ' + st('" touched!"') + ')\n    ' + kw('end') + '\n' + kw('end') + ')') + buildHow('Roblox uses Lua. <code>:Connect()</code> listens for events.') + buildTip('Paste this in a Script inside a Part in Roblox Studio!')) }
    ],
    quiz: [
        { question: "Lua is used in?", options: ["Office", "Roblox", "iOS", "Databases"], correct: 1 },
        { question: "Not equal?", options: ["!=", "~=", "<>", "=/="], correct: 1 },
        { question: "Tables start at?", options: ["0", "1", "-1", "Depends"], correct: 1 }
    ]
},
csharp: {
    name: "C#", icon: "💜",
    topics: [
        { title: "Introduction to C#", readTime: 50, concepts: ["C# by Microsoft", "Used in Unity", "Like Java syntax", "Console.WriteLine()"], gateQuiz: { question: "C# game engine?", options: ["Unreal", "Unity", "Godot", "GameMaker"], correct: 1, explanation: "Unity uses C#." },
            content: buildLesson('💜 Introduction to C#', 'Unity development', '<p>C# powers <strong>Unity</strong> — the most popular game engine!</p>' + buildCode(kw('using') + ' System;\n' + kw('class') + ' ' + tp('Program') + ' {\n    ' + kw('static void') + ' ' + fn('Main') + '() {\n        Console.' + fn('WriteLine') + '(' + st('"Hello, World!"') + ');\n    }\n}') + buildOutput('Hello, World!') + buildHow('<code>Console.WriteLine()</code> prints text.')) },
        { title: "Variables & Types", readTime: 50, concepts: ["int, float, string, bool", "var for inference", "$ for interpolation", "Strongly typed"], gateQuiz: { question: "String interpolation?", options: ["f", "@", "$", "#"], correct: 2, explanation: "$ prefix for interpolation." },
            content: buildLesson('📦 C# Variables', 'Typed data', buildCode(tp('string') + ' name = ' + st('"Samuel"') + ';\n' + tp('int') + ' age = ' + nm('13') + ';\nConsole.' + fn('WriteLine') + '(' + st('$"Name: {name}, Age: {age}"') + ');') + buildOutput('Name: Samuel, Age: 13') + buildHow('<code>$"..."</code> embeds variables.')) },
        { title: "Unity Basics", readTime: 60, concepts: ["MonoBehaviour base", "Start() runs once", "Update() every frame", "transform moves"], gateQuiz: { question: "Update() runs?", options: ["Once", "Every frame", "On click", "Never"], correct: 1, explanation: "Update() runs every frame." },
            content: buildLesson('🎮 Unity Scripting', 'Making games', buildCode(kw('using') + ' UnityEngine;\n' + kw('public class') + ' ' + tp('Player') + ' : ' + tp('MonoBehaviour') + ' {\n    ' + kw('public') + ' ' + tp('float') + ' speed = ' + nm('5f') + ';\n    ' + kw('void') + ' ' + fn('Update') + '() {\n        ' + tp('float') + ' x = Input.' + fn('GetAxis') + '(' + st('"Horizontal"') + ');\n        transform.' + fn('Translate') + '(x * speed, ' + nm('0') + ', ' + nm('0') + ');\n    }\n}') + buildHow('<code>Update()</code> runs every frame. <code>Input.GetAxis()</code> reads keyboard.') + buildTip('Attach to a player object in Unity!')) },
        { title: "Classes & Objects", readTime: 55, concepts: ["class = blueprint", "new creates instances", "Properties", "Methods"], gateQuiz: { question: "new keyword?", options: ["Deletes", "Creates instance", "Defines class", "Returns null"], correct: 1, explanation: "new creates an instance." },
            content: buildLesson('🏗️ Classes', 'Object-oriented C#', buildCode(kw('class') + ' ' + tp('Player') + ' {\n    ' + kw('public') + ' ' + tp('string') + ' Name;\n    ' + kw('public') + ' ' + tp('int') + ' Health;\n    ' + kw('public void') + ' ' + fn('TakeDamage') + '(' + tp('int') + ' dmg) {\n        Health -= dmg;\n        Console.' + fn('WriteLine') + '(' + st('$"{Name}: {Health} HP"') + ');\n    }\n}\n' + kw('var') + ' p = ' + kw('new') + ' ' + tp('Player') + '();\np.Name = ' + st('"Samuel"') + ';\np.Health = ' + nm('100') + ';\np.' + fn('TakeDamage') + '(' + nm('25') + ');') + buildOutput('Samuel: 75 HP') + buildHow('Classes are blueprints. <code>new</code> creates instances.')) }
    ],
    quiz: [
        { question: "C# game engine?", options: ["Unreal", "Unity", "Godot", "GameMaker"], correct: 1 },
        { question: "Update() runs?", options: ["Once", "Every frame", "On click", "Never"], correct: 1 }
    ]
},
gdscript: {
    name: "GDScript", icon: "🎮",
    topics: [
        { title: "Intro to GDScript", readTime: 45, concepts: ["GDScript for Godot", "Syntax like Python", "Free and open source", "2D and 3D games"], gateQuiz: { question: "GDScript is for?", options: ["Unity", "Unreal", "Godot", "GameMaker"], correct: 2, explanation: "GDScript is Godot's language." },
            content: buildLesson('🎮 Introduction to GDScript', 'Godot scripting', '<p><strong>Godot</strong> is a free game engine. GDScript looks like Python!</p>' + buildCode(kw('extends') + ' Node\n\n' + kw('func') + ' ' + fn('_ready') + '():\n    ' + fn('print') + '(' + st('"Hello, World!"') + ')\n\n' + kw('var') + ' player_name = ' + st('"Samuel"') + '\n' + kw('var') + ' health = ' + nm('100')) + buildHow('<code>_ready()</code> runs when node enters scene.') + buildTip('Download Godot free from godotengine.org!')) },
        { title: "Variables & Functions", readTime: 50, concepts: ["var declares", "func defines functions", "export for editor", "Type hints with :"], gateQuiz: { question: "func creates?", options: ["Variable", "Class", "Function", "Signal"], correct: 2, explanation: "func defines functions." },
            content: buildLesson('📦 Variables & Functions', 'GDScript basics', buildCode(kw('var') + ' speed: ' + tp('float') + ' = ' + nm('200.0') + '\n' + kw('var') + ' health: ' + tp('int') + ' = ' + nm('100') + '\n\n' + kw('func') + ' ' + fn('take_damage') + '(amount):\n    health -= amount\n    ' + fn('print') + '(' + st('"HP: "') + ', health)\n\n' + kw('func') + ' ' + fn('_ready') + '():\n    ' + fn('take_damage') + '(' + nm('25') + ')') + buildOutput('HP: 75') + buildHow('Type hints with <code>:</code> are optional but helpful.')) },
        { title: "Movement & Input", readTime: 55, concepts: ["_process every frame", "delta = frame time", "Input.is_action_pressed()", "velocity for movement"], gateQuiz: { question: "_process receives?", options: ["input", "delta", "speed", "position"], correct: 1, explanation: "delta = time since last frame." },
            content: buildLesson('🕹️ Movement', 'Making things move', buildCode(kw('extends') + ' CharacterBody2D\n' + kw('var') + ' speed = ' + nm('300.0') + '\n\n' + kw('func') + ' ' + fn('_process') + '(delta):\n    ' + kw('var') + ' vel = Vector2.ZERO\n    ' + kw('if') + ' Input.' + fn('is_action_pressed') + '(' + st('"ui_right"') + '):\n        vel.x += ' + nm('1') + '\n    ' + kw('if') + ' Input.' + fn('is_action_pressed') + '(' + st('"ui_left"') + '):\n        vel.x -= ' + nm('1') + '\n    vel = vel * speed\n    ' + fn('move_and_slide') + '()') + buildHow('<code>_process(delta)</code> runs every frame.') + buildTip('Attach to CharacterBody2D to move with arrow keys!')) }
    ],
    quiz: [
        { question: "GDScript for?", options: ["Unity", "Unreal", "Godot", "GameMaker"], correct: 2 },
        { question: "func creates?", options: ["Variable", "Class", "Function", "Signal"], correct: 2 }
    ]
},
css: {
    name: "CSS Advanced", icon: "🎨",
    topics: [
        { title: "CSS Animations", readTime: 50, concepts: ["@keyframes defines", "animation applies", "transition for simple", "transform moves"], gateQuiz: { question: "@keyframes creates?", options: ["Variables", "Animations", "Layouts", "Colors"], correct: 1, explanation: "@keyframes defines animation steps." },
            content: buildLesson('✨ CSS Animations', 'Making things move', buildCode('@keyframes slide-in {\n    ' + kw('from') + ' { transform: translateX(-100px); opacity: 0; }\n    ' + kw('to') + ' { transform: translateX(0); opacity: 1; }\n}\n.box { animation: slide-in 0.5s ease; }\n.button { transition: background 0.3s; }\n.button:hover { background: #667eea; }') + buildHow('<code>@keyframes</code> defines steps. <code>transition</code> for hover effects.')) },
        { title: "Responsive Design", readTime: 50, concepts: ["Media queries", "Mobile-first", "Flexible units", "min-width/max-width"], gateQuiz: { question: "Media queries respond to?", options: ["Clicks", "Screen size", "Keyboard", "Time"], correct: 1, explanation: "Media queries change styles by screen size." },
            content: buildLesson('📱 Responsive Design', 'All screen sizes', buildCode('.container { padding: 10px; }\n\n@media (min-width: 768px) {\n    .container { padding: 20px; }\n}\n\n@media (min-width: 1024px) {\n    .container { max-width: 1200px; margin: 0 auto; }\n}') + buildHow('<code>@media</code> queries apply styles at different widths.')) },
        { title: "CSS Variables", readTime: 40, concepts: ["--name defines", "var() uses them", "Defined in :root", "Easy theming"], gateQuiz: { question: "Use CSS variable?", options: ["$(--name)", "var(--name)", "${name}", "use(name)"], correct: 1, explanation: "var(--name) references CSS variables." },
            content: buildLesson('🎨 CSS Variables', 'Reusable values', buildCode(':root {\n    --primary: #667eea;\n    --bg: #0a0a1a;\n}\n.card {\n    background: var(--bg);\n    border: 1px solid var(--primary);\n}') + buildHow('Define in <code>:root</code>, use with <code>var()</code>.')) }
    ],
    quiz: [
        { question: "@keyframes creates?", options: ["Variables", "Animations", "Layouts", "Colors"], correct: 1 },
        { question: "Use CSS variable?", options: ["$(--x)", "var(--x)", "${x}", "use(x)"], correct: 1 }
    ]
}
};

// === THEME ===
function toggleTheme() {
    var t = document.getElementById('themeToggle');
    document.documentElement.setAttribute('data-theme', t.checked ? 'light' : 'dark');
    localStorage.setItem('theme', t.checked ? 'light' : 'dark');
}
(function () { if (localStorage.getItem('theme') === 'light') { document.documentElement.setAttribute('data-theme', 'light'); document.getElementById('themeToggle').checked = true; } })();

// === TOAST ===
function showToast(msg, type) {
    var t = document.getElementById('toast');
    t.textContent = msg; t.className = 'toast ' + (type || 'info') + ' show';
    setTimeout(function () { t.classList.remove('show'); }, 3500);
}

// === NAVIGATION ===
function switchLanguage(lang, btn) {
    pauseCurrentTimer(); currentLang = lang; currentTopic = 0;
    document.querySelectorAll('.lang-btn').forEach(function (b) { b.classList.remove('active'); });
    btn.classList.add('active');
    document.getElementById('progressLang').textContent = lessons[lang].name;
    renderTopicNav(); renderLesson(); updateProgress(); saveState();
    showSection('lessons', document.querySelector('nav a'));
}

function renderTopicNav() {
    var nav = document.getElementById('topicNav'), topics = lessons[currentLang].topics;
    nav.innerHTML = topics.map(function (t, i) {
        var s = getState(currentLang, i), cls = '';
        if (i === currentTopic) cls = 'active'; else if (s.completed) cls = 'completed';
        else if (i > 0 && !getState(currentLang, i - 1).completed) cls = 'locked';
        return '<button class="topic-btn ' + cls + '" onclick="selectTopic(' + i + ')">' + (i + 1) + '. ' + t.title + '</button>';
    }).join('');
}

function selectTopic(i) {
    if (i > 0 && !getState(currentLang, i - 1).completed) { showToast('🔒 Complete previous topic!', 'error'); return; }
    pauseCurrentTimer(); currentTopic = i; renderTopicNav(); renderLesson(); saveState();
}

function updateProgress() {
    var topics = lessons[currentLang].topics, done = 0;
    topics.forEach(function (_, i) { if (getState(currentLang, i).completed) done++; });
    var pct = Math.round((done / topics.length) * 100);
    document.getElementById('progressFill').style.width = pct + '%';
    document.getElementById('progressStats').textContent = done + ' / ' + topics.length + ' completed (' + pct + '%)';
}

// === TIMER ===
function pauseCurrentTimer() {
    var key = currentLang + '_' + currentTopic;
    if (activeTimers[key]) {
        clearInterval(activeTimers[key].id);
        var s = getState(currentLang, currentTopic);
        if (!s.timerDone) { s.remainingTime = activeTimers[key].rem; saveState(); }
        delete activeTimers[key];
    }
}

function startReadingTimer(totalSecs) {
    var s = getState(currentLang, currentTopic);
    var cd = document.getElementById('timerCountdown'), tx = document.getElementById('timerText');
    if (!cd || !tx) return;
    if (s.timerDone) { cd.textContent = '✅ Done!'; cd.classList.add('timer-done'); tx.textContent = '✅ Reading time complete!'; return; }
    var rem = s.remainingTime >= 0 ? s.remainingTime : totalSecs;
    if (s.remainingTime < 0) s.remainingTime = totalSecs;
    var key = currentLang + '_' + currentTopic;
    if (activeTimers[key]) { clearInterval(activeTimers[key].id); delete activeTimers[key]; }
    function upd() { var m = Math.floor(rem / 60), sc = rem % 60; cd.textContent = m + ':' + (sc < 10 ? '0' : '') + sc; }
    upd();
    var id = setInterval(function () {
        rem--; s.remainingTime = rem; upd();
        if (rem % 5 === 0) saveState();
        if (rem <= 0) { clearInterval(id); delete activeTimers[key]; s.timerDone = true; s.remainingTime = 0; saveState(); cd.textContent = '✅ Done!'; cd.classList.add('timer-done'); tx.textContent = '✅ Reading time complete!'; checkCompletion(); showToast('⏱️ Reading done!', 'success'); }
    }, 1000);
    activeTimers[key] = { id: id, rem: rem };
}

// === CONCEPTS & GATE ===
function onConceptCheck() {
    var cbs = document.querySelectorAll('.concept-cb'), all = true;
    cbs.forEach(function (cb) { var it = cb.closest('.concept-item'); if (cb.checked) it.classList.add('checked'); else { it.classList.remove('checked'); all = false; } });
    getState(currentLang, currentTopic).conceptsChecked = all; saveState();
    if (all) showToast('✅ All checked! Pass the quiz.', 'success'); checkCompletion();
}

function checkGateAnswer(btn, idx) {
    var t = lessons[currentLang].topics[currentTopic], c = t.gateQuiz.correct, s = getState(currentLang, currentTopic);
    var opts = document.querySelectorAll('.gate-option'), res = document.getElementById('gateResult');
    opts.forEach(function (o, i) { o.style.pointerEvents = 'none'; if (i === c) o.classList.add('correct'); });
    if (idx === c) { btn.classList.add('correct'); res.innerHTML = '✅ Correct! ' + t.gateQuiz.explanation; res.className = 'gate-result success'; s.quizPassed = true; saveState(); checkCompletion(); }
    else { btn.classList.add('wrong'); res.innerHTML = '❌ Wrong. ' + t.gateQuiz.explanation; res.className = 'gate-result failure'; setTimeout(function () { opts.forEach(function (o) { o.classList.remove('correct', 'wrong'); o.style.pointerEvents = 'auto'; }); res.style.display = 'none'; }, 3000); }
    res.style.display = 'block';
}

function checkCompletion() {
    var s = getState(currentLang, currentTopic);
    if (s.timerDone && s.conceptsChecked && s.quizPassed && !s.completed) {
        s.completed = true; saveState(); var b = document.getElementById('unlockBtn'); if (b) b.style.display = 'inline-block';
        showToast('🎉 Topic completed!', 'success'); updateProgress(); renderTopicNav();
    }
}

function unlockNext() {
    if (currentTopic < lessons[currentLang].topics.length - 1) { pauseCurrentTimer(); selectTopic(currentTopic + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }
    else showToast('🏆 All ' + lessons[currentLang].name + ' topics done!', 'success');
}

// === RENDER LESSON ===
function renderLesson() {
    var t = lessons[currentLang].topics[currentTopic], s = getState(currentLang, currentTopic);
    var m = Math.floor(t.readTime / 60), sc = t.readTime % 60;
    var h = '<div class="reading-timer"><span class="timer-text" id="timerText">⏱️ Minimum reading time:</span><span class="timer-countdown" id="timerCountdown">' + m + ':' + (sc < 10 ? '0' : '') + sc + '</span></div>';
    h += '<div class="lesson-card">' + t.content + '</div>';
    h += '<div class="concept-checklist"><h4>✅ I Understand These Concepts:</h4>';
    t.concepts.forEach(function (c) { var chk = s.conceptsChecked ? 'checked' : '', cls = s.conceptsChecked ? 'checked' : ''; h += '<div class="concept-item ' + cls + '"><input type="checkbox" class="concept-cb" ' + chk + ' onchange="onConceptCheck()"><span>' + c + '</span></div>'; });
    h += '</div>';
    h += '<div class="gate-quiz"><h3>🔓 Unlock Next Topic</h3><p class="gate-subtitle">Answer correctly to proceed</p><p class="gate-question">' + t.gateQuiz.question + '</p>';
    t.gateQuiz.options.forEach(function (o, i) { h += '<div class="gate-option" onclick="checkGateAnswer(this,' + i + ')">' + o + '</div>'; });
    h += '<div class="gate-result" id="gateResult" style="display:none"></div><button class="unlock-btn" id="unlockBtn" onclick="unlockNext()" ' + (s.completed ? 'style="display:inline-block"' : '') + '>🚀 Next Topic</button></div>';
    document.getElementById('lessonContent').innerHTML = h;
    document.getElementById('lessonContent').style.display = 'block';
    document.getElementById('practiceSection').style.display = 'none';
    document.getElementById('quizSection').style.display = 'none';
    startReadingTimer(t.readTime);
}

// === SECTIONS ===
function showSection(section, navLink) {
    document.querySelectorAll('nav a').forEach(function (a) { a.classList.remove('active-nav'); });
    if (navLink) navLink.classList.add('active-nav');
    if (section === 'lessons') renderLesson();
    else if (section === 'practice') { pauseCurrentTimer(); document.getElementById('lessonContent').style.display = 'none'; document.getElementById('quizSection').style.display = 'none'; renderPractice(); document.getElementById('practiceSection').style.display = 'block'; }
    else if (section === 'quiz') { pauseCurrentTimer(); document.getElementById('lessonContent').style.display = 'none'; document.getElementById('practiceSection').style.display = 'none'; renderQuiz(); document.getElementById('quizSection').style.display = 'block'; }
}
// =============================================
//  PART 2: PRACTICE, RUN CODE, COLORIZE, QUIZ, INIT
// =============================================

// === PRACTICE SECTION ===
function getPlaceholder(lang) {
    var p = {
        python: 'print("Hello, World!")',
        javascript: 'console.log("Hello!");',
        java: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello!");\n    }\n}',
        c: '#include <stdio.h>\n\nint main() {\n    printf("Hello!\\n");\n    return 0;\n}',
        html: '<h1>Hello!</h1>\n<p>Welcome</p>',
        typescript: 'console.log("Hello!");',
        lua: 'print("Hello, World!")',
        csharp: 'using System;\nclass Program {\n    static void Main() {\n        Console.WriteLine("Hello!");\n    }\n}',
        gdscript: 'func _ready():\n    print("Hello!")',
        css: '.box {\n    color: red;\n    padding: 20px;\n}'
    };
    return p[lang] || 'Type your code here...';
}

function getChallenges(lang) {
    var challenges = {
        python: [
            { diff: 'e', title: 'Hello World', desc: 'Print "Hello, World!"', code: 'print("Hello, World!")' },
            { diff: 'e', title: 'Math', desc: 'Print 15 + 27', code: 'print(15 + 27)' },
            { diff: 'm', title: 'Variables', desc: 'Create name and age, print them', code: 'name = "Samuel"\nage = 13\nprint("Name:", name)\nprint("Age:", age)' },
            { diff: 'h', title: 'Loop', desc: 'Print 1 to 5 with a for loop', code: 'for i in range(1, 6):\n    print(i)' }
        ],
        javascript: [
            { diff: 'e', title: 'Hello World', desc: 'Log "Hello, World!"', code: 'console.log("Hello, World!");' },
            { diff: 'e', title: 'Math', desc: 'Log 10 + 20', code: 'console.log(10 + 20);' },
            { diff: 'm', title: 'Variables', desc: 'Create and log a variable', code: 'let name = "Samuel";\nconsole.log("Hello,", name);' },
            { diff: 'h', title: 'Loop', desc: 'Print 1 to 5', code: 'for (let i = 1; i <= 5; i++) {\n    console.log(i);\n}' }
        ],
        java: [
            { diff: 'e', title: 'Hello World', desc: 'Print Hello World', code: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}' }
        ],
        c: [
            { diff: 'e', title: 'Hello World', desc: 'Print Hello World', code: '#include <stdio.h>\n\nint main() {\n    printf("Hello, World!\\n");\n    return 0;\n}' }
        ],
        typescript: [
            { diff: 'e', title: 'Hello World', desc: 'Log with types', code: 'let name: string = "Samuel";\nconsole.log("Hello,", name);' }
        ],
        lua: [
            { diff: 'e', title: 'Hello World', desc: 'Print Hello World', code: 'print("Hello, World!")' },
            { diff: 'm', title: 'Variables', desc: 'Create and print variables', code: 'local name = "Samuel"\nlocal age = 13\nprint("Name: " .. name)\nprint("Age: " .. age)' }
        ],
        csharp: [
            { diff: 'e', title: 'Hello World', desc: 'Print Hello World', code: 'using System;\nclass Program {\n    static void Main() {\n        Console.WriteLine("Hello, World!");\n    }\n}' }
        ],
        gdscript: [
            { diff: 'e', title: 'Hello World', desc: 'Print Hello World', code: 'extends Node\n\nfunc _ready():\n    print("Hello, World!")' }
        ],
        html: [
            { diff: 'e', title: 'Basic Page', desc: 'Create heading and paragraph', code: '<!DOCTYPE html>\n<html>\n<body>\n    <h1>Hello!</h1>\n    <p>Welcome to my site</p>\n</body>\n</html>' }
        ],
        css: [
            { diff: 'e', title: 'Style a Box', desc: 'Create a colored box', code: '.box {\n    background: #667eea;\n    color: white;\n    padding: 20px;\n    border-radius: 10px;\n}' }
        ]
    };

    var langChallenges = challenges[lang] || [];
    if (langChallenges.length === 0) {
        return '<div class="challenge-card"><p>No challenges yet. Try writing your own code!</p></div>';
    }

    var html = '';
    for (var i = 0; i < langChallenges.length; i++) {
        var ch = langChallenges[i];
        var diffClass = ch.diff === 'e' ? 'diff-e' : ch.diff === 'm' ? 'diff-m' : 'diff-h';
        var diffLabel = ch.diff === 'e' ? 'Easy' : ch.diff === 'm' ? 'Medium' : 'Hard';
        var escapedCode = ch.code.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n');

        html += '<div class="challenge-card">';
        html += '<span class="diff ' + diffClass + '">' + diffLabel + '</span>';
        html += '<h4>🎯 ' + ch.title + '</h4>';
        html += '<p>' + ch.desc + '</p>';
        html += '<button class="try-btn" onclick="loadChallenge(&quot;' + escapedCode + '&quot;)">📝 Load Template</button>';
        html += '</div>';
    }
    return html;
}

function renderPractice() {
    var lang = lessons[currentLang];
    previewVisible = false;
    var challengeHTML = getChallenges(currentLang);
    var placeholder = getPlaceholder(currentLang).replace(/"/g, '&quot;').replace(/\n/g, '&#10;');

    var html = '<div class="practice-section">';
    html += '<h3>✍️ Practice ' + lang.name + '</h3>';
    html += '<p style="color:var(--text-secondary);margin-bottom:14px;font-size:13px">';

    if (currentLang === 'javascript' || currentLang === 'typescript') {
        html += 'Type code and click <strong>▶ Run</strong> for <strong>real execution</strong>! Click <strong>👁️ Preview</strong> for syntax colors.';
    } else if (currentLang === 'html' || currentLang === 'css') {
        html += 'Type HTML/CSS and click <strong>▶ Run</strong> to render it! Click <strong>👁️ Preview</strong> for syntax colors.';
    } else {
        html += 'Type code and click <strong>▶ Run</strong> for simulated output. Click <strong>👁️ Preview</strong> for syntax colors. For real execution, use <a href="https://replit.com" target="_blank" style="color:var(--accent-primary)">replit.com</a>';
    }
    html += '</p>';

    // Editor
    html += '<div class="editor-box">';
    html += '<div class="editor-top">';
    html += '<div class="dots"><span class="dot-r"></span><span class="dot-y"></span><span class="dot-g"></span></div>';
    html += '<span class="editor-label">' + lang.icon + ' ' + lang.name + '</span>';
    html += '</div>';

    html += '<div class="editor-main" style="position:relative">';
    html += '<div class="line-numbers" id="lineNums">1</div>';
    html += '<textarea id="codeInput" spellcheck="false" placeholder="' + placeholder + '" oninput="onCodeInput()" onscroll="syncLineNumbers()"></textarea>';
    html += '</div>';

    html += '<div class="preview-toggle-bar">';
    html += '<span id="charInfo">0 chars | 1 line</span>';
    html += '<button class="preview-btn" id="previewBtn" onclick="togglePreview()">👁️ Preview</button>';
    html += '</div>';

    html += '<div class="code-preview" id="codePreview"></div>';

    html += '<div class="editor-bottom">';
    if (currentLang === 'javascript' || currentLang === 'typescript') {
        html += '<span style="color:#4caf50;font-size:11px">✅ Real execution in browser</span>';
    } else if (currentLang === 'html' || currentLang === 'css') {
        html += '<span style="color:#4caf50;font-size:11px">✅ Live rendering</span>';
    } else {
        html += '<span style="color:#888;font-size:11px">⚡ Simulated output</span>';
    }
    html += '<div class="btn-row">';
    html += '<button class="clr-btn" onclick="clearCode()">🗑️ Clear</button>';
    html += '<button class="run-btn" onclick="runCode()">▶ Run Code</button>';
    html += '</div></div></div>';

    // Output
    html += '<div class="output-wrapper">';
    html += '<div class="output-tab-bar">';
    html += '<div class="output-tab active">📟 Output</div>';
    html += '<div style="flex:1"></div>';
    html += '<span class="output-status waiting" id="outputStatus">⏳ Waiting</span>';
    html += '</div>';
    html += '<div class="run-output" id="runOutput"><span class="output-empty">Run your code to see output here...</span></div>';
    html += '<div class="execution-info" id="execInfo"><span>Ready</span><span></span></div>';
    html += '</div>';

    // Challenges
    html += '<div class="challenge-header"><h3>🎯 Challenges</h3></div>';
    html += challengeHTML;
    html += '</div>';

    document.getElementById('practiceSection').innerHTML = html;
}

function loadChallenge(code) {
    var input = document.getElementById('codeInput');
    if (input) {
        var unescaped = code.replace(/\\n/g, '\n').replace(/\\"/g, '"').replace(/\\\\/g, '\\');
        input.value = unescaped;
        onCodeInput();
        input.focus();
        showToast('📝 Template loaded! Click ▶ Run', 'info');
    }
}

function onCodeInput() {
    var input = document.getElementById('codeInput');
    if (!input) return;
    var code = input.value;
    var lines = code.split('\n').length;
    var info = document.getElementById('charInfo');
    if (info) info.textContent = code.length + ' chars | ' + lines + ' line' + (lines !== 1 ? 's' : '');
    updateLineNumbers(lines);
    if (previewVisible) updatePreview();
}

function updateLineNumbers(count) {
    var el = document.getElementById('lineNums');
    if (!el) return;
    var nums = [];
    for (var i = 1; i <= count; i++) nums.push(i);
    el.textContent = nums.join('\n');
}

function syncLineNumbers() {
    var input = document.getElementById('codeInput');
    var nums = document.getElementById('lineNums');
    if (input && nums) nums.style.transform = 'translateY(-' + input.scrollTop + 'px)';
}

document.addEventListener('keydown', function (e) {
    if (e.target && e.target.id === 'codeInput' && e.key === 'Tab') {
        e.preventDefault();
        var inp = e.target, s = inp.selectionStart, en = inp.selectionEnd;
        inp.value = inp.value.substring(0, s) + '    ' + inp.value.substring(en);
        inp.selectionStart = inp.selectionEnd = s + 4;
        onCodeInput();
    }
});

function togglePreview() {
    previewVisible = !previewVisible;
    var p = document.getElementById('codePreview'), b = document.getElementById('previewBtn');
    if (!p || !b) return;
    if (previewVisible) { p.classList.add('visible'); b.classList.add('active'); b.textContent = '👁️ Hide'; updatePreview(); }
    else { p.classList.remove('visible'); b.classList.remove('active'); b.textContent = '👁️ Preview'; }
}

function updatePreview() {
    var input = document.getElementById('codeInput'), preview = document.getElementById('codePreview');
    if (!input || !preview) return;
    if (!input.value.trim()) { preview.innerHTML = '<span class="output-empty">Type code to see preview...</span>'; return; }
    preview.innerHTML = colorize(input.value, currentLang);
}

// === COLORIZE FOR PREVIEW ===
function colorize(code, lang) {
    var e = code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return e.split('\n').map(function (l) { return colorizeLine(l, lang); }).join('\n');
}

function colorizeLine(line, lang) {
    if (lang === 'html' || lang === 'css') return line;
    var marker = (lang === 'python' || lang === 'gdscript') ? '#' : '//';
    if (lang === 'lua') {
        var dIdx = line.indexOf('--');
        if (dIdx >= 0) return tokenize(line.substring(0, dIdx), lang) + '<span class="hl-comment">' + line.substring(dIdx) + '</span>';
        return tokenize(line, lang);
    }
    var idx = findComment(line, marker);
    if (idx >= 0) return tokenize(line.substring(0, idx), lang) + '<span class="hl-comment">' + line.substring(idx) + '</span>';
    return tokenize(line, lang);
}

function findComment(line, marker) {
    var inStr = false, ch = '';
    for (var i = 0; i < line.length; i++) {
        var c = line[i];
        if (!inStr && (c === '"' || c === "'")) { inStr = true; ch = c; }
        else if (inStr && c === ch) inStr = false;
        else if (!inStr && line.substring(i, i + marker.length) === marker) return i;
    }
    return -1;
}

function tokenize(text, lang) {
    var tokens = [], i = 0;
    while (i < text.length) {
        var c = text[i];
        if (c === '"' || c === "'" || c === '`') {
            var s = i, q = c; i++;
            while (i < text.length && text[i] !== q) { if (text[i] === '\\') i++; i++; }
            if (i < text.length) i++;
            tokens.push({ t: 'string', v: text.substring(s, i) }); continue;
        }
        if (c >= '0' && c <= '9') {
            var ns = i;
            while (i < text.length && ((text[i] >= '0' && text[i] <= '9') || text[i] === '.')) i++;
            if (i < text.length && isW(text[i])) { while (i < text.length && isW(text[i])) i++; tokens.push({ t: 'plain', v: text.substring(ns, i) }); }
            else tokens.push({ t: 'number', v: text.substring(ns, i) });
            continue;
        }
        if (isW(c)) { var ws = i; while (i < text.length && isW(text[i])) i++; tokens.push({ t: wordType(text.substring(ws, i), lang), v: text.substring(ws, i) }); continue; }
        if ('()[]{}' .indexOf(c) >= 0) { tokens.push({ t: 'bracket', v: c }); i++; continue; }
        if (c === '#' && lang === 'c') { var ps = i; i++; while (i < text.length && isW(text[i])) i++; tokens.push({ t: 'keyword', v: text.substring(ps, i) }); continue; }
        if ('=+*/%!<>&|^~?:;,.-'.indexOf(c) >= 0) { tokens.push({ t: 'operator', v: c }); i++; continue; }
        tokens.push({ t: 'plain', v: c }); i++;
    }
    return tokens.map(function (tk) {
        var cls = { keyword: 'hl-keyword', string: 'hl-string', function: 'hl-function', number: 'hl-number', bracket: 'hl-bracket', operator: 'hl-operator', type: 'hl-type' }[tk.t];
        return cls ? '<span class="' + cls + '">' + tk.v + '</span>' : tk.v;
    }).join('');
}

function isW(c) { return (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z') || (c >= '0' && c <= '9') || c === '_'; }

function wordType(word, lang) {
    var kwMap = { python: ['def', 'return', 'if', 'elif', 'else', 'for', 'while', 'in', 'import', 'from', 'class', 'try', 'except', 'finally', 'with', 'as', 'lambda', 'pass', 'break', 'continue', 'and', 'or', 'not', 'is', 'True', 'False', 'None', 'yield', 'raise', 'del'], javascript: ['const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while', 'do', 'switch', 'case', 'break', 'continue', 'class', 'new', 'this', 'typeof', 'try', 'catch', 'finally', 'throw', 'import', 'export', 'default', 'async', 'await', 'of', 'in', 'true', 'false', 'null', 'undefined'], java: ['public', 'private', 'protected', 'static', 'void', 'class', 'new', 'return', 'if', 'else', 'for', 'while', 'do', 'switch', 'case', 'break', 'continue', 'try', 'catch', 'throw', 'import', 'extends', 'final', 'this', 'super', 'true', 'false', 'null'], c: ['int', 'float', 'double', 'char', 'void', 'long', 'short', 'unsigned', 'return', 'if', 'else', 'for', 'while', 'do', 'switch', 'case', 'break', 'continue', 'struct', 'typedef', 'sizeof', 'const', 'static'], typescript: ['const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while', 'class', 'new', 'this', 'typeof', 'interface', 'type', 'enum', 'extends', 'implements', 'import', 'export', 'default', 'async', 'await', 'true', 'false', 'null', 'undefined', 'as', 'in', 'of'], lua: ['local', 'function', 'if', 'then', 'else', 'elseif', 'end', 'for', 'while', 'do', 'repeat', 'until', 'return', 'and', 'or', 'not', 'true', 'false', 'nil', 'in'], csharp: ['using', 'namespace', 'class', 'public', 'private', 'protected', 'static', 'void', 'new', 'return', 'if', 'else', 'for', 'while', 'do', 'switch', 'case', 'break', 'continue', 'try', 'catch', 'throw', 'var', 'true', 'false', 'null', 'override', 'virtual', 'abstract'], gdscript: ['extends', 'func', 'var', 'const', 'if', 'elif', 'else', 'for', 'while', 'return', 'class_name', 'signal', 'export', 'onready', 'pass', 'break', 'continue', 'and', 'or', 'not', 'true', 'false', 'null', 'in', 'is', 'self'], css: ['@keyframes', '@media', 'from', 'to', 'hover', 'focus', 'active', 'root'] };
    var fnMap = { python: ['print', 'input', 'range', 'len', 'type', 'int', 'str', 'float', 'bool', 'list', 'dict', 'abs', 'max', 'min', 'sum', 'sorted', 'enumerate', 'zip', 'map', 'filter', 'open', 'round'], javascript: ['console', 'log', 'alert', 'prompt', 'parseInt', 'parseFloat', 'Math', 'Array', 'Object', 'String', 'Number', 'JSON', 'document', 'window', 'setTimeout', 'push', 'pop', 'map', 'filter', 'reduce', 'forEach', 'querySelector', 'addEventListener'], java: ['System', 'out', 'println', 'print', 'Scanner', 'Math', 'Arrays', 'String'], c: ['printf', 'scanf', 'main', 'malloc', 'free', 'strlen'], typescript: ['console', 'log', 'Math', 'Array', 'Object', 'String', 'Number', 'JSON', 'Promise', 'fetch'], lua: ['print', 'tostring', 'tonumber', 'type', 'pairs', 'ipairs', 'table', 'string', 'math', 'require', 'error', 'pcall'], csharp: ['Console', 'WriteLine', 'ReadLine', 'Debug', 'Log', 'Math', 'ToString', 'GetAxis', 'Translate', 'Connect', 'GetComponent'], gdscript: ['print', 'str', 'int', 'float', 'Vector2', 'Vector3', 'Input', 'load', 'preload', 'move_and_slide', 'get_node', 'connect', 'is_action_pressed', 'normalized'], css: ['var', 'calc', 'rgb', 'rgba', 'linear-gradient', 'translateX', 'rotate', 'scale'] };
    var tpMap = { java: ['int', 'double', 'float', 'char', 'boolean', 'String', 'long', 'short', 'byte'], csharp: ['int', 'float', 'double', 'string', 'bool', 'void', 'char', 'long', 'object', 'var'], typescript: ['string', 'number', 'boolean', 'void', 'any', 'never', 'unknown', 'null', 'undefined', 'object'], gdscript: ['int', 'float', 'String', 'bool', 'Vector2', 'Vector3', 'Array', 'Dictionary', 'Node', 'Node2D', 'CharacterBody2D'] };
    if (tpMap[lang] && tpMap[lang].indexOf(word) >= 0) return 'type';
    if (kwMap[lang] && kwMap[lang].indexOf(word) >= 0) return 'keyword';
    if (fnMap[lang] && fnMap[lang].indexOf(word) >= 0) return 'function';
    return 'plain';
}

// === RUN CODE — NO API, ALWAYS WORKS ===
function escOut(t) { return String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

function getPrintHint(lang) {
    var h = { python: 'print()', javascript: 'console.log()', java: 'System.out.println()', c: 'printf()', typescript: 'console.log()', lua: 'print()', csharp: 'Console.WriteLine()', gdscript: 'print()' };
    return h[lang] || 'print';
}

function clearCode() {
    var input = document.getElementById('codeInput');
    if (input) input.value = '';
    onCodeInput();
    var out = document.getElementById('runOutput');
    if (out) { out.innerHTML = '<span class="output-empty">Run your code to see output here...</span>'; out.className = 'run-output'; }
    var st = document.getElementById('outputStatus');
    if (st) { st.textContent = '⏳ Waiting'; st.className = 'output-status waiting'; }
    var info = document.getElementById('execInfo');
    if (info) info.innerHTML = '<span>Ready</span><span></span>';
}

function formatOutput(text) {
    if (!text || !text.trim()) return '';
    var lines = text.split('\n');
    while (lines.length > 0 && lines[lines.length - 1].trim() === '') lines.pop();
    var html = '';
    for (var i = 0; i < lines.length; i++) {
        html += '<span class="output-line"><span class="output-line-num">' + (i + 1) + '</span>' + escOut(lines[i]) + '</span>';
        if (i < lines.length - 1) html += '\n';
    }
    return html;
}

function runCode() {
    var input = document.getElementById('codeInput');
    var code = input ? input.value : '';
    var output = document.getElementById('runOutput');
    var status = document.getElementById('outputStatus');
    var execInfo = document.getElementById('execInfo');
    var startTime = performance.now();

    if (!code.trim()) {
        output.innerHTML = '<span class="output-empty">⚠️ Please write some code first!</span>';
        output.className = 'run-output err';
        status.textContent = '⚠️ Empty'; status.className = 'output-status error';
        return;
    }

    output.innerHTML = '<span class="output-empty">⏳ Running...</span>';
    output.className = 'run-output';
    status.textContent = '⏳ Running...'; status.className = 'output-status waiting';

    if (currentLang === 'javascript' || currentLang === 'typescript') {
        runJavaScript(code, output, status, execInfo, startTime);
    } else if (currentLang === 'html' || currentLang === 'css') {
        runHTML(code, output, status, execInfo, startTime);
    } else {
        runSimulated(code, output, status, execInfo, startTime);
    }
}

function runJavaScript(code, output, status, execInfo, startTime) {
    var savedLog = console.log, savedWarn = console.warn, savedError = console.error;
    try {
        var results = [];
        console.log = function () {
            var args = Array.prototype.slice.call(arguments);
            results.push(args.map(function (a) {
                if (a === null) return 'null';
                if (a === undefined) return 'undefined';
                if (typeof a === 'object') { try { return JSON.stringify(a, null, 2); } catch (e) { return String(a); } }
                return String(a);
            }).join(' '));
        };
        console.warn = function () { results.push('⚠️ ' + Array.prototype.slice.call(arguments).join(' ')); };
        console.error = function () { results.push('❌ ' + Array.prototype.slice.call(arguments).join(' ')); };

        var returnVal = eval(code);
        console.log = savedLog; console.warn = savedWarn; console.error = savedError;
        var elapsed = (performance.now() - startTime).toFixed(0);

        if (results.length > 0) {
            output.innerHTML = formatOutput(results.join('\n'));
            output.className = 'run-output';
            status.textContent = '✅ Success'; status.className = 'output-status success';
            execInfo.innerHTML = '<span>✅ Ran in ' + elapsed + 'ms</span><span>' + results.length + ' lines</span>';
            showToast('✅ Code executed!', 'success');
        } else if (returnVal !== undefined) {
            output.innerHTML = '<span class="output-line"><span class="output-line-num">1</span>' + escOut(String(returnVal)) + '</span>';
            output.className = 'run-output';
            status.textContent = '✅ Success'; status.className = 'output-status success';
            execInfo.innerHTML = '<span>✅ ' + elapsed + 'ms</span><span>1 line</span>';
        } else {
            output.innerHTML = '<span class="output-line"><span class="output-line-num">1</span>✅ Executed (no output)</span>\n<span class="output-line"><span class="output-line-num">💡</span>Use console.log() to see output</span>';
            output.className = 'run-output';
            status.textContent = '✅ Done'; status.className = 'output-status success';
            execInfo.innerHTML = '<span>✅ ' + elapsed + 'ms</span><span>No output</span>';
        }
    } catch (err) {
        console.log = savedLog; console.warn = savedWarn; console.error = savedError;
        var elapsed2 = (performance.now() - startTime).toFixed(0);
        output.innerHTML = '<span class="output-line"><span class="output-line-num">!</span>❌ ' + escOut(err.name) + ': ' + escOut(err.message) + '</span>\n<span class="output-line"><span class="output-line-num"> </span></span>\n<span class="output-line"><span class="output-line-num">💡</span>Check for typos or missing brackets</span>';
        output.className = 'run-output err';
        status.textContent = '❌ Error'; status.className = 'output-status error';
        execInfo.innerHTML = '<span>❌ ' + elapsed2 + 'ms</span><span>' + escOut(err.name) + '</span>';
        showToast('❌ Error in code', 'error');
    }
}

function runHTML(code, output, status, execInfo, startTime) {
    try {
        var frame = document.createElement('iframe');
        frame.style.cssText = 'display:none;width:0;height:0;border:none;';
        frame.sandbox = 'allow-same-origin';
        document.body.appendChild(frame);
        frame.contentDocument.open();
        frame.contentDocument.write(code);
        frame.contentDocument.close();
        var renderedText = (frame.contentDocument.body.innerText || '').trim();
        document.body.removeChild(frame);
        var elapsed = (performance.now() - startTime).toFixed(0);

        if (renderedText) {
            output.innerHTML = formatOutput(renderedText);
            output.className = 'run-output';
            status.textContent = '✅ Rendered'; status.className = 'output-status success';
            execInfo.innerHTML = '<span>✅ ' + elapsed + 'ms</span><span>HTML/CSS</span>';
        } else {
            output.innerHTML = '<span class="output-line"><span class="output-line-num">1</span>✅ Rendered (no visible text)</span>';
            output.className = 'run-output';
            status.textContent = '✅ Rendered'; status.className = 'output-status success';
            execInfo.innerHTML = '<span>✅ ' + elapsed + 'ms</span><span>HTML/CSS</span>';
        }
        showToast('✅ Rendered!', 'success');
    } catch (err) {
        output.innerHTML = '<span class="output-line"><span class="output-line-num">!</span>❌ ' + escOut(err.message) + '</span>';
        output.className = 'run-output err';
        status.textContent = '❌ Error'; status.className = 'output-status error';
    }
}

function runSimulated(code, output, status, execInfo, startTime) {
    var simLines = simulateOutput(code, currentLang);
    var elapsed = (performance.now() - startTime).toFixed(0);

    if (simLines.length > 0) {
        var html = '<span class="output-line" style="color:#667eea"><span class="output-line-num">ℹ️</span>' + lessons[currentLang].name + ' — Simulated Output:</span>\n';
        html += '<span class="output-line"><span class="output-line-num"> </span></span>\n';
        html += formatOutput(simLines.join('\n'));
        html += '\n<span class="output-line"><span class="output-line-num"> </span></span>';
        html += '\n<span class="output-line" style="color:#888"><span class="output-line-num">💡</span>For real execution: use replit.com or switch to JavaScript</span>';

        output.innerHTML = html;
        output.className = 'run-output';
        status.textContent = '✅ Simulated'; status.className = 'output-status success';
        execInfo.innerHTML = '<span>✅ ' + elapsed + 'ms</span><span>' + simLines.length + ' lines</span>';
        showToast('✅ Output simulated!', 'success');
    } else {
        output.innerHTML = '<span class="output-line"><span class="output-line-num">ℹ️</span>' + escOut(lessons[currentLang].name) + ' — no output detected</span>\n' +
            '<span class="output-line"><span class="output-line-num"> </span></span>\n' +
            '<span class="output-line"><span class="output-line-num">✅</span>JavaScript runs directly here — try switching!</span>\n' +
            '<span class="output-line"><span class="output-line-num">🌐</span>Use replit.com for real ' + escOut(lessons[currentLang].name) + ' execution</span>\n' +
            '<span class="output-line"><span class="output-line-num"> </span></span>\n' +
            '<span class="output-line"><span class="output-line-num">💡</span>Add ' + escOut(getPrintHint(currentLang)) + ' to your code for simulated output</span>';
        output.className = 'run-output';
        status.textContent = 'ℹ️ Add print'; status.className = 'output-status waiting';
        execInfo.innerHTML = '<span>No output detected</span><span>Add ' + escOut(getPrintHint(currentLang)) + '</span>';
    }
}

function simulateOutput(code, lang) {
    var outputs = [], match;
    if (lang === 'python') {
        var re = /print\s*\(([\s\S]*?)\)/g;
        while ((match = re.exec(code)) !== null) {
            var raw = match[1].trim();
            if (!raw) { outputs.push(''); continue; }
            var parts = splitArgs(raw);
            outputs.push(parts.map(function (p) {
                p = p.trim(); if (!p) return '';
                if ((p.charAt(0) === '"' && p.charAt(p.length - 1) === '"') || (p.charAt(0) === "'" && p.charAt(p.length - 1) === "'")) return p.substring(1, p.length - 1);
                try { var v = eval(p); if (v !== undefined) return String(v); } catch (e) {}
                return p;
            }).join(' '));
        }
    } else if (lang === 'java') {
        var re2 = /System\.out\.println\s*\(\s*([\s\S]*?)\s*\)/g;
        while ((match = re2.exec(code)) !== null) { var a = match[1].trim(); if (a.charAt(0) === '"') a = a.substring(1, a.length - 1); outputs.push(a); }
    } else if (lang === 'c') {
        var re3 = /printf\s*\(\s*"((?:[^"\\]|\\.)*)"/g;
        while ((match = re3.exec(code)) !== null) {
            match[1].replace(/\\n/g, '\n').replace(/\\t/g, '\t').split('\n').forEach(function (l) { if (l !== '') outputs.push(l); });
        }
    } else if (lang === 'lua' || lang === 'gdscript') {
        var re4 = /print\s*\(([\s\S]*?)\)/g;
        while ((match = re4.exec(code)) !== null) {
            var la = match[1].trim();
            if ((la.charAt(0) === '"' && la.charAt(la.length - 1) === '"') || (la.charAt(0) === "'" && la.charAt(la.length - 1) === "'")) outputs.push(la.substring(1, la.length - 1));
            else outputs.push(la);
        }
    } else if (lang === 'csharp') {
        var re5 = /Console\.WriteLine\s*\(\s*([\s\S]*?)\s*\)/g;
        while ((match = re5.exec(code)) !== null) { var ca = match[1].trim(); if (ca.charAt(0) === '"') ca = ca.substring(1, ca.length - 1); outputs.push(ca); }
    }
    return outputs;
}

function splitArgs(str) {
    var parts = [], inStr = false, strChar = '', current = '', depth = 0;
    for (var i = 0; i < str.length; i++) {
        var c = str.charAt(i);
        if (!inStr && (c === '"' || c === "'")) { inStr = true; strChar = c; current += c; }
        else if (inStr && c === strChar) { inStr = false; current += c; }
        else if (!inStr && c === '(') { depth++; current += c; }
        else if (!inStr && c === ')') { depth--; current += c; }
        else if (!inStr && c === ',' && depth === 0) { parts.push(current.trim()); current = ''; }
        else { current += c; }
    }
    if (current.trim()) parts.push(current.trim());
    return parts;
}

// === QUIZ ===
function renderQuiz() {
    var qd = lessons[currentLang].quiz, ln = lessons[currentLang].name;
    if (!qd || !qd.length) { document.getElementById('quizSection').innerHTML = '<div class="lesson-card"><h2>Quiz coming soon!</h2></div>'; return; }
    var h = '<div class="quiz-section"><h3>🧠 ' + ln + ' Final Quiz</h3>';
    qd.forEach(function (q, qi) {
        h += '<div class="quiz-qb"><p>' + (qi + 1) + '. ' + q.question + '</p>';
        q.options.forEach(function (o, oi) { h += '<div class="quiz-opt" onclick="checkQuiz(this,' + qi + ',' + oi + ')">' + o + '</div>'; });
        h += '<div class="quiz-res" id="qr-' + qi + '"></div></div>';
    });
    h += '<div class="score-box" id="scoreBox"><h2 id="scoreText"></h2><p id="scoreMsg" style="margin-top:8px;color:var(--text-secondary)"></p></div></div>';
    document.getElementById('quizSection').innerHTML = h;
    window._qs = 0; window._qa = 0;
}

function checkQuiz(el, qi, oi) {
    var qd = lessons[currentLang].quiz, c = qd[qi].correct, res = document.getElementById('qr-' + qi);
    var opts = el.parentElement.querySelectorAll('.quiz-opt');
    opts.forEach(function (o, i) { o.style.pointerEvents = 'none'; if (i === c) o.classList.add('correct'); });
    if (oi === c) { el.classList.add('correct'); res.textContent = '✅ Correct!'; res.style.color = 'var(--accent-green)'; window._qs++; }
    else { el.classList.add('wrong'); res.textContent = '❌ Wrong — correct is green'; res.style.color = 'var(--accent-red)'; }
    res.style.display = 'block'; window._qa++;
    if (window._qa === qd.length) {
        var pct = Math.round((window._qs / qd.length) * 100);
        document.getElementById('scoreText').textContent = 'Score: ' + window._qs + '/' + qd.length + ' (' + pct + '%)';
        document.getElementById('scoreMsg').textContent = pct >= 80 ? '🎉 Excellent, Samuel!' : pct >= 60 ? '👍 Good! Review what you missed.' : '📚 Keep studying!';
        document.getElementById('scoreBox').style.display = 'block';
    }
}

// === UTILITY & INIT ===
function copyCode(btn) {
    var block = btn.nextElementSibling;
    navigator.clipboard.writeText(block.innerText).then(function () {
        btn.textContent = '✅ Copied!'; setTimeout(function () { btn.textContent = '📋 Copy'; }, 2000);
    });
}

window.addEventListener('beforeunload', function () { pauseCurrentTimer(); saveState(); });

(function () {
    document.querySelectorAll('.lang-btn').forEach(function (btn) {
        btn.classList.remove('active');
        var t = btn.textContent.toLowerCase();
        if (t.indexOf(currentLang) >= 0 ||
            (currentLang === 'c' && t.indexOf('⚙️') >= 0) ||
            (currentLang === 'html' && t.indexOf('🌐') >= 0) ||
            (currentLang === 'csharp' && t.indexOf('💜') >= 0) ||
            (currentLang === 'gdscript' && t.indexOf('🎮') >= 0) ||
            (currentLang === 'css' && t.indexOf('🎨') >= 0) ||
            (currentLang === 'lua' && t.indexOf('🌙') >= 0) ||
            (currentLang === 'typescript' && t.indexOf('🔷') >= 0))
            btn.classList.add('active');
    });
    document.getElementById('progressLang').textContent = lessons[currentLang].name;
    renderTopicNav(); renderLesson(); updateProgress();
})();
