// =============================================
//  STATE MANAGEMENT
// =============================================
var currentLang = 'python';
var currentTopic = 0;
var activeTimers = {};
var completionState = {};
var highlightTimer = null;
var isContentEditable = false;

function getState(lang, topic) {
    var k = lang + '_' + topic;
    if (!completionState[k]) {
        completionState[k] = {
            timerDone: false,
            conceptsChecked: false,
            quizPassed: false,
            completed: false
        };
    }
    return completionState[k];
}

// =============================================
//  LESSON DATA
// =============================================
var lessons = {
    python: {
        name: "Python",
        icon: "🐍",
        topics: [
            {
                title: "Introduction to Python",
                readTime: 45,
                concepts: [
                    "I understand Python is a programming language",
                    "I know print() displays output",
                    "I understand code runs top to bottom",
                    "I know # starts a comment"
                ],
                gateQuiz: {
                    question: "What does print() do in Python?",
                    options: ["Sends to printer", "Displays output on screen", "Creates a variable", "Deletes code"],
                    correct: 1,
                    explanation: "print() displays text/values on the screen."
                },
                content: '<h2>🐍 Introduction to Python</h2>' +
                    '<p class="subtitle">What is Python and why learn it?</p>' +
                    '<p>Python was created by <strong>Guido van Rossum</strong> in 1991. Known for being easy to read and learn.</p>' +
                    '<h3>Why Learn Python?</h3>' +
                    '<ul><li><strong>Easy to read</strong> — looks like English</li>' +
                    '<li><strong>Versatile</strong> — web, AI, data science, games</li>' +
                    '<li><strong>Huge community</strong> — millions of developers</li>' +
                    '<li><strong>High demand</strong> — top skill in tech</li></ul>' +
                    '<h3>Your First Program</h3>' +
                    '<div class="code-container"><button class="copy-btn" onclick="copyCode(this)">📋 Copy</button>' +
                    '<div class="code-block"><span class="comment"># This is a comment</span>\n' +
                    '<span class="function">print</span>(<span class="string">"Hello, World!"</span>)\n' +
                    '<span class="function">print</span>(<span class="string">"My name is Samuel Giftson"</span>)\n' +
                    '<span class="function">print</span>(<span class="string">"I am learning Python!"</span>)</div></div>' +
                    '<div class="output-box">Hello, World!\nMy name is Samuel Giftson\nI am learning Python!</div>' +
                    '<div class="how-it-works"><strong>print()</strong> is a built-in function. Text inside quotes gets displayed. Python reads code line by line. <code>#</code> starts a comment that Python ignores.</div>' +
                    '<div class="tip-box">Python uses 4 spaces for indentation. Indentation is part of Python\'s syntax!</div>'
            },
            {
                title: "Variables & Data Types",
                readTime: 60,
                concepts: [
                    "Variables store data like labeled boxes",
                    "4 basic types: str, int, float, bool",
                    "type() checks a variable's type",
                    "Variable names are case-sensitive"
                ],
                gateQuiz: {
                    question: "What data type is True or False?",
                    options: ["String", "Integer", "Float", "Boolean"],
                    correct: 3,
                    explanation: "Boolean (bool) is True or False — used for conditions."
                },
                content: '<h2>📦 Variables & Data Types</h2>' +
                    '<p class="subtitle">Storing information</p>' +
                    '<p>A <strong>variable</strong> is like a labeled box for data.</p>' +
                    '<div class="code-container"><button class="copy-btn" onclick="copyCode(this)">📋 Copy</button>' +
                    '<div class="code-block"><span class="comment"># String — text</span>\n' +
                    'name = <span class="string">"Samuel"</span>\n\n' +
                    '<span class="comment"># Integer — whole number</span>\n' +
                    'age = <span class="number">13</span>\n\n' +
                    '<span class="comment"># Float — decimal</span>\n' +
                    'height = <span class="number">5.4</span>\n\n' +
                    '<span class="comment"># Boolean — True/False</span>\n' +
                    'is_student = <span class="keyword">True</span>\n\n' +
                    '<span class="function">print</span>(<span class="string">"Name:"</span>, name)\n' +
                    '<span class="function">print</span>(<span class="string">"Age:"</span>, age)\n' +
                    '<span class="function">print</span>(<span class="function">type</span>(name))</div></div>' +
                    '<div class="output-box">Name: Samuel\nAge: 13\n&lt;class \'str\'&gt;</div>' +
                    '<div class="how-it-works"><code>=</code> means "assign this value" not "equals". <code>type()</code> tells you what kind of data a variable holds.</div>' +
                    '<div class="tip-box">Use descriptive names like <code>student_name</code> not just <code>x</code>. Names can\'t start with numbers!</div>'
            },
            {
                title: "Operators & Math",
                readTime: 50,
                concepts: [
                    "I know 7 arithmetic operators: + - * / // % **",
                    "/ gives decimals, // removes decimals",
                    "% gives the remainder",
                    "Comparison operators return True/False"
                ],
                gateQuiz: {
                    question: "What is 17 % 5?",
                    options: ["3.4", "3", "2", "5"],
                    correct: 2,
                    explanation: "17 ÷ 5 = 3 remainder 2. % returns the remainder."
                },
                content: '<h2>🔢 Operators & Math</h2>' +
                    '<p class="subtitle">Calculations in Python</p>' +
                    '<div class="code-container"><button class="copy-btn" onclick="copyCode(this)">📋 Copy</button>' +
                    '<div class="code-block">a = <span class="number">15</span>\nb = <span class="number">4</span>\n\n' +
                    '<span class="function">print</span>(<span class="string">"Add:"</span>, a + b)         <span class="comment"># 19</span>\n' +
                    '<span class="function">print</span>(<span class="string">"Subtract:"</span>, a - b)    <span class="comment"># 11</span>\n' +
                    '<span class="function">print</span>(<span class="string">"Multiply:"</span>, a * b)    <span class="comment"># 60</span>\n' +
                    '<span class="function">print</span>(<span class="string">"Divide:"</span>, a / b)      <span class="comment"># 3.75</span>\n' +
                    '<span class="function">print</span>(<span class="string">"Floor:"</span>, a // b)      <span class="comment"># 3</span>\n' +
                    '<span class="function">print</span>(<span class="string">"Remainder:"</span>, a % b)   <span class="comment"># 3</span>\n' +
                    '<span class="function">print</span>(<span class="string">"Power:"</span>, a ** b)      <span class="comment"># 50625</span></div></div>' +
                    '<div class="output-box">Add: 19\nSubtract: 11\nMultiply: 60\nDivide: 3.75\nFloor: 3\nRemainder: 3\nPower: 50625</div>' +
                    '<div class="how-it-works"><code>//</code> removes decimals. <code>%</code> gives remainder. <code>**</code> is power.</div>' +
                    '<div class="tip-box"><code>=</code> assigns values. <code>==</code> compares values. Don\'t mix them!</div>'
            },
            {
                title: "If-Else Conditions",
                readTime: 55,
                concepts: [
                    "I understand if, elif, else",
                    "Python checks conditions top to bottom",
                    "Indentation defines code blocks",
                    "I can write nested conditions"
                ],
                gateQuiz: {
                    question: "If marks=75, what prints?\nif marks>=90: print('A')\nelif marks>=80: print('B')\nelif marks>=70: print('C')\nelse: print('D')",
                    options: ["A", "B", "C", "D"],
                    correct: 2,
                    explanation: "75>=90 False, 75>=80 False, 75>=70 True → prints C."
                },
                content: '<h2>🔀 If-Else Conditions</h2>' +
                    '<p class="subtitle">Making decisions</p>' +
                    '<div class="code-container"><button class="copy-btn" onclick="copyCode(this)">📋 Copy</button>' +
                    '<div class="code-block">marks = <span class="number">85</span>\n\n' +
                    '<span class="keyword">if</span> marks >= <span class="number">90</span>:\n' +
                    '    <span class="function">print</span>(<span class="string">"Grade: A+"</span>)\n' +
                    '<span class="keyword">elif</span> marks >= <span class="number">80</span>:\n' +
                    '    <span class="function">print</span>(<span class="string">"Grade: A"</span>)\n' +
                    '<span class="keyword">elif</span> marks >= <span class="number">70</span>:\n' +
                    '    <span class="function">print</span>(<span class="string">"Grade: B"</span>)\n' +
                    '<span class="keyword">else</span>:\n' +
                    '    <span class="function">print</span>(<span class="string">"Need improvement"</span>)</div></div>' +
                    '<div class="output-box">Grade: A</div>' +
                    '<div class="how-it-works">Python checks top to bottom. First true condition runs, rest skipped. <code>elif</code> = "else if".</div>'
            },
            {
                title: "Loops",
                readTime: 60,
                concepts: [
                    "for loops iterate over sequences",
                    "range(start, stop) generates numbers",
                    "while loops run until condition is False",
                    "I know what an infinite loop is"
                ],
                gateQuiz: {
                    question: "What does range(1,5) generate?",
                    options: ["1,2,3,4,5", "1,2,3,4", "0,1,2,3,4", "0,1,2,3,4,5"],
                    correct: 1,
                    explanation: "range(1,5) starts at 1, stops BEFORE 5: 1,2,3,4."
                },
                content: '<h2>🔄 Loops</h2>' +
                    '<p class="subtitle">Repeating actions</p>' +
                    '<div class="code-container"><button class="copy-btn" onclick="copyCode(this)">📋 Copy</button>' +
                    '<div class="code-block"><span class="keyword">for</span> i <span class="keyword">in</span> <span class="function">range</span>(<span class="number">1</span>, <span class="number">6</span>):\n' +
                    '    <span class="function">print</span>(<span class="string">"Number:"</span>, i)\n\n' +
                    'subjects = [<span class="string">"Math"</span>, <span class="string">"Science"</span>, <span class="string">"Hindi"</span>]\n' +
                    '<span class="keyword">for</span> s <span class="keyword">in</span> subjects:\n' +
                    '    <span class="function">print</span>(<span class="string">"I study:"</span>, s)\n\n' +
                    'count = <span class="number">3</span>\n' +
                    '<span class="keyword">while</span> count > <span class="number">0</span>:\n' +
                    '    <span class="function">print</span>(count)\n' +
                    '    count = count - <span class="number">1</span>\n' +
                    '<span class="function">print</span>(<span class="string">"🚀 Liftoff!"</span>)</div></div>' +
                    '<div class="output-box">Number: 1\nNumber: 2\nNumber: 3\nNumber: 4\nNumber: 5\nI study: Math\nI study: Science\nI study: Hindi\n3\n2\n1\n🚀 Liftoff!</div>' +
                    '<div class="how-it-works"><strong>for:</strong> fixed iterations. <strong>while:</strong> runs while condition True. Always update the loop variable!</div>'
            },
            {
                title: "Functions",
                readTime: 55,
                concepts: [
                    "def creates a function",
                    "Parameters are inputs",
                    "return sends back a value",
                    "I can call functions with different arguments"
                ],
                gateQuiz: {
                    question: "What keyword sends a value back from a function?",
                    options: ["send", "output", "return", "give"],
                    correct: 2,
                    explanation: "return sends a value back to wherever the function was called."
                },
                content: '<h2>🧩 Functions</h2>' +
                    '<p class="subtitle">Reusable code blocks</p>' +
                    '<div class="code-container"><button class="copy-btn" onclick="copyCode(this)">📋 Copy</button>' +
                    '<div class="code-block"><span class="keyword">def</span> <span class="function">greet</span>(name):\n' +
                    '    <span class="function">print</span>(<span class="string">"Hello, "</span> + name + <span class="string">"!"</span>)\n\n' +
                    '<span class="function">greet</span>(<span class="string">"Samuel"</span>)\n\n' +
                    '<span class="keyword">def</span> <span class="function">add_marks</span>(math, science, hindi):\n' +
                    '    total = math + science + hindi\n' +
                    '    average = total / <span class="number">3</span>\n' +
                    '    <span class="keyword">return</span> total, average\n\n' +
                    'total, avg = <span class="function">add_marks</span>(<span class="number">90</span>, <span class="number">85</span>, <span class="number">88</span>)\n' +
                    '<span class="function">print</span>(<span class="string">"Total:"</span>, total)\n' +
                    '<span class="function">print</span>(<span class="string">"Average:"</span>, avg)</div></div>' +
                    '<div class="output-box">Hello, Samuel!\nTotal: 263\nAverage: 87.66666666666667</div>' +
                    '<div class="how-it-works"><code>def</code> defines a function. Parameters are filled when called. <code>return</code> sends values back.</div>'
            }
        ],
        quiz: [
            { question: "What displays output in Python?", options: ["echo()", "print()", "display()", "show()"], correct: 1 },
            { question: "Which stores True/False?", options: ["str", "int", "float", "bool"], correct: 3 },
            { question: "What does // do?", options: ["Regular division", "Floor division", "Power", "Modulus"], correct: 1 },
            { question: "range(2,6) produces?", options: ["2,3,4,5,6", "2,3,4,5", "1,2,3,4,5", "0,2,4,6"], correct: 1 },
            { question: "Which defines a function?", options: ["function", "func", "def", "define"], correct: 2 }
        ]
    },
    javascript: {
        name: "JavaScript",
        icon: "⚡",
        topics: [
            {
                title: "Introduction to JavaScript",
                readTime: 45,
                concepts: ["JavaScript runs in the browser", "console.log() prints to console", "Statements end with semicolons", "F12 opens browser console"],
                gateQuiz: { question: "Where does console.log() show output?", options: ["On the webpage", "In browser dev console (F12)", "In a popup", "In a file"], correct: 1, explanation: "console.log() outputs to the developer console opened with F12." },
                content: '<h2>⚡ Introduction to JavaScript</h2><p class="subtitle">The language of the web</p><p>JavaScript makes websites interactive!</p><div class="code-container"><button class="copy-btn" onclick="copyCode(this)">📋 Copy</button><div class="code-block"><span class="comment">// Print to console</span>\n<span class="function">console</span>.<span class="function">log</span>(<span class="string">"Hello, World!"</span>);\n<span class="function">console</span>.<span class="function">log</span>(<span class="string">"I am Samuel"</span>);</div></div><div class="output-box">Hello, World!\nI am Samuel</div><div class="how-it-works"><code>console.log()</code> prints to browser console. Every statement ends with <code>;</code>.</div><div class="tip-box">Press F12, go to Console tab, type <code>console.log("Hi!");</code> and press Enter!</div>'
            },
            {
                title: "Variables & Types",
                readTime: 50,
                concepts: ["let vs const vs var", "const cannot be reassigned", "typeof checks data types", "JS numbers include integers and decimals"],
                gateQuiz: { question: "Which creates an unchangeable variable?", options: ["let", "var", "const", "static"], correct: 2, explanation: "const creates a constant." },
                content: '<h2>📦 Variables</h2><p class="subtitle">Three ways to store data</p><div class="code-container"><button class="copy-btn" onclick="copyCode(this)">📋 Copy</button><div class="code-block"><span class="keyword">let</span> age = <span class="number">13</span>;\nage = <span class="number">14</span>;  <span class="comment">// ✅ Works</span>\n\n<span class="keyword">const</span> name = <span class="string">"Samuel"</span>;\n<span class="comment">// name = "X"; ❌ ERROR!</span>\n\n<span class="function">console</span>.<span class="function">log</span>(<span class="keyword">typeof</span> age);   <span class="comment">// "number"</span>\n<span class="function">console</span>.<span class="function">log</span>(<span class="keyword">typeof</span> name);  <span class="comment">// "string"</span></div></div><div class="how-it-works"><code>let</code> for values that change. <code>const</code> for constants. Avoid <code>var</code>.</div>'
            },
            {
                title: "Conditions & Loops",
                readTime: 55,
                concepts: ["if/else uses curly braces {}", "for(init; condition; update)", "=== checks value AND type", "for...of loops arrays"],
                gateQuiz: { question: "What does === check?", options: ["Only value", "Only type", "Value AND type", "Assignment"], correct: 2, explanation: "=== checks both value and type." },
                content: '<h2>🔀 Conditions & Loops</h2><p class="subtitle">Decisions and repetition</p><div class="code-container"><button class="copy-btn" onclick="copyCode(this)">📋 Copy</button><div class="code-block"><span class="keyword">let</span> marks = <span class="number">85</span>;\n<span class="keyword">if</span> (marks >= <span class="number">90</span>) {\n    <span class="function">console</span>.<span class="function">log</span>(<span class="string">"A+"</span>);\n} <span class="keyword">else if</span> (marks >= <span class="number">80</span>) {\n    <span class="function">console</span>.<span class="function">log</span>(<span class="string">"A"</span>);\n} <span class="keyword">else</span> {\n    <span class="function">console</span>.<span class="function">log</span>(<span class="string">"Keep trying!"</span>);\n}\n\n<span class="keyword">for</span> (<span class="keyword">let</span> i = <span class="number">1</span>; i <= <span class="number">5</span>; i++) {\n    <span class="function">console</span>.<span class="function">log</span>(<span class="string">"Count:"</span>, i);\n}</div></div><div class="how-it-works">JS uses <code>{}</code> for code blocks. For loop: start, condition, increment.</div>'
            },
            {
                title: "Functions",
                readTime: 50,
                concepts: ["Three ways to create functions", "Arrow functions use =>", "return sends a value back", "Default parameters"],
                gateQuiz: { question: "Which is a valid arrow function?", options: ["function(a)=>a+1", "(a)=>a+1", "arrow(a){a+1}", "=>(a)a+1"], correct: 1, explanation: "Arrow: (params) => expression." },
                content: '<h2>🧩 Functions</h2><p class="subtitle">Three ways</p><div class="code-container"><button class="copy-btn" onclick="copyCode(this)">📋 Copy</button><div class="code-block"><span class="keyword">function</span> <span class="function">greet</span>(name) {\n    <span class="keyword">return</span> <span class="string">"Hello, "</span> + name;\n}\n\n<span class="keyword">const</span> <span class="function">add</span> = (a, b) => a + b;\n\n<span class="function">console</span>.<span class="function">log</span>(<span class="function">greet</span>(<span class="string">"Samuel"</span>));\n<span class="function">console</span>.<span class="function">log</span>(<span class="function">add</span>(<span class="number">10</span>, <span class="number">20</span>));</div></div><div class="output-box">Hello, Samuel\n30</div><div class="how-it-works">Arrow functions <code>=></code> are shorter.</div>'
            }
        ],
        quiz: [
            { question: "Which declares unchangeable variable?", options: ["let", "var", "const", "fixed"], correct: 2 },
            { question: "typeof 42 returns?", options: ['"integer"', '"number"', '"float"', '"num"'], correct: 1 },
            { question: "Which is arrow function?", options: ["function(){}", "def f():", "(a)=>a+1", "func(a)"], correct: 2 }
        ]
    },
    java: {
        name: "Java", icon: "☕",
        topics: [{
            title: "Introduction to Java", readTime: 50,
            concepts: ["Java needs a class", "main() is entry point", "System.out.println() prints", "Filename matches class name"],
            gateQuiz: { question: "Entry point of Java program?", options: ["start()", "main()", "run()", "begin()"], correct: 1, explanation: "main() is where Java starts." },
            content: '<h2>☕ Introduction to Java</h2><p class="subtitle">Write once, run anywhere</p><div class="code-container"><button class="copy-btn" onclick="copyCode(this)">📋 Copy</button><div class="code-block"><span class="keyword">public class</span> <span class="type">HelloWorld</span> {\n    <span class="keyword">public static void</span> <span class="function">main</span>(<span class="type">String</span>[] args) {\n        System.out.<span class="function">println</span>(<span class="string">"Hello, World!"</span>);\n    }\n}</div></div><div class="output-box">Hello, World!</div><div class="how-it-works">Every Java program lives in a <code>class</code>. <code>main</code> is the starting point.</div>'
        }],
        quiz: [{ question: "Java entry point?", options: ["start()", "main()", "run()", "init()"], correct: 1 }]
    },
    c: {
        name: "C Language", icon: "⚙️",
        topics: [{
            title: "Introduction to C", readTime: 50,
            concepts: ["#include brings libraries", "main() starts program", "printf() prints", "\\n = new line"],
            gateQuiz: { question: "What does #include <stdio.h> do?", options: ["Creates variable", "Includes I/O library", "Starts program", "Defines function"], correct: 1, explanation: "stdio.h provides printf()." },
            content: '<h2>⚙️ Introduction to C</h2><p class="subtitle">The mother of all languages</p><div class="code-container"><button class="copy-btn" onclick="copyCode(this)">📋 Copy</button><div class="code-block"><span class="keyword">#include</span> <span class="string">&lt;stdio.h&gt;</span>\n\n<span class="type">int</span> <span class="function">main</span>() {\n    <span class="function">printf</span>(<span class="string">"Hello, World!\\n"</span>);\n    <span class="keyword">return</span> <span class="number">0</span>;\n}</div></div><div class="output-box">Hello, World!</div><div class="how-it-works"><code>#include</code> loads libraries. <code>printf()</code> prints. <code>\\n</code> = new line.</div>'
        }],
        quiz: [{ question: "Header for printf()?", options: ["stdlib.h", "stdio.h", "string.h", "math.h"], correct: 1 }]
    },
    html: {
        name: "HTML & CSS", icon: "🌐",
        topics: [{
            title: "Introduction to HTML", readTime: 45,
            concepts: ["HTML uses tags", "Tags have open/close pairs", "head vs body", "Common tags: h1, p, a, img"],
            gateQuiz: { question: "What does HTML stand for?", options: ["Hyper Text Making Language", "HyperText Markup Language", "Home Tool Markup Language", "Hyper Transfer ML"], correct: 1, explanation: "HTML = HyperText Markup Language." },
            content: '<h2>🌐 Introduction to HTML</h2><p class="subtitle">The skeleton of every website</p><div class="code-container"><button class="copy-btn" onclick="copyCode(this)">📋 Copy</button><div class="code-block"><span class="operator">&lt;!DOCTYPE html&gt;</span>\n<span class="operator">&lt;html&gt;</span>\n<span class="operator">&lt;head&gt;</span>\n    <span class="operator">&lt;title&gt;</span>My Site<span class="operator">&lt;/title&gt;</span>\n<span class="operator">&lt;/head&gt;</span>\n<span class="operator">&lt;body&gt;</span>\n    <span class="operator">&lt;h1&gt;</span>Hello!<span class="operator">&lt;/h1&gt;</span>\n    <span class="operator">&lt;p&gt;</span>Welcome.<span class="operator">&lt;/p&gt;</span>\n<span class="operator">&lt;/body&gt;</span>\n<span class="operator">&lt;/html&gt;</span></div></div><div class="how-it-works">Tags come in pairs: <code>&lt;h1&gt;</code> and <code>&lt;/h1&gt;</code>.</div>'
        }],
        quiz: [{ question: "HTML stands for?", options: ["Hyper Text Making Lang", "HyperText Markup Language", "Home Tool ML", "Hyper Transfer ML"], correct: 1 }]
    }
};

