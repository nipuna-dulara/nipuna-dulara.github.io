import React, { useState, useEffect, useRef } from 'react';

// --- GLOBAL STYLES & ANIMATIONS ---
const globalStyles = `
    @import url('https://fonts.googleapis.com/css2?family=Fira+Code:wght@300;400;500;600&display=swap');

    body {
        background-color: #282a36;
        color: #f8f8f2;
        font-family: 'Fira Code', monospace;
        margin: 0;
        overflow-y: auto;
        overflow-x: hidden;
    }
    .scrollbar-hide::-webkit-scrollbar {
        display: none;
    }
    .scrollbar-hide {
        -ms-overflow-style: none;
        scrollbar-width: none;
    }
    @keyframes blink {
        0%, 100% { opacity: 1; }
        50% { opacity: 0; }
    }
    .cursor-blink {
        animation: blink 1s step-end infinite;
    }
    @keyframes scanline {
        0% { bottom: 100%; }
        100% { bottom: -100%; }
    }
    .scanline {
        width: 100%;
        height: 100px;
        z-index: 10;
        background: linear-gradient(0deg, rgba(0,0,0,0) 0%, rgba(255, 255, 255, 0.04) 50%, rgba(0,0,0,0) 100%);
        opacity: 0.1;
        position: absolute;
        bottom: 100%;
        animation: scanline 10s linear infinite;
        pointer-events: none;
    }
    .animate-fade-in {
        animation: fadeIn 0.3s ease-in-out;
    }
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(5px); }
        to { opacity: 1; transform: translateY(0); }
    }
`;

