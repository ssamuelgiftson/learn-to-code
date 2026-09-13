// =============================================
//  SECTION 1: STATE MANAGEMENT WITH LOCALSTORAGE
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
    } catch (e) {
        completionState = {};
    }
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
        completionState[k] = {
            timerDone: false,
            remainingTime: -1,
            conceptsChecked: false,
            quizPassed: false,
            completed: false
        };
    }
    if (completionState[k].remainingTime === undefined) {
        completionState[k].remainingTime = -1;
    }
    return completionState[k];
}

loadState();

// =============================================
//  SECTION 2: LESSON DATA
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
                    options: [
                        "Sends to printer",
                        "Displays output on screen",
                        "Creates a variable",
                        "Deletes code"
                    ],
                    correct: 1,
                    explanation: "print() displays text/values on the screen."
                },
                content: '<h2>🐍 Introduction to Python</h2>' +
                    '<p class="subtitle">What is Python and why learn it?</p>' +
                    '<p>Python was created by <strong>Guido van Rossum</strong> in 1991. Known for being easy to read and learn.</p>' +
                    '<h3>Why Learn Python?</h3>' +
                    '<ul>' +
                    '<li><strong>Easy to read</strong> — looks like English</li>' +
                    '<li><strong>Versatile</strong> — web, AI, data science, games</li>' +
                    '<li><strong>Huge community</strong> — millions of developers</li>' +
                    '<li><strong>High demand</strong> — top skill in tech</li>' +
                    '</ul>' +
                    '<h3>Your First Program</h3>' +
                    '<div class="code-container">' +
                    '<button class="copy-btn" onclick="copyCode(this)">📋 Copy</button>' +
                    '<div class="code-block">' +
                    '<span class="comment"># This is a comment</span>\n' +
                    '<span class="function">print</span>(<span class="string">"Hello, World!"</span>)\n' +
                    '<span class="function">print</span>(<span class="string">"My name is Samuel Giftson"</span>)\n' +
                    '<span class="function">print</span>(<span class="string">"I am learning Python!"</span>)' +
                    '</div></div>' +
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
                    '<div class="code-container">' +
                    '<button class="copy-btn" onclick="copyCode(this)">📋 Copy</button>' +
                    '<div class="code-block">' +
                    '<span class="comment"># String — text</span>\n' +
                    'name = <span class="string">"Samuel"</span>\n\n' +
                    '<span class="comment"># Integer — whole number</span>\n' +
                    'age = <span class="number">13</span>\n\n' +
                    '<span class="comment"># Float — decimal</span>\n' +
                    'height = <span class="number">5.4</span>\n\n' +
                    '<span class="comment"># Boolean — True/False</span>\n' +
                    'is_student = <span class="keyword">True</span>\n\n' +
                    '<span class="function">print</span>(<span class="string">"Name:"</span>, name)\n' +
                    '<span class="function">print</span>(<span class="string">"Age:"</span>, age)\n' +
                    '<span class="function">print</span>(<span class="function">type</span>(name))' +
                    '</div></div>' +
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
                    '<div class="code-container">' +
                    '<button class="copy-btn" onclick="copyCode(this)">📋 Copy</button>' +
                    '<div class="code-block">' +
                    'a = <span class="number">15</span>\n' +
                    'b = <span class="number">4</span>\n\n' +
                    '<span class="function">print</span>(<span class="string">"Add:"</span>, a + b)         <span class="comment"># 19</span>\n' +
                    '<span class="function">print</span>(<span class="string">"Subtract:"</span>, a - b)    <span class="comment"># 11</span>\n' +
                    '<span class="function">print</span>(<span class="string">"Multiply:"</span>, a * b)    <span class="comment"># 60</span>\n' +
                    '<span class="function">print</span>(<span class="string">"Divide:"</span>, a / b)      <span class="comment"># 3.75</span>\n' +
                    '<span class="function">print</span>(<span class="string">"Floor:"</span>, a // b)      <span class="comment"># 3</span>\n' +
                    '<span class="function">print</span>(<span class="string">"Remainder:"</span>, a % b)   <span class="comment"># 3</span>\n' +
                    '<span class="function">print</span>(<span class="string">"Power:"</span>, a ** b)      <span class="comment"># 50625</span>' +
                    '</div></div>' +
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
                    '<div class="code-container">' +
                    '<button class="copy-btn" onclick="copyCode(this)">📋 Copy</button>' +
                    '<div class="code-block">' +
                    'marks = <span class="number">85</span>\n\n' +
                    '<span class="keyword">if</span> marks >= <span class="number">90</span>:\n' +
                    '    <span class="function">print</span>(<span class="string">"Grade: A+"</span>)\n' +
                    '<span class="keyword">elif</span> marks >= <span class="number">80</span>:\n' +
                    '    <span class="function">print</span>(<span class="string">"Grade: A"</span>)\n' +
                    '<span class="keyword">elif</span> marks >= <span class="number">70</span>:\n' +
                    '    <span class="function">print</span>(<span class="string">"Grade: B"</span>)\n' +
                    '<span class="keyword">else</span>:\n' +
                    '    <span class="function">print</span>(<span class="string">"Need improvement"</span>)' +
                    '</div></div>' +
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
                    '<div class="code-container">' +
                    '<button class="copy-btn" onclick="copyCode(this)">📋 Copy</button>' +
                    '<div class="code-block">' +
                    '<span class="keyword">for</span> i <span class="keyword">in</span> <span class="function">range</span>(<span class="number">1</span>, <span class="number">6</span>):\n' +
                    '    <span class="function">print</span>(<span class="string">"Number:"</span>, i)\n\n' +
                    'subjects = [<span class="string">"Math"</span>, <span class="string">"Science"</span>, <span class="string">"Hindi"</span>]\n' +
                    '<span class="keyword">for</span> s <span class="keyword">in</span> subjects:\n' +
                    '    <span class="function">print</span>(<span class="string">"I study:"</span>, s)\n\n' +
                    'count = <span class="number">3</span>\n' +
                    '<span class="keyword">while</span> count > <span class="number">0</span>:\n' +
                    '    <span class="function">print</span>(count)\n' +
                    '    count = count - <span class="number">1</span>\n' +
                    '<span class="function">print</span>(<span class="string">"🚀 Liftoff!"</span>)' +
                    '</div></div>' +
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
                    '<div class="code-container">' +
                    '<button class="copy-btn" onclick="copyCode(this)">📋 Copy</button>' +
                    '<div class="code-block">' +
                    '<span class="keyword">def</span> <span class="function">greet</span>(name):\n' +
                    '    <span class="function">print</span>(<span class="string">"Hello, "</span> + name + <span class="string">"!"</span>)\n\n' +
                    '<span class="function">greet</span>(<span class="string">"Samuel"</span>)\n\n' +
                    '<span class="keyword">def</span> <span class="function">add_marks</span>(math, science, hindi):\n' +
                    '    total = math + science + hindi\n' +
                    '    average = total / <span class="number">3</span>\n' +
                    '    <span class="keyword">return</span> total, average\n\n' +
                    'total, avg = <span class="function">add_marks</span>(<span class="number">90</span>, <span class="number">85</span>, <span class="number">88</span>)\n' +
                    '<span class="function">print</span>(<span class="string">"Total:"</span>, total)\n' +
                    '<span class="function">print</span>(<span class="string">"Average:"</span>, avg)' +
                    '</div></div>' +
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
                title: "Introduction to JavaScript", readTime: 45,
                concepts: ["JavaScript runs in the browser", "console.log() prints to console", "Statements end with semicolons", "F12 opens browser console"],
                gateQuiz: { question: "Where does console.log() show output?", options: ["On the webpage", "In browser dev console (F12)", "In a popup", "In a file"], correct: 1, explanation: "console.log() outputs to the developer console." },
                content: '<h2>⚡ Introduction to JavaScript</h2><p class="subtitle">The language of the web</p><p>JavaScript makes websites interactive!</p><div class="code-container"><button class="copy-btn" onclick="copyCode(this)">📋 Copy</button><div class="code-block"><span class="comment">// Print to console</span>\n<span class="function">console</span>.<span class="function">log</span>(<span class="string">"Hello, World!"</span>);\n<span class="function">console</span>.<span class="function">log</span>(<span class="string">"I am Samuel"</span>);</div></div><div class="output-box">Hello, World!\nI am Samuel</div><div class="how-it-works"><code>console.log()</code> prints to browser console. Every statement ends with <code>;</code>.</div><div class="tip-box">Press F12, go to Console tab, type <code>console.log("Hi!");</code> and press Enter!</div>'
            },
            {
                title: "Variables & Types", readTime: 50,
                concepts: ["let vs const vs var", "const cannot be reassigned", "typeof checks data types", "JS has only one number type"],
                gateQuiz: { question: "Which creates an unchangeable variable?", options: ["let", "var", "const", "static"], correct: 2, explanation: "const creates a constant." },
                content: '<h2>📦 Variables</h2><p class="subtitle">Three ways to store data</p><div class="code-container"><button class="copy-btn" onclick="copyCode(this)">📋 Copy</button><div class="code-block"><span class="keyword">let</span> age = <span class="number">13</span>;\nage = <span class="number">14</span>;  <span class="comment">// ✅ Works</span>\n\n<span class="keyword">const</span> name = <span class="string">"Samuel"</span>;\n<span class="comment">// name = "X"; ❌ ERROR!</span>\n\n<span class="function">console</span>.<span class="function">log</span>(<span class="keyword">typeof</span> age);   <span class="comment">// "number"</span>\n<span class="function">console</span>.<span class="function">log</span>(<span class="keyword">typeof</span> name);  <span class="comment">// "string"</span></div></div><div class="how-it-works"><code>let</code> for changing values. <code>const</code> for constants. Avoid <code>var</code>.</div>'
            },
            {
                title: "Conditions & Loops", readTime: 55,
                concepts: ["if/else uses curly braces {}", "for(init; condition; update)", "=== checks value AND type", "for...of loops arrays"],
                gateQuiz: { question: "What does === check?", options: ["Only value", "Only type", "Value AND type", "Assignment"], correct: 2, explanation: "=== checks both value and type." },
                content: '<h2>🔀 Conditions & Loops</h2><p class="subtitle">Decisions and repetition</p><div class="code-container"><button class="copy-btn" onclick="copyCode(this)">📋 Copy</button><div class="code-block"><span class="keyword">let</span> marks = <span class="number">85</span>;\n<span class="keyword">if</span> (marks >= <span class="number">90</span>) {\n    <span class="function">console</span>.<span class="function">log</span>(<span class="string">"A+"</span>);\n} <span class="keyword">else if</span> (marks >= <span class="number">80</span>) {\n    <span class="function">console</span>.<span class="function">log</span>(<span class="string">"A"</span>);\n} <span class="keyword">else</span> {\n    <span class="function">console</span>.<span class="function">log</span>(<span class="string">"Keep trying!"</span>);\n}\n\n<span class="keyword">for</span> (<span class="keyword">let</span> i = <span class="number">1</span>; i <= <span class="number">5</span>; i++) {\n    <span class="function">console</span>.<span class="function">log</span>(<span class="string">"Count:"</span>, i);\n}</div></div><div class="how-it-works">JS uses <code>{}</code> for code blocks. For loop: start, condition, increment.</div>'
            },
            {
                title: "Functions", readTime: 50,
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
            gateQuiz: { question: "Entry point of Java program?", options: ["start()", "main()", "run()", "begin()"], correct: 1, explanation: "main() starts Java." },
            content: '<h2>☕ Introduction to Java</h2><p class="subtitle">Write once, run anywhere</p><div class="code-container"><button class="copy-btn" onclick="copyCode(this)">📋 Copy</button><div class="code-block"><span class="keyword">public class</span> <span class="type">Main</span> {\n    <span class="keyword">public static void</span> <span class="function">main</span>(<span class="type">String</span>[] args) {\n        System.out.<span class="function">println</span>(<span class="string">"Hello, World!"</span>);\n    }\n}</div></div><div class="output-box">Hello, World!</div><div class="how-it-works">Every Java program lives in a <code>class</code>. <code>main</code> is the starting point.</div>'
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
//  SECTION 3: THEME TOGGLE
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
//  SECTION 4: TOAST NOTIFICATIONS
// =============================================
function showToast(msg, type) {
    var t = document.getElementById('toast');
    t.textContent = msg;
    t.className = 'toast ' + (type || 'info') + ' show';
    setTimeout(function () { t.classList.remove('show'); }, 3500);
}

// =============================================
//  SECTION 5: LANGUAGE & TOPIC NAVIGATION
// =============================================
function switchLanguage(lang, btn) {
    pauseCurrentTimer();
    currentLang = lang;
    currentTopic = 0;
    document.querySelectorAll('.lang-btn').forEach(function (b) { b.classList.remove('active'); });
    btn.classList.add('active');
    document.getElementById('progressLang').textContent = lessons[lang].name;
    renderTopicNav();
    renderLesson();
    updateProgress();
    saveState();
    showSection('lessons', document.querySelector('nav a'));
}

function renderTopicNav() {
    var nav = document.getElementById('topicNav');
    var topics = lessons[currentLang].topics;
    nav.innerHTML = topics.map(function (t, i) {
        var s = getState(currentLang, i);
        var cls = '';
        if (i === currentTopic) cls = 'active';
        else if (s.completed) cls = 'completed';
        else if (i > 0 && !getState(currentLang, i - 1).completed) cls = 'locked';
        return '<button class="topic-btn ' + cls + '" onclick="selectTopic(' + i + ')">' + (i + 1) + '. ' + t.title + '</button>';
    }).join('');
}

function selectTopic(i) {
    if (i > 0 && !getState(currentLang, i - 1).completed) {
        showToast('🔒 Complete previous topic first!', 'error');
        return;
    }
    pauseCurrentTimer();
    currentTopic = i;
    renderTopicNav();
    renderLesson();
    saveState();
}

function updateProgress() {
    var topics = lessons[currentLang].topics;
    var done = 0;
    topics.forEach(function (_, i) { if (getState(currentLang, i).completed) done++; });
    var pct = Math.round((done / topics.length) * 100);
    document.getElementById('progressFill').style.width = pct + '%';
    document.getElementById('progressStats').textContent = done + ' / ' + topics.length + ' completed (' + pct + '%)';
}

// =============================================
//  SECTION 6: READING TIMER (PERSISTS)
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
    var cd = document.getElementById('timerCountdown');
    var tx = document.getElementById('timerText');
    if (!cd || !tx) return;

    if (s.timerDone) {
        cd.textContent = '✅ Done!';
        cd.classList.add('timer-done');
        tx.textContent = '✅ Reading time complete!';
        return;
    }

    var rem = s.remainingTime >= 0 ? s.remainingTime : totalSecs;
    if (s.remainingTime < 0) s.remainingTime = totalSecs;

    var key = currentLang + '_' + currentTopic;
    if (activeTimers[key]) { clearInterval(activeTimers[key].id); delete activeTimers[key]; }

    function upd() {
        var m = Math.floor(rem / 60);
        var sc = rem % 60;
        cd.textContent = m + ':' + (sc < 10 ? '0' : '') + sc;
    }
    upd();

    var id = setInterval(function () {
        rem--;
        s.remainingTime = rem;
        upd();
        if (rem % 5 === 0) saveState();
        if (rem <= 0) {
            clearInterval(id);
            delete activeTimers[key];
            s.timerDone = true;
            s.remainingTime = 0;
            saveState();
            cd.textContent = '✅ Done!';
            cd.classList.add('timer-done');
            tx.textContent = '✅ Reading time complete!';
            checkCompletion();
            showToast('⏱️ Reading done! Check concepts below.', 'success');
        }
    }, 1000);

    activeTimers[key] = { id: id, rem: rem };
}