// =============================================
//  THEME TOGGLE
// =============================================
function toggleTheme() {
    var t = document.getElementById('themeToggle');
    document.documentElement.setAttribute('data-theme', t.checked ? 'light' : 'dark');
    localStorage.setItem('theme', t.checked ? 'light' : 'dark');
}

// Load saved theme on page load
(function () {
    if (localStorage.getItem('theme') === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
        document.getElementById('themeToggle').checked = true;
    }
})();

// =============================================
//  TOAST NOTIFICATIONS
// =============================================
function showToast(msg, type) {
    var t = document.getElementById('toast');
    t.textContent = msg;
    t.className = 'toast ' + (type || 'info') + ' show';
    setTimeout(function () { t.classList.remove('show'); }, 3500);
}

// =============================================
//  LANGUAGE SWITCHING
// =============================================
function switchLanguage(lang, btn) {
    currentLang = lang;
    currentTopic = 0;
    document.querySelectorAll('.lang-btn').forEach(function (b) { b.classList.remove('active'); });
    btn.classList.add('active');
    document.getElementById('progressLang').textContent = lessons[lang].name;
    renderTopicNav();
    renderLesson();
    updateProgress();
    showSection('lessons', document.querySelector('nav a'));
}

// =============================================
//  TOPIC NAVIGATION
// =============================================
function renderTopicNav() {
    var nav = document.getElementById('topicNav');
    var topics = lessons[currentLang].topics;
    nav.innerHTML = topics.map(function (t, i) {
        var state = getState(currentLang, i);
        var cls = '';
        if (i === currentTopic) cls = 'active';
        else if (state.completed) cls = 'completed';
        else if (i > 0 && !getState(currentLang, i - 1).completed) cls = 'locked';
        return '<button class="topic-btn ' + cls + '" onclick="selectTopic(' + i + ')">' + (i + 1) + '. ' + t.title + '</button>';
    }).join('');
}