// --- DATA CONSTANTS ---
const DATA = {
    about: {
        name: "Nipuna Dulara Perera",
        role: "CS Undergraduate @ UoM | Cyber Security & HPC Enthusiast",
        expertise: ["Software Architecture", "Cloud Infrastructure", "Data Science", "High Performance Networking", "Cyber Security", "Project Management"],
        summary: "Passionate computer science enthusiast with a keen interest in low-level programming, server-side development, and data science. Committed to leveraging technology for innovative solutions. Working hard to shape the future of scalable, high-performance cloud architectures, one efficient socket at a time.",
        quote: "\"In normal science, you're given a world, and your job is to find out the rules. In computer science, you give the computer the rules, and it creates the world.\" - Alan Kay",
        quoteContext: "I believe in this deeply, as it captures the creative freedom that drives my work in software and systems."
    },
    education: [
        { year: "2026", title: "BSc (Hons), Computer Science & Engineering", inst: "University of Moratuwa", details: "GPA: 3.79/4.0 | Cyber Security Specialization" },
        { year: "2020", title: "GCE Advanced Level", inst: "Royal College, Colombo", details: "Z-score: 2.768 | Island Rank: 27 | Maths, Physics, Chemistry" },
        { year: "2016", title: "Java Institute, Sri Lanka", details: "DBMS, OOPC1, OOPC2, GUI | Grade: A" }
    ],
    experience: [
        {
            company: "University of Moratuwa",
            role: "President - Computer Science & Engineering Student Society",
            period: "2023-2024",
            summary: "Led the premier student organization representing 400+ undergraduate students."
        },
        {
            company: "Concolabs inc.",
            role: "Director & Lead, Solutions",
            projects: [
                {
                    name: "Purchase Order Management System — ITL (International Trimmings & Labels)",
                    tech: ["Apache Kafka", "Apache Airflow", "Next.js", "Minio (S3)", "PyTorch", "Langgraph"],
                    desc: "Architected and led development of an enterprise purchase order system for a multi-country label manufacturing client; the solution processed ~70% of the company's purchase orders after rollout. Started as sole architect and then scaled to multi-team delivery.",
                    responsibilities: "System architecture, team formation, integration with existing operations, and AI model integration for purchase automation."
                },
                {
                    name: "BuildMarketLK.com — Construction Materials Marketplace & Professionals Hub",
                    tech: ["GO", "Next.js", "Minio (S3)", "Digital Ocean", "Auth0", "Stripe", "MongoDB"],
                    desc: "Designed and delivered a marketplace platform for suppliers, professionals, and government/industry partners enabling product listings, price tracking, portfolios, and payment flows.",
                    link: "https://www.buildmarketlk.com",
                    responsibilities: "Product architecture, development, integration with partners, and search/scale planning."
                },
                {
                    name: "Wordtobim / Builderbot.ai - Revit Copilot (MCP) & Law Chatbot",
                    tech: ["GO", "Revit API", "C# (.NET)", "Stripe", "PostgreSQL"],
                    desc: "Designed a version control hub (like GitHub) for Revit assets and built the payments backend. Contributed to architecture and product decisions for an AI-assisted chatbot for the construction domain.",
                    link: "https://www.builderbot.ai",
                    responsibilities: "Management, design reviews, and backend payment integrations."
                },
                {
                    name: "Revit Plugins",
                    tech: ["Revit API", "C# (.NET)"],
                    desc: "Designed and developed Revit plugins to automatically convert AutoCAD floor plans into Revit floors, with OCR-based height offset detection and handling of folds. Built a Revit version-control plugin that tracked and displayed differences between project versions using JSON blobs, with visual change highlights via cloud markers."
                }
            ],
            summary: "Led product architecture and managed cross-functional engineering teams for multiple enterprise-scale products; responsible for technical strategy, delivery, and client engagement. Mentored engineers, owned solution design, and coordinated deployments across cloud environments."
        },
        {
            company: "London Stock Exchange Group (LSEG)",
            role: "Intern, Engineering",
            projects: [
                {
                    name: "Secure Multicast Framework for High Performance Systems",
                    tech: ["C++", "AWS Transit Gateway", "Solarflare Onload", "DPDK", "ChaCha20/AES"],
                    desc: "Researched and implemented secure multicast solution for ultra-low-latency market data delivery and integrated the solution to the existing MTech code base of LSEG. Investigated UDP-based approaches to reduce TCP congestion-control overhead for exchange-like systems.",
                    achievements: "Achieved ~60,000 messages/sec while maintaining negligible jitter compared to unencrypted baseline.",
                    responsibilities: "Design, performance testing, encryption strategy, and onload techniques."
                },
                {
                    name: "Application Security / Penetration Testing",
                    tech: ["Burp Suite", "ZAP", "OWASP"],
                    desc: "Performed penetration tests for web applications and contributed to application security assessments. Contributed to the internal SailPoint integration platform."
                }
            ]
        }
    ],
    projects: [
        { 
            name: "Purchase Order Management System — ITL",
            stack: "Apache Kafka, Apache Airflow, Next.js, Minio (S3), PyTorch, Langgraph",
            desc: "Enterprise purchase order system for multi-country label manufacturing client, processing ~70% of company's purchase orders. Started as sole architect and scaled to multi-team delivery with AI model integration for purchase automation.",
            type: "professional"
        },
        {
            name: "BuildMarketLK.com",
            stack: "GO, Next.js, Minio (S3), Digital Ocean, Auth0, Stripe, MongoDB",
            desc: "Marketplace platform for construction materials suppliers, professionals, and government/industry partners. Features product listings, price tracking, portfolios, and payment flows.",
            link: "https://www.buildmarketlk.com",
            type: "professional"
        },
        {
            name: "Wordtobim / Builderbot.ai",
            stack: "GO, Revit API, C# (.NET), Stripe, PostgreSQL",
            desc: "Version control hub for Revit assets (like GitHub) with payments backend. AI-assisted chatbot for construction domain with management and backend payment integrations.",
            link: "https://www.wordtobim.com",
            type: "professional"
        },
        {
            name: "Revit Plugins - AutoCAD to Revit Converter",
            stack: "Revit API, C# (.NET), OCR",
            desc: "Plugins to automatically convert AutoCAD floor plans into Revit floors with OCR-based height offset detection. Version-control plugin tracking project differences using JSON blobs with visual change highlights via cloud markers.",
            type: "professional"
        },
        {
            name: "Secure Multicast Framework - LSEG",
            stack: "C++, AWS Transit Gateway, Solarflare Onload, DPDK, ChaCha20/AES",
            desc: "Ultra-low-latency market data delivery solution for London Stock Exchange Group. Achieved ~60,000 messages/sec with negligible jitter. Researched UDP-based approaches to reduce TCP congestion-control overhead.",
            type: "professional"
        },
        { 
            name: "Q-Sentinel Loten Protocol & LotUDP Protocol", 
            stack: "C++, Espressif IDE, Diffie-Hellman, WiFi", 
            desc: "Custom protocol addressing insufficient payload size, complex master-slave implementation, and inadequate security in QSentinel Logistic Tag. LotUDP maintains long-lasting connections for IoT devices with ARQ for reliability and topic subscription (QUIC-like replacement for MQTT).",
            achievement: "Honorary Mention IEEE Comsoc Student Competition 2024 (International)",
            type: "academic"
        },
        { 
            name: "LoRaWAN Packet Loss Analysis & Optimization", 
            stack: "C++, NS-3, STM32, TinyML, Online Learning", 
            desc: "Final Year Research Project. Researched techniques to analyze and reduce packet loss in LoRaWAN networks. Designed simulation models in ns-3 with LoRaWAN module and tested packet delivery under diverse interference and shadowing scenarios. Explored ML approaches for predicting and mitigating packet loss patterns.",
            type: "academic"
        },
        { 
            name: "PintOS Operating System", 
            stack: "C, Assembly", 
            desc: "Managed implementation of thread scheduling, ensuring efficient CPU time allocation and context switching. Developed core functionalities including synchronization primitives (locks, semaphores) and thread management features.",
            type: "academic"
        },
        { 
            name: "Processor Design using VHDL", 
            stack: "VHDL, Xilinx", 
            desc: "Developed processor architecture from scratch and implemented it using VHDL. Conducted extensive testing and debugging to ensure the design met all specified requirements and operated correctly on FPGA.",
            type: "academic"
        },
        { 
            name: "Secure Verifiable E-Voting System", 
            stack: "RSA, ECDSA, Homomorphic Encryption", 
            desc: "Built privacy-preserving e-voting platform with blind signatures, encrypted ballots, and Merkle tree verifiability. Integrated RSA Blind Signatures, Homomorphic Encryption, and AES/RSA/ECDSA operations for vote CIA (Confidentiality, Integrity, Availability).",
            type: "academic"
        },
        { 
            name: "Transformer Model From Scratch", 
            stack: "PyTorch", 
            desc: "Developed a Transformer model from scratch, implementing core components such as multi-head attention, positional encoding, and feed-forward layers, based on the architecture detailed in 'Attention Is All You Need' paper.",
            type: "academic"
        },
        {
            name: "Speech Olympiad XVI Website",
            stack: "Vue.js, Sanity.io, Firebase",
            desc: "Created a user-friendly and visually appealing website to showcase event details, schedules, and results with an interactive registration form, enhancing the overall experience for all users.",
            link: "https://speecholympiad.lk",
            type: "personal"
        },
        {
            name: "Vanished Trails",
            stack: "Flutter, Node.js, AWS, OpenStreetMap",
            desc: "Developed an app that offers precise navigation and the ability to create customized maps in regions with scarce connectivity, serving as a lifeline for travelers in remote areas. Overcomes challenges with tailored algorithms for enhanced GPS accuracy.",
            type: "personal"
        },
        {
            name: "Wanderer's Compass",
            stack: "Next.js, FastAPI, TensorFlow",
            desc: "Developed an AI-driven platform to assist users in planning their travel itineraries, including hotels and transportation methods.",
            type: "personal"
        }
    ],
    skills: {
        languages: ["C", "C++", "Go", "Python", "JavaScript/TypeScript", "C# (.NET)", "VHDL", "Java" , "Rust"],
        frameworks: ["Next.js", "React", "Vue.js", "Apache Kafka", "Apache Airflow", "PyTorch", "Flutter", "FastAPI"],
        infrastructure: ["AWS", "Docker", "Azure", "MongoDB", "PostgreSQL", "Redis", "Digital Ocean"],
        tools: ["Revit API", "Solarflare Onload", "DPDK", "NS-3", "Xilinx", "Auth0", "Stripe", "Burp Suite", "ZAP"],
        core: ["Low-level Programming", "High-Performance Networking", "Cyber Security", "Software Architecture", "Cloud Infrastructure", "Data Science", "Project Management"]
    },
    achievements: [
        "Honorary Mention - IEEE Comsoc Student Competition 2024 (International)",
        "Champions - Comfix Communication Solutions Competition (IEEE UOM)",
        "Champions - Genesiz 2022 Inter-uni Engineering Competition (KDU)",
        "Finalists - Intelihack 2022 Inter-uni AI Competition (UCSC)",
        "Finalists - HackX 2022 Inter-uni Startup Competition (AIESEC UOK)",
        "Finalists - Idealize 2023 (AIESEC Colombo South)",
        "1st Place - All Island School Music Competition - Bhajan Category (Violin)",
        "Distinction Pass - Visharad Examination (Tabla)"
    ],
    positions: [
        { role: "Co-founder & Director", org: "Concolabs Inc." },
        { role: "President", org: "Computer Science & Engineering Student Society, University of Moratuwa" },
        { role: "Batch Representative", org: "CSE Department (Semester 2-3)" },
        { role: "Web Master", org: "Gavel Club of University of Moratuwa" },
        { role: "Event Coordinator", org: "ACM Student Chapter of University of Moratuwa" },
        { role: "Volunteer Researcher", org: "Young Zoologists Association, Sri Lanka" }
    ],
    softSkills: ["Public Speaking", "Leadership", "Management", "Singing", "Guitar", "Percussion", "Cricket", "Photography", "Designing", "Event Management", "Nature Enthusiast"],
    socials: [
        { label: "Email", val: "nipuna.21@cse.mrt.ac.lk", link: "mailto:nipuna.21@cse.mrt.ac.lk" },
        { label: "Phone", val: "+94 718 726 587", link: "tel:+94718726587" },
        { label: "GitHub", val: "github.com/nipuna-dulara", link: "https://github.com/nipuna-dulara" },
        { label: "LinkedIn", val: "linkedin.com/in/nipuna-dulara", link: "https://www.linkedin.com/in/nipuna-dulara" }
    ]
};

