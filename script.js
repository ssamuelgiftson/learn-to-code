// =============================================
//  SECTION 1: STATE MANAGEMENT
// =============================================
var currentLang = 'python';
var currentTopic = 0;
var activeTimers = {};
var completionState = {};
var previewVisible = false;
var previewTimer = null;

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

// =============================================
//  SECTION 2: HELPER — BUILD LESSON HTML
// =============================================
function buildLesson(title, subtitle, body) {
    return '<h2>' + title + '</h2><p class="subtitle">' + subtitle + '</p>' + body;
}

function buildCode(code, copyable) {
    var btn = copyable !== false ? '<button class="copy-btn" onclick="copyCode(this)">📋 Copy</button>' : '';
    return '<div class="code-container">' + btn + '<div class="code-block">' + code + '</div></div>';
}

function buildOutput(text) {
    return '<div class="output-box">' + text + '</div>';
}

function buildHow(text) {
    return '<div class="how-it-works">' + text + '</div>';
}

function buildTip(text) {
    return '<div class="tip-box">' + text + '</div>';
}

// Shorthand for syntax coloring in lesson code blocks
function kw(t) { return '<span class="keyword">' + t + '</span>'; }
function fn(t) { return '<span class="function">' + t + '</span>'; }
function st(t) { return '<span class="string">' + t + '</span>'; }
function nm(t) { return '<span class="number">' + t + '</span>'; }
function cm(t) { return '<span class="comment">' + t + '</span>'; }
function tp(t) { return '<span class="type">' + t + '</span>'; }
function op(t) { return '<span class="operator">' + t + '</span>'; }

