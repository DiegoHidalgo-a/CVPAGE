import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-scroll';
import { Github, Linkedin, Mail, Phone, Menu, X, Award, Rocket, Cpu, BookOpen, Users, Code2, ChevronDown } from 'lucide-react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';

// Navigation links data
const navLinks = [
  { href: '#about', label: 'About' },
  { href: '#experience', label: 'Experience' },
  { href: '#education', label: 'Education' },
  { href: '#skills', label: 'Skills' },
  { href: '#awards', label: 'Achievements' },
  { href: '#projects', label: 'Projects' },
  { href: '#contact', label: 'Contact' },
];

// Social links data
const socialLinks = [
  { href: 'https://github.com/DiegoHidalgo-a', icon: Github, label: 'GitHub' },
  { href: 'https://www.linkedin.com/in/diegoarmandohidalgo', icon: Linkedin, label: 'LinkedIn' },
  { href: 'mailto:dihidalg@ttu.edu', icon: Mail, label: 'Email' },
  { href: 'tel:+50685489448', icon: Phone, label: 'Phone' },
];

const App = () => {
  // State management
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [isAboutVisible, setIsAboutVisible] = useState(false);
  const [isExperienceVisible, setIsExperienceVisible] = useState(false);
  
  // Refs for scroll effects
  const heroRef = useRef(null);
  const aboutRef = useRef(null);
  const experienceRef = useRef(null);
  
  // Framer Motion scroll effects
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  
  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const blurValue = useTransform(scrollYProgress, [0, 1], [0, 5]);
  const textOpacity = useTransform(scrollYProgress, [0, 1], [0, 1]);
  
  // Initialize AOS with premium settings
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false,
      easing: 'ease-out-back',
      offset: 120,
      delay: 100,
      mirror: true
    });
  }, []);

  // Scroll effect handler with section detection
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 10);
      
      if (aboutRef.current) {
        const rect = aboutRef.current.getBoundingClientRect();
        setIsAboutVisible(rect.top < window.innerHeight && rect.bottom > 0);
      }
      
      if (experienceRef.current) {
        const rect = experienceRef.current.getBoundingClientRect();
        setIsExperienceVisible(rect.top < window.innerHeight && rect.bottom > 0);
      }
      
      // Detect active section
      const sections = document.querySelectorAll('section[id]');
      sections.forEach(section => {
        const sectionTop = section.offsetTop - 200;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
          setActiveSection(sectionId || '');
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Premium navigation link renderer with active state
  const renderNavLink = (href: string, label: string) => {
    const sectionId = href.replace('#', '');
    const isActive = activeSection === sectionId;
    
    return (
      <Link
        key={href}
        to={sectionId}
        smooth={true}
        duration={800}
        offset={-100}
        className={`${
          isScrolled 
            ? isActive 
              ? 'text-red-600 font-semibold' 
              : 'text-gray-900 hover:text-red-600'
            : isActive
              ? 'text-red-200 font-semibold'
              : 'text-white hover:text-red-200'
        } transition-all px-4 py-2 rounded-md text-sm relative group`}
        onClick={() => setIsMobileMenuOpen(false)}
      >
        {label}
        <span className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 h-0.5 bg-red-600 transition-all duration-300 ${
          isActive ? 'w-4/5' : 'w-0 group-hover:w-4/5'
        }`}></span>
      </Link>
    );
  };

  // Premium background gradient effect
  const getBackgroundGradient = () => {
    return `linear-gradient(
      to bottom right,
      rgba(239, 68, 68, 0.1),
      rgba(0, 0, 0, 0.8)
    )`;
  };

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Premium Navigation Bar */}
      <motion.nav
        className={`fixed w-full z-50 transition-all duration-500 ${
          isScrolled ? 'bg-white/90 backdrop-blur-md shadow-lg py-3' : 'bg-transparent py-6'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center">
            {/* Animated Logo */}
            <Link
              to="hero"
              smooth={true}
              duration={800}
              offset={-100}
              className={`text-xl font-bold ${
                isScrolled ? 'text-red-600' : 'text-white'
              } flex items-center cursor-pointer group`}
              data-aos="fade-right"
            >
              <motion.div 
                animate={{ 
                  rotate: [0, 45, 0],
                  transition: { 
                    repeat: Infinity, 
                    repeatType: "reverse", 
                    duration: 3 
                  } 
                }}
              >
                <Rocket className="mr-2" />
              </motion.div>
              <span className="transition-all duration-500 group-hover:tracking-wider">DIEGO HIDALGO</span>
            </Link>

            {/* Mobile Menu Button */}
            <motion.button
              className={`md:hidden rounded-md p-2 ${
                isScrolled ? 'text-gray-900 hover:bg-gray-100' : 'text-white hover:bg-gray-800'
              } transition-all`}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {isMobileMenuOpen ? (
                <X size={24} className="animate-spin-in" />
              ) : (
                <Menu size={24} className="animate-pulse" />
              )}
            </motion.button>

            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-1" data-aos="fade-left">
              {navLinks.map(link => renderNavLink(link.href, link.label))}
            </div>
          </div>

          {/* Premium Mobile Navigation */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div 
                className={`md:hidden mt-4 ${
                  isScrolled ? 'bg-white/95' : 'bg-gray-900/95'
                } rounded-xl p-6 shadow-2xl backdrop-blur-lg`}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex flex-col space-y-4">
                  {navLinks.map(link => renderNavLink(link.href, link.label))}
                  <div className="flex justify-center space-x-6 pt-6">
                    {socialLinks.map(({ href, icon: Icon, label }) => (
                      <motion.a
                        key={label}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`${
                          isScrolled ? 'text-gray-900 hover:text-red-600' : 'text-white hover:text-red-200'
                        } transition-all`}
                        aria-label={label}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Icon size={24} />
                      </motion.a>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.nav>

      {/* Premium Hero Section with Enhanced Parallax Effect */}
      <section 
        id="hero"
        ref={heroRef}
        className="fixed h-[100vh] w-full flex items-center justify-start bg-[url('/4.jpg')] bg-cover bg-center"
      >
        <motion.div 
          className="absolute inset-0"
          style={{ 
            background: getBackgroundGradient(),
            opacity: textOpacity,
            y: yBg,
            filter: `blur(${blurValue}px)`
          }}
        />
        <div className="container mx-auto px-6 text-left relative z-10" data-aos="fade-up" data-aos-delay="200">
          <div className="max-w-2xl">
            <motion.h1 
              className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="inline-block bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
                DIEGO HIDALGO
              </span>
            </motion.h1>
            <motion.p 
              className="text-xl md:text-2xl text-white mb-2 font-light opacity-90"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Electrical Engineering Student | F1 Technology Innovator
            </motion.p>
            <motion.p 
              className="text-lg text-white mb-8 opacity-80 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Combining cutting-edge electrical engineering expertise with motorsport passion to 
              revolutionize performance through innovative systems and aerodynamic solutions.
            </motion.p>
            <motion.div 
              className="flex space-x-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Link
                to="projects"
                smooth={true}
                duration={800}
                offset={-100}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition-all transform hover:-translate-y-1 shadow-lg hover:shadow-xl flex items-center"
              >
                View My Work <ChevronDown className="ml-2 animate-bounce" />
              </Link>
              <a
                href="#contact"
                className="border-2 border-white text-white px-6 py-3 rounded-lg transition-all transform hover:-translate-y-1 hover:bg-white hover:text-gray-900 flex items-center"
              >
                Contact Me
              </a>
            </motion.div>
          </div>
          <motion.div 
            className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
          >
            <Link
              to="about"
              smooth={true}
              duration={800}
              offset={-100}
              className="text-white cursor-pointer block"
            >
              <motion.div
                animate={{ 
                  y: [0, 10, 0],
                  transition: { 
                    repeat: Infinity, 
                    duration: 1.5 
                  } 
                }}
              >
                <ChevronDown size={32} />
              </motion.div>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Premium Main Content */}
      <main className="relative z-10 bg-transparent pt-[100vh]">
        {/* About Section with Floating Effect */}
        <section
          id="about"
          ref={aboutRef}
          className={`min-h-screen flex items-center justify-center py-20 ${
            isAboutVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          } transition-all duration-1000 ease-out`}
        >
          <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12">
            <motion.div 
              className="flex items-center justify-center" 
              data-aos="fade-right"
              whileHover={{ scale: 1.02 }}
            >
              <div className="relative group">
                <motion.div 
                  className="absolute -inset-4 bg-gradient-to-br from-red-600 to-transparent rounded-2xl opacity-70 blur-lg"
                  animate={{
                    opacity: [0.7, 1, 0.7],
                    transition: { duration: 3, repeat: Infinity }
                  }}
                />
                <img
                  src="/5.jpg"
                  alt="Diego Hidalgo"
                  className="relative w-full max-w-lg rounded-xl shadow-2xl object-cover h-96 transform group-hover:-translate-y-2 transition-transform duration-500 z-10"
                />
                <motion.div 
                  className="absolute -bottom-4 -right-4 bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg z-20"
                  whileHover={{ scale: 1.1 }}
                >
                  <span className="font-medium">Diego Hidalgo</span>
                </motion.div>
              </div>
            </motion.div>
            <div className="flex flex-col justify-center" data-aos="fade-left">
              <h2 className="text-3xl font-bold mb-6 text-gray-900 relative inline-block">
                <span className="relative z-10">About Me</span>
                <span className="absolute bottom-0 left-0 w-full h-2 bg-red-100 z-0 opacity-70"></span>
              </h2>
              <p className="text-gray-700 leading-relaxed mb-6">
                I'm a passionate third-year electrical engineering student at Texas Tech University with a perfect 4.0 GPA. 
                My journey from a small rural town in Costa Rica to becoming a leader in academic and competitive engineering 
                environments has shaped my innovative approach to problem-solving.
              </p>
              <p className="text-gray-700 leading-relaxed mb-8">
                As the president of three student organizations, I bridge theory with practical applications through hands-on 
                projects in mathematics, aerospace engineering, and motorsports technology.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <motion.div 
                  className="bg-white p-4 rounded-xl shadow-md hover:shadow-xl transition-all duration-500"
                  data-aos="fade-up"
                  data-aos-delay="100"
                  whileHover={{ y: -5 }}
                >
                  <div className="flex items-center mb-2">
                    <div className="bg-red-100 p-2 rounded-full mr-3">
                      <Cpu className="text-red-600" size={20} />
                    </div>
                    <h3 className="font-semibold text-gray-900">Current Focus</h3>
                  </div>
                  <p className="text-gray-600">F1 Technology, Aerodynamics, Electrical Systems</p>
                </motion.div>
                <motion.div 
                  className="bg-white p-4 rounded-xl shadow-md hover:shadow-xl transition-all duration-500"
                  data-aos="fade-up"
                  data-aos-delay="200"
                  whileHover={{ y: -5 }}
                >
                  <div className="flex items-center mb-2">
                    <div className="bg-red-100 p-2 rounded-full mr-3">
                      <Users className="text-red-600" size={20} />
                    </div>
                    <h3 className="font-semibold text-gray-900">Leadership</h3>
                  </div>
                  <p className="text-gray-600">President of 3 Student Organizations</p>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* Experience Section with Enhanced Timeline Effect */}
        <section 
          id="experience" 
          ref={experienceRef}
          className="min-h-screen py-20 bg-gray-50 relative"
        >
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-red-50 to-transparent opacity-30"></div>
          </div>
          <div className="container mx-auto px-6 relative">
            <motion.h2 
              className="text-3xl font-bold mb-12 text-center text-gray-900" 
              data-aos="fade-down"
              whileInView={{ scale: [0.95, 1] }}
              transition={{ duration: 0.5 }}
            >
              Professional <span className="text-red-600">Experience</span>
            </motion.h2>
            
            <div className="relative">
              {/* Timeline line */}
              <div className="hidden lg:block absolute left-1/2 h-full w-0.5 bg-red-200 transform -translate-x-1/2"></div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Experience Item 1 */}
                <motion.div 
                  className="relative"
                  data-aos="fade-up"
                  data-aos-delay="100"
                  whileInView={{ x: [-50, 0], opacity: [0, 1] }}
                  transition={{ duration: 0.6 }}
                >
                  <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-500 lg:mr-8">
                    <div className="flex items-start mb-4">
                      <div className="bg-red-100 p-3 rounded-full mr-4">
                        <BookOpen className="text-red-600" size={20} />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">Math Kangaroo Olympiad Prep Tutor</h3>
                        <p className="text-gray-500">Colegio Científico de San Vito • Sep-Dec 2022</p>
                      </div>
                    </div>
                    <ul className="text-gray-600 list-disc list-inside space-y-2">
                      <li>Prepared students resulting in 3 gold and 3 bronze medals at national competition</li>
                      <li>Spearheaded STEAM introduction project engaging 30 children in hands-on learning</li>
                    </ul>
                    <div className="mt-4" data-aos="zoom-in" data-aos-delay="200">
                      <img 
                        src="/math-olympiad.jpg" 
                        alt="Math Olympiad" 
                        className="rounded-lg w-full h-48 object-cover shadow-md"
                      />
                    </div>
                  </div>
                  {/* Timeline dot */}
                  <div className="hidden lg:block absolute top-6 -right-3 w-6 h-6 bg-red-600 rounded-full border-4 border-white"></div>
                </motion.div>

                {/* Experience Item 2 */}
                <motion.div 
                  className="relative lg:mt-20"
                  data-aos="fade-up"
                  data-aos-delay="200"
                  whileInView={{ x: [50, 0], opacity: [0, 1] }}
                  transition={{ duration: 0.6 }}
                >
                  <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-500 lg:ml-8">
                    <div className="flex items-start mb-4">
                      <div className="bg-red-100 p-3 rounded-full mr-4">
                        <Rocket className="text-red-600" size={20} />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">Autodesk Design Engineer</h3>
                        <p className="text-gray-500">F1 in Schools Costa Rica • May-Oct 2023</p>
                      </div>
                    </div>
                    <ul className="text-gray-600 list-disc list-inside space-y-2">
                      <li>Key member of winning F1 in Schools team as lead engineer designer</li>
                      <li>Applied advanced aerodynamics and physics principles to create award-winning designs</li>
                    </ul>
                    <div className="mt-4" data-aos="zoom-in" data-aos-delay="300">
                      <img 
                        src="/f1-design.jpg" 
                        alt="F1 Design" 
                        className="rounded-lg w-full h-48 object-cover shadow-md"
                      />
                    </div>
                  </div>
                  {/* Timeline dot */}
                  <div className="hidden lg:block absolute top-6 -left-3 w-6 h-6 bg-red-600 rounded-full border-4 border-white"></div>
                </motion.div>

                {/* Experience Item 3 */}
                <motion.div 
                  className="relative lg:mt-10"
                  data-aos="fade-up"
                  data-aos-delay="300"
                  whileInView={{ x: [-50, 0], opacity: [0, 1] }}
                  transition={{ duration: 0.6 }}
                >
                  <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-500 lg:mr-8">
                    <div className="flex items-start mb-4">
                      <div className="bg-red-100 p-3 rounded-full mr-4">
                        <Users className="text-red-600" size={20} />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">Speaker & Technical Judge</h3>
                        <p className="text-gray-500">F1 in Schools Costa Rica • Apr 2024-Present</p>
                      </div>
                    </div>
                    <ul className="text-gray-600 list-disc list-inside space-y-2">
                      <li>Spearheaded car design analysis across 15 national venues</li>
                      <li>Partnered with Boston Scientific and Tecnikids senior engineers</li>
                    </ul>
                    <div className="mt-4" data-aos="zoom-in" data-aos-delay="400">
                      <img 
                        src="/f1-judging.jpg" 
                        alt="F1 Judging" 
                        className="rounded-lg w-full h-48 object-cover shadow-md"
                      />
                    </div>
                  </div>
                  {/* Timeline dot */}
                  <div className="hidden lg:block absolute top-6 -right-3 w-6 h-6 bg-red-600 rounded-full border-4 border-white"></div>
                </motion.div>

                {/* Experience Item 4 */}
                <motion.div 
                  className="relative lg:mt-20"
                  data-aos="fade-up"
                  data-aos-delay="400"
                  whileInView={{ x: [50, 0], opacity: [0, 1] }}
                  transition={{ duration: 0.6 }}
                >
                  <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-500 lg:ml-8">
                    <div className="flex items-start mb-4">
                      <div className="bg-red-100 p-3 rounded-full mr-4">
                        <Code2 className="text-red-600" size={20} />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">Innovation Department Assistant</h3>
                        <p className="text-gray-500">Texas Tech University • Feb 2025-Present</p>
                      </div>
                    </div>
                    <ul className="text-gray-600 list-disc list-inside space-y-2">
                      <li>Manage department programs, optimizing efficiency</li>
                      <li>Receive mentorship from department head</li>
                    </ul>
                    <div className="mt-4" data-aos="zoom-in" data-aos-delay="500">
                      <img 
                        src="/innovation-lab.jpg" 
                        alt="Innovation Lab" 
                        className="rounded-lg w-full h-48 object-cover shadow-md"
                      />
                    </div>
                  </div>
                  {/* Timeline dot */}
                  <div className="hidden lg:block absolute top-6 -left-3 w-6 h-6 bg-red-600 rounded-full border-4 border-white"></div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* Education Section with Enhanced Card Animation */}
        <section id="education" className="min-h-screen py-20 bg-gradient-to-br from-white to-gray-50">
          <div className="container mx-auto px-6">
            <motion.h2 
              className="text-3xl font-bold mb-12 text-center text-gray-900" 
              data-aos="fade-down"
              whileInView={{ scale: [0.95, 1] }}
              transition={{ duration: 0.5 }}
            >
              Education & <span className="text-red-600">Qualifications</span>
            </motion.h2>
            
            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Education Item 1 */}
              <motion.div 
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-500"
                data-aos="flip-left"
                data-aos-delay="100"
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-start">
                  <div className="bg-red-100 p-3 rounded-full mr-4">
                    <BookOpen className="text-red-600" size={20} />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">Bachelor of Science in Electrical Engineering</h3>
                    <p className="text-gray-500">Texas Tech University Costa Rica • Jan 2024-Present</p>
                    <div className="mt-4">
                      <div className="flex items-center mb-2">
                        <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-medium">GPA: 4.0</span>
                      </div>
                      <h4 className="font-medium text-gray-900 mb-2">Leadership Roles:</h4>
                      <ul className="text-gray-600 list-disc list-inside space-y-1">
                        <li>President of ACMO Tech (Competitive Math Olympiad Club)</li>
                        <li>President of Red Planet (Aerospace Engineering Club)</li>
                        <li>President of Red Karting Racing Club</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Education Item 2 */}
              <motion.div 
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-500"
                data-aos="flip-left"
                data-aos-delay="200"
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-start">
                  <div className="bg-red-100 p-3 rounded-full mr-4">
                    <BookOpen className="text-red-600" size={20} />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">High School Diploma</h3>
                    <p className="text-gray-500">Colegio Científico de San Vito • 2022-2023</p>
                    <div className="mt-4">
                      <div className="flex items-center mb-2">
                        <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-medium">GPA: 4.0</span>
                      </div>
                      <h4 className="font-medium text-gray-900 mb-2">Notable Achievements:</h4>
                      <ul className="text-gray-600 list-disc list-inside space-y-1">
                        <li>Bronze medal in International Mathematical Kangaroo Olympiad 2022</li>
                        <li>Gold medal in International Mathematical Kangaroo Olympiad 2023</li>
                        <li>Honorable mention in Olimpiada Costarricense de Ciencias Biológicas 2022</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Skills Section with Enhanced Radial Progress Bars */}
        <section id="skills" className="min-h-screen py-20 bg-white">
          <div className="container mx-auto px-6">
            <motion.h2 
              className="text-3xl font-bold mb-12 text-center text-gray-900" 
              data-aos="fade-down"
              whileInView={{ scale: [0.95, 1] }}
              transition={{ duration: 0.5 }}
            >
              Technical <span className="text-red-600">Expertise</span>
            </motion.h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Technical Skills */}
              <motion.div 
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-500 border border-gray-100"
                data-aos="fade-up"
                data-aos-delay="100"
                whileHover={{ y: -5 }}
              >
                <div className="flex items-center mb-6">
                  <div className="bg-red-100 p-3 rounded-full mr-4">
                    <Cpu className="text-red-600" size={20} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Technical Skills</h3>
                </div>
                <ul className="space-y-4">
                  <li>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-gray-700">Fusion 360 (2D/3D)</span>
                      <span className="text-sm font-medium text-red-600">95%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <motion.div 
                        className="bg-red-600 h-2 rounded-full" 
                        initial={{ width: 0 }}
                        whileInView={{ width: '95%' }}
                        transition={{ duration: 1, delay: 0.2 }}
                      />
                    </div>
                  </li>
                  <li>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-gray-700">CFD Software</span>
                      <span className="text-sm font-medium text-red-600">90%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <motion.div 
                        className="bg-red-600 h-2 rounded-full" 
                        initial={{ width: 0 }}
                        whileInView={{ width: '90%' }}
                        transition={{ duration: 1, delay: 0.4 }}
                      />
                    </div>
                  </li>
                  <li>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-gray-700">Python</span>
                      <span className="text-sm font-medium text-red-600">85%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <motion.div 
                        className="bg-red-600 h-2 rounded-full" 
                        initial={{ width: 0 }}
                        whileInView={{ width: '85%' }}
                        transition={{ duration: 1, delay: 0.6 }}
                      />
                    </div>
                  </li>
                </ul>
              </motion.div>

              {/* Languages */}
              <motion.div 
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-500 border border-gray-100"
                data-aos="fade-up"
                data-aos-delay="200"
                whileHover={{ y: -5 }}
              >
                <div className="flex items-center mb-6">
                  <div className="bg-red-100 p-3 rounded-full mr-4">
                    <BookOpen className="text-red-600" size={20} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Languages</h3>
                </div>
                <ul className="space-y-4">
                  <li>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-gray-700">Spanish</span>
                      <span className="text-sm font-medium text-red-600">100%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <motion.div 
                        className="bg-red-600 h-2 rounded-full" 
                        initial={{ width: 0 }}
                        whileInView={{ width: '100%' }}
                        transition={{ duration: 1, delay: 0.3 }}
                      />
                    </div>
                  </li>
                  <li>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-gray-700">English</span>
                      <span className="text-sm font-medium text-red-600">95%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <motion.div 
                        className="bg-red-600 h-2 rounded-full" 
                        initial={{ width: 0 }}
                        whileInView={{ width: '95%' }}
                        transition={{ duration: 1, delay: 0.5 }}
                      />
                    </div>
                  </li>
                </ul>
              </motion.div>

              {/* Soft Skills */}
              <motion.div 
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-500 border border-gray-100"
                data-aos="fade-up"
                data-aos-delay="300"
                whileHover={{ y: -5 }}
              >
                <div className="flex items-center mb-6">
                  <div className="bg-red-100 p-3 rounded-full mr-4">
                    <Users className="text-red-600" size={20} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Soft Skills</h3>
                </div>
                <div className="flex flex-wrap gap-3">
                  <motion.span 
                    className="bg-red-50 text-red-600 px-4 py-2 rounded-full text-sm font-medium shadow-sm"
                    whileHover={{ scale: 1.1 }}
                  >
                    Leadership
                  </motion.span>
                  <motion.span 
                    className="bg-red-50 text-red-600 px-4 py-2 rounded-full text-sm font-medium shadow-sm"
                    whileHover={{ scale: 1.1 }}
                  >
                    Creativity
                  </motion.span>
                  <motion.span 
                    className="bg-red-50 text-red-600 px-4 py-2 rounded-full text-sm font-medium shadow-sm"
                    whileHover={{ scale: 1.1 }}
                  >
                    Problem Solving
                  </motion.spanimport React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-scroll';