// =============================================
//  SECTION 7: CONCEPTS & GATE QUIZ
// =============================================
function onConceptCheck() {
    var cbs = document.querySelectorAll('.concept-cb');
    var all = true;
    cbs.forEach(function (cb) {
        var it = cb.closest('.concept-item');
        if (cb.checked) it.classList.add('checked');
        else { it.classList.remove('checked'); all = false; }
    });
    getState(currentLang, currentTopic).conceptsChecked = all;
    saveState();
    if (all) showToast('✅ All checked! Pass the quiz.', 'success');
    checkCompletion();
}

function checkGateAnswer(btn, idx) {
    var t = lessons[currentLang].topics[currentTopic];
    var c = t.gateQuiz.correct;
    var s = getState(currentLang, currentTopic);
    var opts = document.querySelectorAll('.gate-option');
    var res = document.getElementById('gateResult');

    opts.forEach(function (o, i) {
        o.style.pointerEvents = 'none';
        if (i === c) o.classList.add('correct');
    });

    if (idx === c) {
        btn.classList.add('correct');
        res.innerHTML = '✅ Correct! ' + t.gateQuiz.explanation;
        res.className = 'gate-result success';
        s.quizPassed = true;
        saveState();
        checkCompletion();
    } else {
        btn.classList.add('wrong');
        res.innerHTML = '❌ Wrong. ' + t.gateQuiz.explanation;
        res.className = 'gate-result failure';
        setTimeout(function () {
            opts.forEach(function (o) {
                o.classList.remove('correct', 'wrong');
                o.style.pointerEvents = 'auto';
            });
            res.style.display = 'none';
        }, 3000);
    }
    res.style.display = 'block';
}