// =============================================
//  SECTION 3: LESSON DATA — ALL LANGUAGES
// =============================================
var lessons = {

// ============ PYTHON ============
python: {
    name: "Python", icon: "🐍",
    topics: [
        {
            title: "Introduction to Python", readTime: 45,
            concepts: ["Python is a programming language", "print() displays output", "Code runs top to bottom", "# starts a comment"],
            gateQuiz: { question: "What does print() do?", options: ["Sends to printer", "Displays output on screen", "Creates variable", "Deletes code"], correct: 1, explanation: "print() displays text on screen." },
            content: buildLesson('🐍 Introduction to Python', 'What is Python?',
                '<p>Python was created by <strong>Guido van Rossum</strong> in 1991.</p>' +
                '<h3>Why Python?</h3><ul><li>Easy to read</li><li>Used in AI, web, data science</li><li>Huge community</li></ul>' +
                '<h3>First Program</h3>' +
                buildCode(cm('# My first program') + '\n' + fn('print') + '(' + st('"Hello, World!"') + ')\n' + fn('print') + '(' + st('"I am Samuel!"') + ')') +
                buildOutput('Hello, World!\nI am Samuel!') +
                buildHow('<code>print()</code> displays text. <code>#</code> starts a comment.') +
                buildTip('Python uses 4 spaces for indentation — it\'s part of the syntax!'))
        },
        {
            title: "Variables & Data Types", readTime: 60,
            concepts: ["Variables store data", "4 types: str, int, float, bool", "type() checks type", "Names are case-sensitive"],
            gateQuiz: { question: "What type is True/False?", options: ["String", "Integer", "Float", "Boolean"], correct: 3, explanation: "Boolean stores True or False." },
            content: buildLesson('📦 Variables & Data Types', 'Storing data',
                buildCode('name = ' + st('"Samuel"') + '  ' + cm('# String') + '\nage = ' + nm('13') + '       ' + cm('# Integer') + '\nheight = ' + nm('5.4') + '   ' + cm('# Float') + '\nis_student = ' + kw('True') + '  ' + cm('# Boolean') + '\n\n' + fn('print') + '(' + st('"Name:"') + ', name)\n' + fn('print') + '(' + fn('type') + '(age))') +
                buildOutput('Name: Samuel\n<class \'int\'>') +
                buildHow('<code>=</code> assigns values. <code>type()</code> shows the data type.') +
                buildTip('Use descriptive names like <code>student_age</code> not <code>x</code>.'))
        },
        {
            title: "Operators & Math", readTime: 50,
            concepts: ["7 operators: + - * / // % **", "/ gives decimals, // removes them", "% gives remainder", "== compares values"],
            gateQuiz: { question: "What is 17 % 5?", options: ["3.4", "3", "2", "5"], correct: 2, explanation: "17÷5 = 3 remainder 2." },
            content: buildLesson('🔢 Operators & Math', 'Calculations',
                buildCode('a = ' + nm('15') + '\nb = ' + nm('4') + '\n' + fn('print') + '(a + b)   ' + cm('# 19') + '\n' + fn('print') + '(a / b)   ' + cm('# 3.75') + '\n' + fn('print') + '(a // b)  ' + cm('# 3') + '\n' + fn('print') + '(a % b)   ' + cm('# 3') + '\n' + fn('print') + '(a ** b)  ' + cm('# 50625')) +
                buildOutput('19\n3.75\n3\n3\n50625') +
                buildHow('<code>//</code> floor division. <code>%</code> remainder. <code>**</code> power.'))
        },
        {
            title: "If-Else Conditions", readTime: 55,
            concepts: ["if, elif, else keywords", "Checks top to bottom", "Indentation matters", "Colon after conditions"],
            gateQuiz: { question: "marks=75. What prints?\nif marks>=90: 'A'\nelif marks>=70: 'C'\nelse: 'D'", options: ["A", "B", "C", "D"], correct: 2, explanation: "75>=90 False, 75>=70 True → C" },
            content: buildLesson('🔀 If-Else Conditions', 'Decision making',
                buildCode('marks = ' + nm('85') + '\n\n' + kw('if') + ' marks >= ' + nm('90') + ':\n    ' + fn('print') + '(' + st('"A+"') + ')\n' + kw('elif') + ' marks >= ' + nm('80') + ':\n    ' + fn('print') + '(' + st('"A"') + ')\n' + kw('else') + ':\n    ' + fn('print') + '(' + st('"Try harder"') + ')') +
                buildOutput('A') +
                buildHow('First true condition runs, rest skipped. <code>elif</code> = else if.'))
        },
        {
            title: "Loops", readTime: 60,
            concepts: ["for iterates sequences", "range(start, stop)", "while runs until False", "Avoid infinite loops"],
            gateQuiz: { question: "range(1,5) gives?", options: ["1,2,3,4,5", "1,2,3,4", "0,1,2,3,4", "0,1,2,3,4,5"], correct: 1, explanation: "Starts at 1, stops BEFORE 5." },
            content: buildLesson('🔄 Loops', 'Repeating actions',
                buildCode(kw('for') + ' i ' + kw('in') + ' ' + fn('range') + '(' + nm('1') + ', ' + nm('6') + '):\n    ' + fn('print') + '(i)\n\ncount = ' + nm('3') + '\n' + kw('while') + ' count > ' + nm('0') + ':\n    ' + fn('print') + '(count)\n    count -= ' + nm('1')) +
                buildOutput('1\n2\n3\n4\n5\n3\n2\n1') +
                buildHow('<code>for</code>: fixed iterations. <code>while</code>: runs until condition is False.'))
        },
        {
            title: "Functions", readTime: 55,
            concepts: ["def creates functions", "Parameters are inputs", "return sends values back", "Functions avoid repetition"],
            gateQuiz: { question: "What sends a value back?", options: ["send", "output", "return", "give"], correct: 2, explanation: "return sends values back." },
            content: buildLesson('🧩 Functions', 'Reusable code',
                buildCode(kw('def') + ' ' + fn('greet') + '(name):\n    ' + fn('print') + '(' + st('"Hello"') + ', name)\n\n' + fn('greet') + '(' + st('"Samuel"') + ')\n\n' + kw('def') + ' ' + fn('add') + '(a, b):\n    ' + kw('return') + ' a + b\n\nresult = ' + fn('add') + '(' + nm('10') + ', ' + nm('20') + ')\n' + fn('print') + '(result)') +
                buildOutput('Hello Samuel\n30') +
                buildHow('<code>def</code> defines a function. <code>return</code> sends a value back.'))
        },
        {
            title: "Lists", readTime: 55,
            concepts: ["Lists store ordered items", "Index starts at 0", "append() adds items", "len() gets length"],
            gateQuiz: { question: "First index in a list?", options: ["1", "0", "-1", "First"], correct: 1, explanation: "Python lists start at index 0." },
            content: buildLesson('📋 Lists', 'Ordered collections',
                buildCode('fruits = [' + st('"apple"') + ', ' + st('"banana"') + ', ' + st('"cherry"') + ']\n' + fn('print') + '(fruits[' + nm('0') + '])  ' + cm('# apple') + '\n\nfruits.' + fn('append') + '(' + st('"mango"') + ')\n' + fn('print') + '(' + fn('len') + '(fruits))  ' + cm('# 4') + '\n\n' + kw('for') + ' f ' + kw('in') + ' fruits:\n    ' + fn('print') + '(f)') +
                buildOutput('apple\n4\napple\nbanana\ncherry\nmango') +
                buildHow('Lists use <code>[]</code>. Access by index starting at 0. <code>append()</code> adds to end.'))
        },
        {
            title: "Dictionaries", readTime: 50,
            concepts: ["Key-value pairs", "Use {} curly braces", "Access by key name", "Can store any type"],
            gateQuiz: { question: "How to access dict value?", options: ["dict(key)", "dict.key", "dict[key]", "dict->key"], correct: 2, explanation: "Use square brackets with the key." },
            content: buildLesson('📖 Dictionaries', 'Key-value storage',
                buildCode('student = {\n    ' + st('"name"') + ': ' + st('"Samuel"') + ',\n    ' + st('"age"') + ': ' + nm('13') + ',\n    ' + st('"grade"') + ': ' + nm('8') + '\n}\n\n' + fn('print') + '(student[' + st('"name"') + '])\nstudent[' + st('"hobby"') + '] = ' + st('"Coding"') + '\n' + fn('print') + '(student)') +
                buildOutput('Samuel\n{\'name\': \'Samuel\', \'age\': 13, \'grade\': 8, \'hobby\': \'Coding\'}') +
                buildHow('Dictionaries store key-value pairs like a real dictionary.'))
        },
        {
            title: "String Methods", readTime: 45,
            concepts: ["Strings are immutable", "upper() and lower()", "split() breaks strings", "f-strings for formatting"],
            gateQuiz: { question: "What does .upper() do?", options: ["Makes lowercase", "Makes UPPERCASE", "Reverses", "Splits"], correct: 1, explanation: ".upper() converts all characters to uppercase." },
            content: buildLesson('🔤 String Methods', 'Working with text',
                buildCode('name = ' + st('"Samuel Giftson"') + '\n' + fn('print') + '(name.' + fn('upper') + '())\n' + fn('print') + '(name.' + fn('lower') + '())\n' + fn('print') + '(name.' + fn('split') + '())\n\nage = ' + nm('13') + '\n' + fn('print') + '(' + st('f"I am {name}, age {age}"') + ')') +
                buildOutput('SAMUEL GIFTSON\nsamuel giftson\n[\'Samuel\', \'Giftson\']\nI am Samuel Giftson, age 13') +
                buildHow('Strings have built-in methods. f-strings let you embed variables inside strings.'))
        },
        {
            title: "File Handling", readTime: 50,
            concepts: ["open() opens files", "read() reads content", "write() writes content", "with statement auto-closes"],
            gateQuiz: { question: "What does 'w' mode do?", options: ["Reads file", "Writes (overwrites)", "Appends", "Deletes"], correct: 1, explanation: "'w' mode writes to a file, overwriting existing content." },
            content: buildLesson('📂 File Handling', 'Reading and writing files',
                buildCode(cm('# Writing to a file') + '\n' + kw('with') + ' ' + fn('open') + '(' + st('"test.txt"') + ', ' + st('"w"') + ') ' + kw('as') + ' f:\n    f.' + fn('write') + '(' + st('"Hello Samuel!"') + ')\n\n' + cm('# Reading from a file') + '\n' + kw('with') + ' ' + fn('open') + '(' + st('"test.txt"') + ', ' + st('"r"') + ') ' + kw('as') + ' f:\n    content = f.' + fn('read') + '()\n    ' + fn('print') + '(content)') +
                buildOutput('Hello Samuel!') +
                buildHow('<code>with</code> auto-closes the file. <code>"w"</code>=write, <code>"r"</code>=read, <code>"a"</code>=append.'))
        }
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

// ============ JAVASCRIPT ============
javascript: {
    name: "JavaScript", icon: "⚡",
    topics: [
        {
            title: "Introduction to JS", readTime: 45,
            concepts: ["JS runs in browsers", "console.log() prints", "Semicolons end statements", "F12 opens console"],
            gateQuiz: { question: "Where does console.log() show?", options: ["Webpage", "Dev console (F12)", "Popup", "File"], correct: 1, explanation: "console.log() outputs to F12 console." },
            content: buildLesson('⚡ Introduction to JavaScript', 'Language of the web',
                '<p>JavaScript makes websites interactive!</p>' +
                buildCode(cm('// Print to console') + '\n' + fn('console') + '.' + fn('log') + '(' + st('"Hello, World!"') + ');\n' + fn('console') + '.' + fn('log') + '(' + st('"I am Samuel"') + ');') +
                buildOutput('Hello, World!\nI am Samuel') +
                buildHow('<code>console.log()</code> prints to browser console. Statements end with <code>;</code>.'))
        },
        {
            title: "Variables & Types", readTime: 50,
            concepts: ["let vs const vs var", "const can't change", "typeof checks type", "One number type"],
            gateQuiz: { question: "Unchangeable variable?", options: ["let", "var", "const", "static"], correct: 2, explanation: "const creates constants." },
            content: buildLesson('📦 Variables', 'Storing data',
                buildCode(kw('let') + ' age = ' + nm('13') + ';\nage = ' + nm('14') + ';  ' + cm('// ✅ Works') + '\n\n' + kw('const') + ' name = ' + st('"Samuel"') + ';\n' + cm('// name = "X"; ❌ ERROR!') + '\n\n' + fn('console') + '.' + fn('log') + '(' + kw('typeof') + ' age);   ' + cm('// "number"') + '\n' + fn('console') + '.' + fn('log') + '(' + kw('typeof') + ' name);  ' + cm('// "string"')) +
                buildHow('<code>let</code> for changing values. <code>const</code> for constants.'))
        },
        {
            title: "Conditions", readTime: 50,
            concepts: ["if/else uses {}", "=== checks value AND type", "Ternary operator", "switch for multiple cases"],
            gateQuiz: { question: "=== checks?", options: ["Only value", "Only type", "Value AND type", "Assignment"], correct: 2, explanation: "=== checks both." },
            content: buildLesson('🔀 Conditions', 'Decision making',
                buildCode(kw('let') + ' marks = ' + nm('85') + ';\n\n' + kw('if') + ' (marks >= ' + nm('90') + ') {\n    ' + fn('console') + '.' + fn('log') + '(' + st('"A+"') + ');\n} ' + kw('else if') + ' (marks >= ' + nm('80') + ') {\n    ' + fn('console') + '.' + fn('log') + '(' + st('"A"') + ');\n} ' + kw('else') + ' {\n    ' + fn('console') + '.' + fn('log') + '(' + st('"Keep going!"') + ');\n}\n\n' + cm('// Ternary') + '\n' + kw('let') + ' result = marks >= ' + nm('60') + ' ? ' + st('"Pass"') + ' : ' + st('"Fail"') + ';') +
                buildOutput('A') +
                buildHow('Use <code>{}</code> for blocks. <code>===</code> is strict equality. Ternary is a short if-else.'))
        },
        {
            title: "Loops", readTime: 50,
            concepts: ["for(init;cond;update)", "while loop", "for...of for arrays", "break and continue"],
            gateQuiz: { question: "i++ means?", options: ["i = i - 1", "i = i + 1", "i = i * 2", "i = 0"], correct: 1, explanation: "i++ is shorthand for i = i + 1." },
            content: buildLesson('🔄 Loops', 'Repeating code',
                buildCode(kw('for') + ' (' + kw('let') + ' i = ' + nm('1') + '; i <= ' + nm('5') + '; i++) {\n    ' + fn('console') + '.' + fn('log') + '(i);\n}\n\n' + kw('const') + ' fruits = [' + st('"apple"') + ', ' + st('"banana"') + '];\n' + kw('for') + ' (' + kw('let') + ' f ' + kw('of') + ' fruits) {\n    ' + fn('console') + '.' + fn('log') + '(f);\n}') +
                buildOutput('1\n2\n3\n4\n5\napple\nbanana') +
                buildHow('For loop: start, condition, increment. <code>for...of</code> loops arrays.'))
        },
        {
            title: "Functions", readTime: 50,
            concepts: ["function keyword", "Arrow functions =>", "return sends back", "Default parameters"],
            gateQuiz: { question: "Valid arrow function?", options: ["function(a)=>a+1", "(a)=>a+1", "arrow(a){a+1}", "=>(a)a+1"], correct: 1, explanation: "(params) => expression" },
            content: buildLesson('🧩 Functions', 'Reusable code',
                buildCode(kw('function') + ' ' + fn('greet') + '(name) {\n    ' + kw('return') + ' ' + st('"Hello, "') + ' + name;\n}\n\n' + kw('const') + ' ' + fn('add') + ' = (a, b) => a + b;\n\n' + fn('console') + '.' + fn('log') + '(' + fn('greet') + '(' + st('"Samuel"') + '));\n' + fn('console') + '.' + fn('log') + '(' + fn('add') + '(' + nm('10') + ', ' + nm('20') + '));') +
                buildOutput('Hello, Samuel\n30') +
                buildHow('Arrow functions <code>=></code> are shorter. One expression skips <code>{}</code> and <code>return</code>.'))
        },
        {
            title: "Arrays", readTime: 50,
            concepts: ["Arrays store lists", "push() adds items", "map() transforms", "filter() selects"],
            gateQuiz: { question: "Add to array end?", options: [".add()", ".push()", ".append()", ".insert()"], correct: 1, explanation: ".push() adds to the end of an array." },
            content: buildLesson('📋 Arrays', 'Ordered lists',
                buildCode(kw('const') + ' nums = [' + nm('1') + ', ' + nm('2') + ', ' + nm('3') + '];\nnums.' + fn('push') + '(' + nm('4') + ');\n\n' + kw('const') + ' doubled = nums.' + fn('map') + '(n => n * ' + nm('2') + ');\n' + fn('console') + '.' + fn('log') + '(doubled);\n\n' + kw('const') + ' evens = nums.' + fn('filter') + '(n => n % ' + nm('2') + ' === ' + nm('0') + ');\n' + fn('console') + '.' + fn('log') + '(evens);') +
                buildOutput('[2, 4, 6, 8]\n[2, 4]') +
                buildHow('<code>map()</code> transforms each item. <code>filter()</code> keeps items that match.'))
        },
        {
            title: "Objects", readTime: 50,
            concepts: ["Key-value pairs", "Dot notation access", "Methods in objects", "Destructuring"],
            gateQuiz: { question: "Access object property?", options: ["obj(key)", "obj.key", "obj->key", "obj::key"], correct: 1, explanation: "Use dot notation: obj.key" },
            content: buildLesson('🏗️ Objects', 'Structured data',
                buildCode(kw('const') + ' student = {\n    name: ' + st('"Samuel"') + ',\n    age: ' + nm('13') + ',\n    greet() {\n        ' + fn('console') + '.' + fn('log') + '(' + st('`Hi, I\'m ${this.name}`') + ');\n    }\n};\n\n' + fn('console') + '.' + fn('log') + '(student.name);\nstudent.greet();') +
                buildOutput('Samuel\nHi, I\'m Samuel') +
                buildHow('Objects group related data. Methods are functions inside objects.'))
        },
        {
            title: "DOM Manipulation", readTime: 55,
            concepts: ["document.querySelector()", "innerHTML changes content", "addEventListener handles events", "classList toggles styles"],
            gateQuiz: { question: "What selects an element?", options: ["getElement()", "querySelector()", "findElement()", "selectNode()"], correct: 1, explanation: "querySelector() selects DOM elements with CSS selectors." },
            content: buildLesson('🌐 DOM Manipulation', 'Changing web pages',
                buildCode(cm('// Select an element') + '\n' + kw('const') + ' heading = ' + fn('document') + '.' + fn('querySelector') + '(' + st('"h1"') + ');\n\n' + cm('// Change its text') + '\nheading.innerHTML = ' + st('"New Title!"') + ';\n\n' + cm('// Add click event') + '\nheading.' + fn('addEventListener') + '(' + st('"click"') + ', ' + kw('function') + '() {\n    ' + fn('alert') + '(' + st('"You clicked!"') + ');\n});') +
                buildHow('<code>querySelector()</code> finds elements. <code>innerHTML</code> changes content. <code>addEventListener()</code> handles events.'))
        }
    ],
    quiz: [
        { question: "Unchangeable variable?", options: ["let", "var", "const", "fixed"], correct: 2 },
        { question: "typeof 42?", options: ['"integer"', '"number"', '"float"', '"num"'], correct: 1 },
        { question: "Arrow function?", options: ["function(){}", "def f():", "(a)=>a+1", "func(a)"], correct: 2 },
        { question: "Add to array end?", options: [".add()", ".push()", ".append()", ".put()"], correct: 1 }
    ]
},

// ============ HTML & CSS (Website Making) ============
html: {
    name: "HTML & CSS", icon: "🌐",
    topics: [
        {
            title: "HTML Basics", readTime: 45,
            concepts: ["HTML uses tags", "Tags have open/close pairs", "head vs body", "Common tags: h1, p, a, img"],
            gateQuiz: { question: "HTML stands for?", options: ["Hyper Text Making Language", "HyperText Markup Language", "Home Tool ML", "Hyper Transfer ML"], correct: 1, explanation: "HyperText Markup Language" },
            content: buildLesson('🌐 HTML Basics', 'Structure of websites',
                buildCode(op('&lt;!DOCTYPE html&gt;') + '\n' + op('&lt;html&gt;') + '\n' + op('&lt;head&gt;') + '\n    ' + op('&lt;title&gt;') + 'My Site' + op('&lt;/title&gt;') + '\n' + op('&lt;/head&gt;') + '\n' + op('&lt;body&gt;') + '\n    ' + op('&lt;h1&gt;') + 'Hello!' + op('&lt;/h1&gt;') + '\n    ' + op('&lt;p&gt;') + 'Welcome.' + op('&lt;/p&gt;') + '\n' + op('&lt;/body&gt;') + '\n' + op('&lt;/html&gt;')) +
                buildHow('Tags come in pairs. <code>&lt;head&gt;</code> = metadata. <code>&lt;body&gt;</code> = visible content.'))
        },
        {
            title: "Text & Links", readTime: 40,
            concepts: ["h1-h6 for headings", "p for paragraphs", "a for links", "strong and em for emphasis"],
            gateQuiz: { question: "Which makes bold text?", options: ["<b> or <strong>", "<bold>", "<heavy>", "<em>"], correct: 0, explanation: "<strong> makes text bold with semantic meaning." },
            content: buildLesson('📝 Text & Links', 'Content elements',
                buildCode(op('&lt;h1&gt;') + 'Main Title' + op('&lt;/h1&gt;') + '\n' + op('&lt;h2&gt;') + 'Subtitle' + op('&lt;/h2&gt;') + '\n' + op('&lt;p&gt;') + 'This is a paragraph.' + op('&lt;/p&gt;') + '\n' + op('&lt;strong&gt;') + 'Bold' + op('&lt;/strong&gt;') + '\n' + op('&lt;em&gt;') + 'Italic' + op('&lt;/em&gt;') + '\n' + op('&lt;a href="https://google.com"&gt;') + 'Google' + op('&lt;/a&gt;')) +
                buildHow('Headings go from <code>h1</code> (biggest) to <code>h6</code> (smallest). <code>a</code> creates clickable links.'))
        },
        {
            title: "CSS Basics", readTime: 50,
            concepts: ["CSS styles HTML", "Selectors target elements", "Properties change appearance", "Classes use .className"],
            gateQuiz: { question: "CSS property for text color?", options: ["text-color", "font-color", "color", "text-style"], correct: 2, explanation: "The color property changes text color." },
            content: buildLesson('🎨 CSS Basics', 'Making HTML beautiful',
                buildCode(op('&lt;style&gt;') + '\n  body {\n    background: ' + st('#1a1a2e') + ';\n    color: ' + st('white') + ';\n  }\n  h1 {\n    color: ' + st('#667eea') + ';\n    text-align: ' + st('center') + ';\n  }\n  .card {\n    background: ' + st('#12122a') + ';\n    padding: ' + st('20px') + ';\n    border-radius: ' + st('10px') + ';\n  }\n' + op('&lt;/style&gt;')) +
                buildHow('CSS uses selectors + properties. Tags directly, <code>.class</code> with dots, <code>#id</code> with hash.'))
        },
        {
            title: "Flexbox Layout", readTime: 50,
            concepts: ["display: flex", "justify-content aligns horizontally", "align-items aligns vertically", "gap adds spacing"],
            gateQuiz: { question: "What enables flexbox?", options: ["display: block", "display: flex", "display: grid", "display: inline"], correct: 1, explanation: "display: flex turns a container into a flex container." },
            content: buildLesson('📐 Flexbox', 'Modern layout',
                buildCode('.container {\n    display: ' + st('flex') + ';\n    justify-content: ' + st('center') + ';\n    align-items: ' + st('center') + ';\n    gap: ' + st('20px') + ';\n}\n.box {\n    padding: ' + st('20px') + ';\n    background: ' + st('#667eea') + ';\n    border-radius: ' + st('8px') + ';\n}') +
                buildHow('<code>flex</code> arranges items in rows/columns. <code>justify-content</code> = horizontal. <code>align-items</code> = vertical.'))
        },
        {
            title: "Forms & Input", readTime: 45,
            concepts: ["form collects data", "input types vary", "label describes inputs", "button submits"],
            gateQuiz: { question: "Which creates a text input?", options: ['<text>', '<input type="text">', '<textbox>', '<field>'], correct: 1, explanation: 'input with type="text" creates a text field.' },
            content: buildLesson('📝 Forms', 'Collecting user data',
                buildCode(op('&lt;form&gt;') + '\n  ' + op('&lt;label&gt;') + 'Name:' + op('&lt;/label&gt;') + '\n  ' + op('&lt;input type="text" placeholder="Your name"&gt;') + '\n\n  ' + op('&lt;label&gt;') + 'Email:' + op('&lt;/label&gt;') + '\n  ' + op('&lt;input type="email"&gt;') + '\n\n  ' + op('&lt;button type="submit"&gt;') + 'Send' + op('&lt;/button&gt;') + '\n' + op('&lt;/form&gt;')) +
                buildHow('Different <code>type</code> attributes create different inputs: text, email, number, checkbox, etc.'))
        },
        {
            title: "CSS Grid", readTime: 50,
            concepts: ["display: grid", "grid-template-columns", "grid-gap for spacing", "span for merging cells"],
            gateQuiz: { question: "What creates a 3-column grid?", options: ["columns: 3", "grid-template-columns: 1fr 1fr 1fr", "display: 3-grid", "grid: 3"], correct: 1, explanation: "grid-template-columns defines column sizes." },
            content: buildLesson('🔲 CSS Grid', 'Two-dimensional layouts',
                buildCode('.grid {\n    display: ' + st('grid') + ';\n    grid-template-columns: ' + st('1fr 1fr 1fr') + ';\n    gap: ' + st('15px') + ';\n}\n.item {\n    background: ' + st('#667eea') + ';\n    padding: ' + st('20px') + ';\n    text-align: ' + st('center') + ';\n}') +
                buildHow('Grid creates 2D layouts. <code>1fr</code> means 1 fraction of available space. <code>gap</code> adds spacing.'))
        }
    ],
    quiz: [
        { question: "HTML stands for?", options: ["Hyper Text Making Lang", "HyperText Markup Language", "Home Tool ML", "Hyper Transfer ML"], correct: 1 },
        { question: "CSS property for text color?", options: ["text-color", "font-color", "color", "text-style"], correct: 2 },
        { question: "Select class in CSS?", options: ["#class", ".class", "class", "*class"], correct: 1 }
    ]
},

// ============ JAVA ============
java: {
    name: "Java", icon: "☕",
    topics: [
        {
            title: "Introduction to Java", readTime: 50,
            concepts: ["Java needs a class", "main() is entry point", "println() prints", "Filename = class name"],
            gateQuiz: { question: "Java entry point?", options: ["start()", "main()", "run()", "begin()"], correct: 1, explanation: "main() starts Java programs." },
            content: buildLesson('☕ Introduction to Java', 'Write once, run anywhere',
                buildCode(kw('public class') + ' ' + tp('Main') + ' {\n    ' + kw('public static void') + ' ' + fn('main') + '(' + tp('String') + '[] args) {\n        System.out.' + fn('println') + '(' + st('"Hello, World!"') + ');\n    }\n}') +
                buildOutput('Hello, World!') +
                buildHow('Every Java program lives in a <code>class</code>. <code>main()</code> is the starting point.'))
        },
        {
            title: "Variables & Types", readTime: 50,
            concepts: ["Must declare types", "int, double, String, boolean", "String uses capital S", "Strictly typed"],
            gateQuiz: { question: "Decimal numbers?", options: ["int", "String", "double", "boolean"], correct: 2, explanation: "double stores decimals." },
            content: buildLesson('📦 Java Variables', 'Typed variables',
                buildCode(tp('int') + ' age = ' + nm('13') + ';\n' + tp('double') + ' height = ' + nm('5.4') + ';\n' + tp('String') + ' name = ' + st('"Samuel"') + ';\n' + tp('boolean') + ' student = ' + kw('true') + ';\n\nSystem.out.' + fn('println') + '(' + st('"Name: "') + ' + name);\nSystem.out.' + fn('println') + '(' + st('"Age: "') + ' + age);') +
                buildOutput('Name: Samuel\nAge: 13') +
                buildHow('Java requires type declarations. <code>int</code>=whole, <code>double</code>=decimal, <code>String</code>=text.'))
        },
        {
            title: "Conditions & Loops", readTime: 55,
            concepts: ["if/else like JavaScript", "for loop syntax", "Enhanced for loop", "switch statement"],
            gateQuiz: { question: "Enhanced for loop?", options: ["for(i=0;i<5;i++)", "for(item : array)", "while(true)", "foreach(item)"], correct: 1, explanation: "for(Type item : array) iterates through arrays." },
            content: buildLesson('🔄 Conditions & Loops', 'Control flow',
                buildCode(tp('int') + ' marks = ' + nm('85') + ';\n' + kw('if') + ' (marks >= ' + nm('90') + ') {\n    System.out.' + fn('println') + '(' + st('"A+"') + ');\n} ' + kw('else if') + ' (marks >= ' + nm('80') + ') {\n    System.out.' + fn('println') + '(' + st('"A"') + ');\n}\n\n' + tp('String') + '[] subjects = {' + st('"Math"') + ', ' + st('"Science"') + '};\n' + kw('for') + ' (' + tp('String') + ' s : subjects) {\n    System.out.' + fn('println') + '(s);\n}') +
                buildOutput('A\nMath\nScience') +
                buildHow('Java conditions use <code>()</code> and <code>{}</code>. Enhanced for loop: <code>for(Type item : array)</code>.'))
        },
        {
            title: "Methods", readTime: 50,
            concepts: ["Methods are Java functions", "Must specify return type", "static for class methods", "void means no return"],
            gateQuiz: { question: "void means?", options: ["Returns int", "Returns nothing", "Returns String", "Error"], correct: 1, explanation: "void means the method doesn't return a value." },
            content: buildLesson('🧩 Methods', 'Reusable code in Java',
                buildCode(kw('static void') + ' ' + fn('greet') + '(' + tp('String') + ' name) {\n    System.out.' + fn('println') + '(' + st('"Hello, "') + ' + name);\n}\n\n' + kw('static') + ' ' + tp('int') + ' ' + fn('add') + '(' + tp('int') + ' a, ' + tp('int') + ' b) {\n    ' + kw('return') + ' a + b;\n}\n\n' + cm('// In main():') + '\n' + fn('greet') + '(' + st('"Samuel"') + ');\nSystem.out.' + fn('println') + '(' + fn('add') + '(' + nm('10') + ', ' + nm('20') + '));') +
                buildOutput('Hello, Samuel\n30') +
                buildHow('Specify return type before method name. <code>void</code>=no return. <code>static</code>=belongs to class.'))
        }
    ],
    quiz: [
        { question: "Java entry point?", options: ["start()", "main()", "run()", "init()"], correct: 1 },
        { question: "Decimal type?", options: ["int", "String", "double", "boolean"], correct: 2 },
        { question: "void means?", options: ["Returns int", "Returns nothing", "Returns String", "Error"], correct: 1 }
    ]
},

// ============ C LANGUAGE ============
c: {
    name: "C Language", icon: "⚙️",
    topics: [
        {
            title: "Introduction to C", readTime: 50,
            concepts: ["#include brings libraries", "main() starts program", "printf() prints", "\\n = new line"],
            gateQuiz: { question: "#include <stdio.h> does?", options: ["Creates variable", "Includes I/O library", "Starts program", "Defines function"], correct: 1, explanation: "stdio.h provides printf() and scanf()." },
            content: buildLesson('⚙️ Introduction to C', 'Mother of all languages',
                buildCode(kw('#include') + ' ' + st('&lt;stdio.h&gt;') + '\n\n' + tp('int') + ' ' + fn('main') + '() {\n    ' + fn('printf') + '(' + st('"Hello, World!\\n"') + ');\n    ' + kw('return') + ' ' + nm('0') + ';\n}') +
                buildOutput('Hello, World!') +
                buildHow('<code>#include</code> loads libraries. <code>printf()</code> prints. <code>\\n</code> = new line.'))
        },
        {
            title: "Variables & Types", readTime: 50,
            concepts: ["int, float, double, char", "Format specifiers: %d %f %s", "Must declare types", "Arrays use []"],
            gateQuiz: { question: "%d prints?", options: ["String", "Float", "Integer", "Character"], correct: 2, explanation: "%d is the format specifier for integers." },
            content: buildLesson('📦 C Variables', 'Typed data',
                buildCode(tp('int') + ' age = ' + nm('13') + ';\n' + tp('float') + ' height = ' + nm('5.4') + ';\n' + tp('char') + ' grade = ' + st("'A'") + ';\n' + tp('char') + ' name[] = ' + st('"Samuel"') + ';\n\n' + fn('printf') + '(' + st('"Name: %s\\n"') + ', name);\n' + fn('printf') + '(' + st('"Age: %d\\n"') + ', age);\n' + fn('printf') + '(' + st('"Height: %.1f\\n"') + ', height);') +
                buildOutput('Name: Samuel\nAge: 13\nHeight: 5.4') +
                buildHow('<code>%d</code>=int, <code>%f</code>=float, <code>%s</code>=string, <code>%c</code>=char.'))
        },
        {
            title: "Control Flow", readTime: 50,
            concepts: ["if/else like Java", "for loop syntax", "while and do-while", "switch statement"],
            gateQuiz: { question: "do-while runs at least?", options: ["Zero times", "Once", "Twice", "Infinite"], correct: 1, explanation: "do-while always runs the body at least once before checking." },
            content: buildLesson('🔄 Control Flow', 'Conditions and loops',
                buildCode(kw('for') + ' (' + tp('int') + ' i = ' + nm('1') + '; i <= ' + nm('5') + '; i++) {\n    ' + fn('printf') + '(' + st('"%d\\n"') + ', i);\n}\n\n' + tp('int') + ' count = ' + nm('3') + ';\n' + kw('do') + ' {\n    ' + fn('printf') + '(' + st('"Count: %d\\n"') + ', count);\n    count--;\n} ' + kw('while') + ' (count > ' + nm('0') + ');') +
                buildOutput('1\n2\n3\n4\n5\nCount: 3\nCount: 2\nCount: 1') +
                buildHow('<code>do-while</code> runs body first, then checks condition. Always runs at least once!'))
        },
        {
            title: "Functions", readTime: 50,
            concepts: ["Return type required", "Prototypes declare first", "Pass by value", "void for no return"],
            gateQuiz: { question: "return 0 in main() means?", options: ["Error", "Restart", "Success", "Zero output"], correct: 2, explanation: "return 0 means the program finished successfully." },
            content: buildLesson('🧩 C Functions', 'Modular code',
                buildCode(tp('int') + ' ' + fn('add') + '(' + tp('int') + ' a, ' + tp('int') + ' b) {\n    ' + kw('return') + ' a + b;\n}\n\n' + tp('void') + ' ' + fn('greet') + '(' + tp('char') + ' name[]) {\n    ' + fn('printf') + '(' + st('"Hello, %s!\\n"') + ', name);\n}\n\n' + tp('int') + ' ' + fn('main') + '() {\n    ' + fn('greet') + '(' + st('"Samuel"') + ');\n    ' + fn('printf') + '(' + st('"Sum: %d\\n"') + ', ' + fn('add') + '(' + nm('10') + ', ' + nm('20') + '));\n    ' + kw('return') + ' ' + nm('0') + ';\n}') +
                buildOutput('Hello, Samuel!\nSum: 30') +
                buildHow('C requires return type and parameter types. <code>void</code>=no return value.'))
        }
    ],
    quiz: [
        { question: "Header for printf()?", options: ["stdlib.h", "stdio.h", "string.h", "math.h"], correct: 1 },
        { question: "%d prints?", options: ["String", "Float", "Integer", "Char"], correct: 2 },
        { question: "return 0 means?", options: ["Error", "Restart", "Success", "Nothing"], correct: 2 }
    ]
},

// ============ TYPESCRIPT (Web Making) ============
typescript: {
    name: "TypeScript", icon: "🔷",
    topics: [
        {
            title: "Intro to TypeScript", readTime: 45,
            concepts: ["TypeScript adds types to JS", "Compiles to JavaScript", "Catches errors early", "Used in big projects"],
            gateQuiz: { question: "TypeScript compiles to?", options: ["Python", "Java", "JavaScript", "C++"], correct: 2, explanation: "TypeScript compiles to JavaScript for browsers." },
            content: buildLesson('🔷 Introduction to TypeScript', 'JavaScript with superpowers',
                '<p>TypeScript is JavaScript + types. It catches bugs before you run code!</p>' +
                buildCode(kw('let') + ' name: ' + tp('string') + ' = ' + st('"Samuel"') + ';\n' + kw('let') + ' age: ' + tp('number') + ' = ' + nm('13') + ';\n' + kw('let') + ' student: ' + tp('boolean') + ' = ' + kw('true') + ';\n\n' + fn('console') + '.' + fn('log') + '(name, age, student);') +
                buildOutput('Samuel 13 true') +
                buildHow('Add <code>: type</code> after variable names. TypeScript checks types at compile time.'))
        },
        {
            title: "Functions with Types", readTime: 50,
            concepts: ["Parameter types", "Return types", "Optional parameters", "Interfaces"],
            gateQuiz: { question: "How to type a parameter?", options: ["name(string)", "(name: string)", "(string name)", "name = string"], correct: 1, explanation: "Use colon syntax: (param: type)" },
            content: buildLesson('🧩 Typed Functions', 'Safe functions',
                buildCode(kw('function') + ' ' + fn('greet') + '(name: ' + tp('string') + '): ' + tp('string') + ' {\n    ' + kw('return') + ' ' + st('`Hello, ${name}!`') + ';\n}\n\n' + kw('const') + ' ' + fn('add') + ' = (a: ' + tp('number') + ', b: ' + tp('number') + '): ' + tp('number') + ' => a + b;\n\n' + fn('console') + '.' + fn('log') + '(' + fn('greet') + '(' + st('"Samuel"') + '));\n' + fn('console') + '.' + fn('log') + '(' + fn('add') + '(' + nm('10') + ', ' + nm('20') + '));') +
                buildOutput('Hello, Samuel!\n30') +
                buildHow('Specify parameter types and return type. TypeScript warns if you pass wrong types.'))
        },
        {
            title: "Interfaces", readTime: 50,
            concepts: ["Define object shapes", "Properties and types", "Optional properties use ?", "Extends other interfaces"],
            gateQuiz: { question: "What defines an object shape?", options: ["class", "interface", "type", "shape"], correct: 1, explanation: "Interfaces define the structure of objects." },
            content: buildLesson('📋 Interfaces', 'Object blueprints',
                buildCode(kw('interface') + ' ' + tp('Student') + ' {\n    name: ' + tp('string') + ';\n    age: ' + tp('number') + ';\n    grade?: ' + tp('number') + ';  ' + cm('// Optional') + '\n}\n\n' + kw('const') + ' samuel: ' + tp('Student') + ' = {\n    name: ' + st('"Samuel"') + ',\n    age: ' + nm('13') + ',\n    grade: ' + nm('8') + '\n};\n\n' + fn('console') + '.' + fn('log') + '(samuel.name);') +
                buildOutput('Samuel') +
                buildHow('Interfaces define what properties an object must have. <code>?</code> makes properties optional.'))
        }
    ],
    quiz: [
        { question: "TS compiles to?", options: ["Python", "Java", "JavaScript", "C++"], correct: 2 },
        { question: "Type annotation syntax?", options: ["var(int)", "let x: number", "int x", "number x"], correct: 1 }
    ]
},

// ============ LUA (Game Making — Roblox) ============
lua: {
    name: "Lua", icon: "🌙",
    topics: [
        {
            title: "Introduction to Lua", readTime: 45,
            concepts: ["Lua is lightweight", "Used in Roblox games", "print() displays output", "Comments use --"],
            gateQuiz: { question: "Lua is used in?", options: ["Microsoft Office", "Roblox games", "iOS apps", "Databases"], correct: 1, explanation: "Lua powers Roblox game scripting!" },
            content: buildLesson('🌙 Introduction to Lua', 'Game scripting language',
                '<p>Lua powers <strong>Roblox</strong>, World of Warcraft addons, and many game engines!</p>' +
                buildCode(cm('-- This is a comment') + '\n' + fn('print') + '(' + st('"Hello, World!"') + ')\n' + fn('print') + '(' + st('"I am learning Lua!"') + ')') +
                buildOutput('Hello, World!\nI am learning Lua!') +
                buildHow('<code>print()</code> displays text. Comments start with <code>--</code>. No semicolons needed!') +
                buildTip('Lua is the language behind Roblox Studio scripting!'))
        },
        {
            title: "Variables & Types", readTime: 50,
            concepts: ["local creates variables", "Dynamic typing", "nil means nothing", "Strings use .. to join"],
            gateQuiz: { question: "How to declare a local variable?", options: ["var x", "let x", "local x", "dim x"], correct: 2, explanation: "Lua uses 'local' keyword for local variables." },
            content: buildLesson('📦 Lua Variables', 'Storing data',
                buildCode(kw('local') + ' name = ' + st('"Samuel"') + '\n' + kw('local') + ' age = ' + nm('13') + '\n' + kw('local') + ' height = ' + nm('5.4') + '\n' + kw('local') + ' playing = ' + kw('true') + '\n\n' + fn('print') + '(' + st('"Name: "') + ' .. name)\n' + fn('print') + '(' + st('"Age: "') + ' .. age)') +
                buildOutput('Name: Samuel\nAge: 13') +
                buildHow('<code>local</code> creates variables. <code>..</code> joins strings (concatenation). Lua has dynamic types.'))
        },
        {
            title: "Conditions & Loops", readTime: 50,
            concepts: ["if-then-end structure", "for i=start,stop,step", "while-do-end loop", "~= means not equal"],
            gateQuiz: { question: "Not equal in Lua?", options: ["!=", "~=", "<>", "=/="], correct: 1, explanation: "Lua uses ~= for not equal (different from most languages!)." },
            content: buildLesson('🔄 Conditions & Loops', 'Control flow in Lua',
                buildCode(kw('local') + ' score = ' + nm('85') + '\n\n' + kw('if') + ' score >= ' + nm('90') + ' ' + kw('then') + '\n    ' + fn('print') + '(' + st('"A+"') + ')\n' + kw('elseif') + ' score >= ' + nm('80') + ' ' + kw('then') + '\n    ' + fn('print') + '(' + st('"A"') + ')\n' + kw('else') + '\n    ' + fn('print') + '(' + st('"Keep going"') + ')\n' + kw('end') + '\n\n' + kw('for') + ' i = ' + nm('1') + ', ' + nm('5') + ' ' + kw('do') + '\n    ' + fn('print') + '(' + st('"Number: "') + ' .. i)\n' + kw('end')) +
                buildOutput('A\nNumber: 1\nNumber: 2\nNumber: 3\nNumber: 4\nNumber: 5') +
                buildHow('Lua uses <code>then</code>, <code>end</code> instead of <code>{}</code>. <code>elseif</code> is one word!'))
        },
        {
            title: "Functions & Tables", readTime: 55,
            concepts: ["function keyword", "Tables are arrays AND objects", "Tables start at index 1!", "#table gives length"],
            gateQuiz: { question: "Lua arrays start at index?", options: ["0", "1", "-1", "It depends"], correct: 1, explanation: "Unlike most languages, Lua tables start at index 1!" },
            content: buildLesson('🧩 Functions & Tables', 'Core Lua features',
                buildCode(kw('function') + ' ' + fn('greet') + '(name)\n    ' + fn('print') + '(' + st('"Hello, "') + ' .. name .. ' + st('"!"') + ')\n' + kw('end') + '\n\n' + fn('greet') + '(' + st('"Samuel"') + ')\n\n' + cm('-- Tables (arrays)') + '\n' + kw('local') + ' fruits = {' + st('"apple"') + ', ' + st('"banana"') + ', ' + st('"cherry"') + '}\n' + fn('print') + '(fruits[' + nm('1') + '])  ' + cm('-- apple (starts at 1!)') + '\n' + fn('print') + '(#fruits)     ' + cm('-- 3 (length)') + '\n\n' + cm('-- Tables (objects)') + '\n' + kw('local') + ' player = {\n    name = ' + st('"Samuel"') + ',\n    health = ' + nm('100') + '\n}\n' + fn('print') + '(player.name)') +
                buildOutput('Hello, Samuel!\napple\n3\nSamuel') +
                buildHow('Tables are Lua\'s only data structure — they work as both arrays AND objects! Arrays start at 1.'))
        },
        {
            title: "Roblox Basics", readTime: 60,
            concepts: ["Scripts go in ServerScriptService", "game.Workspace contains parts", "Properties like Position, Color", "Events like Touched"],
            gateQuiz: { question: "Where do server scripts go?", options: ["Workspace", "ServerScriptService", "StarterGui", "ReplicatedStorage"], correct: 1, explanation: "Server scripts live in ServerScriptService." },
            content: buildLesson('🎮 Roblox Scripting', 'Making Roblox games',
                buildCode(cm('-- Make a part change color when touched') + '\n' + kw('local') + ' part = script.Parent\n\npart.Touched:' + fn('Connect') + '(' + kw('function') + '(hit)\n    ' + kw('local') + ' player = game.Players:' + fn('GetPlayerFromCharacter') + '(hit.Parent)\n    ' + kw('if') + ' player ' + kw('then') + '\n        part.BrickColor = BrickColor.' + fn('new') + '(' + st('"Bright red"') + ')\n        ' + fn('print') + '(player.Name .. ' + st('" touched the part!"') + ')\n    ' + kw('end') + '\n' + kw('end') + ')') +
                buildHow('Roblox scripts use Lua. <code>:Connect()</code> listens for events. <code>Touched</code> fires when a player touches a part.') +
                buildTip('Open Roblox Studio, insert a Part, add a Script inside it, and paste this code!'))
        }
    ],
    quiz: [
        { question: "Lua is used in?", options: ["Office", "Roblox", "iOS", "Databases"], correct: 1 },
        { question: "Not equal in Lua?", options: ["!=", "~=", "<>", "=/="], correct: 1 },
        { question: "Tables start at index?", options: ["0", "1", "-1", "Depends"], correct: 1 }
    ]
},

// ============ C# (Game Making — Unity) ============
csharp: {
    name: "C#", icon: "💜",
    topics: [
        {
            title: "Introduction to C#", readTime: 50,
            concepts: ["C# is by Microsoft", "Used in Unity games", "Similar to Java syntax", "Console.WriteLine() prints"],
            gateQuiz: { question: "C# is used in which game engine?", options: ["Unreal", "Unity", "Godot", "GameMaker"], correct: 1, explanation: "Unity uses C# as its scripting language." },
            content: buildLesson('💜 Introduction to C#', 'Unity game development',
                '<p>C# (C-Sharp) powers <strong>Unity</strong> — the most popular game engine in the world!</p>' +
                buildCode(kw('using') + ' System;\n\n' + kw('class') + ' ' + tp('Program') + ' {\n    ' + kw('static void') + ' ' + fn('Main') + '() {\n        Console.' + fn('WriteLine') + '(' + st('"Hello, World!"') + ');\n        Console.' + fn('WriteLine') + '(' + st('"I am learning C#!"') + ');\n    }\n}') +
                buildOutput('Hello, World!\nI am learning C#!') +
                buildHow('<code>Console.WriteLine()</code> prints text. C# structure is similar to Java.') +
                buildTip('C# runs in Unity, .NET apps, and Windows programs!'))
        },
        {
            title: "Variables & Types", readTime: 50,
            concepts: ["int, float, string, bool", "var for type inference", "String interpolation with $", "Strongly typed"],
            gateQuiz: { question: "String interpolation prefix?", options: ["f", "@", "$", "#"], correct: 2, explanation: "C# uses $ prefix for string interpolation." },
            content: buildLesson('📦 C# Variables', 'Typed data in C#',
                buildCode(tp('int') + ' age = ' + nm('13') + ';\n' + tp('float') + ' height = ' + nm('5.4f') + ';\n' + tp('string') + ' name = ' + st('"Samuel"') + ';\n' + tp('bool') + ' student = ' + kw('true') + ';\n\n' + cm('// String interpolation') + '\nConsole.' + fn('WriteLine') + '(' + st('$"Name: {name}, Age: {age}"') + ');\n\n' + cm('// var for type inference') + '\n' + kw('var') + ' score = ' + nm('95') + ';  ' + cm('// compiler knows it\'s int')) +
                buildOutput('Name: Samuel, Age: 13') +
                buildHow('<code>$"..."</code> lets you embed variables. <code>var</code> lets the compiler figure out the type.'))
        },
        {
            title: "Unity Basics", readTime: 60,
            concepts: ["MonoBehaviour is base class", "Start() runs once", "Update() runs every frame", "transform.position moves objects"],
            gateQuiz: { question: "Update() runs?", options: ["Once at start", "Every frame", "On click", "Never"], correct: 1, explanation: "Update() is called every frame (60+ times per second)." },
            content: buildLesson('🎮 Unity Scripting', 'Making games in Unity',
                buildCode(kw('using') + ' UnityEngine;\n\n' + kw('public class') + ' ' + tp('PlayerController') + ' : ' + tp('MonoBehaviour') + ' {\n    ' + kw('public') + ' ' + tp('float') + ' speed = ' + nm('5f') + ';\n\n    ' + kw('void') + ' ' + fn('Start') + '() {\n        Debug.' + fn('Log') + '(' + st('"Game Started!"') + ');\n    }\n\n    ' + kw('void') + ' ' + fn('Update') + '() {\n        ' + tp('float') + ' moveX = Input.' + fn('GetAxis') + '(' + st('"Horizontal"') + ');\n        ' + tp('float') + ' moveZ = Input.' + fn('GetAxis') + '(' + st('"Vertical"') + ');\n        transform.' + fn('Translate') + '(moveX * speed, ' + nm('0') + ', moveZ * speed);\n    }\n}') +
                buildHow('<code>Start()</code> runs once when game begins. <code>Update()</code> runs every frame. <code>Input.GetAxis()</code> reads keyboard/controller.') +
                buildTip('Attach this script to a player object in Unity to make it move with arrow keys!'))
        },
        {
            title: "Classes & Objects", readTime: 55,
            concepts: ["class defines a blueprint", "new creates instances", "Properties store data", "Methods define behavior"],
            gateQuiz: { question: "new keyword does?", options: ["Deletes object", "Creates instance", "Defines class", "Returns null"], correct: 1, explanation: "new creates a new instance of a class." },
            content: buildLesson('🏗️ Classes & Objects', 'Object-oriented C#',
                buildCode(kw('class') + ' ' + tp('Player') + ' {\n    ' + kw('public') + ' ' + tp('string') + ' Name;\n    ' + kw('public') + ' ' + tp('int') + ' Health;\n\n    ' + kw('public') + ' ' + tp('Player') + '(' + tp('string') + ' name, ' + tp('int') + ' health) {\n        Name = name;\n        Health = health;\n    }\n\n    ' + kw('public void') + ' ' + fn('TakeDamage') + '(' + tp('int') + ' dmg) {\n        Health -= dmg;\n        Console.' + fn('WriteLine') + '(' + st('$"{Name} has {Health} HP"') + ');\n    }\n}\n\n' + kw('var') + ' p = ' + kw('new') + ' ' + tp('Player') + '(' + st('"Samuel"') + ', ' + nm('100') + ');\np.' + fn('TakeDamage') + '(' + nm('25') + ');') +
                buildOutput('Samuel has 75 HP') +
                buildHow('Classes are blueprints. <code>new</code> creates instances. Constructors initialize data.'))
        }
    ],
    quiz: [
        { question: "C# game engine?", options: ["Unreal", "Unity", "Godot", "GameMaker"], correct: 1 },
        { question: "Update() runs?", options: ["Once", "Every frame", "On click", "Never"], correct: 1 },
        { question: "String interpolation?", options: ["f''", "@''", "$\"\"", "#\"\""], correct: 2 }
    ]
},

// ============ GDSCRIPT (Game Making — Godot) ============
gdscript: {
    name: "GDScript", icon: "🎮",
    topics: [
        {
            title: "Intro to GDScript", readTime: 45,
            concepts: ["GDScript is for Godot engine", "Syntax like Python", "Free and open source", "2D and 3D games"],
            gateQuiz: { question: "GDScript is for?", options: ["Unity", "Unreal", "Godot", "GameMaker"], correct: 2, explanation: "GDScript is Godot's built-in scripting language." },
            content: buildLesson('🎮 Introduction to GDScript', 'Godot game engine scripting',
                '<p><strong>Godot</strong> is a free, open-source game engine. GDScript is its built-in language that looks like Python!</p>' +
                buildCode(kw('extends') + ' Node\n\n' + kw('func') + ' ' + fn('_ready') + '():\n    ' + fn('print') + '(' + st('"Hello, World!"') + ')\n    ' + fn('print') + '(' + st('"Game is ready!"') + ')\n\n' + kw('var') + ' player_name = ' + st('"Samuel"') + '\n' + kw('var') + ' health = ' + nm('100')) +
                buildHow('<code>extends</code> says what node type this script is for. <code>_ready()</code> runs when the node enters the scene.') +
                buildTip('Godot is 100% free — download it from godotengine.org!'))
        },
        {
            title: "Variables & Functions", readTime: 50,
            concepts: ["var declares variables", "func defines functions", "export makes editor-visible", "Type hints with :"],
            gateQuiz: { question: "func keyword creates?", options: ["Variable", "Class", "Function", "Signal"], correct: 2, explanation: "func defines a function in GDScript." },
            content: buildLesson('📦 Variables & Functions', 'GDScript basics',
                buildCode(kw('extends') + ' Node2D\n\n' + cm('# Variables') + '\n' + kw('var') + ' speed: ' + tp('float') + ' = ' + nm('200.0') + '\n' + kw('var') + ' health: ' + tp('int') + ' = ' + nm('100') + '\n' + kw('export var') + ' player_name: ' + tp('String') + ' = ' + st('"Samuel"') + '\n\n' + cm('# Functions') + '\n' + kw('func') + ' ' + fn('take_damage') + '(amount: ' + tp('int') + '):\n    health -= amount\n    ' + fn('print') + '(player_name + ' + st('" has "') + ' + ' + fn('str') + '(health) + ' + st('" HP"') + ')\n\n' + kw('func') + ' ' + fn('_ready') + '():\n    ' + fn('take_damage') + '(' + nm('25') + ')') +
                buildOutput('Samuel has 75 HP') +
                buildHow('<code>export var</code> shows in the Godot editor. Type hints with <code>:</code> are optional but helpful.'))
        },
        {
            title: "Movement & Input", readTime: 55,
            concepts: ["_process runs every frame", "delta is frame time", "Input.is_action_pressed()", "velocity for movement"],
            gateQuiz: { question: "_process() receives?", options: ["input", "delta", "speed", "position"], correct: 1, explanation: "delta is the time since the last frame — used for smooth movement." },
            content: buildLesson('🕹️ Movement & Input', 'Making things move',
                buildCode(kw('extends') + ' CharacterBody2D\n\n' + kw('var') + ' speed = ' + nm('300.0') + '\n\n' + kw('func') + ' ' + fn('_process') + '(delta):\n    ' + kw('var') + ' velocity = Vector2.ZERO\n\n    ' + kw('if') + ' Input.' + fn('is_action_pressed') + '(' + st('"ui_right"') + '):\n        velocity.x += ' + nm('1') + '\n    ' + kw('if') + ' Input.' + fn('is_action_pressed') + '(' + st('"ui_left"') + '):\n        velocity.x -= ' + nm('1') + '\n    ' + kw('if') + ' Input.' + fn('is_action_pressed') + '(' + st('"ui_down"') + '):\n        velocity.y += ' + nm('1') + '\n    ' + kw('if') + ' Input.' + fn('is_action_pressed') + '(' + st('"ui_up"') + '):\n        velocity.y -= ' + nm('1') + '\n\n    velocity = velocity.' + fn('normalized') + '() * speed\n    ' + fn('move_and_slide') + '()') +
                buildHow('<code>_process(delta)</code> runs every frame. <code>Input</code> checks keyboard. <code>move_and_slide()</code> handles physics movement.') +
                buildTip('Attach this to a CharacterBody2D node to move with arrow keys!'))
        }
    ],
    quiz: [
        { question: "GDScript is for?", options: ["Unity", "Unreal", "Godot", "GameMaker"], correct: 2 },
        { question: "_ready() runs?", options: ["Every frame", "On node enter", "On click", "Never"], correct: 1 },
        { question: "func creates?", options: ["Variable", "Class", "Function", "Signal"], correct: 2 }
    ]
},

// ============ CSS (Website Making) ============
css: {
    name: "CSS Advanced", icon: "🎨",
    topics: [
        {
            title: "CSS Animations", readTime: 50,
            concepts: ["@keyframes defines animation", "animation property applies it", "transition for simple effects", "transform moves/rotates"],
            gateQuiz: { question: "@keyframes creates?", options: ["Variables", "Animations", "Layouts", "Colors"], correct: 1, explanation: "@keyframes defines animation steps." },
            content: buildLesson('✨ CSS Animations', 'Making things move',
                buildCode(cm('/* Define the animation */') + '\n@keyframes slide-in {\n    ' + kw('from') + ' {\n        transform: translateX(-' + nm('100') + 'px);\n        opacity: ' + nm('0') + ';\n    }\n    ' + kw('to') + ' {\n        transform: translateX(' + nm('0') + ');\n        opacity: ' + nm('1') + ';\n    }\n}\n\n' + cm('/* Apply it */') + '\n.box {\n    animation: slide-in ' + nm('0.5') + 's ease;\n}\n\n' + cm('/* Simple hover transition */') + '\n.button {\n    transition: background ' + nm('0.3') + 's;\n}\n.button:hover {\n    background: ' + st('#667eea') + ';\n}') +
                buildHow('<code>@keyframes</code> defines steps. <code>animation</code> applies it. <code>transition</code> is for simple hover effects.'))
        },
        {
            title: "Responsive Design", readTime: 50,
            concepts: ["Media queries for screen sizes", "Mobile-first approach", "Flexible units: %, vw, vh", "min-width and max-width"],
            gateQuiz: { question: "Media queries respond to?", options: ["Mouse clicks", "Screen size", "Keyboard", "Time"], correct: 1, explanation: "Media queries change styles based on screen size." },
            content: buildLesson('📱 Responsive Design', 'Works on all screens',
                buildCode(cm('/* Mobile first */') + '\n.container {\n    padding: ' + nm('10') + 'px;\n    font-size: ' + nm('14') + 'px;\n}\n\n' + cm('/* Tablet */') + '\n@media (min-width: ' + nm('768') + 'px) {\n    .container {\n        padding: ' + nm('20') + 'px;\n        font-size: ' + nm('16') + 'px;\n    }\n}\n\n' + cm('/* Desktop */') + '\n@media (min-width: ' + nm('1024') + 'px) {\n    .container {\n        max-width: ' + nm('1200') + 'px;\n        margin: ' + nm('0') + ' auto;\n    }\n}') +
                buildHow('<code>@media</code> queries apply styles at different screen widths. Mobile-first means start small, add bigger.'))
        },
        {
            title: "CSS Variables", readTime: 40,
            concepts: ["--name defines variables", "var() uses them", "Defined in :root", "Easy theme switching"],
            gateQuiz: { question: "How to use a CSS variable?", options: ["$(--name)", "var(--name)", "${name}", "use(name)"], correct: 1, explanation: "var(--name) references a CSS custom property." },
            content: buildLesson('🎨 CSS Variables', 'Reusable values',
                buildCode(':root {\n    --primary: ' + st('#667eea') + ';\n    --bg-dark: ' + st('#0a0a1a') + ';\n    --text: ' + st('#e0e0e0') + ';\n    --radius: ' + st('10px') + ';\n}\n\n.card {\n    background: ' + fn('var') + '(--bg-dark);\n    color: ' + fn('var') + '(--text);\n    border-radius: ' + fn('var') + '(--radius);\n    border: 1px solid ' + fn('var') + '(--primary);\n}') +
                buildHow('Define in <code>:root</code>, use with <code>var()</code>. Change one value to update everywhere!'))
        }
    ],
    quiz: [
        { question: "@keyframes creates?", options: ["Variables", "Animations", "Layouts", "Colors"], correct: 1 },
        { question: "Use CSS variable?", options: ["$(--x)", "var(--x)", "${x}", "use(x)"], correct: 1 }
    ]
}
};

// =============================================
//  SECTION 4: UPDATE index.html LANGUAGE BUTTONS
// =============================================
// NOTE: You need to add these buttons to your index.html language-selector div:
// <button class="lang-btn" onclick="switchLanguage('typescript',this)">🔷 TypeScript</button>
// <button class="lang-btn" onclick="switchLanguage('lua',this)">🌙 Lua</button>
// <button class="lang-btn" onclick="switchLanguage('csharp',this)">💜 C#</button>
// <button class="lang-btn" onclick="switchLanguage('gdscript',this)">🎮 GDScript</button>
// <button class="lang-btn" onclick="switchLanguage('css',this)">🎨 CSS Advanced</button>

// =============================================
//  SECTION 5: THEME TOGGLE
// =============================================
function toggleTheme() {
    var t = document.getElementById('themeToggle');
    document.documentElement.setAttribute('data-theme', t.checked ? 'light' : 'dark');
    localStorage.setItem('theme', t.checked ? 'light' : 'dark');
}
(function () {
    if (localStorage.getItem('theme') === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
        document.getElementById('themeToggle').checked = true;
    }
})();

// =============================================
//  SECTION 6: TOAST
// =============================================
function showToast(msg, type) {
    var t = document.getElementById('toast');
    t.textContent = msg;
    t.className = 'toast ' + (type || 'info') + ' show';
    setTimeout(function () { t.classList.remove('show'); }, 3500);
}

// =============================================
//  SECTION 7: NAVIGATION
// =============================================
function switchLanguage(lang, btn) {
    pauseCurrentTimer();
    currentLang = lang; currentTopic = 0;
    document.querySelectorAll('.lang-btn').forEach(function (b) { b.classList.remove('active'); });
    btn.classList.add('active');
    document.getElementById('progressLang').textContent = lessons[lang].name;
    renderTopicNav(); renderLesson(); updateProgress(); saveState();
    showSection('lessons', document.querySelector('nav a'));
}

function renderTopicNav() {
    var nav = document.getElementById('topicNav');
    var topics = lessons[currentLang].topics;
    nav.innerHTML = topics.map(function (t, i) {
        var s = getState(currentLang, i), cls = '';
        if (i === currentTopic) cls = 'active';
        else if (s.completed) cls = 'completed';
        else if (i > 0 && !getState(currentLang, i - 1).completed) cls = 'locked';
        return '<button class="topic-btn ' + cls + '" onclick="selectTopic(' + i + ')">' + (i + 1) + '. ' + t.title + '</button>';
    }).join('');
}

function selectTopic(i) {
    if (i > 0 && !getState(currentLang, i - 1).completed) { showToast('🔒 Complete previous topic first!', 'error'); return; }
    pauseCurrentTimer(); currentTopic = i; renderTopicNav(); renderLesson(); saveState();
}

function updateProgress() {
    var topics = lessons[currentLang].topics, done = 0;
    topics.forEach(function (_, i) { if (getState(currentLang, i).completed) done++; });
    var pct = Math.round((done / topics.length) * 100);
    document.getElementById('progressFill').style.width = pct + '%';
    document.getElementById('progressStats').textContent = done + ' / ' + topics.length + ' completed (' + pct + '%)';
}

// =============================================
//  SECTION 8: TIMER (PERSISTS)
// =============================================
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
        if (rem <= 0) {
            clearInterval(id); delete activeTimers[key]; s.timerDone = true; s.remainingTime = 0; saveState();
            cd.textContent = '✅ Done!'; cd.classList.add('timer-done'); tx.textContent = '✅ Reading time complete!';
            checkCompletion(); showToast('⏱️ Reading done!', 'success');
        }
    }, 1000);
    activeTimers[key] = { id: id, rem: rem };
}