function selectTopic(i) {
    if (i > 0 && !getState(currentLang, i - 1).completed) {
        showToast('🔒 Complete previous topic first!', 'error');
        return;
    }
    currentTopic = i;
    renderTopicNav();
    renderLesson();
}

// =============================================
//  PROGRESS TRACKING
// =============================================
function updateProgress() {
    var topics = lessons[currentLang].topics;
    var done = 0;
    topics.forEach(function (_, i) { if (getState(currentLang, i).completed) done++; });
    var pct = Math.round((done / topics.length) * 100);
    document.getElementById('progressFill').style.width = pct + '%';
    document.getElementById('progressStats').textContent = done + ' / ' + topics.length + ' completed (' + pct + '%)';
}

// =============================================
//  READING TIMER
// =============================================
function startReadingTimer(secs) {
    var state = getState(currentLang, currentTopic);
    var cd = document.getElementById('timerCountdown');
    var tx = document.getElementById('timerText');
    if (!cd || !tx) return;

    if (state.timerDone) {
        cd.textContent = '✅ Done!';
        cd.classList.add('timer-done');
        tx.textContent = '✅ Reading time complete!';
        return;
    }

    var remaining = secs;
    var key = currentLang + '_' + currentTopic;
    if (activeTimers[key]) clearInterval(activeTimers[key]);

    function upd() {
        var m = Math.floor(remaining / 60);
        var s = remaining % 60;
        cd.textContent = m + ':' + (s < 10 ? '0' : '') + s;
    }
    upd();

    activeTimers[key] = setInterval(function () {
        remaining--;
        upd();
        if (remaining <= 0) {
            clearInterval(activeTimers[key]);
            state.timerDone = true;
            cd.textContent = '✅ Done!';
            cd.classList.add('timer-done');
            tx.textContent = '✅ Reading time complete!';
            checkCompletion();
            showToast('⏱️ Reading done! Check concepts below.', 'success');
        }
    }, 1000);
}