// --- COMPONENTS ---

const BootSequence = ({ onComplete }) => {
    const [lines, setLines] = useState([]);
    const bootText = [
        "INITIALIZING KERNEL...",
        "LOADING MODULES: [DPDK, SOLARFLARE, CUDA, VHDL]...",
        "MOUNTING FILESYSTEM: /home/nipuna...",
        "CHECKING INTEGRITY: OK",
        "ESTABLISHING SECURE CONNECTION...",
        "ALLOCATING MEMORY FOR NEURAL NETWORKS...",
        "STARTING SHELL SESSION..."
    ];

    useEffect(() => {
        let delay = 0;
        let mounted = true;
        
        bootText.forEach((text, index) => {
            delay += Math.random() * 300 + 100;
            setTimeout(() => {
                if (mounted) {
                    setLines(prev => [...prev, text]);
                    if (index === bootText.length - 1) {
                        setTimeout(onComplete, 800);
                    }
                }
            }, delay);
        });

        return () => { mounted = false; };
    }, []);

    return (
        <div className="h-screen w-full flex flex-col justify-end pb-10 px-4 text-[#6272a4]">
            {lines.map((line, i) => (
                <div key={i} className="font-mono text-sm md:text-base">
                    <span className="text-[#50fa7b]">[ OK ]</span> {line}
                </div>
            ))}
            <div className="mt-2 animate-pulse text-[#f8f8f2]">_</div>
        </div>
    );
};