// =============================================
//  SECTION 9: CONCEPTS & GATE QUIZ
// =============================================
function onConceptCheck() {
    var cbs = document.querySelectorAll('.concept-cb'), all = true;
    cbs.forEach(function (cb) { var it = cb.closest('.concept-item'); if (cb.checked) it.classList.add('checked'); else { it.classList.remove('checked'); all = false; } });
    getState(currentLang, currentTopic).conceptsChecked = all; saveState();
    if (all) showToast('✅ All checked! Pass the quiz.', 'success');
    checkCompletion();
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

// =============================================
//  SECTION 10: RENDER LESSON
// =============================================
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

// =============================================
//  SECTION 11: SECTIONS
// =============================================
function showSection(section, navLink) {
    document.querySelectorAll('nav a').forEach(function (a) { a.classList.remove('active-nav'); });
    if (navLink) navLink.classList.add('active-nav');
    if (section === 'lessons') renderLesson();
    else if (section === 'practice') { pauseCurrentTimer(); document.getElementById('lessonContent').style.display = 'none'; document.getElementById('quizSection').style.display = 'none'; renderPractice(); document.getElementById('practiceSection').style.display = 'block'; }
    else if (section === 'quiz') { pauseCurrentTimer(); document.getElementById('lessonContent').style.display = 'none'; document.getElementById('practiceSection').style.display = 'none'; renderQuiz(); document.getElementById('quizSection').style.display = 'block'; }
}

// =============================================
//  SECTION 12: PRACTICE
// =============================================
function getPlaceholder(lang) {
    var p = { python:'print("Hello!")', javascript:'console.log("Hello!");', java:'System.out.println("Hello!");', c:'printf("Hello!\\n");', html:'<h1>Hello!</h1>', typescript:'console.log("Hello!");', lua:'print("Hello!")', csharp:'Console.WriteLine("Hello!");', gdscript:'print("Hello!")', css:'.box { color: red; }' };
    return p[lang] || '';
}

function renderPractice() {
    var lang = lessons[currentLang];
    previewVisible = false;
    document.getElementById('practiceSection').innerHTML =
        '<div class="practice-section"><h3>✍️ Practice ' + lang.name + '</h3>' +
        '<p style="color:var(--text-secondary);margin-bottom:14px;font-size:13px">Type code, click Preview for colors, click Run for real output via Piston API!</p>' +
        '<div class="editor-box"><div class="editor-top"><div class="dots"><span class="dot-r"></span><span class="dot-y"></span><span class="dot-g"></span></div><span class="editor-label">' + lang.icon + ' ' + lang.name + '</span></div>' +
        '<div class="editor-main" style="position:relative"><div class="line-numbers" id="lineNums">1</div>' +
        '<textarea id="codeInput" spellcheck="false" placeholder="' + getPlaceholder(currentLang) + '" oninput="onCodeInput()" onscroll="syncLineNumbers()"></textarea></div>' +
        '<div class="preview-toggle-bar"><span id="charInfo">0 chars | 1 line</span><button class="preview-btn" id="previewBtn" onclick="togglePreview()">👁️ Preview</button></div>' +
        '<div class="code-preview" id="codePreview"></div>' +
        '<div class="editor-bottom"><span style="color:#888;font-size:11px">🌐 Piston API</span><div class="btn-row"><button class="clr-btn" onclick="clearCode()">🗑️ Clear</button><button class="run-btn" onclick="runCode()">▶ Run</button></div></div></div>' +
        '<div class="output-wrapper"><div class="output-tab-bar"><div class="output-tab active">📟 Output</div><div style="flex:1"></div><span class="output-status waiting" id="outputStatus">⏳ Waiting</span></div>' +
        '<div class="run-output" id="runOutput"><span class="output-empty">Run your code to see output...</span></div>' +
        '<div class="execution-info" id="execInfo"><span>Ready</span><span></span></div></div></div>';
}

function onCodeInput() {
    var input = document.getElementById('codeInput'); if (!input) return;
    var lines = input.value.split('\n').length;
    var info = document.getElementById('charInfo');
    if (info) info.textContent = input.value.length + ' chars | ' + lines + ' lines';
    updateLineNumbers(lines);
    if (previewVisible) updatePreview();
}

function updateLineNumbers(count) {
    var el = document.getElementById('lineNums'); if (!el) return;
    var nums = []; for (var i = 1; i <= count; i++) nums.push(i);
    el.textContent = nums.join('\n');
}

function syncLineNumbers() {
    var input = document.getElementById('codeInput'), nums = document.getElementById('lineNums');
    if (input && nums) nums.style.transform = 'translateY(-' + input.scrollTop + 'px)';
}

document.addEventListener('keydown', function (e) {
    if (e.target.id === 'codeInput' && e.key === 'Tab') {
        e.preventDefault(); var inp = e.target, s = inp.selectionStart, en = inp.selectionEnd;
        inp.value = inp.value.substring(0, s) + '    ' + inp.value.substring(en);
        inp.selectionStart = inp.selectionEnd = s + 4; onCodeInput();
    }
});

function togglePreview() {
    previewVisible = !previewVisible;
    var p = document.getElementById('codePreview'), b = document.getElementById('previewBtn');
    if (previewVisible) { p.classList.add('visible'); b.classList.add('active'); b.textContent = '👁️ Hide'; updatePreview(); }
    else { p.classList.remove('visible'); b.classList.remove('active'); b.textContent = '👁️ Preview'; }
}

function updatePreview() {
    var input = document.getElementById('codeInput'), preview = document.getElementById('codePreview');
    if (!input || !preview) return;
    if (!input.value.trim()) { preview.innerHTML = '<span class="output-empty">Type code...</span>'; return; }
    preview.innerHTML = colorize(input.value, currentLang);
}

// =============================================
//  SECTION 13: COLORIZE (for preview)
// =============================================
function colorize(code, lang) {
    var e = code.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    return e.split('\n').map(function(l){return colorizeLine(l,lang);}).join('\n');
}
function colorizeLine(line, lang) {
    var marker = (lang==='python'||lang==='lua'||lang==='gdscript') ? '#' : '//';
    if (lang==='lua') { var dIdx=line.indexOf('--'); if(dIdx>=0) return tokenize(line.substring(0,dIdx),lang)+'<span class="hl-comment">'+line.substring(dIdx)+'</span>'; }
    if (lang==='html'||lang==='css') return line;
    var idx = findComment(line, marker);
    if (idx>=0) return tokenize(line.substring(0,idx),lang)+'<span class="hl-comment">'+line.substring(idx)+'</span>';
    return tokenize(line, lang);
}
function findComment(line,marker){var inStr=false,ch='';for(var i=0;i<line.length;i++){var c=line[i];if(!inStr&&(c==='"'||c==="'"))inStr=true,ch=c;else if(inStr&&c===ch)inStr=false;else if(!inStr&&line.substring(i,i+marker.length)===marker)return i;}return -1;}
function tokenize(text,lang){var tokens=[],i=0;while(i<text.length){var c=text[i];if(c==='"'||c==="'"||c==='`'){var s=i,q=c;i++;while(i<text.length&&text[i]!==q){if(text[i]==='\\')i++;i++;}if(i<text.length)i++;tokens.push({t:'string',v:text.substring(s,i)});continue;}if(c>='0'&&c<='9'){var ns=i;while(i<text.length&&((text[i]>='0'&&text[i]<='9')||text[i]==='.'))i++;if(i<text.length&&isW(text[i])){while(i<text.length&&isW(text[i]))i++;tokens.push({t:'plain',v:text.substring(ns,i)});}else tokens.push({t:'number',v:text.substring(ns,i)});continue;}if(isW(c)){var ws=i;while(i<text.length&&isW(text[i]))i++;tokens.push({t:wordType(text.substring(ws,i),lang),v:text.substring(ws,i)});continue;}if('()[]{}' .indexOf(c)>=0){tokens.push({t:'bracket',v:c});i++;continue;}if(c==='#'&&(lang==='c')){var ps=i;i++;while(i<text.length&&isW(text[i]))i++;tokens.push({t:'keyword',v:text.substring(ps,i)});continue;}if('=+*/%!<>&|^~?:;,.-'.indexOf(c)>=0){tokens.push({t:'operator',v:c});i++;continue;}tokens.push({t:'plain',v:c});i++;}return tokens.map(function(tk){var cls={keyword:'hl-keyword',string:'hl-string',function:'hl-function',number:'hl-number',bracket:'hl-bracket',operator:'hl-operator',type:'hl-type'}[tk.t];return cls?'<span class="'+cls+'">'+tk.v+'</span>':tk.v;}).join('');}
function isW(c){return(c>='a'&&c<='z')||(c>='A'&&c<='Z')||(c>='0'&&c<='9')||c==='_';}
function wordType(word,lang){
    var kw={python:['def','return','if','elif','else','for','while','in','import','from','class','try','except','finally','with','as','lambda','pass','break','continue','and','or','not','is','True','False','None','yield','raise','del'],javascript:['const','let','var','function','return','if','else','for','while','do','switch','case','break','continue','class','new','this','typeof','try','catch','finally','throw','import','export','default','async','await','of','in','true','false','null','undefined'],java:['public','private','protected','static','void','class','new','return','if','else','for','while','do','switch','case','break','continue','try','catch','throw','import','extends','final','this','super','true','false','null'],c:['int','float','double','char','void','long','short','unsigned','return','if','else','for','while','do','switch','case','break','continue','struct','typedef','sizeof','const','static'],typescript:['const','let','var','function','return','if','else','for','while','class','new','this','typeof','interface','type','enum','extends','implements','import','export','default','async','await','true','false','null','undefined','as','in','of'],lua:['local','function','if','then','else','elseif','end','for','while','do','repeat','until','return','and','or','not','true','false','nil','in'],csharp:['using','namespace','class','public','private','protected','static','void','new','return','if','else','for','while','do','switch','case','break','continue','try','catch','throw','var','int','float','double','string','bool','true','false','null','override','virtual','abstract','interface','extends'],gdscript:['extends','func','var','const','if','elif','else','for','while','return','class_name','signal','export','onready','pass','break','continue','and','or','not','true','false','null','in','is','as','self'],css:['@keyframes','@media','from','to','hover','focus','active','root']};
    var fn_map={python:['print','input','range','len','type','int','str','float','bool','list','dict','abs','max','min','sum','sorted','enumerate','zip','map','filter','open','round'],javascript:['console','log','alert','prompt','parseInt','parseFloat','Math','Array','Object','String','Number','JSON','document','window','setTimeout','push','pop','map','filter','reduce','forEach','querySelector','addEventListener'],java:['System','out','println','print','Scanner','Math','Arrays','String'],c:['printf','scanf','main','malloc','free','strlen'],typescript:['console','log','Math','Array','Object','String','Number','JSON','Promise','fetch'],lua:['print','tostring','tonumber','type','pairs','ipairs','table','string','math','os','io','require','error','pcall'],csharp:['Console','WriteLine','ReadLine','Debug','Log','Math','ToString','GetAxis','Translate','Connect','GetComponent'],gdscript:['print','str','int','float','Vector2','Vector3','Input','load','preload','move_and_slide','get_node','connect','is_action_pressed','normalized'],css:['var','calc','rgb','rgba','hsl','hsla','linear-gradient','translateX','translateY','rotate','scale']};
    var tp_map={java:['int','double','float','char','boolean','String','long','short','byte'],csharp:['int','float','double','string','bool','void','char','long','byte','object','var'],typescript:['string','number','boolean','void','any','never','unknown','null','undefined','object'],gdscript:['int','float','String','bool','Vector2','Vector3','Array','Dictionary','Node','Node2D','CharacterBody2D']};
    if(tp_map[lang]&&tp_map[lang].indexOf(word)>=0)return'type';
    if(kw[lang]&&kw[lang].indexOf(word)>=0)return'keyword';
    if(fn_map[lang]&&fn_map[lang].indexOf(word)>=0)return'function';
    return'plain';
}

// =============================================
//  SECTION 14: RUN CODE — PISTON API
// =============================================
function escOut(t){return String(t).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}
function getFileName(l){var n={python:'main.py',javascript:'main.js',java:'Main.java',c:'main.c',typescript:'main.ts',lua:'main.lua',csharp:'Main.cs',gdscript:'main.gd'};return n[l]||'main.txt';}
function getPrintHint(l){var h={python:'print()',javascript:'console.log()',java:'System.out.println()',c:'printf()',typescript:'console.log()',lua:'print()',csharp:'Console.WriteLine()',gdscript:'print()'};return h[l]||'print';}

function clearCode(){
    var inp=document.getElementById('codeInput');if(inp)inp.value='';onCodeInput();
    var out=document.getElementById('runOutput');if(out){out.innerHTML='<span class="output-empty">Run your code...</span>';out.className='run-output';}
    var st=document.getElementById('outputStatus');if(st){st.textContent='⏳ Waiting';st.className='output-status waiting';}
    var info=document.getElementById('execInfo');if(info)info.innerHTML='<span>Ready</span><span></span>';
}

function formatOutput(text){
    if(!text||!text.trim())return'';
    var lines=text.split('\n');
    while(lines.length>0&&lines[lines.length-1].trim()==='')lines.pop();
    return lines.map(function(l,i){return'<span class="output-line"><span class="output-line-num">'+(i+1)+'</span>'+escOut(l)+'</span>';}).join('\n');
}

function runCode(){
    var input=document.getElementById('codeInput'),code=input?input.value:'';
    var output=document.getElementById('runOutput'),status=document.getElementById('outputStatus'),execInfo=document.getElementById('execInfo');
    var startTime=performance.now();
    if(!code.trim()){output.innerHTML='<span class="output-empty">⚠️ Write some code first!</span>';output.className='run-output err';status.textContent='⚠️ Empty';status.className='output-status error';return;}
    output.innerHTML='<span class="output-empty">⏳ Running...</span>';output.className='run-output';status.textContent='⏳ Running...';status.className='output-status waiting';execInfo.innerHTML='<span>Sending to server...</span><span></span>';
    if(currentLang==='html'||currentLang==='css'){runHTML(code,output,status,execInfo,startTime);return;}
    var pistonLangs={python:{language:'python',version:'3.10.0'},javascript:{language:'javascript',version:'18.15.0'},java:{language:'java',version:'15.0.2'},c:{language:'c',version:'10.2.0'},typescript:{language:'typescript',version:'5.0.3'},lua:{language:'lua',version:'5.4.4'},csharp:{language:'csharp',version:'6.12.0'},gdscript:null};
    var cfg=pistonLangs[currentLang];
    if(!cfg){runLocally(code,output,status,execInfo,startTime);return;}
    var body={language:cfg.language,version:cfg.version,files:[{name:getFileName(currentLang),content:code}]};
    fetch('https://emkc.org/api/v2/piston/execute',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)})
    .then(function(r){if(!r.ok)throw new Error('Server: '+r.status);return r.json();})
    .then(function(data){
        var elapsed=(performance.now()-startTime).toFixed(0);
        var stdout=(data.run&&data.run.stdout)?data.run.stdout.trim():'';
        var stderr=(data.run&&data.run.stderr)?data.run.stderr.trim():'';
        var exit=data.run?data.run.code:0;
        if(stderr&&!stdout){output.innerHTML=formatOutput(stderr);output.className='run-output err';status.textContent='❌ Error';status.className='output-status error';execInfo.innerHTML='<span>❌ Failed '+elapsed+'ms</span><span>Exit: '+exit+'</span>';showToast('❌ Error','error');}
        else if(stdout){var html=formatOutput(stdout);if(stderr)html+='\n<span class="output-line" style="color:#ff9800"><span class="output-line-num">⚠️</span>'+escOut(stderr.split('\n')[0])+'</span>';output.innerHTML=html;output.className='run-output';status.textContent='✅ Success';status.className='output-status success';var lc=stdout.trim().split('\n').length;execInfo.innerHTML='<span>✅ '+elapsed+'ms</span><span>'+lc+' lines | Exit: '+exit+'</span>';showToast('✅ Executed!','success');}
        else{output.innerHTML='<span class="output-line"><span class="output-line-num">1</span>✅ Executed (no output)</span>\n<span class="output-line"><span class="output-line-num">💡</span>Use '+escOut(getPrintHint(currentLang))+' to see output</span>';output.className='run-output';status.textContent='✅ Done';status.className='output-status success';execInfo.innerHTML='<span>✅ '+elapsed+'ms</span><span>Exit: '+exit+'</span>';}
    })
    .catch(function(err){console.warn('API failed:',err.message);runLocally(code,output,status,execInfo,startTime);});
}