// =============================================
//  CONCEPT CHECKBOXES
// =============================================
function onConceptCheck() {
    var cbs = document.querySelectorAll('.concept-cb');
    var all = true;
    cbs.forEach(function (cb) {
        var item = cb.closest('.concept-item');
        if (cb.checked) item.classList.add('checked');
        else { item.classList.remove('checked'); all = false; }
    });
    getState(currentLang, currentTopic).conceptsChecked = all;
    if (all) showToast('✅ All concepts checked! Pass the quiz.', 'success');
    checkCompletion();
}

// =============================================
//  GATE QUIZ
// =============================================
function checkGateAnswer(btn, idx) {
    var topic = lessons[currentLang].topics[currentTopic];
    var correct = topic.gateQuiz.correct;
    var state = getState(currentLang, currentTopic);
    var opts = document.querySelectorAll('.gate-option');
    var res = document.getElementById('gateResult');

    opts.forEach(function (o, i) {
        o.style.pointerEvents = 'none';
        if (i === correct) o.classList.add('correct');
    });

    if (idx === correct) {
        btn.classList.add('correct');
        res.innerHTML = '✅ Correct! ' + topic.gateQuiz.explanation;
        res.className = 'gate-result success';
        state.quizPassed = true;
        checkCompletion();
    } else {
        btn.classList.add('wrong');
        res.innerHTML = '❌ Wrong. ' + topic.gateQuiz.explanation;
        res.className = 'gate-result failure';
        setTimeout(function () {
            opts.forEach(function (o) { o.classList.remove('correct', 'wrong'); o.style.pointerEvents = 'auto'; });
            res.style.display = 'none';
        }, 3000);
    }
    res.style.display = 'block';
}

