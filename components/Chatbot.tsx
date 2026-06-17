'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Maximize2, Minimize2, RotateCcw, MessageSquare, GraduationCap, Briefcase, Brain, Users, Globe, MapPin, Stethoscope, CheckCircle, XCircle, UserCheck, Sparkles, Paperclip, FileUp } from 'lucide-react';
import { chatDB, ChatMessage } from '@/lib/db';

function validateInput(value: string, field: string): string | null {
  const v = value.trim();
  if (!v) return 'Please type something before submitting.';

  if (field === 'name') {
    if (!/^[a-zA-Z\s\-'.]{2,60}$/.test(v))
      return 'Please enter a valid name using letters only (e.g. "Rahul Kumar").';
    const words = v.split(/\s+/);
    if (words.length > 4)
      return 'That looks like a sentence. Please enter your real name only.';
    const stopWords = ['what', 'how', 'why', 'where', 'when', 'who', 'is', 'are', 'my', 'your', 'i', 'the', 'a', 'an', 'bro', 'sir', 'mam', 'please', 'can', 'tell', 'me', 'name'];
    if (words.some(w => stopWords.includes(w.toLowerCase())))
      return 'Please enter your real name only (e.g. "Priya Sharma").';
    return null;
  }

  if (field === 'age') {
    if (!/^\d+$/.test(v))
      return 'Age must be a number only. Please enter digits only (e.g. 22).';
    const age = Number(v);
    if (age < 10 || age > 80)
      return 'Please enter a valid age between 10 and 80.';
    return null;
  }

  if (field === 'phone') {
    const digits = v.replace(/[\s\-\(\)\+]/g, '');
    if (!/^\d{10,13}$/.test(digits))
      return 'Please enter a valid 10-digit phone number (e.g. 9876543210).';
    return null;
  }

  if (field === 'city' || field === 'custom_country') {
    if (!/^[a-zA-Z\s\-'.]{2,60}$/.test(v))
      return `Please enter a valid ${field === 'city' ? 'city' : 'country'} name (letters only).`;
    return null;
  }

  if (field === 'proposal') {
    if (v.length < 10)
      return 'Please provide a brief description (at least 10 characters).';
    return null;
  }

  if (v.length < 2) return 'Please enter at least 2 characters.';
  return null;
}

function sanitizeInput(value: string, field: string): string {
  let v = value.trim().replace(/\s+/g, ' ');
  if (['name', 'city', 'custom_country', 'organization'].includes(field))
    v = v.replace(/\b\w/g, c => c.toUpperCase());
  if (field === 'age')
    v = String(parseInt(v, 10));
  if (field === 'phone')
    v = v.replace(/[\s\-\(\)]/g, '');
  return v;
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [currentFlow, setCurrentFlow] = useState<string | null>(null);
  const [flowStep, setFlowStep] = useState(0);
  const [collectedData, setCollectedData] = useState<Record<string, any>>({});
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const mainOptions = [
    { label: 'Education', value: 'education', icon: GraduationCap },
    { label: 'Jobs', value: 'jobs', icon: Briefcase },
    { label: 'Skill Courses', value: 'skills', icon: Brain },
    { label: 'Collaboration', value: 'collaboration', icon: Users },
  ];

  const [dynamicOptions, setDynamicOptions] = useState(mainOptions);

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener('openChatbot', handleOpen);
    return () => window.removeEventListener('openChatbot', handleOpen);
  }, []);

  // Prevent scroll when chatbot is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Load history from IndexedDB
  useEffect(() => {
    const loadHistory = async () => {
      const history = await chatDB.getMessages();
      if (history.length > 0) {
        setMessages(history);
      } else {
        const initialMsg: ChatMessage = {
          type: 'bot',
          text: 'Hi,\nI’m GlofiHub AI Assistant.\nTell me what you’re looking for:',
          timestamp: Date.now()
        };
        setMessages([initialMsg]);
        await chatDB.saveMessage(initialMsg);
      }

      const savedFlow = await chatDB.getUserData('currentFlow');
      const savedStep = await chatDB.getUserData('flowStep');
      const savedData = await chatDB.getUserData('collectedData');
      if (savedFlow) setCurrentFlow(savedFlow);
      if (savedStep) setFlowStep(savedStep);
      if (savedData) setCollectedData(savedData);
    };
    loadHistory();
  }, []);

  const scrollToBottom = () => {
    requestAnimationFrame(() => {
      if (scrollAreaRef.current) {
        scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
      }
    });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [isOpen]);

  const addMessage = async (type: 'bot' | 'user', text: string) => {
    const newMsg: ChatMessage = { type, text, timestamp: Date.now() };
    setMessages(prev => [...prev, newMsg]);
    await chatDB.saveMessage(newMsg);
  };

  const askNext = (botText: string, options: any[] = []) => {
    setIsTyping(true);
    setTimeout(async () => {
      setIsTyping(false);
      await addMessage('bot', botText);
      setDynamicOptions(options);
    }, 1000);
  };

  const handleOption = async (label: string, value: string) => {
    await addMessage('user', label);
    setDynamicOptions([]);

    const newData = { ...collectedData, [currentFlow || 'initial']: value };
    setCollectedData(newData);
    await chatDB.saveUserData('collectedData', newData);

    if (!currentFlow) {
      setCurrentFlow(value);
      await chatDB.saveUserData('currentFlow', value);
      setFlowStep(1);
      await chatDB.saveUserData('flowStep', 1);

      if (value === 'education') {
        askNext('Great choice! Are you looking for options in India or Abroad?', [
          { label: 'India', value: 'india', icon: MapPin },
          { label: 'Abroad', value: 'abroad', icon: Globe }
        ]);
      } else if (value === 'jobs') {
        askNext('Excellent! Which region are you targeting?', [
          { label: 'Jobs in India', value: 'india', icon: MapPin },
          { label: 'Jobs Abroad', value: 'abroad', icon: Globe }
        ]);
      } else if (value === 'skills') {
        askNext('Skills are the new currency! What type of course are you interested in?', [
          { label: 'Technical', value: 'technical', icon: Brain },
          { label: 'Non-Technical', value: 'non-technical', icon: Users }
        ]);
      } else if (value === 'collaboration') {
        askNext('We love partnerships! What describes you best?', [
          { label: 'Institute Partnership', value: 'institute', icon: Users },
          { label: 'Influencer / Creator', value: 'influencer', icon: Sparkles },
          { label: 'Franchise / City Partner', value: 'franchise', icon: MapPin }
        ]);
      }
    } else {
      processStep(value);
    }
  };

  const processStep = async (value: string) => {
    const nextStep = flowStep + 1;
    setFlowStep(nextStep);
    await chatDB.saveUserData('flowStep', nextStep);

    // Save with descriptive keys
    let dataKey = `input_${flowStep}`;
    if (currentFlow === 'education') {
      if (flowStep === 1) dataKey = 'destination';
      if (flowStep === 2) dataKey = 'course_type';
      if (flowStep === 6) dataKey = 'neet';
      if (flowStep === 7) dataKey = 'budget';
      if (flowStep === 8) dataKey = 'country';
    } else if (currentFlow === 'jobs') {
      if (flowStep === 1) dataKey = 'job_destination';
      if (flowStep === 2) dataKey = 'job_category';
      if (flowStep === 4) dataKey = 'salary_range';
      if (flowStep === 5) dataKey = 'selected_job';
    } else if (currentFlow === 'skills') {
      if (flowStep === 1) dataKey = 'skill_category';
      if (flowStep === 2) dataKey = 'course_name';
      if (flowStep === 3) dataKey = 'enrollment_intent';
      if (flowStep === 4) dataKey = 'enrollment_intent';
    } else if (currentFlow === 'collaboration') {
      if (flowStep === 1) dataKey = 'partnership_type';
    }
    const newData = { ...collectedData, [dataKey]: value };
    setCollectedData(newData);
    await chatDB.saveUserData('collectedData', newData);

    if (currentFlow === 'education') {
      if (flowStep === 1) {
        // Asked Abroad/India, now ask MBBS/Other
        askNext(`Great! Are you interested in MBBS or other degree courses in ${value === 'abroad' ? 'Abroad' : 'India'}?`, [
          { label: 'MBBS', value: 'mbbs', icon: Stethoscope },
          { label: 'Other Degree Courses', value: 'other', icon: GraduationCap }
        ]);
      } else if (flowStep === 2) {
        // Asked MBBS/Other
        if (value === 'other') {
          askNext('Which specific degree or course are you interested in?');
        } else {
          askNext('Thank you. What is your Full Name? (Please type)');
        }
      } else if (flowStep === 6) {
        // Just answered NEET
        askNext('What is your estimated budget for the full course?', [
          { label: 'Low (15-25 Lakhs)', value: 'low', icon: Briefcase },
          { label: 'Medium (25-40 Lakhs)', value: 'medium', icon: Briefcase },
          { label: 'High (40+ Lakhs)', value: 'high', icon: Briefcase }
        ]);
      } else if (flowStep === 7) {
        // Just answered Budget
        if (collectedData.destination === 'india') {
          finishFlow();
        } else {
          askNext('Which Russian Federal or Medical University do you prefer?', [
            { label: 'Kazan Federal', value: 'russia_kazan', icon: Globe },
            { label: 'Crimea Federal', value: 'russia_crimea', icon: Globe },
            { label: 'Bashkir State', value: 'russia_bashkir', icon: Globe },
            { label: 'Volgograd State', value: 'russia_volgograd', icon: Globe },
            { label: 'RUDN Moscow', value: 'russia_rudn', icon: Globe },
            { label: 'Others', value: 'others', icon: MapPin }
          ]);
        }
      } else if (flowStep === 8) {
        // Just answered University
        if (value === 'others') {
          askNext('Please type the name of your preferred Russian university:');
        } else {
          const suggestions: Record<string, string> = {
            russia_kazan: "Kazan Federal University offers exceptional bilingual medical training and a gorgeous cultural campus.",
            russia_crimea: "Crimea Federal University is highly renowned for its massive Indian student community and comfortable hostels.",
            russia_bashkir: "Bashkir State Medical University is recognized globally for state-of-the-art medical and surgery infrastructure.",
            russia_volgograd: "Volgograd State Medical University has a rich history of guiding Indian medical students successfully to licensing exams.",
            russia_rudn: "RUDN University in Moscow provides highly prestigious degrees and capital-city cosmopolitan exposure."
          };
          const suggestion = suggestions[value.toLowerCase()] || "We have great Russian partner universities tailored for your budget!";
          askNext(`${suggestion}\n\nOur specialized Russia counselor will now help you with the admission process.`, [
            { label: 'Connect to Counselor', value: 'whatsapp', icon: UserCheck }
          ]);
        }
      }
    } else if (currentFlow === 'jobs') {
      if (flowStep === 1) {
        // Asked Destination
        askNext(`Great! Which category of jobs are you looking for in ${value === 'india' ? 'India' : 'Abroad'}?`, [
          { label: 'IT Sector', value: 'it', icon: Brain },
          { label: 'Non-IT / Admin', value: 'non_it', icon: Users },
          { label: 'Skilled Trades', value: 'skilled', icon: Briefcase },
          { label: 'Medical / Healthcare', value: 'medical', icon: Stethoscope }
        ]);
      } else if (flowStep === 2) {
        // Asked Category
        askNext('What specific job role are you looking for? (e.g. Full Stack Developer, Nurse, Sales Manager)');
      } else if (flowStep === 4) {
        // Just answered Salary Range
        setIsTyping(true);
        setTimeout(async () => {
          setIsTyping(false);
          const jobData: Record<string, { roles: string[], salary: string }> = {
            it: { roles: ["Software Developer", "Data Analyst", "UI/UX Designer"], salary: "₹5L - ₹25L" },
            non_it: { roles: ["HR Manager", "Sales Executive", "Operations Lead"], salary: "₹3L - ₹12L" },
            skilled: { roles: ["Technician", "Electrician", "Site Supervisor"], salary: "₹2L - ₹8L" },
            medical: { roles: ["Staff Nurse", "Lab Technician", "Pharmacist"], salary: "₹4L - ₹15L" }
          };
          const category = collectedData.job_category;
          const data = jobData[category] || jobData['it'];
          const userRole = (collectedData.preferred_role || "").toLowerCase();

          // Check for exact or partial match
          const matches = data.roles.filter(r => r.toLowerCase().includes(userRole) || userRole.includes(r.toLowerCase()));

          if (matches.length > 0) {
            const roleButtons = matches.map(role => ({ label: `Apply for ${role}`, value: role, icon: CheckCircle }));
            askNext(`✨ We found ${matches.length} matching position(s) for "${collectedData.preferred_role}"!\n\nPlease select the role you want to apply for:`, [
              ...roleButtons,
              { label: 'See Other Options', value: 'see_others', icon: Globe }
            ]);
          } else {
            const alternativeButtons = data.roles.map(role => ({ label: role, value: role, icon: Briefcase }));
            askNext(`We don't have an exact match for "${collectedData.preferred_role}" right now, but here are some trending jobs in the ${category.toUpperCase()} sector. Which one would you like to explore?`, [
              ...alternativeButtons,
              { label: 'Search Again', value: 'restart', icon: RotateCcw }
            ]);
          }
        }, 1500);
      } else if (flowStep === 5) {
        if (value === 'see_others') {
          const jobData: Record<string, string[]> = {
            it: ["Software Developer", "Data Analyst", "UI/UX Designer"],
            non_it: ["HR Manager", "Sales Executive", "Operations Lead"],
            skilled: ["Technician", "Electrician", "Site Supervisor"],
            medical: ["Staff Nurse", "Lab Technician", "Pharmacist"]
          };
          const roles = jobData[collectedData.job_category] || jobData['it'];
          const roleButtons = roles.map(role => ({ label: role, value: role, icon: Briefcase }));
          askNext(`Here are all available positions in the ${(collectedData.job_category || 'IT').toUpperCase()} sector:`, roleButtons);
        } else {
          askNext(`Excellent choice! Applying for: ${value}.\n\nWhat is your Full Name? (Please type)`);
        }
      }
    } else if (currentFlow === 'skills') {
      if (flowStep === 1) {
        // Asked Category
        if (value === 'technical') {
          askNext('Technical skills are in high demand! Which course interests you?', [
            { label: 'Video Editing', value: 'video_editing', icon: Brain },
            { label: 'Graphic Design', value: 'graphic_design', icon: Sparkles },
            { label: 'AI / Automation', value: 'ai_automation', icon: Brain },
            { label: 'Others', value: 'others', icon: MapPin }
          ]);
        } else {
          askNext('Non-Technical & Vocational courses offer great stability. Choose your path:', [
            { label: 'Medical Support', value: 'medical_support', icon: Stethoscope },
            { label: 'Vocational Courses', value: 'vocational', icon: Briefcase },
            { label: 'Welding', value: 'welding', icon: Briefcase },
            { label: 'Others', value: 'others', icon: MapPin }
          ]);
        }
      } else if (flowStep === 2) {
        if (value === 'others') {
          askNext('Please type the name of the course you are interested in:');
        } else {
          const courseData: Record<string, { career: string }> = {
            video_editing: { career: "Motion Graphics Artist / YouTuber" },
            graphic_design: { career: "UI/UX Designer / Visual Artist" },
            ai_automation: { career: "AI Workflow Specialist" },
            medical_support: { career: "Healthcare / Nursing Assistant" },
            welding: { career: "Industrial / Structural Welder" },
            vocational: { career: "Specialized Technician" }
          };
          const course = courseData[value] || { career: "Global Opportunities" };
          askNext(`📚 Course Details:\nCareer Outcome: ${course.career}\n\nDuration & fees will be shared during counselling.\n\nWould you like to enroll now?`, [
            { label: 'Enroll Now', value: 'enroll', icon: CheckCircle }
          ]);
        }
      } else if (flowStep === 3) {
        // Clicked Enroll Now (normal path)
        askNext('Great! Let\'s get you enrolled. What is your Full Name? (Please type)');
      } else if (flowStep === 4) {
        // Clicked Enroll Now (Others path — extra step for course name pushed steps forward)
        askNext('Great! Let\'s get you enrolled. What is your Full Name? (Please type)');
      }
    } else if (currentFlow === 'collaboration') {
      const typeLabel: Record<string, string> = {
        institute: 'Institute Partnership',
        influencer: 'Influencer / Creator',
        franchise: 'Franchise / City Partner'
      };
      const label = typeLabel[value] || 'Collaboration';
      askNext(`Great choice — ${label}! Please type your Full Name:`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim()) return;
    const input = userInput.trim();
    setUserInput('');
    await addMessage('user', input);

    // Intelligent Intent Detection
    const lowerInput = input.toLowerCase();
    const greetings = ['hi', 'hello', 'hey', 'hii', 'helloo', 'good morning', 'good afternoon', 'good evening', 'namaste'];

    if (greetings.some(g => lowerInput === g || lowerInput.startsWith(g + ' '))) {
      await addMessage('bot', `Hello! 👋 I'm your GlofiHub Assistant. How can I help you today? Please select an option below:`);
      setDynamicOptions(mainOptions);
      setCurrentFlow(null);
      setFlowStep(0);
      await chatDB.saveUserData('currentFlow', null);
      await chatDB.saveUserData('flowStep', 0);
      return;
    }

    // Keyword based flow starting
    if (!currentFlow) {
      if (lowerInput.includes('job') || lowerInput.includes('work') || lowerInput.includes('placement')) {
        handleOption('Jobs', 'jobs');
        return;
      }
      if (lowerInput.includes('mbbs') || lowerInput.includes('study') || lowerInput.includes('education') || lowerInput.includes('abroad')) {
        handleOption('Education', 'education');
        return;
      }
      if (lowerInput.includes('skill') || lowerInput.includes('course') || lowerInput.includes('learn')) {
        handleOption('Skill Courses', 'skills');
        return;
      }
    }

    // Determine what was just answered based on flowStep
    let justAnswered = '';
    if (currentFlow === 'education') {
      // Logic for Education inputs
      if (flowStep === 3) {
        if (collectedData.course_type === 'other') justAnswered = 'degree_name';
        else justAnswered = 'name';
      } else if (flowStep === 4) {
        justAnswered = collectedData.degree_name ? 'name' : 'age';
      } else if (flowStep === 5) {
        justAnswered = collectedData.degree_name ? 'age' : 'qualification';
      } else if (flowStep === 6) {
        justAnswered = 'qualification';
      } else if (flowStep === 9) {
        justAnswered = 'custom_country';
      }
    } else if (currentFlow === 'jobs') {
      // Steps: 0: Jobs, 1: Dest, 2: Cat, 3: Role(Typed), 4: Salary(Btn), 5: Job Selection(Btn), 6: Name, 7: Skill, 8: Exp
      if (flowStep === 3) justAnswered = 'preferred_role';
      else if (flowStep === 6) justAnswered = 'name';
      else if (flowStep === 7) justAnswered = 'skills';
      else if (flowStep === 8) justAnswered = 'experience';
    } else if (currentFlow === 'skills') {
      if (collectedData.course_name === 'others') {
        // Others path: course name typed at 3, then name/age/phone
        if (flowStep === 3) justAnswered = 'other_course_name';
        else if (flowStep === 5) justAnswered = 'name';
        else if (flowStep === 6) justAnswered = 'age';
        else if (flowStep === 7) justAnswered = 'phone';
      } else {
        if (flowStep === 4) justAnswered = 'name';
        else if (flowStep === 5) justAnswered = 'age';
        else if (flowStep === 6) justAnswered = 'phone';
      }
    } else if (currentFlow === 'collaboration') {
      const keys = ['name', 'organization', 'city', 'proposal'];
      const idx = flowStep - 2;
      if (idx >= 0 && idx < keys.length) justAnswered = keys[idx];
    } else {
      const keys = ['name', 'age', 'qualification'];
      const idx = flowStep - 2;
      if (idx >= 0 && idx < keys.length) justAnswered = keys[idx];
    }

    // Validate before saving — show error and stop if invalid
    if (justAnswered) {
      const error = validateInput(input, justAnswered);
      if (error) {
        askNext(error);
        return;
      }
    }

    const sanitized = justAnswered ? sanitizeInput(input, justAnswered) : input;

    const newData = { ...collectedData, [justAnswered || `input_${flowStep}`]: sanitized };
    setCollectedData(newData);
    await chatDB.saveUserData('collectedData', newData);

    const nextStep = flowStep + 1;
    setFlowStep(nextStep);
    await chatDB.saveUserData('flowStep', nextStep);

    // Dynamic Questioning based on what was JUST answered
    if (justAnswered === 'preferred_role') {
      askNext('What is your expected monthly or annual salary range?', [
        { label: 'Entry Level', value: 'entry', icon: Briefcase },
        { label: 'Mid Level', value: 'mid', icon: Briefcase },
        { label: 'Senior Level', value: 'senior', icon: Briefcase },
        { label: 'Not Sure', value: 'unsure', icon: Globe }
      ]);
    } else if (justAnswered === 'other_course_name') {
      askNext(`Noted! We'll cover details about "${sanitized}" during your counselling session.\n\nWould you like to enroll now?`, [
        { label: 'Enroll Now', value: 'enroll', icon: CheckCircle }
      ]);
    } else if (justAnswered === 'degree_name') {
      askNext('Thank you. What is your Full Name? (Please type)');
    } else if (justAnswered === 'name') {
      if (currentFlow === 'jobs') {
        askNext(`Nice to meet you, ${sanitized}! What are your primary skills? (e.g. Java, Sales, Nursing)`);
      } else if (currentFlow === 'collaboration') {
        askNext(`Nice to meet you, ${sanitized}! What is your organization or institute name?`);
      } else {
        askNext(`Nice to meet you, ${sanitized}! How old are you?`);
      }
    } else if (justAnswered === 'organization') {
      askNext(`Which city are you based in?`);
    } else if (justAnswered === 'city') {
      askNext(`Please share a brief proposal or message about what you're looking to achieve:`);
    } else if (justAnswered === 'proposal') {
      finishFlow();
    } else if (justAnswered === 'skills') {
      askNext('How many years of experience do you have?');
    } else if (justAnswered === 'phone') {
      finishFlow();
    } else if (justAnswered === 'age') {
      if (currentFlow === 'skills') {
        askNext('What is your WhatsApp or phone number?');
      } else {
        askNext('What is your highest qualification?');
      }
    } else if (justAnswered === 'qualification') {
      if (currentFlow === 'education' && collectedData.course_type === 'mbbs') {
        askNext('Have you cleared NEET?', [
          { label: 'Yes', value: 'yes', icon: CheckCircle },
          { label: 'No', value: 'no', icon: XCircle }
        ]);
      } else if (currentFlow === 'education') {
        askNext('What is your estimated budget for the course?', [
          { label: 'Low (15-25 Lakhs)', value: 'low', icon: Briefcase },
          { label: 'Medium (25-40 Lakhs)', value: 'medium', icon: Briefcase },
          { label: 'High (40+ Lakhs)', value: 'high', icon: Briefcase }
        ]);
      } else {
        finishFlow();
      }
    } else if (justAnswered === 'experience') {
      askNext('Great! Our expert will now help you with the next steps. Please remember to share your resume once you are redirected to WhatsApp.', [
        { label: 'Connect to Counselor', value: 'whatsapp', icon: UserCheck }
      ]);
    } else if (justAnswered === 'custom_country') {
      askNext(`Understood, you are interested in ${sanitized}. Our counselor will now help you with the admission process.`, [
        { label: 'Connect to Counselor', value: 'whatsapp', icon: UserCheck }
      ]);
    } else {
      finishFlow();
    }
  };

  const finishFlow = () => {
    askNext('Thank you for providing all the details! Our expert will review your profile and provide personalized guidance.', [
      { label: 'Connect to Counselor', value: 'whatsapp', icon: UserCheck },
      { label: 'Restart', value: 'restart', icon: RotateCcw }
    ]);
  };

  const handleReset = async () => {
    await chatDB.clearHistory();
    setCurrentFlow(null);
    setFlowStep(0);
    setCollectedData({});
    const initialMsg: ChatMessage = {
      type: 'bot',
      text: 'Hi,\nI’m GlofiHub AI Assistant.\nTell me what you’re looking for:',
      timestamp: Date.now()
    };
    setMessages([initialMsg]);
    await chatDB.saveMessage(initialMsg);
    setDynamicOptions(mainOptions);
    setUserInput('');
  };

  const handleWhatsApp = () => {
    let message = `Hi GlofiHub, I have completed the consultation flow on your website.\n\n`;
    message += `Flow: ${currentFlow}\n`;
    Object.entries(collectedData).forEach(([key, val]) => {
      if (key !== 'initial' && !key.startsWith('input_')) {
        message += `${key.charAt(0).toUpperCase() + key.slice(1)}: ${val}\n`;
      }
    });

    message += `\nNote: Kindly attach your resume here.`;

    window.open(`https://wa.me/919241168875?text=${encodeURIComponent(message)}`, '_blank');
  };


  const fmtTime = (ts: number) =>
    new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const chatWindowClass = isMaximized
    ? 'fixed inset-0 z-50 rounded-none m-0'
    : 'fixed bottom-24 right-4 sm:right-6 z-50 w-[400px] max-w-[calc(100vw-2rem)] h-[600px] max-h-[calc(100dvh-8rem)] rounded-[1.75rem]';

  return (
    <>
      {/* ── Floating launcher ─────────────────────────────── */}
      <div className="fixed bottom-6 right-4 sm:right-6 z-50 flex items-center gap-3">
        {!isOpen && (
          <span className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-card border border-foreground/10 shadow-lg text-xs font-semibold text-foreground animate-in fade-in slide-in-from-right-2 duration-500">
            <Sparkles size={13} className="text-primary" />
            Ask GlofiHub AI
          </span>
        )}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent text-white shadow-xl shadow-primary/30 hover:shadow-2xl hover:shadow-primary/50 hover:scale-105 transition-all duration-300 flex items-center justify-center cursor-pointer active:scale-95"
          aria-label={isOpen ? 'Close chat' : 'Open chat'}
          type="button"
        >
          {/* Ripple rings (only when closed) */}
          {!isOpen && (
            <>
              <span className="absolute inset-0 rounded-full bg-primary/40 animate-ripple" />
              <span className="absolute inset-0 rounded-full bg-accent/30 animate-ripple" style={{ animationDelay: '1.2s' }} />
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-emerald-500 border-2 border-background flex items-center justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              </span>
            </>
          )}
          <span className="relative transition-transform duration-300">
            {isOpen ? <X size={28} /> : <MessageCircle size={28} />}
          </span>
        </button>
      </div>

      {/* ── Backdrop ──────────────────────────────────────── */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[45] animate-in fade-in duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* ── Chat window ───────────────────────────────────── */}
      {isOpen && (
        <div className={`${chatWindowClass} bg-card shadow-2xl border border-foreground/10 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 slide-in-from-bottom-4 duration-300`}>
          {/* Header */}
          <div className="relative bg-gradient-to-r from-primary via-primary to-accent text-white px-5 py-4 flex items-center justify-between overflow-hidden">
            <span aria-hidden className="pointer-events-none absolute -top-10 -right-6 w-32 h-32 rounded-full bg-white/10 blur-2xl" />
            <div className="relative flex items-center gap-3">
              <div className="relative w-11 h-11 rounded-2xl overflow-hidden bg-white shadow-md ring-2 ring-white/30">
                <img src="/logo/logo.png" alt="GlofiHub" className="w-full h-full object-cover" />
                <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-400 border-2 border-primary" />
              </div>
              <div>
                <h3 className="font-display font-bold text-base leading-tight text-white">GlofiHub AI</h3>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                  <p className="text-[11px] font-medium text-white/80">Online • replies instantly</p>
                </div>
              </div>
            </div>
            <div className="relative flex items-center gap-0.5">
              <button onClick={handleReset} className="p-2 hover:bg-white/20 rounded-xl transition text-white cursor-pointer" title="Reset chat">
                <RotateCcw size={17} />
              </button>
              <button onClick={() => setIsMaximized(!isMaximized)} className="hidden sm:inline-flex p-2 hover:bg-white/20 rounded-xl transition text-white cursor-pointer" title={isMaximized ? 'Minimize' : 'Maximize'}>
                {isMaximized ? <Minimize2 size={17} /> : <Maximize2 size={17} />}
              </button>
              <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/20 rounded-xl transition text-white cursor-pointer" title="Close">
                <X size={17} />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div ref={scrollAreaRef} className="flex-1 overflow-y-auto px-4 py-5 space-y-4 bg-muted/20">
            <div className={`${isMaximized ? 'max-w-2xl mx-auto w-full space-y-4' : ''}`}>
              {messages.map((msg, i) => (
                msg.type === 'bot' ? (
                  <div key={i} className="flex items-end gap-2 justify-start animate-in fade-in slide-in-from-bottom-2 duration-300 mb-4">
                    <div className="w-7 h-7 rounded-full overflow-hidden border border-foreground/10 shrink-0 shadow-sm bg-white">
                      <img src="/logo/logo.png" alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex flex-col items-start max-w-[80%]">
                      <div className="px-4 py-2.5 rounded-2xl rounded-bl-md text-sm whitespace-pre-wrap bg-card border border-foreground/10 text-foreground shadow-sm leading-relaxed">
                        {msg.text}
                      </div>
                      <span className="text-[10px] text-foreground/40 mt-1 ml-1">{fmtTime(msg.timestamp)}</span>
                    </div>
                  </div>
                ) : (
                  <div key={i} className="flex flex-col items-end animate-in fade-in slide-in-from-bottom-2 duration-300 mb-4">
                    <div className="max-w-[80%] px-4 py-2.5 rounded-2xl rounded-br-md text-sm whitespace-pre-wrap bg-gradient-to-br from-primary to-accent text-white shadow-md shadow-primary/20 leading-relaxed">
                      {msg.text}
                    </div>
                    <span className="text-[10px] text-foreground/40 mt-1 mr-1">{fmtTime(msg.timestamp)}</span>
                  </div>
                )
              ))}
              {isTyping && (
                <div className="flex items-end gap-2 justify-start animate-in fade-in duration-300">
                  <div className="w-7 h-7 rounded-full overflow-hidden border border-foreground/10 shrink-0 shadow-sm bg-white">
                    <img src="/logo/logo.png" alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="bg-card border border-foreground/10 px-4 py-3 rounded-2xl rounded-bl-md shadow-sm flex gap-1 items-center">
                    <div className="w-1.5 h-1.5 bg-primary/50 rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <div className="w-1.5 h-1.5 bg-primary/50 rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <div className="w-1.5 h-1.5 bg-primary/50 rounded-full animate-bounce" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Footer: quick replies + input */}
          <div className="p-4 border-t border-foreground/10 space-y-3 bg-card">
            {dynamicOptions.length > 0 && (
              <div className={`flex flex-wrap gap-2 ${isMaximized ? 'max-w-2xl mx-auto w-full' : ''}`}>
                {dynamicOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => {
                      if (opt.value === 'whatsapp') handleWhatsApp();
                      else if (opt.value === 'restart') handleReset();
                      else handleOption(opt.label, opt.value);
                    }}
                    className="group/opt text-xs font-semibold px-4 py-2.5 rounded-full bg-card border border-foreground/15 text-foreground hover:border-primary hover:bg-primary hover:text-white transition-all duration-200 active:scale-95 flex items-center gap-2 shadow-sm cursor-pointer"
                  >
                    {opt.icon && <opt.icon size={14} className="text-primary group-hover/opt:text-white transition-colors" />}
                    {opt.label}
                  </button>
                ))}
              </div>
            )}

            <form onSubmit={handleSubmit} className={`flex gap-2 ${isMaximized ? 'max-w-2xl mx-auto w-full' : ''}`}>
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Type your message…"
                className="flex-1 px-4 py-3 rounded-full bg-muted/40 border border-transparent focus:bg-background focus:border-primary focus:outline-none transition-all text-sm"
              />
              <button
                type="submit"
                disabled={!userInput.trim()}
                className="w-11 h-11 flex items-center justify-center bg-gradient-to-br from-primary to-accent text-white rounded-full hover:shadow-lg hover:shadow-primary/30 hover:scale-105 transition-all active:scale-95 disabled:opacity-40 disabled:hover:scale-100 disabled:cursor-not-allowed cursor-pointer shrink-0"
                aria-label="Send message"
              >
                <Send size={17} />
              </button>
            </form>

            <p className="text-center text-[10px] text-foreground/35 font-medium">
              Powered by GlofiHub AI · Secure &amp; private
            </p>
          </div>
        </div>
      )}
    </>
  );
}
