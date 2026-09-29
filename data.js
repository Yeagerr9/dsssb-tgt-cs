const PRI={A:'A',Ap:'A+',B:'B',C:'C'};
const dsssbTech=[
['Programming: C/C++/OOP/Java',14,PRI.Ap,['Data types, casting, sizeof','Operators, precedence, associativity','Control flow and output tracing','Functions, scope, storage classes','Arrays and strings','Pointers and pointer arithmetic','Structures, unions, typedef','Classes, objects, constructors','Inheritance and polymorphism','Overloading vs overriding','Java JVM/JRE/JDK','Java exceptions','Interfaces and abstract classes']],
['Networks / TCP-IP / Security',11,PRI.Ap,['OSI/TCP-IP layers and PDUs','IPv4 addressing and subnetting','ARP, ICMP, DHCP, DNS','TCP vs UDP','TCP handshake and termination','Flow vs congestion control','Sliding window and ARQ','HTTP/HTTPS/FTP/SMTP/POP3/IMAP','Routing and network devices','Firewall, TLS and security basics']],
['DSA + Algorithms',11,PRI.Ap,['Arrays and linked lists','Stacks and queues','Circular queues','Trees and traversals','BST operations','Heaps and priority queues','Hashing and collision handling','BFS and DFS','Big-O, Omega, Theta','Searching algorithms','Sorting algorithms and stability','Greedy algorithms','Dynamic programming','Dijkstra, Prim and Kruskal']],
['Operating Systems + Linux',9,PRI.Ap,['Process states and PCB','CPU scheduling','Threads and concurrency','Critical section, mutex, semaphore','Deadlock and Coffman conditions','Paging and virtual memory','Page replacement algorithms','Segmentation','Disk scheduling','Linux commands and shell','Permissions and chmod','Processes and signals']],
['DBMS / SQL',8,PRI.Ap,['Keys and constraints','ER model and cardinality','Relational algebra','SQL SELECT/WHERE/GROUP BY/HAVING','SQL joins','NULL and three-valued logic','Normalization 1NF/2NF/3NF/BCNF','Functional dependencies and closure','Transactions and ACID','Serializability and locking','Indexes']],
['Digital Electronics',7,PRI.Ap,['Number systems','1s and 2s complement','Boolean algebra and De Morgan','K-map','Logic and universal gates','Adders','MUX/DEMUX/encoder/decoder','Flip-flops and counters']],
['Business Computing',9,PRI.Ap,['Management functions','Journal, ledger and trial balance','Financial statements','Demand and supply','B2B/B2C/C2C','EDI and online transactions','MIS/TPS/DSS/ESS','Data vs information vs knowledge']],
['Web Programming',7,PRI.A,['HTML and forms','CSS selectors and box model','JavaScript operators/functions','DOM and events','XML/DTD/parsers','AJAX','HTTP methods and status codes','Client vs server-side execution']],
['Architecture / Fundamentals',6,PRI.A,['CPU/ALU/CU/registers','Instruction cycle','Addressing modes','Cache and memory hierarchy','RAM/ROM variants','Interrupts and DMA','RISC/CISC','Pipelining and hazards','I/O and storage hierarchy']],
['Software Engineering',4,PRI.A,['SDLC models','Requirements and SRS','Cohesion and coupling','UML/DFD/use case','Testing levels','Black-box vs white-box','Maintenance and COCOMO']],
['Maths / Statistics / Interpolation',6,PRI.A,['Mean, median, mode','Variance and standard deviation','Probability and conditional probability','Binomial/Poisson/normal distributions','Correlation and regression','Newton/Lagrange interpolation','Matrices and determinants']],
['Graphics / Multimedia',3,PRI.B,['Raster vs vector','2D transformations','Window, viewport and clipping','Cohen-Sutherland','Bezier and B-spline','JPEG/PNG/GIF']],
['Mobile / .NET / Misc',2,PRI.B,['GSM/CDMA/TDMA/GPRS','WLAN/MANET/Mobile IP','.NET/C# basics','Cloud/IoT basics','Peripheral and storage concepts']],
['Teaching Methodology',null,PRI.Ap,['Piaget/Vygotsky/constructivism','Behaviorism and reinforcement','Learner-centred/activity/project methods','Individual differences','Formative/summative/diagnostic assessment','Inclusive education/CWSN','RTE/NEP and education initiatives','ICT-enabled CS teaching']]
];
const dsssbPaper1=[
['General Awareness',20,PRI.A,['Indian polity and Constitution','History and culture','Geography and environment','Economy and current affairs','Science and technology','Delhi-specific awareness']],
['General Intelligence & Reasoning',20,PRI.Ap,['Analogy and classification','Series','Coding-decoding','Blood relations and direction','Syllogism','Statement/conclusion','Venn diagrams','Non-verbal reasoning']],
['Arithmetical & Numerical Ability',20,PRI.Ap,['Number system','Simplification','Percentage and ratio','Profit/loss and discount','Average','Time and work','Time, speed and distance','Simple/compound interest','Data interpretation']],
['Hindi Language & Comprehension',20,PRI.A,['Grammar','Vocabulary','Synonyms/antonyms','Sentence correction','Idioms/proverbs','Comprehension']],
['English Language & Comprehension',20,PRI.A,['Grammar','Vocabulary','Synonyms/antonyms','Error spotting','Fillers and sentence improvement','Idioms/phrases','Reading comprehension']]
];
const bpscSubject=[
['Fundamentals & Computer Organization',10,PRI.Ap,['Number systems and codes','Logic gates and Boolean algebra','CPU, memory and I/O','Registers and instruction cycle','Cache and memory hierarchy','Addressing modes']],
['Digital Electronics',12.5,PRI.Ap,['Boolean algebra','K-map','Combinational circuits','Sequential circuits','Flip-flops','Counters and registers']],
['Programming & Translators',3.75,PRI.A,['C/C++ fundamentals','Pointers and arrays','Functions and recursion','OOP basics','Compilers/interpreters/assemblers']],
['Data Structures & Algorithms',7.5,PRI.Ap,['Lists, stacks, queues','Trees and graphs','Sorting/searching','Complexity analysis','Greedy and DP']],
['Operating Systems',20,PRI.Ap,['Processes and threads','Scheduling','Synchronization','Deadlock','Memory management','File systems','I/O and disk scheduling']],
['DBMS',6.25,PRI.Ap,['ER and relational model','SQL','Normalization','Transactions','Concurrency','Indexing']],
['Computer Networks',7.5,PRI.Ap,['OSI/TCP-IP','IP addressing/subnetting','TCP/UDP','Routing','Application protocols','Network security']],
['Web & Internet',8.75,PRI.A,['HTML/CSS/JS','HTTP','Web architecture','XML/AJAX','Internet services']],
['Software Engineering',5,PRI.A,['SDLC','Requirements','Design principles','Testing','Maintenance']],
['OOP / Java / C++',6,PRI.Ap,['Classes/objects','Inheritance','Polymorphism','Exceptions','Interfaces','Templates/basic STL']],
['TOC / Automata',4,PRI.A,['DFA/NFA','Regular expressions','CFG/PDA','Turing machine','Decidability basics']],
['AI / Emerging Tech / Cybersecurity',4,PRI.A,['AI fundamentals','Search and knowledge representation','ML basics','IoT/cloud','Cybersecurity basics']]
];
const bpscPrelims=[
['General Science',20,PRI.Ap,['Physics basics','Chemistry basics','Biology and health','Everyday science']],
['Current Affairs',15,PRI.Ap,['National events','International events','Science and technology','Sports/awards/appointments']],
['Indian History + Bihar History',15,PRI.Ap,['Ancient/medieval India','Modern India','Freedom movement','Bihar history and contribution']],
['Geography + Bihar Geography',15,PRI.Ap,['Physical geography','India geography','Bihar rivers/resources','Climate/agriculture']],
['Polity',10,PRI.A,['Constitution','Fundamental rights/duties','Parliament and state legislature','Judiciary','Local government']],
['Economy + Bihar Economy',10,PRI.A,['Basic economics','Indian economy','Bihar economy after independence','Government programmes']],
['General Mental Ability',15,PRI.Ap,['Analogy','Series','Coding','Arithmetic reasoning','Data interpretation']]
];
const bpscMainPaper1=[['Language - English',50,PRI.A,['Vocabulary','Grammar','Noun/pronoun/verb/adverb','Comprehension','Idioms and phrases']],['Language - Hindi/Urdu/Bangla',50,PRI.A,['Grammar','Vocabulary','Comprehension','Idioms and usage']]];
const bpscMainGS=[['Mathematics / Reasoning',25,PRI.Ap,['Arithmetic','Ratio/percentage','Time/work','Reasoning','Data interpretation']],['General Awareness & Current Affairs',25,PRI.Ap,['National current affairs','Bihar current affairs','Government schemes','Important events']],['General Science',20,PRI.A,['Physics','Chemistry','Biology','Environment']],['Social Studies / Geography / EVS',20,PRI.A,['Indian society','Geography','Environment','Bihar-specific topics']],['Indian National Movement',10,PRI.A,['Freedom struggle','Major movements','Bihar contribution']]];
const traps=['Definition vs distinction','Output tracing','Numerical/calculation','Matching/sequence','Scenario/application','Assertion–reason/statements'];
const maps={dsssb:[['C/C++/OOP/Java','14%','A+'],['Networks/TCP-IP/Security','11%','A+'],['DSA/Algorithms','11%','A+'],['OS/Linux','9%','A+'],['DBMS','8%','A+'],['Digital Electronics','7%','A+'],['Business Computing','9%','A+'],['Web','7%','A'],['Architecture/Fundamentals','6%','A'],['Software Engineering','4%','A'],['Maths/Statistics/Interpolation','6%','A'],['Graphics/Multimedia','3%','B'],['Mobile/.NET/Misc','2%','B']],dsssbPaper1:[['Reasoning','20%','A+'],['Numerical Ability','20%','A+'],['English','20%','A'],['Hindi','20%','A'],['General Awareness','20%','A']],bpscSubject:[['Operating Systems','20% planning reference','A+'],['Digital Electronics','12.5% planning reference','A+'],['Fundamentals/Hardware','10% planning reference','A+'],['Web/Internet','8.75% planning reference','A'],['DSA','7.5% planning reference','A+'],['Networks','7.5% planning reference','A+'],['OOP/Java/C++','6% planning reference','A+'],['DBMS','6.25% planning reference','A+'],['Software Engineering','5% planning reference','A'],['TOC/AI/Emerging','4% each planning reference','A']],bpscPrelims:[['General Science','High','A+'],['Current Affairs','High','A+'],['History + Bihar History','High','A+'],['Geography + Bihar Geography','High','A+'],['Mental Ability','High','A+'],['Polity','Medium','A'],['Economy + Bihar Economy','Medium','A']]};
const DATA={dsssbTech,dsssbPaper1,bpscSubject,bpscPrelims,bpscMainPaper1,bpscMainGS,traps,maps};