const Prompt = ({ path = "~" }) => (
    <span className="whitespace-nowrap">
        <span className="text-[#bd93f9]">nipuna</span>
        <span className="text-[#f8f8f2]">@</span>
        <span className="text-[#ff79c6]">uom-cse</span>
        <span className="text-[#f8f8f2]">:</span>
        <span className="text-[#8be9fd]">{path}</span>
        <span className="text-[#50fa7b]">$</span>
    </span>
);

const OutputBlock = ({ children }) => (
    <div className="mb-4 leading-relaxed text-sm md:text-base animate-fade-in">
        {children}
    </div>
);

const HelpMenu = ({ onCmd }) => {
    const cmds = [
        { cmd: "about", desc: "Who am I?", tag: "info", summary: "Personal introduction, expertise areas, and philosophy" },
        { cmd: "exp", desc: "Work Experience", tag: "career", summary: "Professional experience at Concolabs and LSEG with detailed projects" },
        { cmd: "projects", desc: "My Projects", tag: "portfolio", summary: "Academic and personal projects including IoT, ML, and system design" },
        { cmd: "skills", desc: "Tech Stack", tag: "tech", summary: "Programming languages, frameworks, infrastructure, and core competencies" },
        { cmd: "edu", desc: "Education", tag: "academic", summary: "University of Moratuwa (GPA 3.79), A/L results, and certifications" },
        { cmd: "achievements", desc: "Awards & Recognition", tag: "awards", summary: "IEEE honors, competition wins, and music achievements" },
        { cmd: "positions", desc: "Leadership Roles", tag: "leadership", summary: "Leadership positions and soft skills" },
        { cmd: "contact", desc: "Get in touch", tag: "social", summary: "Email, phone, GitHub, and LinkedIn" },
        { cmd: "clear", desc: "Clear terminal", tag: "util", summary: "Clear the terminal screen" },
        { cmd: "reboot", desc: "Reload system", tag: "util", summary: "Reload the portfolio page" },
    ];
    return (
        <div className="space-y-4">
            <div className="text-[#8be9fd] text-sm mb-3">Available commands - Type any command or click to execute:</div>
            <div className="grid grid-cols-1 gap-3 max-w-3xl">
                {cmds.map(c => (
                    <div key={c.cmd} className="group cursor-pointer hover:bg-[#44475a] p-3 rounded transition-colors border border-[#44475a] hover:border-[#bd93f9]" onClick={() => onCmd(c.cmd)}>
                        <div className="flex items-center gap-3 mb-1">
                            <span className="text-[#f1fa8c] font-bold min-w-[100px]">$ {c.cmd}</span>
                            <span className="text-[#6272a4] text-xs bg-[#44475a] px-2 py-0.5 rounded">{c.tag}</span>
                            <span className="text-[#8be9fd] text-sm">- {c.desc}</span>
                        </div>
                        <div className="text-[#6272a4] text-xs ml-[100px] pl-3">{c.summary}</div>
                    </div>
                ))}
            </div>
            <div className="text-[#6272a4] text-xs mt-4 pt-3 border-t border-[#44475a]">
                💡 Tips: Use <span className="text-[#f1fa8c]">Tab</span> for autocomplete | <span className="text-[#f1fa8c]">Ctrl+L</span> to clear | Type <span className="text-[#f1fa8c]">ls</span> or <span className="text-[#f1fa8c]">dir</span> as aliases for help
            </div>
        </div>
    );
};