import { Github, Linkedin, Mail, Phone, Menu, X, Award, Rocket, Cpu, BookOpen, Users, Code2, ChevronDown } from 'lucide-react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';

// Navigation links data
const navLinks = [
  { href: '#about', label: 'About' },
  { href: '#experience', label: 'Experience' },
  { href: '#education', label: 'Education' },
  { href: '#skills', label: 'Skills' },
  { href: '#awards', label: 'Achievements' },
  { href: '#projects', label: 'Projects' },
  { href: '#contact', label: 'Contact' },
];

// Social links data
const socialLinks = [
  { href: 'https://github.com/DiegoHidalgo-a', icon: Github, label: 'GitHub' },
  { href: 'https://www.linkedin.com/in/diegoarmandohidalgo', icon: Linkedin, label: 'LinkedIn' },
  { href: 'mailto:dihidalg@ttu.edu', icon: Mail, label: 'Email' },
  { href: 'tel:+50685489448', icon: Phone, label: 'Phone' },
];

const App = () => {
  // State management
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [isAboutVisible, setIsAboutVisible] = useState(false);
  const [isExperienceVisible, setIsExperienceVisible] = useState(false);
  
  // Refs for scroll effects
  const heroRef = useRef(null);
  const aboutRef = useRef(null);
  const experienceRef = useRef(null);
  
  // Framer Motion scroll effects
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  
  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const blurValue = useTransform(scrollYProgress, [0, 1], [0, 5]);
  const textOpacity = useTransform(scrollYProgress, [0, 1], [0, 1]);
  
  // Initialize AOS with premium settings
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false,
      easing: 'ease-out-back',
      offset: 120,
      delay: 100,
      mirror: true
    });
  }, []);

  // Scroll effect handler with section detection
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 10);
      
      if (aboutRef.current) {
        const rect = aboutRef.current.getBoundingClientRect();
        setIsAboutVisible(rect.top < window.innerHeight && rect.bottom > 0);
      }
      
      if (experienceRef.current) {
        const rect = experienceRef.current.getBoundingClientRect();
        setIsExperienceVisible(rect.top < window.innerHeight && rect.bottom > 0);
      }
      
      // Detect active section
      const sections = document.querySelectorAll('section[id]');
      sections.forEach(section => {
        const sectionTop = section.offsetTop - 200;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
          setActiveSection(sectionId || '');
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Premium navigation link renderer with active state
  const renderNavLink = (href: string, label: string) => {
    const sectionId = href.replace('#', '');
    const isActive = activeSection === sectionId;
    
    return (
      <Link
        key={href}
        to={sectionId}
        smooth={true}
        duration={800}
        offset={-100}
        className={`${
          isScrolled 
            ? isActive 
              ? 'text-red-600 font-semibold' 
              : 'text-gray-900 hover:text-red-600'
            : isActive
              ? 'text-red-200 font-semibold'
              : 'text-white hover:text-red-200'
        } transition-all px-4 py-2 rounded-md text-sm relative group`}
        onClick={() => setIsMobileMenuOpen(false)}
      >
        {label}
        <span className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 h-0.5 bg-red-600 transition-all duration-300 ${
          isActive ? 'w-4/5' : 'w-0 group-hover:w-4/5'
        }`}></span>
      </Link>
    );
  };

  // Premium background gradient effect
  const getBackgroundGradient = () => {
    return `linear-gradient(
      to bottom right,
      rgba(239, 68, 68, 0.1),
      rgba(0, 0, 0, 0.8)
    )`;
  };

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Premium Navigation Bar */}
      <motion.nav
        className={`fixed w-full z-50 transition-all duration-500 ${
          isScrolled ? 'bg-white/90 backdrop-blur-md shadow-lg py-3' : 'bg-transparent py-6'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center">
            {/* Animated Logo */}
            <Link
              to="hero"
              smooth={true}
              duration={800}
              offset={-100}
              className={`text-xl font-bold ${
                isScrolled ? 'text-red-600' : 'text-white'
              } flex items-center cursor-pointer group`}
              data-aos="fade-right"
            >
              <motion.div 
                animate={{ 
                  rotate: [0, 45, 0],
                  transition: { 
                    repeat: Infinity, 
                    repeatType: "reverse", 
                    duration: 3 
                  } 
                }}
              >
                <Rocket className="mr-2" />
              </motion.div>
              <span className="transition-all duration-500 group-hover:tracking-wider">DIEGO HIDALGO</span>
            </Link>

            {/* Mobile Menu Button */}
            <motion.button
              className={`md:hidden rounded-md p-2 ${
                isScrolled ? 'text-gray-900 hover:bg-gray-100' : 'text-white hover:bg-gray-800'
              } transition-all`}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {isMobileMenuOpen ? (
                <X size={24} className="animate-spin-in" />
              ) : (
                <Menu size={24} className="animate-pulse" />
              )}
            </motion.button>

            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-1" data-aos="fade-left">
              {navLinks.map(link => renderNavLink(link.href, link.label))}
            </div>
          </div>

          {/* Premium Mobile Navigation */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div 
                className={`md:hidden mt-4 ${
                  isScrolled ? 'bg-white/95' : 'bg-gray-900/95'
                } rounded-xl p-6 shadow-2xl backdrop-blur-lg`}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex flex-col space-y-4">
                  {navLinks.map(link => renderNavLink(link.href, link.label))}
                  <div className="flex justify-center space-x-6 pt-6">
                    {socialLinks.map(({ href, icon: Icon, label }) => (
                      <motion.a
                        key={label}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`${
                          isScrolled ? 'text-gray-900 hover:text-red-600' : 'text-white hover:text-red-200'
                        } transition-all`}
                        aria-label={label}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Icon size={24} />
                      </motion.a>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.nav>

      {/* Premium Hero Section with Enhanced Parallax Effect */}
      <section 
        id="hero"
        ref={heroRef}
        className="fixed h-[100vh] w-full flex items-center justify-start bg-[url('/4.jpg')] bg-cover bg-center"
      >
        <motion.div 
          className="absolute inset-0"
          style={{ 
            background: getBackgroundGradient(),
            opacity: textOpacity,
            y: yBg,
            filter: `blur(${blurValue}px)`
          }}
        />
        <div className="container mx-auto px-6 text-left relative z-10" data-aos="fade-up" data-aos-delay="200">
          <div className="max-w-2xl">
            <motion.h1 
              className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="inline-block bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
                DIEGO HIDALGO
              </span>
            </motion.h1>
            <motion.p 
              className="text-xl md:text-2xl text-white mb-2 font-light opacity-90"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Electrical Engineering Student | F1 Technology Innovator
            </motion.p>
            <motion.p 
              className="text-lg text-white mb-8 opacity-80 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Combining cutting-edge electrical engineering expertise with motorsport passion to 
              revolutionize performance through innovative systems and aerodynamic solutions.
            </motion.p>
            <motion.div 
              className="flex space-x-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Link
                to="projects"
                smooth={true}
                duration={800}
                offset={-100}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition-all transform hover:-translate-y-1 shadow-lg hover:shadow-xl flex items-center"
              >
                View My Work <ChevronDown className="ml-2 animate-bounce" />
              </Link>
              <a
                href="#contact"
                className="border-2 border-white text-white px-6 py-3 rounded-lg transition-all transform hover:-translate-y-1 hover:bg-white hover:text-gray-900 flex items-center"
              >
                Contact Me
              </a>
            </motion.div>
          </div>
          <motion.div 
            className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
          >
            <Link
              to="about"
              smooth={true}
              duration={800}
              offset={-100}
              className="text-white cursor-pointer block"
            >
              <motion.div
                animate={{ 
                  y: [0, 10, 0],
                  transition: { 
                    repeat: Infinity, 
                    duration: 1.5 
                  } 
                }}
              >
                <ChevronDown size={32} />
              </motion.div>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Premium Main Content */}
      <main className="relative z-10 bg-transparent pt-[100vh]">
        {/* About Section with Floating Effect */}
        <section
          id="about"
          ref={aboutRef}
          className={`min-h-screen flex items-center justify-center py-20 ${
            isAboutVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          } transition-all duration-1000 ease-out`}
        >
          <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12">
            <motion.div 
              className="flex items-center justify-center" 
              data-aos="fade-right"
              whileHover={{ scale: 1.02 }}
            >
              <div className="relative group">
                <motion.div 
                  className="absolute -inset-4 bg-gradient-to-br from-red-600 to-transparent rounded-2xl opacity-70 blur-lg"
                  animate={{
                    opacity: [0.7, 1, 0.7],
                    transition: { duration: 3, repeat: Infinity }
                  }}
                />
                <img
                  src="/5.jpg"
                  alt="Diego Hidalgo"
                  className="relative w-full max-w-lg rounded-xl shadow-2xl object-cover h-96 transform group-hover:-translate-y-2 transition-transform duration-500 z-10"
                />
                <motion.div 
                  className="absolute -bottom-4 -right-4 bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg z-20"
                  whileHover={{ scale: 1.1 }}
                >
                  <span className="font-medium">Diego Hidalgo</span>
                </motion.div>
              </div>
            </motion.div>
            <div className="flex flex-col justify-center" data-aos="fade-left">
              <h2 className="text-3xl font-bold mb-6 text-gray-900 relative inline-block">
                <span className="relative z-10">About Me</span>
                <span className="absolute bottom-0 left-0 w-full h-2 bg-red-100 z-0 opacity-70"></span>
              </h2>
              <p className="text-gray-700 leading-relaxed mb-6">
                I'm a passionate third-year electrical engineering student at Texas Tech University with a perfect 4.0 GPA. 
                My journey from a small rural town in Costa Rica to becoming a leader in academic and competitive engineering 
                environments has shaped my innovative approach to problem-solving.
              </p>
              <p className="text-gray-700 leading-relaxed mb-8">
                As the president of three student organizations, I bridge theory with practical applications through hands-on 
                projects in mathematics, aerospace engineering, and motorsports technology.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <motion.div 
                  className="bg-white p-4 rounded-xl shadow-md hover:shadow-xl transition-all duration-500"
                  data-aos="fade-up"
                  data-aos-delay="100"
                  whileHover={{ y: -5 }}
                >
                  <div className="flex items-center mb-2">
                    <div className="bg-red-100 p-2 rounded-full mr-3">
                      <Cpu className="text-red-600" size={20} />
                    </div>
                    <h3 className="font-semibold text-gray-900">Current Focus</h3>
                  </div>
                  <p className="text-gray-600">F1 Technology, Aerodynamics, Electrical Systems</p>
                </motion.div>
                <motion.div 
                  className="bg-white p-4 rounded-xl shadow-md hover:shadow-xl transition-all duration-500"
                  data-aos="fade-up"
                  data-aos-delay="200"
                  whileHover={{ y: -5 }}
                >
                  <div className="flex items-center mb-2">
                    <div className="bg-red-100 p-2 rounded-full mr-3">
                      <Users className="text-red-600" size={20} />
                    </div>
                    <h3 className="font-semibold text-gray-900">Leadership</h3>
                  </div>
                  <p className="text-gray-600">President of 3 Student Organizations</p>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* Experience Section with Enhanced Timeline Effect */}
        <section 
          id="experience" 
          ref={experienceRef}
          className="min-h-screen py-20 bg-gray-50 relative"
        >
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-red-50 to-transparent opacity-30"></div>
          </div>
          <div className="container mx-auto px-6 relative">
            <motion.h2 
              className="text-3xl font-bold mb-12 text-center text-gray-900" 
              data-aos="fade-down"
              whileInView={{ scale: [0.95, 1] }}
              transition={{ duration: 0.5 }}
            >
              Professional <span className="text-red-600">Experience</span>
            </motion.h2>
            
            <div className="relative">
              {/* Timeline line */}
              <div className="hidden lg:block absolute left-1/2 h-full w-0.5 bg-red-200 transform -translate-x-1/2"></div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Experience Item 1 */}
                <motion.div 
                  className="relative"
                  data-aos="fade-up"
                  data-aos-delay="100"
                  whileInView={{ x: [-50, 0], opacity: [0, 1] }}
                  transition={{ duration: 0.6 }}
                >
                  <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-500 lg:mr-8">
                    <div className="flex items-start mb-4">
                      <div className="bg-red-100 p-3 rounded-full mr-4">
                        <BookOpen className="text-red-600" size={20} />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">Math Kangaroo Olympiad Prep Tutor</h3>
                        <p className="text-gray-500">Colegio Científico de San Vito • Sep-Dec 2022</p>
                      </div>
                    </div>
                    <ul className="text-gray-600 list-disc list-inside space-y-2">
                      <li>Prepared students resulting in 3 gold and 3 bronze medals at national competition</li>
                      <li>Spearheaded STEAM introduction project engaging 30 children in hands-on learning</li>
                    </ul>
                    <div className="mt-4" data-aos="zoom-in" data-aos-delay="200">
                      <img 
                        src="/math-olympiad.jpg" 
                        alt="Math Olympiad" 
                        className="rounded-lg w-full h-48 object-cover shadow-md"
                      />
                    </div>
                  </div>
                  {/* Timeline dot */}
                  <div className="hidden lg:block absolute top-6 -right-3 w-6 h-6 bg-red-600 rounded-full border-4 border-white"></div>
                </motion.div>

                {/* Experience Item 2 */}
                <motion.div 
                  className="relative lg:mt-20"
                  data-aos="fade-up"
                  data-aos-delay="200"
                  whileInView={{ x: [50, 0], opacity: [0, 1] }}
                  transition={{ duration: 0.6 }}
                >
                  <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-500 lg:ml-8">
                    <div className="flex items-start mb-4">
                      <div className="bg-red-100 p-3 rounded-full mr-4">
                        <Rocket className="text-red-600" size={20} />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">Autodesk Design Engineer</h3>
                        <p className="text-gray-500">F1 in Schools Costa Rica • May-Oct 2023</p>
                      </div>
                    </div>
                    <ul className="text-gray-600 list-disc list-inside space-y-2">
                      <li>Key member of winning F1 in Schools team as lead engineer designer</li>
                      <li>Applied advanced aerodynamics and physics principles to create award-winning designs</li>
                    </ul>
                    <div className="mt-4" data-aos="zoom-in" data-aos-delay="300">
                      <img 
                        src="/f1-design.jpg" 
                        alt="F1 Design" 
                        className="rounded-lg w-full h-48 object-cover shadow-md"
                      />
                    </div>
                  </div>
                  {/* Timeline dot */}
                  <div className="hidden lg:block absolute top-6 -left-3 w-6 h-6 bg-red-600 rounded-full border-4 border-white"></div>
                </motion.div>

                {/* Experience Item 3 */}
                <motion.div 
                  className="relative lg:mt-10"
                  data-aos="fade-up"
                  data-aos-delay="300"
                  whileInView={{ x: [-50, 0], opacity: [0, 1] }}
                  transition={{ duration: 0.6 }}
                >
                  <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-500 lg:mr-8">
                    <div className="flex items-start mb-4">
                      <div className="bg-red-100 p-3 rounded-full mr-4">
                        <Users className="text-red-600" size={20} />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">Speaker & Technical Judge</h3>
                        <p className="text-gray-500">F1 in Schools Costa Rica • Apr 2024-Present</p>
                      </div>
                    </div>
                    <ul className="text-gray-600 list-disc list-inside space-y-2">
                      <li>Spearheaded car design analysis across 15 national venues</li>
                      <li>Partnered with Boston Scientific and Tecnikids senior engineers</li>
                    </ul>
                    <div className="mt-4" data-aos="zoom-in" data-aos-delay="400">
                      <img 
                        src="/f1-judging.jpg" 
                        alt="F1 Judging" 
                        className="rounded-lg w-full h-48 object-cover shadow-md"
                      />
                    </div>
                  </div>
                  {/* Timeline dot */}
                  <div className="hidden lg:block absolute top-6 -right-3 w-6 h-6 bg-red-600 rounded-full border-4 border-white"></div>
                </motion.div>

                {/* Experience Item 4 */}
                <motion.div 
                  className="relative lg:mt-20"
                  data-aos="fade-up"
                  data-aos-delay="400"
                  whileInView={{ x: [50, 0], opacity: [0, 1] }}
                  transition={{ duration: 0.6 }}
                >
                  <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-500 lg:ml-8">
                    <div className="flex items-start mb-4">
                      <div className="bg-red-100 p-3 rounded-full mr-4">
                        <Code2 className="text-red-600" size={20} />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">Innovation Department Assistant</h3>
                        <p className="text-gray-500">Texas Tech University • Feb 2025-Present</p>
                      </div>
                    </div>
                    <ul className="text-gray-600 list-disc list-inside space-y-2">
                      <li>Manage department programs, optimizing efficiency</li>
                      <li>Receive mentorship from department head</li>
                    </ul>
                    <div className="mt-4" data-aos="zoom-in" data-aos-delay="500">
                      <img 
                        src="/innovation-lab.jpg" 
                        alt="Innovation Lab" 
                        className="rounded-lg w-full h-48 object-cover shadow-md"
                      />
                    </div>
                  </div>
                  {/* Timeline dot */}
                  <div className="hidden lg:block absolute top-6 -left-3 w-6 h-6 bg-red-600 rounded-full border-4 border-white"></div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* Education Section with Enhanced Card Animation */}
        <section id="education" className="min-h-screen py-20 bg-gradient-to-br from-white to-gray-50">
          <div className="container mx-auto px-6">
            <motion.h2 
              className="text-3xl font-bold mb-12 text-center text-gray-900" 
              data-aos="fade-down"
              whileInView={{ scale: [0.95, 1] }}
              transition={{ duration: 0.5 }}
            >
              Education & <span className="text-red-600">Qualifications</span>
            </motion.h2>
            
            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Education Item 1 */}
              <motion.div 
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-500"
                data-aos="flip-left"
                data-aos-delay="100"
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-start">
                  <div className="bg-red-100 p-3 rounded-full mr-4">
                    <BookOpen className="text-red-600" size={20} />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">Bachelor of Science in Electrical Engineering</h3>
                    <p className="text-gray-500">Texas Tech University Costa Rica • Jan 2024-Present</p>
                    <div className="mt-4">
                      <div className="flex items-center mb-2">
                        <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-medium">GPA: 4.0</span>
                      </div>
                      <h4 className="font-medium text-gray-900 mb-2">Leadership Roles:</h4>
                      <ul className="text-gray-600 list-disc list-inside space-y-1">
                        <li>President of ACMO Tech (Competitive Math Olympiad Club)</li>
                        <li>President of Red Planet (Aerospace Engineering Club)</li>
                        <li>President of Red Karting Racing Club</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Education Item 2 */}
              <motion.div 
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-500"
                data-aos="flip-left"
                data-aos-delay="200"
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-start">
                  <div className="bg-red-100 p-3 rounded-full mr-4">
                    <BookOpen className="text-red-600" size={20} />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">High School Diploma</h3>
                    <p className="text-gray-500">Colegio Científico de San Vito • 2022-2023</p>
                    <div className="mt-4">
                      <div className="flex items-center mb-2">
                        <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-medium">GPA: 4.0</span>
                      </div>
                      <h4 className="font-medium text-gray-900 mb-2">Notable Achievements:</h4>
                      <ul className="text-gray-600 list-disc list-inside space-y-1">
                        <li>Bronze medal in International Mathematical Kangaroo Olympiad 2022</li>
                        <li>Gold medal in International Mathematical Kangaroo Olympiad 2023</li>
                        <li>Honorable mention in Olimpiada Costarricense de Ciencias Biológicas 2022</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Skills Section with Enhanced Radial Progress Bars */}
        <section id="skills" className="min-h-screen py-20 bg-white">
          <div className="container mx-auto px-6">
            <motion.h2 
              className="text-3xl font-bold mb-12 text-center text-gray-900" 
              data-aos="fade-down"
              whileInView={{ scale: [0.95, 1] }}
              transition={{ duration: 0.5 }}
            >
              Technical <span className="text-red-600">Expertise</span>
            </motion.h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Technical Skills */}
              <motion.div 
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-500 border border-gray-100"
                data-aos="fade-up"
                data-aos-delay="100"
                whileHover={{ y: -5 }}
              >
                <div className="flex items-center mb-6">
                  <div className="bg-red-100 p-3 rounded-full mr-4">
                    <Cpu className="text-red-600" size={20} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Technical Skills</h3>
                </div>
                <ul className="space-y-4">
                  <li>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-gray-700">Fusion 360 (2D/3D)</span>
                      <span className="text-sm font-medium text-red-600">95%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <motion.div 
                        className="bg-red-600 h-2 rounded-full" 
                        initial={{ width: 0 }}
                        whileInView={{ width: '95%' }}
                        transition={{ duration: 1, delay: 0.2 }}
                      />
                    </div>
                  </li>
                  <li>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-gray-700">CFD Software</span>
                      <span className="text-sm font-medium text-red-600">90%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <motion.div 
                        className="bg-red-600 h-2 rounded-full" 
                        initial={{ width: 0 }}
                        whileInView={{ width: '90%' }}
                        transition={{ duration: 1, delay: 0.4 }}
                      />
                    </div>
                  </li>
                  <li>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-gray-700">Python</span>
                      <span className="text-sm font-medium text-red-600">85%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <motion.div 
                        className="bg-red-600 h-2 rounded-full" 
                        initial={{ width: 0 }}
                        whileInView={{ width: '85%' }}
                        transition={{ duration: 1, delay: 0.6 }}
                      />
                    </div>
                  </li>
                </ul>
              </motion.div>

              {/* Languages */}
              <motion.div 
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-500 border border-gray-100"
                data-aos="fade-up"
                data-aos-delay="200"
                whileHover={{ y: -5 }}
              >
                <div className="flex items-center mb-6">
                  <div className="bg-red-100 p-3 rounded-full mr-4">
                    <BookOpen className="text-red-600" size={20} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Languages</h3>
                </div>
                <ul className="space-y-4">
                  <li>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-gray-700">Spanish</span>
                      <span className="text-sm font-medium text-red-600">100%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <motion.div 
                        className="bg-red-600 h-2 rounded-full" 
                        initial={{ width: 0 }}
                        whileInView={{ width: '100%' }}
                        transition={{ duration: 1, delay: 0.3 }}
                      />
                    </div>
                  </li>
                  <li>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-gray-700">English</span>
                      <span className="text-sm font-medium text-red-600">95%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <motion.div 
                        className="bg-red-600 h-2 rounded-full" 
                        initial={{ width: 0 }}
                        whileInView={{ width: '95%' }}
                        transition={{ duration: 1, delay: 0.5 }}
                      />
                    </div>
                  </li>
                </ul>
              </motion.div>

              {/* Soft Skills */}
              <motion.div 
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-500 border border-gray-100"
                data-aos="fade-up"
                data-aos-delay="300"
                whileHover={{ y: -5 }}
              >
                <div className="flex items-center mb-6">
                  <div className="bg-red-100 p-3 rounded-full mr-4">
                    <Users className="text-red-600" size={20} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Soft Skills</h3>
                </div>
                <div className="flex flex-wrap gap-3">
                  <motion.span 
                    className="bg-red-50 text-red-600 px-4 py-2 rounded-full text-sm font-medium shadow-sm"
                    whileHover={{ scale: 1.1 }}
                  >
                    Leadership
                  </motion.span>
                  <motion.span 
                    className="bg-red-50 text-red-600 px-4 py-2 rounded-full text-sm font-medium shadow-sm"
                    whileHover={{ scale: 1.1 }}
                  >
                    Creativity
                  </motion.span>
                  <motion.span 
                    className="bg-red-50 text-red-600 px-4 py-2 rounded-full text-sm font-medium shadow-sm"
                    whileHover={{ scale: 1.1 }}
                  >
                    Problem Solving
                  </motion.span