// =============================================
//  COMPLETION CHECK
// =============================================
function checkCompletion() {
    var state = getState(currentLang, currentTopic);
    if (state.timerDone && state.conceptsChecked && state.quizPassed && !state.completed) {
        state.completed = true;
        var btn = document.getElementById('unlockBtn');
        if (btn) btn.style.display = 'inline-block';
        showToast('🎉 Topic completed!', 'success');
        updateProgress();
        renderTopicNav();
    }
}

function unlockNext() {
    if (currentTopic < lessons[currentLang].topics.length - 1) {
        selectTopic(currentTopic + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
        showToast('🏆 All ' + lessons[currentLang].name + ' topics done!', 'success');
    }
}

// =============================================
//  RENDER LESSON
// =============================================
function renderLesson() {
    var topic = lessons[currentLang].topics[currentTopic];
    var state = getState(currentLang, currentTopic);
    var m = Math.floor(topic.readTime / 60);
    var s = topic.readTime % 60;

    var html = '<div class="reading-timer"><span class="timer-text" id="timerText">⏱️ Minimum reading time:</span>' +
        '<span class="timer-countdown" id="timerCountdown">' + m + ':' + (s < 10 ? '0' : '') + s + '</span></div>';
    html += '<div class="lesson-card">' + topic.content + '</div>';

    html += '<div class="concept-checklist"><h4>✅ I Understand These Concepts:</h4>';
    topic.concepts.forEach(function (c) {
        var chk = state.conceptsChecked ? 'checked' : '';
        var cls = state.conceptsChecked ? 'checked' : '';
        html += '<div class="concept-item ' + cls + '"><input type="checkbox" class="concept-cb" ' + chk + ' onchange="onConceptCheck()"><span>' + c + '</span></div>';
    });
    html += '</div>';

    html += '<div class="gate-quiz"><h3>🔓 Unlock Next Topic</h3><p class="gate-subtitle">Answer correctly to proceed</p>' +
        '<p class="gate-question">' + topic.gateQuiz.question + '</p>';
    topic.gateQuiz.options.forEach(function (opt, i) {
        html += '<div class="gate-option" onclick="checkGateAnswer(this,' + i + ')">' + opt + '</div>';
    });
    html += '<div class="gate-result" id="gateResult" style="display:none"></div>' +
        '<button class="unlock-btn" id="unlockBtn" onclick="unlockNext()" ' + (state.completed ? 'style="display:inline-block"' : '') + '>🚀 Next Topic</button></div>';

    document.getElementById('lessonContent').innerHTML = html;
    document.getElementById('lessonContent').style.display = 'block';
    document.getElementById('practiceSection').style.display = 'none';
    document.getElementById('quizSection').style.display = 'none';
    startReadingTimer(topic.readTime);
}

// =============================================
//  SECTION NAVIGATION
// =============================================
function showSection(section, navLink) {
    document.querySelectorAll('nav a').forEach(function (a) { a.classList.remove('active-nav'); });
    if (navLink) navLink.classList.add('active-nav');

    if (section === 'lessons') {
        renderLesson();
    } else if (section === 'practice') {
        document.getElementById('lessonContent').style.display = 'none';
        document.getElementById('quizSection').style.display = 'none';
        renderPractice();
        document.getElementById('practiceSection').style.display = 'block';
    } else if (section === 'quiz') {
        document.getElementById('lessonContent').style.display = 'none';
        document.getElementById('practiceSection').style.display = 'none';
        renderQuiz();
        document.getElementById('quizSection').style.display = 'block';
    }
}

// =============================================
//  PRACTICE SECTION
// =============================================
function renderPractice() {
    var lang = lessons[currentLang];
    var isJS = (currentLang === 'javascript');
    isContentEditable = false;

    var challenges = '';
    if (currentLang === 'python') {
        challenges =
            '<div class="challenge-card"><span class="diff diff-e">Easy</span><h4>Challenge 1</h4><p>Type: <code>print("Hello, World!")</code></p></div>' +
            '<div class="challenge-card"><span class="diff diff-e">Easy</span><h4>Challenge 2</h4><p>Type: <code>print(15 + 27)</code></p></div>' +
            '<div class="challenge-card"><span class="diff diff-m">Medium</span><h4>Challenge 3</h4><p>Create variables for name and age, print them.</p></div>' +
            '<div class="challenge-card"><span class="diff diff-h">Hard</span><h4>Challenge 4</h4><p>Use a for loop to print 1 to 10.</p></div>';
    } else if (currentLang === 'javascript') {
        challenges =
            '<div class="challenge-card"><span class="diff diff-e">Easy</span><h4>Challenge 1</h4><p>Type: <code>console.log("Hello!");</code> and Run!</p></div>' +
            '<div class="challenge-card"><span class="diff diff-e">Easy</span><h4>Challenge 2</h4><p>Type: <code>console.log(10 + 20);</code></p></div>' +
            '<div class="challenge-card"><span class="diff diff-m">Medium</span><h4>Challenge 3</h4><p>Create a variable and log it.</p></div>';
    } else {
        challenges = '<div class="challenge-card"><p>⚠️ ' + lang.name + ' can\'t run in browser. Switch to <strong>JavaScript</strong> or use <a href="https://replit.com" target="_blank" style="color:var(--accent-primary)">Replit.com</a>.</p></div>';
    }

    document.getElementById('practiceSection').innerHTML =
        '<div class="practice-section">' +
        '<h3>✍️ Practice ' + lang.name + '</h3>' +
        '<p style="color:var(--text-secondary);margin-bottom:14px;font-size:13px">' +
        (isJS ? 'Write JavaScript and click Run! Letters change color as you type.' : 'Write ' + lang.name + ' code. Letters change color as you type!') + '</p>' +
        '<div class="editor-box">' +
        '<div class="editor-top">' +
        '<div class="dots"><span class="dot-r"></span><span class="dot-y"></span><span class="dot-g"></span></div>' +
        '<span class="editor-label">' + lang.icon + ' ' + lang.name + '</span>' +
        '</div>' +
        '<textarea id="codeInput" spellcheck="false" placeholder="Type your code here..."></textarea>' +
        '<div class="editor-bottom">' +
        '<span class="char-info" id="charInfo">0 chars</span>' +
        '<div class="btn-row">' +
        '<button class="clr-btn" onclick="clearCode()">🗑️ Clear</button>' +
        '<button class="run-btn" onclick="runCode()">▶ Run Code</button>' +
        '</div></div></div>' +
        '<div class="run-output" id="runOutput">Output will appear here...</div>' +
        '<h3 style="margin-top:20px;color:var(--accent-gold)">🎯 Challenges</h3>' + challenges +
        '</div>';

    // Attach highlighting event
    var input = document.getElementById('codeInput');
    if (input) {
        input.addEventListener('input', function () {
            if (highlightTimer) clearTimeout(highlightTimer);
            document.getElementById('charInfo').textContent = input.value.length + ' chars';
            highlightTimer = setTimeout(function () { convertToHighlighted(); }, 250);
        });
    }
}

// =============================================
//  SYNTAX HIGHLIGHTING — SINGLE LAYER
// =============================================
function convertToHighlighted() {
    var textarea = document.getElementById('codeInput');
    if (!textarea || isContentEditable) return;

    var code = textarea.value;
    if (!code.trim()) return;

    var cursorPos = textarea.selectionStart;

    // Create contenteditable div
    var div = document.createElement('div');
    div.id = 'codeInput';
    div.contentEditable = 'true';
    div.spellcheck = false;
    div.style.cssText = 'display:block;width:100%;min-height:220px;max-height:500px;background:var(--editor-bg);border:none;padding:16px;font-family:"Courier New",Consolas,monospace;font-size:14px;line-height:1.6;overflow-y:auto;outline:none;white-space:pre-wrap;word-wrap:break-word;caret-color:#ffd700;color:#e0e0e0;tab-size:4;resize:vertical;';

    div.innerHTML = colorize(code, currentLang);
    textarea.parentNode.replaceChild(div, textarea);
    isContentEditable = true;

    restoreCursor(div, cursorPos);

    // Live highlighting on input
    div.addEventListener('input', function () {
        if (highlightTimer) clearTimeout(highlightTimer);
        var info = document.getElementById('charInfo');
        if (info) info.textContent = getTextContent(div).length + ' chars';
        highlightTimer = setTimeout(function () {
            var pos = saveCursor(div);
            var text = getTextContent(div);
            div.innerHTML = colorize(text, currentLang);
            restoreCursor(div, pos);
        }, 300);
    });

    // Clean paste
    div.addEventListener('paste', function (e) {
        e.preventDefault();
        var text = (e.clipboardData || window.clipboardData).getData('text/plain');
        document.execCommand('insertText', false, text);
    });

    // Tab key
    div.addEventListener('keydown', function (e) {
        if (e.key === 'Tab') {
            e.preventDefault();
            document.execCommand('insertText', false, '    ');
        }
    });
}

function getTextContent(el) {
    var html = el.innerHTML;
    html = html.replace(/<br\s*\/?>/gi, '\n');
    html = html.replace(/<\/div><div>/gi, '\n');
    html = html.replace(/<div>/gi, '\n');
    html = html.replace(/<\/div>/gi, '');
    var tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
}

function saveCursor(el) {
    var sel = window.getSelection();
    if (!sel.rangeCount) return 0;
    var range = sel.getRangeAt(0);
    var pre = range.cloneRange();
    pre.selectNodeContents(el);
    pre.setEnd(range.startContainer, range.startOffset);
    return pre.toString().length;
}

function restoreCursor(el, pos) {
    var sel = window.getSelection();
    var range = document.createRange();
    var count = 0;
    var found = false;

    function walk(node) {
        if (found) return;
        if (node.nodeType === 3) {
            var len = node.textContent.length;
            if (count + len >= pos) {
                range.setStart(node, pos - count);
                range.collapse(true);
                found = true;
            }
            count += len;
        } else {
            for (var i = 0; i < node.childNodes.length; i++) {
                walk(node.childNodes[i]);
                if (found) return;
            }
        }
    }

    walk(el);
    if (!found) { range.selectNodeContents(el); range.collapse(false); }
    sel.removeAllRanges();
    sel.addRange(range);
    el.focus();
}

// =============================================
//  COLORIZE — TOKEN-BASED HIGHLIGHTING
// =============================================
function colorize(code, lang) {
    var escaped = code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    var lines = escaped.split('\n');
    return lines.map(function (line) { return colorizeLine(line, lang); }).join('\n');
}

function colorizeLine(line, lang) {
    var commentMarker = (lang === 'python') ? '#' : '//';
    if (lang === 'html') return colorizeHTMLLine(line);

    var idx = findComment(line, commentMarker);
    if (idx >= 0) {
        var before = line.substring(0, idx);
        var comment = line.substring(idx);
        return tokenize(before, lang) + '<span style="color:#546e7a;font-style:italic">' + comment + '</span>';
    }
    return tokenize(line, lang);
}

function findComment(line, marker) {
    var inStr = false, ch2 = '';
    for (var i = 0; i < line.length; i++) {
        var c = line[i];
        if (!inStr && (c === '"' || c === "'")) { inStr = true; ch2 = c; }
        else if (inStr && c === ch2) inStr = false;
        else if (!inStr && line.substring(i, i + marker.length) === marker) return i;
    }
    return -1;
}

function tokenize(text, lang) {
    var tokens = [];
    var i = 0;
    while (i < text.length) {
        var c = text[i];

        // Strings
        if (c === '"' || c === "'" || c === '`') {
            var start = i; var q = c; i++;
            while (i < text.length && text[i] !== q) { if (text[i] === '\\') i++; i++; }
            if (i < text.length) i++;
            tokens.push({ t: 'string', v: text.substring(start, i) }); continue;
        }

        // Numbers
        if (c >= '0' && c <= '9') {
            var ns = i;
            while (i < text.length && ((text[i] >= '0' && text[i] <= '9') || text[i] === '.')) i++;
            if (i < text.length && isW(text[i])) {
                while (i < text.length && isW(text[i])) i++;
                tokens.push({ t: 'plain', v: text.substring(ns, i) });
            } else {
                tokens.push({ t: 'number', v: text.substring(ns, i) });
            }
            continue;
        }

        // Words
        if (isW(c)) {
            var ws = i;
            while (i < text.length && isW(text[i])) i++;
            var word = text.substring(ws, i);
            tokens.push({ t: wordType(word, lang), v: word }); continue;
        }

        // Brackets
        if ('()[]{}' .indexOf(c) >= 0) { tokens.push({ t: 'bracket', v: c }); i++; continue; }

        // C preprocessor
        if (c === '#' && lang === 'c') {
            var ps = i; i++;
            while (i < text.length && isW(text[i])) i++;
            tokens.push({ t: 'keyword', v: text.substring(ps, i) }); continue;
        }

        // Operators
        if ('=+*/%!<>&|^~?:;,.-'.indexOf(c) >= 0) {
            if (c === '=' && text.substring(i, i + 5) === '=&gt;') {
                tokens.push({ t: 'operator', v: '=&gt;' }); i += 5; continue;
            }
            tokens.push({ t: 'operator', v: c }); i++; continue;
        }

        tokens.push({ t: 'plain', v: c }); i++;
    }

    var colors = { keyword: '#c792ea', string: '#c3e88d', function: '#82aaff', number: '#f78c6c', bracket: '#ffd700', operator: '#89ddff', type: '#ffcb6b' };
    return tokens.map(function (tk) {
        var col = colors[tk.t];
        if (col) return '<span style="color:' + col + (tk.t === 'keyword' ? ';font-weight:bold' : '') + '">' + tk.v + '</span>';
        return tk.v;
    }).join('');
}

function isW(c) {
    return (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z') || (c >= '0' && c <= '9') || c === '_';
}

function wordType(word, lang) {
    var kw = {
        python: ['def', 'return', 'if', 'elif', 'else', 'for', 'while', 'in', 'import', 'from', 'class', 'try', 'except', 'finally', 'with', 'as', 'lambda', 'pass', 'break', 'continue', 'and', 'or', 'not', 'is', 'True', 'False', 'None', 'yield', 'raise', 'del'],
        javascript: ['const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while', 'do', 'switch', 'case', 'break', 'continue', 'class', 'new', 'this', 'typeof', 'try', 'catch', 'finally', 'throw', 'import', 'export', 'default', 'async', 'await', 'of', 'in', 'true', 'false', 'null', 'undefined'],
        java: ['public', 'private', 'protected', 'static', 'void', 'class', 'new', 'return', 'if', 'else', 'for', 'while', 'do', 'switch', 'case', 'break', 'continue', 'try', 'catch', 'throw', 'import', 'extends', 'implements', 'final', 'this', 'super', 'true', 'false', 'null'],
        c: ['int', 'float', 'double', 'char', 'void', 'long', 'short', 'unsigned', 'return', 'if', 'else', 'for', 'while', 'do', 'switch', 'case', 'break', 'continue', 'struct', 'typedef', 'sizeof', 'const', 'static']
    };
    var fn = {
        python: ['print', 'input', 'range', 'len', 'type', 'int', 'str', 'float', 'bool', 'list', 'dict', 'set', 'abs', 'max', 'min', 'sum', 'sorted', 'enumerate', 'zip', 'map', 'filter', 'open', 'round'],
        javascript: ['console', 'log', 'alert', 'prompt', 'parseInt', 'parseFloat', 'Math', 'Array', 'Object', 'String', 'Number', 'JSON', 'document', 'window', 'setTimeout', 'push', 'pop', 'map', 'filter', 'reduce', 'forEach'],
        java: ['System', 'out', 'println', 'print', 'Scanner', 'Math', 'Arrays', 'String', 'Integer'],
        c: ['printf', 'scanf', 'main', 'malloc', 'free', 'strlen', 'strcpy']
    };
    var tp = { java: ['int', 'double', 'float', 'char', 'boolean', 'String', 'long', 'short', 'byte'] };

    if (tp[lang] && tp[lang].indexOf(word) >= 0) return 'type';
    if (kw[lang] && kw[lang].indexOf(word) >= 0) return 'keyword';
    if (fn[lang] && fn[lang].indexOf(word) >= 0) return 'function';
    return 'plain';
}

function colorizeHTMLLine(line) {
    line = line.replace(/(&lt;\/?)([\w]+)/g, function (m, p1, p2) {
        return p1 + '<span style="color:#f07178">' + p2 + '</span>';
    });
    line = line.replace(/([\w-]+)(=)/g, '<span style="color:#ffcb6b">$1</span><span style="color:#89ddff">$2</span>');
    line = line.replace(/("(?:[^"\\]|\\.)*")/g, '<span style="color:#c3e88d">$1</span>');
    return line;
}

// =============================================
//  CLEAR & RUN CODE
// =============================================
function clearCode() {
    isContentEditable = false;
    renderPractice();
    var out = document.getElementById('runOutput');
    if (out) { out.textContent = 'Output will appear here...'; out.className = 'run-output'; }
}

function getEditorCode() {
    var el = document.getElementById('codeInput');
    if (!el) return '';
    return isContentEditable ? getTextContent(el) : el.value;
}

function runCode() {
    var code = getEditorCode();
    var output = document.getElementById('runOutput');
    if (!code.trim()) {
        output.textContent = '⚠️ Write some code first!';
        output.className = 'run-output err';
        return;
    }

    if (currentLang === 'javascript') {
        try {
            var results = [];
            var oL = console.log, oW = console.warn, oE = console.error;
            console.log = function () {
                results.push(Array.prototype.slice.call(arguments).map(function (a) {
                    return typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a);
                }).join(' '));
            };
            console.warn = function () { results.push('⚠️ ' + Array.prototype.slice.call(arguments).join(' ')); };
            console.error = function () { results.push('❌ ' + Array.prototype.slice.call(arguments).join(' ')); };
            var ret = eval(code);
            console.log = oL; console.warn = oW; console.error = oE;

            if (results.length > 0) output.textContent = results.join('\n');
            else if (ret !== undefined) output.textContent = String(ret);
            else output.textContent = '✅ Executed (no output). Use console.log()!';
            output.className = 'run-output';
            showToast('✅ Code ran!', 'success');
        } catch (err) {
            output.textContent = '❌ Error: ' + err.message + '\n\n💡 Check for typos!';
            output.className = 'run-output err';
            showToast('❌ Error in code', 'error');
        }
    } else if (currentLang === 'html') {
        try {
            var frame = document.createElement('iframe');
            frame.style.display = 'none';
            document.body.appendChild(frame);
            frame.contentDocument.open();
            frame.contentDocument.write(code);
            frame.contentDocument.close();
            var txt = frame.contentDocument.body.innerText || '';
            document.body.removeChild(frame);
            output.textContent = txt ? '📄 Rendered:\n\n' + txt : '✅ HTML rendered';
            output.className = 'run-output';
        } catch (err) {
            output.textContent = '❌ Error: ' + err.message;
            output.className = 'run-output err';
        }
    } else {
        output.textContent = simulateOutput(code, currentLang);
        output.className = 'run-output';
    }
}

function simulateOutput(code, lang) {
    var outputs = [];
    var match;

    if (lang === 'python') {
        var re = /print\s*\(([\s\S]*?)\)/g;
        while ((match = re.exec(code)) !== null) {
            var parts = splitPrintArgs(match[1].trim());
            var resolved = parts.map(function (p) {
                p = p.trim();
                if ((p[0] === '"' && p[p.length - 1] === '"') || (p[0] === "'" && p[p.length - 1] === "'"))
                    return p.slice(1, -1);
                try { var v = eval(p); if (v !== undefined) return String(v); } catch (e) { }
                return p;
            });
            outputs.push(resolved.join(' '));
        }
        if (!outputs.length) return 'ℹ️ Python can\'t run in browser.\n🔧 Use replit.com\n🔄 Switch to JavaScript for live execution!';
        return '🐍 Simulated Output:\n\n' + outputs.join('\n');
    } else if (lang === 'java') {
        var re2 = /System\.out\.println\s*\(([\s\S]*?)\)/g;
        while ((match = re2.exec(code)) !== null) outputs.push(match[1].replace(/"/g, '').trim());
        if (!outputs.length) return 'ℹ️ Java needs a compiler.\n🔧 Use replit.com';
        return '☕ Simulated:\n\n' + outputs.join('\n');
    } else if (lang === 'c') {
        var re3 = /printf\s*\(\s*"((?:[^"\\]|\\.)*)"/g;
        while ((match = re3.exec(code)) !== null) outputs.push(match[1].replace(/\\n/g, '\n'));
        if (!outputs.length) return 'ℹ️ C needs a compiler.\n🔧 Use replit.com';
        return '⚙️ Simulated:\n\n' + outputs.join('');
    }
    return 'Switch to JavaScript for live execution!';
}

function splitPrintArgs(str) {
    var parts = [], inStr = false, ch = '', cur = '';
    for (var i = 0; i < str.length; i++) {
        var c = str[i];
        if (!inStr && (c === '"' || c === "'")) { inStr = true; ch = c; cur += c; }
        else if (inStr && c === ch) { inStr = false; cur += c; }
        else if (!inStr && c === ',') { parts.push(cur.trim()); cur = ''; }
        else cur += c;
    }
    parts.push(cur.trim());
    return parts;
}

// =============================================
//  FINAL QUIZ
// =============================================
function renderQuiz() {
    var qd = lessons[currentLang].quiz;
    var ln = lessons[currentLang].name;
    if (!qd || !qd.length) {
        document.getElementById('quizSection').innerHTML = '<div class="lesson-card"><h2>Quiz coming soon!</h2></div>';
        return;
    }

    var html = '<div class="quiz-section"><h3>🧠 ' + ln + ' Final Quiz</h3>';
    qd.forEach(function (q, qi) {
        html += '<div class="quiz-qb"><p>' + (qi + 1) + '. ' + q.question + '</p>';
        q.options.forEach(function (opt, oi) {
            html += '<div class="quiz-opt" onclick="checkQuiz(this,' + qi + ',' + oi + ')">' + opt + '</div>';
        });
        html += '<div class="quiz-res" id="qr-' + qi + '"></div></div>';
    });
    html += '<div class="score-box" id="scoreBox"><h2 id="scoreText"></h2><p id="scoreMsg" style="margin-top:8px;color:var(--text-secondary)"></p></div></div>';
    document.getElementById('quizSection').innerHTML = html;
    window._qs = 0;
    window._qa = 0;
}

function checkQuiz(el, qi, oi) {
    var qd = lessons[currentLang].quiz;
    var correct = qd[qi].correct;
    var res = document.getElementById('qr-' + qi);
    var opts = el.parentElement.querySelectorAll('.quiz-opt');

    opts.forEach(function (o, i) {
        o.style.pointerEvents = 'none';
        if (i === correct) o.classList.add('correct');
    });

    if (oi === correct) {
        el.classList.add('correct');
        res.textContent = '✅ Correct!';
        res.style.color = 'var(--accent-green)';
        window._qs++;
    } else {
        el.classList.add('wrong');
        res.textContent = '❌ Wrong — correct is green';
        res.style.color = 'var(--accent-red)';
    }
    res.style.display = 'block';
    window._qa++;

    if (window._qa === qd.length) {
        var pct = Math.round((window._qs / qd.length) * 100);
        document.getElementById('scoreText').textContent = 'Score: ' + window._qs + '/' + qd.length + ' (' + pct + '%)';
        document.getElementById('scoreMsg').textContent = pct >= 80 ? '🎉 Excellent, Samuel!' : pct >= 60 ? '👍 Good! Review what you missed.' : '📚 Keep studying!';
        document.getElementById('scoreBox').style.display = 'block';
    }
}

// =============================================
//  UTILITY
// =============================================
function copyCode(btn) {
    var block = btn.nextElementSibling;
    navigator.clipboard.writeText(block.innerText).then(function () {
        btn.textContent = '✅ Copied!';
        setTimeout(function () { btn.textContent = '📋 Copy'; }, 2000);
    });
}

// =============================================
//  INITIALIZE
// =============================================
renderTopicNav();
renderLesson();
updateProgress();