export default function App() {
    const [booted, setBooted] = useState(false);
    const [history, setHistory] = useState([]);
    const [input, setInput] = useState("");
    const inputRef = useRef(null);
    const bottomRef = useRef(null);

    // Auto-scroll to bottom
    useEffect(() => {
        if (bottomRef.current) {
            bottomRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [history]);

    // Focus input on click anywhere
    useEffect(() => {
        const handleClick = () => inputRef.current?.focus();
        document.addEventListener("click", handleClick);
        return () => document.removeEventListener("click", handleClick);
    }, []);

    const addToHistory = (cmd, outputComponent) => {
        setHistory(prev => [...prev, { id: Date.now(), cmd, output: outputComponent }]);
    };

    const handleCommand = (cmdRaw) => {
        const cmd = cmdRaw.trim().toLowerCase();
        if (!cmd) {
            addToHistory("", null);
            return;
        }

        let output = null;

        switch (cmd) {
            case "help":
            case "ls":
            case "dir":
                output = <HelpMenu onCmd={(c) => handleCommand(c)} />;
                break;
            case "clear":
            case "cls":
                setHistory([]);
                return; // Early return to avoid adding "clear" to history
            case "reboot":
            case "reload":
                window.location.reload();
                return;
            case "about":
            case "whoami":
                output = (
                    <div className="border-l-2 border-[#bd93f9] pl-4 py-2">
                        <h1 className="text-xl text-[#f8f8f2] font-bold mb-2">{DATA.about.name}</h1>
                        <p className="text-[#8be9fd] mb-2">{DATA.about.role}</p>
                        <div className="flex flex-wrap gap-2 mb-4">
                            {DATA.about.expertise.map(skill => (
                                <span key={skill} className="text-xs bg-[#44475a] px-2 py-1 rounded text-[#50fa7b]">{skill}</span>
                            ))}
                        </div>
                        <p className="text-[#f8f8f2] mb-4">{DATA.about.summary}</p>
                        <p className="italic text-[#6272a4] mb-1">{DATA.about.quote}</p>
                        <p className="text-[#6272a4] text-sm">{DATA.about.quoteContext}</p>
                    </div>
                );
                break;
            case "edu":
            case "education":
                output = (
                    <div className="space-y-4">
                        {DATA.education.map((e, i) => (
                            <div key={i}>
                                <div className="flex justify-between text-[#ff79c6]">
                                    <span className="font-bold">{e.inst}</span>
                                    <span>{e.year}</span>
                                </div>
                                {e.title && <div className="text-[#f1fa8c]">{e.title}</div>}
                                <div className="text-[#6272a4] text-sm">{e.details}</div>
                            </div>
                        ))}
                    </div>
                );
                break;
            case "exp":
            case "experience":
            case "work":
                output = (
                    <div className="space-y-6">
                        {DATA.experience.map((e, i) => (
                            <div key={i} className="relative pl-4 border-l-2 border-[#44475a]">
                                <div className="absolute -left-[5px] top-0 w-2.5 h-2.5 rounded-full bg-[#50fa7b]"></div>
                                <div className="flex justify-between items-start">
                                    <h3 className="text-[#50fa7b] font-bold text-lg">{e.role} @ {e.company}</h3>
                                    {e.period && <span className="text-[#6272a4] text-sm">{e.period}</span>}
                                </div>
                                {e.summary && <p className="text-[#f8f8f2] mt-1 text-sm mb-3">{e.summary}</p>}
                                
                                {e.projects && (
                                    <div className="space-y-4 mt-3">
                                        {e.projects.map((p, pi) => (
                                            <div key={pi} className="ml-2 border-l border-[#6272a4] pl-3">
                                                <div className="text-[#8be9fd] font-semibold">{p.name}</div>
                                                {p.link && (
                                                    <a href={p.link} target="_blank" rel="noopener noreferrer" className="text-[#6272a4] text-xs mb-1 hover:text-[#8be9fd] block">
                                                        🔗 {p.link}
                                                    </a>
                                                )}
                                                <p className="text-[#f8f8f2] text-sm mt-1">{p.desc}</p>
                                                {p.achievements && <p className="text-[#f1fa8c] text-sm mt-1">⚡ {p.achievements}</p>}
                                                {p.responsibilities && <p className="text-[#6272a4] text-xs mt-1">→ {p.responsibilities}</p>}
                                                <div className="flex flex-wrap gap-2 mt-2">
                                                    {p.tech.map(t => (
                                                        <span key={t} className="text-xs bg-[#44475a] px-2 py-1 rounded text-[#8be9fd]">{t}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                );
                break;
            case "projects":
                output = (
                    <div className="space-y-4">
                        <div className="text-[#8be9fd] text-sm mb-3">
                            <span className="text-[#ffb86c]">Professional</span> | <span className="text-[#50fa7b]">Academic</span> | <span className="text-[#bd93f9]">Personal</span>
                        </div>
                        <div className="grid grid-cols-1 gap-4">
                            {DATA.projects.map((p, i) => (
                                <div key={i} className="border border-[#44475a] p-4 rounded hover:border-[#bd93f9] transition-colors">
                                    <div className="flex justify-between items-start mb-2 flex-wrap gap-2">
                                        <div className="flex items-center gap-2">
                                            <div className="text-[#ffb86c] font-bold">{p.name}</div>
                                            <span className={`text-xs px-2 py-0.5 rounded ${
                                                p.type === 'professional' ? 'bg-[#ffb86c] text-[#282a36]' :
                                                p.type === 'academic' ? 'bg-[#50fa7b] text-[#282a36]' :
                                                'bg-[#bd93f9] text-[#282a36]'
                                            }`}>{p.type}</span>
                                        </div>
                                        {p.achievement && <span className="text-xs bg-[#f1fa8c] text-[#282a36] px-2 py-1 rounded font-semibold">🏆 Award</span>}
                                    </div>
                                    <div className="text-xs text-[#6272a4] mb-2">[{p.stack}]</div>
                                    <div className="text-sm text-[#f8f8f2] mb-2">{p.desc}</div>
                                    {p.link && (
                                        <a href={p.link} target="_blank" rel="noopener noreferrer" className="text-xs text-[#8be9fd] hover:text-[#50fa7b] hover:underline inline-block mt-2">
                                            🔗 {p.link}
                                        </a>
                                    )}
                                    {p.achievement && <div className="text-xs text-[#50fa7b] mt-2">🏆 {p.achievement}</div>}
                                </div>
                            ))}
                        </div>
                    </div>
                );
                break;
            case "skills":
                output = (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {Object.entries(DATA.skills).map(([cat, list]) => (
                            <div key={cat}>
                                <div className="text-[#ff79c6] uppercase text-xs tracking-wider mb-2 border-b border-[#44475a] pb-1">{cat}</div>
                                <div className="flex flex-wrap gap-2">
                                    {list.map(item => (
                                        <span key={item} className="text-[#f1fa8c] text-sm font-mono">
                                            {item}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                );
                break;
            case "achievements":
            case "awards":
                output = (
                    <div className="space-y-3">
                        <div className="text-[#50fa7b] font-bold mb-3">🏆 Achievements & Recognition</div>
                        {DATA.achievements.map((achievement, i) => (
                            <div key={i} className="flex items-start gap-3">
                                <span className="text-[#f1fa8c] text-lg">•</span>
                                <span className="text-[#f8f8f2] text-sm">{achievement}</span>
                            </div>
                        ))}
                    </div>
                );
                break;
            case "positions":
            case "leadership":
                output = (
                    <div className="space-y-3">
                        <div className="text-[#50fa7b] font-bold mb-3">👔 Positions of Responsibility</div>
                        {DATA.positions.map((pos, i) => (
                            <div key={i} className="border-l-2 border-[#bd93f9] pl-3">
                                <div className="text-[#8be9fd] font-semibold">{pos.role}</div>
                                <div className="text-[#6272a4] text-sm">{pos.org}</div>
                            </div>
                        ))}
                        <div className="mt-6 pt-4 border-t border-[#44475a]">
                            <div className="text-[#ff79c6] font-semibold mb-2">Soft Skills & Interests</div>
                            <div className="flex flex-wrap gap-2">
                                {DATA.softSkills.map(skill => (
                                    <span key={skill} className="text-xs bg-[#44475a] px-2 py-1 rounded text-[#f8f8f2]">{skill}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                );
                break;
            case "contact":
                output = (
                    <div className="space-y-2">
                        <div className="text-[#f8f8f2] mb-2">Transmission channels open:</div>
                        {DATA.socials.map((s, i) => (
                            <div key={i} className="flex gap-4">
                                <span className="text-[#8be9fd] w-20">{s.label}:</span>
                                <a href={s.link} target="_blank" className="text-[#f1fa8c] hover:underline hover:text-[#50fa7b]">{s.val}</a>
                            </div>
                        ))}
                    </div>
                );
                break;
            default:
                output = (
                    <div className="text-[#ff5555]">
                        Command not found: {cmd}. Type <span className="text-[#f1fa8c] cursor-pointer hover:underline" onClick={() => handleCommand('help')}>'help'</span> for available commands.
                    </div>
                );
        }

        addToHistory(cmdRaw, output);
        setInput("");
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            handleCommand(input);
        } else if (e.key === "Tab") {
            e.preventDefault();
            // Simple tab completion
            const commands = ["help", "about", "exp", "projects", "skills", "edu", "contact", "clear", "reboot", "achievements", "positions", "ls"];
            const match = commands.find(c => c.startsWith(input.toLowerCase()));
            if (match) setInput(match);
        } else if (e.key === "l" && e.ctrlKey) {
            e.preventDefault();
            setHistory([]); // Ctrl+L to clear
        }
    };

    if (!booted) {
        return (
            <>
                <style>{globalStyles}</style>
                <BootSequence onComplete={() => setBooted(true)} />
            </>
        );
    }

    return (
        <div className="min-h-screen p-4 md:p-8 max-w-5xl mx-auto relative font-mono text-sm md:text-base pb-20">
            <style>{globalStyles}</style>
            <div className="scanline"></div>
            
            {/* Header/Welcome */}
            <div className="mb-8 select-none">
                <div className="text-[#6272a4] mb-2">Last login: {new Date().toUTCString()} on tty1</div>
                <div className="text-[#50fa7b] font-bold text-lg md:text-2xl mb-2">
                   Nipuna_Dulara_v1.0.2
                </div>
                <div className="text-[#f8f8f2] mb-4 max-w-2xl">
                    System ready. Exploring high-performance networking, cyber security, and low-level architecture.
                    <br/>
                    Type <span className="bg-[#44475a] px-1 text-[#f1fa8c] cursor-pointer" onClick={() => handleCommand('help')}>help</span> to view available commands.
                </div>
            </div>

            {/* History */}
            <div className="space-y-2">
                {history.map((entry) => (
                    <div key={entry.id} className="mb-4">
                        <div className="flex items-center gap-2 mb-1 opacity-80">
                            <Prompt />
                            <span className="text-[#f8f8f2]">{entry.cmd}</span>
                        </div>
                        {entry.output && <OutputBlock>{entry.output}</OutputBlock>}
                    </div>
                ))}
            </div>

            {/* Active Input */}
            <div className="mt-2 flex items-center gap-2" ref={bottomRef}>
                <Prompt />
                <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="bg-transparent border-none outline-none text-[#f8f8f2] flex-grow caret-transparent"
                    autoFocus
                    autoComplete="off"
                />
                {/* Custom blinking cursor block to look more like a terminal */}
                <div className={`absolute ml-[max(0px,calc(${input.length}ch+${window.innerWidth < 768 ? '160px' : '220px'}))] w-2.5 h-5 bg-[#f8f8f2] cursor-blink pointer-events-none ${input.length === 0 ? 'ml-0' : ''}`} style={{transform: 'translateY(1px)'}}></div>
            </div>
        </div>
    );
}