function runHTML(code,output,status,execInfo,startTime){
    try{var f=document.createElement('iframe');f.style.cssText='display:none';f.sandbox='allow-same-origin';document.body.appendChild(f);f.contentDocument.open();f.contentDocument.write(code);f.contentDocument.close();var txt=f.contentDocument.body.innerText||'';document.body.removeChild(f);var elapsed=(performance.now()-startTime).toFixed(0);if(txt.trim()){output.innerHTML=formatOutput(txt.trim());output.className='run-output';status.textContent='✅ Rendered';status.className='output-status success';}else{output.innerHTML='<span class="output-line"><span class="output-line-num">1</span>✅ HTML rendered</span>';output.className='run-output';status.textContent='✅ Rendered';status.className='output-status success';}execInfo.innerHTML='<span>✅ '+elapsed+'ms</span><span>HTML</span>';showToast('✅ Rendered!','success');}
    catch(err){output.innerHTML='<span class="output-line"><span class="output-line-num">!</span>❌ '+escOut(err.message)+'</span>';output.className='run-output err';status.textContent='❌ Error';status.className='output-status error';}
}

function runLocally(code,output,status,execInfo,startTime){
    var elapsed=(performance.now()-startTime).toFixed(0);
    if(currentLang==='javascript'||currentLang==='typescript'){
        try{var results=[];var sL=console.log,sW=console.warn,sE=console.error;console.log=function(){results.push(Array.prototype.slice.call(arguments).map(function(a){return typeof a==='object'?JSON.stringify(a,null,2):String(a);}).join(' '));};console.warn=function(){results.push('⚠️ '+Array.prototype.slice.call(arguments).join(' '));};console.error=function(){results.push('❌ '+Array.prototype.slice.call(arguments).join(' '));};var ret=eval(code);console.log=sL;console.warn=sW;console.error=sE;elapsed=(performance.now()-startTime).toFixed(0);
            if(results.length>0){output.innerHTML=results.map(function(r,i){return'<span class="output-line"><span class="output-line-num">'+(i+1)+'</span>'+escOut(r)+'</span>';}).join('\n');output.className='run-output';status.textContent='✅ Local';status.className='output-status success';execInfo.innerHTML='<span>✅ Local '+elapsed+'ms</span><span>'+results.length+' lines</span>';showToast('✅ Ran locally!','success');}
            else if(ret!==undefined){output.innerHTML='<span class="output-line"><span class="output-line-num">1</span>'+escOut(String(ret))+'</span>';output.className='run-output';status.textContent='✅ Local';status.className='output-status success';}
            else{output.innerHTML='<span class="output-line"><span class="output-line-num">1</span>✅ Executed (no output)</span>';output.className='run-output';status.textContent='✅ Done';status.className='output-status success';}
        }catch(err){console.log=sL;console.warn=sW;console.error=sE;output.innerHTML='<span class="output-line"><span class="output-line-num">!</span>❌ '+escOut(err.name)+': '+escOut(err.message)+'</span>';output.className='run-output err';status.textContent='❌ Error';status.className='output-status error';showToast('❌ Error','error');}
    }else{
        output.innerHTML='<span class="output-line"><span class="output-line-num">⚠️</span>API offline. Try again or use replit.com</span>';output.className='run-output';status.textContent='⚠️ Offline';status.className='output-status waiting';execInfo.innerHTML='<span>API unavailable</span><span></span>';
    }
}