function checkCompletion() {
    var s = getState(currentLang, currentTopic);
    if (s.timerDone && s.conceptsChecked && s.quizPassed && !s.completed) {
        s.completed = true;
        saveState();
        var b = document.getElementById('unlockBtn');
        if (b) b.style.display = 'inline-block';
        showToast('🎉 Topic completed!', 'success');
        updateProgress();
        renderTopicNav();
    }
}

function unlockNext() {
    if (currentTopic < lessons[currentLang].topics.length - 1) {
        pauseCurrentTimer();
        selectTopic(currentTopic + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
        showToast('🏆 All ' + lessons[currentLang].name + ' topics done!', 'success');
    }
}

// =============================================
//  SECTION 8: RENDER LESSON
// =============================================
function renderLesson() {
    var t = lessons[currentLang].topics[currentTopic];
    var s = getState(currentLang, currentTopic);
    var m = Math.floor(t.readTime / 60);
    var sc = t.readTime % 60;

    var h = '<div class="reading-timer">' +
        '<span class="timer-text" id="timerText">⏱️ Minimum reading time:</span>' +
        '<span class="timer-countdown" id="timerCountdown">' + m + ':' + (sc < 10 ? '0' : '') + sc + '</span>' +
        '</div>';

    h += '<div class="lesson-card">' + t.content + '</div>';

    h += '<div class="concept-checklist"><h4>✅ I Understand These Concepts:</h4>';
    t.concepts.forEach(function (c) {
        var chk = s.conceptsChecked ? 'checked' : '';
        var cls = s.conceptsChecked ? 'checked' : '';
        h += '<div class="concept-item ' + cls + '">' +
            '<input type="checkbox" class="concept-cb" ' + chk + ' onchange="onConceptCheck()">' +
            '<span>' + c + '</span></div>';
    });
    h += '</div>';

    h += '<div class="gate-quiz">' +
        '<h3>🔓 Unlock Next Topic</h3>' +
        '<p class="gate-subtitle">Answer correctly to proceed</p>' +
        '<p class="gate-question">' + t.gateQuiz.question + '</p>';
    t.gateQuiz.options.forEach(function (o, i) {
        h += '<div class="gate-option" onclick="checkGateAnswer(this,' + i + ')">' + o + '</div>';
    });
    h += '<div class="gate-result" id="gateResult" style="display:none"></div>' +
        '<button class="unlock-btn" id="unlockBtn" onclick="unlockNext()" ' +
        (s.completed ? 'style="display:inline-block"' : '') + '>🚀 Next Topic</button>' +
        '</div>';

    document.getElementById('lessonContent').innerHTML = h;
    document.getElementById('lessonContent').style.display = 'block';
    document.getElementById('practiceSection').style.display = 'none';
    document.getElementById('quizSection').style.display = 'none';
    startReadingTimer(t.readTime);
}

// =============================================
//  SECTION 9: SECTION NAVIGATION
// =============================================
function showSection(section, navLink) {
    document.querySelectorAll('nav a').forEach(function (a) { a.classList.remove('active-nav'); });
    if (navLink) navLink.classList.add('active-nav');

    if (section === 'lessons') {
        renderLesson();
    } else if (section === 'practice') {
        pauseCurrentTimer();
        document.getElementById('lessonContent').style.display = 'none';
        document.getElementById('quizSection').style.display = 'none';
        renderPractice();
        document.getElementById('practiceSection').style.display = 'block';
    } else if (section === 'quiz') {
        pauseCurrentTimer();
        document.getElementById('lessonContent').style.display = 'none';
        document.getElementById('practiceSection').style.display = 'none';
        renderQuiz();
        document.getElementById('quizSection').style.display = 'block';
    }
}

// =============================================
//  SECTION 10: PRACTICE SECTION
// =============================================
function getPlaceholder(lang) {
    var p = {
        python: 'print("Hello, World!")',
        javascript: 'console.log("Hello!");',
        java: 'System.out.println("Hello!");',
        c: 'printf("Hello!\\n");',
        html: '<h1>Hello!</h1>'
    };
    return p[lang] || '';
}

function renderPractice() {
    var lang = lessons[currentLang];
    var isJS = (currentLang === 'javascript');
    previewVisible = false;

    var challenges = '';
    if (currentLang === 'python') {
        challenges =
            '<div class="challenge-card"><span class="diff diff-e">Easy</span><h4>🎯 Hello World</h4><p>Type: <code>print("Hello, World!")</code></p>' +
            '<button class="try-btn" onclick="loadChallenge(\'print(\\\"Hello, World!\\\")\\n\')">📝 Load</button></div>' +
            '<div class="challenge-card"><span class="diff diff-e">Easy</span><h4>🎯 Math</h4><p>Type: <code>print(15 + 27)</code></p>' +
            '<button class="try-btn" onclick="loadChallenge(\'print(15 + 27)\\n\')">📝 Load</button></div>' +
            '<div class="challenge-card"><span class="diff diff-m">Medium</span><h4>🎯 Variables</h4><p>Create name and age variables, print them</p>' +
            '<button class="try-btn" onclick="loadChallenge(\'name = \\\"Samuel\\\"\\nage = 13\\nprint(\\\"Name:\\\", name)\\nprint(\\\"Age:\\\", age)\\n\')">📝 Load</button></div>' +
            '<div class="challenge-card"><span class="diff diff-h">Hard</span><h4>🎯 Loop</h4><p>Print numbers 1 to 5 using a for loop</p>' +
            '<button class="try-btn" onclick="loadChallenge(\'for i in range(1, 6):\\n    print(i)\\n\')">📝 Load</button></div>';
    } else if (currentLang === 'javascript') {
        challenges =
            '<div class="challenge-card"><span class="diff diff-e">Easy</span><h4>🎯 Hello World</h4><p>Type: <code>console.log("Hello!");</code></p>' +
            '<button class="try-btn" onclick="loadChallenge(\'console.log(\\\"Hello, World!\\\");\\n\')">📝 Load</button></div>' +
            '<div class="challenge-card"><span class="diff diff-m">Medium</span><h4>🎯 Variables</h4><p>Create and log a variable</p>' +
            '<button class="try-btn" onclick="loadChallenge(\'let name = \\\"Samuel\\\";\\nconsole.log(\\\"Hello,\\\", name);\\n\')">📝 Load</button></div>';
    } else {
        challenges = '<div class="challenge-card"><p>⚠️ ' + lang.name + ' runs via API! Type your code and click Run.</p></div>';
    }

    document.getElementById('practiceSection').innerHTML =
        '<div class="practice-section">' +
        '<h3>✍️ Practice ' + lang.name + '</h3>' +
        '<p style="color:var(--text-secondary);margin-bottom:14px;font-size:13px">' +
        'Type code in the editor. Click <strong>👁️ Preview</strong> for syntax colors. Click <strong>▶ Run</strong> for real output!</p>' +

        '<div class="editor-box">' +
        '<div class="editor-top">' +
        '<div class="dots"><span class="dot-r"></span><span class="dot-y"></span><span class="dot-g"></span></div>' +
        '<span class="editor-label">' + lang.icon + ' ' + lang.name + '</span>' +
        '</div>' +

        '<div class="editor-main" style="position:relative">' +
        '<div class="line-numbers" id="lineNums">1</div>' +
        '<textarea id="codeInput" spellcheck="false" placeholder="Type your ' + lang.name + ' code here...\n\nExample:\n' + getPlaceholder(currentLang) + '" oninput="onCodeInput()" onscroll="syncLineNumbers()"></textarea>' +
        '</div>' +

        '<div class="preview-toggle-bar">' +
        '<span id="charInfo">0 chars | 1 line</span>' +
        '<button class="preview-btn" id="previewBtn" onclick="togglePreview()">👁️ Preview</button>' +
        '</div>' +

        '<div class="code-preview" id="codePreview"></div>' +

        '<div class="editor-bottom">' +
        '<span style="color:#888;font-size:11px">🌐 Runs via Piston API (real output!)</span>' +
        '<div class="btn-row">' +
        '<button class="clr-btn" onclick="clearCode()">🗑️ Clear</button>' +
        '<button class="run-btn" onclick="runCode()">▶ Run Code</button>' +
        '</div></div></div>' +

        '<div class="output-wrapper" id="outputWrapper">' +
        '<div class="output-tab-bar">' +
        '<div class="output-tab active">📟 Output</div>' +
        '<div style="flex:1"></div>' +
        '<span class="output-status waiting" id="outputStatus">⏳ Waiting</span>' +
        '</div>' +
        '<div class="run-output" id="runOutput"><span class="output-empty">Run your code to see output here...</span></div>' +
        '<div class="execution-info" id="execInfo"><span>Ready</span><span></span></div>' +
        '</div>' +

        '<div class="challenge-header"><h3>🎯 Challenges</h3></div>' +
        challenges +
        '</div>';
}

function loadChallenge(code) {
    var input = document.getElementById('codeInput');
    if (input) { input.value = code; onCodeInput(); input.focus(); }
    showToast('📝 Template loaded! Click Run.', 'info');
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

// Tab key support
document.addEventListener('keydown', function (e) {
    if (e.target.id === 'codeInput' && e.key === 'Tab') {
        e.preventDefault();
        var input = e.target;
        var start = input.selectionStart;
        var end = input.selectionEnd;
        input.value = input.value.substring(0, start) + '    ' + input.value.substring(end);
        input.selectionStart = input.selectionEnd = start + 4;
        onCodeInput();
    }
});

// =============================================
//  SECTION 11: SYNTAX PREVIEW (SEPARATE PANEL)
// =============================================
function togglePreview() {
    previewVisible = !previewVisible;
    var preview = document.getElementById('codePreview');
    var btn = document.getElementById('previewBtn');
    if (previewVisible) {
        preview.classList.add('visible');
        btn.classList.add('active');
        btn.textContent = '👁️ Hide Preview';
        updatePreview();
    } else {
        preview.classList.remove('visible');
        btn.classList.remove('active');
        btn.textContent = '👁️ Preview';
    }
}

function updatePreview() {
    var input = document.getElementById('codeInput');
    var preview = document.getElementById('codePreview');
    if (!input || !preview) return;
    var code = input.value;
    if (!code.trim()) {
        preview.innerHTML = '<span class="output-empty">Type code to see preview...</span>';
        return;
    }
    preview.innerHTML = colorize(code, currentLang);
}

// =============================================
//  SECTION 12: COLORIZE FOR PREVIEW
// =============================================
function colorize(code, lang) {
    var e = code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return e.split('\n').map(function (line) { return colorizeLine(line, lang); }).join('\n');
}

function colorizeLine(line, lang) {
    var marker = (lang === 'python') ? '#' : '//';
    if (lang === 'html') return colorizeHTMLLine(line);
    var idx = findComment(line, marker);
    if (idx >= 0) {
        return tokenize(line.substring(0, idx), lang) +
            '<span class="hl-comment">' + line.substring(idx) + '</span>';
    }
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
    var tokens = [];
    var i = 0;
    while (i < text.length) {
        var c = text[i];

        // Strings
        if (c === '"' || c === "'" || c === '`') {
            var s = i, q = c; i++;
            while (i < text.length && text[i] !== q) { if (text[i] === '\\') i++; i++; }
            if (i < text.length) i++;
            tokens.push({ t: 'string', v: text.substring(s, i) });
            continue;
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
            tokens.push({ t: wordType(text.substring(ws, i), lang), v: text.substring(ws, i) });
            continue;
        }

        // Brackets
        if ('()[]{}' .indexOf(c) >= 0) { tokens.push({ t: 'bracket', v: c }); i++; continue; }

        // C preprocessor
        if (c === '#' && lang === 'c') {
            var ps = i; i++;
            while (i < text.length && isW(text[i])) i++;
            tokens.push({ t: 'keyword', v: text.substring(ps, i) });
            continue;
        }

        // Operators
        if ('=+*/%!<>&|^~?:;,.-'.indexOf(c) >= 0) {
            if (c === '=' && text.substring(i, i + 5) === '=&gt;') {
                tokens.push({ t: 'operator', v: '=&gt;' }); i += 5; continue;
            }
            tokens.push({ t: 'operator', v: c }); i++;
            continue;
        }

        tokens.push({ t: 'plain', v: c }); i++;
    }

    return tokens.map(function (tk) {
        var cls = {
            keyword: 'hl-keyword', string: 'hl-string', function: 'hl-function',
            number: 'hl-number', bracket: 'hl-bracket', operator: 'hl-operator', type: 'hl-type'
        }[tk.t];
        return cls ? '<span class="' + cls + '">' + tk.v + '</span>' : tk.v;
    }).join('');
}

function isW(c) {
    return (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z') || (c >= '0' && c <= '9') || c === '_';
}

function wordType(word, lang) {
    var kw = {
        python: ['def', 'return', 'if', 'elif', 'else', 'for', 'while', 'in', 'import', 'from', 'class', 'try', 'except', 'finally', 'with', 'as', 'lambda', 'pass', 'break', 'continue', 'and', 'or', 'not', 'is', 'True', 'False', 'None', 'yield', 'raise', 'del'],
        javascript: ['const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while', 'do', 'switch', 'case', 'break', 'continue', 'class', 'new', 'this', 'typeof', 'try', 'catch', 'finally', 'throw', 'import', 'export', 'default', 'async', 'await', 'of', 'in', 'true', 'false', 'null', 'undefined'],
        java: ['public', 'private', 'protected', 'static', 'void', 'class', 'new', 'return', 'if', 'else', 'for', 'while', 'do', 'switch', 'case', 'break', 'continue', 'try', 'catch', 'throw', 'import', 'extends', 'final', 'this', 'super', 'true', 'false', 'null'],
        c: ['int', 'float', 'double', 'char', 'void', 'long', 'short', 'unsigned', 'return', 'if', 'else', 'for', 'while', 'do', 'switch', 'case', 'break', 'continue', 'struct', 'typedef', 'sizeof', 'const', 'static']
    };
    var fn = {
        python: ['print', 'input', 'range', 'len', 'type', 'int', 'str', 'float', 'bool', 'list', 'dict', 'set', 'abs', 'max', 'min', 'sum', 'sorted', 'enumerate', 'zip', 'map', 'filter', 'open', 'round'],
        javascript: ['console', 'log', 'alert', 'prompt', 'parseInt', 'parseFloat', 'Math', 'Array', 'Object', 'String', 'Number', 'JSON', 'document', 'window', 'setTimeout', 'push', 'pop', 'map', 'filter', 'reduce', 'forEach'],
        java: ['System', 'out', 'println', 'print', 'Scanner', 'Math', 'Arrays', 'String'],
        c: ['printf', 'scanf', 'main', 'malloc', 'free', 'strlen']
    };
    var tp = { java: ['int', 'double', 'float', 'char', 'boolean', 'String', 'long', 'short', 'byte'] };

    if (tp[lang] && tp[lang].indexOf(word) >= 0) return 'type';
    if (kw[lang] && kw[lang].indexOf(word) >= 0) return 'keyword';
    if (fn[lang] && fn[lang].indexOf(word) >= 0) return 'function';
    return 'plain';
}

function colorizeHTMLLine(line) {
    line = line.replace(/(&lt;\/?)([\w]+)/g, function (m, p1, p2) {
        return p1 + '<span class="hl-tag">' + p2 + '</span>';
    });
    line = line.replace(/([\w-]+)(=)/g, '<span class="hl-attr">$1</span><span class="hl-operator">$2</span>');
    line = line.replace(/("(?:[^"\\]|\\.)*")/g, '<span class="hl-string">$1</span>');
    return line;
}

// =============================================
//  SECTION 13: RUN CODE — PISTON API + FALLBACK
// =============================================
function escOut(text) {
    return String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function getFileName(lang) {
    var names = { python: 'main.py', javascript: 'main.js', java: 'Main.java', c: 'main.c' };
    return names[lang] || 'main.txt';
}

function getPrintHint(lang) {
    var h = { python: 'print()', javascript: 'console.log()', java: 'System.out.println()', c: 'printf()' };
    return h[lang] || 'print';
}

function clearCode() {
    var input = document.getElementById('codeInput');
    if (input) input.value = '';
    onCodeInput();
    var out = document.getElementById('runOutput');
    if (out) {
        out.innerHTML = '<span class="output-empty">Run your code to see output here...</span>';
        out.className = 'run-output';
    }
    var st = document.getElementById('outputStatus');
    if (st) { st.textContent = '⏳ Waiting'; st.className = 'output-status waiting'; }
    var info = document.getElementById('execInfo');
    if (info) info.innerHTML = '<span>Ready</span><span></span>';
}

function formatOutputLines(text) {
    if (!text || !text.trim()) return '';
    var lines = text.split('\n');
    // Remove trailing empty line
    while (lines.length > 0 && lines[lines.length - 1].trim() === '') {
        lines.pop();
    }
    return lines.map(function (l, i) {
        return '<span class="output-line">' +
            '<span class="output-line-num">' + (i + 1) + '</span>' +
            escOut(l) +
            '</span>';
    }).join('\n');
}

function showSuccess(output, status, execInfo, text, elapsed, exitCode, lineCount) {
    output.innerHTML = formatOutputLines(text);
    output.className = 'run-output';
    status.textContent = '✅ Success';
    status.className = 'output-status success';
    execInfo.innerHTML = '<span>✅ Ran in ' + elapsed + 'ms</span>' +
        '<span>' + lineCount + ' line' + (lineCount !== 1 ? 's' : '') +
        (exitCode !== undefined ? ' | Exit: ' + exitCode : '') + '</span>';
}

function showError(output, status, execInfo, errorText, elapsed) {
    output.innerHTML = formatOutputLines(errorText);
    output.className = 'run-output err';
    status.textContent = '❌ Error';
    status.className = 'output-status error';
    execInfo.innerHTML = '<span>❌ Failed in ' + elapsed + 'ms</span><span>Check your code</span>';
}

function showNoOutput(output, status, execInfo, elapsed, exitCode) {
    output.innerHTML =
        '<span class="output-line"><span class="output-line-num">1</span>✅ Code executed successfully (no output)</span>\n' +
        '<span class="output-line"><span class="output-line-num"> </span></span>\n' +
        '<span class="output-line"><span class="output-line-num">💡</span>Use ' + escOut(getPrintHint(currentLang)) + ' to display output</span>';
    output.className = 'run-output';
    status.textContent = '✅ Done';
    status.className = 'output-status success';
    execInfo.innerHTML = '<span>✅ Ran in ' + elapsed + 'ms</span>' +
        '<span>No output' + (exitCode !== undefined ? ' | Exit: ' + exitCode : '') + '</span>';
}

function runCode() {
    var input = document.getElementById('codeInput');
    var code = input ? input.value : '';
    var output = document.getElementById('runOutput');
    var status = document.getElementById('outputStatus');
    var execInfo = document.getElementById('execInfo');
    var startTime = performance.now();

    // Empty check
    if (!code.trim()) {
        output.innerHTML = '<span class="output-empty">⚠️ Please write some code first!</span>';
        output.className = 'run-output err';
        status.textContent = '⚠️ Empty';
        status.className = 'output-status error';
        execInfo.innerHTML = '<span>No code to run</span><span></span>';
        return;
    }

    // Show loading
    output.innerHTML = '<span class="output-empty">⏳ Running your code...</span>';
    output.className = 'run-output';
    status.textContent = '⏳ Running...';
    status.className = 'output-status waiting';
    execInfo.innerHTML = '<span>Sending to execution server...</span><span></span>';

    // HTML runs locally in iframe
    if (currentLang === 'html') {
        runHTML(code, output, status, execInfo, startTime);
        return;
    }

    // Piston API language configurations
    var pistonLangs = {
        python: { language: 'python', version: '3.10.0' },
        javascript: { language: 'javascript', version: '18.15.0' },
        java: { language: 'java', version: '15.0.2' },
        c: { language: 'c', version: '10.2.0' }
    };

    var langConfig = pistonLangs[currentLang];

    // If no config found, fallback to local
    if (!langConfig) {
        runLocally(code, output, status, execInfo, startTime);
        return;
    }

    // Build the request body properly
    var requestBody = {
        language: langConfig.language,
        version: langConfig.version,
        files: [
            {
                name: getFileName(currentLang),
                content: code
            }
        ]
    };

    // Call Piston API
    fetch('https://emkc.org/api/v2/piston/execute', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
    })
    .then(function (response) {
        if (!response.ok) {
            throw new Error('Server error: ' + response.status);
        }
        return response.json();
    })
    .then(function (data) {
        var elapsed = (performance.now() - startTime).toFixed(0);

        // Extract output and errors
        var stdout = '';
        var stderr = '';
        var exitCode = 0;

        if (data.run) {
            stdout = data.run.stdout || '';
            stderr = data.run.stderr || '';
            exitCode = data.run.code || 0;
        }

        // Trim trailing whitespace
        stdout = stdout.trim();
        stderr = stderr.trim();

        // Case 1: Has errors only (no stdout)
        if (stderr && !stdout) {
            showError(output, status, execInfo, stderr, elapsed);
            showToast('❌ Code has errors — check output', 'error');
            return;
        }

        // Case 2: Has output (possibly with warnings)
        if (stdout) {
            var outLines = stdout.split('\n');
            while (outLines.length > 0 && outLines[outLines.length - 1].trim() === '') {
                outLines.pop();
            }

            var formattedOutput = outLines.map(function (l, i) {
                return '<span class="output-line">' +
                    '<span class="output-line-num">' + (i + 1) + '</span>' +
                    escOut(l) +
                    '</span>';
            }).join('\n');

            // Add warning if stderr exists alongside stdout
            if (stderr) {
                formattedOutput += '\n<span class="output-line" style="color:#ff9800">' +
                    '<span class="output-line-num">⚠️</span>' +
                    escOut(stderr.split('\n')[0]) +
                    '</span>';
            }

            output.innerHTML = formattedOutput;
            output.className = 'run-output';
            status.textContent = '✅ Success';
            status.className = 'output-status success';
            execInfo.innerHTML = '<span>✅ Ran in ' + elapsed + 'ms</span>' +
                '<span>' + outLines.length + ' line' + (outLines.length !== 1 ? 's' : '') +
                ' | Exit: ' + exitCode + '</span>';
            showToast('✅ Code executed successfully!', 'success');
            return;
        }

        // Case 3: No output, no error
        showNoOutput(output, status, execInfo, elapsed, exitCode);
    })
    .catch(function (error) {
        // API failed — fall back to local execution
        console.warn('Piston API failed:', error.message);
        runLocally(code, output, status, execInfo, startTime);
    });
}

// =============================================
//  HTML RUNNER (iframe)
// =============================================
function runHTML(code, output, status, execInfo, startTime) {
    try {
        var frame = document.createElement('iframe');
        frame.style.cssText = 'display:none;width:0;height:0;border:none;';
        frame.sandbox = 'allow-same-origin';
        document.body.appendChild(frame);

        frame.contentDocument.open();
        frame.contentDocument.write(code);
        frame.contentDocument.close();

        var renderedText = frame.contentDocument.body.innerText || '';
        document.body.removeChild(frame);

        var elapsed = (performance.now() - startTime).toFixed(0);

        if (renderedText.trim()) {
            var lines = renderedText.trim().split('\n');
            output.innerHTML = lines.map(function (l, i) {
                return '<span class="output-line">' +
                    '<span class="output-line-num">' + (i + 1) + '</span>' +
                    escOut(l) +
                    '</span>';
            }).join('\n');
            output.className = 'run-output';
            status.textContent = '✅ Rendered';
            status.className = 'output-status success';
            execInfo.innerHTML = '<span>✅ Rendered in ' + elapsed + 'ms</span><span>' + lines.length + ' lines</span>';
        } else {
            output.innerHTML =
                '<span class="output-line"><span class="output-line-num">1</span>✅ HTML rendered successfully</span>\n' +
                '<span class="output-line"><span class="output-line-num">2</span>No visible text content (might be styled elements)</span>';
            output.className = 'run-output';
            status.textContent = '✅ Rendered';
            status.className = 'output-status success';
            execInfo.innerHTML = '<span>✅ Rendered in ' + elapsed + 'ms</span><span>HTML</span>';
        }
        showToast('✅ HTML rendered!', 'success');
    } catch (err) {
        var elapsed2 = (performance.now() - startTime).toFixed(0);
        output.innerHTML =
            '<span class="output-line"><span class="output-line-num">!</span>❌ ' + escOut(err.message) + '</span>';
        output.className = 'run-output err';
        status.textContent = '❌ Error';
        status.className = 'output-status error';
        execInfo.innerHTML = '<span>❌ Failed in ' + elapsed2 + 'ms</span><span></span>';
        showToast('❌ HTML error', 'error');
    }
}

// =============================================
//  LOCAL FALLBACK (when API is down)
// =============================================
function runLocally(code, output, status, execInfo, startTime) {

    // JavaScript can run directly in the browser
    if (currentLang === 'javascript') {
        try {
            var results = [];
            var savedLog = console.log;
            var savedWarn = console.warn;
            var savedError = console.error;

            console.log = function () {
                var args = Array.prototype.slice.call(arguments);
                var formatted = args.map(function (a) {
                    if (a === null) return 'null';
                    if (a === undefined) return 'undefined';
                    if (typeof a === 'object') {
                        try { return JSON.stringify(a, null, 2); }
                        catch (e) { return String(a); }
                    }
                    return String(a);
                });
                results.push(formatted.join(' '));
            };

            console.warn = function () {
                results.push('⚠️ ' + Array.prototype.slice.call(arguments).join(' '));
            };

            console.error = function () {
                results.push('❌ ' + Array.prototype.slice.call(arguments).join(' '));
            };

            var returnVal = eval(code);

            // Restore console
            console.log = savedLog;
            console.warn = savedWarn;
            console.error = savedError;

            var elapsed = (performance.now() - startTime).toFixed(0);

            if (results.length > 0) {
                output.innerHTML = results.map(function (r, i) {
                    return '<span class="output-line">' +
                        '<span class="output-line-num">' + (i + 1) + '</span>' +
                        escOut(r) +
                        '</span>';
                }).join('\n');
                output.className = 'run-output';
                status.textContent = '✅ Success (local)';
                status.className = 'output-status success';
                execInfo.innerHTML = '<span>✅ Ran locally in ' + elapsed + 'ms</span>' +
                    '<span>' + results.length + ' line' + (results.length !== 1 ? 's' : '') + '</span>';
            } else if (returnVal !== undefined) {
                output.innerHTML =
                    '<span class="output-line"><span class="output-line-num">1</span>' +
                    escOut(String(returnVal)) + '</span>';
                output.className = 'run-output';
                status.textContent = '✅ Success (local)';
                status.className = 'output-status success';
                execInfo.innerHTML = '<span>✅ Ran locally in ' + elapsed + 'ms</span><span>1 line</span>';
            } else {
                showNoOutput(output, status, execInfo, elapsed);
            }
            showToast('✅ Code ran locally!', 'success');

        } catch (err) {
            // Restore console in case of error
            console.log = savedLog;
            console.warn = savedWarn;
            console.error = savedError;

            var elapsed2 = (performance.now() - startTime).toFixed(0);
            output.innerHTML =
                '<span class="output-line"><span class="output-line-num">!</span>❌ ' +
                escOut(err.name) + ': ' + escOut(err.message) + '</span>\n' +
                '<span class="output-line"><span class="output-line-num"> </span></span>\n' +
                '<span class="output-line"><span class="output-line-num">💡</span>' +
                'Check for typos, missing brackets, or undefined variables</span>';
            output.className = 'run-output err';
            status.textContent = '❌ Error';
            status.className = 'output-status error';
            execInfo.innerHTML = '<span>❌ Failed in ' + elapsed2 + 'ms</span><span>' + escOut(err.name) + '</span>';
            showToast('❌ Error in code', 'error');
        }
        return;
    }

    // For Python, Java, C — simulate output
    var elapsed3 = (performance.now() - startTime).toFixed(0);
    var simLines = simulateOutput(code, currentLang);

    if (simLines.length > 0) {
        var simHtml =
            '<span class="output-line" style="color:#ff9800">' +
            '<span class="output-line-num">⚠️</span>' +
            'API unavailable — showing simulated output:' +
            '</span>\n' +
            '<span class="output-line"><span class="output-line-num"> </span></span>\n';

        simHtml += simLines.map(function (l, i) {
            return '<span class="output-line">' +
                '<span class="output-line-num">' + (i + 1) + '</span>' +
                escOut(l) +
                '</span>';
        }).join('\n');

        output.innerHTML = simHtml;
        output.className = 'run-output';
        status.textContent = '⚠️ Simulated';
        status.className = 'output-status waiting';
        execInfo.innerHTML = '<span>⚠️ Simulated in ' + elapsed3 + 'ms</span>' +
            '<span>' + simLines.length + ' line' + (simLines.length !== 1 ? 's' : '') + '</span>';
        showToast('⚠️ API offline — simulated output shown', 'info');
    } else {
        output.innerHTML =
            '<span class="output-line"><span class="output-line-num">⚠️</span>' +
            'API server temporarily unavailable</span>\n' +
            '<span class="output-line"><span class="output-line-num"> </span></span>\n' +
            '<span class="output-line"><span class="output-line-num">🔧</span>' +
            'Try again in a moment</span>\n' +
            '<span class="output-line"><span class="output-line-num">🌐</span>' +
            'Or use <a href="https://replit.com" target="_blank" style="color:var(--accent-primary)">replit.com</a> for real execution</span>\n' +
            '<span class="output-line"><span class="output-line-num"> </span></span>\n' +
            '<span class="output-line"><span class="output-line-num">💡</span>' +
            'Make sure your code has ' + escOut(getPrintHint(currentLang)) + ' statements</span>';
        output.className = 'run-output';
        status.textContent = '⚠️ Offline';
        status.className = 'output-status waiting';
        execInfo.innerHTML = '<span>API unavailable</span><span>Try again later</span>';
    }
}

// =============================================
//  SIMULATE OUTPUT (for when API is down)
// =============================================
function simulateOutput(code, lang) {
    var outputs = [];
    var match;

    if (lang === 'python') {
        // Match print() calls
        var pyRegex = /print\s*\(([\s\S]*?)\)/g;
        while ((match = pyRegex.exec(code)) !== null) {
            var rawArgs = match[1].trim();
            if (!rawArgs) {
                outputs.push('');
                continue;
            }
            var parts = splitArgs(rawArgs);
            var resolved = parts.map(function (p) {
                p = p.trim();
                if (!p) return '';
                // String literal
                if ((p.charAt(0) === '"' && p.charAt(p.length - 1) === '"') ||
                    (p.charAt(0) === "'" && p.charAt(p.length - 1) === "'")) {
                    return p.substring(1, p.length - 1);
                }
                // Try to evaluate as math
                try {
                    var val = eval(p);
                    if (val !== undefined) return String(val);
                } catch (e) {}
                return p;
            });
            outputs.push(resolved.join(' '));
        }
    } else if (lang === 'java') {
        var javaRegex = /System\.out\.println\s*\(\s*([\s\S]*?)\s*\)/g;
        while ((match = javaRegex.exec(code)) !== null) {
            var arg = match[1].trim();
            // Remove quotes
            if (arg.charAt(0) === '"' && arg.charAt(arg.length - 1) === '"') {
                arg = arg.substring(1, arg.length - 1);
            }
            outputs.push(arg);
        }
    } else if (lang === 'c') {
        var cRegex = /printf\s*\(\s*"((?:[^"\\]|\\.)*)"/g;
        while ((match = cRegex.exec(code)) !== null) {
            var text = match[1];
            // Process escape sequences
            text = text.replace(/\\n/g, '\n');
            text = text.replace(/\\t/g, '\t');
            text = text.replace(/\\\\/g, '\\');
            // Split by newlines and add each line
            var cLines = text.split('\n');
            cLines.forEach(function (line) {
                if (line !== '' || cLines.length === 1) {
                    outputs.push(line);
                }
            });
        }
    }

    return outputs;
}

function splitArgs(str) {
    var parts = [];
    var inStr = false;
    var strChar = '';
    var current = '';
    var depth = 0;

    for (var i = 0; i < str.length; i++) {
        var c = str.charAt(i);

        if (!inStr && (c === '"' || c === "'")) {
            inStr = true;
            strChar = c;
            current += c;
        } else if (inStr && c === strChar) {
            inStr = false;
            current += c;
        } else if (!inStr && c === '(') {
            depth++;
            current += c;
        } else if (!inStr && c === ')') {
            depth--;
            current += c;
        } else if (!inStr && c === ',' && depth === 0) {
            parts.push(current.trim());
            current = '';
        } else {
            current += c;
        }
    }

    if (current.trim()) {
        parts.push(current.trim());
    }

    return parts;
}

// =============================================
//  SECTION 14: FINAL QUIZ
// =============================================
function renderQuiz() {
    var qd = lessons[currentLang].quiz;
    var ln = lessons[currentLang].name;

    if (!qd || !qd.length) {
        document.getElementById('quizSection').innerHTML = '<div class="lesson-card"><h2>Quiz coming soon!</h2></div>';
        return;
    }

    var h = '<div class="quiz-section"><h3>🧠 ' + ln + ' Final Quiz</h3>';
    qd.forEach(function (q, qi) {
        h += '<div class="quiz-qb"><p>' + (qi + 1) + '. ' + q.question + '</p>';
        q.options.forEach(function (o, oi) {
            h += '<div class="quiz-opt" onclick="checkQuiz(this,' + qi + ',' + oi + ')">' + o + '</div>';
        });
        h += '<div class="quiz-res" id="qr-' + qi + '"></div></div>';
    });
    h += '<div class="score-box" id="scoreBox"><h2 id="scoreText"></h2>' +
        '<p id="scoreMsg" style="margin-top:8px;color:var(--text-secondary)"></p></div></div>';
    document.getElementById('quizSection').innerHTML = h;
    window._qs = 0;
    window._qa = 0;
}

function checkQuiz(el, qi, oi) {
    var qd = lessons[currentLang].quiz;
    var c = qd[qi].correct;
    var res = document.getElementById('qr-' + qi);
    var opts = el.parentElement.querySelectorAll('.quiz-opt');

    opts.forEach(function (o, i) {
        o.style.pointerEvents = 'none';
        if (i === c) o.classList.add('correct');
    });

    if (oi === c) {
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
//  SECTION 15: UTILITY & INIT
// =============================================
function copyCode(btn) {
    var block = btn.nextElementSibling;
    navigator.clipboard.writeText(block.innerText).then(function () {
        btn.textContent = '✅ Copied!';
        setTimeout(function () { btn.textContent = '📋 Copy'; }, 2000);
    });
}

// Save state when leaving page
window.addEventListener('beforeunload', function () {
    pauseCurrentTimer();
    saveState();
});

// Initialize everything
(function () {
    document.querySelectorAll('.lang-btn').forEach(function (btn) {
        btn.classList.remove('active');
        var text = btn.textContent.toLowerCase();
        if (text.indexOf(currentLang) >= 0 ||
            (currentLang === 'c' && text.indexOf('⚙️') >= 0) ||
            (currentLang === 'html' && text.indexOf('🌐') >= 0)) {
            btn.classList.add('active');
        }
    });
    document.getElementById('progressLang').textContent = lessons[currentLang].name;
    renderTopicNav();
    renderLesson();
    updateProgress();
})();
