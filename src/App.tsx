import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-scroll';
import { Github, Linkedin, Mail, Phone, Menu, X, Award, Rocket, Cpu, BookOpen, Users, Code2, ChevronDown } from 'lucide-react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import emailjs from '@emailjs/browser';

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
  const [blurIntensity, setBlurIntensity] = useState(0);
  const [textOpacity, setTextOpacity] = useState(0);
  const [activeSection, setActiveSection] = useState('hero');
  const [isAboutVisible, setIsAboutVisible] = useState(false);
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('down');
  const [lastScrollY, setLastScrollY] = useState(0);
  const aboutRef = useRef<HTMLDivElement>(null);
  const [aboutOpacity, setAboutOpacity] = useState(0);
  const [isSending, setIsSending] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  // Initialize AOS
  useEffect(() => {
    AOS.init({ duration: 1000, once: false });
  }, []);

  // Initialize EmailJS
  useEffect(() => {
    emailjs.init("YOUR_PUBLIC_KEY"); // Reemplaza con tu public key de EmailJS
  }, []);

  // Scroll effect handler
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 10);
      setBlurIntensity(Math.min(scrollY / 50, 5));
      setTextOpacity(Math.min(scrollY / 200, 1));
      
      // Calculate about section opacity based on scroll position and direction
      const aboutSection = document.getElementById('about');
      if (aboutSection) {
        const rect = aboutSection.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const scrollPosition = window.scrollY;
        const sectionTop = rect.top + scrollPosition;
        
        // Determine scroll direction
        const isScrollingDown = scrollY > lastScrollY;
        setLastScrollY(scrollY);
        
        // Calculate opacity based on scroll position and direction
        let opacity = 0;
        if (isScrollingDown) {
          opacity = Math.min(
            Math.max(0, (scrollPosition - sectionTop + windowHeight * 0.5) / (windowHeight * 0.5)),
            1
          );
        } else {
          opacity = 0; // Completely transparent when scrolling up
        }
        setAboutOpacity(opacity);
      }

      if (scrollY === 0) {
        AOS.refresh();
      }

      // Detect scroll direction
      if (scrollY > lastScrollY) {
        setScrollDirection('down');
      } else {
        setScrollDirection('up');
      }

      // Detect active section
      const sections = document.querySelectorAll<HTMLElement>('section[id]');
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
  }, [lastScrollY]);

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
      rgba(239, 68, 68, ${textOpacity * 0.1}),
      rgba(0, 0, 0, ${textOpacity * 0.8})
    )`;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSending(true);

    try {
      if (!formRef.current) return;

      const result = await emailjs.sendForm(
        "YOUR_SERVICE_ID", // Reemplaza con tu Service ID
        "YOUR_TEMPLATE_ID", // Reemplaza con tu Template ID
        formRef.current,
        "YOUR_PUBLIC_KEY" // Reemplaza con tu public key
      );

      if (result.text === 'OK') {
        const successMessage = document.createElement('div');
        successMessage.className = 'bg-green-500/90 text-white p-4 rounded-lg mt-4 backdrop-blur-sm';
        successMessage.innerHTML = `
          <div class="flex items-center">
            <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <span>Message sent successfully! I will get back to you soon.</span>
          </div>
        `;
        formRef.current.appendChild(successMessage);
        formRef.current.reset();

        setTimeout(() => {
          successMessage.remove();
        }, 5000);
      }
    } catch (error) {
      console.error('Error sending email:', error);
      const errorMessage = document.createElement('div');
      errorMessage.className = 'bg-red-500/90 text-white p-4 rounded-lg mt-4 backdrop-blur-sm';
      errorMessage.innerHTML = `
        <div class="flex items-center">
          <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
          <span>There was an error sending your message. Please try again.</span>
        </div>
      `;
      formRef.current?.appendChild(errorMessage);

      setTimeout(() => {
        errorMessage.remove();
      }, 5000);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Premium Navigation Bar */}
      <nav
        className={`fixed w-full z-50 transition-all duration-500 ${
          isScrolled ? 'bg-white/90 backdrop-blur-md shadow-lg py-3' : 'bg-transparent py-6'
        }`}
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
              <Rocket className="mr-2 transition-transform duration-500 group-hover:rotate-45" />
              <span className="transition-all duration-500 group-hover:tracking-wider">DIEGO HIDALGO</span>
            </Link>

            {/* Mobile Menu Button */}
            <button
              className={`md:hidden rounded-md p-2 ${
                isScrolled ? 'text-gray-900 hover:bg-gray-100' : 'text-white hover:bg-gray-800'
              } transition-all`}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X size={24} className="animate-spin-in" />
              ) : (
                <Menu size={24} className="animate-pulse" />
              )}
            </button>

            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-1" data-aos="fade-left">
              {navLinks.map(link => renderNavLink(link.href, link.label))}
            </div>
          </div>

          {/* Premium Mobile Navigation */}
          <div 
            className={`md:hidden ${isMobileMenuOpen ? 'block' : 'hidden'} mt-4 transition-all duration-500 ${
              isScrolled ? 'bg-white/95' : 'bg-gray-900/95'
            } rounded-xl p-6 shadow-2xl backdrop-blur-lg`}
            data-aos="fade-down"
          >
            <div className="flex flex-col space-y-4">
              {navLinks.map(link => renderNavLink(link.href, link.label))}
              <div className="flex justify-center space-x-6 pt-6">
                {socialLinks.map(({ href, icon: Icon, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${
                      isScrolled ? 'text-gray-900 hover:text-red-600' : 'text-white hover:text-red-200'
                    } transition-all transform hover:scale-125`}
                    aria-label={label}
                  >
                    <Icon size={24} />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Premium Hero Section with Parallax Effect */}
      <section 
        id="hero"
        className="fixed h-[100vh] w-full flex items-center justify-start bg-[url('/4.jpg')] bg-cover bg-center bg-fixed"
        style={{ 
          filter: `blur(${blurIntensity}px)`,
          transform: `translateY(${window.scrollY * 0.3}px)`
        }}
      >
        <div 
          className="absolute inset-0 transition-all duration-1000"
          style={{ 
            background: getBackgroundGradient(),
            opacity: textOpacity * 0.7
          }}
        />
        <div className="container mx-auto px-6 text-left relative" data-aos="fade-up" data-aos-delay="200">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">
              <span className="inline-block bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
                DIEGO HIDALGO
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-white mb-2 font-light opacity-90">
              Electrical Engineering Student | F1 Technology Innovator
            </p>
            <p className="text-lg text-white mb-8 opacity-80 leading-relaxed">
              Combining cutting-edge electrical engineering expertise with motorsport passion to 
              revolutionize performance through innovative systems and aerodynamic solutions.
            </p>
            <div className="flex space-x-4">
              <Link
                to="projects"
                smooth={true}
                duration={800}
                offset={-100}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition-all transform hover:-translate-y-1 shadow-lg hover:shadow-xl flex items-center"
                data-aos="fade-up"
                data-aos-delay="300"
              >
                View My Work <ChevronDown className="ml-2 animate-bounce" />
              </Link>
            </div>
          </div>
          <div 
            className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
            data-aos="fade-up"
            data-aos-delay="1000"
          >
            <Link
              to="about"
              smooth={true}
              duration={800}
              offset={-100}
              className="text-white cursor-pointer block animate-bounce"
            >
              <ChevronDown size={32} />
            </Link>
          </div>
        </div>
      </section>

      {/* Premium Main Content */}
      <main className="relative z-10 bg-transparent pt-[120vh]">
        {/* About Section */}
        <section 
          id="about" 
          className="min-h-[100vh] flex items-center justify-center py-32 relative bg-gradient-to-b from-gray-900 to-black"
          style={{ 
            opacity: aboutOpacity,
            transition: 'opacity 0.7s ease-out, transform 0.7s ease-out',
            transform: `translateY(${scrollDirection === 'down' ? '0' : '-20px'})`
          }}
        >
          <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 relative">
            <div 
              className="flex items-center justify-center transition-opacity duration-700"
              data-aos="fade-right"
              data-aos-duration="1000"
            >
              <div className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-br from-red-600/20 to-transparent rounded-2xl opacity-70 group-hover:opacity-100 transition-all duration-700"></div>
                <img
                  src="/5.jpg"
                  alt="Diego Hidalgo"
                  className="w-full max-w-lg rounded-lg shadow-2xl object-cover h-[500px] transform group-hover:-translate-y-2 transition-transform duration-500"
                />
                <div className="absolute -bottom-4 -right-4 bg-red-600/90 text-white px-6 py-3 rounded-lg shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                  <span className="font-medium text-lg">Diego Hidalgo</span>
                </div>
              </div>
            </div>
            <div 
              className="flex flex-col justify-center transition-opacity duration-700"
              data-aos="fade-left"
              data-aos-duration="1000"
              data-aos-delay="200"
            >
              <h2 className="text-4xl font-bold mb-8 text-white relative inline-block">
                <span className="relative z-10">About Me</span>
                <span className="absolute bottom-0 left-0 w-full h-2 bg-red-600/50 z-0 opacity-70"></span>
              </h2>
              <div className="bg-gray-800/50 p-10 rounded-xl shadow-lg backdrop-blur-sm border border-gray-700/50">
                <p className="text-white leading-relaxed mb-8 text-lg">
                  I'm a passionate third-year electrical engineering student at Texas Tech University with a 4.0 GPA, 
                  specializing in cutting-edge technology applications for motorsports. My journey from a small rural 
                  town in Costa Rica to becoming a leader in academic and competitive engineering environments has 
                  shaped my innovative approach to problem-solving.
                </p>
                <p className="text-white leading-relaxed mb-8 text-lg">
                  As the president of three student organizations (ACMO Tech, Red Planet, and Red Karting Racing Club), 
                  I bridge theory with practical applications through hands-on projects in mathematics, aerospace 
                  engineering, and motorsports technology.
                </p>
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-gray-700/30 p-6 rounded-lg backdrop-blur-sm border border-gray-600/30">
                    <div className="flex items-center mb-3">
                      <Cpu className="text-red-400 mr-3" size={24} />
                      <h3 className="font-semibold text-white text-xl">Current Focus</h3>
                    </div>
                    <p className="text-white text-lg">F1 Technology, Aerodynamics, Electrical Systems</p>
                  </div>
                  <div className="bg-gray-700/30 p-6 rounded-lg backdrop-blur-sm border border-gray-600/30">
                    <div className="flex items-center mb-3">
                      <Users className="text-red-400 mr-3" size={24} />
                      <h3 className="font-semibold text-white text-xl">Leadership</h3>
                    </div>
                    <p className="text-white text-lg">President of 3 Student Organizations</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Experience Section with Timeline Effect */}
        <section id="experience" className="min-h-screen py-20 bg-gray-50 relative">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-red-50 to-transparent opacity-30"></div>
          </div>
          <div className="container mx-auto px-6 relative">
            <h2 className="text-3xl font-bold mb-12 text-center text-gray-900" data-aos="fade-down">
              Professional <span className="text-red-600">Experience</span>
            </h2>
            
            <div className="relative">
              {/* Timeline line */}
              <div className="hidden lg:block absolute left-1/2 h-full w-0.5 bg-red-200 transform -translate-x-1/2"></div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Experience Item 1 */}
                <div 
                  className="relative"
                  data-aos="fade-up"
                  data-aos-delay="100"
                >
                  <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-500 hover:-translate-y-2 lg:mr-8">
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
                        src="/3.jpg" 
                        alt="Math Olympiad" 
                        className="rounded-lg w-full h-48 object-cover shadow-md"
                      />
                    </div>
                  </div>
                  {/* Timeline dot */}
                  <div className="hidden lg:block absolute top-6 -right-3 w-6 h-6 bg-red-600 rounded-full border-4 border-white"></div>
                </div>

                {/* Experience Item 2 */}
                <div 
                  className="relative lg:mt-20"
                  data-aos="fade-up"
                  data-aos-delay="200"
                >
                  <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-500 hover:-translate-y-2 lg:ml-8">
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
                        src="/4.jpg" 
                        alt="F1 Design" 
                        className="rounded-lg w-full h-48 object-cover shadow-md"
                      />
                    </div>
                  </div>
                  {/* Timeline dot */}
                  <div className="hidden lg:block absolute top-6 -left-3 w-6 h-6 bg-red-600 rounded-full border-4 border-white"></div>
                </div>

                {/* Experience Item 3 */}
                <div 
                  className="relative lg:mt-10"
                  data-aos="fade-up"
                  data-aos-delay="300"
                >
                  <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-500 hover:-translate-y-2 lg:mr-8">
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
                        src="/2.jpg" 
                        alt="F1 Judging" 
                        className="rounded-lg w-full h-48 object-cover shadow-md"
                      />
                    </div>
                  </div>
                  {/* Timeline dot */}
                  <div className="hidden lg:block absolute top-6 -right-3 w-6 h-6 bg-red-600 rounded-full border-4 border-white"></div>
                </div>

                {/* Experience Item 4 */}
                <div 
                  className="relative lg:mt-20"
                  data-aos="fade-up"
                  data-aos-delay="400"
                >
                  <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-500 hover:-translate-y-2 lg:ml-8">
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
                        src="/3.jpg" 
                        alt="Innovation Lab" 
                        className="rounded-lg w-full h-48 object-cover shadow-md"
                      />
                    </div>
                  </div>
                  {/* Timeline dot */}
                  <div className="hidden lg:block absolute top-6 -left-3 w-6 h-6 bg-red-600 rounded-full border-4 border-white"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Education Section with Card Design */}
        <section id="education" className="min-h-screen py-32 relative">
          <div className="absolute inset-0 bg-[url('/3.jpg')] bg-cover bg-center bg-fixed opacity-20"></div>
          <div className="container mx-auto px-6 relative">
            <h2 className="text-4xl font-bold mb-16 text-center text-gray-900" data-aos="fade-down">
              Education & <span className="text-red-600">Qualifications</span>
            </h2>
            
            <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Education Item 1 */}
              <div 
                className="bg-white/90 p-8 rounded-xl shadow-md hover:shadow-xl transition-all duration-500 hover:-translate-y-2"
                data-aos="flip-left"
                data-aos-delay="100"
              >
                <div className="flex items-start">
                  <div className="bg-red-100 p-4 rounded-full mr-6">
                    <BookOpen className="text-red-600" size={24} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold text-gray-900">Bachelor of Science in Electrical Engineering</h3>
                    <p className="text-gray-500 text-lg mt-2">Texas Tech University Costa Rica • Jan 2024-Present</p>
                    <div className="mt-6">
                      <div className="flex items-center mb-3">
                        <span className="bg-red-100 text-red-600 px-4 py-2 rounded-full text-lg font-medium">GPA: 4.0</span>
                      </div>
                      <h4 className="font-medium text-gray-900 text-xl mb-3">Leadership Roles:</h4>
                      <ul className="text-gray-600 list-disc list-inside space-y-2 text-lg">
                        <li>President of ACMO Tech (Competitive Math Olympiad Club)</li>
                        <li>President of Red Planet (Aerospace Engineering Club)</li>
                        <li>President of Red Karting Racing Club</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Education Item 2 */}
              <div 
                className="bg-white/90 p-8 rounded-xl shadow-md hover:shadow-xl transition-all duration-500 hover:-translate-y-2"
                data-aos="flip-left"
                data-aos-delay="200"
              >
                <div className="flex items-start">
                  <div className="bg-red-100 p-4 rounded-full mr-6">
                    <BookOpen className="text-red-600" size={24} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold text-gray-900">High School Diploma</h3>
                    <p className="text-gray-500 text-lg mt-2">Colegio Científico de San Vito • 2022-2023</p>
                    <div className="mt-6">
                      <div className="flex items-center mb-3">
                        <span className="bg-red-100 text-red-600 px-4 py-2 rounded-full text-lg font-medium">GPA: 4.0</span>
                      </div>
                      <h4 className="font-medium text-gray-900 text-xl mb-3">Notable Achievements:</h4>
                      <ul className="text-gray-600 list-disc list-inside space-y-2 text-lg">
                        <li>Bronze medal in International Mathematical Kangaroo Olympiad 2022</li>
                        <li>Gold medal in International Mathematical Kangaroo Olympiad 2023</li>
                        <li>Honorable mention in Olimpiada Costarricense de Ciencias Biológicas 2022</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Skills Section with Radial Progress Bars */}
        <section id="skills" className="min-h-screen py-20 bg-white">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold mb-12 text-center text-gray-900" data-aos="fade-down">
              Technical <span className="text-red-600">Expertise</span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Technical Skills */}
              <div 
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-500 hover:-translate-y-2 border border-gray-100"
                data-aos="fade-up"
                data-aos-delay="100"
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
                      <div className="bg-red-600 h-2 rounded-full" style={{ width: '95%' }}></div>
                    </div>
                  </li>
                  <li>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-gray-700">CFD Software</span>
                      <span className="text-sm font-medium text-red-600">90%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-red-600 h-2 rounded-full" style={{ width: '90%' }}></div>
                    </div>
                  </li>
                  <li>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-gray-700">Python</span>
                      <span className="text-sm font-medium text-red-600">85%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-red-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                  </li>
                </ul>
              </div>

              {/* Languages */}
              <div 
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-500 hover:-translate-y-2 border border-gray-100"
                data-aos="fade-up"
                data-aos-delay="200"
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
                      <div className="bg-red-600 h-2 rounded-full" style={{ width: '100%' }}></div>
                    </div>
                  </li>
                  <li>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-gray-700">English</span>
                      <span className="text-sm font-medium text-red-600">95%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-red-600 h-2 rounded-full" style={{ width: '95%' }}></div>
                    </div>
                  </li>
                </ul>
              </div>

              {/* Soft Skills */}
              <div 
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-500 hover:-translate-y-2 border border-gray-100"
                data-aos="fade-up"
                data-aos-delay="300"
              >
                <div className="flex items-center mb-6">
                  <div className="bg-red-100 p-3 rounded-full mr-4">
                    <Users className="text-red-600" size={20} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Soft Skills</h3>
                </div>
                <div className="flex flex-wrap gap-3">
                  <span className="bg-red-50 text-red-600 px-4 py-2 rounded-full text-sm font-medium shadow-sm hover:shadow-md transition-shadow">Leadership</span>
                  <span className="bg-red-50 text-red-600 px-4 py-2 rounded-full text-sm font-medium shadow-sm hover:shadow-md transition-shadow">Creativity</span>
                  <span className="bg-red-50 text-red-600 px-4 py-2 rounded-full text-sm font-medium shadow-sm hover:shadow-md transition-shadow">Problem Solving</span>
                  <span className="bg-red-50 text-red-600 px-4 py-2 rounded-full text-sm font-medium shadow-sm hover:shadow-md transition-shadow">Teamwork</span>
                  <span className="bg-red-50 text-red-600 px-4 py-2 rounded-full text-sm font-medium shadow-sm hover:shadow-md transition-shadow">Adaptability</span>
                  <span className="bg-red-50 text-red-600 px-4 py-2 rounded-full text-sm font-medium shadow-sm hover:shadow-md transition-shadow">Communication</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Awards Section with Trophy Display */}
        <section id="awards" className="min-h-screen py-32 relative">
          <div className="absolute inset-0 bg-[url('/4.jpg')] bg-cover bg-center bg-fixed opacity-20"></div>
          <div className="container mx-auto px-6 relative">
            <h2 className="text-4xl font-bold mb-16 text-center text-gray-900" data-aos="fade-down">
              Awards & <span className="text-red-600">Achievements</span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {/* Award 1 */}
              <div 
                className="bg-white/90 p-8 rounded-xl shadow-md hover:shadow-xl transition-all duration-500 hover:-translate-y-2"
                data-aos="flip-up"
                data-aos-delay="100"
              >
                <div className="flex items-center mb-6">
                  <div className="bg-red-100 p-4 rounded-full mr-6">
                    <Award className="text-red-600" size={24} />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900">F1 in Schools</h3>
                </div>
                <ul className="text-gray-600 space-y-3 text-lg">
                  <li className="flex items-start">
                    <span className="text-red-500 mr-3">•</span>
                    <span>Winner of STEM Challenge F1 in Schools Costa Rica 2023</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-500 mr-3">•</span>
                    <span>Honored participant at Mexico F1 Grand Prix 2023</span>
                  </li>
                </ul>
                <div className="mt-8 flex justify-center">
                  <div className="bg-red-100 p-6 rounded-full">
                    <Award className="text-red-600" size={48} />
                  </div>
                </div>
              </div>

              {/* Award 2 */}
              <div 
                className="bg-white/90 p-8 rounded-xl shadow-md hover:shadow-xl transition-all duration-500 hover:-translate-y-2"
                data-aos="flip-up"
                data-aos-delay="200"
              >
                <div className="flex items-center mb-6">
                  <div className="bg-red-100 p-4 rounded-full mr-6">
                    <Award className="text-red-600" size={24} />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900">Math Competitions</h3>
                </div>
                <ul className="text-gray-600 space-y-3 text-lg">
                  <li className="flex items-start">
                    <span className="text-red-500 mr-3">•</span>
                    <span>Gold medal - International Mathematical Kangaroo Olympiad 2023</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-500 mr-3">•</span>
                    <span>Bronze medal - International Mathematical Kangaroo Olympiad 2022</span>
                  </li>
                </ul>
                <div className="mt-8 flex justify-center">
                  <div className="bg-red-100 p-6 rounded-full">
                    <Award className="text-red-600" size={48} />
                  </div>
                </div>
              </div>

              {/* Award 3 */}
              <div 
                className="bg-white/90 p-8 rounded-xl shadow-md hover:shadow-xl transition-all duration-500 hover:-translate-y-2"
                data-aos="flip-up"
                data-aos-delay="300"
              >
                <div className="flex items-center mb-6">
                  <div className="bg-red-100 p-4 rounded-full mr-6">
                    <Award className="text-red-600" size={24} />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900">Other Achievements</h3>
                </div>
                <ul className="text-gray-600 space-y-3 text-lg">
                  <li className="flex items-start">
                    <span className="text-red-500 mr-3">•</span>
                    <span>Winner of SUMOBOT technology challenge</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-500 mr-3">•</span>
                    <span>Perfect 4.0 GPA in both high school and university</span>
                  </li>
                </ul>
                <div className="mt-8 flex justify-center">
                  <div className="bg-red-100 p-6 rounded-full">
                    <Award className="text-red-600" size={48} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Projects Section with Hover Effects */}
        <section id="projects" className="min-h-screen py-20 bg-white">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold mb-12 text-center text-gray-900" data-aos="fade-down">
              Featured <span className="text-red-600">Projects</span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Project 1 */}
              <div 
                className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500"
                data-aos="zoom-in"
                data-aos-delay="100"
              >
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src="/4.jpg" 
                    alt="ACMO Tech" 
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                </div>
                <div className="absolute bottom-0 left-0 p-6 w-full">
                  <div className="flex items-center mb-2">
                    <div className="bg-red-600 p-2 rounded-full mr-3">
                      <Rocket className="text-white" size={18} />
                    </div>
                    <h3 className="text-xl font-semibold text-white">ACMO Tech</h3>
                  </div>
                  <p className="text-gray-200 mb-4">
                    Founded and lead Texas Tech University's premier math Olympiad team as President, 
                    training members for international competitions.
                  </p>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <a 
                      href="#"
                      className="inline-flex items-center text-red-300 hover:text-white"
                    >
                      Learn more <ChevronDown className="ml-1 transform rotate-90" size={16} />
                    </a>
                  </div>
                </div>
              </div>

              {/* Project 2 */}
              <div 
                className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500"
                data-aos="zoom-in"
                data-aos-delay="200"
              >
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src="/4.jpg" 
                    alt="Red Planet" 
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                </div>
                <div className="absolute bottom-0 left-0 p-6 w-full">
                  <div className="flex items-center mb-2">
                    <div className="bg-red-600 p-2 rounded-full mr-3">
                      <Rocket className="text-white" size={18} />
                    </div>
                    <h3 className="text-xl font-semibold text-white">Red Planet</h3>
                  </div>
                  <p className="text-gray-200 mb-4">
                    Direct STEAM projects in aerodynamics and space technology as President of the Aerospace 
                    Engineering Club.
                  </p>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <a 
                      href="#"
                      className="inline-flex items-center text-red-300 hover:text-white"
                    >
                      Learn more <ChevronDown className="ml-1 transform rotate-90" size={16} />
                    </a>
                  </div>
                </div>
              </div>

              {/* Project 3 */}
              <div 
                className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500"
                data-aos="zoom-in"
                data-aos-delay="300"
              >
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src="/4.jpg" 
                    alt="Karting Club" 
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                </div>
                <div className="absolute bottom-0 left-0 p-6 w-full">
                  <div className="flex items-center mb-2">
                    <div className="bg-red-600 p-2 rounded-full mr-3">
                      <Rocket className="text-white" size={18} />
                    </div>
                    <h3 className="text-xl font-semibold text-white">Red Karting Racing Club</h3>
                  </div>
                  <p className="text-gray-200 mb-4">
                    Oversee karting design, performance optimization, and F1 projects as President, 
                    conducting workshops on motorsports engineering.
                  </p>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <a 
                      href="#"
                      className="inline-flex items-center text-red-300 hover:text-white"
                    >
                      Learn more <ChevronDown className="ml-1 transform rotate-90" size={16} />
                    </a>
                  </div>
                </div>
              </div>

              {/* Project 4 */}
              <div 
                className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500"
                data-aos="zoom-in"
                data-aos-delay="400"
              >
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src="/4.jpg" 
                    alt="F1 Design Project" 
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                </div>
                <div className="absolute bottom-0 left-0 p-6 w-full">
                  <div className="flex items-center mb-2">
                    <div className="bg-red-600 p-2 rounded-full mr-3">
                      <Rocket className="text-white" size={18} />
                    </div>
                    <h3 className="text-xl font-semibold text-white">F1 in Schools Design</h3>
                  </div>
                  <p className="text-gray-200 mb-4">
                    Pioneered complex aerodynamic simulations through CFD software to create 
                    award-winning F1 car designs, resulting in national recognition.
                  </p>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <a 
                      href="#"
                      className="inline-flex items-center text-red-300 hover:text-white"
                    >
                      Learn more <ChevronDown className="ml-1 transform rotate-90" size={16} />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Premium Contact Section */}
        <section id="contact" className="py-20 bg-gradient-to-br from-red-600 to-red-800 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/3.jpg')] bg-cover bg-center bg-fixed opacity-10"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-red-600/90 to-red-800/90"></div>
          <div className="container mx-auto px-6 relative">
            <h2 className="text-4xl font-bold mb-12 text-center" data-aos="fade-down">
              Let's <span className="text-white">Connect</span>
            </h2>
            
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
              <div data-aos="fade-right" className="space-y-8">
                <div className="bg-white/10 p-8 rounded-2xl backdrop-blur-sm shadow-xl">
                  <h3 className="text-2xl font-semibold mb-6 relative inline-block">
                    <span className="relative z-10">Contact Information</span>
                    <span className="absolute bottom-0 left-0 w-full h-2 bg-white/30 z-0 opacity-70"></span>
                  </h3>
                  <div className="space-y-6">
                    <div className="flex items-start group">
                      <div className="bg-white/20 p-3 rounded-full mr-4 group-hover:bg-white/30 transition-all duration-300">
                        <Mail size={24} />
                      </div>
                      <div>
                        <p className="font-medium text-lg">Email</p>
                        <a 
                          href="mailto:dihidalg@ttu.edu" 
                          className="hover:underline transition-all duration-300 hover:tracking-wide text-white/90 hover:text-white text-lg"
                        >
                          dihidalg@ttu.edu
                        </a>
                      </div>
                    </div>
                    <div className="flex items-start group">
                      <div className="bg-white/20 p-3 rounded-full mr-4 group-hover:bg-white/30 transition-all duration-300 transform group-hover:scale-110">
                        <Phone size={24} />
                      </div>
                      <div className="flex flex-col">
                        <p className="font-medium text-lg mb-1">Phone</p>
                        <a 
                          href="tel:+50685489448" 
                          className="hover:underline transition-all duration-300 hover:tracking-wide text-white/90 hover:text-white text-lg flex items-center group"
                        >
                          <span className="mr-2">(+506) 8548-9448</span>
                          <svg 
                            className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path 
                              strokeLinecap="round" 
                              strokeLinejoin="round" 
                              strokeWidth={2} 
                              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" 
                            />
                          </svg>
                        </a>
                        <p className="text-white/60 text-sm mt-1">Available for calls and WhatsApp</p>
                      </div>
                    </div>
                    <div className="flex items-start group">
                      <div className="bg-white/20 p-3 rounded-full mr-4 group-hover:bg-white/30 transition-all duration-300">
                        <Linkedin size={24} />
                      </div>
                      <div>
                        <p className="font-medium text-lg">LinkedIn</p>
                        <a 
                          href="https://www.linkedin.com/in/diegoarmandohidalgo" 
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline transition-all duration-300 hover:tracking-wide text-white/90 hover:text-white text-lg"
                        >
                          diegoarmandohidalgo
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white/10 p-8 rounded-2xl backdrop-blur-sm shadow-xl">
                  <h4 className="text-xl font-semibold mb-6">Follow Me</h4>
                  <div className="flex space-x-4">
                    {socialLinks.map(({ href, icon: Icon, label }) => (
                      <a
                        key={label}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-white/10 p-4 rounded-full hover:bg-white/20 transition-all duration-300 transform hover:scale-110 hover:shadow-lg"
                        aria-label={label}
                      >
                        <Icon size={24} />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
              
              <div data-aos="fade-left" className="bg-white/10 p-8 rounded-2xl backdrop-blur-sm shadow-xl">
                <h3 className="text-2xl font-semibold mb-6 relative inline-block">
                  <span className="relative z-10">Send Me a Message</span>
                  <span className="absolute bottom-0 left-0 w-full h-2 bg-white/30 z-0 opacity-70"></span>
                </h3>
                <form 
                  ref={formRef}
                  className="space-y-6" 
                  onSubmit={handleSubmit}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block mb-2 text-lg">Name</label>
                      <input 
                        type="text" 
                        id="name" 
                        name="user_name"
                        required
                        className="w-full px-4 py-3 rounded-lg bg-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white border border-white/20 transition-all duration-300 hover:border-white/40"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block mb-2 text-lg">Email</label>
                      <input 
                        type="email" 
                        id="email" 
                        name="user_email"
                        required
                        className="w-full px-4 py-3 rounded-lg bg-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white border border-white/20 transition-all duration-300 hover:border-white/40"
                        placeholder="Your email"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="subject" className="block mb-2 text-lg">Subject</label>
                    <input 
                      type="text" 
                      id="subject" 
                      name="subject"
                      required
                      className="w-full px-4 py-3 rounded-lg bg-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white border border-white/20 transition-all duration-300 hover:border-white/40"
                      placeholder="Subject"
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block mb-2 text-lg">Message</label>
                    <textarea 
                      id="message" 
                      name="message"
                      rows={4}
                      required
                      className="w-full px-4 py-3 rounded-lg bg-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white border border-white/20 transition-all duration-300 hover:border-white/40"
                      placeholder="Your message"
                    ></textarea>
                  </div>
                  <button 
                    type="submit" 
                    disabled={isSending}
                    className={`w-full bg-white text-red-600 px-6 py-4 rounded-lg font-medium hover:bg-gray-100 transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-xl flex items-center justify-center text-lg ${isSending ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {isSending ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending...
                      </>
                    ) : (
                      <>
                        <span>Send Message</span>
                        <Mail className="ml-2" size={24} />
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Premium Footer */}
      <footer className="bg-gray-900 text-white py-8 relative z-10">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <Rocket className="mr-2 text-red-400 animate-pulse" size={20} />
              <p className="text-gray-400 text-sm">
                © {new Date().getFullYear()} Diego Hidalgo. All rights reserved.
              </p>
            </div>
            <div className="flex space-x-6">
              {socialLinks.map(({ href, icon: Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-all duration-300 transform hover:scale-125"
                  aria-label={label}
                >
                  <Icon size={20} />
                </a>
              ))}
            </div>
          </div>
          <div className="mt-6 text-center md:text-left">
            <p className="text-xs text-gray-500">
              Designed and built with passion in Costa Rica. Performance optimized for the modern web.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;