// =============================================
//  SECTION 15: QUIZ
// =============================================
function renderQuiz(){
    var qd=lessons[currentLang].quiz,ln=lessons[currentLang].name;
    if(!qd||!qd.length){document.getElementById('quizSection').innerHTML='<div class="lesson-card"><h2>Quiz coming soon!</h2></div>';return;}
    var h='<div class="quiz-section"><h3>🧠 '+ln+' Final Quiz</h3>';
    qd.forEach(function(q,qi){h+='<div class="quiz-qb"><p>'+(qi+1)+'. '+q.question+'</p>';q.options.forEach(function(o,oi){h+='<div class="quiz-opt" onclick="checkQuiz(this,'+qi+','+oi+')">'+o+'</div>';});h+='<div class="quiz-res" id="qr-'+qi+'"></div></div>';});
    h+='<div class="score-box" id="scoreBox"><h2 id="scoreText"></h2><p id="scoreMsg" style="margin-top:8px;color:var(--text-secondary)"></p></div></div>';
    document.getElementById('quizSection').innerHTML=h;window._qs=0;window._qa=0;
}
function checkQuiz(el,qi,oi){
    var qd=lessons[currentLang].quiz,c=qd[qi].correct,res=document.getElementById('qr-'+qi);
    var opts=el.parentElement.querySelectorAll('.quiz-opt');
    opts.forEach(function(o,i){o.style.pointerEvents='none';if(i===c)o.classList.add('correct');});
    if(oi===c){el.classList.add('correct');res.textContent='✅ Correct!';res.style.color='var(--accent-green)';window._qs++;}
    else{el.classList.add('wrong');res.textContent='❌ Wrong — correct is green';res.style.color='var(--accent-red)';}
    res.style.display='block';window._qa++;
    if(window._qa===qd.length){var pct=Math.round((window._qs/qd.length)*100);document.getElementById('scoreText').textContent='Score: '+window._qs+'/'+qd.length+' ('+pct+'%)';document.getElementById('scoreMsg').textContent=pct>=80?'🎉 Excellent!':pct>=60?'👍 Good!':'📚 Keep studying!';document.getElementById('scoreBox').style.display='block';}
}

// =============================================
//  SECTION 16: UTILITY & INIT
// =============================================
function copyCode(btn){var block=btn.nextElementSibling;navigator.clipboard.writeText(block.innerText).then(function(){btn.textContent='✅ Copied!';setTimeout(function(){btn.textContent='📋 Copy';},2000);});}
window.addEventListener('beforeunload',function(){pauseCurrentTimer();saveState();});

(function(){
    document.querySelectorAll('.lang-btn').forEach(function(btn){btn.classList.remove('active');var t=btn.textContent.toLowerCase();if(t.indexOf(currentLang)>=0||(currentLang==='c'&&t.indexOf('⚙️')>=0)||(currentLang==='html'&&t.indexOf('🌐')>=0)||(currentLang==='csharp'&&t.indexOf('💜')>=0)||(currentLang==='gdscript'&&t.indexOf('🎮')>=0)||(currentLang==='css'&&t.indexOf('🎨')>=0)||(currentLang==='lua'&&t.indexOf('🌙')>=0)||(currentLang==='typescript'&&t.indexOf('🔷')>=0))btn.classList.add('active');});
    document.getElementById('progressLang').textContent=lessons[currentLang].name;
    renderTopicNav();renderLesson();updateProgress();
})();
