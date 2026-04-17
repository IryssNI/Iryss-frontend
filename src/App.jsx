import { useState, useRef, useEffect } from "react";

// ── Google Font import via style injection ───────────────────────────
const fontStyle = document.createElement('style');
fontStyle.textContent = `@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');`;
document.head.appendChild(fontStyle);

const pulseStyle = document.createElement('style');
pulseStyle.textContent = `
  @keyframes pulseDot { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.4);opacity:.7} }
  @keyframes pulseRing { 0%{box-shadow:0 0 0 0 rgba(239,68,68,.55)} 70%{box-shadow:0 0 0 7px rgba(239,68,68,0)} 100%{box-shadow:0 0 0 0 rgba(239,68,68,0)} }
  @keyframes fadeInUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
  @keyframes fadeIn { from{opacity:0} to{opacity:1} }
  @keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
  @keyframes slideInRight { from{opacity:0;transform:translateX(20px)} to{opacity:1;transform:translateX(0)} }
  @keyframes scaleIn { from{opacity:0;transform:scale(.95)} to{opacity:1;transform:scale(1)} }
  @keyframes gradientShift { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
  @keyframes spin { from { transform:rotate(0deg) } to { transform:rotate(360deg) } }
  .page-enter { animation: fadeInUp .42s cubic-bezier(.2,.8,.2,1) both; }
  .stagger-1 { animation: fadeInUp .4s cubic-bezier(.2,.8,.2,1) both; animation-delay: .05s; }
  .stagger-2 { animation: fadeInUp .4s cubic-bezier(.2,.8,.2,1) both; animation-delay: .12s; }
  .inbox-thread::-webkit-scrollbar { width:8px; }
  .inbox-thread::-webkit-scrollbar-track { background:#E8EEF4; border-radius:8px; }
  .inbox-thread::-webkit-scrollbar-thumb { background:#0891B2; border-radius:8px; }
  .inbox-thread::-webkit-scrollbar-thumb:hover { background:#06B6D4; }
  * { scrollbar-width:thin; scrollbar-color:#CBD5E1 transparent; }
  *::-webkit-scrollbar { width:6px; height:6px; }
  *::-webkit-scrollbar-track { background:transparent; }
  *::-webkit-scrollbar-thumb { background:#CBD5E1; border-radius:6px; }
  *::-webkit-scrollbar-thumb:hover { background:#94A3B8; }
  ::selection { background:rgba(8,145,178,.15); color:#0F172A; }
`;
document.head.appendChild(pulseStyle);

const C = {
  sidebar:"#080E1A", sidebarAlt:"#0D1526", bg:"#F0F4F8", card:"#FFFFFF", border:"#E2E8F0", borderLight:"#F1F5F9",
  text:"#0F172A", secondary:"#64748B",
  teal:"#0891B2", green:"#10B981", amber:"#F59E0B", red:"#EF4444",
  navy:"#0F172A", cream:"#F8FAFB", offWhite:"#F8FAFB", white:"#FFFFFF",
  slate:"#64748B", slateLight:"#94A3B8",
  tealLt:"#06B6D4", tealPale:"rgba(8,145,178,0.06)", purple:"#8B5CF6",
  tealGrad:"linear-gradient(135deg,#0891B2,#06B6D4,#22D3EE)",
  cardShadow:"0 1px 3px rgba(0,0,0,.03), 0 4px 12px rgba(0,0,0,.04)",
  cardHoverShadow:"0 8px 30px rgba(8,145,178,.1), 0 2px 8px rgba(0,0,0,.06)",
  glassWhite:"rgba(255,255,255,.7)",
  glassBorder:"rgba(255,255,255,.2)",
};

const PATIENTS = [
  { id:"P-001", name:"Louise Everton",  initials:"LE",  phone:"+447827322027", lastVisit:"6 months ago",  product:"Acuvue Oasys Astigmatism", age:33, risk:"low",    riskScore:28, revenue:280, status:"checkin"   },
  { id:"P-002", name:"Tom Bradley",     initials:"TB",  phone:"+447827001002", lastVisit:"9 months ago",  product:"Monthly Contact Lenses",    risk:"medium", riskScore:61, revenue:185, status:"sent"      },
  { id:"P-003", name:"Margaret Flynn",  initials:"MF",  phone:"+447827001003", lastVisit:"11 months ago", product:"Glasses + Contact Lenses",  risk:"high",   riskScore:88, revenue:410, status:"alert"     },
  { id:"P-004", name:"Ciara Murphy",    initials:"CM",  phone:"+447827001004", lastVisit:"4 months ago",  product:"Glasses",                   risk:"low",    riskScore:24, revenue:240, status:"checkin"   },
  { id:"P-005", name:"Jim Bru",         initials:"JB",  phone:"+447803003472", lastVisit:"8 months ago",  product:"No current spectacles or CL", age:44, risk:"medium", riskScore:61, revenue:150, status:"sent"      },
  { id:"P-006", name:"Sarah Flynn",     initials:"SF",  phone:"+447827001006", lastVisit:"3 months ago",  product:"Varifocals",                risk:"low",    riskScore:18, revenue:380, status:"booked"    },
  { id:"P-007", name:"Shona Kay",       initials:"SK",  phone:"+447711552094", lastVisit:"13 months ago", product:"Varifocals + Acuvue Oasys Max", age:62, risk:"high",   riskScore:82, revenue:420, status:"pending"   },
  { id:"P-008", name:"Jess Brown",       initials:"JB2", phone:"+447572043380", lastVisit:"5 months ago",  product:"Monthly CL + Glasses",      risk:"low",    riskScore:31, revenue:220, status:"recovered" },
  { id:"P-009", name:"Emma Wilson",      initials:"EW",  phone:"+447827001010", lastVisit:"2 months ago",  product:"Single Vision Glasses",      age:26, risk:"low",    riskScore:22, revenue:240, status:"booked"    },
  { id:"P-010", name:"Robert Hughes",    initials:"RH",  phone:"+447827001011", lastVisit:"7 months ago",  product:"Varifocals",                age:58, risk:"medium", riskScore:55, revenue:420, status:"sent"      },
  { id:"P-011", name:"Ann Hughes",       initials:"AH",  phone:"+447827001012", lastVisit:"5 months ago",  product:"Varifocals",                age:61, risk:"low",    riskScore:28, revenue:420, status:"pending"   },
  { id:"P-012", name:"Brian Walsh",      initials:"BW",  phone:"+447827001013", lastVisit:"10 months ago", product:"Acuvue Oasys",              age:35, risk:"medium", riskScore:63, revenue:180, status:"alert"     },
  { id:"P-013", name:"Patricia Ross",    initials:"PR",  phone:"+447827001014", lastVisit:"8 months ago",  product:"Bifocals",                  age:72, risk:"high",   riskScore:81, revenue:380, status:"pending"   },
  { id:"P-014", name:"David Kelly",      initials:"DK",  phone:"+447827001015", lastVisit:"3 months ago",  product:"Single Vision Glasses",      age:42, risk:"low",    riskScore:25, revenue:240, status:"booked"    },
  { id:"P-015", name:"Rachel O'Connor",  initials:"RO",  phone:"+447827001016", lastVisit:"6 months ago",  product:"Dailies Total 1",           age:29, risk:"low",    riskScore:30, revenue:150, status:"sent"      },
  { id:"P-016", name:"Michael O'Brien",  initials:"MO",  phone:"+447827001017", lastVisit:"9 months ago",  product:"Varifocals",                age:64, risk:"high",   riskScore:78, revenue:420, status:"alert"     },
  { id:"P-017", name:"Fiona Gallagher",  initials:"FG",  phone:"+447827001018", lastVisit:"4 months ago",  product:"Contact Lenses",            age:31, risk:"low",    riskScore:32, revenue:140, status:"checkin"   },
  { id:"P-018", name:"Declan Murphy",    initials:"DM",  phone:"+447827001019", lastVisit:"11 months ago", product:"Reading Glasses",            age:68, risk:"high",   riskScore:85, revenue:95, status:"pending"    },
  { id:"P-019", name:"Sinéad McCarthy",  initials:"SM",  phone:"+447827001020", lastVisit:"7 months ago",  product:"Acuvue Oasys Max",          age:44, risk:"medium", riskScore:59, revenue:280, status:"sent"      },
  { id:"P-020", name:"Kevin Murphy",     initials:"KM",  phone:"+447827001021", lastVisit:"2 months ago",  product:"Single Vision Glasses",      age:51, risk:"low",    riskScore:18, revenue:240, status:"recovered" },
  { id:"P-021", name:"Aisling Kelly",    initials:"AK",  phone:"+447827001022", lastVisit:"13 months ago", product:"Varifocals",                age:67, risk:"high",   riskScore:88, revenue:420, status:"alert"     },
  { id:"P-022", name:"Connor Walsh",     initials:"CW",  phone:"+447827001023", lastVisit:"8 months ago",  product:"Acuvue Oasys",              age:38, risk:"medium", riskScore:62, revenue:185, status:"sent"      },
  { id:"P-023", name:"Niamh Lynch",      initials:"NL",  phone:"+447827001024", lastVisit:"5 months ago",  product:"Glasses + Contact Lenses",  age:26, risk:"low",    riskScore:29, revenue:380, status:"booked"    },
  { id:"P-024", name:"Padraig Flynn",    initials:"PF",  phone:"+447827001025", lastVisit:"9 months ago",  product:"Children's Glasses",        age:8,  risk:"low",    riskScore:15, revenue:180, status:"sent"      },
  { id:"P-025", name:"Caoimhe O'Sullivan", initials:"CO", phone:"+447827001026", lastVisit:"6 months ago",  product:"Sports Glasses",            age:24, risk:"low",    riskScore:26, revenue:280, status:"checkin"   },
  { id:"P-026", name:"Seamus O'Reilly",  initials:"SOR", phone:"+447827001027", lastVisit:"10 months ago", product:"Bifocals",                  age:74, risk:"high",   riskScore:82, revenue:380, status:"alert"     },
  { id:"P-027", name:"Orlaith Murphy",   initials:"OM",  phone:"+447827001028", lastVisit:"4 months ago",  product:"Monthly Contact Lenses",    age:33, risk:"low",    riskScore:31, revenue:165, status:"booked"    },
  { id:"P-028", name:"Brendan Kelly",    initials:"BK",  phone:"+447827001029", lastVisit:"11 months ago", product:"Reading Glasses",            age:71, risk:"high",   riskScore:79, revenue:95, status:"pending"    },
  { id:"P-029", name:"Róisín McCarthy",  initials:"RM",  phone:"+447827001030", lastVisit:"7 months ago",  product:"Acuvue Oasys",              age:42, risk:"medium", riskScore:58, revenue:180, status:"sent"      },
  { id:"P-030", name:"Liam O'Connor",    initials:"LO",  phone:"+447827001031", lastVisit:"3 months ago",  product:"Single Vision Glasses",      age:47, risk:"low",    riskScore:21, revenue:240, status:"recovered" },
  { id:"P-031", name:"Sadie Murphy",     initials:"SMu", phone:"+447827001032", lastVisit:"12 months ago", product:"Varifocals",                age:69, risk:"high",   riskScore:87, revenue:420, status:"alert"     },
  { id:"P-032", name:"Colm O'Neill",     initials:"CO2", phone:"+447827001033", lastVisit:"9 months ago",  product:"CooperVision Biofinity",    age:36, risk:"medium", riskScore:60, revenue:190, status:"sent"      },
  { id:"P-033", name:"Mairead Lynch",    initials:"ML",  phone:"+447827001034", lastVisit:"5 months ago",  product:"Acuvue Oasys Max",          age:29, risk:"low",    riskScore:28, revenue:280, status:"booked"    },
  { id:"P-034", name:"Aidan Walsh",      initials:"AW",  phone:"+447827001035", lastVisit:"10 months ago", product:"Reading Glasses",            age:65, risk:"high",   riskScore:76, revenue:95, status:"pending"    },
  { id:"P-035", name:"Alva Murphy",      initials:"AMu", phone:"+447827001036", lastVisit:"6 months ago",  product:"Single Vision Glasses",      age:38, risk:"low",    riskScore:24, revenue:240, status:"checkin"   },
  { id:"P-036", name:"Eoin McCarthy",    initials:"EM",  phone:"+447827001037", lastVisit:"8 months ago",  product:"Monthly Contact Lenses",    age:31, risk:"medium", riskScore:64, revenue:170, status:"sent"      },
  { id:"P-037", name:"Faye O'Donnell",   initials:"FOD", phone:"+447827001038", lastVisit:"4 months ago",  product:"Bifocals",                  age:70, risk:"low",    riskScore:32, revenue:380, status:"recovered" },
  { id:"P-038", name:"Gareth Kelly",     initials:"GK",  phone:"+447827001039", lastVisit:"11 months ago", product:"Varifocals",                age:59, risk:"high",   riskScore:80, revenue:420, status:"alert"     },
  { id:"P-039", name:"Hannah Murphy",    initials:"HM",  phone:"+447827001040", lastVisit:"7 months ago",  product:"Acuvue Oasys",              age:35, risk:"medium", riskScore:61, revenue:185, status:"sent"      },
  { id:"P-040", name:"Isaac O'Neill",    initials:"IO",  phone:"+447827001041", lastVisit:"2 months ago",  product:"Single Vision Glasses",      age:44, risk:"low",    riskScore:20, revenue:240, status:"booked"    },
  { id:"P-041", name:"Jade Walsh",       initials:"JW",  phone:"+447827001042", lastVisit:"9 months ago",  product:"Contact Lenses",            age:27, risk:"low",    riskScore:25, revenue:140, status:"sent"      },
  { id:"P-042", name:"James Murphy",     initials:"JM",  phone:"+447827001043", lastVisit:"6 months ago",  product:"Varifocals + Reading Glasses", age:68, risk:"high", riskScore:83, revenue:475, status:"alert"     },
  { id:"P-043", name:"Kayla O'Connor",   initials:"KO",  phone:"+447827001044", lastVisit:"10 months ago", product:"Children's Glasses",        age:9,  risk:"low",    riskScore:18, revenue:180, status:"pending"    },
  { id:"P-044", name:"Loch O'Brien",     initials:"LOB", phone:"+447827001045", lastVisit:"5 months ago",  product:"Acuvue Oasys Max",          age:39, risk:"low",    riskScore:29, revenue:280, status:"checkin"   },
  { id:"P-045", name:"Molly McCarthy",   initials:"MMc", phone:"+447827001046", lastVisit:"8 months ago",  product:"Monthly Contact Lenses",    age:30, risk:"medium", riskScore:65, revenue:165, status:"sent"      },
  { id:"P-046", name:"Noah Kelly",       initials:"NK",  phone:"+447827001047", lastVisit:"4 months ago",  product:"Single Vision Glasses",      age:50, risk:"low",    riskScore:23, revenue:240, status:"recovered" },
  { id:"P-047", name:"Olivia O'Reilly",  initials:"OOR", phone:"+447827001048", lastVisit:"11 months ago", product:"Bifocals",                  age:73, risk:"high",   riskScore:84, revenue:380, status:"alert"     },
  { id:"P-048", name:"Patrick Murphy",   initials:"PMu", phone:"+447827001049", lastVisit:"7 months ago",  product:"Varifocals",                age:62, risk:"high",   riskScore:77, revenue:420, status:"pending"    },
  { id:"P-049", name:"Quinn Lynch",      initials:"QL",  phone:"+447827001050", lastVisit:"3 months ago",  product:"Acuvue Oasys",              age:36, risk:"low",    riskScore:27, revenue:185, status:"booked"    },
  { id:"P-050", name:"Ruby O'Sullivan",  initials:"ROS", phone:"+447827001051", lastVisit:"9 months ago",  product:"Sports Glasses",            age:22, risk:"low",    riskScore:19, revenue:280, status:"sent"      },
  { id:"P-051", name:"Susan Murphy",     initials:"SMur", phone:"+447827001052", lastVisit:"6 months ago",  product:"Reading Glasses",            age:69, risk:"low",    riskScore:34, revenue:95, status:"checkin"   },
  { id:"P-052", name:"Theo O'Connor",    initials:"TO",  phone:"+447827001053", lastVisit:"10 months ago", product:"Contact Lenses",            age:28, risk:"medium", riskScore:66, revenue:145, status:"alert"     },
  { id:"P-053", name:"Ursula Kelly",     initials:"UK",  phone:"+447827001054", lastVisit:"5 months ago",  product:"Monthly Contact Lenses",    age:32, risk:"low",    riskScore:30, revenue:170, status:"sent"      },
  { id:"P-054", name:"Vincent Walsh",    initials:"VW",  phone:"+447827001055", lastVisit:"8 months ago",  product:"Varifocals",                age:60, risk:"high",   riskScore:75, revenue:420, status:"recovered" },
  { id:"P-055", name:"Wendy O'Donnell",  initials:"WOD", phone:"+447827001056", lastVisit:"4 months ago",  product:"Single Vision Glasses",      age:43, risk:"low",    riskScore:26, revenue:240, status:"booked"    },
  { id:"P-056", name:"Xavier Murphy",    initials:"XM",  phone:"+447827001057", lastVisit:"11 months ago", product:"Bifocals",                  age:75, risk:"high",   riskScore:86, revenue:380, status:"alert"     },
  { id:"P-057", name:"Yasmine Kelly",    initials:"YK",  phone:"+447827001058", lastVisit:"7 months ago",  product:"Acuvue Oasys",              age:34, risk:"medium", riskScore:59, revenue:185, status:"sent"      },
  { id:"P-058", name:"Zara O'Neill",     initials:"ZO",  phone:"+447827001059", lastVisit:"3 months ago",  product:"Acuvue Oasys Max",          age:25, risk:"low",    riskScore:24, revenue:280, status:"pending"    },
  { id:"P-059", name:"Adam Walsh",       initials:"AW2", phone:"+447827001060", lastVisit:"9 months ago",  product:"Single Vision Glasses",      age:45, risk:"low",    riskScore:22, revenue:240, status:"checkin"   },
  { id:"P-060", name:"Bethany Murphy",   initials:"BM",  phone:"+447827001061", lastVisit:"6 months ago",  product:"Monthly Contact Lenses",    age:27, risk:"low",    riskScore:28, revenue:165, status:"sent"      },
  { id:"P-061", name:"Cameron Kelly",    initials:"CK",  phone:"+447827001062", lastVisit:"10 months ago", product:"Varifocals",                age:66, risk:"high",   riskScore:89, revenue:420, status:"alert"     },
  { id:"P-062", name:"Diana O'Connor",   initials:"DC",  phone:"+447827001063", lastVisit:"5 months ago",  product:"Reading Glasses",            age:67, risk:"low",    riskScore:33, revenue:95, status:"recovered" },
  { id:"P-063", name:"Ethan Walsh",      initials:"EW2", phone:"+447827001064", lastVisit:"8 months ago",  product:"Acuvue Oasys",              age:39, risk:"medium", riskScore:67, revenue:185, status:"sent"      },
  { id:"P-064", name:"Freya O'Donnell",  initials:"FOD2", phone:"+447827001065", lastVisit:"4 months ago",  product:"Bifocals",                  age:72, risk:"low",    riskScore:31, revenue:380, status:"booked"    },
  { id:"P-065", name:"Gregory Murphy",   initials:"GM",  phone:"+447827001066", lastVisit:"11 months ago", product:"Children's Glasses",        age:10, risk:"low",    riskScore:16, revenue:180, status:"pending"    },
  { id:"P-066", name:"Hazel Kelly",      initials:"HK",  phone:"+447827001067", lastVisit:"7 months ago",  product:"Monthly Contact Lenses",    age:29, risk:"medium", riskScore:62, revenue:170, status:"sent"      },
  { id:"P-067", name:"Ivan O'Neill",     initials:"IO2", phone:"+447827001068", lastVisit:"3 months ago",  product:"Single Vision Glasses",      age:48, risk:"low",    riskScore:19, revenue:240, status:"checkin"   },
  { id:"P-068", name:"Jackie Murphy",    initials:"JMu", phone:"+447827001069", lastVisit:"9 months ago",  product:"CooperVision Biofinity",    age:31, risk:"low",    riskScore:27, revenue:190, status:"sent"      },
  { id:"P-069", name:"Keith Walsh",      initials:"KW",  phone:"+447827001070", lastVisit:"6 months ago",  product:"Varifocals",                age:63, risk:"high",   riskScore:72, revenue:420, status:"alert"     },
  { id:"P-070", name:"Lena O'Connor",    initials:"LC",  phone:"+447827001071", lastVisit:"10 months ago", product:"Acuvue Oasys Max",          age:37, risk:"medium", riskScore:63, revenue:280, status:"pending"    },
  { id:"P-071", name:"Marcus Kelly",     initials:"MK",  phone:"+447827001072", lastVisit:"5 months ago",  product:"Single Vision Glasses",      age:41, risk:"low",    riskScore:25, revenue:240, status:"recovered" },
  { id:"P-072", name:"Natasha Murphy",   initials:"NM",  phone:"+447827001073", lastVisit:"8 months ago",  product:"Contact Lenses",            age:24, risk:"low",    riskScore:23, revenue:140, status:"sent"      },
  { id:"P-073", name:"Oscar O'Donnell",  initials:"OOD", phone:"+447827001074", lastVisit:"4 months ago",  product:"Reading Glasses",            age:70, risk:"low",    riskScore:35, revenue:95, status:"booked"    },
  { id:"P-074", name:"Phoebe Walsh",     initials:"PWa", phone:"+447827001075", lastVisit:"11 months ago", product:"Bifocals",                  age:74, risk:"high",   riskScore:85, revenue:380, status:"alert"     },
  { id:"P-075", name:"Quinn Kelly",      initials:"QK",  phone:"+447827001076", lastVisit:"7 months ago",  product:"Monthly Contact Lenses",    age:30, risk:"low",    riskScore:29, revenue:170, status:"sent"      },
  { id:"P-076", name:"Rachel Murphy",    initials:"RMu", phone:"+447827001077", lastVisit:"3 months ago",  product:"Varifocals",                age:61, risk:"low",    riskScore:28, revenue:420, status:"checkin"   },
  { id:"P-077", name:"Samuel O'Neill",   initials:"SO",  phone:"+447827001078", lastVisit:"9 months ago",  product:"Acuvue Oasys",              age:40, risk:"medium", riskScore:68, revenue:185, status:"pending"    },
  { id:"P-078", name:"Tessa Kelly",      initials:"TK",  phone:"+447827001079", lastVisit:"6 months ago",  product:"Sports Glasses",            age:23, risk:"low",    riskScore:20, revenue:280, status:"sent"      },
  { id:"P-079", name:"Ulysses Murphy",   initials:"UM",  phone:"+447827001080", lastVisit:"10 months ago", product:"Single Vision Glasses",      age:46, risk:"low",    riskScore:21, revenue:240, status:"alert"     },
  { id:"P-080", name:"Vada O'Connor",    initials:"VC",  phone:"+447827001081", lastVisit:"5 months ago",  product:"Monthly Contact Lenses",    age:28, risk:"low",    riskScore:30, revenue:165, status:"recovered" },
  { id:"P-081", name:"Wade Walsh",       initials:"WW",  phone:"+447827001082", lastVisit:"8 months ago",  product:"Bifocals",                  age:71, risk:"high",   riskScore:80, revenue:380, status:"sent"      },
  { id:"P-082", name:"Xena O'Donnell",   initials:"XOD", phone:"+447827001083", lastVisit:"4 months ago",  product:"Varifocals",                age:59, risk:"medium", riskScore:57, revenue:420, status:"booked"    },
  { id:"P-083", name:"Yara Kelly",       initials:"YKe", phone:"+447827001084", lastVisit:"11 months ago", product:"Reading Glasses",            age:68, risk:"low",    riskScore:34, revenue:95, status:"pending"    },
  { id:"P-084", name:"Zeke Murphy",      initials:"ZMu", phone:"+447827001085", lastVisit:"7 months ago",  product:"Acuvue Oasys Max",          age:32, risk:"low",    riskScore:26, revenue:280, status:"sent"      },
  { id:"P-085", name:"Alena O'Neill",    initials:"AON", phone:"+447827001086", lastVisit:"3 months ago",  product:"Single Vision Glasses",      age:49, risk:"low",    riskScore:24, revenue:240, status:"checkin"   },
  { id:"P-086", name:"Blake Walsh",      initials:"BW2", phone:"+447827001087", lastVisit:"9 months ago",  product:"CooperVision Biofinity",    age:36, risk:"medium", riskScore:60, revenue:190, status:"sent"      },
  { id:"P-087", name:"Calista Murphy",   initials:"CMu", phone:"+447827001088", lastVisit:"6 months ago",  product:"Contact Lenses",            age:26, risk:"low",    riskScore:25, revenue:145, status:"alert"     },
  { id:"P-088", name:"Dashiell Kelly",   initials:"DK2", phone:"+447827001089", lastVisit:"10 months ago", product:"Varifocals",                age:65, risk:"high",   riskScore:81, revenue:420, status:"pending"    },
  { id:"P-089", name:"Eliana O'Connor",  initials:"EO",  phone:"+447827001090", lastVisit:"5 months ago",  product:"Monthly Contact Lenses",    age:33, risk:"low",    riskScore:28, revenue:170, status:"recovered" },
  { id:"P-090", name:"Finley Walsh",     initials:"FW",  phone:"+447827001091", lastVisit:"8 months ago",  product:"Single Vision Glasses",      age:44, risk:"low",    riskScore:23, revenue:240, status:"sent"      },
  { id:"P-091", name:"Giselle O'Donnell", initials:"GOD", phone:"+447827001092", lastVisit:"4 months ago",  product:"Bifocals",                  age:73, risk:"low",    riskScore:32, revenue:380, status:"booked"    },
  { id:"P-092", name:"Hollis Murphy",    initials:"HMu", phone:"+447827001093", lastVisit:"11 months ago", product:"Children's Glasses",        age:7,  risk:"low",    riskScore:14, revenue:180, status:"alert"     },
  { id:"P-093", name:"Iris Kelly",       initials:"IK",  phone:"+447827001094", lastVisit:"7 months ago",  product:"Acuvue Oasys",              age:38, risk:"medium", riskScore:64, revenue:185, status:"sent"      },
  { id:"P-094", name:"Jasper O'Neill",   initials:"JON", phone:"+447827001095", lastVisit:"3 months ago",  product:"Single Vision Glasses",      age:47, risk:"low",    riskScore:20, revenue:240, status:"pending"    },
  { id:"P-095", name:"Kendall Murphy",   initials:"KMu", phone:"+447827001096", lastVisit:"9 months ago",  product:"Monthly Contact Lenses",    age:29, risk:"low",    riskScore:27, revenue:165, status:"sent"      },
  { id:"P-096", name:"Lennox Walsh",     initials:"LW",  phone:"+447827001097", lastVisit:"6 months ago",  product:"Varifocals",                age:62, risk:"high",   riskScore:79, revenue:420, status:"checkin"    },
  { id:"P-097", name:"Morgan O'Connor",  initials:"MOC", phone:"+447827001098", lastVisit:"10 months ago", product:"Acuvue Oasys Max",          age:35, risk:"medium", riskScore:61, revenue:280, status:"alert"     },
  { id:"P-098", name:"Neve Kelly",       initials:"NK2", phone:"+447827001099", lastVisit:"5 months ago",  product:"Reading Glasses",            age:66, risk:"low",    riskScore:33, revenue:95, status:"recovered" },
  { id:"P-099", name:"Oakley O'Donnell", initials:"OOD2", phone:"+447827001100", lastVisit:"8 months ago",  product:"Bifocals",                  age:70, risk:"low",    riskScore:36, revenue:380, status:"sent"      },
  { id:"P-100", name:"Paisley Murphy",   initials:"PM",  phone:"+447827001101", lastVisit:"4 months ago",  product:"Monthly Contact Lenses",    age:31, risk:"low",    riskScore:29, revenue:165, status:"booked"    },
];

const DEMO_INBOX = [
  // TODAY (2026-04-14) - 15 conversations sorted by most recent first
  {
    id: "Caoimhe O'Sullivan",
    patient: "Caoimhe O'Sullivan",
    phone: "+447827001026",
    initials: "CO",
    preview: "Yes, absolutely. UV400 is best for tennis!",
    time: "18:02",
    unread: true,
    urgent: false,
    sentiment: "positive",
    thread: [
      { from:"patient", text:"Hi! Do your sports glasses have UV protection? I play tennis outdoors and want to protect my eyes.", time:"17:33", sent_at:"2026-04-14T17:33:00Z" },
      { from:"practice", text:"Hi Caoimhe, yes we have several sports frames with UV400 protection. Perfect for outdoor tennis! Would you like to come in for a fitting?", time:"17:48", sent_at:"2026-04-14T17:48:00Z" },
      { from:"patient", text:"Yes, absolutely. UV400 is best for tennis! When can I come in?", time:"18:02", sent_at:"2026-04-14T18:02:00Z" },
    ]
  },
  {
    id: "Michael O'Brien",
    patient: "Michael O'Brien",
    phone: "+447827001017",
    initials: "MO",
    preview: "Perfect! Booked for Tuesday 10am ✓",
    time: "17:08",
    unread: false,
    urgent: false,
    sentiment: "positive",
    thread: [
      { from:"practice", text:"Hi Michael, we have a slot available for your varifocal check-up on Tuesday at 10am. Does that work?", time:"16:45", sent_at:"2026-04-14T16:45:00Z" },
      { from:"patient", text:"Perfect! Booked for Tuesday 10am ✓", time:"17:08", sent_at:"2026-04-14T17:08:00Z" },
    ]
  },
  {
    id: "Shona Kay",
    patient: "Shona Kay",
    phone: "+447711552094",
    initials: "SK",
    preview: "Yes on my way now. Thanks so much!",
    time: "17:05",
    unread: false,
    urgent: true,
    sentiment: "urgent",
    thread: [
      { from:"patient", text:"Hi, my eye has been really red and painful since yesterday. Do you think I need to come in?", time:"16:52", sent_at:"2026-04-14T16:52:00Z" },
      { from:"practice", text:"Hi Shona, that sounds uncomfortable. Please come in straight away — this could be an infection. We can fit you in right now if you're nearby.", time:"16:58", sent_at:"2026-04-14T16:58:00Z" },
      { from:"patient", text:"Yes on my way now. Thanks so much!", time:"17:05", sent_at:"2026-04-14T17:05:00Z" },
    ]
  },
  {
    id: "Rachel O'Connor",
    patient: "Rachel O'Connor",
    phone: "+447827001016",
    initials: "RO",
    preview: "Cheers! That's really helpful",
    time: "16:18",
    unread: false,
    urgent: false,
    sentiment: "positive",
    thread: [
      { from:"patient", text:"Hi! How long do Dailies Total 1 usually last for? When should I expect to reorder?", time:"15:44", sent_at:"2026-04-14T15:44:00Z" },
      { from:"practice", text:"Hi Rachel! A box of 30 usually lasts about 4-5 weeks depending on how often you wear them. We can set up a reminder for you!", time:"15:52", sent_at:"2026-04-14T15:52:00Z" },
      { from:"patient", text:"Cheers! That's really helpful", time:"16:18", sent_at:"2026-04-14T16:18:00Z" },
    ]
  },
  {
    id: "Kevin Murphy",
    patient: "Kevin Murphy",
    phone: "+447827001021",
    initials: "KM",
    preview: "Ah brilliant, I'll pop in tomorrow!",
    time: "16:35",
    unread: true,
    urgent: false,
    sentiment: "positive",
    thread: [
      { from:"patient", text:"Hi, how much are your new varifocal frames? Looking for something in the mid-price range.", time:"16:12", sent_at:"2026-04-14T16:12:00Z" },
      { from:"practice", text:"Hi Kevin! Our varifocals range from £195-£450 depending on the brand and frame. We have some lovely styles in at the moment. Would you like to book a consultation?", time:"16:22", sent_at:"2026-04-14T16:22:00Z" },
      { from:"patient", text:"Ah brilliant, I'll pop in tomorrow!", time:"16:35", sent_at:"2026-04-14T16:35:00Z" },
    ]
  },
  {
    id: "Niamh Lynch",
    patient: "Niamh Lynch",
    phone: "+447827001024",
    initials: "NL",
    preview: "Already?! Thanks so much for the quick service!",
    time: "15:18",
    unread: false,
    urgent: false,
    sentiment: "positive",
    thread: [
      { from:"practice", text:"Hi Niamh! Your contact lenses and glasses just arrived. Ready to collect?", time:"14:50", sent_at:"2026-04-14T14:50:00Z" },
      { from:"patient", text:"Already?! Thanks so much for the quick service!", time:"15:18", sent_at:"2026-04-14T15:18:00Z" },
    ]
  },
  {
    id: "Margaret Flynn",
    patient: "Margaret Flynn",
    phone: "+447827001003",
    initials: "MF",
    preview: "Yes, that sounds great. I'll come in this week!",
    time: "15:05",
    unread: true,
    urgent: false,
    sentiment: "positive",
    thread: [
      { from:"practice", text:"Hi Margaret, we noticed your varifocals are due for replacement. Can we help you find a new pair?", time:"10:45", sent_at:"2026-04-14T10:45:00Z" },
      { from:"patient", text:"I've been looking at Specsavers for my next pair of glasses — they seem to have some good deals on at the moment. Are you able to price match at all?", time:"14:22", sent_at:"2026-04-14T14:22:00Z" },
      { from:"practice", text:"Hi Margaret! Yes, we can match Specsavers pricing on standard varifocals. Plus we offer complimentary adjustments for life. How does that sound?", time:"14:40", sent_at:"2026-04-14T14:40:00Z" },
      { from:"patient", text:"Yes, that sounds great. I'll come in this week!", time:"15:05", sent_at:"2026-04-14T15:05:00Z" },
    ]
  },
  {
    id: "Patricia Ross",
    patient: "Patricia Ross",
    phone: "+447827001014",
    initials: "PR",
    preview: "Great, I'll come in around 4pm. Thanks!",
    time: "14:12",
    unread: false,
    urgent: false,
    sentiment: "positive",
    thread: [
      { from:"patient", text:"Hi, are my glasses ready to pick up yet?", time:"13:27", sent_at:"2026-04-14T13:27:00Z" },
      { from:"practice", text:"Hi Patricia! Your glasses are ready! We're open until 5:30pm today if you'd like to pop in.", time:"13:55", sent_at:"2026-04-14T13:55:00Z" },
      { from:"patient", text:"Great, I'll come in around 4pm. Thanks!", time:"14:12", sent_at:"2026-04-14T14:12:00Z" },
    ]
  },
  {
    id: "Padraig Flynn",
    patient: "Padraig Flynn",
    phone: "+447827001025",
    initials: "PF",
    preview: "That's brilliant! He'll love the dinosaur frames 😄",
    time: "13:45",
    unread: true,
    urgent: false,
    sentiment: "positive",
    thread: [
      { from:"patient", text:"Hi, my son is getting his first pair of glasses and he's a bit worried about looking different. Do you have any fun colourful frames for kids?", time:"13:02", sent_at:"2026-04-14T13:02:00Z" },
      { from:"practice", text:"Hi Padraig! We have loads of fun frames for kids! We've just got in some brilliant dinosaur designs and fun colours. Kids love them! Would you like to book an appointment?", time:"13:20", sent_at:"2026-04-14T13:20:00Z" },
      { from:"patient", text:"That's brilliant! He'll love the dinosaur frames 😄", time:"13:45", sent_at:"2026-04-14T13:45:00Z" },
    ]
  },
  {
    id: "Fiona Gallagher",
    patient: "Fiona Gallagher",
    phone: "+447827001018",
    initials: "FG",
    preview: "Yes! Still looking for better options. When can I come in?",
    time: "12:19",
    unread: true,
    urgent: false,
    sentiment: "positive",
    thread: [
      { from:"practice", text:"Hi Fiona, we have a new multifocal contact lens we think you'd like to try. Interested?", time:"11:42", sent_at:"2026-04-14T11:42:00Z" },
      { from:"patient", text:"Yes! Still looking for better options. When can I come in?", time:"12:19", sent_at:"2026-04-14T12:19:00Z" },
      { from:"practice", text:"Great! We have availability Thursday at 10am or Friday at 2pm. Which suits you?", time:"12:28", sent_at:"2026-04-14T12:28:00Z" },
      { from:"patient", text:"Friday at 2pm works perfectly! See you then 😊", time:"12:42", sent_at:"2026-04-14T12:42:00Z" },
    ]
  },
  {
    id: "Emma Wilson",
    patient: "Emma Wilson",
    phone: "+447827001010",
    initials: "EW",
    preview: "Brilliant! Can I book her in next week?",
    time: "14:50",
    unread: true,
    urgent: false,
    sentiment: "positive",
    thread: [
      { from:"patient", text:"Hi! Can you do a pediatric eye test for my 5 year old daughter? She's been squinting at the board at school.", time:"14:08", sent_at:"2026-04-14T14:08:00Z" },
      { from:"practice", text:"Absolutely! We do children's eye tests from age 3+. Dr. Patel is excellent with kids. Would you like to book?", time:"14:35", sent_at:"2026-04-14T14:35:00Z" },
      { from:"patient", text:"Brilliant! Can I book her in next week?", time:"14:50", sent_at:"2026-04-14T14:50:00Z" },
    ]
  },
  {
    id: "Tom Bradley",
    patient: "Tom Bradley",
    phone: "+447827001002",
    initials: "TB",
    preview: "Excellent, when will they be delivered?",
    time: "11:58",
    unread: true,
    urgent: false,
    sentiment: "positive",
    thread: [
      { from:"patient", text:"Hi, can I order more monthly lenses please?", time:"11:08", sent_at:"2026-04-14T11:08:00Z" },
      { from:"practice", text:"Of course! Which brand are you currently wearing?", time:"11:25", sent_at:"2026-04-14T11:25:00Z" },
      { from:"patient", text:"The Proclear ones, I think? Same as last time 😊", time:"11:43", sent_at:"2026-04-14T11:43:00Z" },
      { from:"practice", text:"Perfect! I'll order those for you now. They usually arrive within 3-5 working days.", time:"11:52", sent_at:"2026-04-14T11:52:00Z" },
      { from:"patient", text:"Excellent, when will they be delivered?", time:"11:58", sent_at:"2026-04-14T11:58:00Z" },
    ]
  },
  {
    id: "Connor Walsh",
    patient: "Connor Walsh",
    phone: "+447827001023",
    initials: "CW",
    preview: "Yeah, that would be great, cheers!",
    time: "11:38",
    unread: true,
    urgent: false,
    sentiment: "positive",
    thread: [
      { from:"patient", text:"Hi! Do you stock the new CooperVision Biofinity lenses? My friend recommends them.", time:"11:21", sent_at:"2026-04-14T11:21:00Z" },
      { from:"practice", text:"Hi Connor! Yes, we do stock Biofinity. They're a great lens! Would you like to book a fitting?", time:"11:31", sent_at:"2026-04-14T11:31:00Z" },
      { from:"patient", text:"Yeah, that would be great, cheers!", time:"11:38", sent_at:"2026-04-14T11:38:00Z" },
    ]
  },
  {
    id: "Brian Walsh",
    patient: "Brian Walsh",
    phone: "+447827001013",
    initials: "BW",
    preview: "Yes please! How quickly can you get them?",
    time: "10:48",
    unread: true,
    urgent: false,
    sentiment: "positive",
    thread: [
      { from:"patient", text:"Hi, I'm running low on my Dailies Total 1 lenses. Can I place an order?", time:"10:33", sent_at:"2026-04-14T10:33:00Z" },
      { from:"practice", text:"Hi Brian! Of course. How many boxes would you like?", time:"10:41", sent_at:"2026-04-14T10:41:00Z" },
      { from:"patient", text:"Yes please! How quickly can you get them?", time:"10:48", sent_at:"2026-04-14T10:48:00Z" },
    ]
  },
  {
    id: "Louise Everton",
    patient: "Louise Everton",
    phone: "+447827322027",
    initials: "LE",
    preview: "Perfect! Thursday 3pm works for me 😊",
    time: "10:15",
    unread: true,
    urgent: false,
    sentiment: "positive",
    thread: [
      { from:"practice", text:"Hi Louise, this is Bright Eyes Opticians. Your annual eye test is due — would you like to book an appointment?", time:"09:15", sent_at:"2026-04-14T09:15:00Z" },
      { from:"patient", text:"Hi, yes I'd like to rebook please! Preferably Thursday afternoon?", time:"09:32", sent_at:"2026-04-14T09:32:00Z" },
      { from:"practice", text:"Lovely! We have Thursday at 3pm or 4:30pm available. Which would suit you?", time:"10:05", sent_at:"2026-04-14T10:05:00Z" },
      { from:"patient", text:"Perfect! Thursday 3pm works for me 😊", time:"10:15", sent_at:"2026-04-14T10:15:00Z" },
    ]
  },
  {
    id: "David Kelly",
    patient: "David Kelly",
    phone: "+447827001015",
    initials: "DK",
    preview: "Thanks for the reminder! I'll be there 😊",
    time: "08:56",
    unread: false,
    urgent: false,
    sentiment: "positive",
    thread: [
      { from:"practice", text:"Hi David, just a reminder that your eye test is today at 2:30pm with Dr. Chen. See you then!", time:"08:30", sent_at:"2026-04-14T08:30:00Z" },
      { from:"patient", text:"Thanks for the reminder! I'll be there 😊", time:"08:56", sent_at:"2026-04-14T08:56:00Z" },
    ]
  },

  // YESTERDAY (2026-04-13) - 10 conversations
  {
    id: "James Morrison",
    patient: "James Morrison",
    phone: "+447711223344",
    initials: "JM",
    preview: "My prescription has changed, need new frames",
    time: "17:22",
    unread: false,
    urgent: false,
    sentiment: "positive",
    thread: [
      { from:"patient", text:"Hi, had my eye test last month and my prescription's changed. Need to order new frames now.", time:"17:22", sent_at:"2026-04-13T17:22:00Z" },
      { from:"practice", text:"Hi James! No problem at all. Would you like to come in and browse our selection, or would you prefer recommendations based on your style?", time:"17:45", sent_at:"2026-04-13T17:45:00Z" },
      { from:"patient", text:"I'd prefer to come in and see them in person tbh", time:"18:10", sent_at:"2026-04-13T18:10:00Z" },
      { from:"practice", text:"Perfect! We're open tomorrow from 9am. Pop in whenever suits!", time:"18:25", sent_at:"2026-04-13T18:25:00Z" },
    ]
  },
  {
    id: "Sophie Bennett",
    patient: "Sophie Bennett",
    phone: "+447711334455",
    initials: "SB",
    preview: "Left my contact lens case, can you hold it?",
    time: "16:15",
    unread: true,
    urgent: false,
    sentiment: "positive",
    thread: [
      { from:"patient", text:"Oh no! I think I left my contact lens case on the desk after my appointment. Did anyone find it?", time:"16:15", sent_at:"2026-04-13T16:15:00Z" },
      { from:"practice", text:"Hi Sophie! Yes, we found it! Don't worry, we'll keep it safe here for you.", time:"16:32", sent_at:"2026-04-13T16:32:00Z" },
      { from:"patient", text:"Oh brilliant thanks! I'll pick it up tomorrow after work 😊", time:"16:48", sent_at:"2026-04-13T16:48:00Z" },
    ]
  },
  {
    id: "Ciara Murphy",
    patient: "Ciara Murphy",
    phone: "+447827001004",
    initials: "CM",
    preview: "Yes, confirmed for tomorrow at 2pm! ✓",
    time: "15:30",
    unread: false,
    urgent: false,
    sentiment: "positive",
    thread: [
      { from:"practice", text:"Hi Ciara, just confirming your eye test appointment is tomorrow at 2pm with Dr. Chen. Does that still work for you?", time:"15:12", sent_at:"2026-04-13T15:12:00Z" },
      { from:"patient", text:"Yes, confirmed for tomorrow at 2pm! ✓", time:"15:30", sent_at:"2026-04-13T15:30:00Z" },
    ]
  },
  {
    id: "Liam Murphy",
    patient: "Liam Murphy",
    phone: "+447711445566",
    initials: "LM",
    preview: "Broken left lens, need them urgently!",
    time: "14:08",
    unread: true,
    urgent: true,
    sentiment: "urgent",
    thread: [
      { from:"patient", text:"Hi, I've broken the left lens on my glasses. I really need them for work. Can you fix them today?", time:"14:08", sent_at:"2026-04-13T14:08:00Z" },
      { from:"practice", text:"Hi Liam! We can definitely help. Can you come in this afternoon? We should be able to replace the lens while you wait.", time:"14:22", sent_at:"2026-04-13T14:22:00Z" },
      { from:"patient", text:"Amazing! I'll be there in 20 mins", time:"14:35", sent_at:"2026-04-13T14:35:00Z" },
    ]
  },
  {
    id: "Ann Hughes",
    patient: "Ann Hughes",
    phone: "+447827001012",
    initials: "AH",
    preview: "Confirmed for Thursday 2:30pm ✓",
    time: "11:50",
    unread: false,
    urgent: false,
    sentiment: "positive",
    thread: [
      { from:"practice", text:"Hi Ann, your varifocal dispense is Thursday at 2:30pm with Dr. Patel. All set?", time:"11:20", sent_at:"2026-04-13T11:20:00Z" },
      { from:"patient", text:"Confirmed for Thursday 2:30pm ✓", time:"11:50", sent_at:"2026-04-13T11:50:00Z" },
    ]
  },
  {
    id: "Sinéad McCarthy",
    patient: "Sinéad McCarthy",
    phone: "+447827001020",
    initials: "SM",
    preview: "Great, will do. See you Friday!",
    time: "14:41",
    unread: false,
    urgent: false,
    sentiment: "positive",
    thread: [
      { from:"practice", text:"Hi Sinéad! Your contact lens fitting is Friday at 3pm. Please bring your current prescription if you have it.", time:"14:15", sent_at:"2026-04-13T14:15:00Z" },
      { from:"patient", text:"Great, will do. See you Friday!", time:"14:41", sent_at:"2026-04-13T14:41:00Z" },
    ]
  },
  {
    id: "Robert Hughes",
    patient: "Robert Hughes",
    phone: "+447827001011",
    initials: "RH",
    preview: "Wednesday sounds perfect, thanks!",
    time: "10:28",
    unread: false,
    urgent: false,
    sentiment: "positive",
    thread: [
      { from:"patient", text:"Hi, I ordered varifocals two weeks ago. Is the stock in yet? When can I collect?", time:"09:44", sent_at:"2026-04-13T09:44:00Z" },
      { from:"practice", text:"Hi Robert! Yes, they arrived yesterday. You can collect anytime between 9am-5:30pm. Would Wednesday suit you?", time:"10:15", sent_at:"2026-04-13T10:15:00Z" },
      { from:"patient", text:"Wednesday sounds perfect, thanks!", time:"10:28", sent_at:"2026-04-13T10:28:00Z" },
    ]
  },
  {
    id: "Oliver Grant",
    patient: "Oliver Grant",
    phone: "+447711556677",
    initials: "OG",
    preview: "Reminder: Contact lens order ready!",
    time: "09:15",
    unread: false,
    urgent: false,
    sentiment: null,
    thread: [
      { from:"practice", text:"Hi Oliver! Your contact lens order has arrived and is ready for collection. Please pop in at your earliest convenience!", time:"09:15", sent_at:"2026-04-13T09:15:00Z" },
    ]
  },
  {
    id: "Sarah Flynn",
    patient: "Sarah Flynn",
    phone: "+447827001006",
    initials: "SF",
    preview: "No thanks, I've moved to a different practice",
    time: "12:45",
    unread: true,
    urgent: false,
    sentiment: "negative",
    thread: [
      { from:"practice", text:"Hi Sarah, your varifocals prescription is due for review. Would you like to book a check-up?", time:"10:30", sent_at:"2026-04-13T10:30:00Z" },
      { from:"patient", text:"No thanks, I've moved to a different practice. All the best though!", time:"12:45", sent_at:"2026-04-13T12:45:00Z" },
    ]
  },
  {
    id: "Declan Murphy",
    patient: "Declan Murphy",
    phone: "+447827001019",
    initials: "DM",
    preview: "Are you open on Saturdays?",
    time: "10:07",
    unread: true,
    urgent: false,
    sentiment: null,
    thread: [
      { from:"patient", text:"Hi, I'd like to collect my reading glasses but I'm usually only free on Saturdays. Are you open?", time:"10:07", sent_at:"2026-04-13T10:07:00Z" },
    ]
  },

  // 2 DAYS AGO (2026-04-12) - 5 conversations
  {
    id: "Jessica Chen",
    patient: "Jessica Chen",
    phone: "+447711667788",
    initials: "JC",
    preview: "Thanks so much, brilliant service!",
    time: "16:45",
    unread: false,
    urgent: false,
    sentiment: "positive",
    thread: [
      { from:"practice", text:"Hi Jessica! Your glasses are ready for collection. We're open until 5:30pm today!", time:"16:20", sent_at:"2026-04-12T16:20:00Z" },
      { from:"patient", text:"Thanks so much, brilliant service! Coming now 😊", time:"16:45", sent_at:"2026-04-12T16:45:00Z" },
    ]
  },
  {
    id: "Jess Brown",
    patient: "Jess Brown",
    phone: "+447572043380",
    initials: "JB",
    preview: "Perfect! See you Monday 😊",
    time: "10:22",
    unread: false,
    urgent: false,
    sentiment: "positive",
    thread: [
      { from:"practice", text:"Hi Jess! Your contact lens check is booked for Monday at 9am. Looking forward to seeing you!", time:"10:05", sent_at:"2026-04-12T10:05:00Z" },
      { from:"patient", text:"Perfect! See you Monday 😊", time:"10:22", sent_at:"2026-04-12T10:22:00Z" },
    ]
  },
  {
    id: "Aisling Kelly",
    patient: "Aisling Kelly",
    phone: "+447827001022",
    initials: "AK",
    preview: "Confirmed! See you then.",
    time: "09:33",
    unread: false,
    urgent: false,
    sentiment: "positive",
    thread: [
      { from:"practice", text:"Hi Aisling, your annual eye test is booked for next Wednesday at 11:30am. Confirmed?", time:"09:10", sent_at:"2026-04-12T09:10:00Z" },
      { from:"patient", text:"Confirmed! See you then.", time:"09:33", sent_at:"2026-04-12T09:33:00Z" },
    ]
  },
  {
    id: "Marcus Thompson",
    patient: "Marcus Thompson",
    phone: "+447711778899",
    initials: "MT",
    preview: "Automated recall: Annual eye test due",
    time: "08:00",
    unread: false,
    urgent: false,
    sentiment: null,
    thread: [
      { from:"practice", text:"Hi Marcus! Your annual eye test is due. Would you like to book an appointment? Reply YES to confirm.", time:"08:00", sent_at:"2026-04-12T08:00:00Z" },
    ]
  },
  {
    id: "Helena Kowalski",
    patient: "Helena Kowalski",
    phone: "+447711889900",
    initials: "HK",
    preview: "Eye test completed successfully ✓",
    time: "15:30",
    unread: false,
    urgent: false,
    sentiment: "positive",
    thread: [
      { from:"practice", text:"Hi Helena! Thanks for coming in today. Your eye test went really well! We'll send your prescription to your email shortly.", time:"15:30", sent_at:"2026-04-12T15:30:00Z" },
    ]
  },
];

const REVIEWS = [
  { name:"Sarah M.",    stars:5, text:"Got a lovely WhatsApp the day after my appointment — such a personal touch. Couldn't not leave a review!", days:"1 day ago",   via:true  },
  { name:"Claire D.",   stars:5, text:"They followed up after my kids' appointment to check we were happy. Brilliant practice.",                  days:"3 days ago",  via:true  },
  { name:"Tom B.",      stars:5, text:"New glasses are perfect. The WhatsApp check-in was a really nice touch — felt genuinely cared for.",       days:"1 week ago",  via:true  },
  { name:"Patricia R.", stars:5, text:"Fantastic service from start to finish. Was surprised to get a message checking in afterwards!",            days:"2 weeks ago", via:false },
];

const REVIEW_REQUESTS = [
  { patient:"Emma Wilson",    date:"18 Mar", trigger:"Appointment confirmed", status:"left",    phone:"+447827001010" },
  { patient:"Tom Bradley",    date:"18 Mar", trigger:"Positive reply",        status:"pending", phone:"+447827001002" },
  { patient:"Priya Sharma",   date:"17 Mar", trigger:"Appointment confirmed", status:"left",    phone:"+447827001011" },
  { patient:"Jim Bru",     date:"15 Mar", trigger:"Positive reply",        status:"pending", phone:"+447803003472" },
  { patient:"Sarah Flynn",    date:"14 Mar", trigger:"Appointment confirmed", status:"none",    phone:"+447827001006" },
  { patient:"Ciara Murphy",   date:"12 Mar", trigger:"Positive reply",        status:"left",    phone:"+447827001004" },
  { patient:"Louise Everton", date:"10 Mar", trigger:"Appointment confirmed", status:"none",    phone:"+447827322027" },
  { patient:"Margaret Flynn", date:"8 Mar",  trigger:"Positive reply",        status:"pending", phone:"+447827001003" },
];

const STAR_BREAKDOWN = [
  { stars:5, count:132 }, { stars:4, count:10 }, { stars:3, count:3 }, { stars:2, count:1 }, { stars:1, count:1 },
];
const REVIEW_THEMES = [
  { label:"Friendly staff",       pct:78 },
  { label:"Professional advice",  pct:65 },
  { label:"Quick service",        pct:59 },
  { label:"Good value",           pct:43 },
];

const APPOINTMENTS = [
  { patient:"Emma Wilson",    type:"Eye Test",              time:"09:00", optician:"Dr. Patel", confirmed:true,  viaIryss:false, revenue:45,  phone:"+447827001010" },
  { patient:"Tom Bradley",    type:"Contact Lens Fitting",  time:"10:30", optician:"Dr. Chen",  confirmed:true,  viaIryss:true,  revenue:120, phone:"+447827001002" },
  { patient:"Priya Sharma",   type:"Glasses Collection",    time:"11:15", optician:"Dr. Patel", confirmed:true,  viaIryss:false, revenue:340, phone:"+447827001011" },
  { patient:"Jim Bru",     type:"Multifocal CL Trial",   time:"15:30", optician:"Dr. Chen",  confirmed:true,  viaIryss:true,  revenue:85,  phone:"+447803003472" },
  { patient:"Carol Mitchell", type:"Follow-Up",             time:"17:00", optician:"Dr. Patel", confirmed:false, viaIryss:false, revenue:30,  phone:"+447827001012" },
];

const UPCOMING_WEEK = [
  { day:"Monday",    date:"23 March", appts:[
    { patient:"Sarah Flynn",    type:"Eye Test",             time:"09:30", optician:"Dr. Patel", confirmed:true,  revenue:45  },
    { patient:"Robert Hughes",  type:"Contact Lens Check",   time:"11:00", optician:"Dr. Chen",  confirmed:false, revenue:65  },
    { patient:"Ann Hughes",     type:"Varifocal Dispense",   time:"14:30", optician:"Dr. Patel", confirmed:true,  revenue:380 },
  ]},
  { day:"Tuesday",   date:"24 March", appts:[
    { patient:"Ciara Murphy",   type:"Eye Test",             time:"10:00", optician:"Dr. Chen",  confirmed:true,  revenue:45  },
    { patient:"Brian Walsh",    type:"Contact Lens Fitting", time:"14:00", optician:"Dr. Patel", confirmed:false, revenue:120 },
  ]},
  { day:"Wednesday", date:"25 March", appts:[
    { patient:"Louise Everton", type:"Contact Lens Check",   time:"09:00", optician:"Dr. Chen",  confirmed:true,  revenue:65  },
    { patient:"Shona Kay",  type:"Eye Test",             time:"11:30", optician:"Dr. Patel", confirmed:false, revenue:45  },
    { patient:"Mark Graham",    type:"Glasses Collection",   time:"15:00", optician:"Dr. Chen",  confirmed:true,  revenue:280 },
  ]},
  { day:"Thursday",  date:"26 March", appts:[
    { patient:"Tom Bradley",    type:"CL Annual Review",     time:"10:30", optician:"Dr. Patel", confirmed:true,  revenue:85  },
    { patient:"Jess Brown",     type:"Eye Test",             time:"13:00", optician:"Dr. Chen",  confirmed:false, revenue:45  },
  ]},
  { day:"Friday",    date:"27 March", appts:[
    { patient:"Jim Bru",     type:"Multifocal CL Review", time:"09:00", optician:"Dr. Patel", confirmed:true,  revenue:80  },
    { patient:"Patricia Ross",  type:"Varifocal Dispense",   time:"11:00", optician:"Dr. Chen",  confirmed:false, revenue:340 },
    { patient:"David Kelly",    type:"Eye Test",             time:"14:30", optician:"Dr. Patel", confirmed:true,  revenue:45  },
  ]},
];

// ═══════════════════════════════════════════════════════════════════════════
// MYOPIA CLINIC — paediatric myopia management dataset
// AL = axial length (mm). alChange = mm/yr over last 12 months.
// Status rules: responding <0.10 mm/yr · slowing 0.10–0.20 · progressing >0.20
// ═══════════════════════════════════════════════════════════════════════════
const MYOPIA_PATIENTS = [
  // ── Active — responding well
  { id:"M-001", name:"Oliver Chen",       initials:"OC", age:9,  sphereOD:-2.50, sphereOS:-2.75, axialOD:24.8, axialOS:24.9, alChange:0.06, treatment:"MiSight 1 Day",     treatmentStart:"Jun 2025", lastReview:"Dec 2025", nextReview:"Jun 2026", parentalMyopia:"Both",   outdoorHrs:2.5, compliance:"excellent", category:"active",   status:"responding",  parent:"Wei Chen",       phone:"+447700900101" },
  { id:"M-002", name:"Sophia Patel",      initials:"SP", age:10, sphereOD:-3.25, sphereOS:-3.00, axialOD:25.1, axialOS:25.0, alChange:0.08, treatment:"Stellest",          treatmentStart:"Sep 2024", lastReview:"Mar 2026", nextReview:"Sep 2026", parentalMyopia:"Mother", outdoorHrs:3.0, compliance:"good",      category:"active",   status:"responding",  parent:"Priya Patel",    phone:"+447700900102" },
  { id:"M-003", name:"Noah Williams",     initials:"NW", age:11, sphereOD:-1.75, sphereOS:-2.00, axialOD:24.3, axialOS:24.4, alChange:0.04, treatment:"Ortho-K",           treatmentStart:"Jan 2025", lastReview:"Jan 2026", nextReview:"Jul 2026", parentalMyopia:"Father", outdoorHrs:4.0, compliance:"excellent", category:"active",   status:"responding",  parent:"Emma Williams",  phone:"+447700900103" },
  { id:"M-004", name:"Ava Johnson",       initials:"AJ", age:8,  sphereOD:-1.50, sphereOS:-1.25, axialOD:23.9, axialOS:23.8, alChange:0.07, treatment:"MiSight 1 Day",     treatmentStart:"Feb 2025", lastReview:"Feb 2026", nextReview:"Aug 2026", parentalMyopia:"Both",   outdoorHrs:2.0, compliance:"good",      category:"active",   status:"responding",  parent:"Sarah Johnson",  phone:"+447700900104" },
  { id:"M-005", name:"Ethan Kumar",       initials:"EK", age:12, sphereOD:-4.00, sphereOS:-3.75, axialOD:25.6, axialOS:25.4, alChange:0.09, treatment:"MiYOSMART",         treatmentStart:"Apr 2024", lastReview:"Oct 2025", nextReview:"Apr 2026", parentalMyopia:"Mother", outdoorHrs:1.5, compliance:"good",      category:"active",   status:"responding",  parent:"Anita Kumar",    phone:"+447700900105" },
  // ── Active — slowing, borderline
  { id:"M-006", name:"Mia Davies",        initials:"MD", age:10, sphereOD:-2.75, sphereOS:-2.50, axialOD:24.9, axialOS:24.7, alChange:0.14, treatment:"MiSight 1 Day",     treatmentStart:"Oct 2024", lastReview:"Oct 2025", nextReview:"Apr 2026", parentalMyopia:"Father", outdoorHrs:2.5, compliance:"fair",      category:"active",   status:"slowing",     parent:"Gareth Davies",  phone:"+447700900106" },
  { id:"M-007", name:"Liam Thompson",     initials:"LT", age:11, sphereOD:-3.50, sphereOS:-3.75, axialOD:25.3, axialOS:25.4, alChange:0.16, treatment:"Atropine 0.025%",   treatmentStart:"Jul 2025", lastReview:"Jan 2026", nextReview:"Jul 2026", parentalMyopia:"Both",   outdoorHrs:2.0, compliance:"good",      category:"active",   status:"slowing",     parent:"Lisa Thompson",  phone:"+447700900107" },
  { id:"M-008", name:"Isla Roberts",      initials:"IR", age:9,  sphereOD:-2.00, sphereOS:-2.25, axialOD:24.5, axialOS:24.6, alChange:0.12, treatment:"Stellest",          treatmentStart:"Jan 2025", lastReview:"Jan 2026", nextReview:"Jul 2026", parentalMyopia:"Mother", outdoorHrs:3.5, compliance:"excellent", category:"active",   status:"slowing",     parent:"Helen Roberts",  phone:"+447700900108" },
  // ── Active — progressing (flagged: consider switch / combo)
  { id:"M-009", name:"Jack Morgan",       initials:"JM", age:11, sphereOD:-4.25, sphereOS:-4.00, axialOD:25.9, axialOS:25.7, alChange:0.26, treatment:"MiSight 1 Day",     treatmentStart:"Sep 2024", lastReview:"Mar 2026", nextReview:"Sep 2026", parentalMyopia:"Both",   outdoorHrs:1.0, compliance:"poor",      category:"active",   status:"progressing", parent:"David Morgan",   phone:"+447700900109" },
  { id:"M-010", name:"Amelia Brown",      initials:"AB", age:12, sphereOD:-5.00, sphereOS:-5.25, axialOD:26.2, axialOS:26.3, alChange:0.32, treatment:"Stellest",          treatmentStart:"May 2024", lastReview:"Nov 2025", nextReview:"May 2026", parentalMyopia:"Both",   outdoorHrs:1.5, compliance:"fair",      category:"active",   status:"progressing", parent:"Rachel Brown",   phone:"+447700900110" },
  // ── Trial / fitting phase
  { id:"M-011", name:"Harry Singh",       initials:"HS", age:10, sphereOD:-2.25, sphereOS:-2.00, axialOD:24.6, axialOS:24.5, alChange:null, treatment:"Ortho-K (trial)",   treatmentStart:"Feb 2026", lastReview:"Mar 2026", nextReview:"Apr 2026", parentalMyopia:"Father", outdoorHrs:3.0, compliance:"—",         category:"trial",    status:"trial",       parent:"Ravi Singh",     phone:"+447700900111" },
  { id:"M-012", name:"Grace Evans",       initials:"GE", age:8,  sphereOD:-1.25, sphereOS:-1.50, axialOD:23.9, axialOS:24.0, alChange:null, treatment:"MiSight (fitting)", treatmentStart:"Mar 2026", lastReview:"Mar 2026", nextReview:"Apr 2026", parentalMyopia:"Both",   outdoorHrs:2.5, compliance:"—",         category:"trial",    status:"trial",       parent:"Megan Evans",    phone:"+447700900112" },
  // ── Pre-myopic / at-risk (lifestyle + monitoring only)
  { id:"M-013", name:"Lucas Green",       initials:"LG", age:6,  sphereOD:0.50,  sphereOS:0.50,  axialOD:23.0, axialOS:23.1, alChange:0.22, treatment:"Monitoring only",   treatmentStart:"—",        lastReview:"Jan 2026", nextReview:"Jul 2026", parentalMyopia:"Both",   outdoorHrs:1.5, compliance:"—",         category:"at-risk",  status:"at-risk",     parent:"Sophie Green",   phone:"+447700900113" },
  { id:"M-014", name:"Freya Wilson",      initials:"FW", age:7,  sphereOD:0.25,  sphereOS:0.00,  axialOD:23.3, axialOS:23.4, alChange:0.28, treatment:"Monitoring only",   treatmentStart:"—",        lastReview:"Feb 2026", nextReview:"Aug 2026", parentalMyopia:"Both",   outdoorHrs:1.0, compliance:"—",         category:"at-risk",  status:"at-risk",     parent:"Kate Wilson",    phone:"+447700900114" },
  { id:"M-015", name:"Theo Clarke",       initials:"TC", age:6,  sphereOD:0.75,  sphereOS:0.50,  axialOD:22.9, axialOS:23.0, alChange:0.18, treatment:"Lifestyle advice",  treatmentStart:"Feb 2026", lastReview:"Feb 2026", nextReview:"Aug 2026", parentalMyopia:"Mother", outdoorHrs:2.0, compliance:"—",         category:"at-risk",  status:"at-risk",     parent:"Ben Clarke",     phone:"+447700900115" },
  // ── Stable, not on treatment
  { id:"M-016", name:"Ruby Fisher",       initials:"RF", age:13, sphereOD:-2.00, sphereOS:-2.00, axialOD:24.5, axialOS:24.5, alChange:0.03, treatment:"Single vision",     treatmentStart:"—",        lastReview:"Dec 2025", nextReview:"Jun 2026", parentalMyopia:"Mother", outdoorHrs:3.5, compliance:"—",         category:"stable",   status:"stable",      parent:"Anna Fisher",    phone:"+447700900116" },
  { id:"M-017", name:"Alfie Bennett",     initials:"AB", age:14, sphereOD:-3.50, sphereOS:-3.25, axialOD:25.3, axialOS:25.2, alChange:0.04, treatment:"Single vision",     treatmentStart:"—",        lastReview:"Nov 2025", nextReview:"May 2026", parentalMyopia:"Father", outdoorHrs:2.5, compliance:"—",         category:"stable",   status:"stable",      parent:"Mark Bennett",   phone:"+447700900117" },
  // ── Graduated (AL stable ≥12m, age ≥15)
  { id:"M-018", name:"Daisy Hall",        initials:"DH", age:16, sphereOD:-4.50, sphereOS:-4.25, axialOD:25.8, axialOS:25.7, alChange:0.02, treatment:"Graduated · was MiSight", treatmentStart:"—",  lastReview:"Feb 2026", nextReview:"Feb 2027", parentalMyopia:"Both",   outdoorHrs:3.0, compliance:"—",         category:"graduated",status:"graduated",   parent:"Louise Hall",    phone:"+447700900118" },
  // ── Lapsed / overdue recall
  { id:"M-019", name:"Archie Price",      initials:"AP", age:10, sphereOD:-3.00, sphereOS:-3.25, axialOD:25.0, axialOS:25.1, alChange:null, treatment:"MiSight 1 Day",     treatmentStart:"May 2024", lastReview:"Jul 2025", nextReview:"Jan 2026", parentalMyopia:"Both",   outdoorHrs:2.0, compliance:"unknown",   category:"lapsed",   status:"lapsed",      parent:"Tom Price",      phone:"+447700900119" },
  { id:"M-020", name:"Poppy Cooper",      initials:"PC", age:11, sphereOD:-2.75, sphereOS:-2.50, axialOD:24.7, axialOS:24.6, alChange:null, treatment:"Stellest",          treatmentStart:"Aug 2024", lastReview:"Sep 2025", nextReview:"Mar 2026", parentalMyopia:"Mother", outdoorHrs:2.5, compliance:"unknown",   category:"lapsed",   status:"lapsed",      parent:"Jane Cooper",    phone:"+447700900120" },
];

const MYOPIA_TREATMENT_COLORS = {
  "MiSight 1 Day":     "#0891B2",
  "Stellest":          "#8B5CF6",
  "MiYOSMART":         "#EC4899",
  "Ortho-K":           "#F59E0B",
  "Ortho-K (trial)":   "#F59E0B",
  "MiSight (fitting)": "#0891B2",
  "Atropine 0.025%":   "#10B981",
  "Atropine 0.05%":    "#059669",
  "Atropine 0.01%":    "#34D399",
  "Monitoring only":   "#94A3B8",
  "Lifestyle advice":  "#64748B",
  "Single vision":     "#94A3B8",
};
const MYOPIA_STATUS = {
  responding:  { label:"Responding",  color:"#10B981", bg:"rgba(16,185,129,.12)" },
  slowing:     { label:"Slowing",     color:"#F59E0B", bg:"rgba(245,158,11,.12)" },
  progressing: { label:"Progressing", color:"#EF4444", bg:"rgba(239,68,68,.12)"  },
  trial:       { label:"In trial",    color:"#0891B2", bg:"rgba(8,145,178,.12)"  },
  "at-risk":   { label:"At risk",     color:"#8B5CF6", bg:"rgba(139,92,246,.12)" },
  stable:      { label:"Stable",      color:"#64748B", bg:"rgba(100,116,139,.12)" },
  graduated:   { label:"Graduated",   color:"#94A3B8", bg:"rgba(148,163,184,.12)" },
  lapsed:      { label:"Overdue",     color:"#EF4444", bg:"rgba(239,68,68,.12)"  },
};

const riskLabel = { high:"HIGH", medium:"MEDIUM", low:"LOW" };
const riskBg    = { high:"rgba(239,68,68,.12)", medium:"rgba(245,158,11,.12)", low:"rgba(16,185,129,.12)" };
const riskFg    = { high:"#EF4444", medium:"#D97706", low:"#059669" };
const avatarColors = ["#0891B2","#8B5CF6","#F59E0B","#10B981","#EF4444","#EC4899","#6366F1","#14B8A6"];
const getColor = i => avatarColors[i % avatarColors.length];
const F = "'Plus Jakarta Sans', system-ui, sans-serif";

// ─────────────────────────────────────────────────────────────
// Count-up hook: animates a number from 0 → target on mount
// Uses requestAnimationFrame with ease-out-cubic for smooth polish.
// ─────────────────────────────────────────────────────────────
function useCountUp(target, duration=1100, enabled=true) {
  const [v, setV] = useState(enabled ? 0 : target);
  useEffect(() => {
    if (!enabled) { setV(target); return; }
    if (typeof target !== "number" || isNaN(target)) { setV(target); return; }
    let raf;
    const start = performance.now();
    const from = 0;
    const to = target;
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setV(from + (to - from) * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, enabled]);
  return v;
}

// ─────────────────────────────────────────────────────────────
// Sparkline — tiny 30-day trend line rendered inline in stat cards
// ─────────────────────────────────────────────────────────────
function Sparkline({ data, color="#0891B2", width=76, height=22, fill=true }) {
  if (!data || data.length < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const step = width / (data.length - 1);
  const pts = data.map((v, i) => [i * step, height - ((v - min) / range) * height]);
  const line = pts.map((p, i) => (i === 0 ? "M" : "L") + p[0].toFixed(1) + " " + p[1].toFixed(1)).join(" ");
  const area = line + ` L${width} ${height} L0 ${height} Z`;
  const lastX = pts[pts.length - 1][0];
  const lastY = pts[pts.length - 1][1];
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ overflow:"visible" }}>
      {fill && <path d={area} fill={color} opacity={0.12} />}
      <path d={line} fill="none" stroke={color} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={lastX} cy={lastY} r={2.2} fill={color} />
    </svg>
  );
}

function Avatar({ initials, bg=C.teal, size=36 }) {
  return <div style={{ width:size, height:size, borderRadius:"50%", background:bg, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700, fontSize:size*0.33, color:"#fff", flexShrink:0, fontFamily:F, letterSpacing:-0.3 }}>{initials}</div>;
}

function Chip({ children, color, bg }) {
  return <span style={{ fontSize:10, fontWeight:700, padding:"4px 11px", borderRadius:20, background:bg||`${color}12`, color:color, letterSpacing:0.3, textTransform:"uppercase", border:`1px solid ${color}20` }}>{children}</span>;
}

function DrillPanel({ title, sub, onClose, children, onFullPage }) {
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(8,14,26,0.5)", zIndex:900, display:"flex", alignItems:"flex-start", justifyContent:"flex-end", backdropFilter:"blur(8px)", animation:"fadeIn .2s ease-out" }} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{ width:560, height:"100vh", background:C.card, boxShadow:"-20px 0 60px rgba(0,0,0,0.15), -4px 0 20px rgba(0,0,0,0.08)", overflow:"auto", padding:"32px 32px 24px", display:"flex", flexDirection:"column", fontFamily:F, animation:"slideInRight .3s ease-out" }}>
        <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:28 }}>
          <div>
            <div style={{ fontSize:20, fontWeight:800, color:C.text, letterSpacing:-0.5 }}>{title}</div>
            {sub && <div style={{ fontSize:12, color:C.slate, marginTop:5 }}>{sub}</div>}
          </div>
          <button onClick={onClose} style={{ background:"#F1F5F9", border:"none", fontSize:18, cursor:"pointer", color:C.slate, lineHeight:1, padding:"6px 8px", borderRadius:8, transition:"all .15s" }}
            onMouseEnter={e=>{e.currentTarget.style.background="#E2E8F0";e.currentTarget.style.color=C.navy;}}
            onMouseLeave={e=>{e.currentTarget.style.background="#F1F5F9";e.currentTarget.style.color=C.slate;}}>×</button>
        </div>
        <div style={{ flex:1 }}>{children}</div>
        {onFullPage && (
          <button onClick={onFullPage} style={{ width:"100%", marginTop:20, background:C.tealGrad, color:"#fff", border:"none", borderRadius:12, padding:"14px", fontWeight:700, fontSize:14, cursor:"pointer", fontFamily:F, letterSpacing:-0.2, boxShadow:"0 4px 16px rgba(8,145,178,.3)", transition:"all .2s" }}
            onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-1px)";e.currentTarget.style.boxShadow="0 8px 24px rgba(8,145,178,.4)";}}
            onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="0 4px 16px rgba(8,145,178,.3)";}}>
            View full page →
          </button>
        )}
      </div>
    </div>
  );
}

function PatientRow({ p, i, total, showWA, waSent, onSendWA }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:12, padding:"13px 0", borderBottom:i<total-1?`1px solid ${C.border}`:"none" }}>
      <Avatar initials={p.initials} bg={p.risk==="high"?C.red:p.risk==="medium"?C.amber:C.green} size={38} />
      <div style={{ flex:1 }}>
        <div style={{ fontWeight:600, fontSize:14, color:C.navy }}>{p.name}</div>
        <div style={{ fontSize:12, color:C.slate, marginTop:2 }}>{p.product} · Last visit {p.lastVisit}</div>
      </div>
      <div style={{ textAlign:"right", display:"flex", flexDirection:"column", alignItems:"flex-end", gap:5 }}>
        <Chip color={riskFg[p.risk]}>{riskLabel[p.risk]}</Chip>
        <span style={{ fontSize:13, fontWeight:700, color:C.navy }}>£{p.revenue}</span>
        {showWA && (waSent[p.id]
          ? <span style={{ fontSize:11, color:C.green, fontWeight:600 }}>Sent ✓</span>
          : <button onClick={()=>onSendWA(p)} style={{ background:C.teal, color:"#fff", border:"none", borderRadius:8, padding:"5px 11px", fontSize:11, fontWeight:700, cursor:"pointer", fontFamily:F }}>Send WhatsApp</button>
        )}
      </div>
    </div>
  );
}

// ── Login ─────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleLogin() {
    setError("");
    if (!email || !password) { setError("Please enter your email and password."); return; }
    setLoading(true);
    setTimeout(() => { setLoading(false); onLogin({ email }); }, 900);
  }

  return (
    <div style={{ minHeight:"100vh", background:"linear-gradient(145deg, #080E1A 0%, #0D1526 40%, #0F1B2D 100%)", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:F, position:"relative", overflow:"hidden" }}>
      {/* Ambient glow effects */}
      <div style={{ position:"absolute", top:"-20%", right:"-10%", width:"600px", height:"600px", background:"radial-gradient(circle, rgba(8,145,178,.12) 0%, transparent 70%)", pointerEvents:"none" }} />
      <div style={{ position:"absolute", bottom:"-15%", left:"-5%", width:"400px", height:"400px", background:"radial-gradient(circle, rgba(139,92,246,.08) 0%, transparent 70%)", pointerEvents:"none" }} />

      <div style={{ width:"100%", maxWidth:420, padding:"0 24px", position:"relative", zIndex:1, animation:"fadeInUp .6s ease-out" }}>
        <div style={{ textAlign:"center", marginBottom:44 }}>
          <div style={{ fontSize:38, fontWeight:800, letterSpacing:-1.5 }}>
            <span style={{ color:"#FFFFFF" }}>iry</span><span style={{ background:"linear-gradient(135deg,#0891B2,#06B6D4,#22D3EE)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>ss</span>
          </div>
          <div style={{ fontSize:10, color:"rgba(148,163,184,.6)", marginTop:8, letterSpacing:2, textTransform:"uppercase", fontWeight:600 }}>Patient Retention Platform</div>
        </div>

        <div style={{ background:"rgba(255,255,255,.03)", border:"1px solid rgba(255,255,255,.08)", borderRadius:24, padding:"44px 36px", boxShadow:"0 24px 80px rgba(0,0,0,0.4), 0 4px 20px rgba(0,0,0,0.2)", backdropFilter:"blur(40px)" }}>
          <div style={{ fontSize:22, fontWeight:700, color:"#FFFFFF", marginBottom:4, letterSpacing:-0.5 }}>Welcome back</div>
          <div style={{ fontSize:13, color:"rgba(148,163,184,.7)", marginBottom:32 }}>Sign in to your practice dashboard</div>

          <div style={{ marginBottom:18 }}>
            <label style={{ fontSize:12, fontWeight:600, color:"rgba(148,163,184,.8)", display:"block", marginBottom:8, letterSpacing:0.3 }}>Email</label>
            <input type="email" value={email} onChange={e=>setEmail(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleLogin()} placeholder="you@yourpractice.com"
              style={{ width:"100%", background:"rgba(255,255,255,.04)", border:"1px solid rgba(255,255,255,.1)", borderRadius:12, padding:"14px 18px", fontSize:14, color:"#FFFFFF", fontFamily:F, outline:"none", boxSizing:"border-box", transition:"all .2s" }}
              onFocus={e=>{e.target.style.borderColor="rgba(8,145,178,.5)";e.target.style.boxShadow="0 0 0 3px rgba(8,145,178,.1)";}}
              onBlur={e=>{e.target.style.borderColor="rgba(255,255,255,.1)";e.target.style.boxShadow="none";}} />
          </div>
          <div style={{ marginBottom:28 }}>
            <label style={{ fontSize:12, fontWeight:600, color:"rgba(148,163,184,.8)", display:"block", marginBottom:8, letterSpacing:0.3 }}>Password</label>
            <input type="password" value={password} onChange={e=>setPassword(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleLogin()} placeholder="••••••••"
              style={{ width:"100%", background:"rgba(255,255,255,.04)", border:"1px solid rgba(255,255,255,.1)", borderRadius:12, padding:"14px 18px", fontSize:14, color:"#FFFFFF", fontFamily:F, outline:"none", boxSizing:"border-box", transition:"all .2s" }}
              onFocus={e=>{e.target.style.borderColor="rgba(8,145,178,.5)";e.target.style.boxShadow="0 0 0 3px rgba(8,145,178,.1)";}}
              onBlur={e=>{e.target.style.borderColor="rgba(255,255,255,.1)";e.target.style.boxShadow="none";}} />
          </div>

          {error && <div style={{ background:"rgba(239,68,68,.1)", border:"1px solid rgba(239,68,68,.2)", borderRadius:12, padding:"12px 16px", fontSize:13, color:"#FCA5A5", marginBottom:18 }}>{error}</div>}

          <button onClick={handleLogin} disabled={loading} style={{ width:"100%", background:loading?"rgba(8,145,178,.4)":"linear-gradient(135deg,#0891B2,#06B6D4,#22D3EE)", border:"none", borderRadius:12, padding:"15px", fontSize:15, fontWeight:700, color:"#fff", cursor:loading?"default":"pointer", fontFamily:F, letterSpacing:-0.2, boxShadow:loading?"none":"0 4px 20px rgba(8,145,178,.35), 0 0 40px rgba(8,145,178,.1)", transition:"all .3s" }}
            onMouseEnter={e=>{if(!loading){e.currentTarget.style.transform="translateY(-1px)";e.currentTarget.style.boxShadow="0 8px 30px rgba(8,145,178,.45), 0 0 60px rgba(8,145,178,.15)";}}}
            onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="0 4px 20px rgba(8,145,178,.35), 0 0 40px rgba(8,145,178,.1)";}}>
            {loading?"Signing in…":"Sign in"}
          </button>
        </div>

        <div style={{ textAlign:"center", marginTop:28, fontSize:10, color:"rgba(148,163,184,.35)", letterSpacing:1 }}>
          GDPR COMPLIANT · EU DATA SERVERS · BUILT IN BELFAST
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  if (!user) return <LoginScreen onLogin={setUser} />;
  return <Dashboard />;
}

function Dashboard() {
  const [nav, setNav]               = useState("dashboard");
  const [drill, setDrill]           = useState(null);
  const [filterRisk, setFilterRisk] = useState("all");
  const [patientSearch, setPatientSearch] = useState("");
  const [inboxSearch, setInboxSearch]             = useState("");
  const [inboxSort, setInboxSort]                 = useState("all");
  const [readConversations, setReadConversations] = useState({});
  const [pinnedMessages, setPinnedMessages]       = useState({});
  const [msgMenuOpen, setMsgMenuOpen]             = useState(null);
  const [hoveredMsg, setHoveredMsg]               = useState(null);
  const [highlightedMsg, setHighlightedMsg]       = useState(null);
  const threadContainerRef = useRef(null);
  const textareaRef        = useRef(null);
  const [selectedThread, setSelectedThread] = useState(null);
  const [sendMsg, setSendMsg]       = useState("");
  const [showSendWA, setShowSendWA] = useState(null);
  const [waMsg, setWaMsg]           = useState("");
  const [waSent, setWaSent]         = useState({});
  const msgEndRef = useRef(null);
  const [liveInbox, setLiveInbox] = useState([]);
  const [patientTimeline, setPatientTimeline] = useState(null);
  const [prevNav, setPrevNav] = useState("dashboard");
  const [recallTab, setRecallTab] = useState("eye-test");
  const [autoSend, setAutoSend] = useState(false);
  const [confirmSent, setConfirmSent] = useState({});
  const [reminder48Active, setReminder48Active] = useState(false);
  const [reminder2hActive, setReminder2hActive] = useState(false);
  const [digestEnabled, setDigestEnabled]       = useState(true);
  const [digestTime, setDigestTime]             = useState("8:00am");
  const [showBellDropdown, setShowBellDropdown] = useState(false);
  const [toastMsg, setToastMsg]                 = useState(null);
  const [settingsSaved, setSettingsSaved]       = useState(false);
  const [connectedCRMs, setConnectedCRMs]       = useState({"Optisoft":true, "CSV Import":true});
  const [practiceDetails, setPracticeDetails]   = useState({ name:"Bright Eyes Opticians", email:"louiev@hotmail.co.uk", whatsapp:"+447827322027", google:"" });
  const [autoRecall, setAutoRecall]             = useState(false);
  const [autoReorder, setAutoReorder]           = useState(false);
  const [autoReview, setAutoReview]             = useState(true);
  const [reviewTab, setReviewTab]               = useState("reviews");
  const [myopiaTab, setMyopiaTab]               = useState("active");
  const [myopiaDetail, setMyopiaDetail]         = useState(null);
  const [cmdOpen, setCmdOpen]                   = useState(false);
  const [cmdQuery, setCmdQuery]                 = useState("");
  const [cmdSel, setCmdSel]                     = useState(0);
  const [scribeState, setScribeState]           = useState("idle"); // idle | listening | processing | complete
  const [scribePatientId, setScribePatientId]   = useState("P-001");
  const [claimsTab, setClaimsTab]               = useState("pending");
  const [scribeRecent, setScribeRecent]         = useState([
    { id:"SC-041", patient:"Louise Everton", date:"Today · 10:42",     mins:12, status:"pushed"    },
    { id:"SC-040", patient:"Ethan Kumar",    date:"Today · 09:15",     mins:9,  status:"reviewed"  },
    { id:"SC-039", patient:"Sophia Patel",   date:"Yesterday · 16:30", mins:11, status:"pushed"    },
    { id:"SC-038", patient:"Tom Bradley",    date:"Yesterday · 14:12", mins:14, status:"pushed"    },
    { id:"SC-037", patient:"Mia Davies",     date:"Yesterday · 11:05", mins:10, status:"pushed"    },
  ]);
  const [reviewSent, setReviewSent]             = useState({});
  const [showImport, setShowImport]             = useState(false);
  const [importStep, setImportStep]             = useState(1);
  const [importDrag, setImportDrag]             = useState(false);
  const [importData, setImportData]             = useState(null);
  const [importProgress, setImportProgress]     = useState(0);
  const [importCounters, setImportCounters]     = useState({ scanned:0, atRisk:0, recalls:0, gap:0 });
  const importFileRef = useRef(null);
  const [revenueTab, setRevenueTab]             = useState("overview");
  const [planSent, setPlanSent]                 = useState({});
  const [intelSent, setIntelSent]               = useState({});
  const [tasksDone, setTasksDone]               = useState({});
  const [completedCollapsed, setCompletedCollapsed] = useState(false);
  const [showAllReengage, setShowAllReengage] = useState(false);
  const [taskJustCompleted, setTaskJustCompleted] = useState({});

  useEffect(() => {
    if (msgEndRef.current) {
      msgEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedThread?.id]);

  const fetchInbox = async () => {
    try {
      const res = await fetch('https://iryss-backend-12fh.onrender.com/api/public/inbox');
      if (!res.ok) { if (liveInbox.length === 0) setLiveInbox(DEMO_INBOX); return; }
      const data = await res.json();
      if (data && data.messages && data.messages.length > 0) {
        const grouped = {};
        data.messages.forEach(m => {
          const name = m.patient_name;
          if (!grouped[name]) grouped[name] = { name, phone: m.patient_phone, messages: [] };
          grouped[name].messages.push(m);
        });
        const mapped = Object.values(grouped).map(c => {
          const sorted = [...c.messages].sort((a, b) => new Date(a.sent_at) - new Date(b.sent_at));
          const latest = sorted[sorted.length - 1];
          const latestInbound = [...sorted].reverse().find(m => m.direction === 'inbound');
          const sentiment = latestInbound?.sentiment || null;
          return {
            id: c.name,
            patient: c.name,
            phone: c.phone,
            initials: c.name.split(' ').map(w=>w[0]).join('').slice(0,2),
            preview: latest?.message_body || '',
            time: new Date(latest?.sent_at).toLocaleTimeString('en-GB', {hour:'2-digit',minute:'2-digit'}),
            unread: latest?.direction === 'inbound',
            urgent: latest?.direction === 'inbound' && (sentiment === 'urgent' || sentiment === 'negative'),
            sentiment,
            thread: sorted.map(m => ({
              from: m.direction === 'inbound' ? 'patient' : 'practice',
              text: m.message_body,
              time: new Date(m.sent_at).toLocaleTimeString('en-GB', {hour:'2-digit',minute:'2-digit'}),
              sent_at: m.sent_at
            }))
          };
        });
        // If a patient has a newer inbound message than before, remove from readConversations
        setLiveInbox(prev => {
          setReadConversations(prevRead => {
            const updated = {...prevRead};
            mapped.forEach(newConv => {
              if (!newConv.unread) return;
              const oldConv = prev.find(p => p.id === newConv.id);
              const oldLatestInbound = oldConv?.thread.filter(m=>m.from==='patient').slice(-1)[0]?.sent_at;
              const newLatestInbound = newConv.thread.filter(m=>m.from==='patient').slice(-1)[0]?.sent_at;
              if (!oldLatestInbound || newLatestInbound !== oldLatestInbound) {
                delete updated[newConv.patient];
              }
            });
            return updated;
          });
          return mapped;
        });
        setSelectedThread(prev =>
          prev ? (mapped.find(m => m.id === prev.id) ?? null) : null
        );
      } else {
        if (liveInbox.length === 0) setLiveInbox(DEMO_INBOX);
      }
    } catch(e) {
      console.log('Using demo inbox');
      if (liveInbox.length === 0) setLiveInbox(DEMO_INBOX);
    }
  };

  useEffect(() => {
    setLiveInbox(DEMO_INBOX);
    fetchInbox();
    const interval = setInterval(fetchInbox, 15000);
    return () => clearInterval(interval);
  }, []);

  function parseMonthsAgo(str) { const m=str.match(/(\d+)\s+month/); return m?parseInt(m[1]):0; }
  function openRecallWA(p) { setShowSendWA(p); setWaMsg(`Hi ${p.name.split(' ')[0]}, it's been 2 years since your last eye test at Bright Eyes — we'd love to see you again. Would you like to book in? 😊\n\nBright Eyes Opticians`); }
  function openReorderWA(p) { setShowSendWA(p); setWaMsg(`Hi ${p.name.split(' ')[0]}, your contact lens supply might be running low — would you like to reorder? We can get them sorted quickly for you 😊\n\nBright Eyes Opticians`); }
  function openReviewWA(name, phone) {
    const firstName = name.split(' ')[0];
    const googleLink = practiceDetails.google || 'https://g.page/brighteyesopticians';
    const resolvedPhone = phone || PATIENTS.find(p=>p.name===name)?.phone || '';
    setShowSendWA({ id:`review-${name}`, name, risk:'low', lastVisit:'Recent', phone:resolvedPhone });
    setWaMsg(`Hi ${firstName}, thank you so much for visiting Bright Eyes Opticians — we hope you had a great experience! If you have a moment, we'd really appreciate it if you could leave us a Google review 😊\n\n${googleLink}`);
  }

  const highRisk      = PATIENTS.filter(p=>p.risk==="high");
  const medRisk       = PATIENTS.filter(p=>p.risk==="medium");
  const lowRisk       = PATIENTS.filter(p=>p.risk==="low");
  const recovered     = PATIENTS.filter(p=>p.status==="recovered"||p.status==="booked");
  const atRiskRevenue = PATIENTS.filter(p=>p.risk!=="low").reduce((a,p)=>a+p.revenue,0);
  const recoveredRev  = recovered.reduce((a,p)=>a+p.revenue,0);
  const isUnread        = (m) => m.unread && !readConversations[m.patient];
  const unreadCount     = liveInbox.filter(isUnread).length;
  const urgentMessages  = liveInbox.filter(i=>isUnread(i) && (i.sentiment==='urgent'||i.sentiment==='negative'));
  const urgentCount     = urgentMessages.length;
  const allPatients   = PATIENTS.map(p=>({...p, risk:p.risk||"low"}));
  const filteredPts   = allPatients
    .filter(p=>filterRisk==="all"||p.risk===filterRisk)
    .filter(p=>!patientSearch||p.name.toLowerCase().includes(patientSearch.toLowerCase()));
  const noShowRisk     = APPOINTMENTS.filter(a=>!a.confirmed);
  const recallPatients = PATIENTS.filter(p=>parseMonthsAgo(p.lastVisit)>=8).sort((a,b)=>parseMonthsAgo(b.lastVisit)-parseMonthsAgo(a.lastVisit));
  const overdueRecall  = recallPatients.filter(p=>parseMonthsAgo(p.lastVisit)>=24);
  const reorderPatients = PATIENTS.filter(p=>/contact|lens|cl|oasys/i.test(p.product)&&parseMonthsAgo(p.lastVisit)>=3).sort((a,b)=>parseMonthsAgo(b.lastVisit)-parseMonthsAgo(a.lastVisit));
  const recallRevenue  = recallPatients.reduce((a,p)=>a+p.revenue,0);

  // Compliance
  const recallContacted = recallPatients.filter(p=>waSent[p.id]).length;
  const complianceRate  = recallPatients.length>0 ? Math.round(((recallContacted+1)/recallPatients.length)*100) : 100;

  // Lens plan patients
  const lensPatients = PATIENTS.filter(p=>/contact|lens|cl|oasys|acuvue|dailies|proclear/i.test(p.product));
  const lensUpliftTotal = lensPatients.reduce((a,p)=>a+Math.round(p.revenue*0.2),0);

  // Competitor intelligence
  const COMPETITOR_KW = ["specsavers","vision express","boots","optical express","asda","tesco","cheaper","went elsewhere","another optician","different optician","vision direct","glasses direct"];
  const DEMO_COMPETITOR_MENTIONS = [
    { patient:"Margaret Flynn",  phone:"+447827001003", text:"I've been looking at Specsavers for my next pair of glasses — they seem to have some good deals on at the moment. Are you able to price match at all?", time:"Today 09:14",   keyword:"specsavers"       },
    { patient:"Tom Bradley",     phone:"+447827001002", text:"My partner went to Vision Express last week and said it was really quick and easy. I'm just wondering if you offer the same kind of express service?",    time:"Today 08:47",   keyword:"vision express"   },
    { patient:"Shona Kay",       phone:"+447711552094", text:"I've seen some cheaper options online through Glasses Direct. Would you be able to do anything on price for my varifocals?",                          time:"Yesterday 16:32", keyword:"glasses direct"   },
    { patient:"Jim Bru",         phone:"+447803003472", text:"I was in Boots Opticians on Saturday and they mentioned a 2-for-1 offer — do you do anything similar for multifocal lenses?",                        time:"Yesterday 11:05", keyword:"boots"            },
    { patient:"Ciara Murphy",    phone:"+447827001004", text:"I nearly went elsewhere last time as the wait was quite long — just wanted to flag that in case it helps. I do still prefer coming here though!",     time:"Mon 14:22",       keyword:"went elsewhere"   },
    { patient:"Louise Everton",  phone:"+447827322027", text:"A friend recommended Optical Express for laser eye surgery — is that something you can advise on or refer me for?",                                   time:"Mon 10:58",       keyword:"optical express"  },
  ];
  const liveMentions = liveInbox.flatMap(conv=>
    conv.thread.filter(m=>m.from==='patient'&&COMPETITOR_KW.some(kw=>m.text.toLowerCase().includes(kw)))
      .map(m=>({ patient:conv.patient, phone:conv.phone, convId:conv.id, text:m.text, time:m.time,
        keyword:COMPETITOR_KW.find(kw=>m.text.toLowerCase().includes(kw)) }))
  );
  const competitorMentions = [...DEMO_COMPETITOR_MENTIONS, ...liveMentions];

  const waTemplates = {
    high:   `Hi {name} 👋\n\nWe've been thinking about you and just wanted to check in. It's been a while since your last visit — whenever you're ready, we'd love to welcome you back.\n\nJust reply here and we'll sort everything 😊\n\nBright Eyes Opticians`,
    medium: `Hi {name} 👋\n\nIt's the team at Bright Eyes! It's been a little while — we just wanted to make sure everything is still going well with your {product}.\n\nDo get in touch if you have any questions at all 😊`,
    low:    `Hi {name} 👋\n\nHope you're well! Just a quick friendly check-in from Bright Eyes. We're here whenever you need us 😊`,
  };

  function openSendWA(p) {
    setShowSendWA(p);
    setWaMsg(waTemplates[p.risk].replace("{name}",p.name.split(" ")[0]).replace("{product}",p.product));
  }
  async function confirmSendWA(pid) {
    const patient = PATIENTS.find(p=>p.id===pid);
    const phone = patient?.phone || showSendWA?.phone;
    const name = patient?.name || showSendWA?.name || "patient";
    if (!phone) { setShowSendWA(null); return; }
    // Optimistic update — mark as sent immediately so button changes
    if (patient) setWaSent(prev=>({...prev,[pid]:true}));
    else if (typeof pid==='string'&&pid.startsWith('review-')) setReviewSent(prev=>({...prev,[pid]:true}));
    else if (typeof pid==='string'&&pid.startsWith('myopia-')) setWaSent(prev=>({...prev,[pid]:true}));
    showToast(`WhatsApp sent to ${name.split(' ')[0]} ✓`);
    setShowSendWA(null); setWaMsg("");
    try {
      const res = await fetch("https://iryss-backend-12fh.onrender.com/api/send-whatsapp", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ to: phone, message: waMsg })
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(`Send failed for ${name}: ${data.error || res.statusText}`);
      }
      else setConfirmSent(prev=>({...prev,[pid]:true}));
    } catch(e) {
      alert(`Failed to send to ${name}: ${e.message}`);
    }
  }
  function openConfirmationWA(a, idx) {
    const firstName = a.patient.split(' ')[0];
    setShowSendWA({ id:`appt-${idx}`, name:a.patient, risk:'low', lastVisit:'Today', phone:a.phone||'' });
    setWaMsg(`Hi ${firstName}, just a reminder that you have an appointment at Bright Eyes Opticians tomorrow. Please reply YES to confirm or call us to rearrange 😊`);
  }
  function goNav(id) { setDrill(null); setNav(id); setPatientTimeline(null); }

  // ⌘K / Ctrl-K — open command palette
  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCmdOpen(o => !o);
        setCmdQuery("");
        setCmdSel(0);
      }
      if (e.key === "Escape" && cmdOpen) setCmdOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [cmdOpen]);
  function completeTask(id) {
    setTaskJustCompleted(prev=>({...prev,[id]:true}));
    setTimeout(()=>{
      setTasksDone(prev=>({...prev,[id]:true}));
      setTaskJustCompleted(prev=>{ const n={...prev}; delete n[id]; return n; });
    }, 500);
  }
  function openTimeline(p) {
    const match = PATIENTS.find(pt => pt.name === (p.name || p.patient));
    setPrevNav(nav);
    setPatientTimeline(match || p);
  }

  async function sendInboxReply() {
    if (!sendMsg.trim() || !selectedThread?.phone) return;
    const msg = sendMsg.trim();
    const now = new Date().toLocaleTimeString('en-GB', {hour:'2-digit', minute:'2-digit'});
    const nowIso = new Date().toISOString();
    const newMsg = {from:"practice", text:msg, time:now, sent_at:nowIso};
    setSendMsg("");
    // Optimistically add message to thread immediately
    setSelectedThread(prev => ({...prev, thread: [...prev.thread, newMsg]}));
    setLiveInbox(prev => prev.map(conv =>
      conv.id === selectedThread.id
        ? {...conv, thread:[...conv.thread, newMsg], preview:msg, time:now, unread:false}
        : conv
    ));
    try {
      const res = await fetch("https://iryss-backend-12fh.onrender.com/api/send-whatsapp", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ to: selectedThread.phone, message: msg })
      });
      if (!res.ok) {
        const data = await res.json();
        alert(`Failed to send: ${data.error || res.statusText}`);
      } else {
        // Re-fetch to sync with backend
        setTimeout(fetchInbox, 2000);
      }
    } catch(e) {
      alert(`Failed to send: ${e.message}`);
    }
  }

  // ── Today's tasks (computed every render from live data) ─────────────
  const urgentTasks = urgentMessages.map(m=>({
    id:`urgent-${m.patient}`, category:'urgent', color:'#E11D48',
    label:`Reply to ${m.patient}`,
    sub: m.preview ? `"${m.preview.slice(0,60)}${m.preview.length>60?'…':''}"` : 'Unread urgent message',
    action:'Reply Now →', onAction:()=>{ setSelectedThread(m); goNav('inbox'); }
  }));
  const recallTasksList = recallPatients.filter(p=>!waSent[p.id]).slice(0,4).map(p=>({
    id:`recall-${p.id}`, category:'recalls', color:'#D97706',
    label:`Send recall to ${p.name}`, sub:`Last visit ${p.lastVisit}`,
    action:'Send WhatsApp →', onAction:()=>openRecallWA(p)
  }));
  const apptTasks = APPOINTMENTS.filter(a=>!a.confirmed).map((a,i)=>({
    id:`appt-${i}`, category:'appointments', color:'#0891B2',
    label:`Confirm appointment — ${a.patient} at ${a.time}`, sub:`${a.type} · ${a.optician}`,
    action:'Send Confirmation →', onAction:()=>openConfirmationWA(a,i)
  }));
  const highRiskTasksList = highRisk.filter(p=>!waSent[p.id]).map(p=>({
    id:`risk-${p.id}`, category:'highRisk', color:'#D97706',
    label:`Re-engage ${p.name}`, sub:`Risk score ${p.riskScore}/100`,
    action:'Send WhatsApp →', onAction:()=>openSendWA(p)
  }));
  const reviewTasksList = REVIEW_REQUESTS.filter(r=>r.status==='none').map(r=>({
    id:`review-${r.patient}`, category:'reviews', color:'#D97706',
    label:`Request Google review from ${r.patient}`, sub:`${r.trigger} · ${r.date}`,
    action:'Send Request →', onAction:()=>openReviewWA(r.patient, r.phone)
  }));
  const orderTasksList = [
    {id:'order-0', label:'Chase Acuvue Oasys trial order — Jim Bru',            sub:'Outstanding 3 days'},
    {id:'order-1', label:'Confirm varifocal lens delivery — Shona Kay',          sub:'Delivery expected this week'},
    {id:'order-2', label:'Order daily trial lenses — new patient fitting Thursday', sub:'Fitting: Thursday 03 April'},
  ].map(t=>({...t, category:'orders', color:'#3B82F6', action:'Mark as chased →', onAction:()=>{ completeTask(t.id); showToast(`Order chased — ${t.label.split("—")[1]?.trim()||"supplier notified"}`); }}));
  function openMyopiaParentWA(p) {
    const parentFirst = p.parent.split(' ')[0];
    const childFirst = p.name.split(' ')[0];
    let msg = '';
    if (p.status === "lapsed") {
      msg = `Hi ${parentFirst}, this is Bright Eyes Opticians. ${childFirst}'s myopia review is now overdue — it's important we monitor their eye growth regularly to ensure their treatment is working effectively.\n\nWould you like to book a review appointment? We have availability this week.\n\nBright Eyes Opticians`;
    } else if (p.alChange !== null && p.alChange >= 0.20) {
      msg = `Hi ${parentFirst}, this is Bright Eyes Opticians. Following ${childFirst}'s recent review, we'd like to discuss their myopia progression — their axial length growth is ${p.alChange.toFixed(2)} mm/year, which is above our target rate.\n\nWe'd like to review their treatment plan. Could you come in this week for a consultation?\n\nBright Eyes Opticians`;
    } else {
      msg = `Hi ${parentFirst}, this is Bright Eyes Opticians. Just a reminder that ${childFirst}'s next myopia review is coming up. Would you like to book an appointment?\n\nBright Eyes Opticians`;
    }
    setShowSendWA({ id: p.id, name: p.parent, phone: p.parentPhone || "+447700000000", risk: "low", lastVisit: "" });
    setWaMsg(msg);
  }
  const myopiaTasks = MYOPIA_PATIENTS
    .filter(p => p.status==="lapsed" || (p.alChange!==null && p.alChange>=0.20))
    .map(p => ({
      id:`myopia-${p.id}`,
      category:'myopia',
      color: (p.alChange!==null && p.alChange>=0.20) ? '#EF4444' : '#F59E0B',
      label: p.status==="lapsed"
        ? `${p.name} — myopia review overdue`
        : `${p.name} — axial length progressing (${p.alChange.toFixed(2)} mm/yr)`,
      sub:`Age ${p.age} · ${p.treatment} · Parent: ${p.parent}`,
      action:'WhatsApp Parent →',
      onAction:()=>openMyopiaParentWA(p)
    }));
  const allTasks = [...urgentTasks, ...recallTasksList, ...apptTasks, ...highRiskTasksList, ...myopiaTasks, ...reviewTasksList, ...orderTasksList];
  const incompleteTaskCount = allTasks.filter(t=>!tasksDone[t.id]).length;

  // Polished stat card — supports count-up animation + sparkline
  function SC({ label, value, sub, accent, onDrill, trend, trendUp, spark, sparkColor }) {
    // Parse numeric part of value like "£4,200" or "85%" or 42 so we can count-up
    const parsed = (() => {
      if (typeof value === "number") return { prefix:"", num:value, suffix:"" };
      if (typeof value !== "string") return null;
      const m = value.match(/^(\D*)([\d,]+(?:\.\d+)?)(.*)$/);
      if (!m) return null;
      const num = parseFloat(m[2].replace(/,/g, ""));
      if (isNaN(num)) return null;
      return { prefix:m[1], num, suffix:m[3], hasComma:m[2].includes(",") };
    })();
    const animated = useCountUp(parsed ? parsed.num : 0, 900, !!parsed);
    const display = parsed
      ? `${parsed.prefix}${parsed.hasComma ? Math.round(animated).toLocaleString() : (animated % 1 === 0 ? Math.round(animated) : animated.toFixed(1))}${parsed.suffix}`
      : value;
    return (
      <div onClick={onDrill} style={{ background:"#FFFFFF", border:"1px solid #E2E8F0", borderRadius:16, padding:"22px 24px", cursor:onDrill?"pointer":"default", transition:"all .25s ease", boxShadow:C.cardShadow, position:"relative", overflow:"hidden" }}
        onMouseEnter={e=>{ if(onDrill){ e.currentTarget.style.boxShadow=C.cardHoverShadow; e.currentTarget.style.transform="translateY(-3px)"; e.currentTarget.style.borderColor="rgba(8,145,178,.15)"; }}}
        onMouseLeave={e=>{ e.currentTarget.style.boxShadow=C.cardShadow; e.currentTarget.style.transform="translateY(0)"; e.currentTarget.style.borderColor="#E2E8F0"; }}>
        <div style={{ position:"absolute", top:0, left:0, width:3, height:"100%", background:accent, borderRadius:"16px 0 0 16px" }} />
        <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:12 }}>
          <div style={{ fontSize:10, fontWeight:700, color:"#94A3B8", textTransform:"uppercase", letterSpacing:1 }}>{label}</div>
          {spark && <Sparkline data={spark} color={sparkColor || accent || C.teal} />}
        </div>
        <div style={{ fontSize:36, fontFamily:F, fontWeight:800, color:"#0F172A", lineHeight:1, marginBottom:14, letterSpacing:-0.5, fontVariantNumeric:"tabular-nums" }}>{display}</div>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div>
            {trend && <span style={{ fontSize:10, fontWeight:600, color:trendUp?C.green:C.red, background:trendUp?"rgba(5,150,105,.08)":"rgba(225,29,72,.08)", padding:"4px 10px", borderRadius:20 }}>{trendUp?"↑":"↓"} {trend}</span>}
            {sub && <span style={{ fontSize:11, color:"#64748B", fontWeight:500 }}>{sub}</span>}
          </div>
          {onDrill && <span style={{ fontSize:11, fontWeight:600, color:C.teal, cursor:"pointer" }}>View →</span>}
        </div>
      </div>
    );
  }

  const pageTitle = {
    dashboard:"dashboard", patients:"patients", inbox:"inbox",
    revenue:"revenue", reviews:"reviews", appointments:"appointments", receptionist:"receptionist"
  };

  const pageTitles = {
    dashboard:"Dashboard",
    tasks:"Today's Tasks",
    patients:"Patients",
    recalls:"Recalls",
    scribe:"AI Scribe",
    claims:"GOS Claims",
    myopia:"Myopia Clinic",
    inbox:"Inbox",
    revenue:"Revenue",
    reviews:"Reviews",
    appointments:"Appointments",
    receptionist:"AI Receptionist",
    settings:"Settings",
    intelligence:"Intelligence",
  };

  function showToast(msg) { setToastMsg(msg); setTimeout(()=>setToastMsg(null), 3500); }

  function generateComplianceReport(compRate, recallPts, contactedPts) {
    const status = compRate>=80?"Compliant":compRate>=60?"Review Required":"Action Required";
    const color  = compRate>=80?"#10B981":compRate>=60?"#F59E0B":"#EF4444";
    const today  = new Date().toLocaleDateString("en-GB",{day:"numeric",month:"long",year:"numeric"});
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Recall Compliance Report — ${practiceDetails.name}</title>
<style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:'Helvetica Neue',Arial,sans-serif;color:#080F1E;background:#fff;padding:48px}
.header{display:flex;align-items:center;justify-content:space-between;border-bottom:3px solid #0891B2;padding-bottom:20px;margin-bottom:36px}
.logo{font-size:26px;font-weight:800;color:#0891B2;letter-spacing:-1px}.practice{font-size:14px;color:#64748B;margin-top:4px}
.date{font-size:13px;color:#94A3B8;text-align:right}.section{margin-bottom:32px}.section h2{font-size:15px;font-weight:700;color:#080F1E;letter-spacing:.5px;text-transform:uppercase;margin-bottom:16px;padding-bottom:8px;border-bottom:1px solid #E8EEF4}
.hero{background:#F0F4F8;border-radius:12px;padding:28px;text-align:center;margin-bottom:28px}.hero-rate{font-size:64px;font-weight:800;color:${color};letter-spacing:-3px;line-height:1}
.hero-label{font-size:15px;color:#64748B;margin-top:8px}.status-badge{display:inline-block;background:${compRate>=80?"rgba(16,185,129,.15)":compRate>=60?"rgba(245,158,11,.15)":"rgba(239,68,68,.15)"};color:${color};font-weight:700;font-size:14px;padding:6px 20px;border-radius:30px;margin-top:12px}
.stats{display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px;margin-bottom:24px}.stat{background:#F8FBFD;border:1px solid #E8EEF4;border-radius:10px;padding:18px;text-align:center}
.stat-value{font-size:28px;font-weight:800;color:#080F1E;letter-spacing:-1px}.stat-label{font-size:12px;color:#94A3B8;margin-top:4px}
table{width:100%;border-collapse:collapse}th{font-size:11px;font-weight:700;color:#94A3B8;text-transform:uppercase;letter-spacing:1px;padding:10px 12px;background:#F8FBFD;text-align:left}
td{font-size:13px;padding:10px 12px;border-bottom:1px solid #E8EEF4}.summary{background:#F0F4F8;border-radius:10px;padding:20px;font-size:14px;color:#080F1E;line-height:1.7}
.footer{margin-top:48px;padding-top:16px;border-top:1px solid #E8EEF4;font-size:11px;color:#94A3B8;display:flex;justify-content:space-between}
@media print{body{padding:24px}.no-print{display:none}}</style></head>
<body>
<div class="header"><div><div class="logo">iryss</div><div class="practice">${practiceDetails.name}</div></div><div class="date"><div style="font-weight:700">Recall Compliance Report</div><div>${today}</div></div></div>
<div class="section"><div class="hero"><div class="hero-rate">${compRate}%</div><div class="hero-label">Overall Recall Compliance Rate</div><div class="status-badge">${status}</div></div>
<div class="stats"><div class="stat"><div class="stat-value">${recallPts.length}</div><div class="stat-label">Patients Due Recall</div></div><div class="stat"><div class="stat-value">${contactedPts}</div><div class="stat-label">Contacted</div></div><div class="stat"><div class="stat-value">${recallPts.length-contactedPts}</div><div class="stat-label">Not Yet Contacted</div></div></div></div>
<div class="section"><h2>Recall Breakdown by Overdue Period</h2><table><tr><th>Overdue Period</th><th>Count</th><th>% of Due Patients</th><th>Status</th></tr>
${[{label:"30–90 days",min:0,max:3},{label:"90–180 days",min:3,max:6},{label:"180 days – 1 year",min:6,max:12},{label:"Over 1 year",min:12,max:999}].map(b=>{const n=recallPts.filter(p=>{const m=parseInt((p.lastVisit||"").match(/(\d+)/)?.[1]||0);return m>b.min&&m<=b.max;}).length;return`<tr><td>${b.label}</td><td>${n}</td><td>${recallPts.length>0?Math.round((n/recallPts.length)*100):0}%</td><td><span style="color:${b.min>=12?"#EF4444":b.min>=6?"#F59E0B":"#64748B"}">${b.min>=12?"Action Required":b.min>=6?"Follow Up":"Monitor"}</span></td></tr>`;}).join("")}
</table></div>
<div class="section"><h2>Summary Statement</h2><div class="summary">This practice maintains a <strong>${compRate}% recall compliance rate</strong> in line with GOC recommendations. ${compRate>=80?"The practice is meeting its obligations for patient recall and is considered compliant.":compRate>=60?"The practice is approaching compliance. Immediate action is recommended to contact remaining patients.":"Immediate action is required. The practice should prioritise contacting overdue patients to meet GOC standards."}</div></div>
<div class="footer"><span>Generated by Iryss — ${practiceDetails.name}</span><span>${today}</span></div>
<script>window.onload=()=>window.print();</script></body></html>`;
    const w = window.open('','_blank','width=900,height=700');
    w.document.write(html);
    w.document.close();
  }

  function parseCSVMonthsAgo(dateStr) {
    if (!dateStr) return 99;
    const d = new Date(dateStr);
    if (isNaN(d)) return 99;
    const now = new Date();
    return Math.floor((now - d) / (1000 * 60 * 60 * 24 * 30.44));
  }

  function parseCSV(text) {
    const lines = text.trim().split(/\r?\n/);
    if (lines.length < 2) return [];
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/["\s]/g,''));
    const nameKey    = headers.findIndex(h => h.includes('name'));
    const phoneKey   = headers.findIndex(h => h.includes('phone') || h.includes('mobile') || h.includes('tel'));
    const visitKey   = headers.findIndex(h => h.includes('visit') || h.includes('date') || h.includes('last'));
    const productKey = headers.findIndex(h => h.includes('product') || h.includes('lens') || h.includes('spec') || h.includes('type'));
    return lines.slice(1).map((line, i) => {
      const cols = line.split(',').map(c => c.trim().replace(/^"|"$/g,''));
      const months = parseCSVMonthsAgo(cols[visitKey]);
      const risk = months >= 18 ? 'high' : months >= 12 ? 'medium' : 'low';
      const riskScore = Math.min(99, Math.round((months / 30) * 100));
      const revenue = Math.round(150 + Math.random() * 280);
      return {
        id: `csv-${i}`,
        name:      cols[nameKey]    || `Patient ${i+1}`,
        phone:     cols[phoneKey]   || '',
        lastVisit: months === 99 ? 'Unknown' : `${months} months ago`,
        product:   cols[productKey] || 'Glasses',
        risk, riskScore, revenue,
        initials:  (cols[nameKey]||`P${i+1}`).split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase(),
      };
    }).filter(r => r.name && r.name !== 'Patient 1' || lines.length > 2);
  }

  function runImportAnalysis(rows) {
    setImportStep(2);
    setImportProgress(0);
    setImportCounters({ scanned:0, atRisk:0, recalls:0, gap:0 });
    const totalScanned = rows.length;
    const atRisk = rows.filter(r=>r.risk!=='low').length;
    const recalls = rows.filter(r=>parseCSVMonthsAgo(null)>=18||r.risk==='high'||r.risk==='medium').length;
    const gap = rows.reduce((a,r)=>a+(r.risk!=='low'?r.revenue:0), 0);
    let elapsed = 0;
    const tick = setInterval(() => {
      elapsed += 80;
      const pct = Math.min(100, Math.round((elapsed / 3000) * 100));
      setImportProgress(pct);
      setImportCounters({
        scanned: Math.round((pct/100) * totalScanned),
        atRisk:  Math.round((pct/100) * atRisk),
        recalls: Math.round((pct/100) * recalls),
        gap:     Math.round((pct/100) * gap),
      });
      if (pct >= 100) { clearInterval(tick); setImportStep(3); }
    }, 80);
  }

  function handleImportFile(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => {
      const rows = parseCSV(e.target.result);
      setImportData(rows);
      runImportAnalysis(rows);
    };
    reader.readAsText(file);
  }

  function useDemoImport() {
    const rows = PATIENTS.map(p => ({
      ...p,
      lastVisit: p.lastVisit,
    }));
    setImportData(rows);
    runImportAnalysis(rows);
  }

  function resetImport() { setImportStep(1); setImportData(null); setImportProgress(0); setImportCounters({ scanned:0, atRisk:0, recalls:0, gap:0 }); }

  return (
    <div onClick={()=>setShowBellDropdown(false)} style={{ display:"flex", height:"100vh", fontFamily:F, background:C.bg, color:C.navy, overflow:"hidden" }}>

      {/* ── Sidebar ── */}
      <div style={{ width:260, background:"linear-gradient(180deg, #080E1A 0%, #0B1324 50%, #0D1526 100%)", display:"flex", flexDirection:"column", flexShrink:0, padding:"0 0 20px", position:"relative", zIndex:10, boxShadow:"4px 0 24px rgba(0,0,0,.15)" }}>
        <div style={{ padding:"28px 22px 20px", borderBottom:"1px solid rgba(255,255,255,.06)", marginBottom:8 }}>
          <div style={{ display:"flex", alignItems:"baseline", gap:2, marginBottom:8 }}>
            <span style={{ fontSize:30, fontWeight:800, letterSpacing:-1, color:"#FFFFFF" }}>iry</span>
            <span style={{ fontSize:30, fontWeight:800, letterSpacing:-1, background:"linear-gradient(135deg,#0891B2,#06B6D4,#22D3EE)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>ss</span>
          </div>
          <div style={{ fontSize:9, color:"rgba(255,255,255,0.25)", letterSpacing:1.5, textTransform:"uppercase", fontWeight:600 }}>PATIENT RETENTION</div>
        </div>

        <nav style={{ display:"flex", flexDirection:"column", gap:3, flex:1, padding:"0 10px" }}>
          {(()=>{
            const primary = [
              { id:"dashboard",    label:"Dashboard",        icon:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg> },
              { id:"tasks",        label:"Today's Tasks",    icon:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>, badge:allTasks.filter(t=>!tasksDone[t.id]).length },
              { id:"patients",     label:"Patients",         icon:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>, badge:PATIENTS.length },
              { id:"inbox",        label:"Inbox",            icon:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></svg>, urgentDot:urgentCount>0, urgentBadge:urgentCount },
              { id:"recalls",      label:"Recalls",          icon:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>, badge:recallPatients.length, warnDot:complianceRate<80&&recallPatients.length>0 },
              { id:"scribe",       label:"AI Scribe",        icon:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>, beta:true },
            ];
            const modules = [
              { id:"claims",       label:"GOS Claims",       icon:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><path d="M9 15l2 2 4-4"/></svg> },
              { id:"myopia",       label:"Myopia Clinic",    icon:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/></svg>, badge:MYOPIA_PATIENTS.filter(p=>p.category==="active").length },
              { id:"reviews",      label:"Reviews",          icon:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> },
              { id:"intelligence", label:"Intelligence",     icon:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>, badge:competitorMentions.length>0?competitorMentions.length:null },
            ];
            const renderItem = (item, dim=false) => {
              const active = nav===item.id;
              return (
                <button key={item.id} onClick={()=>goNav(item.id)} style={{
                  display:"flex", alignItems:"center", gap:12, width:"100%", padding:"11px 14px",
                  border:"none", borderRadius:10, cursor:"pointer", position:"relative",
                  background:active?"rgba(8,145,178,.12)":"transparent",
                  color:active?"#22D3EE":dim?"rgba(255,255,255,.32)":"rgba(255,255,255,.4)",
                  fontWeight:active?600:500, fontSize:13.5, fontFamily:F, textAlign:"left",
                  transition:"all .2s ease", letterSpacing:-0.1,
                  borderLeft:active?"2px solid #06B6D4":"2px solid transparent",
                }}
                  onMouseEnter={e=>{ if(!active){ e.currentTarget.style.background="rgba(255,255,255,.04)"; e.currentTarget.style.color="rgba(255,255,255,.65)"; }}}
                  onMouseLeave={e=>{ if(!active){ e.currentTarget.style.background="transparent"; e.currentTarget.style.color=dim?"rgba(255,255,255,.32)":"rgba(255,255,255,.4)"; }}}>
                  <span style={{ width:18, display:"flex", alignItems:"center", justifyContent:"center", opacity:active?1:(dim?0.45:0.55) }}>{item.icon}</span>
                  <span style={{ flex:1 }}>{item.label}</span>
                  {item.warnDot   && <span style={{ width:8, height:8, borderRadius:"50%", background:C.amber, flexShrink:0, display:"inline-block" }} />}
                  {item.urgentDot && <span style={{ width:8, height:8, borderRadius:"50%", background:C.red, flexShrink:0, display:"inline-block", animation:"pulseDot 1.5s ease-in-out infinite, pulseRing 1.5s ease-in-out infinite" }} />}
                  {item.beta && <span style={{ background:"linear-gradient(135deg,#8B5CF6,#A78BFA)", color:"#fff", borderRadius:6, fontSize:8.5, fontWeight:800, padding:"2px 6px", letterSpacing:0.6, boxShadow:"0 2px 6px rgba(139,92,246,.35)" }}>BETA</span>}
                  {item.urgentBadge>0
                    ? <span style={{ background:"linear-gradient(135deg,#EF4444,#DC2626)", color:"#fff", borderRadius:20, fontSize:9, fontWeight:700, padding:"2px 7px", minWidth:18, textAlign:"center", animation:"pulseRing 1.5s ease-in-out infinite", boxShadow:"0 2px 8px rgba(239,68,68,.4)" }}>{item.urgentBadge}</span>
                    : item.badge>0 && <span style={{ background:"rgba(255,255,255,.08)", color:"rgba(255,255,255,.5)", borderRadius:20, fontSize:9, fontWeight:600, padding:"2px 7px", minWidth:18, textAlign:"center" }}>{item.badge}</span>
                  }
                </button>
              );
            };
            return (
              <>
                <div style={{ fontSize:9, color:"rgba(255,255,255,.25)", fontWeight:700, letterSpacing:1.4, textTransform:"uppercase", padding:"6px 16px 8px" }}>Main</div>
                {primary.map(item=>renderItem(item, false))}
                <div style={{ fontSize:9, color:"rgba(255,255,255,.2)", fontWeight:700, letterSpacing:1.4, textTransform:"uppercase", padding:"18px 16px 8px" }}>Modules</div>
                {modules.map(item=>renderItem(item, true))}
              </>
            );
          })()}
          <div style={{ marginTop:"auto" }}>
            <div style={{ height:1, background:"rgba(255,255,255,.05)", margin:"12px 8px" }} />
            {(()=>{
              const active = nav==="settings";
              return (
              <button onClick={()=>goNav("settings")} style={{
                display:"flex", alignItems:"center", gap:12, width:"100%", padding:"11px 14px",
                border:"none", borderRadius:10, cursor:"pointer", position:"relative",
                background:active?"rgba(8,145,178,.12)":"transparent",
                color:active?"#22D3EE":"rgba(255,255,255,.4)",
                fontWeight:active?600:500, fontSize:13.5, fontFamily:F, textAlign:"left",
                transition:"all .2s ease", letterSpacing:-0.1,
                borderLeft:active?"2px solid #06B6D4":"2px solid transparent",
              }}
                onMouseEnter={e=>{ if(!active){ e.currentTarget.style.background="rgba(255,255,255,.04)"; e.currentTarget.style.color="rgba(255,255,255,.65)"; }}}
                onMouseLeave={e=>{ if(!active){ e.currentTarget.style.background="transparent"; e.currentTarget.style.color="rgba(255,255,255,.4)"; }}}>
                <span style={{ width:18, display:"flex", alignItems:"center", justifyContent:"center", opacity:active?1:0.7 }}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg></span>
                <span style={{ flex:1 }}>Settings</span>
              </button>
              );
            })()}
          </div>
        </nav>

        <div style={{ borderTop:"1px solid rgba(255,255,255,.05)", marginTop:8, padding:"14px 22px 0" }}>
          <button onClick={()=>{ setCmdOpen(true); setCmdQuery(""); setCmdSel(0); }}
            style={{ width:"100%", display:"flex", alignItems:"center", gap:8, background:"rgba(255,255,255,.04)", border:"1px solid rgba(255,255,255,.08)", borderRadius:8, padding:"8px 10px", color:"rgba(255,255,255,.55)", fontFamily:F, fontSize:11.5, fontWeight:500, cursor:"pointer", marginBottom:10, transition:"all .15s" }}
            onMouseEnter={e=>{ e.currentTarget.style.background="rgba(255,255,255,.07)"; e.currentTarget.style.color="rgba(255,255,255,.8)"; }}
            onMouseLeave={e=>{ e.currentTarget.style.background="rgba(255,255,255,.04)"; e.currentTarget.style.color="rgba(255,255,255,.55)"; }}>
            <span style={{ fontSize:12 }}>⌕</span>
            <span style={{ flex:1, textAlign:"left" }}>Quick jump</span>
            <span style={{ fontSize:9.5, fontWeight:700, background:"rgba(255,255,255,.08)", padding:"2px 6px", borderRadius:4, letterSpacing:0.5 }}>⌘K</span>
          </button>
          <div style={{ fontSize:10, color:"rgba(255,255,255,.2)", padding:"2px 0", fontWeight:600, letterSpacing:0.5 }}>Bright Eyes Opticians</div>
        </div>
      </div>

      {/* ── Main ── */}
      <div style={{ flex:1, overflow:"auto", display:"flex", flexDirection:"column", paddingTop:64 }}>

        {/* Topbar */}
        <div style={{ position:"fixed", top:0, left:260, right:0, height:64, background:"rgba(255,255,255,.85)", backdropFilter:"blur(16px)", WebkitBackdropFilter:"blur(16px)", borderBottom:"1px solid rgba(226,232,240,.6)", zIndex:90, display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 36px" }}>
          <div style={{ fontSize:17, fontWeight:700, color:C.text, fontFamily:F, letterSpacing:-0.3 }}>{patientTimeline ? (patientTimeline.name||patientTimeline.patient||"Patient") : ""}</div>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <div style={{ position:"relative" }}>
              <div onClick={()=>setShowBellDropdown(v=>!v)} style={{ position:"relative", cursor:"pointer", width:38, height:38, display:"flex", alignItems:"center", justifyContent:"center", background:showBellDropdown?"rgba(8,145,178,.06)":"#F8FAFB", borderRadius:10, border:`1px solid ${showBellDropdown?C.teal:C.border}`, transition:"all .2s" }}
                onMouseEnter={e=>{if(!showBellDropdown){e.currentTarget.style.background="rgba(8,145,178,.04)";e.currentTarget.style.borderColor="#CBD5E1";}}}
                onMouseLeave={e=>{if(!showBellDropdown){e.currentTarget.style.background="#F8FAFB";e.currentTarget.style.borderColor=C.border;}}}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={showBellDropdown?C.teal:"#64748B"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
                {unreadCount>0&&<span style={{ position:"absolute", top:-4, right:-4, background:C.red, color:"#fff", borderRadius:20, fontSize:9, fontWeight:800, padding:"2px 5px", minWidth:16, textAlign:"center", lineHeight:1.4 }}>{unreadCount}</span>}
              </div>
              {showBellDropdown&&(()=>{
                const notifs = [
                  ...urgentMessages.map(m=>({ type:"urgent", icon:"🚨", label:`${m.patient} sent an urgent message`, time:m.time, action:()=>{ setSelectedThread(m); goNav("inbox"); setShowBellDropdown(false); } })),
                  ...liveInbox.filter(m=>m.unread&&m.sentiment==='negative'&&!urgentMessages.find(u=>u.id===m.id)).map(m=>({ type:"warning", icon:"⚠️", label:`${m.patient} needs attention`, time:m.time, action:()=>{ setSelectedThread(m); goNav("inbox"); setShowBellDropdown(false); } })),
                  { type:"automation", icon:"✅", label:"Recall reminder sent to overdue patients", time:"02:00", action:null },
                  { type:"automation", icon:"⭐", label:"7 Google review requests sent overnight", time:"01:45", action:null },
                  { type:"automation", icon:"📅", label:"Appointment confirmations sent for today", time:"07:00", action:null },
                ].slice(0,5);
                return (
                  <div onClick={e=>e.stopPropagation()} style={{ position:"absolute", top:44, right:0, width:340, background:C.white, border:`1px solid ${C.border}`, borderRadius:16, boxShadow:"0 12px 40px rgba(0,0,0,.15)", zIndex:800, overflow:"hidden" }}>
                    <div style={{ padding:"14px 16px 10px", borderBottom:`1px solid ${C.border}`, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                      <div style={{ fontWeight:700, fontSize:14, color:C.navy }}>Notifications</div>
                      <button onClick={()=>setShowBellDropdown(false)} style={{ background:"none", border:"none", cursor:"pointer", fontSize:18, color:C.slateLight, lineHeight:1 }}>×</button>
                    </div>
                    {notifs.length===0?(
                      <div style={{ padding:"28px 16px", textAlign:"center", color:C.slate, fontSize:13 }}>No new notifications</div>
                    ):(
                      notifs.map((n,i)=>(
                        <div key={i} onClick={n.action||undefined} style={{ display:"flex", gap:10, padding:"12px 16px", borderBottom:i<notifs.length-1?`1px solid ${C.border}`:"none", cursor:n.action?"pointer":"default", background:"transparent", transition:"background .12s" }}
                          onMouseEnter={e=>{ if(n.action) e.currentTarget.style.background="rgba(8,145,178,.04)"; }}
                          onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                          <span style={{ fontSize:16, flexShrink:0 }}>{n.icon}</span>
                          <div style={{ flex:1 }}>
                            <div style={{ fontSize:13, color:n.type==="urgent"?C.red:n.type==="warning"?C.amber:C.navy, fontWeight:n.type==="automation"?400:600, lineHeight:1.4 }}>{n.label}</div>
                            <div style={{ fontSize:11, color:C.slateLight, marginTop:3 }}>{n.time}</div>
                          </div>
                          {n.action&&<span style={{ fontSize:11, color:C.teal, fontWeight:600, alignSelf:"center", flexShrink:0 }}>View →</span>}
                        </div>
                      ))
                    )}
                    <div style={{ padding:"10px 16px", borderTop:`1px solid ${C.border}` }}>
                      <button onClick={()=>{ goNav("inbox"); setShowBellDropdown(false); }} style={{ width:"100%", background:"none", border:`1px solid ${C.border}`, borderRadius:8, padding:"8px", fontSize:12, fontWeight:600, color:C.slate, cursor:"pointer", fontFamily:F }}>View all in Inbox →</button>
                    </div>
                  </div>
                );
              })()}
            </div>
            <div onClick={()=>goNav("settings")} style={{ cursor:"pointer" }}>
              <Avatar initials="BE" bg={C.teal} size={36} />
            </div>
          </div>
        </div>

        {/* Content */}
        <div key={`page-${nav}`} className="page-enter" style={{ flex:1, overflow:"auto", padding:"28px 36px 36px", background:C.bg }}>

          {patientTimeline ? (()=>{
            const pt = patientTimeline;
            const name = pt.name||pt.patient||'';
            const initials = pt.initials||name.split(' ').map(w=>w[0]).join('').slice(0,2);
            const inboxEntry = liveInbox.find(m=>m.patient===name);
            const phone = pt.phone||inboxEntry?.phone||'';
            const thread = inboxEntry?.thread||[];
            const prevLabel = ({dashboard:"Dashboard",patients:"Patients",inbox:"Inbox",revenue:"Revenue",reviews:"Reviews",appointments:"Appointments",receptionist:"AI Receptionist"})[prevNav]||"Back";
            const events = [];
            if (pt.product||pt.lastVisit||pt.riskScore!==undefined) {
              events.push({ type:'profile', icon:'👤', label:'Patient record', detail:[pt.product, pt.lastVisit?`Last visit: ${pt.lastVisit}`:null, pt.revenue?`Revenue: £${pt.revenue}`:null].filter(Boolean).join(' · '), riskScore:pt.riskScore });
            }
            thread.forEach(msg=>events.push({type:'message',...msg}));
            return (
              <div>
                <button onClick={()=>setPatientTimeline(null)} style={{ background:"none", border:`1px solid ${C.border}`, borderRadius:8, padding:"7px 14px", fontSize:13, color:C.slate, cursor:"pointer", fontFamily:F, fontWeight:600, display:"inline-flex", alignItems:"center", gap:6, marginBottom:24 }}>← {prevLabel}</button>
                <div style={{ background:C.white, borderRadius:16, padding:"24px 28px", marginBottom:28, display:"flex", alignItems:"center", gap:20, border:`1px solid ${C.border}`, boxShadow:C.cardShadow }}>
                  <Avatar initials={initials} bg={pt.risk==="high"?C.red:pt.risk==="medium"?C.amber:C.teal} size={56} />
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:22, fontWeight:800, color:C.navy, letterSpacing:-0.6 }}>{name}</div>
                    <div style={{ fontSize:13, color:C.slate, marginTop:4, display:"flex", gap:10 }}>
                      {phone&&<span>{phone}</span>}
                    </div>
                    <div style={{ display:"flex", alignItems:"center", gap:8, marginTop:10 }}>
                      {pt.risk&&<Chip color={riskFg[pt.risk]}>{riskLabel[pt.risk]} risk</Chip>}
                      {pt.riskScore!==undefined&&<span style={{ fontSize:11, color:C.slateLight }}>Score: {pt.riskScore}/100</span>}
                      {pt.revenue&&<span style={{ fontSize:11, color:C.slateLight }}>· £{pt.revenue} revenue value</span>}
                    </div>
                  </div>
                  <div style={{ display:"flex", gap:10, alignItems:"center", flexShrink:0 }}>
                    {reviewSent[`review-${pt.name||pt.patient}`]
                      ? <span style={{ fontSize:12, color:C.green, fontWeight:600 }}>Review request sent ✓</span>
                      : <button onClick={()=>openReviewWA(pt.name||pt.patient||'', pt.phone||'')} style={{ background:"none", border:`1px solid ${C.border}`, borderRadius:10, padding:"10px 18px", fontWeight:600, fontSize:13, cursor:"pointer", fontFamily:F, color:C.slate }}>⭐ Review request</button>
                    }
                    {pt.id&&(waSent[pt.id]
                      ?<span style={{ fontSize:13, color:C.green, fontWeight:600 }}>✓ WhatsApp sent</span>
                      :<button onClick={()=>openSendWA(pt)} style={{ background:`linear-gradient(135deg,${C.teal},${C.tealLt})`, color:"#fff", border:"none", borderRadius:10, padding:"11px 22px", fontWeight:700, fontSize:13, cursor:"pointer", fontFamily:F, boxShadow:"0 4px 14px rgba(8,145,178,.3)" }}>Send WhatsApp</button>
                    )}
                  </div>
                </div>
                <div style={{ maxWidth:760, margin:"0 auto", position:"relative" }}>
                  <div style={{ position:"absolute", left:"50%", top:0, bottom:0, width:2, background:C.border, transform:"translateX(-1px)", zIndex:0 }} />
                  {events.map((ev,i)=>{
                    const prevEv = events[i-1];
                    const evDate = ev.sent_at?new Date(ev.sent_at):null;
                    const prevDate = prevEv?.sent_at?new Date(prevEv.sent_at):null;
                    const showDateSep = ev.type==='message'&&evDate&&(!prevDate||evDate.toDateString()!==prevDate.toDateString());
                    const tod=new Date(), yes=new Date(); yes.setDate(yes.getDate()-1);
                    const dateLabel = evDate?(evDate.toDateString()===tod.toDateString()?"Today":evDate.toDateString()===yes.toDateString()?"Yesterday":evDate.toLocaleDateString("en-GB",{day:"numeric",month:"long"})):null;
                    if (ev.type==='profile') return (
                      <div key={i} style={{ display:"flex", justifyContent:"center", marginBottom:28, position:"relative", zIndex:1 }}>
                        <div style={{ background:C.white, borderRadius:16, padding:"18px 24px", border:`1px solid ${C.border}`, boxShadow:"0 2px 10px rgba(0,0,0,.06)", maxWidth:"55%", textAlign:"center" }}>
                          <div style={{ fontSize:24, marginBottom:8 }}>{ev.icon}</div>
                          <div style={{ fontWeight:700, fontSize:14, color:C.navy, marginBottom:6 }}>{ev.label}</div>
                          <div style={{ fontSize:12, color:C.slate, lineHeight:1.7 }}>{ev.detail}</div>
                          {ev.riskScore!==undefined&&(
                            <div style={{ marginTop:12 }}>
                              <div style={{ display:"flex", justifyContent:"space-between", fontSize:10, color:C.slateLight, marginBottom:4 }}><span>Risk score</span><span>{ev.riskScore}/100</span></div>
                              <div style={{ height:5, borderRadius:4, background:C.border }}><div style={{ width:`${ev.riskScore}%`, height:"100%", background:ev.riskScore>=70?C.red:ev.riskScore>=40?C.amber:C.green, borderRadius:4 }} /></div>
                            </div>
                          )}
                        </div>
                        <div style={{ position:"absolute", left:"calc(50% - 8px)", top:"50%", transform:"translateY(-50%)", width:16, height:16, borderRadius:"50%", background:C.teal, border:"3px solid #fff", boxShadow:`0 0 0 2px ${C.border}`, zIndex:2 }} />
                      </div>
                    );
                    if (ev.type==='message') {
                      const isRight = ev.from==='practice';
                      return (
                        <div key={i}>
                          {showDateSep&&<div style={{ display:"flex", justifyContent:"center", margin:"8px 0 16px", position:"relative", zIndex:1 }}><span style={{ fontSize:11, color:C.slate, background:C.border, borderRadius:20, padding:"3px 14px", fontWeight:500 }}>{dateLabel}</span></div>}
                          <div style={{ display:"flex", justifyContent:isRight?"flex-end":"flex-start", marginBottom:10, position:"relative", zIndex:1 }}>
                            <div style={{ maxWidth:"43%", background:isRight?`linear-gradient(135deg,${C.teal},${C.tealLt})`:C.white, color:isRight?"#fff":C.navy, borderRadius:isRight?"16px 16px 4px 16px":"16px 16px 16px 4px", padding:"12px 16px", fontSize:13, lineHeight:1.6, border:!isRight?`1px solid ${C.border}`:"none", boxShadow:"0 2px 10px rgba(0,0,0,.08)", whiteSpace:"pre-wrap" }}>
                              {isRight&&<div style={{ fontSize:9, opacity:0.7, marginBottom:4, textTransform:"uppercase", letterSpacing:1 }}>Bright Eyes · Iryss AI</div>}
                              {ev.text}
                              <div style={{ fontSize:10, opacity:0.55, textAlign:"right", marginTop:6 }}>{ev.time}{isRight?" ✓✓":""}</div>
                            </div>
                            <div style={{ position:"absolute", left:"calc(50% - 6px)", top:14, width:12, height:12, borderRadius:"50%", background:isRight?C.teal:C.white, border:`2px solid ${isRight?C.teal:C.border}`, zIndex:2 }} />
                          </div>
                        </div>
                      );
                    }
                    return null;
                  })}
                  {events.length<=1&&thread.length===0&&(
                    <div style={{ textAlign:"center", padding:"48px 0", color:C.slate, fontSize:14, position:"relative", zIndex:1 }}>
                      <div style={{ fontSize:36, marginBottom:12 }}>💬</div>No WhatsApp conversation yet for this patient.
                    </div>
                  )}
                </div>
              </div>
            );
          })() : (<>

          {/* ═══ TODAY'S TASKS ═══ */}
          {nav==="tasks"&&(()=>{
            const doneTasks   = allTasks.filter(t=>tasksDone[t.id]);
            const activeTasks = allTasks.filter(t=>!tasksDone[t.id]);
            const doneCount   = doneTasks.length;
            const totalCount  = allTasks.length;
            const pct = totalCount>0 ? Math.round((doneCount/totalCount)*100) : 0;

            function TaskCard({ task }) {
              const isJust = !!taskJustCompleted[task.id];
              return (
                <div style={{
                  display:"flex", alignItems:"center", gap:14,
                  background: isJust ? "rgba(16,185,129,.04)" : C.card,
                  border: isJust ? `1px solid rgba(16,185,129,.25)` : `1px solid ${C.border}`,
                  borderRadius:16, padding:"16px 22px", marginBottom:10, boxShadow:C.cardShadow,
                  transition:"background .4s, border .4s"
                }}>
                  <div style={{ width:6, height:6, borderRadius:"50%", background:task.color, flexShrink:0 }} />
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:14, fontWeight:600, color:C.text, lineHeight:1.4 }}>{task.label}</div>
                    {task.sub && <div style={{ fontSize:12, color:C.slate, marginTop:2 }}>{task.sub}</div>}
                  </div>
                  <div style={{ display:"flex", alignItems:"center", gap:10, flexShrink:0 }}>
                    <button onClick={e=>{ e.stopPropagation(); task.onAction(); }} style={{
                      background:"none", border:`1px solid ${task.color}`, borderRadius:8,
                      padding:"5px 12px", fontSize:12, fontWeight:600, color:task.color,
                      cursor:"pointer", fontFamily:F, whiteSpace:"nowrap"
                    }}
                      onMouseEnter={e=>{ e.currentTarget.style.background=`${task.color}12`; }}
                      onMouseLeave={e=>{ e.currentTarget.style.background="none"; }}>
                      {task.action}
                    </button>
                    <div onClick={()=>completeTask(task.id)} style={{
                      width:22, height:22, borderRadius:"50%", flexShrink:0, cursor:"pointer",
                      border: isJust ? "none" : `2px solid ${C.border}`,
                      background: isJust ? C.green : "transparent",
                      display:"flex", alignItems:"center", justifyContent:"center",
                      transition:"background .3s, border .3s"
                    }}>
                      {isJust && <span style={{ color:"#fff", fontSize:11, fontWeight:700, lineHeight:1 }}>✓</span>}
                    </div>
                  </div>
                </div>
              );
            }

            function Section({ emoji, label, color, tasks }) {
              const active = tasks.filter(t=>!tasksDone[t.id]);
              if (active.length===0) return null;
              return (
                <div style={{ marginBottom:28 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:12 }}>
                    <span style={{ fontSize:14 }}>{emoji}</span>
                    <span style={{ fontSize:11, fontWeight:700, color, textTransform:"uppercase", letterSpacing:1 }}>{label}</span>
                    <span style={{ fontSize:11, color:"#9CA3AF" }}>{active.length} task{active.length!==1?"s":""}</span>
                  </div>
                  {active.map(task=><TaskCard key={task.id} task={task} />)}
                </div>
              );
            }

            return (
              <div style={{ animation:"fadeInUp .4s ease-out" }}>
                <div style={{ marginBottom:28 }}>
                  <h1 style={{ fontSize:26, fontWeight:800, color:C.text, letterSpacing:-0.7, margin:0, marginBottom:6, fontFamily:F }}>Today's Tasks</h1>
                  <p style={{ fontSize:14, color:C.slate, margin:0, fontFamily:F, fontWeight:500 }}>Here's what needs your attention today</p>
                </div>

                <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:16, padding:"20px 24px", marginBottom:28, boxShadow:C.cardShadow }}>
                  <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12 }}>
                    <span style={{ fontSize:14, fontWeight:700, color:C.text }}>{doneCount} of {totalCount} tasks completed</span>
                    <span style={{ fontSize:13, color:C.slate }}>{totalCount-doneCount} remaining</span>
                  </div>
                  <div style={{ height:8, background:"#F1F5F9", borderRadius:4, overflow:"hidden" }}>
                    <div style={{ height:"100%", background:`linear-gradient(90deg,${C.teal},${C.tealLt})`, width:`${pct}%`, borderRadius:4, transition:"width .4s" }} />
                  </div>
                </div>

                {activeTasks.length===0 ? (
                  <div style={{ textAlign:"center", padding:"64px 32px", background:C.card, border:`1px solid ${C.border}`, borderRadius:16, boxShadow:C.cardShadow }}>
                    <div style={{ fontSize:56, marginBottom:16 }}>✅</div>
                    <div style={{ fontSize:22, fontWeight:700, color:C.text, marginBottom:8 }}>All done for today!</div>
                    <div style={{ fontSize:14, color:C.slate }}>Iryss has your practice covered.</div>
                  </div>
                ) : (<>
                  {/* Priority order: Urgent first, then quick wins, then bulk */}
                  <Section emoji="🔴" label="URGENT"       color="#E11D48" tasks={urgentTasks} />
                  <Section emoji="👁" label="MYOPIA"       color="#8B5CF6" tasks={myopiaTasks} />
                  <Section emoji="📅" label="APPOINTMENTS" color="#0891B2" tasks={apptTasks} />
                  <Section emoji="🔵" label="ORDERS"       color="#3B82F6" tasks={orderTasksList} />
                  <Section emoji="⭐" label="REVIEWS"      color="#D97706" tasks={reviewTasksList} />
                  <Section emoji="🟠" label="RECALLS"      color="#D97706" tasks={recallTasksList} />

                  {/* Grouped re-engage card instead of 20+ individual cards */}
                  {(()=>{
                    const reengageTasks = highRiskTasksList.filter(t=>!tasksDone[t.id]);
                    if (reengageTasks.length===0) return null;
                    return (
                      <div style={{ marginBottom:28 }}>
                        <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:12 }}>
                          <span style={{ fontSize:14 }}>⚠️</span>
                          <span style={{ fontSize:11, fontWeight:700, color:"#D97706", textTransform:"uppercase", letterSpacing:1 }}>RE-ENGAGE</span>
                          <span style={{ fontSize:11, color:"#9CA3AF" }}>{reengageTasks.length} patient{reengageTasks.length!==1?"s":""}</span>
                        </div>
                        <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:16, overflow:"hidden", boxShadow:C.cardShadow }}>
                          <div style={{ padding:"16px 22px", display:"flex", alignItems:"center", justifyContent:"space-between", borderBottom:`1px solid ${C.border}` }}>
                            <div>
                              <div style={{ fontSize:14, fontWeight:700, color:C.text }}>{reengageTasks.length} high-risk patients need re-engagement</div>
                              <div style={{ fontSize:12, color:C.slate, marginTop:2 }}>Send WhatsApp messages to bring them back</div>
                            </div>
                            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                              <span style={{ background:"#FEF2F2", color:"#EF4444", fontSize:12, fontWeight:600, padding:"4px 12px", borderRadius:20 }}>£{highRisk.reduce((s,p)=>s+p.revenue,0).toLocaleString()} at risk</span>
                            </div>
                          </div>
                          {reengageTasks.slice(0, showAllReengage ? reengageTasks.length : 3).map(task=>(
                            <div key={task.id} style={{ display:"flex", alignItems:"center", gap:14, padding:"13px 22px", borderBottom:`1px solid #F1F5F9` }}>
                              <Avatar initials={task.label.replace("Re-engage ","").split(" ").map(w=>w[0]).join("").slice(0,2)} bg={C.red} size={32} />
                              <div style={{ flex:1, minWidth:0 }}>
                                <div style={{ fontSize:13, fontWeight:600, color:C.text }}>{task.label.replace("Re-engage ","")}</div>
                                <div style={{ fontSize:11, color:C.slate }}>{task.sub}</div>
                              </div>
                              <button onClick={e=>{e.stopPropagation();task.onAction();}} style={{ background:"none", border:`1px solid ${C.teal}`, borderRadius:8, padding:"5px 12px", fontSize:12, fontWeight:600, color:C.teal, cursor:"pointer", fontFamily:F, whiteSpace:"nowrap" }}>Send WhatsApp →</button>
                              <div onClick={()=>completeTask(task.id)} style={{ width:22, height:22, borderRadius:"50%", flexShrink:0, cursor:"pointer", border:`2px solid ${C.border}`, background:"transparent", display:"flex", alignItems:"center", justifyContent:"center", transition:"background .3s" }} />
                            </div>
                          ))}
                          {reengageTasks.length>3&&(
                            <button onClick={()=>setShowAllReengage(v=>!v)} style={{ width:"100%", padding:"12px", background:C.bg, border:"none", borderTop:`1px solid ${C.border}`, color:C.teal, fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:F }}>
                              {showAllReengage ? "Show less" : `Show all ${reengageTasks.length} patients →`}
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })()}
                </>)}

                {doneCount>0&&(
                  <div style={{ marginTop:28 }}>
                    <button onClick={()=>setCompletedCollapsed(c=>!c)} style={{ display:"flex", alignItems:"center", gap:8, background:"none", border:"none", cursor:"pointer", padding:"6px 0", fontFamily:F }}>
                      <span style={{ fontSize:13, fontWeight:600, color:"#059669" }}>✓ {doneCount} completed today</span>
                      <span style={{ fontSize:11, color:"#9CA3AF", marginLeft:4 }}>{completedCollapsed?"▼":"▲"}</span>
                    </button>
                    {!completedCollapsed&&(
                      <div style={{ marginTop:8 }}>
                        {doneTasks.map(task=>(
                          <div key={task.id} style={{ display:"flex", alignItems:"center", gap:14, background:"#FFFFFF", border:"1px solid #F0F0F0", borderRadius:12, padding:"12px 20px", marginBottom:8, opacity:0.55 }}>
                            <div style={{ width:6, height:6, borderRadius:"50%", background:task.color, flexShrink:0 }} />
                            <span style={{ fontSize:14, color:"#6B7280", textDecoration:"line-through", flex:1 }}>{task.label}</span>
                            <div onClick={()=>setTasksDone(prev=>{ const n={...prev}; delete n[task.id]; return n; })} style={{
                              width:22, height:22, borderRadius:"50%", background:"#059669",
                              display:"flex", alignItems:"center", justifyContent:"center",
                              cursor:"pointer", flexShrink:0
                            }}>
                              <span style={{ color:"#fff", fontSize:11, fontWeight:700 }}>✓</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })()}

          {/* ═══ DASHBOARD ═══ */}
          {nav==="dashboard"&&(
            <div>
              {/* Greeting + action buttons */}
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:28, animation:"fadeInUp .4s ease-out" }}>
                <div>
                  <h1 style={{ fontSize:26, fontWeight:800, letterSpacing:-0.7, marginBottom:4, color:C.text, fontFamily:F }}>{new Date().getHours()<12?"Good morning":new Date().getHours()<18?"Good afternoon":"Good evening"}, {practiceDetails.name?.split(' ')[0] || 'there'}</h1>
                  <p style={{ fontSize:13, color:C.slate, fontFamily:F, fontWeight:500 }}>{new Date().toLocaleDateString('en-GB',{weekday:'long',day:'numeric',month:'long'})}</p>
                </div>
                <div style={{ display:"flex", gap:10 }}>
                  <button style={{ padding:"9px 20px", borderRadius:10, fontSize:12, fontWeight:600, border:`1px solid ${C.border}`, background:C.card, color:C.slate, cursor:"pointer", fontFamily:F, transition:"all .2s", boxShadow:"0 1px 2px rgba(0,0,0,.04)" }}
                    onMouseEnter={e=>{e.currentTarget.style.borderColor="#CBD5E1";e.currentTarget.style.background="#F8FAFB";e.currentTarget.style.boxShadow="0 2px 8px rgba(0,0,0,.06)";}}
                    onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.background=C.card;e.currentTarget.style.boxShadow="0 1px 2px rgba(0,0,0,.04)";}}>Export</button>
                  <button style={{ padding:"9px 20px", borderRadius:10, fontSize:12, fontWeight:600, border:"none", background:C.tealGrad, color:"#fff", cursor:"pointer", fontFamily:F, boxShadow:"0 4px 14px rgba(8,145,178,.3)", transition:"all .25s" }}
                    onMouseEnter={e=>{e.currentTarget.style.boxShadow="0 6px 24px rgba(8,145,178,.4)";e.currentTarget.style.transform="translateY(-1px)";}}
                    onMouseLeave={e=>{e.currentTarget.style.boxShadow="0 4px 14px rgba(8,145,178,.3)";e.currentTarget.style.transform="translateY(0)";}}>+ New Campaign</button>
                </div>
              </div>

              {/* Urgent alert banner */}
              {urgentMessages.length>0&&(
                <div onClick={()=>setDrill("urgent-messages")} style={{ display:"flex", alignItems:"center", gap:14, background:"linear-gradient(135deg, #FFFBEB, #FEF3C7)", border:"1px solid #FDE68A", borderRadius:16, padding:"16px 22px", marginBottom:20, cursor:"pointer", transition:"all .25s", boxShadow:"0 2px 8px rgba(245,158,11,.06)", animation:"fadeInUp .5s ease-out" }}
                  onMouseEnter={e=>{e.currentTarget.style.boxShadow="0 4px 20px rgba(245,158,11,0.15)";e.currentTarget.style.transform="translateY(-2px)";}}
                  onMouseLeave={e=>{e.currentTarget.style.boxShadow="0 2px 8px rgba(245,158,11,.06)";e.currentTarget.style.transform="translateY(0)";}}>
                  <span style={{ width:8, height:8, borderRadius:"50%", background:C.amber, flexShrink:0, animation:"pulseDot 2s ease-in-out infinite", boxShadow:"0 0 8px rgba(245,158,11,.5)" }} />
                  <span style={{ fontSize:14, fontWeight:600, color:"#92400E", flex:1, fontFamily:F }}>{urgentMessages.length} patient{urgentMessages.length>1?"s":""} replied urgently — they need you today</span>
                  <span style={{ color:C.amber, fontSize:12, fontWeight:700, letterSpacing:0.3 }}>View →</span>
                </div>
              )}

              {/* ═══ Practice Score + 4 Metric Cards ═══ */}
              {(()=>{
                const atRiskCount = PATIENTS.filter(p=>p.risk!=="low").length;
                const practiceScore = Math.round((recovered.length / Math.max(atRiskCount + recovered.length, 1)) * 100);
                const circumference = 2 * Math.PI * 54;
                const strokeDashoffset = circumference - (practiceScore / 100) * circumference;
                const scoreColor = practiceScore >= 80 ? C.green : practiceScore >= 60 ? C.amber : C.red;
                const scoreLabel = practiceScore >= 90 ? "Excellent" : practiceScore >= 80 ? "Great" : practiceScore >= 60 ? "Good" : "Needs attention";
                return (
                  <div style={{ display:"grid", gridTemplateColumns:"170px repeat(4,1fr)", gap:16, marginBottom:22, alignItems:"stretch", animation:"fadeInUp .5s ease-out" }}>
                    {/* Practice Score Ring */}
                    <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:16, padding:"20px 16px", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", boxShadow:C.cardShadow, position:"relative", overflow:"hidden" }}>
                      <div style={{ position:"absolute", top:0, left:0, right:0, height:2, background:"linear-gradient(90deg,#0891B2,#06B6D4,#22D3EE)", opacity:.5 }} />
                      <div style={{ fontSize:9, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.8px", color:C.slateLight, marginBottom:8 }}>Practice Health</div>
                      <div style={{ position:"relative", width:90, height:90 }}>
                        <svg width="90" height="90" viewBox="0 0 120 120" style={{ transform:"rotate(-90deg)" }}>
                          <circle cx="60" cy="60" r="54" fill="none" stroke="#F1F5F9" strokeWidth="8" />
                          <circle cx="60" cy="60" r="54" fill="none" stroke={scoreColor} strokeWidth="8" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} style={{ transition:"stroke-dashoffset 1.2s cubic-bezier(0.34,1.56,0.64,1)", filter:`drop-shadow(0 0 6px ${scoreColor}40)` }} />
                        </svg>
                        <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" }}>
                          <div style={{ fontSize:28, fontWeight:800, color:C.text, lineHeight:1 }}>{practiceScore}</div>
                          <div style={{ fontSize:9, fontWeight:700, color:scoreColor, marginTop:3, letterSpacing:0.3 }}>{scoreLabel}</div>
                        </div>
                      </div>
                    </div>
                    {/* 4 Metric Cards */}
                    {[
                      { label:"Patients at Risk", value:atRiskCount, color:C.red, grad:"linear-gradient(135deg,#EF4444,#F87171)", trend:`↑ ${Math.max(Math.round(atRiskCount*0.12),1)} this week`, trendBg:"#FEE2E2", trendColor:"#DC2626", onClick:()=>setDrill("at-risk") },
                      { label:"Revenue at Risk", value:`£${atRiskRevenue.toLocaleString()}`, color:C.amber, grad:"linear-gradient(135deg,#F59E0B,#FBBF24)", trend:"This month", trendBg:"#FEF3C7", trendColor:"#D97706", onClick:()=>setDrill("revenue-risk") },
                      { label:"Patients Recovered", value:recovered.length, color:C.green, grad:"linear-gradient(135deg,#10B981,#34D399)", trend:"This month", trendBg:"#DCFCE7", trendColor:"#059669", onClick:()=>setDrill("recovered") },
                      { label:"Revenue Recovered", value:`£${recoveredRev.toLocaleString()}`, color:C.green, grad:"linear-gradient(135deg,#10B981,#34D399)", trend:"This month", trendBg:"#DCFCE7", trendColor:"#059669", onClick:()=>setDrill("revenue-recovered") },
                    ].map((mc,idx)=>(
                      <div key={mc.label} onClick={mc.onClick} style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:16, padding:"20px 22px 18px", position:"relative", overflow:"hidden", boxShadow:C.cardShadow, cursor:"pointer", transition:"all .25s ease", animation:`fadeInUp ${.4+idx*.08}s ease-out` }}
                        onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-3px)";e.currentTarget.style.boxShadow=C.cardHoverShadow;e.currentTarget.style.borderColor="rgba(8,145,178,.15)";}}
                        onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow=C.cardShadow;e.currentTarget.style.borderColor=C.border;}}>
                        <div style={{ position:"absolute", top:0, left:0, right:0, height:3, background:mc.grad }} />
                        <div style={{ fontSize:10, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.8px", color:C.slateLight, marginBottom:10 }}>{mc.label}</div>
                        <div style={{ fontSize:30, fontWeight:800, color:C.text, lineHeight:1, marginBottom:10, letterSpacing:-0.5 }}>{mc.value}</div>
                        <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                          <span style={{ display:"inline-block", background:mc.trendBg, color:mc.trendColor, fontSize:10, fontWeight:600, padding:"4px 10px", borderRadius:8 }}>{mc.trend}</span>
                          <span style={{ color:C.slateLight, fontSize:11 }}>→</span>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}

              {/* Secondary stats row */}
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:22, animation:"fadeInUp .6s ease-out" }}>
                <div onClick={()=>goNav("inbox")} style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:16, padding:"20px 22px 18px", position:"relative", overflow:"hidden", boxShadow:C.cardShadow, cursor:"pointer", transition:"all .25s ease" }}
                  onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-3px)";e.currentTarget.style.boxShadow=C.cardHoverShadow;e.currentTarget.style.borderColor="rgba(8,145,178,.15)";}}
                  onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow=C.cardShadow;e.currentTarget.style.borderColor=C.border;}}>
                  <div style={{ position:"absolute", top:0, left:0, right:0, height:3, background:"linear-gradient(90deg,#0891B2,#06B6D4,#22D3EE)" }} />
                  <div style={{ fontSize:10, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.8px", color:C.slateLight, marginBottom:10 }}>WhatsApp Sent This Week</div>
                  <div style={{ fontSize:30, fontWeight:800, color:C.text, lineHeight:1, marginBottom:10, letterSpacing:-0.5 }}>{liveInbox.length}</div>
                  <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                    <span style={{ display:"inline-block", background:"#CFFAFE", color:C.teal, fontSize:10, fontWeight:600, padding:"4px 10px", borderRadius:8 }}>This week</span>
                    <span style={{ color:C.slateLight, fontSize:11 }}>→</span>
                  </div>
                </div>
                <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:16, padding:"20px 22px 18px", position:"relative", overflow:"hidden", boxShadow:C.cardShadow }}>
                  <div style={{ position:"absolute", top:0, left:0, right:0, height:3, background:"linear-gradient(90deg,#10B981,#34D399)" }} />
                  <div style={{ fontSize:10, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.8px", color:C.slateLight, marginBottom:10 }}>Recalls Today</div>
                  <div style={{ fontSize:30, fontWeight:800, color:C.text, lineHeight:1, marginBottom:10, letterSpacing:-0.5 }}>{recallPatients.length}</div>
                  <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                    <span style={{ display:"inline-block", background:"#DCFCE7", color:"#059669", fontSize:10, fontWeight:600, padding:"4px 10px", borderRadius:8 }}>Automated</span>
                  </div>
                </div>
              </div>

              {/* Needs Your Attention table */}
              <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:16, overflow:"hidden", boxShadow:C.cardShadow, marginBottom:22, animation:"fadeInUp .7s ease-out" }}>
                <div style={{ padding:"18px 24px", display:"flex", alignItems:"center", justifyContent:"space-between", borderBottom:`1px solid ${C.border}` }}>
                  <div>
                    <span style={{ fontSize:16, fontWeight:700, letterSpacing:-0.3, color:C.text }}>Needs Your Attention</span>
                    <span style={{ fontSize:12, color:C.slate, fontWeight:400, marginLeft:10 }}>High-risk patients — act now to retain them</span>
                  </div>
                  <span style={{ fontSize:10, fontWeight:700, padding:"5px 12px", borderRadius:20, background:"linear-gradient(135deg,#FEE2E2,#FECACA)", color:C.red, letterSpacing:0.3 }}>{highRisk.length} patients</span>
                </div>
                <table style={{ width:"100%", borderCollapse:"collapse", fontFamily:F }}>
                  <thead>
                    <tr style={{ background:C.bg }}>
                      {["Patient","Type","Days Overdue","Last Visit",""].map(h=>(
                        <th key={h} style={{ padding:"10px 22px", textAlign:"left", fontSize:10, fontWeight:700, color:C.slateLight, textTransform:"uppercase", letterSpacing:0.5, borderBottom:`1px solid ${C.border}` }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {highRisk.slice(0,5).map((p,i)=>{
                      const daysNum = parseInt(p.lastVisit);
                      const daysOverdue = p.lastVisit.includes("month") ? daysNum * 30 : daysNum;
                      const prod = p.product.toLowerCase();
                      const isCL = prod.includes("contact")||prod.includes("cl ")||prod.includes("acuvue")||prod.includes("dailies")||prod.includes("biofinity")||prod.includes("oasys")||prod.includes("coopervision")||prod.includes("lens");
                      return (
                        <tr key={p.id} style={{ borderBottom:i<4?`1px solid rgba(226,232,240,0.5)`:"none", transition:"background .15s" }}
                          onMouseEnter={e=>e.currentTarget.style.background=C.bg}
                          onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                          <td style={{ padding:"12px 22px" }}>
                            <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                              <Avatar initials={p.initials} bg={`linear-gradient(135deg,${C.red},#F87171)`} size={34} />
                              <span style={{ fontWeight:600, fontSize:13, color:C.text }}>{p.name}</span>
                            </div>
                          </td>
                          <td style={{ padding:"12px 22px" }}>
                            <span style={{ fontSize:10, fontWeight:600, padding:"3px 10px", borderRadius:12, letterSpacing:"0.3px", background:isCL?"#CFFAFE":"#F1F5F9", color:isCL?C.teal:C.slate }}>
                              {isCL?"Contact Lens":"General"}
                            </span>
                          </td>
                          <td style={{ padding:"12px 22px" }}>
                            <span style={{ fontWeight:700, fontSize:13, color:daysOverdue>180?C.red:C.amber }}>{daysOverdue}d</span>
                          </td>
                          <td style={{ padding:"12px 22px", color:C.slate, fontSize:13 }}>{p.lastVisit}</td>
                          <td style={{ padding:"12px 22px", textAlign:"right" }}>
                            {!waSent[p.id]
                              ? <button onClick={()=>openSendWA(p)} style={{ background:`linear-gradient(135deg,${C.teal},#0E7490)`, color:"#fff", border:"none", borderRadius:8, padding:"7px 14px", fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:F, boxShadow:"0 4px 12px rgba(8,145,178,.25)", transition:"all .2s", whiteSpace:"nowrap" }}
                                  onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow="0 8px 20px rgba(8,145,178,.35)";}}
                                  onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="0 4px 12px rgba(8,145,178,.25)";}}>Send WhatsApp</button>
                              : <span style={{ fontSize:13, color:C.green, fontWeight:600 }}>Sent ✓</span>
                            }
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                {highRisk.length>5&&(
                  <div style={{ padding:"12px 22px", borderTop:`1px solid ${C.border}`, textAlign:"center" }}>
                    <button onClick={()=>goNav("patients")} style={{ background:"none", border:"none", color:C.teal, fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:F }}>View all {highRisk.length} at-risk patients →</button>
                  </div>
                )}
              </div>

              {/* ═══ CONTACT LENS RETENTION — defection defence ═══ */}
              {reorderPatients.length>0&&(()=>{
                const avgMonths = Math.round(reorderPatients.reduce((a,p)=>a+parseMonthsAgo(p.lastVisit),0)/reorderPatients.length);
                const leakRev = reorderPatients.reduce((a,p)=>a+Math.round((p.revenue||200)*0.4), 0);
                return (
                  <div style={{ marginTop:22, background:"linear-gradient(135deg,#FFFFFF 0%,#F8FBFD 100%)", border:`1px solid ${C.border}`, borderRadius:16, padding:"20px 24px", boxShadow:"0 2px 12px rgba(0,0,0,.04)", display:"grid", gridTemplateColumns:"auto 1fr auto", gap:20, alignItems:"center" }}>
                    <div style={{ width:44, height:44, borderRadius:12, background:"linear-gradient(135deg,#FEE2E2,#FECACA)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={C.red} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/></svg>
                    </div>
                    <div style={{ minWidth:0 }}>
                      <div style={{ fontSize:10, fontWeight:700, color:C.red, textTransform:"uppercase", letterSpacing:1, marginBottom:4 }}>Contact Lens Defection Defence</div>
                      <div style={{ fontSize:15.5, fontWeight:700, color:C.navy, letterSpacing:-0.3, marginBottom:3 }}>
                        {reorderPatients.length} CL patients haven't reordered in {avgMonths}+ months
                      </div>
                      <div style={{ fontSize:13, color:C.slate, fontWeight:500 }}>
                        That's <b style={{ color:C.red }}>£{leakRev.toLocaleString()}</b> of CL revenue probably going to Vision Direct. One WhatsApp can bring them back.
                      </div>
                    </div>
                    <div style={{ display:"flex", gap:8, flexShrink:0 }}>
                      <button onClick={()=>{ goNav("recalls"); setRecallTab("lens-reorder"); }}
                        style={{ background:"transparent", color:C.slate, border:`1px solid ${C.border}`, borderRadius:10, padding:"10px 16px", fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:F, whiteSpace:"nowrap" }}>
                        View all
                      </button>
                      <button onClick={()=>{
                          const first = reorderPatients[0];
                          if (first) openReorderWA(first);
                        }}
                        style={{ background:`linear-gradient(135deg,${C.teal},${C.tealLt})`, color:"#fff", border:"none", borderRadius:10, padding:"10px 18px", fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:F, boxShadow:"0 4px 14px rgba(8,145,178,.25)", whiteSpace:"nowrap" }}>
                        Send reorder WhatsApp →
                      </button>
                    </div>
                  </div>
                );
              })()}

              {/* ═══ REVENUE PULSE — the headline money view on Dashboard ═══ */}
              <div style={{ marginTop:22, display:"grid", gridTemplateColumns:"1.4fr 1fr", gap:16 }}>
                {/* Revenue recovered / at risk */}
                <div style={{ background:`linear-gradient(135deg,${C.navy} 0%,#1A2541 100%)`, borderRadius:18, padding:"24px 26px", boxShadow:"0 12px 40px rgba(12,18,32,.18)", position:"relative", overflow:"hidden", color:"#fff" }}>
                  <div style={{ position:"absolute", top:-50, right:-50, width:200, height:200, borderRadius:"50%", background:"radial-gradient(circle,rgba(16,185,129,.25),transparent 60%)", filter:"blur(40px)" }} />
                  <div style={{ position:"relative", display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:18 }}>
                    <div>
                      <div style={{ fontSize:10, fontWeight:700, color:"rgba(255,255,255,.45)", textTransform:"uppercase", letterSpacing:1, marginBottom:6 }}>Revenue recovered · MTD</div>
                      <div style={{ fontSize:30, fontWeight:800, color:"#fff", letterSpacing:-0.8, marginBottom:4, fontVariantNumeric:"tabular-nums" }}>£{recoveredRev.toLocaleString()}</div>
                      <div style={{ fontSize:11.5, color:C.green, fontWeight:600 }}>↑ {recovered.length} patients rescued</div>
                    </div>
                    <div>
                      <div style={{ fontSize:10, fontWeight:700, color:"rgba(255,255,255,.45)", textTransform:"uppercase", letterSpacing:1, marginBottom:6 }}>At risk · walking out</div>
                      <div style={{ fontSize:30, fontWeight:800, color:"#fff", letterSpacing:-0.8, marginBottom:4, fontVariantNumeric:"tabular-nums" }}>£{atRiskRevenue.toLocaleString()}</div>
                      <div style={{ fontSize:11.5, color:C.red, fontWeight:600 }}>↓ act before they leave</div>
                    </div>
                    <div>
                      <div style={{ fontSize:10, fontWeight:700, color:"rgba(255,255,255,.45)", textTransform:"uppercase", letterSpacing:1, marginBottom:6 }}>ROI on Iryss</div>
                      <div style={{ fontSize:30, fontWeight:800, color:"#22D3EE", letterSpacing:-0.8, marginBottom:4, fontVariantNumeric:"tabular-nums" }}>7.5×</div>
                      <div style={{ fontSize:11.5, color:"rgba(255,255,255,.5)", fontWeight:600 }}>£199 plan · £1,490 back</div>
                    </div>
                  </div>
                  <div style={{ position:"relative", marginTop:18, paddingTop:16, borderTop:"1px solid rgba(255,255,255,.08)", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                    <div style={{ fontSize:12, color:"rgba(255,255,255,.55)" }}>
                      You're on pace for <b style={{ color:"#fff" }}>£{Math.round(recoveredRev*1.8).toLocaleString()}</b> recovered this month · last month: £{Math.round(recoveredRev*0.85).toLocaleString()}
                    </div>
                    <button onClick={()=>goNav("revenue")}
                      style={{ background:"rgba(255,255,255,.08)", color:"#fff", border:"1px solid rgba(255,255,255,.15)", borderRadius:10, padding:"8px 14px", fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:F }}>
                      Full revenue breakdown →
                    </button>
                  </div>
                </div>

                {/* AI scribe teaser */}
                <div onClick={()=>goNav("scribe")} style={{ background:"linear-gradient(135deg, rgba(139,92,246,.08), rgba(167,139,250,.04))", border:"1px solid rgba(139,92,246,.2)", borderRadius:18, padding:"24px 26px", cursor:"pointer", transition:"all .2s" }}
                  onMouseEnter={e=>{ e.currentTarget.style.transform="translateY(-2px)"; e.currentTarget.style.boxShadow="0 10px 30px rgba(139,92,246,.15)"; }}
                  onMouseLeave={e=>{ e.currentTarget.style.transform="translateY(0)"; e.currentTarget.style.boxShadow="none"; }}>
                  <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}>
                    <div style={{ width:36, height:36, borderRadius:10, background:"linear-gradient(135deg,#8B5CF6,#A78BFA)", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff" }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/></svg>
                    </div>
                    <div>
                      <div style={{ fontSize:13.5, fontWeight:800, color:C.navy, letterSpacing:-0.2 }}>AI Scribe</div>
                      <span style={{ fontSize:9, fontWeight:800, color:"#8B5CF6", background:"rgba(139,92,246,.1)", padding:"2px 7px", borderRadius:6, letterSpacing:0.5 }}>BETA</span>
                    </div>
                  </div>
                  <div style={{ fontSize:13, color:C.navy, fontWeight:600, marginBottom:6, lineHeight:1.5 }}>
                    Dictate the exam. Iryss writes the record.
                  </div>
                  <div style={{ fontSize:12, color:C.slate, marginBottom:14, lineHeight:1.5 }}>
                    Saves 11 min per patient. 96.4% accurate. Push straight to your CRM.
                  </div>
                  <div style={{ display:"flex", alignItems:"center", gap:8, color:"#8B5CF6", fontSize:12, fontWeight:700 }}>
                    Try it now →
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* ═══ AT-RISK PATIENTS ═══ */}
          {nav==="patients"&&(
            <div style={{ animation:"fadeInUp .4s ease-out" }}>
              <div style={{ marginBottom:28 }}>
                <h1 style={{ fontSize:26, fontWeight:800, color:C.text, letterSpacing:-0.7, margin:0, marginBottom:6 }}>Patients</h1>
                <p style={{ fontSize:14, color:C.slate, margin:0, fontWeight:500 }}>Manage patient records and monitor health risk</p>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16, marginBottom:26 }}>
                <SC label="At risk · walking out"  value={highRisk.length}    accent={C.red}    sparkColor={C.red}    spark={[8,9,11,10,13,14,12,15,14,16,17,15,18,19,17,20,19,21,20,22,21,19,20,22,21,23,22,highRisk.length-1,highRisk.length,highRisk.length]}  onDrill={()=>setDrill("high-risk")} trend="1 new" trendUp={false} />
                <SC label="Medium risk · watchlist" value={medRisk.length}    accent={C.amber}  sparkColor={C.amber}  spark={[18,20,19,21,22,20,23,22,24,23,25,24,26,25,27,26,28,27,29,28,30,29,28,29,30,31,30,medRisk.length-1,medRisk.length,medRisk.length]} onDrill={()=>setDrill("med-risk")} />
                <SC label="Low risk · healthy"     value={lowRisk.length}     accent={C.green}  sparkColor={C.green}  spark={[45,48,46,50,52,49,53,51,55,54,57,55,58,60,58,62,60,63,61,64,63,65,64,66,65,67,66,lowRisk.length-1,lowRisk.length,lowRisk.length]} />
                <SC label="Total patients"         value={PATIENTS.length}    accent={C.teal}   sparkColor={C.teal}   spark={[100,102,103,105,106,108,109,110,112,113,115,116,117,118,119,120,121,122,122,123,123,124,124,124,125,125,125,PATIENTS.length,PATIENTS.length,PATIENTS.length]} />
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:18 }}>
                <div style={{ position:"relative", flex:1, maxWidth:340 }}>
                  <span style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", fontSize:15, pointerEvents:"none" }}>🔍</span>
                  <input
                    value={patientSearch}
                    onChange={e=>setPatientSearch(e.target.value)}
                    placeholder="Search patients…"
                    style={{ width:"100%", padding:"9px 12px 9px 36px", border:`1px solid ${C.border}`, borderRadius:10, fontSize:13, fontFamily:F, outline:"none", background:C.white, color:C.navy, boxSizing:"border-box" }}
                  />
                </div>
                <div style={{ display:"flex", gap:8 }}>
                  {["all","high","medium","low"].map(r=>(
                    <button key={r} onClick={()=>setFilterRisk(r)} style={{
                      padding:"8px 18px", borderRadius:20, cursor:"pointer", fontFamily:F,
                      background:filterRisk===r?"linear-gradient(135deg,#0891B2,#06B6D4)":C.white, color:filterRisk===r?"#fff":C.slate,
                      fontWeight:filterRisk===r?700:500, fontSize:12,
                      border:`1px solid ${filterRisk===r?"transparent":C.border}`,
                      boxShadow:filterRisk===r?"0 3px 12px rgba(8,145,178,.25)":"0 1px 2px rgba(0,0,0,.04)", transition:"all .2s"
                    }}>
                      {r==="all"?"All":r.charAt(0).toUpperCase()+r.slice(1)+" risk"}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ background:C.card, borderRadius:16, border:`1px solid ${C.border}`, overflow:"hidden", boxShadow:C.cardShadow }}>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 110px 130px 100px 120px 150px", gap:12, padding:"14px 22px", borderBottom:`1px solid ${C.border}`, background:"#F8FAFB" }}>
                  {["Patient","Last Visit","Product","Risk Score","Sentiment","Action"].map(h=>(
                    <div key={h} style={{ fontSize:10, fontWeight:700, color:C.slateLight, textTransform:"uppercase", letterSpacing:1 }}>{h}</div>
                  ))}
                </div>
                {filteredPts.map((p,i)=>{
                  const inboxEntry = liveInbox.find(m=>m.patient===p.name);
                  const sent = inboxEntry?.sentiment;
                  return (
                  <div key={p.id} style={{ display:"grid", gridTemplateColumns:"1fr 110px 130px 100px 120px 150px", gap:12, padding:"15px 20px", borderBottom:`1px solid #F1F5F9`, alignItems:"center", background:C.white, transition:"background .12s" }}
                    onMouseEnter={e=>e.currentTarget.style.background=C.bg}
                    onMouseLeave={e=>e.currentTarget.style.background=C.white}>
                    <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                      <Avatar initials={p.initials} bg={p.risk==="high"?C.red:p.risk==="medium"?C.amber:C.green} size={32} />
                      <div>
                        <div onClick={()=>openTimeline(p)} style={{ fontWeight:600, fontSize:13, cursor:"pointer", color:C.navy }} onMouseEnter={e=>e.target.style.color=C.teal} onMouseLeave={e=>e.target.style.color=C.navy}>{p.name}</div>
                        <div style={{ fontSize:11, color:C.slate }}>{p.phone}</div>
                      </div>
                    </div>
                    <div style={{ fontSize:13, color:C.slate }}>{p.lastVisit}</div>
                    <div style={{ fontSize:12, color:C.navy }}>{p.product}</div>
                    <div>
                      <Chip color={riskFg[p.risk]}>{riskLabel[p.risk]}</Chip>
                      <div style={{ fontSize:10, color:C.slateLight, marginTop:4 }}>Score: {p.riskScore}</div>
                    </div>
                    <div>
                      {sent==='urgent'  && <span style={{ fontSize:11, fontWeight:700, color:C.red,   background:"rgba(239,68,68,.1)",   padding:"3px 9px", borderRadius:20, display:"inline-flex", alignItems:"center", gap:4, animation:"pulseDot 1.5s ease-in-out infinite" }}>🚨 Urgent</span>}
                      {sent==='negative'&& <span style={{ fontSize:11, fontWeight:700, color:C.amber, background:"rgba(245,158,11,.1)", padding:"3px 9px", borderRadius:20, display:"inline-flex", alignItems:"center", gap:4 }}>⚠️ Concerned</span>}
                      {sent==='positive'&& <span style={{ fontSize:11, fontWeight:700, color:C.green, background:"rgba(16,185,129,.1)", padding:"3px 9px", borderRadius:20, display:"inline-flex", alignItems:"center", gap:4 }}>😊 Positive</span>}
                      {sent==='neutral' && <span style={{ fontSize:11, fontWeight:600, color:C.slate, background:"rgba(100,116,139,.1)", padding:"3px 9px", borderRadius:20 }}>Neutral</span>}
                      {!sent           && <span style={{ fontSize:11, color:C.slateLight }}>No messages</span>}
                    </div>
                    <div>
                      {waSent[p.id]
                        ? <span style={{ fontSize:12, color:C.green, fontWeight:600 }}>✓ Sent</span>
                        : <button onClick={()=>openSendWA(p)} style={{ background:`linear-gradient(135deg,${C.teal},${C.tealLt})`, color:"#fff", border:"none", borderRadius:8, padding:"6px 13px", fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:F, boxShadow:"0 2px 8px rgba(8,145,178,.3)" }}>Send WhatsApp</button>
                      }
                    </div>
                  </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ═══ RECALLS ═══ */}
          {nav==="recalls"&&(
            <div style={{ animation:"fadeInUp .4s ease-out" }}>
              <div style={{ marginBottom:28 }}>
                <h1 style={{ fontSize:26, fontWeight:800, color:C.text, letterSpacing:-0.7, margin:0, marginBottom:6 }}>Recalls</h1>
                <p style={{ fontSize:14, color:C.slate, margin:0, fontWeight:500 }}>Schedule and track patient recall campaigns</p>
              </div>
              {/* Auto-send toggle + status */}
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:24, background:C.card, borderRadius:16, padding:"18px 24px", border:`1px solid ${C.border}`, boxShadow:C.cardShadow }}>
                <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                  {autoSend
                    ? <span style={{ background:"rgba(16,185,129,.12)", color:C.green, fontWeight:700, fontSize:12, padding:"5px 14px", borderRadius:20, display:"flex", alignItems:"center", gap:6 }}><span style={{ width:7, height:7, borderRadius:"50%", background:C.green, display:"inline-block", boxShadow:"0 0 6px rgba(16,185,129,.6)" }} />Automation Active</span>
                    : <span style={{ background:"rgba(100,116,139,.1)", color:C.slate, fontWeight:600, fontSize:12, padding:"5px 14px", borderRadius:20 }}>Manual Mode</span>
                  }
                  <span style={{ fontSize:13, color:C.slate }}>Auto-send recalls to patients when they become due</span>
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                  <span style={{ fontSize:13, fontWeight:600, color:C.navy }}>Auto-send recalls</span>
                  <div onClick={()=>setAutoSend(v=>!v)} style={{ width:44, height:24, borderRadius:12, background:autoSend?C.teal:C.border, cursor:"pointer", position:"relative", transition:"background .2s", flexShrink:0 }}>
                    <div style={{ position:"absolute", top:3, left:autoSend?22:3, width:18, height:18, borderRadius:"50%", background:"#fff", boxShadow:"0 1px 4px rgba(0,0,0,.2)", transition:"left .2s" }} />
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div style={{ display:"flex", gap:6, marginBottom:24, background:C.card, borderRadius:12, padding:4, border:`1px solid ${C.border}`, boxShadow:"0 1px 2px rgba(0,0,0,.03)", width:"fit-content" }}>
                {[{id:"eye-test",label:"Eye Test Recalls"},{id:"lens-reorder",label:"Lens Reorders"},{id:"compliance",label:"Compliance"}].map(t=>(
                  <button key={t.id} onClick={()=>setRecallTab(t.id)} style={{ padding:"9px 20px", borderRadius:9, cursor:"pointer", fontFamily:F, fontSize:13, fontWeight:recallTab===t.id?700:500, background:recallTab===t.id?"linear-gradient(135deg,#0891B2,#06B6D4)":"transparent", color:recallTab===t.id?"#fff":C.slate, border:"none", transition:"all .2s", boxShadow:recallTab===t.id?"0 2px 8px rgba(8,145,178,.25)":"none" }}>{t.label}</button>
                ))}
              </div>

              {/* Eye Test Recalls tab */}
              {recallTab==="eye-test"&&(
                <div>
                  <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16, marginBottom:24 }}>
                    <SC label="Due for recall"               value={recallPatients.length}                 accent={C.teal}  sparkColor={C.teal}  spark={[12,13,14,14,15,16,17,18,19,19,20,21,22,22,23,24,25,26,27,27,28,29,30,31,32,33,34,35,recallPatients.length-1,recallPatients.length]} sub="8+ months since visit" onDrill={()=>setDrill("recall-due")} />
                    <SC label="Overdue · losing money"       value={overdueRecall.length}                  accent={C.red}   sparkColor={C.red}   spark={[3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13,14,14,15,15,16,16,17,overdueRecall.length-1,overdueRecall.length]}                   sub="24+ months · patients likely gone" trend={overdueRecall.length>0?"Act now":null} trendUp={false} onDrill={()=>setDrill("recall-overdue")} />
                    <SC label="Sending this week"            value={Math.min(recallPatients.length,3)}     accent={C.amber} sparkColor={C.amber} spark={[0,1,0,1,2,1,2,1,2,3,2,3,2,3,1,2,3,2,3,2,3,3,2,3,2,3,3,3,3,3]} sub="Auto-scheduled" onDrill={()=>setDrill("recall-this-week")} />
                    <SC label="Revenue if all return"        value={`£${recallRevenue.toLocaleString()}`}  accent={C.green} sparkColor={C.green} spark={[1200,1500,1700,2000,2300,2500,2700,3000,3200,3500,3800,4000,4300,4500,4800,5100,5300,5600,5900,6200,6400,6700,7000,7200,7500,7800,8000,recallRevenue*0.97,recallRevenue*0.99,recallRevenue]} sub={`${recallPatients.length} patients in pipeline`} onDrill={()=>setDrill("recall-revenue")} />
                  </div>
                  <div style={{ background:C.card, borderRadius:16, border:`1px solid ${C.border}`, overflow:"hidden", boxShadow:C.cardShadow }}>
                    <div style={{ display:"grid", gridTemplateColumns:"1fr 120px 130px 130px 100px 160px", gap:12, padding:"14px 22px", borderBottom:`1px solid ${C.border}`, background:"#F8FAFB" }}>
                      {["Patient","Last Visit","Due Date","Status","Risk Score","Action"].map(h=>(
                        <div key={h} style={{ fontSize:10, fontWeight:700, color:C.slateLight, textTransform:"uppercase", letterSpacing:1 }}>{h}</div>
                      ))}
                    </div>
                    {recallPatients.map((p,i)=>{
                      const months = parseMonthsAgo(p.lastVisit);
                      const monthsUntilDue = 24-months;
                      const overdue = monthsUntilDue<0;
                      const dueSoon = !overdue&&monthsUntilDue<=6;
                      const dueDate = new Date(); dueDate.setMonth(dueDate.getMonth()+monthsUntilDue);
                      const dueDateStr = dueDate.toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"});
                      const statusLabel = overdue?`${Math.abs(monthsUntilDue)} months overdue`:dueSoon?`Due in ${monthsUntilDue} months`:`Due in ${monthsUntilDue} months`;
                      const statusColor = overdue?C.red:dueSoon?C.amber:C.slate;
                      const statusBg = overdue?"rgba(239,68,68,.08)":dueSoon?"rgba(245,158,11,.08)":"transparent";
                      return (
                        <div key={p.id} style={{ display:"grid", gridTemplateColumns:"1fr 120px 130px 130px 100px 160px", gap:12, padding:"15px 20px", borderBottom:`1px solid #F1F5F9`, alignItems:"center", background:C.white, transition:"background .12s" }}
                          onMouseEnter={e=>e.currentTarget.style.background=C.bg}
                          onMouseLeave={e=>e.currentTarget.style.background=C.white}>
                          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                            <Avatar initials={p.initials} bg={p.risk==="high"?C.red:p.risk==="medium"?C.amber:C.green} size={32} />
                            <div>
                              <div onClick={()=>openTimeline(p)} style={{ fontWeight:600, fontSize:13, cursor:"pointer", color:C.navy }} onMouseEnter={e=>e.target.style.color=C.teal} onMouseLeave={e=>e.target.style.color=C.navy}>{p.name}</div>
                              <div style={{ fontSize:11, color:C.slate }}>{p.product}</div>
                            </div>
                          </div>
                          <div style={{ fontSize:13, color:C.slate }}>{p.lastVisit}</div>
                          <div style={{ fontSize:12, color:C.navy }}>{dueDateStr}</div>
                          <div style={{ fontSize:11, fontWeight:700, color:statusColor, background:statusBg, padding:"4px 10px", borderRadius:20, display:"inline-block" }}>{statusLabel}</div>
                          <div>
                            <Chip color={riskFg[p.risk]}>{riskLabel[p.risk]}</Chip>
                            <div style={{ fontSize:10, color:C.slateLight, marginTop:3 }}>{p.riskScore}/100</div>
                          </div>
                          <div>
                            {waSent[p.id]
                              ?<span style={{ fontSize:12, color:C.green, fontWeight:600 }}>✓ Sent</span>
                              :<button onClick={()=>openRecallWA(p)} style={{ background:`linear-gradient(135deg,${C.teal},${C.tealLt})`, color:"#fff", border:"none", borderRadius:8, padding:"7px 13px", fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:F, boxShadow:"0 2px 8px rgba(8,145,178,.25)" }}>Send Recall WhatsApp</button>
                            }
                          </div>
                        </div>
                      );
                    })}
                    {recallPatients.length===0&&<div style={{ padding:40, textAlign:"center", color:C.slate, fontSize:14 }}>No patients currently due for recall.</div>}
                  </div>
                </div>
              )}

              {/* Lens Reorders tab */}
              {recallTab==="lens-reorder"&&(
                <div>
                  <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16, marginBottom:24 }}>
                    <SC label="Likely due reorder" value={reorderPatients.length} accent={`linear-gradient(90deg,${C.teal},${C.tealLt})`} sub="Monthly CL patients" />
                    <SC label="3+ months overdue" value={reorderPatients.filter(p=>parseMonthsAgo(p.lastVisit)>=6).length} accent={`linear-gradient(90deg,${C.red},#F97316)`} sub="Long overdue" />
                    <SC label="Avg months lapsed" value={Math.round(reorderPatients.reduce((a,p)=>a+parseMonthsAgo(p.lastVisit),0)/(reorderPatients.length||1))} accent={`linear-gradient(90deg,${C.amber},#EAB308)`} sub="Since last visit" />
                    <SC label="Est. reorder revenue" value={`£${reorderPatients.reduce((a,p)=>a+Math.round(p.revenue*0.4),0).toLocaleString()}`} accent={`linear-gradient(90deg,${C.green},#34D399)`} sub="If all reorder" />
                  </div>
                  <div style={{ background:C.card, borderRadius:16, border:`1px solid ${C.border}`, overflow:"hidden", boxShadow:C.cardShadow }}>
                    <div style={{ display:"grid", gridTemplateColumns:"1fr 130px 160px 100px 160px", gap:12, padding:"12px 20px", borderBottom:`1px solid ${C.border}`, background:C.bg }}>
                      {["Patient","Last Visit","Lens Product","Risk","Action"].map(h=>(
                        <div key={h} style={{ fontSize:11, fontWeight:600, color:C.slateLight, textTransform:"uppercase", letterSpacing:0.8 }}>{h}</div>
                      ))}
                    </div>
                    {reorderPatients.map((p,i)=>{
                      const months = parseMonthsAgo(p.lastVisit);
                      const urgent = months>=6;
                      return (
                        <div key={p.id} style={{ display:"grid", gridTemplateColumns:"1fr 130px 160px 100px 160px", gap:12, padding:"15px 20px", borderBottom:`1px solid #F1F5F9`, alignItems:"center", background:C.white, transition:"background .12s" }}
                          onMouseEnter={e=>e.currentTarget.style.background=C.bg}
                          onMouseLeave={e=>e.currentTarget.style.background=C.white}>
                          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                            <Avatar initials={p.initials} bg={urgent?C.red:C.teal} size={32} />
                            <div>
                              <div onClick={()=>openTimeline(p)} style={{ fontWeight:600, fontSize:13, cursor:"pointer", color:C.navy }} onMouseEnter={e=>e.target.style.color=C.teal} onMouseLeave={e=>e.target.style.color=C.navy}>{p.name}</div>
                              <div style={{ fontSize:11, color:C.slate }}>{p.phone}</div>
                            </div>
                          </div>
                          <div style={{ fontSize:13, color:urgent?C.red:C.slate, fontWeight:urgent?600:400 }}>{p.lastVisit}</div>
                          <div style={{ fontSize:12, color:C.navy }}>{p.product}</div>
                          <Chip color={riskFg[p.risk]}>{riskLabel[p.risk]}</Chip>
                          <div>
                            {waSent[p.id]
                              ?<span style={{ fontSize:12, color:C.green, fontWeight:600 }}>✓ Sent</span>
                              :<button onClick={()=>openReorderWA(p)} style={{ background:`linear-gradient(135deg,${C.teal},${C.tealLt})`, color:"#fff", border:"none", borderRadius:8, padding:"7px 13px", fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:F, boxShadow:"0 2px 8px rgba(8,145,178,.25)" }}>Send Reorder WhatsApp</button>
                            }
                          </div>
                        </div>
                      );
                    })}
                    {reorderPatients.length===0&&<div style={{ padding:40, textAlign:"center", color:C.slate, fontSize:14 }}>No patients currently due for lens reorder.</div>}
                  </div>
                </div>
              )}

              {/* Compliance tab */}
              {recallTab==="compliance"&&(()=>{
                const totalPts     = recallPatients.length;
                const contactedPts = recallPatients.filter(p=>waSent[p.id]).length;
                const compRate     = complianceRate;
                const statusColor  = compRate>=80?C.green:compRate>=60?C.amber:C.red;
                const statusLabel  = compRate>=80?"Compliant":compRate>=60?"Review Required":"Action Required";
                const timeline     = [
                  { month:"Oct 2025", rate:72, contacted:5,  total:8  },
                  { month:"Nov 2025", rate:78, contacted:7,  total:10 },
                  { month:"Dec 2025", rate:65, contacted:6,  total:11 },
                  { month:"Jan 2026", rate:80, contacted:8,  total:10 },
                  { month:"Feb 2026", rate:85, contacted:9,  total:11 },
                  { month:"Mar 2026", rate:compRate, contacted:contactedPts, total:totalPts },
                ];
                const maxTimeRate = 100;
                return (
                  <div>
                    <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16, marginBottom:22 }}>
                      <SC label="Compliance rate"    value={`${compRate}%`}   accent={`linear-gradient(90deg,${statusColor},${compRate>=80?"#34D399":compRate>=60?"#EAB308":"#F97316"})`} />
                      <SC label="Patients contacted" value={contactedPts}     accent={`linear-gradient(90deg,${C.teal},${C.tealLt})`} sub={`of ${totalPts} recall patients`} />
                      <SC label="GOC target"         value="80%"              accent={`linear-gradient(90deg,${C.navy},#1E3A5F)`} sub="Minimum acceptable rate" />
                      <SC label="Status"             value={statusLabel}      accent={`linear-gradient(90deg,${statusColor},${statusColor}88)`} sub={compRate>=80?"On track":"Needs attention"} />
                    </div>

                    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:18, marginBottom:22 }}>
                      <div style={{ background:C.white, borderRadius:16, padding:28, border:`1px solid ${C.border}`, boxShadow:C.cardShadow, display:"flex", alignItems:"center", gap:24 }}>
                        {(()=>{
                          const r = 52; const circ = 2*Math.PI*r;
                          const dash = (compRate/100)*circ;
                          return (
                            <svg width={130} height={130} style={{ flexShrink:0 }}>
                              <circle cx={65} cy={65} r={r} fill="none" stroke={C.border} strokeWidth={10} />
                              <circle cx={65} cy={65} r={r} fill="none" stroke={statusColor} strokeWidth={10}
                                strokeDasharray={`${dash} ${circ-dash}`} strokeDashoffset={circ*0.25}
                                strokeLinecap="round" style={{ transition:"stroke-dasharray .6s ease" }} />
                              <text x={65} y={62} textAnchor="middle" dominantBaseline="middle" fill={statusColor} fontSize={22} fontWeight={800} fontFamily="Plus Jakarta Sans,sans-serif">{compRate}%</text>
                              <text x={65} y={80} textAnchor="middle" dominantBaseline="middle" fill={C.slate} fontSize={11} fontFamily="Plus Jakarta Sans,sans-serif">compliance</text>
                            </svg>
                          );
                        })()}
                        <div>
                          <div style={{ fontWeight:700, fontSize:16, color:C.navy, letterSpacing:-0.4, marginBottom:6 }}>GOC Compliance Status</div>
                          <div style={{ display:"inline-flex", alignItems:"center", gap:6, background:`${statusColor}18`, color:statusColor, fontWeight:700, fontSize:13, padding:"5px 14px", borderRadius:20, marginBottom:10 }}>
                            <span style={{ width:7, height:7, borderRadius:"50%", background:statusColor, display:"inline-block" }} />
                            {statusLabel}
                          </div>
                          <div style={{ fontSize:12, color:C.slate, lineHeight:1.6 }}>
                            {contactedPts} of {totalPts} recall patients contacted.{compRate<80&&<><br/><span style={{ color:C.amber, fontWeight:600 }}>Contact {Math.max(0,Math.ceil(totalPts*0.8)-contactedPts)} more to reach target.</span></>}
                          </div>
                        </div>
                      </div>

                      <div style={{ background:C.white, borderRadius:16, padding:22, border:`1px solid ${C.border}`, boxShadow:C.cardShadow }}>
                        <div style={{ fontWeight:700, fontSize:15, marginBottom:16, letterSpacing:-0.3 }}>Compliance Over Time</div>
                        {timeline.map((row,i)=>{
                          const barColor = row.rate>=80?C.green:row.rate>=60?C.amber:C.red;
                          const isNow = i===timeline.length-1;
                          return (
                            <div key={row.month} style={{ marginBottom:10 }}>
                              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:3 }}>
                                <span style={{ fontSize:11, color:isNow?C.navy:C.slate, fontWeight:isNow?700:400 }}>{row.month}{isNow?" (now)":""}</span>
                                <span style={{ fontSize:11, fontWeight:700, color:barColor }}>{row.rate}%</span>
                              </div>
                              <div style={{ height:7, background:C.border, borderRadius:4, overflow:"hidden" }}>
                                <div style={{ width:`${(row.rate/maxTimeRate)*100}%`, height:"100%", background:barColor, borderRadius:4, opacity:isNow?1:0.65 }} />
                              </div>
                            </div>
                          );
                        })}
                        <div style={{ marginTop:10, height:1, background:C.border }} />
                        <div style={{ marginTop:8, display:"flex", alignItems:"center", gap:6 }}>
                          <div style={{ height:2, width:20, background:C.red, borderRadius:2 }} />
                          <span style={{ fontSize:11, color:C.slate }}>GOC minimum (80%)</span>
                        </div>
                      </div>
                    </div>

                    <div style={{ background:C.white, borderRadius:16, border:`1px solid ${C.border}`, overflow:"hidden", boxShadow:C.cardShadow, marginBottom:18 }}>
                      <div style={{ display:"grid", gridTemplateColumns:"1fr 120px 100px 120px 160px", gap:12, padding:"12px 20px", borderBottom:`1px solid ${C.border}`, background:"#FAFBFC" }}>
                        {["Patient","Last Visit","Risk","Status","Action"].map(h=>(
                          <div key={h} style={{ fontSize:10, fontWeight:700, color:C.slateLight, textTransform:"uppercase", letterSpacing:1 }}>{h}</div>
                        ))}
                      </div>
                      {recallPatients.map((p,i)=>(
                        <div key={p.id} style={{ display:"grid", gridTemplateColumns:"1fr 120px 100px 120px 160px", gap:12, padding:"13px 20px", borderBottom:i<recallPatients.length-1?`1px solid ${C.border}`:"none", alignItems:"center", background:i%2===0?C.white:"#FAFBFD" }}>
                          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                            <Avatar initials={p.initials} bg={waSent[p.id]?C.green:C.amber} size={30} />
                            <div style={{ fontWeight:600, fontSize:13 }}>{p.name}</div>
                          </div>
                          <div style={{ fontSize:12, color:C.slate }}>{p.lastVisit}</div>
                          <Chip color={riskFg[p.risk]}>{riskLabel[p.risk]}</Chip>
                          <div>
                            {waSent[p.id]
                              ? <span style={{ fontSize:12, color:C.green, fontWeight:600 }}>✓ Contacted</span>
                              : <span style={{ fontSize:12, color:C.amber, fontWeight:600 }}>Not contacted</span>
                            }
                          </div>
                          <div style={{ fontSize:11, color:C.slate }}>{waSent[p.id]?"Recall WhatsApp sent":"Recall pending"}</div>
                        </div>
                      ))}
                      {recallPatients.length===0&&<div style={{ padding:40, textAlign:"center", color:C.slate, fontSize:14 }}>No recall patients found.</div>}
                    </div>

                    <div style={{ display:"flex", justifyContent:"flex-end" }}>
                      <button onClick={()=>generateComplianceReport(compRate, recallPatients, recallPatients.filter(p=>waSent[p.id]))}
                        style={{ background:`linear-gradient(135deg,${C.teal},${C.tealLt})`, color:"#fff", border:"none", borderRadius:12, padding:"12px 24px", fontWeight:700, fontSize:14, cursor:"pointer", fontFamily:F, boxShadow:"0 4px 16px rgba(8,145,178,.2)", letterSpacing:-0.2, display:"flex", alignItems:"center", gap:8 }}>
                        Generate Compliance Report
                      </button>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* ═══ AI SCRIBE ═══ */}
          {nav==="scribe"&&(()=>{
            const scribePatient = PATIENTS.find(p=>p.id===scribePatientId) || PATIENTS[0];
            const startListening = () => {
              setScribeState("listening");
              setTimeout(()=>setScribeState("processing"), 2800);
              setTimeout(()=>setScribeState("complete"), 4500);
            };
            const reset = () => setScribeState("idle");
            const pushToCRM = () => {
              setScribeRecent(prev => [
                { id:`SC-${String(parseInt(prev[0].id.slice(3))+1).padStart(3,"0")}`, patient:scribePatient.name, date:"Just now", mins:11, status:"pushed" },
                ...prev.slice(0,9)
              ]);
              showToast(`Clinical record pushed to ${scribePatient.name}'s file in your CRM`);
              setScribeState("idle");
            };
            const timeSavedHrs = Math.round(scribeRecent.reduce((a,s)=>a+s.mins, 0) / 6) / 10;

            const transcript = `Patient is a ${scribePatient.age||33} year old presenting for routine eye examination. Reports vision stable, no new symptoms, no headaches or flashes. Currently wearing ${scribePatient.product||"soft contact lenses"} with good tolerance. Distance vision 6/6 right and left. Near vision N5 each eye. Anterior segment unremarkable. Fundus clear, optic discs healthy with cup-to-disc ratio of 0.3 both eyes. Intraocular pressures 14 and 13 millimetres of mercury. Recommend continue current correction, review in 24 months, standard GOS one claim.`;

            return (
            <div>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:6 }}>
                <h1 style={{ fontSize:26, fontWeight:800, color:C.text, letterSpacing:-0.7, margin:0, display:"flex", alignItems:"center", gap:10 }}>
                  AI Scribe
                  <span style={{ background:"linear-gradient(135deg,#8B5CF6,#A78BFA)", color:"#fff", fontSize:10, fontWeight:800, padding:"3px 9px", borderRadius:8, letterSpacing:0.6, boxShadow:"0 3px 10px rgba(139,92,246,.3)" }}>BETA</span>
                </h1>
                <div style={{ display:"flex", alignItems:"center", gap:8, background:C.card, border:`1px solid ${C.border}`, borderRadius:12, padding:"8px 14px", boxShadow:"0 2px 6px rgba(0,0,0,.04)" }}>
                  <div style={{ width:7, height:7, borderRadius:"50%", background:C.green, boxShadow:"0 0 8px rgba(16,185,129,.6)", animation:"pulseDot 1.5s ease-in-out infinite" }} />
                  <span style={{ fontSize:12, fontWeight:600, color:C.slate }}>{timeSavedHrs} hrs saved this week</span>
                </div>
              </div>
              <p style={{ fontSize:14, color:C.slate, margin:"0 0 22px 0", fontWeight:500 }}>Dictate the exam. Iryss writes the clinical record, GOS claim, and referral letter — in seconds. Pushed straight to your CRM.</p>

              {/* Value strip */}
              <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:22 }}>
                {[
                  { label:"Avg time saved per exam", value:"11 min",  icon:"⏱" },
                  { label:"Exams scribed this week",  value:scribeRecent.length*9, icon:"📋" },
                  { label:"Letters auto-drafted",     value:scribeRecent.length*3, icon:"✉" },
                  { label:"Accuracy vs gold standard", value:"96.4%", icon:"✓" },
                ].map(s=>(
                  <div key={s.label} style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:12, padding:"14px 16px" }}>
                    <div style={{ fontSize:10.5, fontWeight:700, color:C.slateLight, textTransform:"uppercase", letterSpacing:1, marginBottom:6 }}>{s.icon} {s.label}</div>
                    <div style={{ fontSize:22, fontWeight:800, color:C.navy, letterSpacing:-0.5, fontVariantNumeric:"tabular-nums" }}>{s.value}</div>
                  </div>
                ))}
              </div>

              {/* Recording panel */}
              <div style={{ background:`linear-gradient(135deg, ${C.navy} 0%, #1E2942 100%)`, borderRadius:18, padding:"28px 30px", marginBottom:22, boxShadow:"0 12px 40px rgba(12,18,32,.2)", position:"relative", overflow:"hidden" }}>
                <div style={{ position:"absolute", top:-40, right:-40, width:180, height:180, borderRadius:"50%", background:"radial-gradient(circle, rgba(139,92,246,.25), transparent 60%)", filter:"blur(30px)" }} />
                <div style={{ display:"flex", alignItems:"center", gap:18, position:"relative" }}>
                  {/* Patient selector */}
                  <div style={{ minWidth:220 }}>
                    <div style={{ fontSize:10, fontWeight:700, color:"rgba(255,255,255,.4)", textTransform:"uppercase", letterSpacing:1, marginBottom:6 }}>Patient in chair</div>
                    <select value={scribePatientId} onChange={e=>setScribePatientId(e.target.value)}
                      disabled={scribeState!=="idle"}
                      style={{ background:"rgba(255,255,255,.08)", color:"#fff", border:"1px solid rgba(255,255,255,.15)", borderRadius:10, padding:"9px 12px", fontSize:13, fontWeight:600, fontFamily:F, cursor:scribeState==="idle"?"pointer":"not-allowed", width:"100%" }}>
                      {PATIENTS.slice(0,20).map(p=><option key={p.id} value={p.id} style={{ background:C.navy }}>{p.name} · {p.age?`age ${p.age}`:"patient"}</option>)}
                    </select>
                  </div>

                  <div style={{ flex:1, height:56, display:"flex", alignItems:"center", gap:3 }}>
                    {Array.from({length:60}).map((_,i)=>{
                      const baseH = 6 + Math.abs(Math.sin(i*0.7)*22);
                      const isListening = scribeState==="listening";
                      const h = isListening ? baseH + Math.abs(Math.sin((Date.now()/80 + i*0.4))*18) : baseH;
                      return <div key={i} style={{ width:3, height:scribeState==="idle"?4:h, background: scribeState==="idle" ? "rgba(255,255,255,.08)" : scribeState==="listening" ? "linear-gradient(180deg,#A78BFA,#8B5CF6)" : scribeState==="processing" ? "linear-gradient(180deg,#22D3EE,#06B6D4)" : "linear-gradient(180deg,#34D399,#10B981)", borderRadius:2, transition:"height .15s, background .3s" }} />;
                    })}
                  </div>

                  {/* Action button */}
                  {scribeState==="idle" && (
                    <button onClick={startListening}
                      style={{ display:"flex", alignItems:"center", gap:10, background:"linear-gradient(135deg,#8B5CF6,#A78BFA)", color:"#fff", border:"none", borderRadius:12, padding:"14px 24px", fontSize:14, fontWeight:700, cursor:"pointer", fontFamily:F, boxShadow:"0 8px 24px rgba(139,92,246,.4)", whiteSpace:"nowrap" }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/></svg>
                      Start dictation
                    </button>
                  )}
                  {scribeState==="listening" && (
                    <button onClick={()=>setScribeState("processing")}
                      style={{ display:"flex", alignItems:"center", gap:10, background:"linear-gradient(135deg,#EF4444,#DC2626)", color:"#fff", border:"none", borderRadius:12, padding:"14px 24px", fontSize:14, fontWeight:700, cursor:"pointer", fontFamily:F, boxShadow:"0 8px 24px rgba(239,68,68,.4)", whiteSpace:"nowrap", animation:"pulseRing 1.5s ease-in-out infinite" }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="6" width="12" height="12" rx="2"/></svg>
                      Listening… tap to stop
                    </button>
                  )}
                  {scribeState==="processing" && (
                    <div style={{ display:"flex", alignItems:"center", gap:10, background:"rgba(255,255,255,.08)", color:"#22D3EE", border:"1px solid rgba(34,211,238,.3)", borderRadius:12, padding:"14px 24px", fontSize:14, fontWeight:700, fontFamily:F, whiteSpace:"nowrap" }}>
                      <span style={{ width:14, height:14, border:"2px solid rgba(34,211,238,.3)", borderTopColor:"#22D3EE", borderRadius:"50%", animation:"spin 0.8s linear infinite", display:"inline-block" }} />
                      Writing record…
                    </div>
                  )}
                  {scribeState==="complete" && (
                    <button onClick={reset}
                      style={{ background:"rgba(255,255,255,.08)", color:"rgba(255,255,255,.7)", border:"1px solid rgba(255,255,255,.15)", borderRadius:12, padding:"14px 22px", fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:F, whiteSpace:"nowrap" }}>
                      New session
                    </button>
                  )}
                </div>

                <div style={{ marginTop:14, fontSize:12, color:"rgba(255,255,255,.55)" }}>
                  {scribeState==="idle"       && "Ready when you are. Press start to dictate the exam — Iryss listens, transcribes, and structures the findings."}
                  {scribeState==="listening"  && "Listening to you and the patient. Keep talking — long pauses are fine. Stop when the exam is complete."}
                  {scribeState==="processing" && "Structuring the clinical note, drafting referral letters, and building the GOS 1 claim."}
                  {scribeState==="complete"   && "Record drafted and ready for your review below. Nothing is pushed to your CRM until you approve it."}
                </div>
              </div>

              {/* Output — only once complete */}
              {scribeState==="complete" && (
                <div style={{ display:"grid", gridTemplateColumns:"1.15fr 1fr", gap:16, marginBottom:22 }}>
                  {/* Left: Clinical record */}
                  <div style={{ background:C.card, borderRadius:16, border:`1px solid ${C.border}`, padding:"22px 24px", boxShadow:"0 2px 12px rgba(0,0,0,.05)" }}>
                    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14 }}>
                      <h3 style={{ fontSize:14, fontWeight:700, color:C.text, margin:0 }}>Clinical Record · Structured</h3>
                      <span style={{ fontSize:10, fontWeight:700, color:C.green, background:"rgba(16,185,129,.1)", padding:"4px 9px", borderRadius:20, letterSpacing:0.3 }}>✓ READY TO REVIEW</span>
                    </div>
                    {/* Structured fields */}
                    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:14 }}>
                      {[
                        { l:"Patient",  v:scribePatient.name },
                        { l:"DOB / Age", v:`Age ${scribePatient.age||33}` },
                        { l:"Visual acuity R",  v:"6/6" },
                        { l:"Visual acuity L",  v:"6/6" },
                        { l:"IOP R / L", v:"14 / 13 mmHg" },
                        { l:"C:D ratio", v:"0.3 / 0.3" },
                        { l:"Rx status", v:"Stable" },
                        { l:"Next review",   v:"24 months" },
                      ].map(f=>(
                        <div key={f.l} style={{ background:C.bg, border:`1px solid ${C.border}`, borderRadius:9, padding:"9px 11px" }}>
                          <div style={{ fontSize:9.5, fontWeight:700, color:C.slateLight, textTransform:"uppercase", letterSpacing:0.8, marginBottom:2 }}>{f.l}</div>
                          <div style={{ fontSize:13, fontWeight:600, color:C.navy, fontFamily:"ui-monospace, monospace" }}>{f.v}</div>
                        </div>
                      ))}
                    </div>
                    {/* Narrative */}
                    <div style={{ fontSize:10.5, fontWeight:700, color:C.slateLight, textTransform:"uppercase", letterSpacing:0.8, marginBottom:6 }}>Narrative (auto-generated)</div>
                    <div style={{ background:C.bg, border:`1px solid ${C.border}`, borderRadius:10, padding:"12px 14px", fontSize:12.5, color:C.navy, lineHeight:1.6, marginBottom:14 }}>
                      {transcript}
                    </div>
                    {/* Push to CRM */}
                    <div style={{ display:"flex", gap:10 }}>
                      <button onClick={pushToCRM}
                        style={{ flex:1, background:`linear-gradient(135deg,${C.teal},${C.tealLt})`, color:"#fff", border:"none", borderRadius:10, padding:"11px 16px", fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:F, boxShadow:"0 4px 14px rgba(8,145,178,.25)" }}>
                        Push to CRM →
                      </button>
                      <button onClick={()=>showToast("Record saved as draft — not pushed to CRM")}
                        style={{ background:"transparent", color:C.slate, border:`1px solid ${C.border}`, borderRadius:10, padding:"11px 16px", fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:F }}>
                        Save draft
                      </button>
                    </div>
                  </div>

                  {/* Right: Referral letter + GOS */}
                  <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
                    <div style={{ background:C.card, borderRadius:16, border:`1px solid ${C.border}`, padding:"18px 20px", boxShadow:"0 2px 12px rgba(0,0,0,.05)" }}>
                      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:10 }}>
                        <h3 style={{ fontSize:13.5, fontWeight:700, color:C.text, margin:0 }}>Referral letter · Draft</h3>
                        <button onClick={()=>showToast("Letter copied to clipboard")}
                          style={{ fontSize:11, fontWeight:600, color:C.teal, background:"none", border:"none", cursor:"pointer", fontFamily:F }}>
                          Copy →
                        </button>
                      </div>
                      <div style={{ fontSize:11.5, color:C.slate, lineHeight:1.6, fontFamily:"ui-monospace, monospace", background:C.bg, padding:"10px 12px", borderRadius:8, border:`1px solid ${C.border}` }}>
                        Dear Colleague,<br/><br/>
                        I saw <b>{scribePatient.name}</b> today for routine eye examination. Vision stable, no new symptoms. IOPs normal. Fundus clear. No concerns — routine follow-up in 24 months.<br/><br/>
                        Kind regards,<br/>
                        Dr. Smith, Bright Eyes Opticians
                      </div>
                    </div>

                    <div style={{ background:C.card, borderRadius:16, border:`1px solid ${C.border}`, padding:"18px 20px", boxShadow:"0 2px 12px rgba(0,0,0,.05)" }}>
                      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:10 }}>
                        <h3 style={{ fontSize:13.5, fontWeight:700, color:C.text, margin:0 }}>GOS 1 claim · Pre-checked</h3>
                        <span style={{ fontSize:10, fontWeight:700, color:C.green, background:"rgba(16,185,129,.1)", padding:"3px 8px", borderRadius:20 }}>✓ VALID</span>
                      </div>
                      <div style={{ fontSize:12, color:C.slate, lineHeight:1.8 }}>
                        <div>Claim type: <b style={{ color:C.navy }}>GOS 1 · Full sight test</b></div>
                        <div>Mandatory fields: <b style={{ color:C.green }}>all present</b></div>
                        <div>PCSE pre-validation: <b style={{ color:C.green }}>no errors</b></div>
                      </div>
                      <button onClick={()=>showToast("GOS 1 claim submitted to PCSE")}
                        style={{ marginTop:10, width:"100%", background:C.navy, color:"#fff", border:"none", borderRadius:10, padding:"9px 14px", fontSize:12.5, fontWeight:700, cursor:"pointer", fontFamily:F }}>
                        Submit to PCSE →
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Recent sessions */}
              <div style={{ background:C.card, borderRadius:16, border:`1px solid ${C.border}`, overflow:"hidden", boxShadow:"0 2px 12px rgba(0,0,0,.05)" }}>
                <div style={{ padding:"14px 20px", borderBottom:`1px solid ${C.border}`, display:"flex", alignItems:"center", justifyContent:"space-between", background:C.bg }}>
                  <h3 style={{ fontSize:13, fontWeight:700, color:C.text, margin:0 }}>Recent sessions</h3>
                  <span style={{ fontSize:11, color:C.slate }}>{scribeRecent.length} this week</span>
                </div>
                {scribeRecent.map((s,i)=>{
                  const statusMap = {
                    pushed:   { label:"Pushed to CRM", color:C.green, bg:"rgba(16,185,129,.1)" },
                    reviewed: { label:"Reviewed",      color:C.amber, bg:"rgba(245,158,11,.1)" },
                    draft:    { label:"Draft",         color:C.slate, bg:"rgba(100,116,139,.08)" },
                  };
                  const st = statusMap[s.status] || statusMap.draft;
                  return (
                    <div key={s.id} style={{ display:"grid", gridTemplateColumns:"auto 1.5fr 1fr 1fr auto", gap:14, padding:"12px 20px", borderBottom:i<scribeRecent.length-1?`1px solid #F1F5F9`:"none", alignItems:"center" }}>
                      <Avatar initials={s.patient.split(" ").map(w=>w[0]).slice(0,2).join("")} bg={getColor(i)} size={28} />
                      <div>
                        <div style={{ fontSize:13, fontWeight:700, color:C.navy }}>{s.patient}</div>
                        <div style={{ fontSize:10.5, color:C.slateLight, fontFamily:"ui-monospace, monospace" }}>{s.id}</div>
                      </div>
                      <div style={{ fontSize:12, color:C.slate }}>{s.date}</div>
                      <div style={{ fontSize:12, color:C.slate }}>{s.mins} min saved</div>
                      <span style={{ fontSize:10.5, fontWeight:700, padding:"4px 10px", borderRadius:20, background:st.bg, color:st.color, letterSpacing:0.3 }}>{st.label}</span>
                    </div>
                  );
                })}
              </div>

              <div style={{ marginTop:18, padding:"14px 18px", background:"rgba(139,92,246,.05)", border:"1px solid rgba(139,92,246,.15)", borderRadius:12, display:"flex", alignItems:"center", gap:12 }}>
                <div style={{ width:30, height:30, borderRadius:8, background:"linear-gradient(135deg,#8B5CF6,#A78BFA)", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontSize:14, fontWeight:700, flexShrink:0 }}>◈</div>
                <div style={{ fontSize:12.5, color:C.slate, flex:1 }}>
                  <b style={{ color:C.navy }}>Beta access.</b> Iryss AI Scribe is in closed beta. It writes the clinical record, referral letter, and GOS claim — you review before anything's pushed to your CRM. <a href="mailto:IryssNI@outlook.com?subject=AI Scribe beta access" style={{ color:"#8B5CF6", fontWeight:700, textDecoration:"none" }}>Request full access →</a>
                </div>
              </div>
            </div>
            );
          })()}

          {/* ═══ GOS CLAIMS — zero-reject claim engine ═══ */}
          {nav==="claims"&&(()=>{
            // Sample claims data
            const CLAIMS = [
              // Pending validation (drafted, have issues to fix)
              { id:"GOS-2026-0412", patient:"Louise Everton",  type:"GOS 1", date:"Today",         amount:22.25, status:"pending",  issues:["Missing signature date"] },
              { id:"GOS-2026-0411", patient:"Ethan Kumar",     type:"GOS 1", date:"Today",         amount:22.25, status:"pending",  issues:["CL flag set but no CL product"] },
              { id:"GOS-2026-0410", patient:"Sophia Patel",    type:"GOS 3", date:"Today",         amount:52.30, status:"pending",  issues:["Prism values missing on voucher"] },
              // Ready — validated, just awaiting submission
              { id:"GOS-2026-0409", patient:"Tom Bradley",     type:"GOS 1", date:"Today",         amount:22.25, status:"ready",    issues:[] },
              { id:"GOS-2026-0408", patient:"Mia Davies",      type:"GOS 1", date:"Today",         amount:22.25, status:"ready",    issues:[] },
              { id:"GOS-2026-0407", patient:"Noah Williams",   type:"GOS 3", date:"Today",         amount:52.30, status:"ready",    issues:[] },
              { id:"GOS-2026-0406", patient:"Jack Morgan",     type:"GOS 1", date:"Yesterday",     amount:22.25, status:"ready",    issues:[] },
              // Submitted
              { id:"GOS-2026-0405", patient:"Amelia Brown",    type:"GOS 3", date:"Yesterday",     amount:52.30, status:"submitted", issues:[] },
              { id:"GOS-2026-0404", patient:"Liam Thompson",   type:"GOS 1", date:"Yesterday",     amount:22.25, status:"submitted", issues:[] },
              { id:"GOS-2026-0403", patient:"Isla Roberts",    type:"GOS 1", date:"Yesterday",     amount:22.25, status:"submitted", issues:[] },
              { id:"GOS-2026-0402", patient:"Harry Singh",     type:"GOS 1", date:"2 days ago",    amount:22.25, status:"submitted", issues:[] },
              { id:"GOS-2026-0401", patient:"Grace Evans",     type:"GOS 1", date:"2 days ago",    amount:22.25, status:"submitted", issues:[] },
              { id:"GOS-2026-0400", patient:"Ruby Fisher",     type:"GOS 3", date:"3 days ago",    amount:52.30, status:"submitted", issues:[] },
            ];
            const pending   = CLAIMS.filter(c=>c.status==="pending");
            const ready     = CLAIMS.filter(c=>c.status==="ready");
            const submitted = CLAIMS.filter(c=>c.status==="submitted");
            const totalThisMonth = 47;
            const approved = 44;
            const rejected = 0; // thanks to Iryss
            const recoveredRevenue = totalThisMonth * 22.25; // avg
            const totalValue = ready.reduce((a,c)=>a+c.amount,0);
            const tabMap = { pending, ready, submitted };
            const shown = tabMap[claimsTab] || pending;

            return (
            <div>
              <div style={{ marginBottom:22 }}>
                <h1 style={{ fontSize:26, fontWeight:800, color:C.text, letterSpacing:-0.7, margin:0, marginBottom:6 }}>GOS Claims</h1>
                <p style={{ fontSize:14, color:C.slate, margin:0, fontWeight:500 }}>Zero-reject claim engine. Every field validated against PCSE rules before submission — <b style={{ color:C.green }}>no claim leaves your practice with errors.</b></p>
              </div>

              {/* KPI row */}
              <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16, marginBottom:22 }}>
                <SC label="Submitted this month" value={totalThisMonth} accent={C.teal}  sparkColor={C.teal}  spark={[12,15,18,20,22,25,27,29,31,33,35,37,38,40,41,42,43,44,45,45,46,46,47,47,47,47,47,47,47,47]} sub={`${approved} approved · ${rejected} rejected`} />
                <SC label="Rejection rate"       value={`${Math.round((rejected/totalThisMonth)*100)}%`} accent={C.green} sparkColor={C.green} spark={[12,11,10,9,9,8,7,7,6,5,4,4,3,3,2,2,1,1,1,1,0,0,0,0,0,0,0,0,0,0]}  sub="UK average: 8%" trend="100% clean" trendUp={true} />
                <SC label="Revenue recovered"    value={`£${recoveredRevenue.toFixed(0)}`} accent={C.amber} sparkColor={C.amber} spark={[150,280,440,600,780,950,1130,1310,1490,1670,1840,2010,2180,2350,2510,2670,2820,2970,3120,3260,3400,3540,3680,3820,3960,4080,4200,4320,4440,recoveredRevenue]} sub="vs typical rejection losses" />
                <SC label="Avg review time"      value="0s"           accent={C.purple} sparkColor={C.purple} spark={Array.from({length:30},()=>0)} sub="Live validation — no manual review" />
              </div>

              {/* Live checker banner */}
              <div style={{ background:"linear-gradient(135deg, rgba(16,185,129,.08), rgba(8,145,178,.05))", border:"1px solid rgba(16,185,129,.2)", borderRadius:16, padding:"16px 22px", marginBottom:22, display:"flex", alignItems:"center", gap:14 }}>
                <div style={{ width:40, height:40, borderRadius:10, background:"linear-gradient(135deg,#10B981,#059669)", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontSize:18, flexShrink:0, boxShadow:"0 4px 14px rgba(16,185,129,.3)" }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:11, fontWeight:700, color:C.green, textTransform:"uppercase", letterSpacing:0.8, marginBottom:3 }}>LIVE · PCSE rules engine</div>
                  <div style={{ fontSize:14, fontWeight:600, color:C.navy }}>
                    Every claim is checked against {247} PCSE rules in real time. <b style={{ color:C.green }}>You've saved £{(totalThisMonth*22.25).toFixed(0)} this month</b> in would-be rejections.
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div style={{ display:"flex", gap:8, marginBottom:16 }}>
                {[
                  { id:"pending",   label:"Needs attention", count:pending.length,   color:C.amber },
                  { id:"ready",     label:"Ready to submit", count:ready.length,     color:C.green },
                  { id:"submitted", label:"Submitted",       count:submitted.length, color:C.slate },
                ].map(t=>(
                  <button key={t.id} onClick={()=>setClaimsTab(t.id)}
                    style={{ padding:"9px 16px", borderRadius:10, cursor:"pointer", fontFamily:F, fontSize:13, fontWeight:claimsTab===t.id?700:500,
                      background:claimsTab===t.id?"rgba(8,145,178,.08)":C.card,
                      color:claimsTab===t.id?C.teal:C.slate,
                      border:`1px solid ${claimsTab===t.id?"rgba(8,145,178,.2)":C.border}`,
                      transition:"all .15s", display:"flex", alignItems:"center", gap:8 }}>
                    {t.label}
                    <span style={{ background:claimsTab===t.id?"rgba(8,145,178,.15)":"#F1F5F9", color:claimsTab===t.id?C.teal:t.color, fontSize:11, fontWeight:700, padding:"1px 8px", borderRadius:10 }}>{t.count}</span>
                  </button>
                ))}
                {claimsTab==="ready" && ready.length>0 && (
                  <button onClick={()=>showToast(`${ready.length} claims submitted to PCSE · £${totalValue.toFixed(0)} pending payment`)}
                    style={{ marginLeft:"auto", padding:"9px 18px", background:`linear-gradient(135deg,${C.teal},${C.tealLt})`, color:"#fff", border:"none", borderRadius:10, fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:F, boxShadow:"0 4px 14px rgba(8,145,178,.25)" }}>
                    Submit all {ready.length} to PCSE →
                  </button>
                )}
              </div>

              {/* Claims table */}
              <div style={{ background:C.card, borderRadius:16, border:`1px solid ${C.border}`, overflow:"hidden", boxShadow:"0 2px 12px rgba(0,0,0,.06)" }}>
                <div style={{ display:"grid", gridTemplateColumns:"140px 1fr 80px 90px 90px 1.4fr 140px", gap:12, padding:"12px 20px", borderBottom:`1px solid ${C.border}`, background:C.bg }}>
                  {["Claim ID","Patient","Type","Amount","Date","Validation","Action"].map(h=>(
                    <div key={h} style={{ fontSize:11, fontWeight:600, color:C.slateLight, textTransform:"uppercase", letterSpacing:0.8 }}>{h}</div>
                  ))}
                </div>

                {shown.length===0 && (
                  <div style={{ padding:"60px 20px", textAlign:"center" }}>
                    <div style={{ fontSize:36, marginBottom:10, opacity:.3 }}>✓</div>
                    <div style={{ fontSize:14, fontWeight:600, color:C.navy, marginBottom:4 }}>Nothing here — you're clean</div>
                    <div style={{ fontSize:12.5, color:C.slate }}>
                      {claimsTab==="pending" && "No claims need your attention. Every new exam's claim is validated automatically."}
                      {claimsTab==="ready"   && "No claims queued for submission right now."}
                      {claimsTab==="submitted" && "No claims submitted yet this period."}
                    </div>
                  </div>
                )}

                {shown.map((c,i)=>(
                  <div key={c.id} style={{ display:"grid", gridTemplateColumns:"140px 1fr 80px 90px 90px 1.4fr 140px", gap:12, padding:"14px 20px", borderBottom:i<shown.length-1?`1px solid #F1F5F9`:"none", alignItems:"center", transition:"background .12s" }}
                    onMouseEnter={e=>e.currentTarget.style.background=C.bg}
                    onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                    <div style={{ fontSize:11.5, color:C.slateLight, fontFamily:"ui-monospace, monospace" }}>{c.id}</div>
                    <div style={{ fontSize:13, fontWeight:700, color:C.navy }}>{c.patient}</div>
                    <div><span style={{ fontSize:10.5, fontWeight:700, padding:"3px 9px", borderRadius:20, background:"rgba(8,145,178,.08)", color:C.teal, letterSpacing:0.3 }}>{c.type}</span></div>
                    <div style={{ fontSize:13, fontWeight:700, color:C.navy, fontFamily:"ui-monospace, monospace" }}>£{c.amount.toFixed(2)}</div>
                    <div style={{ fontSize:12, color:C.slate }}>{c.date}</div>
                    <div>
                      {c.status==="pending" && (
                        <div style={{ display:"flex", alignItems:"center", gap:6, fontSize:11.5, color:C.amber }}>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                          <span style={{ fontWeight:600 }}>{c.issues[0]}</span>
                        </div>
                      )}
                      {c.status==="ready" && (
                        <div style={{ display:"flex", alignItems:"center", gap:6, fontSize:11.5, color:C.green }}>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                          <span style={{ fontWeight:600 }}>All 247 rules passed</span>
                        </div>
                      )}
                      {c.status==="submitted" && (
                        <div style={{ display:"flex", alignItems:"center", gap:6, fontSize:11.5, color:C.slate }}>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                          <span style={{ fontWeight:600 }}>Submitted to PCSE · awaiting payment</span>
                        </div>
                      )}
                    </div>
                    <div>
                      {c.status==="pending" && (
                        <button onClick={()=>showToast(`Fix applied to ${c.id}: ${c.issues[0]}`)}
                          style={{ background:C.amber, color:"#fff", border:"none", borderRadius:8, padding:"7px 14px", fontSize:11.5, fontWeight:700, cursor:"pointer", fontFamily:F, whiteSpace:"nowrap" }}>
                          Auto-fix →
                        </button>
                      )}
                      {c.status==="ready" && (
                        <button onClick={()=>showToast(`${c.id} submitted to PCSE`)}
                          style={{ background:`linear-gradient(135deg,${C.teal},${C.tealLt})`, color:"#fff", border:"none", borderRadius:8, padding:"7px 14px", fontSize:11.5, fontWeight:700, cursor:"pointer", fontFamily:F, whiteSpace:"nowrap", boxShadow:"0 2px 8px rgba(8,145,178,.25)" }}>
                          Submit →
                        </button>
                      )}
                      {c.status==="submitted" && (
                        <button onClick={()=>showToast(`Tracking ${c.id} in PCSE portal`)}
                          style={{ background:"transparent", color:C.slate, border:`1px solid ${C.border}`, borderRadius:8, padding:"7px 14px", fontSize:11.5, fontWeight:600, cursor:"pointer", fontFamily:F, whiteSpace:"nowrap" }}>
                          Track →
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Rules demo */}
              <div style={{ marginTop:22, background:"#0C1220", borderRadius:16, padding:"22px 24px", boxShadow:"0 12px 40px rgba(12,18,32,.18)", position:"relative", overflow:"hidden" }}>
                <div style={{ fontSize:10, fontWeight:700, color:"rgba(255,255,255,.4)", textTransform:"uppercase", letterSpacing:1, marginBottom:10 }}>PCSE rules engine · 247 checks per claim</div>
                <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8, fontSize:11.5, color:"rgba(255,255,255,.65)", fontFamily:"ui-monospace, monospace" }}>
                  {[
                    "✓ Patient NHS number format",
                    "✓ Signature date ≤ exam date",
                    "✓ CL flag matches product",
                    "✓ Prism values on voucher",
                    "✓ Optom GOC number valid",
                    "✓ Eligibility category",
                    "✓ Voucher code matches Rx",
                    "✓ Age-group band correct",
                    "✓ Practice GOC-MC active",
                    "… and 238 more",
                  ].map((r,i)=>(
                    <div key={i} style={{ color: i<9 ? C.green : "rgba(255,255,255,.3)" }}>{r}</div>
                  ))}
                </div>
              </div>
            </div>
            );
          })()}

          {/* ═══ MYOPIA CLINIC ═══ */}
          {nav==="myopia"&&(()=>{
            const active     = MYOPIA_PATIENTS.filter(p=>p.category==="active");
            const trial      = MYOPIA_PATIENTS.filter(p=>p.category==="trial");
            const atRisk     = MYOPIA_PATIENTS.filter(p=>p.category==="at-risk");
            const stable     = MYOPIA_PATIENTS.filter(p=>p.category==="stable");
            const lapsed     = MYOPIA_PATIENTS.filter(p=>p.category==="lapsed");
            const graduated  = MYOPIA_PATIENTS.filter(p=>p.category==="graduated");
            const progressing = active.filter(p=>p.status==="progressing");
            const responding  = active.filter(p=>p.status==="responding");
            const pctResponding = active.length ? Math.round((responding.length/active.length)*100) : 0;
            // Pipeline revenue: rough estimate — £450 avg lifetime contribution per active/trial patient over 6m
            const pipelineRev = (active.length + trial.length) * 450;
            // Treatment mix from active + trial
            const treatmentMix = {};
            [...active, ...trial].forEach(p=>{ treatmentMix[p.treatment] = (treatmentMix[p.treatment]||0)+1; });
            const treatmentBreakdown = Object.entries(treatmentMix)
              .map(([name,count])=>({ name, count, color: MYOPIA_TREATMENT_COLORS[name] || "#64748B" }))
              .sort((a,b)=>b.count-a.count);
            const totalInMix = active.length + trial.length;

            const categoryMap = {
              all: MYOPIA_PATIENTS, active, trial, "at-risk": atRisk, stable, lapsed, graduated,
            };
            const tabs = [
              { id:"active",    label:"Active Treatment",    count:active.length    },
              { id:"trial",     label:"Trial · Fitting",     count:trial.length     },
              { id:"at-risk",   label:"Pre-myopic · At risk", count:atRisk.length   },
              { id:"stable",    label:"Stable · Monitoring", count:stable.length    },
              { id:"lapsed",    label:"Overdue Recall",      count:lapsed.length    },
              { id:"graduated", label:"Graduated",           count:graduated.length },
              { id:"all",       label:"All",                 count:MYOPIA_PATIENTS.length },
            ];
            const filtered = categoryMap[myopiaTab] || MYOPIA_PATIENTS;

            return (
            <div style={{ animation:"fadeInUp .4s ease-out" }}>
              {/* Header */}
              <div style={{ marginBottom:22 }}>
                <h1 style={{ fontSize:26, fontWeight:800, color:C.text, letterSpacing:-0.7, margin:0, marginBottom:6 }}>Myopia Clinic</h1>
                <p style={{ fontSize:14, color:C.slate, margin:0, fontWeight:500 }}>Paediatric myopia management — treatment, progression tracking &amp; recalls</p>
              </div>

              {/* AI insights banner */}
              <div style={{ background:"linear-gradient(135deg,#0891B2 0%,#0E7490 100%)", borderRadius:16, padding:"16px 22px", marginBottom:22, display:"flex", alignItems:"center", gap:14, boxShadow:"0 4px 16px rgba(8,145,178,.18)" }}>
                <div style={{ width:38, height:38, borderRadius:10, background:"rgba(255,255,255,.18)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0, color:"#fff" }}>◈</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:11, color:"rgba(255,255,255,.7)", textTransform:"uppercase", letterSpacing:0.8, fontWeight:600, marginBottom:3 }}>IRYSS AI · MYOPIA INSIGHTS</div>
                  <div style={{ fontSize:13.5, color:"#fff", fontWeight:500, lineHeight:1.5 }}>
                    <b>{progressing.length} patients</b> progressing &gt;0.20 mm/yr — consider switch or combination therapy.{" "}
                    <b>{lapsed.length} overdue</b> for 6-month review.{" "}
                    <b>{atRisk.length} pre-myopic children</b> need lifestyle review.{" "}
                    <b>1 child</b> turning 15 this quarter — schedule graduation discussion.
                  </div>
                </div>
                <button onClick={()=>showToast("AI recommendations expanded — see patient detail view")}
                  style={{ background:"rgba(255,255,255,.15)", color:"#fff", border:"1px solid rgba(255,255,255,.2)", borderRadius:10, padding:"9px 16px", fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:F, flexShrink:0, whiteSpace:"nowrap" }}>
                  View actions →
                </button>
              </div>

              {/* KPI cards */}
              <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16, marginBottom:22 }}>
                <SC label="Active on treatment"       value={active.length}         accent={C.teal}  sparkColor={C.teal}  spark={[3,3,4,4,5,5,6,6,6,7,7,7,7,7,7,7,7,7,8,8,8,8,8,8,8,8,8,8,active.length,active.length]} sub={`${trial.length} in fitting phase`} />
                <SC label="Responding well"           value={`${pctResponding}%`}   accent={C.green} sparkColor={C.green} spark={[30,35,40,42,45,48,50,52,55,58,60,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,pctResponding-1,pctResponding]} sub="AL growth <0.10 mm/yr" trend={`${responding.length}/${active.length}`} trendUp={true} />
                <SC label="Overdue · growing unseen"  value={lapsed.length}         accent={C.red}   sparkColor={C.red}   spark={[0,0,1,1,1,1,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,lapsed.length,lapsed.length]} sub="Progression happens fastest when you can't see it" />
                <SC label="Pipeline revenue"          value={`£${pipelineRev.toLocaleString()}`} accent={C.amber} sparkColor={C.amber} spark={[1200,1400,1600,1800,2000,2200,2400,2600,2800,3000,3200,3400,3600,3800,4000,4200,4400,4600,4800,5000,5200,5400,5600,5800,6000,6200,6400,6600,pipelineRev*0.99,pipelineRev]} sub="Locked in for next 6 months" />
              </div>

              {/* Progression + Treatment mix row */}
              <div style={{ display:"grid", gridTemplateColumns:"1.55fr 1fr", gap:16, marginBottom:22 }}>
                {/* Axial length progression */}
                <div style={{ background:C.card, borderRadius:16, border:`1px solid ${C.border}`, padding:"22px 24px", boxShadow:"0 2px 12px rgba(0,0,0,.05)" }}>
                  <div style={{ display:"flex", alignItems:"baseline", justifyContent:"space-between", marginBottom:3 }}>
                    <h3 style={{ fontSize:15, fontWeight:700, color:C.text, margin:0 }}>Axial Length Progression</h3>
                    <span style={{ fontSize:11, color:C.slateLight, fontWeight:500 }}>Last 12 months · active patients</span>
                  </div>
                  <p style={{ fontSize:12, color:C.slate, margin:"0 0 16px 0" }}>
                    Target &lt;0.10 mm/yr · amber 0.10–0.20 · red &gt;0.20 (consider switch)
                  </p>
                  {/* legend markers */}
                  <div style={{ display:"flex", gap:14, marginBottom:10, fontSize:11, color:C.slate }}>
                    <span style={{ display:"flex", alignItems:"center", gap:6 }}><span style={{ width:10, height:10, borderRadius:2, background:C.green }} />Responding</span>
                    <span style={{ display:"flex", alignItems:"center", gap:6 }}><span style={{ width:10, height:10, borderRadius:2, background:C.amber }} />Slowing</span>
                    <span style={{ display:"flex", alignItems:"center", gap:6 }}><span style={{ width:10, height:10, borderRadius:2, background:C.red }} />Progressing</span>
                  </div>
                  {active.slice().sort((a,b)=>b.alChange-a.alChange).map((p,i)=>{
                    const pct = Math.min(100, (p.alChange/0.40)*100);
                    const barColor = p.alChange<0.10 ? C.green : p.alChange<0.20 ? C.amber : C.red;
                    return (
                      <div key={p.id} onClick={()=>setMyopiaDetail(p)}
                        style={{ display:"grid", gridTemplateColumns:"160px 1fr 90px", gap:12, alignItems:"center", padding:"9px 0", borderBottom:i<active.length-1?`1px solid #F1F5F9`:"none", cursor:"pointer" }}>
                        <div style={{ display:"flex", alignItems:"center", gap:8, minWidth:0 }}>
                          <Avatar initials={p.initials} bg={getColor(i)} size={26} />
                          <div style={{ minWidth:0 }}>
                            <div style={{ fontSize:12.5, fontWeight:600, color:C.navy, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{p.name}</div>
                            <div style={{ fontSize:10.5, color:C.slateLight }}>Age {p.age} · {p.treatment}</div>
                          </div>
                        </div>
                        <div style={{ position:"relative", height:10, background:"#F1F5F9", borderRadius:5, overflow:"visible" }}>
                          <div style={{ height:"100%", width:`${pct}%`, background:barColor, borderRadius:5, transition:"width .4s" }} />
                          {/* 0.10 target tick */}
                          <div style={{ position:"absolute", top:-3, left:"25%", width:2, height:16, background:C.green, opacity:.35, borderRadius:1 }} />
                          {/* 0.20 switch threshold */}
                          <div style={{ position:"absolute", top:-3, left:"50%", width:2, height:16, background:C.red, opacity:.35, borderRadius:1 }} />
                        </div>
                        <div style={{ fontSize:13, fontWeight:700, color:barColor, textAlign:"right" }}>{p.alChange.toFixed(2)} mm</div>
                      </div>
                    );
                  })}
                </div>

                {/* Treatment mix */}
                <div style={{ background:C.card, borderRadius:16, border:`1px solid ${C.border}`, padding:"22px 24px", boxShadow:"0 2px 12px rgba(0,0,0,.05)" }}>
                  <h3 style={{ fontSize:15, fontWeight:700, color:C.text, margin:0, marginBottom:3 }}>Treatment Mix</h3>
                  <p style={{ fontSize:12, color:C.slate, margin:"0 0 18px 0" }}>Active + trial · {totalInMix} patients</p>
                  {treatmentBreakdown.map(t=>{
                    const pct = totalInMix>0 ? Math.round((t.count/totalInMix)*100) : 0;
                    return (
                      <div key={t.name} style={{ marginBottom:14 }}>
                        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:5 }}>
                          <span style={{ display:"flex", alignItems:"center", gap:8, fontSize:13, fontWeight:600, color:C.navy }}>
                            <span style={{ width:8, height:8, borderRadius:"50%", background:t.color }} />
                            {t.name}
                          </span>
                          <span style={{ fontSize:12, color:C.slate, fontWeight:500 }}>{t.count} · {pct}%</span>
                        </div>
                        <div style={{ height:6, background:"#F1F5F9", borderRadius:3, overflow:"hidden" }}>
                          <div style={{ height:"100%", width:`${pct}%`, background:t.color, borderRadius:3, transition:"width .4s" }} />
                        </div>
                      </div>
                    );
                  })}
                  <button onClick={()=>showToast("Reorder request sent to lab")}
                    style={{ width:"100%", marginTop:10, background:"rgba(8,145,178,.08)", color:C.teal, border:`1px solid rgba(8,145,178,.2)`, borderRadius:10, padding:"9px 14px", fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:F }}>
                    Reorder low-stock lenses →
                  </button>
                </div>
              </div>

              {/* Category tabs */}
              <div style={{ display:"flex", gap:8, marginBottom:16, flexWrap:"wrap" }}>
                {tabs.map(t=>(
                  <button key={t.id} onClick={()=>setMyopiaTab(t.id)} style={{
                    padding:"9px 16px", borderRadius:10, cursor:"pointer", fontFamily:F, fontSize:13,
                    fontWeight:myopiaTab===t.id?700:500,
                    background:myopiaTab===t.id?"rgba(8,145,178,.08)":C.card,
                    color:myopiaTab===t.id?C.teal:C.slate,
                    border:`1px solid ${myopiaTab===t.id?"rgba(8,145,178,.2)":C.border}`,
                    transition:"all .15s", display:"flex", alignItems:"center", gap:7
                  }}>
                    {t.label}
                    <span style={{ opacity:.65, fontWeight:600, fontSize:11, background:myopiaTab===t.id?"rgba(8,145,178,.15)":"#F1F5F9", color:myopiaTab===t.id?C.teal:C.slateLight, padding:"1px 7px", borderRadius:10 }}>{t.count}</span>
                  </button>
                ))}
              </div>

              {/* Patient table */}
              <div style={{ background:C.card, borderRadius:16, border:`1px solid ${C.border}`, overflow:"hidden", boxShadow:C.cardShadow }}>
                <div style={{ display:"grid", gridTemplateColumns:"1.4fr 60px 100px 110px 1.1fr 110px 110px 130px", gap:12, padding:"12px 20px", borderBottom:`1px solid ${C.border}`, background:C.bg }}>
                  {["Patient","Age","Rx (SER)","Axial L.","Treatment","Next review","AL / yr","Status"].map(h=>(
                    <div key={h} style={{ fontSize:11, fontWeight:600, color:C.slateLight, textTransform:"uppercase", letterSpacing:0.8 }}>{h}</div>
                  ))}
                </div>
                {filtered.length===0 && (
                  <div style={{ padding:"48px 20px", textAlign:"center", color:C.slate, fontSize:13 }}>
                    <div style={{ fontSize:32, marginBottom:8, opacity:.3 }}>◉</div>
                    <div style={{ fontWeight:600, color:C.navy, marginBottom:4 }}>Nothing here — yet</div>
                    <div style={{ fontSize:12.5, color:C.slate, maxWidth:360, margin:"0 auto" }}>As soon as Iryss spots a patient matching this category, they'll appear here. Usually within 6 hours of a new exam.</div>
                  </div>
                )}
                {filtered.map((p,i)=>{
                  const s = MYOPIA_STATUS[p.status] || MYOPIA_STATUS.stable;
                  const serOD = p.sphereOD > 0 ? `+${p.sphereOD.toFixed(2)}` : p.sphereOD.toFixed(2);
                  const serOS = p.sphereOS > 0 ? `+${p.sphereOS.toFixed(2)}` : p.sphereOS.toFixed(2);
                  return (
                    <div key={p.id} onClick={()=>setMyopiaDetail(p)}
                      style={{ display:"grid", gridTemplateColumns:"1.4fr 60px 100px 110px 1.1fr 110px 110px 130px", gap:12, padding:"14px 20px", borderBottom:i<filtered.length-1?`1px solid #F1F5F9`:"none", alignItems:"center", background:C.white, cursor:"pointer", transition:"background .12s" }}
                      onMouseEnter={e=>e.currentTarget.style.background=C.bg}
                      onMouseLeave={e=>e.currentTarget.style.background=C.white}>
                      <div style={{ display:"flex", alignItems:"center", gap:11 }}>
                        <Avatar initials={p.initials} bg={getColor(parseInt(p.id.slice(2))-1)} size={34} />
                        <div style={{ minWidth:0 }}>
                          <div style={{ fontSize:13.5, fontWeight:700, color:C.navy, letterSpacing:-0.1 }}>{p.name}</div>
                          <div style={{ fontSize:11, color:C.slateLight }}>Parent: {p.parent} · Myopia: {p.parentalMyopia}</div>
                        </div>
                      </div>
                      <div style={{ fontSize:13, color:C.navy, fontWeight:600 }}>{p.age}</div>
                      <div style={{ fontSize:12, color:C.slate, fontFamily:"ui-monospace,monospace" }}>
                        <div>{serOD}</div>
                        <div style={{ color:C.slateLight }}>{serOS}</div>
                      </div>
                      <div style={{ fontSize:12, color:C.slate, fontFamily:"ui-monospace,monospace" }}>
                        <div>{p.axialOD.toFixed(1)}</div>
                        <div style={{ color:C.slateLight }}>{p.axialOS.toFixed(1)}</div>
                      </div>
                      <div style={{ display:"flex", alignItems:"center", gap:7, minWidth:0 }}>
                        <span style={{ width:8, height:8, borderRadius:"50%", background:MYOPIA_TREATMENT_COLORS[p.treatment]||"#64748B", flexShrink:0 }} />
                        <span style={{ fontSize:12.5, color:C.navy, fontWeight:500, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{p.treatment}</span>
                      </div>
                      <div style={{ fontSize:12, color:C.slate, fontWeight:500 }}>{p.nextReview}</div>
                      <div style={{ fontSize:12.5, fontWeight:700, color: p.alChange===null ? C.slateLight : (p.alChange<0.10?C.green: p.alChange<0.20?C.amber:C.red) }}>
                        {p.alChange===null ? "—" : `${p.alChange.toFixed(2)} mm`}
                      </div>
                      <div>
                        <span style={{ fontSize:11, fontWeight:700, padding:"4px 10px", borderRadius:20, background:s.bg, color:s.color, letterSpacing:0.2 }}>{s.label}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            );
          })()}

          {/* ═══ INBOX ═══ */}
          {nav==="inbox"&&(()=>{
            // Filter + sort conversation list — unread always float to top
            const searched = liveInbox.filter(m=>!inboxSearch||m.patient.toLowerCase().includes(inboxSearch.toLowerCase()));
            const sortedInbox = inboxSort==="unread"
              ? searched.filter(m=>isUnread(m)).sort((a,b)=>new Date(b.sent_at||0)-new Date(a.sent_at||0))
              : [
                  ...searched.filter(m=>isUnread(m)).sort((a,b)=>new Date(b.sent_at||0)-new Date(a.sent_at||0)),
                  ...searched.filter(m=>!isUnread(m)).sort((a,b)=>new Date(b.sent_at||0)-new Date(a.sent_at||0)),
                ];
            // Thread messages sorted oldest → newest
            const sortedThread = selectedThread
              ? [...selectedThread.thread].sort((a,b)=>new Date(a.sent_at||0)-new Date(b.sent_at||0))
              : [];
            // Pinned message for current conversation
            const pinned = selectedThread ? pinnedMessages[selectedThread.id] : null;
            return (
              <div style={{ animation:"fadeInUp .4s ease-out" }}>
                <div style={{ marginBottom:28 }}>
                  <h1 style={{ fontSize:26, fontWeight:800, color:C.text, letterSpacing:-0.7, margin:0, marginBottom:6 }}>Inbox</h1>
                  <p style={{ fontSize:14, color:C.slate, margin:0, fontWeight:500 }}>Manage patient conversations and messages</p>
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"300px 1fr", gap:18, height:"calc(100vh - 240px)" }}>

                {/* ── CONVERSATION LIST ── */}
                <div style={{ background:C.card, borderRadius:16, border:`1px solid ${C.border}`, overflow:"hidden", display:"flex", flexDirection:"column", boxShadow:C.cardShadow }}>
                  {/* Header */}
                  <div style={{ padding:"14px 14px 10px", borderBottom:`1px solid ${C.border}`, flexShrink:0, background:C.bg }}>
                    <div style={{ fontWeight:700, fontSize:15, marginBottom:10, color:C.text, letterSpacing:-0.3 }}>Messages</div>
                    {/* Search */}
                    <div style={{ position:"relative", marginBottom:10 }}>
                      <span style={{ position:"absolute", left:10, top:"50%", transform:"translateY(-50%)", fontSize:12, pointerEvents:"none", color:C.slateLight }}>🔍</span>
                      <input value={inboxSearch} onChange={e=>setInboxSearch(e.target.value)} placeholder="Search…"
                        style={{ width:"100%", padding:"8px 10px 8px 30px", border:`1px solid ${C.border}`, borderRadius:22, fontSize:12, fontFamily:F, outline:"none", background:"#F0F2F5", boxSizing:"border-box", color:C.navy }} />
                    </div>
                    {/* Filter tabs */}
                    <div style={{ display:"flex", gap:6 }}>
                      {[["default","All"],["unread","Unread"]].map(([val,label])=>(
                        <button key={val} onClick={()=>setInboxSort(val)} style={{ padding:"5px 16px", borderRadius:20, border:`1.5px solid ${inboxSort===val?"#25D366":C.border}`, background:inboxSort===val?"#25D366":"transparent", color:inboxSort===val?"#fff":C.slate, fontSize:12, fontWeight:inboxSort===val?700:500, cursor:"pointer", fontFamily:F, transition:"all .15s" }}>{label}{val==="unread"&&unreadCount>0?` (${unreadCount})`:""}</button>
                      ))}
                    </div>
                  </div>
                  {/* Conversation rows */}
                  <div style={{ overflowY:"auto", flex:1 }}>
                    {sortedInbox.length===0&&(
                      <div style={{ padding:32, textAlign:"center", color:C.slateLight, fontSize:13 }}>
                        {inboxSort==="unread"?"No unread messages":"No conversations"}
                      </div>
                    )}
                    {sortedInbox.map((m)=>{
                      const unread = isUnread(m);
                      const active = selectedThread?.id===m.id;
                      return (
                        <div key={m.id} onClick={()=>{setSelectedThread(m);setReadConversations(prev=>({...prev,[m.patient]:true}));}} style={{
                          display:"flex", gap:11, padding:"12px 14px", cursor:"pointer", alignItems:"center",
                          background:active?"#F0FDF4":"transparent",
                          borderBottom:`1px solid ${C.border}`,
                          transition:"background .1s"
                        }}>
                          {/* Avatar + unread dot */}
                          <div style={{ position:"relative", flexShrink:0 }}>
                            <Avatar initials={m.initials} bg={getColor(liveInbox.indexOf(m))} size={42} />
                            {unread&&<span style={{ position:"absolute", bottom:1, right:1, width:11, height:11, borderRadius:"50%", background:"#25D366", border:"2px solid #fff" }} />}
                          </div>
                          {/* Content */}
                          <div style={{ flex:1, minWidth:0 }}>
                            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:4, marginBottom:2 }}>
                              <div style={{ fontWeight:unread?700:500, fontSize:13.5, color:C.navy, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{m.patient}</div>
                              <div style={{ fontSize:11, color:unread?"#25D366":C.slateLight, flexShrink:0, fontWeight:unread?600:400 }}>{m.time}</div>
                            </div>
                            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:6 }}>
                              <div style={{ fontSize:12, color:unread?C.navy:C.slateLight, fontWeight:unread?500:400, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", flex:1 }}>{m.preview}</div>
                              {unread&&<span style={{ background:"#25D366", color:"#fff", borderRadius:"50%", fontSize:10, fontWeight:700, minWidth:18, height:18, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, padding:"0 2px" }}>1</span>}
                            </div>
                            {m.sentiment==='urgent'&&<span style={{ display:"inline-block", marginTop:3, background:"rgba(239,68,68,.1)", color:C.red, fontSize:9.5, fontWeight:700, padding:"2px 7px", borderRadius:20 }}>🚨 Urgent</span>}
                            {m.sentiment==='negative'&&!m.urgent&&<span style={{ display:"inline-block", marginTop:3, background:"rgba(245,158,11,.08)", color:C.amber, fontSize:9.5, fontWeight:700, padding:"2px 7px", borderRadius:20 }}>⚠️ Concerned</span>}
                            {m.sentiment==='positive'&&<span style={{ display:"inline-block", marginTop:3, background:"rgba(37,211,102,.08)", color:"#16A34A", fontSize:9.5, fontWeight:700, padding:"2px 7px", borderRadius:20 }}>😊 Positive</span>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* ── THREAD PANEL ── */}
                {selectedThread?(
                  <div style={{ background:C.card, borderRadius:16, border:`1px solid ${C.border}`, display:"flex", flexDirection:"column", overflow:"hidden", boxShadow:C.cardShadow }}>

                    {/* Thread header */}
                    <div style={{ padding:"12px 18px", borderBottom:`1px solid ${C.border}`, display:"flex", alignItems:"center", gap:12, flexShrink:0, background:C.bg }}>
                      <Avatar initials={selectedThread.initials} bg={getColor(liveInbox.indexOf(selectedThread))} size={40} />
                      <div style={{ flex:1 }}>
                        <div onClick={()=>openTimeline(selectedThread)} style={{ fontWeight:700, fontSize:15, letterSpacing:-0.3, cursor:"pointer", color:C.navy }} onMouseEnter={e=>e.target.style.color=C.teal} onMouseLeave={e=>e.target.style.color=C.navy}>{selectedThread.patient}</div>
                        <div style={{ fontSize:11, color:C.slateLight, marginTop:1 }}>{selectedThread.phone||"WhatsApp"}</div>
                      </div>
                      {selectedThread.urgent&&(
                        <span style={{ fontSize:11, color:C.red, fontWeight:600, background:"rgba(239,68,68,.07)", border:"1px solid rgba(239,68,68,.2)", borderRadius:8, padding:"4px 10px" }}>⚠ Urgent</span>
                      )}
                    </div>

                    {/* Pinned message banner */}
                    {pinned&&(
                      <div onClick={()=>{setHighlightedMsg({convId:selectedThread.id,idx:pinned.idx});setTimeout(()=>setHighlightedMsg(null),2000);}} style={{ padding:"8px 18px", borderBottom:`1px solid ${C.border}`, background:"#FFFBEB", display:"flex", alignItems:"center", gap:10, cursor:"pointer", flexShrink:0 }}>
                        <div style={{ width:3, height:32, background:C.amber, borderRadius:2, flexShrink:0 }} />
                        <div style={{ flex:1, minWidth:0 }}>
                          <div style={{ fontSize:10, color:C.amber, fontWeight:700, marginBottom:1, textTransform:"uppercase", letterSpacing:.5 }}>📌 Pinned message</div>
                          <div style={{ fontSize:12, color:C.navy, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{pinned.text}</div>
                        </div>
                        <button onClick={e=>{e.stopPropagation();setPinnedMessages(prev=>{const n={...prev};delete n[selectedThread.id];return n;});}} style={{ background:"none", border:"none", fontSize:18, cursor:"pointer", color:C.slateLight, padding:"0 4px", lineHeight:1 }}>×</button>
                      </div>
                    )}

                    {/* Message thread */}
                    <div className="inbox-thread" ref={threadContainerRef} style={{ flex:1, overflowY:"scroll", padding:"14px 16px", display:"flex", flexDirection:"column", gap:4, background:"#ECE5DD" }}>

                      {/* Urgent AI flag */}
                      {selectedThread.urgent&&(
                        <div style={{ background:"rgba(239,68,68,.07)", border:"1px solid rgba(239,68,68,.18)", borderRadius:12, padding:"10px 14px", display:"flex", gap:10, alignItems:"center", marginBottom:6 }}>
                          <span>🚨</span>
                          <div style={{ fontSize:12, color:C.red, fontWeight:600 }}>AI flagged this as urgent — patient may need a clinical callback today.</div>
                        </div>
                      )}

                      {sortedThread.reduce((acc, msg, i, arr) => {
                        // Date separator
                        const msgDate = msg.sent_at ? new Date(msg.sent_at) : null;
                        const prevDate = i>0&&arr[i-1].sent_at ? new Date(arr[i-1].sent_at) : null;
                        if (msgDate&&(!prevDate||msgDate.toDateString()!==prevDate.toDateString())) {
                          const today=new Date(); const yest=new Date(); yest.setDate(yest.getDate()-1);
                          const label=msgDate.toDateString()===today.toDateString()?"Today":msgDate.toDateString()===yest.toDateString()?"Yesterday":msgDate.toLocaleDateString("en-GB",{day:"numeric",month:"long"});
                          acc.push(
                            <div key={"sep"+i} style={{ textAlign:"center", margin:"10px 0" }}>
                              <span style={{ fontSize:11, color:"#54656F", background:"rgba(255,255,255,.85)", borderRadius:8, padding:"3px 14px", boxShadow:"0 1px 1px rgba(0,0,0,.08)" }}>{label}</span>
                            </div>
                          );
                        }
                        const isPractice = msg.from==="practice";
                        const isHighlighted = highlightedMsg&&highlightedMsg.convId===selectedThread.id&&highlightedMsg.idx===i;
                        const menuOpen = msgMenuOpen&&msgMenuOpen.convId===selectedThread.id&&msgMenuOpen.idx===i;
                        const alreadyPinned = pinnedMessages[selectedThread.id]?.idx===i;
                        acc.push(
                          <div key={i} style={{ display:"flex", flexDirection:"column", alignItems:isPractice?"flex-end":"flex-start", marginBottom:2 }}
                            onMouseEnter={()=>setHoveredMsg({convId:selectedThread.id,idx:i})}
                            onMouseLeave={()=>{setHoveredMsg(null);if(!menuOpen)setMsgMenuOpen(null);}}>
                            <div style={{ display:"flex", alignItems:"flex-end", gap:6, flexDirection:isPractice?"row-reverse":"row", maxWidth:"75%", position:"relative" }}>
                              {/* ⋮ button */}
                              {hoveredMsg&&hoveredMsg.convId===selectedThread.id&&hoveredMsg.idx===i&&(
                                <div style={{ position:"relative", flexShrink:0, alignSelf:"center" }}>
                                  <button
                                    onClick={e=>{e.stopPropagation();setMsgMenuOpen(menuOpen?null:{convId:selectedThread.id,idx:i});}}
                                    style={{ background:"rgba(255,255,255,.9)", border:"none", borderRadius:"50%", width:26, height:26, cursor:"pointer", fontSize:15, display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 1px 3px rgba(0,0,0,.18)", color:"#54656F", padding:0 }}>⋮</button>
                                  {menuOpen&&(
                                    <div onClick={e=>e.stopPropagation()} style={{ position:"absolute", top:30, [isPractice?"right":"left"]:0, background:C.white, border:`1px solid ${C.border}`, borderRadius:10, boxShadow:"0 4px 20px rgba(0,0,0,.14)", minWidth:160, zIndex:50, overflow:"hidden" }}>
                                      <div
                                        onClick={()=>{
                                          if(alreadyPinned){setPinnedMessages(prev=>{const n={...prev};delete n[selectedThread.id];return n;});}
                                          else{setPinnedMessages(prev=>({...prev,[selectedThread.id]:{text:msg.text,idx:i}}));}
                                          setMsgMenuOpen(null);
                                        }}
                                        style={{ padding:"11px 16px", fontSize:13, cursor:"pointer", color:C.navy, display:"flex", alignItems:"center", gap:8 }}
                                        onMouseEnter={e=>e.currentTarget.style.background="#F7FAFC"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                                        📌 {alreadyPinned?"Unpin message":"Pin message"}
                                      </div>
                                      <div style={{ height:1, background:C.border }} />
                                      <div
                                        onClick={()=>{navigator.clipboard.writeText(msg.text).catch(()=>{});setMsgMenuOpen(null);}}
                                        style={{ padding:"11px 16px", fontSize:13, cursor:"pointer", color:C.navy, display:"flex", alignItems:"center", gap:8 }}
                                        onMouseEnter={e=>e.currentTarget.style.background="#F7FAFC"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                                        📋 Copy text
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )}
                              {/* Bubble */}
                              <div style={{
                                background: isHighlighted?"#FEF3C7":isPractice?"#D9FDD3":C.white,
                                color: C.navy,
                                borderRadius: isPractice?"12px 2px 12px 12px":"2px 12px 12px 12px",
                                padding:"8px 12px 6px",
                                fontSize:13,
                                lineHeight:1.45,
                                boxShadow:"0 1px 2px rgba(0,0,0,.1)",
                                whiteSpace:"pre-wrap",
                                transition:"background .4s",
                                wordBreak:"break-word"
                              }}>
                                {isPractice&&<div style={{ fontSize:9.5, color:"#25D366", fontWeight:700, marginBottom:3, textTransform:"uppercase", letterSpacing:.8 }}>Bright Eyes · Iryss AI</div>}
                                {msg.text}
                                <div style={{ fontSize:10, color:"#667781", textAlign:"right", marginTop:3, display:"flex", alignItems:"center", justifyContent:"flex-end", gap:3 }}>
                                  <span>{msg.time}</span>
                                  {isPractice&&<span style={{ color:"#53BDEB", fontSize:13, lineHeight:1 }}>✓✓</span>}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                        return acc;
                      }, [])}
                      <div ref={msgEndRef} />
                    </div>

                    {/* Reply input */}
                    <div style={{ padding:"10px 14px", borderTop:`1px solid ${C.border}`, display:"flex", gap:8, alignItems:"flex-end", flexShrink:0, background:"#F0F2F5" }}>
                      <textarea
                        ref={textareaRef}
                        value={sendMsg}
                        onChange={e=>{setSendMsg(e.target.value);const t=e.target;t.style.height="auto";t.style.height=Math.min(t.scrollHeight,96)+"px";}}
                        onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();sendInboxReply();}}}
                        placeholder="Type a message"
                        rows={1}
                        style={{ flex:1, border:"none", borderRadius:22, padding:"10px 16px", fontSize:13, fontFamily:F, outline:"none", background:C.white, resize:"none", lineHeight:1.45, maxHeight:96, overflowY:"auto", boxShadow:"0 1px 3px rgba(0,0,0,.08)", color:C.navy }}
                      />
                      <button
                        onClick={sendInboxReply}
                        style={{ background:sendMsg.trim()?"#25D366":"#C5E8CE", color:"#fff", border:"none", borderRadius:"50%", width:42, height:42, cursor:sendMsg.trim()?"pointer":"default", display:"flex", alignItems:"center", justifyContent:"center", fontSize:17, flexShrink:0, transition:"background .15s", boxShadow:sendMsg.trim()?"0 2px 8px rgba(37,211,102,.4)":"none" }}>➤</button>
                    </div>
                  </div>
                ):(
                  /* Empty state */
                  <div style={{ background:C.white, borderRadius:16, border:`1px solid ${C.border}`, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:14 }}>
                    <img src="/iryss-logo.svg" alt="Iryss" style={{ height:52, opacity:0.15 }} />
                    <div style={{ color:C.slateLight, fontSize:14, fontWeight:500 }}>Select a conversation to start messaging</div>
                  </div>
                )}
              </div>
              </div>
            );
          })()}

          {/* ═══ REVENUE ═══ */}
          {nav==="revenue"&&(
            <div style={{ animation:"fadeInUp .4s ease-out" }}>
              <div style={{ marginBottom:28 }}>
                <h1 style={{ fontSize:26, fontWeight:800, color:C.text, letterSpacing:-0.7, margin:0, marginBottom:6 }}>Revenue</h1>
                <p style={{ fontSize:14, color:C.slate, margin:0, fontWeight:500 }}>Track and optimize revenue opportunities</p>
              </div>
              {/* Tab bar */}
              <div style={{ display:"flex", gap:4, marginBottom:24, background:C.bg, borderRadius:12, padding:4, width:"fit-content", border:`1px solid ${C.border}` }}>
                {[["overview","Overview"],["lens","Lens Plans"]].map(([id,label])=>(
                  <button key={id} onClick={()=>setRevenueTab(id)} style={{ padding:"8px 20px", borderRadius:9, border:"none", fontFamily:F, fontWeight:600, fontSize:13, cursor:"pointer", transition:"all .15s",
                    background:revenueTab===id?C.card:"transparent", color:revenueTab===id?C.navy:C.slate,
                    boxShadow:revenueTab===id?"0 1px 4px rgba(0,0,0,.08)":"none" }}>{label}</button>
                ))}
              </div>

              {revenueTab==="lens"&&(()=>{
                const maxLensRev = Math.max(...lensPatients.map(p=>p.revenue), 1);
                return (
                  <div>
                    {/* Uplift banner */}
                    <div style={{ background:`linear-gradient(135deg,${C.teal} 0%,${C.tealLt} 100%)`, borderRadius:16, padding:"18px 24px", marginBottom:22, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                      <div>
                        <div style={{ fontWeight:800, fontSize:16, color:"#fff", letterSpacing:-0.4 }}>👁 Contact Lens Plan Opportunity</div>
                        <div style={{ fontSize:13, color:"rgba(255,255,255,.75)", marginTop:4 }}>
                          {lensPatients.length} patients eligible · upgrade each to a monthly plan and recover an estimated
                          <span style={{ fontWeight:800, color:"#fff" }}> £{lensUpliftTotal.toLocaleString()}</span> annual uplift
                        </div>
                      </div>
                      <div style={{ fontSize:32, fontWeight:900, color:"#fff", letterSpacing:-1 }}>£{lensUpliftTotal.toLocaleString()}</div>
                    </div>

                    {/* KPI row */}
                    <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16, marginBottom:22 }}>
                      <SC label="Eligible patients"  value={lensPatients.length}                                    accent={`linear-gradient(90deg,${C.teal},${C.tealLt})`} />
                      <SC label="Nudges sent"        value={Object.keys(planSent).length}                           accent={`linear-gradient(90deg,${C.green},#34D399)`} />
                      <SC label="Potential uplift"   value={`£${lensUpliftTotal.toLocaleString()}`}                 accent={`linear-gradient(90deg,${C.amber},#EAB308)`} />
                      <SC label="Avg uplift / pt"    value={lensPatients.length>0?`£${Math.round(lensUpliftTotal/lensPatients.length)}`:"—"} accent={`linear-gradient(90deg,#8B5CF6,#A78BFA)`} />
                    </div>

                    {/* Table */}
                    <div style={{ background:C.card, borderRadius:16, padding:22, border:`1px solid ${C.border}`, boxShadow:C.cardShadow }}>
                      <div style={{ fontWeight:700, fontSize:15, marginBottom:16, letterSpacing:-0.3, color:C.text }}>Contact Lens Patients — Plan Eligibility</div>
                      {lensPatients.length===0
                        ? <div style={{ color:C.slate, fontSize:13 }}>No contact lens patients found in current data.</div>
                        : lensPatients.map((p,i)=>{
                            const uplift = Math.round(p.revenue*0.2);
                            const barPct = Math.round((p.revenue/maxLensRev)*100);
                            return (
                              <div key={p.id} style={{ display:"flex", alignItems:"center", gap:14, padding:"12px 0", borderBottom:i<lensPatients.length-1?`1px solid ${C.border}`:"none" }}>
                                <Avatar initials={p.initials} bg={C.teal} size={36} />
                                <div style={{ flex:1, minWidth:0 }}>
                                  <div style={{ fontWeight:600, fontSize:13, color:C.navy }}>{p.name}</div>
                                  <div style={{ fontSize:11, color:C.slate, marginTop:2 }}>{p.product} · {p.lastVisit}</div>
                                  <div style={{ height:6, background:C.border, borderRadius:3, marginTop:6, overflow:"hidden", maxWidth:200 }}>
                                    <div style={{ width:`${barPct}%`, height:"100%", background:C.teal, borderRadius:3 }} />
                                  </div>
                                </div>
                                <div style={{ textAlign:"right", flexShrink:0, marginRight:8 }}>
                                  <div style={{ fontSize:12, color:C.slate }}>Current spend</div>
                                  <div style={{ fontSize:15, fontWeight:800, color:C.navy }}>£{p.revenue}</div>
                                  <div style={{ fontSize:11, color:C.green, fontWeight:600 }}>+£{uplift}/yr plan</div>
                                </div>
                                {planSent[p.id]
                                  ? <span style={{ fontSize:12, color:C.green, fontWeight:600, minWidth:80, textAlign:"center" }}>Sent ✓</span>
                                  : <button onClick={()=>{
                                      const msg=`Hi ${p.name.split(" ")[0]}, it's Bright Eyes Opticians 👋 We'd love to help you get the most from your contact lenses. Did you know our monthly lens plan could save you money and make re-orders effortless? Reply YES and we'll get the details over to you!`;
                                      openSendWA({...p, waMsg:msg});
                                      setPlanSent(s=>({...s,[p.id]:true}));
                                    }} style={{ background:`linear-gradient(135deg,${C.teal},${C.tealLt})`, color:"#fff", border:"none", borderRadius:9, padding:"7px 14px", fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:F, boxShadow:"0 2px 8px rgba(8,145,178,.3)", minWidth:80 }}>Suggest Plan</button>
                                }
                              </div>
                            );
                          })
                      }
                    </div>
                  </div>
                );
              })()}

              {revenueTab==="overview"&&<div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16, marginBottom:26 }}>
                <SC label="Revenue walking out the door" value={`£${atRiskRevenue.toLocaleString()}`}             accent={C.red}   sparkColor={C.red}   spark={[1800,2100,2300,2500,2400,2700,2900,2800,3100,3300,3200,3500,3700,3600,3900,4100,4000,4200,4400,4300,4500,4700,4600,4800,5000,4900,5100,5000,atRiskRevenue*0.99,atRiskRevenue]}  onDrill={()=>setDrill("rev-risk")}      trend="8%" trendUp={false} />
                <SC label="Recovered this month"        value={`£${recoveredRev.toLocaleString()}`} sub={`${recovered.length} patients rescued`} accent={C.green} sparkColor={C.green} spark={[200,400,600,900,1100,1400,1700,2000,2300,2500,2800,3100,3400,3700,4000,4300,4600,4900,5200,5400,5700,6000,6300,6600,6800,7100,7300,7500,recoveredRev*0.99,recoveredRev]} onDrill={()=>setDrill("rev-recovered")} trend="12%" trendUp={true} />
                <SC label="Recovered YTD"               value="£8,400"                              sub="Since April 2025"  accent={C.teal}  sparkColor={C.teal}  spark={[500,900,1400,1800,2200,2700,3100,3500,3900,4300,4700,5100,5500,5800,6100,6400,6700,6900,7100,7300,7500,7700,7900,8000,8100,8200,8300,8350,8380,8400]} />
                <SC label="ROI on Iryss"                value="7.5×"                                sub="You pay £220, save £1,650"  accent={C.purple} sparkColor={C.purple} spark={[2.1,2.4,2.7,3.0,3.3,3.6,3.9,4.2,4.5,4.8,5.0,5.2,5.4,5.6,5.8,6.0,6.2,6.4,6.6,6.8,6.9,7.0,7.1,7.2,7.3,7.35,7.4,7.45,7.48,7.5]} />
              </div>
              {(()=>{
                const totalRev   = PATIENTS.reduce((a,p)=>a+p.revenue, 0);
                const highRev    = PATIENTS.filter(p=>p.risk==="high").reduce((a,p)=>a+p.revenue, 0);
                const medRev     = PATIENTS.filter(p=>p.risk==="medium").reduce((a,p)=>a+p.revenue, 0);
                const lowRev     = PATIENTS.filter(p=>p.risk==="low").reduce((a,p)=>a+p.revenue, 0);
                const maxRev     = Math.max(...PATIENTS.map(p=>p.revenue));
                const sortedPts  = [...PATIENTS].sort((a,b)=>b.revenue-a.revenue);
                const topOppty   = [...PATIENTS].filter(p=>p.risk==="high").sort((a,b)=>b.revenue-a.revenue)[0];
                return (
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:18 }}>
                    {/* Left — revenue table */}
                    <div style={{ background:C.card, borderRadius:16, padding:22, border:`1px solid ${C.border}`, boxShadow:C.cardShadow }}>
                      <div style={{ fontWeight:700, fontSize:15, marginBottom:16, letterSpacing:-0.3, color:C.text }}>Revenue by patient</div>
                      {PATIENTS.map((p,i)=>(
                        <div key={p.id} style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 0", borderBottom:i<PATIENTS.length-1?`1px solid ${C.border}`:"none" }}>
                          <Avatar initials={p.initials} bg={p.risk==="high"?C.red:p.risk==="medium"?C.amber:C.green} size={30} />
                          <div style={{ flex:1 }}>
                            <div style={{ fontSize:13, fontWeight:600 }}>{p.name}</div>
                            <div style={{ fontSize:11, color:C.slate }}>{p.product}</div>
                          </div>
                          <div style={{ textAlign:"right" }}>
                            <div style={{ fontSize:13, fontWeight:700, color:p.risk==="high"?C.red:p.risk==="medium"?C.amber:C.navy }}>£{p.revenue}</div>
                            <Chip color={riskFg[p.risk]}>{riskLabel[p.risk]}</Chip>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Right — three stacked cards */}
                    <div style={{ display:"flex", flexDirection:"column", gap:18 }}>

                      {/* 1 — Revenue bar chart */}
                      <div style={{ background:C.card, borderRadius:16, padding:22, border:`1px solid ${C.border}`, boxShadow:C.cardShadow }}>
                        <div style={{ fontWeight:700, fontSize:15, marginBottom:16, letterSpacing:-0.3, color:C.text }}>Revenue by Patient</div>
                        {sortedPts.map(p=>{
                          const barColor = p.risk==="high"?C.red:p.risk==="medium"?C.amber:C.green;
                          const barPct   = Math.round((p.revenue/maxRev)*100);
                          return (
                            <div key={p.id} style={{ marginBottom:10 }}>
                              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                                <span style={{ fontSize:12, fontWeight:600, color:C.navy }}>{p.name}</span>
                                <span style={{ fontSize:12, fontWeight:700, color:barColor }}>£{p.revenue}</span>
                              </div>
                              <div style={{ height:9, background:C.border, borderRadius:5, overflow:"hidden" }}>
                                <div style={{ width:`${barPct}%`, height:"100%", background:barColor, borderRadius:5, transition:"width .5s ease" }} />
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* 2 — Revenue at risk summary */}
                      <div style={{ background:C.card, borderRadius:16, padding:22, border:`1px solid ${C.border}`, boxShadow:C.cardShadow }}>
                        <div style={{ fontWeight:700, fontSize:15, marginBottom:16, letterSpacing:-0.3, color:C.text }}>Revenue at Risk Summary</div>
                        {[
                          { label:"High risk",   value:highRev, color:C.red,   bg:"rgba(239,68,68,.08)"   },
                          { label:"Medium risk", value:medRev,  color:C.amber, bg:"rgba(245,158,11,.08)"  },
                          { label:"Low risk",    value:lowRev,  color:C.green, bg:"rgba(16,185,129,.08)"  },
                        ].map(row=>(
                          <div key={row.label} style={{ display:"flex", alignItems:"center", gap:12, marginBottom:12 }}>
                            <div style={{ width:10, height:10, borderRadius:"50%", background:row.color, flexShrink:0 }} />
                            <div style={{ flex:1 }}>
                              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                                <span style={{ fontSize:13, fontWeight:600, color:C.navy }}>{row.label}</span>
                                <span style={{ fontSize:13, fontWeight:800, color:row.color }}>£{row.value.toLocaleString()}</span>
                              </div>
                              <div style={{ height:7, background:C.border, borderRadius:4, overflow:"hidden" }}>
                                <div style={{ width:`${Math.round((row.value/totalRev)*100)}%`, height:"100%", background:row.color, borderRadius:4 }} />
                              </div>
                              <div style={{ fontSize:10, color:C.slateLight, marginTop:3 }}>{Math.round((row.value/totalRev)*100)}% of total £{totalRev.toLocaleString()}</div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* 3 — Top opportunity */}
                      {topOppty&&(
                        <div style={{ background:`linear-gradient(135deg,${C.teal} 0%,${C.tealLt} 100%)`, borderRadius:16, padding:22, boxShadow:"0 4px 20px rgba(8,145,178,.15)" }}>
                          <div style={{ fontWeight:700, fontSize:15, color:"#fff", marginBottom:16, letterSpacing:-0.3 }}>⚡ Biggest Recovery Opportunity</div>
                          <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:16 }}>
                            <Avatar initials={topOppty.initials} bg={C.red} size={46} />
                            <div style={{ flex:1 }}>
                              <div style={{ fontWeight:800, fontSize:16, color:"#fff", letterSpacing:-0.4 }}>{topOppty.name}</div>
                              <div style={{ fontSize:12, color:"rgba(255,255,255,.6)", marginTop:3 }}>{topOppty.product}</div>
                              <div style={{ display:"flex", gap:8, marginTop:6, alignItems:"center" }}>
                                <span style={{ fontSize:11, color:"#FCA5A5", fontWeight:700, background:"rgba(239,68,68,.2)", padding:"2px 9px", borderRadius:20 }}>HIGH RISK</span>
                                <span style={{ fontSize:11, color:"rgba(255,255,255,.4)" }}>Score: {topOppty.riskScore}/100</span>
                              </div>
                            </div>
                            <div style={{ textAlign:"right", flexShrink:0 }}>
                              <div style={{ fontSize:28, fontWeight:800, color:"#fff", letterSpacing:-1 }}>£{topOppty.revenue}</div>
                              <div style={{ fontSize:11, color:"rgba(255,255,255,.5)", marginTop:2 }}>revenue value</div>
                            </div>
                          </div>
                          {waSent[topOppty.id]
                            ? <div style={{ textAlign:"center", fontSize:13, color:C.green, fontWeight:600 }}>✓ WhatsApp sent</div>
                            : <button onClick={()=>openSendWA(topOppty)} style={{ width:"100%", background:`linear-gradient(135deg,${C.teal},${C.tealLt})`, color:"#fff", border:"none", borderRadius:12, padding:"12px", fontWeight:700, fontSize:14, cursor:"pointer", fontFamily:F, boxShadow:"0 4px 16px rgba(8,145,178,.4)", letterSpacing:-0.2 }}>
                                Send WhatsApp Now →
                              </button>
                          }
                        </div>
                      )}
                    </div>
                  </div>
                );
              })()}
            </div>}
            </div>
          )}

          {/* ═══ REVIEWS ═══ */}
          {nav==="reviews"&&(
            <div style={{ animation:"fadeInUp .4s ease-out" }}>
              <div style={{ marginBottom:28 }}>
                <h1 style={{ fontSize:26, fontWeight:800, color:C.text, letterSpacing:-0.7, margin:0, marginBottom:6 }}>Reviews</h1>
                <p style={{ fontSize:14, color:C.slate, margin:0 }}>Monitor and grow your online reputation</p>
              </div>
              {/* Automation banner */}
              <div style={{ background:C.card, borderRadius:16, padding:"16px 22px", border:`1px solid ${C.border}`, boxShadow:"0 2px 8px rgba(0,0,0,.05)", marginBottom:22, display:"flex", alignItems:"center", gap:20 }}>
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:700, fontSize:14, color:C.navy, marginBottom:3, display:"flex", alignItems:"center", gap:10 }}>
                    ⭐ Review Request Automation
                    {autoReview
                      ? <span style={{ background:"rgba(16,185,129,.12)", color:C.green, fontWeight:700, fontSize:11, padding:"3px 10px", borderRadius:20, display:"flex", alignItems:"center", gap:5 }}><span style={{ width:6, height:6, borderRadius:"50%", background:C.green, display:"inline-block", boxShadow:"0 0 6px rgba(16,185,129,.6)" }} />Active</span>
                      : <span style={{ background:"rgba(100,116,139,.1)", color:C.slateLight, fontWeight:600, fontSize:11, padding:"3px 10px", borderRadius:20 }}>Off</span>
                    }
                  </div>
                  <div style={{ fontSize:12, color:C.slate }}>Iryss automatically sends a review request when a patient replies positively or books an appointment.</div>
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                  <span style={{ fontSize:13, fontWeight:600, color:C.navy, whiteSpace:"nowrap" }}>Auto-send review requests</span>
                  <div onClick={()=>setAutoReview(v=>!v)} style={{ width:44, height:24, borderRadius:12, background:autoReview?C.teal:C.border, cursor:"pointer", position:"relative", transition:"background .2s", flexShrink:0 }}>
                    <div style={{ position:"absolute", top:3, left:autoReview?22:3, width:18, height:18, borderRadius:"50%", background:"#fff", boxShadow:"0 1px 4px rgba(0,0,0,.2)", transition:"left .2s" }} />
                  </div>
                </div>
              </div>

              {/* KPI cards — 6 total */}
              <div style={{ display:"grid", gridTemplateColumns:"repeat(6,1fr)", gap:14, marginBottom:22 }}>
                <SC label="Google rating"             value="4.9 ★" sub="All time"           accent={`linear-gradient(90deg,#FBBC05,#F59E0B)`} />
                <SC label="Total reviews"             value="147"   sub="+38 this month"     accent={`linear-gradient(90deg,${C.teal},${C.tealLt})`} onDrill={()=>setDrill("all-reviews")} />
                <SC label="Via Iryss this month"      value="38"    sub="Fully automatic"    accent={`linear-gradient(90deg,${C.green},#34D399)`}  onDrill={()=>setDrill("iryss-reviews")} />
                <SC label="Requests sent this month"  value="52"    sub="73% open rate"      accent={`linear-gradient(90deg,${C.purple},#A78BFA)`} onDrill={()=>setDrill("review-requests")} />
                <SC label="Pending responses"         value={REVIEW_REQUESTS.filter(r=>r.status!=="left").length} sub="Awaiting review" accent={`linear-gradient(90deg,${C.amber},#EAB308)`} trend="3 pending" trendUp={false} />
                <SC label="Conversion rate"           value="73%"   sub="Reviews / requests" accent={`linear-gradient(90deg,${C.green},#34D399)`} trend="↑ 5%" trendUp={true} />
              </div>

              {/* Tabs */}
              <div style={{ display:"flex", gap:8, marginBottom:18 }}>
                {[{id:"reviews",label:"⭐ Recent Reviews"},{id:"requests",label:"📨 Review Requests"}].map(t=>(
                  <button key={t.id} onClick={()=>setReviewTab(t.id)} style={{ padding:"9px 20px", borderRadius:10, cursor:"pointer", fontFamily:F, fontSize:13, fontWeight:reviewTab===t.id?700:500, background:reviewTab===t.id?"rgba(8,145,178,0.08)":C.card, color:reviewTab===t.id?C.teal:C.slate, border:`1px solid ${reviewTab===t.id?"rgba(8,145,178,0.2)":C.border}`, transition:"all .15s" }}>{t.label}</button>
                ))}
              </div>

              {reviewTab==="reviews"&&(
                <div style={{ display:"grid", gridTemplateColumns:"1fr 320px", gap:18 }}>
                  <div>
                    {/* Reviews list */}
                    <div style={{ background:C.card, borderRadius:16, padding:22, border:`1px solid ${C.border}`, marginBottom:18, boxShadow:C.cardShadow }}>
                      <div style={{ fontWeight:700, fontSize:15, marginBottom:16, letterSpacing:-0.3, color:C.text }}>Recent reviews via Iryss</div>
                      {REVIEWS.map((r,i)=>(
                        <div key={i} style={{ padding:"14px 0", borderBottom:i<REVIEWS.length-1?`1px solid ${C.border}`:"none" }}>
                          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
                            <div style={{ color:"#FBBC05", fontSize:13, letterSpacing:1 }}>{"★".repeat(r.stars)}</div>
                            <div style={{ fontWeight:600, fontSize:13 }}>{r.name}</div>
                            <div style={{ fontSize:11, color:C.slateLight, marginLeft:"auto" }}>{r.days}</div>
                            {r.via&&<span style={{ fontSize:10, color:C.teal, fontWeight:600, background:C.tealPale, padding:"2px 8px", borderRadius:20 }}>via Iryss ✓</span>}
                            {reviewSent[`review-${r.name}`]
                              ? <span style={{ fontSize:10, color:C.green, fontWeight:700 }}>Request sent ✓</span>
                              : <button onClick={()=>openReviewWA(r.name,'')} style={{ background:"none", border:`1px solid ${C.border}`, borderRadius:8, padding:"4px 10px", fontSize:11, fontWeight:600, color:C.slate, cursor:"pointer", fontFamily:F }}>Send request</button>
                            }
                          </div>
                          <div style={{ fontSize:13, color:C.slate, lineHeight:1.6, fontStyle:"italic" }}>"{r.text}"</div>
                        </div>
                      ))}
                    </div>

                    {/* How it works */}
                    <div style={{ background:C.card, borderRadius:16, padding:22, border:`1px solid ${C.border}`, boxShadow:C.cardShadow }}>
                      <div style={{ fontWeight:700, fontSize:15, marginBottom:14, letterSpacing:-0.3, color:C.text }}>How it works</div>
                      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12 }}>
                        {[
                          { step:"1", title:"Appointment logged",     desc:"Patient attends. Click 'Log appointment' to start the automation." },
                          { step:"2", title:"24hr WhatsApp check-in", desc:"Iryss sends a warm message asking how their visit went." },
                          { step:"3", title:"Review link sent",       desc:"If happy, a direct link to your Google Business profile is sent." },
                        ].map(s=>(
                          <div key={s.step} style={{ background:C.cream, borderRadius:12, padding:14, border:`1px solid ${C.border}` }}>
                            <div style={{ width:30, height:30, borderRadius:"50%", background:C.teal, color:C.white, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, fontSize:13, marginBottom:8 }}>{s.step}</div>
                            <div style={{ fontWeight:700, fontSize:13, marginBottom:4 }}>{s.title}</div>
                            <div style={{ fontSize:12, color:C.slate, lineHeight:1.6 }}>{s.desc}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right column: charts */}
                  <div style={{ display:"flex", flexDirection:"column", gap:18 }}>
                    {/* Star rating breakdown */}
                    <div style={{ background:C.card, borderRadius:16, padding:22, border:`1px solid ${C.border}`, boxShadow:C.cardShadow }}>
                      <div style={{ fontWeight:700, fontSize:15, marginBottom:16, letterSpacing:-0.3, color:C.text }}>★ Rating Breakdown</div>
                      {STAR_BREAKDOWN.map(row=>(
                        <div key={row.stars} style={{ display:"flex", alignItems:"center", gap:10, marginBottom:8 }}>
                          <div style={{ fontSize:12, fontWeight:700, color:"#FBBC05", width:18, textAlign:"right", flexShrink:0 }}>{row.stars}</div>
                          <div style={{ fontSize:11, color:"#FBBC05", flexShrink:0 }}>★</div>
                          <div style={{ flex:1, height:8, background:C.border, borderRadius:4, overflow:"hidden" }}>
                            <div style={{ width:`${(row.count/147)*100}%`, height:"100%", background:`linear-gradient(90deg,#FBBC05,#F59E0B)`, borderRadius:4, transition:"width .6s" }} />
                          </div>
                          <div style={{ fontSize:11, color:C.slate, width:28, textAlign:"right", flexShrink:0 }}>{row.count}</div>
                        </div>
                      ))}
                    </div>

                    {/* Top review themes */}
                    <div style={{ background:C.card, borderRadius:16, padding:22, border:`1px solid ${C.border}`, boxShadow:C.cardShadow }}>
                      <div style={{ fontWeight:700, fontSize:15, marginBottom:4, letterSpacing:-0.3, color:C.text }}>💬 Top Review Themes</div>
                      <div style={{ fontSize:12, color:C.slate, marginBottom:16 }}>What patients mention most</div>
                      {REVIEW_THEMES.map((t,i)=>(
                        <div key={i} style={{ marginBottom:14 }}>
                          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
                            <span style={{ fontSize:13, fontWeight:600, color:C.navy }}>{t.label}</span>
                            <span style={{ fontSize:12, fontWeight:700, color:C.teal }}>{t.pct}%</span>
                          </div>
                          <div style={{ height:8, background:C.border, borderRadius:4, overflow:"hidden" }}>
                            <div style={{ width:`${t.pct}%`, height:"100%", background:`linear-gradient(90deg,${C.teal},${C.tealLt})`, borderRadius:4, transition:"width .6s" }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {reviewTab==="requests"&&(
                <div style={{ background:C.white, borderRadius:16, border:`1px solid ${C.border}`, overflow:"hidden", boxShadow:C.cardShadow }}>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 100px 180px 160px 140px", gap:12, padding:"12px 20px", borderBottom:`1px solid ${C.border}`, background:"#FAFBFC" }}>
                    {["Patient","Date Sent","Trigger","Status","Action"].map(h=>(
                      <div key={h} style={{ fontSize:10, fontWeight:700, color:C.slateLight, textTransform:"uppercase", letterSpacing:1 }}>{h}</div>
                    ))}
                  </div>
                  {REVIEW_REQUESTS.map((req,i)=>{
                    const key = `review-${req.patient}`;
                    const resent = reviewSent[key];
                    return (
                      <div key={i} style={{ display:"grid", gridTemplateColumns:"1fr 100px 180px 160px 140px", gap:12, padding:"14px 20px", borderBottom:i<REVIEW_REQUESTS.length-1?`1px solid ${C.border}`:"none", alignItems:"center", background:i%2===0?C.white:"#FAFBFD", transition:"background .12s" }}
                        onMouseEnter={e=>e.currentTarget.style.background="rgba(8,145,178,.04)"}
                        onMouseLeave={e=>e.currentTarget.style.background=i%2===0?C.white:"#FAFBFD"}>
                        <div style={{ display:"flex", alignItems:"center", gap:9 }}>
                          <Avatar initials={req.patient.split(' ').map(w=>w[0]).join('').slice(0,2)} bg={getColor(i)} size={30} />
                          <span style={{ fontWeight:600, fontSize:13, color:C.navy }}>{req.patient}</span>
                        </div>
                        <div style={{ fontSize:12, color:C.slate }}>{req.date}</div>
                        <div style={{ fontSize:12, color:C.navy }}>{req.trigger}</div>
                        <div>
                          {req.status==="left"
                            ? <span style={{ fontSize:11, fontWeight:700, color:C.green,  background:"rgba(16,185,129,.1)", padding:"3px 10px", borderRadius:20 }}>Review left ✓</span>
                            : req.status==="pending"
                            ? <span style={{ fontSize:11, fontWeight:700, color:C.amber,  background:"rgba(245,158,11,.1)", padding:"3px 10px", borderRadius:20 }}>Pending</span>
                            : <span style={{ fontSize:11, fontWeight:600, color:C.slateLight, background:"rgba(100,116,139,.1)", padding:"3px 10px", borderRadius:20 }}>No response</span>
                          }
                        </div>
                        <div>
                          {req.status==="left"
                            ? <span style={{ fontSize:12, color:C.slateLight }}>—</span>
                            : resent
                            ? <span style={{ fontSize:12, color:C.green, fontWeight:600 }}>Resent ✓</span>
                            : <button onClick={()=>openReviewWA(req.patient, req.phone)} style={{ background:`linear-gradient(135deg,${C.teal},${C.tealLt})`, color:"#fff", border:"none", borderRadius:8, padding:"6px 12px", fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:F, boxShadow:"0 2px 8px rgba(8,145,178,.25)" }}>Resend</button>
                          }
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ═══ APPOINTMENTS ═══ */}
          {nav==="appointments"&&(
            <div>
              {/* Automation banner */}
              <div style={{ background:C.white, borderRadius:16, padding:"16px 22px", border:`1px solid ${C.border}`, boxShadow:"0 2px 8px rgba(0,0,0,.05)", marginBottom:22, display:"flex", alignItems:"center", gap:24 }}>
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:700, fontSize:14, color:C.navy, marginBottom:3 }}>⚡ Appointment Confirmation Automation</div>
                  <div style={{ fontSize:12, color:C.slate }}>Iryss automatically sends confirmation reminders via WhatsApp to reduce no-shows.</div>
                </div>
                <div style={{ display:"flex", gap:20, alignItems:"center" }}>
                  {[{label:"Auto-send 48hr reminders", active:reminder48Active, toggle:()=>setReminder48Active(v=>!v)},{label:"Auto-send 2hr reminders", active:reminder2hActive, toggle:()=>setReminder2hActive(v=>!v)}].map(({label,active,toggle})=>(
                    <div key={label} style={{ display:"flex", alignItems:"center", gap:8 }}>
                      <span style={{ fontSize:12, color:C.slate, fontWeight:500, whiteSpace:"nowrap" }}>{label}</span>
                      {active
                        ?<span style={{ fontSize:11, fontWeight:700, color:C.green, background:"rgba(16,185,129,.12)", padding:"3px 10px", borderRadius:20 }}>Active</span>
                        :<span style={{ fontSize:11, fontWeight:600, color:C.slateLight, background:"rgba(100,116,139,.08)", padding:"3px 10px", borderRadius:20 }}>Off</span>
                      }
                      <div onClick={toggle} style={{ width:40, height:22, borderRadius:11, background:active?C.teal:C.border, cursor:"pointer", position:"relative", transition:"background .2s", flexShrink:0 }}>
                        <div style={{ position:"absolute", top:3, left:active?20:3, width:16, height:16, borderRadius:"50%", background:"#fff", boxShadow:"0 1px 3px rgba(0,0,0,.2)", transition:"left .2s" }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* KPI cards */}
              <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:14, marginBottom:22 }}>
                <SC label="Today's appointments" value={APPOINTMENTS.length}                         accent={`linear-gradient(90deg,${C.teal},${C.tealLt})`}   onDrill={()=>setDrill("all-appts")} />
                <SC label="Confirmed"            value={APPOINTMENTS.filter(a=>a.confirmed).length}  accent={`linear-gradient(90deg,${C.green},#34D399)`}      onDrill={()=>setDrill("confirmed-appts")} />
                <SC label="Booked via Iryss"     value={APPOINTMENTS.filter(a=>a.viaIryss).length}   accent={`linear-gradient(90deg,${C.purple},#A78BFA)`}     onDrill={()=>setDrill("iryss-appts")} sub="WhatsApp bookings" />
                <SC label="Confirmations sent"   value={Object.keys(confirmSent).length}             accent={`linear-gradient(90deg,${C.amber},#EAB308)`}      sub="Today" />
                <SC label="No-show risk"         value={noShowRisk.length}                           accent={`linear-gradient(90deg,${C.red},#F97316)`}        onDrill={()=>setDrill("no-show-risk")} trend={noShowRisk.length>0?"Unconfirmed":null} trendUp={false} />
              </div>

              {/* Today's schedule table */}
              <div style={{ background:C.white, borderRadius:16, border:`1px solid ${C.border}`, overflow:"hidden", boxShadow:C.cardShadow, marginBottom:22 }}>
                <div style={{ padding:"14px 20px", borderBottom:`1px solid ${C.border}`, fontWeight:700, fontSize:15, letterSpacing:-0.3 }}>Today's Schedule</div>
                <div style={{ display:"grid", gridTemplateColumns:"80px 1fr 160px 140px 160px 160px", gap:12, padding:"12px 20px", borderBottom:`1px solid ${C.border}`, background:"#FAFBFC" }}>
                  {["Time","Patient","Type","Optician","Confirmation Status","Action"].map(h=>(
                    <div key={h} style={{ fontSize:10, fontWeight:700, color:C.slateLight, textTransform:"uppercase", letterSpacing:1 }}>{h}</div>
                  ))}
                </div>
                {APPOINTMENTS.map((a,i)=>{
                  const sent = confirmSent[`appt-${i}`];
                  const confStatus = a.confirmed ? "confirmed" : sent ? "reminder-sent" : "not-contacted";
                  return (
                    <div key={i} style={{ display:"grid", gridTemplateColumns:"80px 1fr 160px 140px 160px 160px", gap:12, padding:"15px 20px", borderBottom:i<APPOINTMENTS.length-1?`1px solid ${C.border}`:"none", alignItems:"center", background:i%2===0?C.white:"#FAFBFD", transition:"background .12s" }}
                      onMouseEnter={e=>e.currentTarget.style.background="rgba(8,145,178,.04)"}
                      onMouseLeave={e=>e.currentTarget.style.background=i%2===0?C.white:"#FAFBFD"}>
                      <div style={{ fontWeight:700, fontSize:14 }}>{a.time}</div>
                      <div>
                        <div style={{ fontWeight:600, fontSize:13 }}>{a.patient}</div>
                        {a.viaIryss&&<span style={{ fontSize:10, color:C.teal, fontWeight:600, background:C.tealPale, padding:"1px 7px", borderRadius:20 }}>via Iryss</span>}
                      </div>
                      <div style={{ fontSize:13, color:C.slate }}>{a.type}</div>
                      <div style={{ fontSize:13 }}>{a.optician}</div>
                      <span style={{ fontSize:11, fontWeight:700, padding:"4px 10px", borderRadius:20, display:"inline-block",
                        background:confStatus==="confirmed"?"rgba(16,185,129,.1)":confStatus==="reminder-sent"?"rgba(245,158,11,.1)":"rgba(100,116,139,.08)",
                        color:confStatus==="confirmed"?C.green:confStatus==="reminder-sent"?C.amber:C.slateLight }}>
                        {confStatus==="confirmed"?"Confirmed ✓":confStatus==="reminder-sent"?"Reminder Sent":"Not Contacted"}
                      </span>
                      <div>
                        {a.confirmed||sent
                          ? <span style={{ fontSize:11, color:C.slateLight }}>—</span>
                          : <button onClick={()=>openConfirmationWA(a,i)} style={{ background:`linear-gradient(135deg,${C.teal},${C.tealLt})`, color:"#fff", border:"none", borderRadius:8, padding:"6px 13px", fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:F, boxShadow:"0 2px 8px rgba(8,145,178,.25)" }}>Send Confirmation</button>
                        }
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Upcoming This Week */}
              <div style={{ background:C.white, borderRadius:16, border:`1px solid ${C.border}`, overflow:"hidden", boxShadow:C.cardShadow, marginBottom:22 }}>
                <div style={{ padding:"14px 20px", borderBottom:`1px solid ${C.border}`, fontWeight:700, fontSize:15, letterSpacing:-0.3 }}>📅 Upcoming This Week</div>
                {UPCOMING_WEEK.map((dayGroup,di)=>(
                  <div key={di}>
                    <div style={{ padding:"10px 20px", background:"#F7FAFC", borderBottom:`1px solid ${C.border}`, display:"flex", alignItems:"center", gap:12 }}>
                      <div style={{ fontWeight:700, fontSize:13, color:C.navy }}>{dayGroup.day}</div>
                      <div style={{ fontSize:12, color:C.slateLight }}>{dayGroup.date}</div>
                      <span style={{ marginLeft:"auto", fontSize:11, color:C.slate }}>{dayGroup.appts.length} appointments · £{dayGroup.appts.reduce((a,x)=>a+x.revenue,0)} est. revenue</span>
                    </div>
                    {dayGroup.appts.map((a,i)=>(
                      <div key={i} style={{ display:"flex", alignItems:"center", gap:16, padding:"12px 20px", borderBottom:i<dayGroup.appts.length-1?`1px solid ${C.border}`:"none", background:i%2===0?C.white:"#FAFBFD" }}>
                        <div style={{ fontWeight:700, fontSize:13, width:46, flexShrink:0 }}>{a.time}</div>
                        <div style={{ flex:1 }}>
                          <div style={{ fontWeight:600, fontSize:13 }}>{a.patient}</div>
                          <div style={{ fontSize:11, color:C.slate }}>{a.type} · {a.optician}</div>
                        </div>
                        <span style={{ fontSize:11, fontWeight:700, padding:"3px 9px", borderRadius:20, background:a.confirmed?"rgba(16,185,129,.1)":"rgba(245,158,11,.1)", color:a.confirmed?C.green:C.amber }}>
                          {a.confirmed?"Confirmed ✓":"Unconfirmed"}
                        </span>
                        <span style={{ fontSize:12, fontWeight:600, color:C.navy }}>£{a.revenue}</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              {/* Revenue protected stat */}
              <div style={{ background:`linear-gradient(135deg,${C.teal} 0%,${C.tealLt} 100%)`, borderRadius:16, padding:"18px 24px", marginBottom:18, display:"flex", alignItems:"center", justifyContent:"space-between", boxShadow:"0 4px 20px rgba(8,145,178,.15)" }}>
                <div>
                  <div style={{ fontSize:11, color:"rgba(255,255,255,.4)", textTransform:"uppercase", letterSpacing:1.5, marginBottom:6 }}>This month</div>
                  <div style={{ fontSize:15, fontWeight:600, color:"#fff" }}>Estimated revenue protected by confirmations: <span style={{ color:"#fff", fontWeight:800 }}>£{APPOINTMENTS.filter(a=>a.confirmed).reduce((s,a)=>s+a.revenue,0).toLocaleString()}</span></div>
                </div>
                <button style={{ background:`linear-gradient(135deg,${C.teal},${C.tealLt})`, color:"#fff", border:"none", borderRadius:10, padding:"11px 22px", fontWeight:700, fontSize:14, cursor:"pointer", fontFamily:F, flexShrink:0, boxShadow:"0 4px 14px rgba(8,145,178,.4)" }}>+ Log appointment</button>
              </div>
            </div>
          )}

          {/* ═══ AI RECEPTIONIST ═══ */}
          {nav==="receptionist"&&(
            <div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:14, marginBottom:22 }}>
                <SC label="Conversations handled" value="142" sub="This month"     accent={`linear-gradient(90deg,${C.teal},${C.tealLt})`} onDrill={()=>setDrill("conversations")} />
                <SC label="Avg response time"     value="<2s" sub="24/7 available" accent={`linear-gradient(90deg,${C.green},#34D399)`} />
                <SC label="Escalated to human"    value="3"   sub="This month"     accent={`linear-gradient(90deg,${C.amber},#EAB308)`} onDrill={()=>setDrill("escalated")} />
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:18 }}>
                <div style={{ background:C.navy, borderRadius:16, overflow:"hidden", boxShadow:"0 4px 20px rgba(8,15,30,.15)" }}>
                  <div style={{ background:"rgba(255,255,255,.04)", padding:"10px 16px", display:"flex", alignItems:"center", gap:8, borderBottom:"1px solid rgba(255,255,255,.05)" }}>
                    <div style={{ width:10, height:10, borderRadius:"50%", background:"#EF4444" }} />
                    <div style={{ width:10, height:10, borderRadius:"50%", background:"#F59E0B" }} />
                    <div style={{ width:10, height:10, borderRadius:"50%", background:"#10B981" }} />
                    <span style={{ fontSize:11, color:"rgba(255,255,255,.35)", marginLeft:6 }}>AI Receptionist · Live Conversation</span>
                    <span style={{ marginLeft:"auto", fontSize:10, color:"#6EE7B7", fontWeight:600, display:"flex", alignItems:"center", gap:4 }}>
                      <span style={{ width:6, height:6, borderRadius:"50%", background:"#6EE7B7", display:"inline-block", boxShadow:"0 0 6px rgba(110,231,183,.7)" }} />
                      Live
                    </span>
                  </div>
                  <div style={{ padding:20, display:"flex", flexDirection:"column", gap:10 }}>
                    {[
                      { from:"patient",  text:"Hi, do you do multifocal contact lenses? I've been struggling with reading glasses on top of my monthlies" },
                      { from:"practice", text:"Hi James! Yes we do 😊 Multifocal contact lenses are brilliant for exactly that situation. We fit daily and monthly multifocals including Acuvue Oasys and CooperVision Biofinity Multifocal.\n\nIt'd be worth a fitting appointment so we can find the right lens. Shall I check availability?" },
                      { from:"patient",  text:"Yes please! What's the earliest?" },
                      { from:"practice", text:"I have Thursday 20th at 11am or Friday 21st at 3:30pm — which suits you better? 😊" },
                    ].map((msg,i)=>(
                      <div key={i} style={{ display:"flex", justifyContent:msg.from==="practice"?"flex-end":"flex-start" }}>
                        <div style={{ maxWidth:"75%", padding:"10px 14px", borderRadius:msg.from==="practice"?"14px 14px 4px 14px":"14px 14px 14px 4px", background:msg.from==="practice"?"rgba(8,145,178,.2)":"rgba(255,255,255,.06)", border:`1px solid ${msg.from==="practice"?"rgba(8,145,178,.25)":"rgba(255,255,255,.07)"}`, fontSize:12, color:"rgba(255,255,255,.82)", lineHeight:1.55, whiteSpace:"pre-wrap" }}>
                          {msg.from==="practice"&&<div style={{ fontSize:9, color:C.tealLt, fontWeight:700, marginBottom:4, textTransform:"uppercase", letterSpacing:1 }}>Iryss AI</div>}
                          {msg.text}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
                  <div style={{ background:C.white, borderRadius:16, padding:20, border:`1px solid ${C.border}`, boxShadow:C.cardShadow }}>
                    <div style={{ fontWeight:700, fontSize:14, marginBottom:12, letterSpacing:-0.3 }}>🎓 What the AI knows</div>
                    {["Glasses · frames · varifocals · progressives","Contact lenses (daily, monthly, multifocal, toric)","Eye conditions — dry eye, myopia, presbyopia","Appointment booking & availability","NHS vs private options & pricing","Children's eye health & myopia management","Opening hours, location, parking"].map((item,i,arr)=>(
                      <div key={i} style={{ display:"flex", gap:8, alignItems:"center", padding:"6px 0", borderBottom:i<arr.length-1?`1px solid ${C.border}`:"none" }}>
                        <span style={{ color:C.green, fontSize:13, fontWeight:700 }}>✓</span>
                        <span style={{ fontSize:13, color:C.slate }}>{item}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ background:"rgba(239,68,68,.04)", borderRadius:16, padding:20, border:"1px solid rgba(239,68,68,.1)" }}>
                    <div style={{ fontWeight:700, fontSize:14, marginBottom:8, letterSpacing:-0.3 }}>🚨 Escalation triggers</div>
                    <div style={{ fontSize:13, color:C.slate, lineHeight:1.7 }}>When a patient mentions <strong>sudden vision loss</strong>, <strong>eye pain</strong>, <strong>flashes or floaters</strong> — Iryss immediately alerts your team and pauses the AI response.</div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {/* ═══ SETTINGS ═══ */}
          {nav==="settings"&&(
            <div style={{ maxWidth:780, animation:"fadeInUp .4s ease-out" }}>
              <div style={{ marginBottom:28 }}>
                <h1 style={{ fontSize:26, fontWeight:800, color:C.text, letterSpacing:-0.7, margin:0, marginBottom:6 }}>Settings</h1>
                <p style={{ fontSize:14, color:C.slate, margin:0, fontWeight:500 }}>Manage your practice settings and preferences</p>
              </div>

              {/* ── Practice Details ── */}
              <div style={{ background:C.card, borderRadius:16, border:`1px solid ${C.border}`, padding:"24px 28px", marginBottom:22, boxShadow:C.cardShadow }}>
                <div style={{ fontWeight:700, fontSize:16, color:C.text, marginBottom:4, letterSpacing:-0.4 }}>🏥 Practice Details</div>
                <div style={{ fontSize:13, color:C.slate, marginBottom:20 }}>Your practice information used across all Iryss automations.</div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:20 }}>
                  {[
                    { label:"Practice name",             key:"name",    placeholder:"Bright Eyes Opticians" },
                    { label:"Email address",             key:"email",   placeholder:"you@yourpractice.com"  },
                    { label:"WhatsApp number",           key:"whatsapp",placeholder:"+447827322027"         },
                    { label:"Google Business profile",   key:"google",  placeholder:"https://g.page/..."   },
                  ].map(f=>(
                    <div key={f.key}>
                      <label style={{ fontSize:11, fontWeight:700, color:C.slateLight, textTransform:"uppercase", letterSpacing:1.1, display:"block", marginBottom:6 }}>{f.label}</label>
                      <input value={practiceDetails[f.key]} onChange={e=>setPracticeDetails(prev=>({...prev,[f.key]:e.target.value}))}
                        placeholder={f.placeholder}
                        style={{ width:"100%", border:`1px solid ${C.border}`, borderRadius:10, padding:"10px 14px", fontSize:13, fontFamily:F, outline:"none", boxSizing:"border-box", color:C.navy, background:C.offWhite, transition:"border .15s" }}
                        onFocus={e=>e.target.style.borderColor=C.teal} onBlur={e=>e.target.style.borderColor=C.border} />
                    </div>
                  ))}
                </div>
                <button onClick={()=>{ setSettingsSaved(true); showToast("Practice details saved ✓"); setTimeout(()=>setSettingsSaved(false),2500); }}
                  style={{ background:`linear-gradient(135deg,${C.teal},${C.tealLt})`, color:"#fff", border:"none", borderRadius:10, padding:"10px 22px", fontWeight:700, fontSize:13, cursor:"pointer", fontFamily:F, boxShadow:"0 2px 8px rgba(8,145,178,.3)", display:"flex", alignItems:"center", gap:8 }}>
                  {settingsSaved ? "✓ Saved!" : "Save Changes"}
                </button>
              </div>

              {/* ── CRM Integrations ── */}
              <div style={{ background:C.card, borderRadius:16, border:`1px solid ${C.border}`, padding:"24px 28px", marginBottom:22, boxShadow:C.cardShadow }}>
                <div style={{ fontWeight:700, fontSize:16, color:C.text, marginBottom:4, letterSpacing:-0.4 }}>🔗 CRM Integrations</div>
                <div style={{ fontSize:13, color:C.slate, marginBottom:20 }}>Connect your practice management system to sync patient data automatically. One click — no IT needed.</div>

                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                  {[
                    { name:"XEYEX",            desc:"Connected optical CRM platform"             },
                    { name:"Optisoft",         desc:"UK's most popular independent PMS"          },
                    { name:"Ocuco",            desc:"Enterprise optical management"              },
                    { name:"Optix",            desc:"Cloud-based practice management"            },
                    { name:"Blink",            desc:"Domiciliary & practice PMS"                },
                    { name:"Opticabase",       desc:"Cloud PMS for UK opticians"                },
                    { name:"EYEris",           desc:"Practice management & clinical records"    },
                    { name:"RevolutionEHR",    desc:"Cloud EHR for optometry"                   },
                    { name:"Crystal PM",       desc:"Practice management & POS"                 },
                    { name:"MaximEyes",        desc:"EHR & practice management"                 },
                    { name:"Eyefinity",        desc:"VSP's practice management platform"        },
                    { name:"CSV Import",       desc:"Upload patient data from any system"       },
                    { name:"API",              desc:"Custom integration via REST API"            },
                  ].map(crm=>{
                    const isConnected = !!connectedCRMs[crm.name];
                    return (
                    <div key={crm.name} style={{ border:`1px solid ${isConnected?"rgba(16,185,129,.3)":C.border}`, borderRadius:12, padding:"16px 18px", display:"flex", alignItems:"center", gap:14, background:isConnected?"rgba(16,185,129,.03)":C.white, transition:"all .3s" }}
                      onMouseEnter={e=>{if(!isConnected){e.currentTarget.style.borderColor=C.teal;e.currentTarget.style.boxShadow="0 2px 8px rgba(8,145,178,.08)";}}}
                      onMouseLeave={e=>{if(!isConnected){e.currentTarget.style.borderColor=C.border;e.currentTarget.style.boxShadow="none";}}}>
                      <div style={{ width:40, height:40, borderRadius:10, background:isConnected?"rgba(16,185,129,.1)":"#F1F5F9", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, fontSize:14, color:isConnected?C.green:C.slate, flexShrink:0 }}>
                        {crm.name==="CSV Import"?"📄":crm.name==="API"?"⚡":crm.name.slice(0,2).toUpperCase()}
                      </div>
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ fontSize:14, fontWeight:700, color:C.text }}>{crm.name}</div>
                        <div style={{ fontSize:11, color:C.slate, marginTop:1 }}>{crm.desc}</div>
                      </div>
                      {isConnected ? (
                        <span style={{ background:"rgba(16,185,129,.1)", color:C.green, fontSize:11, fontWeight:700, padding:"5px 12px", borderRadius:20, display:"flex", alignItems:"center", gap:5, flexShrink:0 }}>
                          <span style={{ width:6, height:6, borderRadius:"50%", background:C.green, display:"inline-block" }} />Connected
                        </span>
                      ) : (
                        <button onClick={()=>{setConnectedCRMs(prev=>({...prev,[crm.name]:true})); showToast(`${crm.name} connected successfully ✓`);}}
                          style={{ background:"none", border:`1.5px solid rgba(8,145,178,.25)`, borderRadius:8, padding:"6px 14px", fontSize:12, fontWeight:600, color:C.teal, cursor:"pointer", fontFamily:F, whiteSpace:"nowrap", transition:"all .15s" }}
                          onMouseEnter={e=>{e.currentTarget.style.background="rgba(8,145,178,.06)";}}
                          onMouseLeave={e=>{e.currentTarget.style.background="none";}}>
                          Connect
                        </button>
                      )}
                    </div>
                    );
                  })}
                </div>
              </div>

              {/* ── Notifications ── */}
              <div style={{ background:C.card, borderRadius:16, border:`1px solid ${C.border}`, padding:"24px 28px", marginBottom:22, boxShadow:C.cardShadow }}>
                <div style={{ fontWeight:700, fontSize:16, color:C.text, marginBottom:4, letterSpacing:-0.4 }}>🔔 Notifications</div>
                <div style={{ fontSize:13, color:C.slate, marginBottom:20 }}>Configure how and when you hear from Iryss.</div>

                {/* Daily Digest card */}
                <div style={{ border:`1px solid ${C.border}`, borderRadius:16, overflow:"hidden" }}>
                  <div style={{ padding:"16px 20px", background:"#FAFBFC", display:"flex", alignItems:"center", justifyContent:"space-between", borderBottom:`1px solid ${C.border}` }}>
                    <div>
                      <div style={{ fontWeight:700, fontSize:14, color:C.navy, display:"flex", alignItems:"center", gap:10 }}>
                        Daily Digest Email
                        {digestEnabled
                          ? <span style={{ background:"rgba(16,185,129,.12)", color:C.green, fontWeight:700, fontSize:11, padding:"3px 10px", borderRadius:20, display:"flex", alignItems:"center", gap:5 }}><span style={{ width:6, height:6, borderRadius:"50%", background:C.green, display:"inline-block", boxShadow:"0 0 6px rgba(16,185,129,.6)" }} />Active</span>
                          : <span style={{ background:"rgba(100,116,139,.1)", color:C.slate, fontWeight:600, fontSize:11, padding:"3px 10px", borderRadius:20 }}>Off</span>
                        }
                      </div>
                      <div style={{ fontSize:12, color:C.slate, marginTop:3 }}>A morning summary of everything that happened overnight — sent to {practiceDetails.email}</div>
                    </div>
                    <div onClick={()=>setDigestEnabled(v=>!v)} style={{ width:44, height:24, borderRadius:12, background:digestEnabled?C.teal:C.border, cursor:"pointer", position:"relative", transition:"background .2s", flexShrink:0, marginLeft:16 }}>
                      <div style={{ position:"absolute", top:3, left:digestEnabled?22:3, width:18, height:18, borderRadius:"50%", background:"#fff", boxShadow:"0 1px 4px rgba(0,0,0,.2)", transition:"left .2s" }} />
                    </div>
                  </div>

                  <div style={{ padding:"16px 20px", display:"flex", alignItems:"center", gap:12, borderBottom:`1px solid ${C.border}` }}>
                    <span style={{ fontSize:13, fontWeight:600, color:C.navy }}>Send at:</span>
                    <select value={digestTime} onChange={e=>setDigestTime(e.target.value)}
                      style={{ border:`1px solid ${C.border}`, borderRadius:8, padding:"6px 12px", fontSize:13, fontFamily:F, color:C.navy, background:C.white, outline:"none", cursor:"pointer" }}>
                      {["7:00am","8:00am","9:00am"].map(t=><option key={t} value={t}>{t}</option>)}
                    </select>
                    <span style={{ fontSize:12, color:C.slateLight }}>every weekday morning</span>
                    <button onClick={()=>showToast(`Test digest sent to ${practiceDetails.email} ✓`)}
                      style={{ marginLeft:"auto", background:"none", border:`1px solid ${C.border}`, borderRadius:8, padding:"7px 14px", fontSize:12, fontWeight:700, color:C.slate, cursor:"pointer", fontFamily:F, transition:"all .15s" }}
                      onMouseEnter={e=>{e.currentTarget.style.borderColor=C.teal;e.currentTarget.style.color=C.teal;}}
                      onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.color=C.slate;}}>
                      Send Test Digest Now
                    </button>
                  </div>

                  {/* Digest preview */}
                  <div style={{ padding:"20px" }}>
                    <div style={{ fontSize:11, fontWeight:700, color:C.slateLight, textTransform:"uppercase", letterSpacing:1, marginBottom:12 }}>Preview</div>
                    <div style={{ border:`1px solid ${C.border}`, borderRadius:12, overflow:"hidden", fontFamily:"Georgia, serif" }}>
                      <div style={{ background:`linear-gradient(135deg,${C.teal},${C.tealLt})`, padding:"18px 22px" }}>
                        <div style={{ fontSize:13, fontWeight:700, color:"#fff", letterSpacing:2, textTransform:"uppercase", marginBottom:4 }}>Iryss Daily Digest</div>
                        <div style={{ fontSize:18, fontWeight:700, color:"#fff" }}>Good morning, Bright Eyes 👋</div>
                        <div style={{ fontSize:12, color:"rgba(255,255,255,.45)", marginTop:4 }}>{new Date().toLocaleDateString("en-GB",{weekday:"long",day:"numeric",month:"long"})}</div>
                      </div>
                      <div style={{ padding:"18px 22px", background:C.offWhite }}>
                        <div style={{ fontSize:13, color:C.slate, marginBottom:16, fontFamily:F }}>Here is your Iryss summary for today:</div>
                        {[
                          { icon:"🚨", label:"Overnight replies needing attention", value:urgentMessages.length, detail:urgentMessages.map(m=>m.patient).join(", ")||"None", color:urgentMessages.length>0?C.red:C.green },
                          { icon:"◷",  label:"Patients due for recall this week",  value:recallPatients.length, detail:`${recallPatients.length} patient${recallPatients.length!==1?"s":""} overdue or due soon`, color:C.amber },
                          { icon:"📅", label:"Unconfirmed appointments today",     value:noShowRisk.length, detail:`£${noShowRisk.reduce((a,p)=>a+p.revenue,0)} revenue at risk`, color:noShowRisk.length>0?C.red:C.green },
                          { icon:"🤖", label:"AI conversations handled overnight", value:12, detail:"All resolved automatically", color:C.teal },
                        ].map((row,i,arr)=>(
                          <div key={i} style={{ display:"flex", alignItems:"flex-start", gap:12, padding:"10px 0", borderBottom:i<arr.length-1?`1px solid ${C.border}`:"none", fontFamily:F }}>
                            <span style={{ fontSize:16, flexShrink:0 }}>{row.icon}</span>
                            <div style={{ flex:1 }}>
                              <div style={{ fontSize:13, color:C.navy, fontWeight:600 }}>{row.label}</div>
                              <div style={{ fontSize:12, color:C.slate, marginTop:2 }}>{row.detail}</div>
                            </div>
                            <div style={{ fontSize:20, fontWeight:800, color:row.color, letterSpacing:-1 }}>{row.value}</div>
                          </div>
                        ))}
                        <button style={{ width:"100%", marginTop:18, background:`linear-gradient(135deg,${C.teal},${C.tealLt})`, color:"#fff", border:"none", borderRadius:10, padding:"11px", fontWeight:700, fontSize:13, cursor:"default", fontFamily:F }}>
                          View Dashboard →
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Online Booking Widget ── */}
              <div style={{ background:C.card, borderRadius:16, border:`1px solid ${C.border}`, padding:"24px 28px", marginBottom:22, boxShadow:C.cardShadow }}>
                <div style={{ fontWeight:700, fontSize:16, color:C.text, marginBottom:4, letterSpacing:-0.4 }}>📅 Online Booking Widget</div>
                <div style={{ fontSize:13, color:C.slate, marginBottom:20 }}>Embed on your website — patients book directly into your diary. No phone calls needed.</div>
                <div style={{ border:`1px solid ${C.border}`, borderRadius:16, overflow:"hidden", marginBottom:16 }}>
                  <div style={{ background:`linear-gradient(135deg,${C.teal},${C.tealLt})`, padding:"16px 20px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                    <div style={{ color:"#fff", fontWeight:700, fontSize:14 }}>Bright Eyes Opticians</div>
                    <span style={{ color:"rgba(255,255,255,.6)", fontSize:12 }}>Powered by Iryss</span>
                  </div>
                  <div style={{ padding:"20px", background:C.bg }}>
                    <div style={{ fontWeight:700, fontSize:15, color:C.text, marginBottom:12 }}>Book an Appointment</div>
                    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8, marginBottom:16 }}>
                      {["Eye Test","Contact Lens Check","Glasses Collection","Children's Eye Test","Emergency","Myopia Review"].map(t=>(
                        <div key={t} style={{ border:`1px solid ${C.border}`, borderRadius:8, padding:"10px", textAlign:"center", fontSize:12, fontWeight:600, color:C.text, cursor:"pointer", background:C.white, transition:"all .15s" }}>{t}</div>
                      ))}
                    </div>
                    <div style={{ display:"flex", gap:8 }}>
                      {["Mon 14","Tue 15","Wed 16","Thu 17","Fri 18"].map((d,i)=>(
                        <div key={d} style={{ flex:1, border:`1px solid ${i===0?C.teal:C.border}`, borderRadius:8, padding:"8px", textAlign:"center", fontSize:11, fontWeight:600, color:i===0?C.teal:C.slate, background:i===0?"rgba(8,145,178,.06)":C.white }}>{d}</div>
                      ))}
                    </div>
                  </div>
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                  <input readOnly value='<script src="https://iryss.com/book.js"></script>' style={{ flex:1, border:`1px solid ${C.border}`, borderRadius:8, padding:"10px 14px", fontSize:12, fontFamily:"monospace", color:C.slate, background:C.bg }} />
                  <button onClick={()=>showToast("Embed code copied ✓")} style={{ background:`linear-gradient(135deg,${C.teal},${C.tealLt})`, color:"#fff", border:"none", borderRadius:8, padding:"10px 18px", fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:F, whiteSpace:"nowrap" }}>Copy Code</button>
                </div>
              </div>

              {/* ── Automation ── */}
              <div style={{ background:C.white, borderRadius:16, border:`1px solid ${C.border}`, padding:"24px 28px", boxShadow:C.cardShadow }}>
                <div style={{ fontWeight:700, fontSize:16, color:C.navy, marginBottom:4, letterSpacing:-0.4 }}>⚡ Automation</div>
                <div style={{ fontSize:13, color:C.slate, marginBottom:20 }}>Control which automations run automatically. All changes take effect immediately.</div>
                {[
                  { label:"Auto-send recall messages",                 sub:"Sends to patients 8+ months since last visit",    active:autoRecall,        toggle:()=>setAutoRecall(v=>!v)        },
                  { label:"Auto-send reorder reminders",               sub:"Sends to contact lens patients every 3 months",   active:autoReorder,       toggle:()=>setAutoReorder(v=>!v)       },
                  { label:"Auto-send appointment confirmations (48hr)", sub:"WhatsApp reminder 48 hours before appointment",   active:reminder48Active,  toggle:()=>setReminder48Active(v=>!v)  },
                  { label:"Auto-send appointment confirmations (2hr)",  sub:"Final reminder 2 hours before appointment",       active:reminder2hActive,  toggle:()=>setReminder2hActive(v=>!v)  },
                  { label:"Auto-send Google review requests",           sub:"Sent 24 hours after each appointment",            active:autoReview,        toggle:()=>setAutoReview(v=>!v)        },
                ].map((item,i,arr)=>(
                  <div key={item.label} style={{ display:"flex", alignItems:"center", gap:14, padding:"14px 0", borderBottom:i<arr.length-1?`1px solid ${C.border}`:"none" }}>
                    <div style={{ flex:1 }}>
                      <div style={{ fontWeight:600, fontSize:14, color:C.navy, display:"flex", alignItems:"center", gap:8 }}>
                        {item.label}
                        {item.active
                          ? <span style={{ background:"rgba(16,185,129,.12)", color:C.green, fontWeight:700, fontSize:10, padding:"2px 9px", borderRadius:20 }}>Active</span>
                          : <span style={{ background:"rgba(100,116,139,.1)", color:C.slateLight, fontWeight:600, fontSize:10, padding:"2px 9px", borderRadius:20 }}>Off</span>
                        }
                      </div>
                      <div style={{ fontSize:12, color:C.slate, marginTop:2 }}>{item.sub}</div>
                    </div>
                    <div onClick={item.toggle} style={{ width:44, height:24, borderRadius:12, background:item.active?C.teal:C.border, cursor:"pointer", position:"relative", transition:"background .2s", flexShrink:0 }}>
                      <div style={{ position:"absolute", top:3, left:item.active?22:3, width:18, height:18, borderRadius:"50%", background:"#fff", boxShadow:"0 1px 4px rgba(0,0,0,.2)", transition:"left .2s" }} />
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* ═══ INTELLIGENCE ═══ */}
          {nav==="intelligence"&&(()=>{
            const COMP_COLORS = { specsavers:"#7C3AED", "vision express":"#2563EB", boots:"#059669", "optical express":"#DC2626", asda:"#D97706", tesco:"#0891B2", cheaper:"#64748B", "went elsewhere":"#64748B", "another optician":"#64748B", "different optician":"#64748B", "vision direct":"#9333EA", "glasses direct":"#9333EA" };
            const competitorCounts = COMPETITOR_KW.map(kw=>({
              kw, label:kw.charAt(0).toUpperCase()+kw.slice(1),
              count:competitorMentions.filter(m=>m.keyword===kw).length,
              color:COMP_COLORS[kw]||C.slate
            })).filter(c=>c.count>0).sort((a,b)=>b.count-a.count);
            const maxCount = Math.max(...competitorCounts.map(c=>c.count), 1);
            const lostRevEst = competitorMentions.length * 320;
            return (
              <div style={{ animation:"fadeInUp .4s ease-out" }}>
                <div style={{ marginBottom:28 }}>
                  <h1 style={{ fontSize:26, fontWeight:800, color:C.text, letterSpacing:-0.7, margin:0, marginBottom:6 }}>Intelligence</h1>
                  <p style={{ fontSize:14, color:C.slate, margin:0, fontWeight:500 }}>Monitor competitor activity and market insights</p>
                </div>
                {/* KPI row */}
                <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16, marginBottom:24 }}>
                  <SC label="Patients naming competitors"  value={competitorMentions.length}                    accent={C.red}   sparkColor={C.red}   spark={[1,2,2,3,3,4,3,4,5,4,5,6,5,6,7,6,7,8,7,8,9,8,9,10,9,10,11,competitorMentions.length-1,competitorMentions.length,competitorMentions.length]}                    sub="Live from inbox" trend={competitorMentions.length>0?"Win back fast":null} trendUp={false} />
                  <SC label="Patients about to leave"      value={new Set(competitorMentions.map(m=>m.patient)).size} accent={C.amber} sparkColor={C.amber} spark={[1,2,2,3,3,3,4,4,4,5,5,5,6,6,6,7,7,7,8,8,8,8,9,9,9,9,9,9,10,10]} sub="Each worth ~£800 over lifetime" />
                  <SC label="Revenue at risk of defection" value={`£${lostRevEst.toLocaleString()}`}            accent={C.red}   sparkColor={C.red}   spark={[300,500,700,900,1100,1300,1500,1700,1900,2100,2300,2500,2700,2900,3100,3300,3500,3700,3900,4100,4300,4500,4700,4900,5100,5300,5500,lostRevEst*0.96,lostRevEst*0.98,lostRevEst]} sub="Don't let them walk" />
                  <SC label="Competitors monitored"        value={COMPETITOR_KW.length}                         accent={C.navy}  sparkColor={C.navy}  spark={Array.from({length:30},(_,i)=>Math.max(1, COMPETITOR_KW.length*(i+1)/30))} sub="Keywords watched 24/7" />
                </div>

                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:18, marginBottom:22 }}>
                  {/* Mentions table */}
                  <div style={{ background:C.card, borderRadius:16, padding:22, border:`1px solid ${C.border}`, boxShadow:C.cardShadow }}>
                    <div style={{ fontWeight:700, fontSize:15, marginBottom:16, letterSpacing:-0.3, color:C.text }}>Competitor Mentions</div>
                    {competitorMentions.length===0
                      ? <div style={{ padding:"32px 0", textAlign:"center", color:C.slate, fontSize:14 }}>No competitor mentions detected yet. Iryss is actively monitoring your inbox.</div>
                      : competitorMentions.map((m,i)=>(
                          <div key={i} style={{ padding:"12px 0", borderBottom:i<competitorMentions.length-1?`1px solid ${C.border}`:"none" }}>
                            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:6 }}>
                              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                                <Avatar initials={m.patient.split(" ").map(w=>w[0]).join("").slice(0,2)} bg={C.red} size={28} />
                                <div>
                                  <div style={{ fontWeight:600, fontSize:13, color:C.navy }}>{m.patient}</div>
                                  <div style={{ fontSize:10, color:C.slate }}>{m.time}</div>
                                </div>
                              </div>
                              <span style={{ background:`${COMP_COLORS[m.keyword]||C.slate}20`, color:COMP_COLORS[m.keyword]||C.slate, fontSize:11, fontWeight:700, padding:"2px 9px", borderRadius:20 }}>{m.keyword}</span>
                            </div>
                            <div style={{ fontSize:12, color:C.slate, fontStyle:"italic", marginBottom:8, lineHeight:1.5 }}>
                              "{m.text.length>120?m.text.slice(0,120)+"…":m.text}"
                            </div>
                            {intelSent[`${m.patient}-${i}`]
                              ? <span style={{ fontSize:12, color:C.green, fontWeight:600 }}>✓ Win-back sent</span>
                              : <button onClick={()=>{
                                  const msg=`Hi ${m.patient.split(" ")[0]}, thank you for being a patient at Bright Eyes 👓 We noticed you may be considering your options — we'd love to keep you with us. As a loyalty thank you, we'd like to offer you a complimentary frame styling session and 10% off your next purchase. Just reply YES to claim it!`;
                                  openSendWA({...PATIENTS.find(p=>p.name===m.patient)||{id:`intel-${i}`,name:m.patient,phone:m.phone}, waMsg:msg});
                                  setIntelSent(s=>({...s,[`${m.patient}-${i}`]:true}));
                                }} style={{ background:`linear-gradient(135deg,${C.teal},${C.tealLt})`, color:"#fff", border:"none", borderRadius:8, padding:"6px 13px", fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:F, boxShadow:"0 2px 8px rgba(8,145,178,.3)" }}>
                                  Win Back →
                                </button>
                            }
                          </div>
                        ))
                    }
                  </div>

                  {/* Right column */}
                  <div style={{ display:"flex", flexDirection:"column", gap:18 }}>
                    {/* Competitor breakdown bar chart */}
                    <div style={{ background:C.card, borderRadius:16, padding:22, border:`1px solid ${C.border}`, boxShadow:C.cardShadow }}>
                      <div style={{ fontWeight:700, fontSize:15, marginBottom:16, letterSpacing:-0.3, color:C.text }}>Competitor Breakdown</div>
                      {competitorCounts.length===0
                        ? <div style={{ color:C.slate, fontSize:13 }}>No mentions yet.</div>
                        : competitorCounts.map(c=>(
                            <div key={c.kw} style={{ marginBottom:10 }}>
                              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                                <span style={{ fontSize:12, fontWeight:600, color:C.navy }}>{c.label}</span>
                                <span style={{ fontSize:12, fontWeight:700, color:c.color }}>{c.count} mention{c.count!==1?"s":""}</span>
                              </div>
                              <div style={{ height:8, background:C.border, borderRadius:4, overflow:"hidden" }}>
                                <div style={{ width:`${Math.round((c.count/maxCount)*100)}%`, height:"100%", background:c.color, borderRadius:4 }} />
                              </div>
                            </div>
                          ))
                      }
                      {competitorCounts.length===0&&<div style={{ color:C.slate, fontSize:12, marginTop:4 }}>Iryss is scanning all incoming messages for competitor keywords.</div>}
                    </div>

                    {/* Lost revenue recovery card */}
                    <div style={{ background:`linear-gradient(135deg,${C.teal} 0%,${C.tealLt} 100%)`, borderRadius:16, padding:22, boxShadow:"0 4px 20px rgba(8,145,178,.15)" }}>
                      <div style={{ fontWeight:700, fontSize:15, color:"#fff", marginBottom:12, letterSpacing:-0.3 }}>💰 Recovery Opportunity</div>
                      <div style={{ fontSize:32, fontWeight:900, color:"#fff", letterSpacing:-1, marginBottom:4 }}>£{lostRevEst.toLocaleString()}</div>
                      <div style={{ fontSize:12, color:"rgba(255,255,255,.6)", marginBottom:16 }}>estimated revenue at risk from competitor mentions</div>
                      <div style={{ fontSize:13, color:"rgba(255,255,255,.8)", lineHeight:1.6, marginBottom:16 }}>
                        Each win-back WhatsApp takes 30 seconds. Recovering just half these patients would add <span style={{ color:"#fff", fontWeight:700 }}>£{Math.round(lostRevEst*0.5).toLocaleString()}</span> back to your practice.
                      </div>
                      <button disabled={competitorMentions.length===0} onClick={()=>{
                        if (competitorMentions.length===0) return;
                        const unsent = competitorMentions.filter((m,i)=>!intelSent[`${m.patient}-${i}`]);
                        if (unsent.length===0) { showToast("All win-back messages already sent"); return; }
                        setIntelSent(s=>{
                          const next = {...s};
                          competitorMentions.forEach((m,i)=>{ next[`${m.patient}-${i}`] = true; });
                          return next;
                        });
                        showToast(`${unsent.length} win-back WhatsApp${unsent.length>1?"s":""} sent · est. £${Math.round(unsent.length*320*0.5).toLocaleString()} recovered`);
                      }} style={{ width:"100%", background:`linear-gradient(135deg,${C.teal},${C.tealLt})`, color:"#fff", border:"none", borderRadius:10, padding:"11px", fontWeight:700, fontSize:13, cursor:competitorMentions.length===0?"not-allowed":"pointer", fontFamily:F, boxShadow:"0 4px 16px rgba(8,145,178,.4)", opacity:competitorMentions.length===0?0.5:1 }}>
                        {competitorMentions.length===0?"No mentions to action":"Send All Win-Back Messages →"}
                      </button>
                    </div>

                    {/* Why patients leave */}
                    <div style={{ background:C.white, borderRadius:16, padding:22, border:`1px solid ${C.border}`, boxShadow:C.cardShadow }}>
                      <div style={{ fontWeight:700, fontSize:15, marginBottom:14, letterSpacing:-0.3 }}>Why Patients Leave</div>
                      {[
                        { reason:"Price / cheaper elsewhere", pct:38, color:C.red },
                        { reason:"Location / convenience",    pct:27, color:C.amber },
                        { reason:"Waiting times",             pct:18, color:C.teal },
                        { reason:"Service experience",        pct:10, color:"#8B5CF6" },
                        { reason:"Other",                     pct:7,  color:C.slate },
                      ].map(r=>(
                        <div key={r.reason} style={{ marginBottom:10 }}>
                          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:3 }}>
                            <span style={{ fontSize:12, color:C.navy }}>{r.reason}</span>
                            <span style={{ fontSize:12, fontWeight:700, color:r.color }}>{r.pct}%</span>
                          </div>
                          <div style={{ height:6, background:C.border, borderRadius:3, overflow:"hidden" }}>
                            <div style={{ width:`${r.pct}%`, height:"100%", background:r.color, borderRadius:3 }} />
                          </div>
                        </div>
                      ))}
                      <div style={{ fontSize:11, color:C.slate, marginTop:10 }}>Source: Optical sector retention study 2024</div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}

          </>)}
        </div>
      </div>

      {/* ═══ CSV IMPORT MODAL ═══ */}
      {showImport&&(
        <div onClick={()=>{ if(importStep!==2){ setShowImport(false); } }} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.4)", zIndex:1000, display:"flex", alignItems:"center", justifyContent:"center", backdropFilter:"blur(6px)", fontFamily:F }}>
          <div onClick={e=>e.stopPropagation()} style={{ width:"100%", maxWidth:820, maxHeight:"92vh", background:C.white, borderRadius:24, boxShadow:"0 40px 100px rgba(0,0,0,.35)", overflow:"auto", display:"flex", flexDirection:"column" }}>

            {/* Modal header */}
            <div style={{ padding:"28px 32px 20px", borderBottom:`1px solid ${C.border}`, display:"flex", alignItems:"center", justifyContent:"space-between", flexShrink:0 }}>
              <div>
                <div style={{ fontSize:20, fontWeight:800, color:C.navy, letterSpacing:-0.6 }}>Revenue Gap Analysis</div>
                <div style={{ fontSize:13, color:C.slate, marginTop:3 }}>Upload your patient list to discover hidden revenue opportunities</div>
              </div>
              {importStep!==2&&<button onClick={()=>setShowImport(false)} style={{ background:"none", border:"none", fontSize:24, cursor:"pointer", color:C.slateLight, lineHeight:1, padding:4 }}>×</button>}
            </div>

            {/* Progress steps */}
            <div style={{ padding:"20px 32px 0", flexShrink:0 }}>
              <div style={{ display:"flex", alignItems:"center", gap:0, marginBottom:24 }}>
                {[{n:1,label:"Upload List"},{n:2,label:"Analyse"},{n:3,label:"Your Results"}].map((s,i,arr)=>(
                  <div key={s.n} style={{ display:"flex", alignItems:"center", flex:1 }}>
                    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
                      <div style={{ width:32, height:32, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, fontSize:13, background:importStep>s.n?C.green:importStep===s.n?C.teal:C.border, color:importStep>=s.n?"#fff":C.slateLight, transition:"all .4s" }}>
                        {importStep>s.n ? "✓" : s.n}
                      </div>
                      <div style={{ fontSize:11, fontWeight:importStep===s.n?700:500, color:importStep===s.n?C.teal:importStep>s.n?C.green:C.slateLight, whiteSpace:"nowrap" }}>{s.label}</div>
                    </div>
                    {i<arr.length-1&&<div style={{ flex:1, height:2, background:importStep>s.n?C.green:C.border, margin:"0 8px 18px", transition:"background .4s" }} />}
                  </div>
                ))}
              </div>
            </div>

            {/* Step 1 — Upload */}
            {importStep===1&&(
              <div style={{ padding:"0 32px 32px", flex:1 }}>
                <input ref={importFileRef} type="file" accept=".csv" style={{ display:"none" }} onChange={e=>handleImportFile(e.target.files[0])} />

                {/* Drop zone */}
                <div
                  onClick={()=>importFileRef.current?.click()}
                  onDragOver={e=>{ e.preventDefault(); setImportDrag(true); }}
                  onDragLeave={()=>setImportDrag(false)}
                  onDrop={e=>{ e.preventDefault(); setImportDrag(false); handleImportFile(e.dataTransfer.files[0]); }}
                  style={{ border:`2px dashed ${importDrag?C.teal:C.border}`, borderRadius:16, padding:"52px 32px", textAlign:"center", cursor:"pointer", background:importDrag?"rgba(8,145,178,.04)":C.offWhite, transition:"all .2s", marginBottom:20 }}>
                  <div style={{ fontSize:40, marginBottom:14 }}>📂</div>
                  <div style={{ fontSize:17, fontWeight:700, color:C.navy, marginBottom:6 }}>Drop your patient list CSV here</div>
                  <div style={{ fontSize:13, color:C.slate, marginBottom:16 }}>or <span style={{ color:C.teal, fontWeight:600, textDecoration:"underline" }}>click to browse</span></div>
                  <div style={{ fontSize:12, color:C.slateLight, background:C.white, border:`1px solid ${C.border}`, borderRadius:8, padding:"8px 16px", display:"inline-block" }}>
                    We accept: <strong>Name</strong>, <strong>Phone</strong>, <strong>Last Visit Date</strong>, <strong>Product Type</strong>, <strong>Email</strong>
                  </div>
                </div>

                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20 }}>
                  <div style={{ display:"flex", gap:16, alignItems:"center" }}>
                    <a href="#" onClick={e=>{ e.preventDefault();
                      const csv = "Name,Phone,Last Visit Date,Product Type,Email\nJohn Smith,+447700000001,2023-06-15,Varifocals,john@email.com\nSue Jones,+447700000002,2024-01-20,Contact Lenses,sue@email.com\n";
                      const blob = new Blob([csv], {type:"text/csv"});
                      const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "iryss-patient-template.csv"; a.click();
                    }} style={{ fontSize:13, color:C.teal, fontWeight:600, textDecoration:"none" }}>⬇ Download sample CSV template</a>
                    <span style={{ fontSize:13, color:C.slateLight }}>|</span>
                    <span style={{ fontSize:13, color:C.slate }}>🔒 Your data is encrypted and never shared</span>
                  </div>
                  <button onClick={useDemoImport} style={{ background:"none", border:`1px solid ${C.border}`, borderRadius:10, padding:"9px 18px", fontSize:13, fontWeight:700, color:C.slate, cursor:"pointer", fontFamily:F, transition:"all .15s" }}
                    onMouseEnter={e=>{e.currentTarget.style.borderColor=C.teal;e.currentTarget.style.color=C.teal;}}
                    onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.color=C.slate;}}>
                    Try with demo data →
                  </button>
                </div>
              </div>
            )}

            {/* Step 2 — Analysing */}
            {importStep===2&&(
              <div style={{ padding:"20px 32px 40px", flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" }}>
                <div style={{ fontSize:36, marginBottom:16 }}>🔍</div>
                <div style={{ fontSize:20, fontWeight:800, color:C.navy, marginBottom:6, letterSpacing:-0.5 }}>Analysing your patient list…</div>
                <div style={{ fontSize:13, color:C.slate, marginBottom:28 }}>This takes just a few seconds</div>
                <div style={{ width:"100%", maxWidth:440, height:8, background:C.border, borderRadius:4, overflow:"hidden", marginBottom:32 }}>
                  <div style={{ width:`${importProgress}%`, height:"100%", background:`linear-gradient(90deg,${C.teal},${C.tealLt})`, borderRadius:4, transition:"width .1s linear" }} />
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr", gap:14, width:"100%", maxWidth:560 }}>
                  {[
                    { label:"Patients scanned",       value:importCounters.scanned, color:C.teal   },
                    { label:"At-risk identified",      value:importCounters.atRisk,  color:C.red    },
                    { label:"Recalls due",             value:importCounters.recalls, color:C.amber  },
                    { label:"Revenue gap",             value:`£${importCounters.gap.toLocaleString()}`, color:C.green },
                  ].map(c=>(
                    <div key={c.label} style={{ background:C.offWhite, borderRadius:12, padding:"14px 12px", textAlign:"center", border:`1px solid ${C.border}` }}>
                      <div style={{ fontSize:20, fontWeight:800, color:c.color, letterSpacing:-0.5, marginBottom:4 }}>{c.value}</div>
                      <div style={{ fontSize:10, color:C.slate, fontWeight:500, lineHeight:1.3 }}>{c.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3 — Results */}
            {importStep===3&&(()=>{
              const rows = importData || [];
              const atRiskRows  = rows.filter(r=>r.risk!=='low');
              const highRows    = rows.filter(r=>r.risk==='high');
              const lensRows    = rows.filter(r=>/contact|lens|cl|oasys/i.test(r.product));
              const gapTotal    = atRiskRows.reduce((a,r)=>a+r.revenue, 0);
              const monthlyGrowth = Math.round(gapTotal * 0.07);
              const top10 = [...atRiskRows].sort((a,b)=>b.riskScore-a.riskScore).slice(0,10);
              return (
                <div style={{ padding:"0 32px 32px", flex:1 }}>
                  {/* Hero */}
                  <div style={{ background:`linear-gradient(135deg,${C.teal} 0%,${C.tealLt} 100%)`, borderRadius:16, padding:"28px 32px", marginBottom:22, textAlign:"center" }}>
                    <div style={{ fontSize:12, color:"rgba(255,255,255,.5)", textTransform:"uppercase", letterSpacing:2, marginBottom:8 }}>Revenue sitting in your patient list</div>
                    <div style={{ fontSize:52, fontWeight:800, color:"#fff", letterSpacing:-2, lineHeight:1, marginBottom:8 }}>£{gapTotal.toLocaleString()}</div>
                    <div style={{ fontSize:14, color:"rgba(255,255,255,.75)" }}>from {atRiskRows.length} patients who haven't returned</div>
                  </div>

                  {/* 4 result cards */}
                  <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14, marginBottom:22 }}>
                    {[
                      { icon:"⚠️",  label:"Overdue for recall",         value:highRows.length,   sub:`${rows.length} total scanned`,       color:C.red   },
                      { icon:"◉",   label:"Lens reorders due",           value:lensRows.length,  sub:"Contact lens patients",               color:C.teal  },
                      { icon:"🎯",  label:"High dropout risk",           value:highRows.length,  sub:"18+ months since last visit",          color:C.amber },
                      { icon:"💰",  label:"Monthly revenue recoverable", value:`£${Math.round(gapTotal/12).toLocaleString()}`, sub:"Est. monthly if re-engaged", color:C.green },
                    ].map(c=>(
                      <div key={c.label} style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:16, padding:"18px 16px", boxShadow:"0 2px 8px rgba(0,0,0,.05)" }}>
                        <div style={{ fontSize:22, marginBottom:8 }}>{c.icon}</div>
                        <div style={{ fontSize:24, fontWeight:800, color:c.color, letterSpacing:-1, marginBottom:4 }}>{c.value}</div>
                        <div style={{ fontSize:11, fontWeight:600, color:C.navy, marginBottom:2 }}>{c.label}</div>
                        <div style={{ fontSize:11, color:C.slateLight }}>{c.sub}</div>
                      </div>
                    ))}
                  </div>

                  {/* Top 10 table */}
                  {top10.length>0&&(
                    <div style={{ background:C.white, borderRadius:16, border:`1px solid ${C.border}`, overflow:"hidden", marginBottom:22, boxShadow:"0 2px 8px rgba(0,0,0,.05)" }}>
                      <div style={{ padding:"14px 20px", borderBottom:`1px solid ${C.border}`, fontWeight:700, fontSize:14, color:C.navy }}>
                        Top {top10.length} at-risk patients
                      </div>
                      <div style={{ display:"grid", gridTemplateColumns:"1fr 120px 160px 90px 90px", gap:12, padding:"10px 20px", background:"#FAFBFC", borderBottom:`1px solid ${C.border}` }}>
                        {["Name","Last Visit","Product","Risk","Est. Value"].map(h=>(
                          <div key={h} style={{ fontSize:10, fontWeight:700, color:C.slateLight, textTransform:"uppercase", letterSpacing:1 }}>{h}</div>
                        ))}
                      </div>
                      {top10.map((p,i)=>(
                        <div key={i} style={{ display:"grid", gridTemplateColumns:"1fr 120px 160px 90px 90px", gap:12, padding:"12px 20px", borderBottom:i<top10.length-1?`1px solid ${C.border}`:"none", alignItems:"center", background:i%2===0?C.white:"#FAFBFD" }}>
                          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                            <Avatar initials={p.initials} bg={p.risk==="high"?C.red:p.risk==="medium"?C.amber:C.green} size={28} />
                            <span style={{ fontWeight:600, fontSize:13 }}>{p.name}</span>
                          </div>
                          <div style={{ fontSize:12, color:C.slate }}>{p.lastVisit}</div>
                          <div style={{ fontSize:12, color:C.navy, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{p.product}</div>
                          <Chip color={riskFg[p.risk]}>{riskLabel[p.risk]}</Chip>
                          <div style={{ fontWeight:700, fontSize:13, color:C.navy }}>£{p.revenue}</div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Urgency */}
                  <div style={{ background:"rgba(245,158,11,.06)", border:"1px solid rgba(245,158,11,.2)", borderRadius:12, padding:"12px 18px", marginBottom:20, display:"flex", alignItems:"center", gap:10 }}>
                    <span style={{ fontSize:16 }}>⏳</span>
                    <div style={{ fontSize:13, color:C.amber, fontWeight:600 }}>
                      Based on industry averages, this revenue gap grows by approximately <strong>£{monthlyGrowth.toLocaleString()}</strong> every month you wait.
                    </div>
                  </div>

                  {/* CTAs */}
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
                    <button style={{ background:`linear-gradient(135deg,${C.teal},${C.tealLt})`, color:"#fff", border:"none", borderRadius:12, padding:"16px 24px", fontWeight:800, fontSize:15, cursor:"pointer", fontFamily:F, boxShadow:"0 4px 20px rgba(8,145,178,.35)", letterSpacing:-0.3 }}>
                      Start Free Trial — Recover This Revenue →
                    </button>
                    <button onClick={()=>showToast("PDF export coming soon — we'll email it to you ✓")} style={{ background:C.white, color:C.navy, border:`2px solid ${C.border}`, borderRadius:12, padding:"16px 24px", fontWeight:700, fontSize:15, cursor:"pointer", fontFamily:F, letterSpacing:-0.3 }}>
                      ⬇ Export This Report as PDF
                    </button>
                  </div>

                  <div style={{ textAlign:"center", marginTop:14 }}>
                    <button onClick={resetImport} style={{ background:"none", border:"none", fontSize:12, color:C.slateLight, cursor:"pointer", fontFamily:F }}>← Upload a different file</button>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* ═══ TOAST ═══ */}
      {toastMsg&&(
        <div style={{ position:"fixed", bottom:32, left:"50%", transform:"translateX(-50%)", background:C.teal, color:"#fff", borderRadius:12, padding:"13px 22px", fontSize:14, fontWeight:600, fontFamily:F, zIndex:9999, boxShadow:"0 8px 32px rgba(8,145,178,.3)", display:"flex", alignItems:"center", gap:10, whiteSpace:"nowrap", animation:"fadeIn .25s ease" }}>
          <span style={{ color:"#fff", fontSize:16 }}>✓</span>
          {toastMsg}
        </div>
      )}

      {/* ═══ DRILLDOWN PANELS ═══ */}

      {drill==="at-risk"&&(
        <DrillPanel title="Patients at Risk" sub="March 2026 · high & medium risk" onClose={()=>setDrill(null)} onFullPage={()=>goNav("patients")}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:20 }}>
            {[{label:"High risk",value:highRisk.length,c:C.red},{label:"Medium risk",value:medRisk.length,c:C.amber}].map(s=>(
              <div key={s.label} style={{ background:C.cream, borderRadius:12, padding:"14px 16px", border:`1px solid ${C.border}`, textAlign:"center" }}>
                <div style={{ fontSize:26, fontWeight:800, color:s.c, letterSpacing:-1 }}>{s.value}</div>
                <div style={{ fontSize:11, color:C.slate, marginTop:3 }}>{s.label}</div>
              </div>
            ))}
          </div>
          {PATIENTS.filter(p=>p.risk!=="low").map((p,i,arr)=><PatientRow key={p.id} p={p} i={i} total={arr.length} showWA waSent={waSent} onSendWA={p=>{setDrill(null);openSendWA(p);}} />)}
        </DrillPanel>
      )}

      {drill==="high-risk"&&(
        <DrillPanel title="High Risk Patients" sub={`${highRisk.length} patients · Score 70–100`} onClose={()=>setDrill(null)} onFullPage={()=>goNav("patients")}>
          <div style={{ background:"rgba(239,68,68,.05)", border:"1px solid rgba(239,68,68,.12)", borderRadius:12, padding:"12px 16px", marginBottom:20 }}>
            <div style={{ fontSize:12, color:C.slate }}>These patients are most at risk of not returning. We recommend sending a WhatsApp message today.</div>
          </div>
          {highRisk.map((p,i)=><PatientRow key={p.id} p={p} i={i} total={highRisk.length} showWA waSent={waSent} onSendWA={p=>{setDrill(null);openSendWA(p);}} />)}
        </DrillPanel>
      )}

      {drill==="med-risk"&&(
        <DrillPanel title="Medium Risk Patients" sub={`${medRisk.length} patients · Score 40–69`} onClose={()=>setDrill(null)} onFullPage={()=>goNav("patients")}>
          {medRisk.map((p,i)=><PatientRow key={p.id} p={p} i={i} total={medRisk.length} showWA waSent={waSent} onSendWA={p=>{setDrill(null);openSendWA(p);}} />)}
        </DrillPanel>
      )}

      {drill==="rev-risk"&&(
        <DrillPanel title="Revenue at Risk" sub="High + medium risk patients this month" onClose={()=>setDrill(null)} onFullPage={()=>goNav("revenue")}>
          <div style={{ background:"rgba(239,68,68,.05)", border:"1px solid rgba(239,68,68,.12)", borderRadius:12, padding:"14px 16px", marginBottom:20 }}>
            <div style={{ fontSize:11, color:C.slate, textTransform:"uppercase", letterSpacing:1.2, marginBottom:4 }}>Total at risk</div>
            <div style={{ fontSize:34, fontWeight:800, color:C.red, letterSpacing:-1 }}>£{atRiskRevenue.toLocaleString()}</div>
          </div>
          {PATIENTS.filter(p=>p.risk!=="low").sort((a,b)=>b.revenue-a.revenue).map((p,i,arr)=>(
            <div key={p.id} style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 0", borderBottom:i<arr.length-1?`1px solid ${C.border}`:"none" }}>
              <Avatar initials={p.initials} bg={p.risk==="high"?C.red:C.amber} size={38} />
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:600, fontSize:14 }}>{p.name}</div>
                <div style={{ fontSize:12, color:C.slate, marginTop:2 }}>{p.product} · {p.lastVisit}</div>
              </div>
              <div style={{ textAlign:"right" }}>
                <div style={{ fontSize:18, fontWeight:800, color:p.risk==="high"?C.red:C.amber, letterSpacing:-0.5 }}>£{p.revenue}</div>
                <Chip color={riskFg[p.risk]}>{riskLabel[p.risk]}</Chip>
              </div>
            </div>
          ))}
          <div style={{ marginTop:16, padding:"12px 16px", background:C.cream, borderRadius:10, border:`1px solid ${C.border}`, display:"flex", justifyContent:"space-between" }}>
            <span style={{ fontSize:13, fontWeight:600 }}>Total</span>
            <span style={{ fontSize:14, fontWeight:800, color:C.red }}>£{atRiskRevenue.toLocaleString()}</span>
          </div>
        </DrillPanel>
      )}

      {drill==="recovered"&&(
        <DrillPanel title="Patients Recovered" sub="Re-engaged via Iryss WhatsApp this month" onClose={()=>setDrill(null)} onFullPage={()=>goNav("patients")}>
          <div style={{ background:"rgba(16,185,129,.05)", border:"1px solid rgba(16,185,129,.12)", borderRadius:12, padding:"14px 16px", marginBottom:20 }}>
            <div style={{ fontSize:11, color:C.slate, textTransform:"uppercase", letterSpacing:1.2, marginBottom:4 }}>Recovered this month</div>
            <div style={{ fontSize:34, fontWeight:800, color:C.green, letterSpacing:-1 }}>{recovered.length} patients</div>
          </div>
          {recovered.map((p,i)=>(
            <div key={p.id} style={{ display:"flex", alignItems:"center", gap:12, padding:"14px 0", borderBottom:i<recovered.length-1?`1px solid ${C.border}`:"none" }}>
              <Avatar initials={p.initials} bg={C.green} size={38} />
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:600, fontSize:14 }}>{p.name}</div>
                <div style={{ fontSize:12, color:C.slate, marginTop:2 }}>{p.product} · {p.lastVisit}</div>
                <div style={{ fontSize:11, color:C.green, marginTop:3, fontWeight:600 }}>{p.status==="booked"?"✓ Appointment booked via WhatsApp":"✓ Re-engaged and returned"}</div>
              </div>
              <div style={{ textAlign:"right" }}>
                <div style={{ fontSize:18, fontWeight:800, color:C.green, letterSpacing:-0.5 }}>£{p.revenue}</div>
                <div style={{ fontSize:11, color:C.slate }}>recovered</div>
              </div>
            </div>
          ))}
        </DrillPanel>
      )}

      {drill==="rev-recovered"&&(
        <DrillPanel title="Revenue Recovered" sub="This month via Iryss" onClose={()=>setDrill(null)} onFullPage={()=>goNav("revenue")}>
          <div style={{ background:"rgba(8,145,178,.05)", border:"1px solid rgba(8,145,178,.12)", borderRadius:12, padding:"14px 16px", marginBottom:20 }}>
            <div style={{ fontSize:11, color:C.slate, textTransform:"uppercase", letterSpacing:1.2, marginBottom:4 }}>Total recovered</div>
            <div style={{ fontSize:34, fontWeight:800, color:C.teal, letterSpacing:-1 }}>£{recoveredRev.toLocaleString()}</div>
            <div style={{ fontSize:12, color:C.slate, marginTop:4 }}>vs £220 subscription = {Math.round(recoveredRev/220*10)/10}× ROI</div>
          </div>
          {recovered.sort((a,b)=>b.revenue-a.revenue).map((p,i)=>(
            <div key={p.id} style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 0", borderBottom:i<recovered.length-1?`1px solid ${C.border}`:"none" }}>
              <Avatar initials={p.initials} bg={C.teal} size={38} />
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:600, fontSize:14 }}>{p.name}</div>
                <div style={{ fontSize:12, color:C.slate, marginTop:2 }}>{p.product}</div>
                <div style={{ fontSize:11, color:C.teal, marginTop:3, fontWeight:600 }}>{p.status==="booked"?"Appointment booked via Iryss":"Returned via Iryss"}</div>
              </div>
              <div style={{ fontSize:18, fontWeight:800, color:C.teal, letterSpacing:-0.5 }}>£{p.revenue}</div>
            </div>
          ))}
          <div style={{ marginTop:16, padding:"12px 16px", background:C.cream, borderRadius:10, border:`1px solid ${C.border}`, display:"flex", justifyContent:"space-between" }}>
            <span style={{ fontSize:13, fontWeight:600 }}>Total recovered</span>
            <span style={{ fontSize:14, fontWeight:800, color:C.teal }}>£{recoveredRev.toLocaleString()}</span>
          </div>
        </DrillPanel>
      )}

      {drill==="all-reviews"&&(
        <DrillPanel title="All Reviews" sub="147 total reviews · 4.9 average" onClose={()=>setDrill(null)} onFullPage={()=>goNav("reviews")}>
          {[...REVIEWS,...REVIEWS].map((r,i)=>(
            <div key={i} style={{ padding:"12px 0", borderBottom:i<REVIEWS.length*2-1?`1px solid ${C.border}`:"none" }}>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}>
                <div style={{ color:"#FBBC05", fontSize:13, letterSpacing:1 }}>{"★".repeat(r.stars)}</div>
                <div style={{ fontWeight:600, fontSize:13 }}>{r.name}</div>
                <div style={{ fontSize:11, color:C.slateLight, marginLeft:"auto" }}>{r.days}</div>
              </div>
              <div style={{ fontSize:13, color:C.slate, lineHeight:1.5, fontStyle:"italic" }}>"{r.text}"</div>
            </div>
          ))}
        </DrillPanel>
      )}

      {drill==="iryss-reviews"&&(
        <DrillPanel title="Reviews via Iryss" sub="38 reviews generated this month automatically" onClose={()=>setDrill(null)}>
          <div style={{ background:"rgba(16,185,129,.05)", border:"1px solid rgba(16,185,129,.12)", borderRadius:12, padding:"14px 16px", marginBottom:20 }}>
            <div style={{ fontSize:11, color:C.slate, textTransform:"uppercase", letterSpacing:1.2, marginBottom:4 }}>Generated via Iryss this month</div>
            <div style={{ fontSize:34, fontWeight:800, color:C.green, letterSpacing:-1 }}>38 reviews</div>
            <div style={{ fontSize:12, color:C.slate, marginTop:4 }}>From 52 requests · 73% response rate</div>
          </div>
          {REVIEWS.filter(r=>r.via).map((r,i,arr)=>(
            <div key={i} style={{ padding:"12px 0", borderBottom:i<arr.length-1?`1px solid ${C.border}`:"none" }}>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}>
                <div style={{ color:"#FBBC05", fontSize:13, letterSpacing:1 }}>{"★".repeat(r.stars)}</div>
                <div style={{ fontWeight:600, fontSize:13 }}>{r.name}</div>
                <span style={{ fontSize:10, color:C.teal, fontWeight:600, background:C.tealPale, padding:"2px 8px", borderRadius:20 }}>via Iryss ✓</span>
                <div style={{ fontSize:11, color:C.slateLight, marginLeft:"auto" }}>{r.days}</div>
              </div>
              <div style={{ fontSize:13, color:C.slate, lineHeight:1.5, fontStyle:"italic" }}>"{r.text}"</div>
            </div>
          ))}
        </DrillPanel>
      )}

      {drill==="review-requests"&&(
        <DrillPanel title="Review Requests Sent" sub="52 requests this month · 73% responded" onClose={()=>setDrill(null)}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:20 }}>
            {[{label:"Sent",value:"52",c:C.teal},{label:"Responded",value:"38",c:C.green},{label:"Response rate",value:"73%",c:C.purple},{label:"Left a review",value:"38",c:C.green}].map(s=>(
              <div key={s.label} style={{ background:C.cream, borderRadius:10, padding:"12px 14px", border:`1px solid ${C.border}`, textAlign:"center" }}>
                <div style={{ fontSize:22, fontWeight:800, color:s.c, letterSpacing:-0.5 }}>{s.value}</div>
                <div style={{ fontSize:11, color:C.slate, marginTop:2 }}>{s.label}</div>
              </div>
            ))}
          </div>
          {APPOINTMENTS.map((a,i)=>(
            <div key={i} style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 0", borderBottom:i<APPOINTMENTS.length-1?`1px solid ${C.border}`:"none" }}>
              <Avatar initials={a.patient.split(" ").map(w=>w[0]).join("").slice(0,2)} bg={getColor(i)} size={34} />
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:600, fontSize:13 }}>{a.patient}</div>
                <div style={{ fontSize:11, color:C.slate }}>{a.type} · {a.time}</div>
              </div>
              <span style={{ fontSize:11, fontWeight:700, padding:"3px 9px", borderRadius:20, background:i<3?"rgba(16,185,129,.1)":"rgba(245,158,11,.1)", color:i<3?C.green:C.amber }}>
                {i<3?"Review left ✓":"Pending"}
              </span>
            </div>
          ))}
        </DrillPanel>
      )}

      {drill==="all-appts"&&(
        <DrillPanel title="Today's Appointments" sub={`${APPOINTMENTS.length} total · ${APPOINTMENTS.filter(a=>a.confirmed).length} confirmed`} onClose={()=>setDrill(null)}>
          {APPOINTMENTS.map((a,i)=>(
            <div key={i} style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 0", borderBottom:i<APPOINTMENTS.length-1?`1px solid ${C.border}`:"none" }}>
              <div style={{ width:46, textAlign:"center", background:C.cream, borderRadius:8, padding:"6px 0", flexShrink:0 }}>
                <div style={{ fontSize:13, fontWeight:800, color:C.navy }}>{a.time}</div>
              </div>
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:600, fontSize:14 }}>{a.patient}</div>
                <div style={{ fontSize:12, color:C.slate }}>{a.type} · {a.optician}</div>
                {a.viaIryss&&<span style={{ fontSize:10, color:C.teal, fontWeight:600 }}>via Iryss WhatsApp</span>}
              </div>
              <span style={{ fontSize:11, fontWeight:700, padding:"3px 9px", borderRadius:20, background:a.confirmed?"rgba(16,185,129,.1)":"rgba(245,158,11,.1)", color:a.confirmed?C.green:C.amber }}>
                {a.confirmed?"Confirmed":"Pending"}
              </span>
            </div>
          ))}
        </DrillPanel>
      )}

      {drill==="urgent-messages"&&(
        <DrillPanel title="Urgent Messages" sub={`${urgentMessages.length} conversation${urgentMessages.length!==1?"s":""} need your attention`} onClose={()=>setDrill(null)} onFullPage={()=>{ setDrill(null); goNav("inbox"); }}>
          {urgentMessages.length===0?(
            <div style={{ textAlign:"center", padding:"48px 0", color:C.slate, fontSize:14 }}>
              <div style={{ fontSize:36, marginBottom:12 }}>✅</div>
              No urgent messages right now — all clear!
            </div>
          ):(
            <>
              <div style={{ background:"rgba(239,68,68,.05)", border:"1px solid rgba(239,68,68,.12)", borderRadius:12, padding:"14px 16px", marginBottom:20, display:"flex", alignItems:"center", gap:10 }}>
                <span style={{ width:10, height:10, borderRadius:"50%", background:C.red, display:"inline-block", flexShrink:0, animation:"pulseDot 1.5s ease-in-out infinite, pulseRing 1.5s ease-in-out infinite" }} />
                <div style={{ fontSize:13, color:C.red, fontWeight:600 }}>These patients have sent inbound messages with urgent or negative sentiment that have not yet been replied to.</div>
              </div>
              {[...urgentMessages].sort((a,b)=>new Date(b.thread.slice(-1)[0]?.sent_at||0)-new Date(a.thread.slice(-1)[0]?.sent_at||0)).map((m,i,arr)=>{
                const lastMsg = m.thread.filter(t=>t.from==='patient').slice(-1)[0];
                return (
                  <div key={m.id} style={{ padding:"14px 0", borderBottom:i<arr.length-1?`1px solid ${C.border}`:"none" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:8 }}>
                      <Avatar initials={m.initials} bg={m.sentiment==='urgent'?C.red:C.amber} size={38} />
                      <div style={{ flex:1 }}>
                        <div style={{ fontWeight:700, fontSize:14, color:C.navy, display:"flex", alignItems:"center", gap:8 }}>
                          {m.patient}
                          {m.sentiment==='urgent'
                            ? <span style={{ fontSize:10, fontWeight:700, color:C.red, background:"rgba(239,68,68,.1)", padding:"2px 8px", borderRadius:20, animation:"pulseDot 1.5s ease-in-out infinite" }}>🚨 Urgent</span>
                            : <span style={{ fontSize:10, fontWeight:700, color:C.amber, background:"rgba(245,158,11,.1)", padding:"2px 8px", borderRadius:20 }}>⚠️ Concerned</span>
                          }
                        </div>
                        <div style={{ fontSize:11, color:C.slateLight, marginTop:2 }}>{m.time}</div>
                      </div>
                      <button onClick={()=>{ setSelectedThread(m); setDrill(null); goNav("inbox"); }} style={{ background:`linear-gradient(135deg,${C.teal},${C.tealLt})`, color:"#fff", border:"none", borderRadius:10, padding:"8px 16px", fontWeight:700, fontSize:12, cursor:"pointer", fontFamily:F, boxShadow:"0 2px 8px rgba(8,145,178,.3)", flexShrink:0 }}>
                        Reply Now →
                      </button>
                    </div>
                    {lastMsg&&(
                      <div style={{ background:"#F7FAFC", border:`1px solid ${C.border}`, borderRadius:10, padding:"10px 14px", fontSize:13, color:C.navy, lineHeight:1.6, marginLeft:50, borderLeft:`3px solid ${m.sentiment==='urgent'?C.red:C.amber}` }}>
                        "{lastMsg.text}"
                      </div>
                    )}
                  </div>
                );
              })}
            </>
          )}
        </DrillPanel>
      )}

      {drill==="confirmed-appts"&&(
        <DrillPanel title="Confirmed Appointments" sub={`${APPOINTMENTS.filter(a=>a.confirmed).length} confirmed today`} onClose={()=>setDrill(null)}>
          {APPOINTMENTS.filter(a=>a.confirmed).map((a,i,arr)=>(
            <div key={i} style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 0", borderBottom:i<arr.length-1?`1px solid ${C.border}`:"none" }}>
              <div style={{ width:46, textAlign:"center", background:"rgba(16,185,129,.08)", borderRadius:8, padding:"6px 0", flexShrink:0 }}>
                <div style={{ fontSize:13, fontWeight:800, color:C.green }}>{a.time}</div>
              </div>
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:600, fontSize:14 }}>{a.patient}</div>
                <div style={{ fontSize:12, color:C.slate }}>{a.type} · {a.optician}</div>
                {a.viaIryss&&<span style={{ fontSize:10, color:C.teal, fontWeight:600 }}>via Iryss WhatsApp</span>}
              </div>
              <span style={{ fontSize:11, fontWeight:700, padding:"3px 9px", borderRadius:20, background:"rgba(16,185,129,.1)", color:C.green }}>✓ Confirmed</span>
            </div>
          ))}
        </DrillPanel>
      )}

      {drill==="no-show-risk"&&(
        <DrillPanel title="No-Show Risk" sub={`${noShowRisk.length} unconfirmed appointment${noShowRisk.length!==1?"s":""} in next 24 hours`} onClose={()=>setDrill(null)}>
          <div style={{ background:"rgba(239,68,68,.05)", border:"1px solid rgba(239,68,68,.12)", borderRadius:12, padding:"14px 16px", marginBottom:20 }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
              <div>
                <div style={{ fontSize:13, fontWeight:700, color:C.red, marginBottom:4 }}>Estimated revenue at risk</div>
                <div style={{ fontSize:26, fontWeight:800, color:C.red, letterSpacing:-1 }}>£{noShowRisk.reduce((a,p)=>a+p.revenue,0)}</div>
              </div>
              <div style={{ fontSize:28 }}>⚠️</div>
            </div>
            <div style={{ fontSize:12, color:C.slate, marginTop:8, lineHeight:1.6 }}>Send confirmation messages now to reduce no-show likelihood. Practices using Iryss reminders see up to 40% fewer no-shows.</div>
          </div>
          {noShowRisk.map((a,i,arr)=>(
            <div key={i} style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 0", borderBottom:i<arr.length-1?`1px solid ${C.border}`:"none" }}>
              <div style={{ width:46, textAlign:"center", background:"rgba(239,68,68,.08)", borderRadius:8, padding:"6px 0", flexShrink:0 }}>
                <div style={{ fontSize:13, fontWeight:800, color:C.red }}>{a.time}</div>
              </div>
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:600, fontSize:14 }}>{a.patient}</div>
                <div style={{ fontSize:12, color:C.slate }}>{a.type} · {a.optician}</div>
                <div style={{ fontSize:11, color:C.slate, marginTop:2 }}>Revenue at risk: <span style={{ color:C.red, fontWeight:700 }}>£{a.revenue}</span></div>
              </div>
              <button onClick={()=>openConfirmationWA(a,`risk-${i}`)} style={{ fontSize:12, fontWeight:700, padding:"7px 14px", borderRadius:10, border:"none", background:confirmSent[`appt-risk-${i}`]?"rgba(16,185,129,.1)":"rgba(37,211,102,.1)", color:confirmSent[`appt-risk-${i}`]?C.green:"#16a34a", cursor:"pointer" }}>
                {confirmSent[`appt-risk-${i}`]?"✓ Sent":"Send reminder"}
              </button>
            </div>
          ))}
          {noShowRisk.length===0&&(
            <div style={{ textAlign:"center", padding:"32px 0", color:C.slate, fontSize:14 }}>All appointments confirmed — no risk today 🎉</div>
          )}
        </DrillPanel>
      )}

      {drill==="iryss-appts"&&(
        <DrillPanel title="Booked via Iryss WhatsApp" sub={`${APPOINTMENTS.filter(a=>a.viaIryss).length} appointments this month`} onClose={()=>setDrill(null)}>
          <div style={{ background:"rgba(139,92,246,.05)", border:"1px solid rgba(139,92,246,.12)", borderRadius:12, padding:"14px 16px", marginBottom:20 }}>
            <div style={{ fontSize:12, color:C.slate, lineHeight:1.6 }}>These appointments were booked through Iryss WhatsApp re-engagement — patients who would otherwise not have returned.</div>
          </div>
          {APPOINTMENTS.filter(a=>a.viaIryss).map((a,i,arr)=>(
            <div key={i} style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 0", borderBottom:i<arr.length-1?`1px solid ${C.border}`:"none" }}>
              <Avatar initials={a.patient.split(" ").map(w=>w[0]).join("").slice(0,2)} bg={C.purple} size={38} />
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:600, fontSize:14 }}>{a.patient}</div>
                <div style={{ fontSize:12, color:C.slate }}>{a.type} · {a.time} · {a.optician}</div>
              </div>
              <span style={{ fontSize:10, color:C.purple, fontWeight:600, background:"rgba(139,92,246,.1)", padding:"3px 9px", borderRadius:20 }}>via Iryss ✓</span>
            </div>
          ))}
        </DrillPanel>
      )}

      {drill==="conversations"&&(
        <DrillPanel title="Conversations Handled" sub="142 AI conversations this month" onClose={()=>setDrill(null)}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:20 }}>
            {[{label:"Booking enquiries",value:"61",c:C.teal},{label:"Product questions",value:"44",c:C.purple},{label:"Appointment changes",value:"24",c:C.amber},{label:"Escalated to human",value:"3",c:C.red}].map(s=>(
              <div key={s.label} style={{ background:C.cream, borderRadius:10, padding:"12px 14px", border:`1px solid ${C.border}`, textAlign:"center" }}>
                <div style={{ fontSize:22, fontWeight:800, color:s.c, letterSpacing:-0.5 }}>{s.value}</div>
                <div style={{ fontSize:11, color:C.slate, marginTop:2 }}>{s.label}</div>
              </div>
            ))}
          </div>
          {[
            { patient:"Jim Bru",     topic:"Multifocal contact lens enquiry → appointment booked", time:"Today 14:32",  resolved:true  },
            { patient:"Ciara Murphy",   topic:"Asked about eye test frequency for children",           time:"Today 11:00",  resolved:true  },
            { patient:"Sarah Flynn",    topic:"Appointment reminder confirmation",                     time:"Today 09:00",  resolved:true  },
            { patient:"Robert Hughes",  topic:"Query about varifocal adaptation period",               time:"Yesterday",    resolved:true  },
            { patient:"Emma Wilson",    topic:"Asked about contact lens trial process",                time:"Yesterday",    resolved:true  },
            { patient:"Margaret Flynn", topic:"Reported blurry vision — escalated to clinician",       time:"Today 09:18",  resolved:false },
          ].map((c,i,arr)=>(
            <div key={i} style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 0", borderBottom:i<arr.length-1?`1px solid ${C.border}`:"none" }}>
              <Avatar initials={c.patient.split(" ").map(w=>w[0]).join("").slice(0,2)} bg={c.resolved?C.teal:C.red} size={36} />
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:600, fontSize:13 }}>{c.patient}</div>
                <div style={{ fontSize:12, color:C.slate, marginTop:2 }}>{c.topic}</div>
                <div style={{ fontSize:11, color:C.slateLight, marginTop:2 }}>{c.time}</div>
              </div>
              <span style={{ fontSize:11, fontWeight:700, padding:"3px 9px", borderRadius:20, background:c.resolved?"rgba(16,185,129,.1)":"rgba(239,68,68,.1)", color:c.resolved?C.green:C.red }}>
                {c.resolved?"Resolved":"Escalated"}
              </span>
            </div>
          ))}
        </DrillPanel>
      )}

      {drill==="escalated"&&(
        <DrillPanel title="Escalated to Human" sub="3 conversations this month" onClose={()=>setDrill(null)}>
          <div style={{ background:"rgba(245,158,11,.05)", border:"1px solid rgba(245,158,11,.15)", borderRadius:12, padding:"12px 16px", marginBottom:20 }}>
            <div style={{ fontSize:12, color:C.slate, lineHeight:1.6 }}>These conversations were flagged by the AI as requiring human clinical judgment and paused automatically.</div>
          </div>
          {[
            { patient:"Margaret Flynn", reason:"Reported blurry vision on left side",   time:"Today 09:18",  status:"Urgent"   },
            { patient:"Robert Cairns",  reason:"Mentioned eye pain after new glasses",  time:"8 Mar 14:32",  status:"Resolved" },
            { patient:"Ann Hughes",     reason:"Asked about symptoms of glaucoma",       time:"5 Mar 11:05",  status:"Resolved" },
          ].map((e,i,arr)=>(
            <div key={i} style={{ display:"flex", alignItems:"center", gap:12, padding:"14px 0", borderBottom:i<arr.length-1?`1px solid ${C.border}`:"none" }}>
              <Avatar initials={e.patient.split(" ").map(w=>w[0]).join("")} bg={i===0?C.red:C.slateLight} size={38} />
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:600, fontSize:14 }}>{e.patient}</div>
                <div style={{ fontSize:12, color:C.slate, marginTop:2 }}>{e.reason}</div>
                <div style={{ fontSize:11, color:C.slateLight, marginTop:2 }}>{e.time}</div>
              </div>
              <span style={{ fontSize:11, fontWeight:700, padding:"3px 9px", borderRadius:20, background:i===0?"rgba(239,68,68,.1)":"rgba(16,185,129,.1)", color:i===0?C.red:C.green }}>
                {e.status}
              </span>
            </div>
          ))}
        </DrillPanel>
      )}

      {/* ── Myopia patient detail drawer ── */}
      {myopiaDetail&&(()=>{
        const p = myopiaDetail;
        const s = MYOPIA_STATUS[p.status] || MYOPIA_STATUS.stable;
        const serOD = p.sphereOD > 0 ? `+${p.sphereOD.toFixed(2)}` : p.sphereOD.toFixed(2);
        const serOS = p.sphereOS > 0 ? `+${p.sphereOS.toFixed(2)}` : p.sphereOS.toFixed(2);
        // AI recommendation
        let aiRec;
        if (p.status==="progressing")      aiRec = { tone:"red",   text:`AL growth ${p.alChange?.toFixed(2)} mm/yr exceeds 0.20 mm threshold. Consider switching from ${p.treatment} or adding atropine 0.05% combination therapy. Reinforce outdoor time (currently ${p.outdoorHrs} hrs/day — aim for ≥2 hrs).` };
        else if (p.status==="slowing")     aiRec = { tone:"amber", text:`Borderline progression (${p.alChange?.toFixed(2)} mm/yr). Reinforce compliance, check lens fit, and consider 3-month review instead of 6-month.` };
        else if (p.status==="responding")  aiRec = { tone:"green", text:`Excellent response to ${p.treatment}. Continue current regimen. Next AL measurement at ${p.nextReview}.` };
        else if (p.status==="at-risk")     aiRec = { tone:"purple",text:`Pre-myopic with AL growth ${p.alChange?.toFixed(2)} mm/yr and ${p.parentalMyopia.toLowerCase()} parental myopia. Lifestyle advice now; reassess at ${p.nextReview}. Consider early treatment if SER crosses -0.50 D.` };
        else if (p.status==="lapsed")      aiRec = { tone:"red",   text:`Last seen ${p.lastReview} — review was due ${p.nextReview}. WhatsApp parent now to rebook before progression accelerates.` };
        else if (p.status==="trial")       aiRec = { tone:"teal",  text:`Trial/fitting phase for ${p.treatment}. Confirm adaptation, comfort and compliance at 1-month follow-up, then set baseline AL.` };
        else                               aiRec = { tone:"slate", text:`Stable. Continue annual review.` };
        const toneMap = { red:C.red, amber:C.amber, green:C.green, purple:C.purple, teal:C.teal, slate:C.slate };
        const recColor = toneMap[aiRec.tone];
        return (
          <DrillPanel title={p.name} sub={`Age ${p.age} · ${p.treatment} · ${s.label}`} onClose={()=>setMyopiaDetail(null)}>
            {/* AI recommendation */}
            <div style={{ background:`${recColor}14`, border:`1px solid ${recColor}33`, borderRadius:12, padding:"14px 16px", marginBottom:18, display:"flex", gap:10 }}>
              <div style={{ width:28, height:28, borderRadius:8, background:recColor, color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, flexShrink:0, fontWeight:700 }}>◈</div>
              <div>
                <div style={{ fontSize:10, fontWeight:700, color:recColor, textTransform:"uppercase", letterSpacing:0.8, marginBottom:3 }}>IRYSS AI RECOMMENDATION</div>
                <div style={{ fontSize:13, color:C.navy, lineHeight:1.5 }}>{aiRec.text}</div>
              </div>
            </div>

            {/* Clinical snapshot */}
            <div style={{ fontSize:11, fontWeight:600, color:C.slateLight, textTransform:"uppercase", letterSpacing:0.8, marginBottom:10 }}>Clinical Snapshot</div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:20 }}>
              {[
                { label:"Refraction OD (SER)", value:`${serOD} D` },
                { label:"Refraction OS (SER)", value:`${serOS} D` },
                { label:"Axial length OD",     value:`${p.axialOD.toFixed(2)} mm` },
                { label:"Axial length OS",     value:`${p.axialOS.toFixed(2)} mm` },
                { label:"AL growth (12 mo)",   value: p.alChange===null ? "—" : `${p.alChange.toFixed(2)} mm/yr`, color: p.alChange===null?C.slate : (p.alChange<0.10?C.green: p.alChange<0.20?C.amber:C.red) },
                { label:"Compliance",          value:p.compliance },
                { label:"Parental myopia",     value:p.parentalMyopia },
                { label:"Outdoor time",        value:`${p.outdoorHrs} hrs/day` },
              ].map((f,i)=>(
                <div key={i} style={{ background:C.bg, borderRadius:10, padding:"10px 12px", border:`1px solid ${C.border}` }}>
                  <div style={{ fontSize:10.5, color:C.slateLight, fontWeight:600, textTransform:"uppercase", letterSpacing:0.6, marginBottom:3 }}>{f.label}</div>
                  <div style={{ fontSize:14, color:f.color||C.navy, fontWeight:700, fontFamily:"ui-monospace,monospace" }}>{f.value}</div>
                </div>
              ))}
            </div>

            {/* Treatment history */}
            <div style={{ fontSize:11, fontWeight:600, color:C.slateLight, textTransform:"uppercase", letterSpacing:0.8, marginBottom:10 }}>Treatment &amp; Review Timeline</div>
            <div style={{ background:C.bg, borderRadius:12, border:`1px solid ${C.border}`, padding:"12px 14px", marginBottom:20 }}>
              <div style={{ display:"flex", justifyContent:"space-between", fontSize:13, padding:"6px 0", borderBottom:`1px solid ${C.border}` }}>
                <span style={{ color:C.slate }}>Treatment start</span><span style={{ fontWeight:600, color:C.navy }}>{p.treatmentStart}</span>
              </div>
              <div style={{ display:"flex", justifyContent:"space-between", fontSize:13, padding:"6px 0", borderBottom:`1px solid ${C.border}` }}>
                <span style={{ color:C.slate }}>Last review</span><span style={{ fontWeight:600, color:C.navy }}>{p.lastReview}</span>
              </div>
              <div style={{ display:"flex", justifyContent:"space-between", fontSize:13, padding:"6px 0" }}>
                <span style={{ color:C.slate }}>Next review due</span><span style={{ fontWeight:700, color:p.status==="lapsed"?C.red:C.teal }}>{p.nextReview}</span>
              </div>
            </div>

            {/* Parent contact */}
            <div style={{ fontSize:11, fontWeight:600, color:C.slateLight, textTransform:"uppercase", letterSpacing:0.8, marginBottom:10 }}>Parent / Guardian</div>
            <div style={{ background:C.bg, borderRadius:12, border:`1px solid ${C.border}`, padding:"12px 14px", marginBottom:20, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
              <div>
                <div style={{ fontSize:13, fontWeight:700, color:C.navy }}>{p.parent}</div>
                <div style={{ fontSize:12, color:C.slate, fontFamily:"ui-monospace,monospace" }}>{p.phone}</div>
              </div>
              <button onClick={()=>{ showToast(`WhatsApp opened — messaging ${p.parent}`); setMyopiaDetail(null); goNav("inbox"); }}
                style={{ background:"#25D366", color:"#fff", border:"none", borderRadius:10, padding:"9px 14px", fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:F, display:"flex", alignItems:"center", gap:6 }}>
                WhatsApp parent →
              </button>
            </div>

            {/* Actions */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
              <button onClick={()=>showToast(`Review booked for ${p.name}`)}
                style={{ background:`linear-gradient(135deg,${C.teal},${C.tealLt})`, color:"#fff", border:"none", borderRadius:10, padding:"12px 14px", fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:F, boxShadow:"0 4px 12px rgba(8,145,178,.2)" }}>
                Book 6-month review
              </button>
              <button onClick={()=>showToast(`Progress report generated for ${p.parent}`)}
                style={{ background:C.card, color:C.navy, border:`1px solid ${C.border}`, borderRadius:10, padding:"12px 14px", fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:F }}>
                Parent progress report
              </button>
            </div>
          </DrillPanel>
        );
      })()}

      {/* ── Recall drill panels ── */}
      {drill==="recall-due"&&(()=>{
        return (
          <DrillPanel title="Patients Due for Recall" sub={`${recallPatients.length} patients · 8+ months since last visit`} onClose={()=>setDrill(null)} onFullPage={()=>{setDrill(null);goNav("recalls");}}>
            <div style={{ background:`rgba(8,145,178,.06)`, border:`1px solid rgba(8,145,178,.15)`, borderRadius:12, padding:"10px 14px", marginBottom:20 }}>
              <div style={{ fontSize:12, color:C.slate }}>These patients are due or approaching their recall date. Sending a WhatsApp now increases return rate by up to 60%.</div>
            </div>
            {recallPatients.map((p,i)=>{
              const months = parseMonthsAgo(p.lastVisit);
              const monthsUntilDue = 24-months;
              const dueDate = new Date(); dueDate.setMonth(dueDate.getMonth()+monthsUntilDue);
              const dueDateStr = dueDate.toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"});
              return (
                <div key={p.id} style={{ display:"flex", alignItems:"center", gap:12, padding:"13px 0", borderBottom:i<recallPatients.length-1?`1px solid ${C.border}`:"none" }}>
                  <Avatar initials={p.initials} bg={p.risk==="high"?C.red:p.risk==="medium"?C.amber:C.green} size={36} />
                  <div style={{ flex:1 }}>
                    <div style={{ fontWeight:600, fontSize:14, color:C.navy }}>{p.name}</div>
                    <div style={{ fontSize:12, color:C.slate, marginTop:2 }}>Last visit: {p.lastVisit} · Due: {dueDateStr}</div>
                    <div style={{ fontSize:11, color:C.slateLight, marginTop:1 }}>Risk score: {p.riskScore}/100</div>
                  </div>
                  <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:5 }}>
                    <Chip color={riskFg[p.risk]}>{riskLabel[p.risk]}</Chip>
                    {waSent[p.id]
                      ? <span style={{ fontSize:11, color:C.green, fontWeight:600 }}>Sent ✓</span>
                      : <button onClick={()=>{setDrill(null);openRecallWA(p);}} style={{ background:`linear-gradient(135deg,${C.teal},${C.tealLt})`, color:"#fff", border:"none", borderRadius:8, padding:"5px 11px", fontSize:11, fontWeight:700, cursor:"pointer", fontFamily:F }}>Send Recall WhatsApp</button>
                    }
                  </div>
                </div>
              );
            })}
            {recallPatients.length===0&&<div style={{ textAlign:"center", color:C.slate, padding:"40px 0", fontSize:14 }}>No patients currently due for recall.</div>}
          </DrillPanel>
        );
      })()}

      {drill==="recall-overdue"&&(()=>{
        return (
          <DrillPanel title="Overdue Recalls" sub={`${overdueRecall.length} patients · past 24-month recall date`} onClose={()=>setDrill(null)} onFullPage={()=>{setDrill(null);goNav("recalls");}}>
            <div style={{ background:"rgba(239,68,68,.06)", border:"1px solid rgba(239,68,68,.15)", borderRadius:12, padding:"10px 14px", marginBottom:20 }}>
              <div style={{ fontSize:12, color:C.red, fontWeight:600 }}>These patients are past their recall date and should be contacted urgently.</div>
            </div>
            {overdueRecall.map((p,i)=>{
              const monthsOverdue = Math.abs(24 - parseMonthsAgo(p.lastVisit));
              return (
                <div key={p.id} style={{ display:"flex", alignItems:"center", gap:12, padding:"13px 0", borderBottom:i<overdueRecall.length-1?`1px solid ${C.border}`:"none" }}>
                  <Avatar initials={p.initials} bg={C.red} size={36} />
                  <div style={{ flex:1 }}>
                    <div style={{ fontWeight:600, fontSize:14, color:C.navy }}>{p.name}</div>
                    <div style={{ fontSize:12, color:C.slate, marginTop:2 }}>{p.product} · Last visit: {p.lastVisit}</div>
                    <div style={{ fontSize:12, color:C.red, fontWeight:600, marginTop:2 }}>{monthsOverdue} month{monthsOverdue!==1?"s":""} overdue</div>
                  </div>
                  <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:5 }}>
                    <span style={{ fontSize:11, color:C.slate }}>Score: {p.riskScore}/100</span>
                    {waSent[p.id]
                      ? <span style={{ fontSize:11, color:C.green, fontWeight:600 }}>Sent ✓</span>
                      : <button onClick={()=>{setDrill(null);openRecallWA(p);}} style={{ background:`linear-gradient(135deg,${C.red},#F97316)`, color:"#fff", border:"none", borderRadius:8, padding:"5px 11px", fontSize:11, fontWeight:700, cursor:"pointer", fontFamily:F }}>Send Urgent Recall</button>
                    }
                  </div>
                </div>
              );
            })}
            {overdueRecall.length===0&&<div style={{ textAlign:"center", color:C.slate, padding:"40px 0", fontSize:14 }}>No overdue patients — great work!</div>}
          </DrillPanel>
        );
      })()}

      {drill==="recall-this-week"&&(()=>{
        const thisWeek = recallPatients.slice(0,3);
        const days = ["Mon","Tue","Wed","Thu","Fri"];
        return (
          <DrillPanel title="Sending This Week" sub={`${thisWeek.length} recalls scheduled · automated by Iryss`} onClose={()=>setDrill(null)}>
            <div style={{ background:"rgba(245,158,11,.06)", border:"1px solid rgba(245,158,11,.2)", borderRadius:12, padding:"10px 14px", marginBottom:20 }}>
              <div style={{ fontSize:12, color:C.slate }}>Iryss will automatically send these recall WhatsApp messages on the scheduled day. You can also send them manually now.</div>
            </div>
            {thisWeek.map((p,i)=>{
              const sendDay = days[i % days.length];
              const msgPreview = `Hi ${p.name.split(" ")[0]} 👋 It's been a while since your last eye test at Bright Eyes — we'd love to welcome you back! Reply to book your appointment 😊`;
              return (
                <div key={p.id} style={{ padding:"14px 0", borderBottom:i<thisWeek.length-1?`1px solid ${C.border}`:"none" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:10 }}>
                    <Avatar initials={p.initials} bg={C.amber} size={36} />
                    <div style={{ flex:1 }}>
                      <div style={{ fontWeight:600, fontSize:14, color:C.navy }}>{p.name}</div>
                      <div style={{ fontSize:12, color:C.slate, marginTop:1 }}>Last visit: {p.lastVisit} · {p.phone}</div>
                    </div>
                    <div style={{ background:"rgba(245,158,11,.12)", color:C.amber, fontWeight:700, fontSize:12, padding:"4px 10px", borderRadius:20, flexShrink:0 }}>📅 {sendDay}</div>
                  </div>
                  <div style={{ background:"#F7FAFC", borderRadius:10, padding:"10px 14px", fontSize:12, color:C.slate, fontStyle:"italic", lineHeight:1.6 }}>
                    "{msgPreview}"
                  </div>
                </div>
              );
            })}
            {thisWeek.length===0&&<div style={{ textAlign:"center", color:C.slate, padding:"40px 0", fontSize:14 }}>No recalls scheduled this week.</div>}
          </DrillPanel>
        );
      })()}

      {drill==="recall-revenue"&&(()=>{
        const total = recallPatients.reduce((a,p)=>a+p.revenue,0);
        return (
          <DrillPanel title="Recall Revenue Breakdown" sub={`£${total.toLocaleString()} potential if all patients return`} onClose={()=>setDrill(null)} onFullPage={()=>{setDrill(null);goNav("revenue");}}>
            <div style={{ background:"rgba(16,185,129,.06)", border:"1px solid rgba(16,185,129,.2)", borderRadius:12, padding:"10px 14px", marginBottom:20 }}>
              <div style={{ fontSize:12, color:C.slate }}>Revenue shown is each patient's last spend value — a strong indicator of their next appointment value.</div>
            </div>
            {[...recallPatients].sort((a,b)=>b.revenue-a.revenue).map((p,i,arr)=>(
              <div key={p.id} style={{ display:"flex", alignItems:"center", gap:12, padding:"13px 0", borderBottom:i<arr.length-1?`1px solid ${C.border}`:"none" }}>
                <Avatar initials={p.initials} bg={p.risk==="high"?C.red:p.risk==="medium"?C.amber:C.green} size={36} />
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:600, fontSize:14, color:C.navy }}>{p.name}</div>
                  <div style={{ fontSize:12, color:C.slate, marginTop:2 }}>{p.product}</div>
                  <div style={{ height:5, background:C.border, borderRadius:3, marginTop:6, overflow:"hidden", maxWidth:160 }}>
                    <div style={{ width:`${Math.round((p.revenue/Math.max(...recallPatients.map(x=>x.revenue)))*100)}%`, height:"100%", background:p.risk==="high"?C.red:p.risk==="medium"?C.amber:C.green, borderRadius:3 }} />
                  </div>
                </div>
                <div style={{ textAlign:"right" }}>
                  <div style={{ fontSize:16, fontWeight:800, color:C.navy }}>£{p.revenue}</div>
                  <Chip color={riskFg[p.risk]}>{riskLabel[p.risk]}</Chip>
                </div>
              </div>
            ))}
            <div style={{ marginTop:18, paddingTop:16, borderTop:`2px solid ${C.border}`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <div style={{ fontWeight:700, fontSize:15, color:C.navy }}>Total potential revenue</div>
              <div style={{ fontSize:22, fontWeight:900, color:C.green, letterSpacing:-0.5 }}>£{total.toLocaleString()}</div>
            </div>
          </DrillPanel>
        );
      })()}

      {/* ── ⌘K Command Palette ── */}
      {cmdOpen&&(()=>{
        const q = cmdQuery.toLowerCase().trim();
        const mainNav = [
          { t:"Dashboard",       hint:"View Practice Score & KPIs",     icon:"◈", run:()=>goNav("dashboard") },
          { t:"Today's Tasks",   hint:"Every action queued for today",  icon:"✓", run:()=>goNav("tasks") },
          { t:"Patients",        hint:"All 125 records",                icon:"◎", run:()=>goNav("patients") },
          { t:"Inbox",           hint:"WhatsApp threads",               icon:"◻", run:()=>goNav("inbox") },
          { t:"Recalls",         hint:"Due & overdue patients",         icon:"◷", run:()=>goNav("recalls") },
          { t:"AI Scribe (beta)",hint:"Dictate exam → clinical record", icon:"🎤", run:()=>goNav("scribe") },
        ].map(o=>({...o, group:"Main"}));
        const moduleNav = [
          { t:"GOS Claims",      hint:"Zero-reject claim engine",       icon:"◨", run:()=>goNav("claims") },
          { t:"Myopia Clinic",   hint:"Paediatric myopia patients",     icon:"◉", run:()=>goNav("myopia") },
          { t:"Reviews",         hint:"Google review requests",         icon:"◆", run:()=>goNav("reviews") },
          { t:"Intelligence",    hint:"Competitor mentions & win-backs",icon:"🎯", run:()=>goNav("intelligence") },
          { t:"Revenue",         hint:"Revenue recovered & at risk",    icon:"£", run:()=>goNav("revenue") },
          { t:"Settings",        hint:"Practice details & integrations",icon:"⚙", run:()=>goNav("settings") },
        ].map(o=>({...o, group:"Modules & Settings"}));
        const navOpts = [...mainNav, ...moduleNav];
        const actOpts = [
          { t:"Generate compliance report", hint:"Print-ready GOC-style PDF", icon:"🖨", run:()=>{ goNav("recalls"); setTimeout(()=>generateComplianceReport(complianceRate, recallPatients, recallPatients.filter(p=>waSent[p.id])), 100); } },
          { t:"Send all win-back messages", hint:"Competitor-mention recovery", icon:"💬", run:()=>goNav("intelligence") },
          { t:"Toggle auto-recall",         hint:autoSend?"Currently ON":"Currently OFF", icon:"⚡", run:()=>setAutoSend(v=>!v) },
          { t:"Import patient CSV",         hint:"Add / migrate patients",     icon:"↑", run:()=>setShowImport(true) },
        ].map(o=>({...o, group:"Actions"}));
        const patOpts = PATIENTS.map(p=>({ t:p.name, hint:`${p.age?`Age ${p.age} · `:""}${p.lastVisit} · ${p.product||"patient"}`, icon:p.initials, run:()=>{ openTimeline(p); }, group:"Patients" }));
        const myopiaOpts = MYOPIA_PATIENTS.map(p=>({ t:p.name, hint:`Myopia · Age ${p.age} · ${p.treatment}`, icon:p.initials, run:()=>{ goNav("myopia"); setMyopiaDetail(p); }, group:"Myopia patients" }));
        const all = [...navOpts, ...actOpts, ...patOpts, ...myopiaOpts];
        const filtered = q ? all.filter(o=>o.t.toLowerCase().includes(q) || (o.hint||"").toLowerCase().includes(q) || o.group.toLowerCase().includes(q)).slice(0,14) : all.slice(0,14);
        const safeSel = Math.min(cmdSel, Math.max(0, filtered.length-1));
        const runOpt = (opt) => { if (!opt) return; setCmdOpen(false); opt.run(); };
        // group the filtered list
        const grouped = filtered.reduce((m,o)=>{ (m[o.group] = m[o.group] || []).push(o); return m; }, {});
        return (
          <div onClick={()=>setCmdOpen(false)} style={{ position:"fixed", inset:0, background:"rgba(4,10,24,.55)", zIndex:1000, display:"flex", alignItems:"flex-start", justifyContent:"center", paddingTop:"14vh", backdropFilter:"blur(6px)", fontFamily:F }}>
            <div onClick={e=>e.stopPropagation()} style={{ background:"#fff", borderRadius:16, width:580, maxWidth:"92vw", boxShadow:"0 30px 80px rgba(0,0,0,.35), 0 0 0 1px rgba(8,145,178,.2)", overflow:"hidden", animation:"fadeInUp .15s ease-out" }}>
              <div style={{ display:"flex", alignItems:"center", gap:10, padding:"14px 18px", borderBottom:`1px solid ${C.border}` }}>
                <span style={{ fontSize:16, color:C.slateLight }}>⌕</span>
                <input autoFocus value={cmdQuery}
                  onChange={e=>{ setCmdQuery(e.target.value); setCmdSel(0); }}
                  onKeyDown={e=>{
                    if (e.key==="ArrowDown") { e.preventDefault(); setCmdSel(s=>Math.min(filtered.length-1, s+1)); }
                    else if (e.key==="ArrowUp") { e.preventDefault(); setCmdSel(s=>Math.max(0, s-1)); }
                    else if (e.key==="Enter")  { e.preventDefault(); runOpt(filtered[safeSel]); }
                  }}
                  placeholder="Jump to a page, patient, or action…"
                  style={{ flex:1, border:"none", outline:"none", fontSize:15, fontFamily:F, color:C.navy, background:"transparent" }}
                />
                <span style={{ fontSize:10, fontWeight:700, color:C.slateLight, background:C.bg, padding:"4px 8px", borderRadius:6, border:`1px solid ${C.border}`, letterSpacing:0.3 }}>ESC</span>
              </div>
              <div style={{ maxHeight:380, overflowY:"auto", padding:"8px 0" }}>
                {filtered.length===0 ? (
                  <div style={{ padding:"40px 20px", textAlign:"center", color:C.slate, fontSize:13 }}>
                    No matches for <b>"{cmdQuery}"</b>. Try a page name or a patient name.
                  </div>
                ) : Object.entries(grouped).map(([group, items])=>(
                  <div key={group}>
                    <div style={{ fontSize:10, fontWeight:700, color:C.slateLight, textTransform:"uppercase", letterSpacing:1, padding:"10px 18px 4px" }}>{group}</div>
                    {items.map(opt=>{
                      const i = filtered.indexOf(opt);
                      const active = i===safeSel;
                      return (
                        <div key={group+"-"+opt.t} onMouseEnter={()=>setCmdSel(i)} onClick={()=>runOpt(opt)}
                          style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 18px", cursor:"pointer", background:active?"rgba(8,145,178,.08)":"transparent", borderLeft:active?`3px solid ${C.teal}`:"3px solid transparent" }}>
                          <div style={{ width:26, height:26, borderRadius:7, background:active?"rgba(8,145,178,.15)":C.bg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:700, color:active?C.teal:C.slate, fontFamily:F, flexShrink:0 }}>{opt.icon}</div>
                          <div style={{ flex:1, minWidth:0 }}>
                            <div style={{ fontSize:13.5, fontWeight:600, color:C.navy, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{opt.t}</div>
                            {opt.hint && <div style={{ fontSize:11, color:C.slateLight, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{opt.hint}</div>}
                          </div>
                          {active && <span style={{ fontSize:10, color:C.slateLight, fontWeight:600 }}>↵</span>}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:14, padding:"10px 18px", borderTop:`1px solid ${C.border}`, fontSize:11, color:C.slateLight, background:C.bg }}>
                <span><b style={{ color:C.slate }}>↑↓</b> navigate</span>
                <span><b style={{ color:C.slate }}>↵</b> select</span>
                <span><b style={{ color:C.slate }}>esc</b> close</span>
                <span style={{ marginLeft:"auto" }}>IRYSS · ⌘K</span>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ── WhatsApp modal ── */}
      {showSendWA&&(
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.4)", zIndex:950, display:"flex", alignItems:"center", justifyContent:"center", backdropFilter:"blur(4px)" }} onClick={()=>setShowSendWA(null)}>
          <div onClick={e=>e.stopPropagation()} style={{ background:C.white, borderRadius:20, padding:28, width:520, boxShadow:"0 40px 120px rgba(0,0,0,.4)", fontFamily:F }}>
            <div style={{ fontWeight:700, fontSize:17, marginBottom:4, letterSpacing:-0.4 }}>Send WhatsApp to {showSendWA.name}</div>
            <div style={{ fontSize:12, color:C.slate, marginBottom:16 }}>Risk: <span style={{ color:riskFg[showSendWA.risk], fontWeight:700 }}>{riskLabel[showSendWA.risk]}</span> · Last visit: {showSendWA.lastVisit}</div>
            <textarea value={waMsg} onChange={e=>setWaMsg(e.target.value)}
              style={{ width:"100%", height:180, border:`1px solid ${C.border}`, borderRadius:12, padding:14, fontSize:13, fontFamily:F, resize:"none", outline:"none", boxSizing:"border-box", lineHeight:1.65, color:C.navy }} />
            <div style={{ display:"flex", gap:10, marginTop:16 }}>
              <button onClick={()=>setShowSendWA(null)} style={{ flex:1, background:C.cream, border:`1px solid ${C.border}`, borderRadius:10, padding:12, fontWeight:600, fontSize:14, cursor:"pointer", fontFamily:F, color:C.navy }}>Cancel</button>
              <button onClick={()=>confirmSendWA(showSendWA.id)} style={{ flex:2, background:`linear-gradient(135deg,${C.teal},${C.tealLt})`, border:"none", borderRadius:10, padding:12, fontWeight:700, fontSize:14, cursor:"pointer", fontFamily:F, color:"#fff", boxShadow:"0 4px 14px rgba(8,145,178,.4)" }}>
                Send WhatsApp ✓
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
