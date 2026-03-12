import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiCheck } from 'react-icons/fi';

const About = () => {
  const stats = [
    { value: '5,000+', label: 'Students registered' },
    { value: '1,200+', label: 'Projects posted' },
    { value: '95%',    label: 'Success rate' },
    { value: '300+',   label: 'Active clients' },
  ];

  const values = [
    { title: 'Student First', desc: 'Every feature is designed with students in mind. We help the next generation build real skills through real projects.' },
    { title: 'AI-Powered Matching', desc: 'Our intelligent algorithm matches students with projects based on skills, ensuring the right fit every time.' },
    { title: 'Equal Opportunity', desc: 'Every student deserves a chance to prove their skills, regardless of background or prior experience.' },
    { title: 'Transparent Scoring', desc: 'Students can see exactly why they matched with a project through clear, explainable match scores.' },
    { title: 'Real Experience', desc: 'Work on actual projects from real clients â€” not simulations â€” to build a portfolio that stands out.' },
    { title: 'Career Growth', desc: 'From your first project to a full career, SkillBridge AI supports every step of your professional journey.' },
  ];

  const team = [
    { name: 'Parvees Ahamed', role: 'Project Lead & Full Stack Developer', initials: 'PA', desc: 'Built the core platform architecture, the AI skill-matching algorithm, and led the entire development process.' },
    { name: 'Dr. Sarah Johnson', role: 'Project Supervisor', initials: 'SJ', desc: 'Guided the research methodology and helped shape the intelligent matching algorithm design.' },
  ];

  const tech = ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'Tailwind CSS', 'JWT Auth', 'Mongoose', 'Axios'];

  const font = "'Plus Jakarta Sans', sans-serif";

  return (
    <div style={{ fontFamily: font, overflowX: 'hidden' }}>

      {/* HERO */}
      <section style={{ background: 'linear-gradient(135deg, #0d1f0d 0%, #001e00 60%, #0a2a0a 100%)', padding: '96px 32px 80px' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <span style={{ display: 'inline-block', background: '#14A800', color: '#fff', fontFamily: font, fontSize: '13px', fontWeight: 600, borderRadius: '10rem', padding: '6px 16px', marginBottom: '28px', letterSpacing: '0.4px' }}>Why SkillBridge AI</span>
          <h1 style={{ fontFamily: font, fontSize: '60px', fontWeight: 800, color: '#ffffff', lineHeight: 1.1, marginBottom: '24px', maxWidth: '700px' }}>
            Empowering Students<br /><span style={{ color: '#5CC858' }}>Through Real Projects</span>
          </h1>
          <p style={{ fontFamily: font, fontSize: '18px', color: 'rgba(255,255,255,0.75)', lineHeight: 1.7, maxWidth: '580px', marginBottom: '40px' }}>
            SkillBridge AI is a skill-based freelance marketplace built specifically for students. We connect talented learners with real-world projects to help them build portfolios, gain experience, and launch their careers.
          </p>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <Link to="/register" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#14A800', color: '#fff', fontFamily: font, fontSize: '15px', fontWeight: 600, borderRadius: '10rem', padding: '14px 28px', textDecoration: 'none' }}>
              Get started <FiArrowRight size={16} />
            </Link>
            <Link to="/browse" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'transparent', color: '#fff', fontFamily: font, fontSize: '15px', fontWeight: 600, borderRadius: '10rem', padding: '14px 28px', textDecoration: 'none', border: '1.5px solid rgba(255,255,255,0.35)' }}>
              Browse projects
            </Link>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section style={{ background: '#fff', borderBottom: '1px solid #e5e7eb', padding: '56px 32px' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '32px' }}>
          {stats.map((s, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <p style={{ fontFamily: font, fontSize: '44px', fontWeight: 800, color: '#181818', margin: 0 }}>{s.value}</p>
              <p style={{ fontFamily: font, fontSize: '15px', color: '#5e6d55', marginTop: '6px' }}>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* OUR STORY */}
      <section style={{ background: '#f9fafb', padding: '80px 32px', borderBottom: '1px solid #e5e7eb' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center' }}>
          <div>
            <p style={{ fontFamily: font, fontSize: '13px', fontWeight: 600, color: '#14A800', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '16px' }}>Our Story</p>
            <h2 style={{ fontFamily: font, fontSize: '42px', fontWeight: 800, color: '#181818', marginBottom: '24px', lineHeight: 1.2 }}>Born from a Real Problem</h2>
            <p style={{ fontFamily: font, fontSize: '16px', color: '#5e6d55', lineHeight: 1.8, marginBottom: '20px' }}>
              As students ourselves, we noticed a huge gap in the freelancing world. Platforms like Upwork and Fiverr are designed for professionals with years of experience. Students with fresh skills but no portfolio had no place to start.
            </p>
            <p style={{ fontFamily: font, fontSize: '16px', color: '#5e6d55', lineHeight: 1.8, marginBottom: '20px' }}>
              SkillBridge AI was created to bridge this gap. We built an intelligent matching system that connects students with projects perfectly suited to their skill level.
            </p>
            <p style={{ fontFamily: font, fontSize: '16px', color: '#5e6d55', lineHeight: 1.8 }}>
              Our platform is based on research from <span style={{ fontWeight: 600, color: '#181818' }}>"Job Recommender System for Freelancers"</span>, adapted specifically for the student ecosystem.
            </p>
          </div>
          <div style={{ background: '#fff', borderRadius: '20px', border: '1px solid #e5e7eb', padding: '40px' }}>
            <h3 style={{ fontFamily: font, fontSize: '22px', fontWeight: 700, color: '#181818', marginBottom: '28px' }}>Why we built this</h3>
            {[
              { label: 'The Problem', desc: 'Students struggle to find beginner-friendly projects on mainstream freelance platforms.', color: '#DC2626', bg: '#fef2f2', border: '#DC2626' },
              { label: 'The Solution', desc: 'A dedicated marketplace with intelligent skill-based matching built for students.', color: '#14A800', bg: '#f0fdf4', border: '#14A800' },
              { label: 'The Impact', desc: 'Students gain real experience, build strong portfolios, and launch successful careers.', color: '#2563EB', bg: '#eff6ff', border: '#2563EB' },
            ].map((item, i) => (
              <div key={i} style={{ background: item.bg, borderRadius: '12px', padding: '20px 20px 20px 24px', marginBottom: i < 2 ? '16px' : 0, borderLeft: `4px solid ${item.border}` }}>
                <p style={{ fontFamily: font, fontWeight: 700, color: item.color, marginBottom: '6px', fontSize: '15px' }}>{item.label}</p>
                <p style={{ fontFamily: font, fontSize: '14px', color: '#5e6d55', margin: 0 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section style={{ background: '#fff', padding: '80px 32px', borderBottom: '1px solid #e5e7eb' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <p style={{ fontFamily: font, fontSize: '13px', fontWeight: 600, color: '#14A800', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '12px' }}>Our Values</p>
            <h2 style={{ fontFamily: font, fontSize: '42px', fontWeight: 800, color: '#181818' }}>What we stand for</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
            {values.map((v, i) => (
              <div
                key={i}
                style={{ background: '#f9fafb', borderRadius: '16px', border: '1.5px solid #e5e7eb', padding: '32px', transition: 'border-color 0.2s, box-shadow 0.2s', cursor: 'default' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#5CC858'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(20,168,0,0.08)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                <div style={{ width: '40px', height: '40px', background: '#f0fdf4', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                  <FiCheck size={20} color="#14A800" strokeWidth={2.5} />
                </div>
                <h3 style={{ fontFamily: font, fontSize: '18px', fontWeight: 700, color: '#181818', marginBottom: '10px' }}>{v.title}</h3>
                <p style={{ fontFamily: font, fontSize: '14px', color: '#5e6d55', lineHeight: 1.7, margin: 0 }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TEAM */}
      <section style={{ background: '#f9fafb', padding: '80px 32px', borderBottom: '1px solid #e5e7eb' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <p style={{ fontFamily: font, fontSize: '13px', fontWeight: 600, color: '#14A800', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '12px' }}>The Team</p>
            <h2 style={{ fontFamily: font, fontSize: '42px', fontWeight: 800, color: '#181818' }}>People behind SkillBridge AI</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px', maxWidth: '900px', margin: '0 auto' }}>
            {team.map((t, i) => (
              <div key={i} style={{ background: '#fff', borderRadius: '20px', border: '1.5px solid #e5e7eb', padding: '36px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                  <div style={{ width: '56px', height: '56px', background: '#14A800', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span style={{ fontFamily: font, fontWeight: 700, fontSize: '18px', color: '#fff' }}>{t.initials}</span>
                  </div>
                  <div>
                    <p style={{ fontFamily: font, fontSize: '17px', fontWeight: 700, color: '#181818', margin: 0 }}>{t.name}</p>
                    <p style={{ fontFamily: font, fontSize: '13px', color: '#14A800', fontWeight: 500, margin: '4px 0 0' }}>{t.role}</p>
                  </div>
                </div>
                <p style={{ fontFamily: font, fontSize: '14px', color: '#5e6d55', lineHeight: 1.7, margin: 0 }}>{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TECH STACK */}
      <section style={{ background: '#fff', padding: '80px 32px', borderBottom: '1px solid #e5e7eb' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <p style={{ fontFamily: font, fontSize: '13px', fontWeight: 600, color: '#14A800', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '12px' }}>Built With</p>
            <h2 style={{ fontFamily: font, fontSize: '42px', fontWeight: 800, color: '#181818' }}>Technology Stack</h2>
            <p style={{ fontFamily: font, fontSize: '16px', color: '#5e6d55', marginTop: '12px' }}>Built with modern, industry-standard technologies</p>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center', maxWidth: '700px', margin: '0 auto' }}>
            {tech.map((t, i) => (
              <span key={i} style={{ fontFamily: font, fontSize: '14px', fontWeight: 600, color: '#181818', background: '#f4f4f4', borderRadius: '10rem', padding: '10px 22px', border: '1.5px solid #e5e7eb' }}>{t}</span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: 'linear-gradient(135deg, #0d1f0d 0%, #001e00 100%)', padding: '96px 32px' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontFamily: font, fontSize: '48px', fontWeight: 800, color: '#fff', marginBottom: '20px', lineHeight: 1.1 }}>Ready to build your career?</h2>
          <p style={{ fontFamily: font, fontSize: '18px', color: 'rgba(255,255,255,0.7)', marginBottom: '40px', lineHeight: 1.6 }}>Join thousands of students already working on real projects and building their portfolios on SkillBridge AI.</p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#14A800', color: '#fff', fontFamily: font, fontSize: '15px', fontWeight: 600, borderRadius: '10rem', padding: '14px 32px', textDecoration: 'none' }}>
              Join SkillBridge AI <FiArrowRight size={16} />
            </Link>
            <Link to="/browse" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'transparent', color: '#fff', fontFamily: font, fontSize: '15px', fontWeight: 600, borderRadius: '10rem', padding: '14px 32px', textDecoration: 'none', border: '1.5px solid rgba(255,255,255,0.35)' }}>
              Browse projects
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default About;
