import React from 'react';

const ContactSection: React.FC = () => (
  <section
    style={{
      background: 'linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%)',
      borderRadius: '1.5rem',
      padding: '2.5rem 2rem',
      margin: '2rem auto',
      maxWidth: 700,
      boxShadow: '0 4px 24px rgba(75, 63, 114, 0.08)',
      color: '#333',
      textAlign: 'center',
    }}
  >
    <h2 style={{ fontSize: '2rem', fontWeight: 700, color: '#4B3F72', marginBottom: '1rem' }}>Get in Touch</h2>
    <p style={{ color: '#475569', marginBottom: '2rem', fontSize: '1.15rem', textAlign: 'center', maxWidth: 600, marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.6, fontWeight: 500 }}>
      Have questions or want to learn more? Reach out to us through any of these channels:
    </p>
    <ul className="contact-list" style={{ listStyle: 'none', paddingLeft: 0 }}>
      <li>
        <svg className="contact-icon" style={{ width: 20, height: 20 }} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 8L12 13L4 8V6L12 11L20 6V8Z" fill="currentColor"/>
        </svg>
        <a href="mailto:malikathaiyab023@gmail.com">malikathaiyab023@gmail.com</a>
      </li>
      
      <li>
        <svg className="contact-icon" style={{ width: 20, height: 20 }} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M22.46 6C21.69 6.35 20.86 6.58 20 6.69C20.88 6.16 21.56 5.32 21.88 4.31C21.05 4.81 20.13 5.16 19.16 5.36C18.37 4.5 17.26 4 16 4C13.65 4 11.73 5.92 11.73 8.29C11.73 8.63 11.77 8.96 11.84 9.27C8.28 9.09 5.11 7.38 3 4.79C2.63 5.42 2.42 6.16 2.42 6.94C2.42 8.43 3.17 9.75 4.33 10.5C3.62 10.5 2.96 10.3 2.38 10C2.38 10 2.38 10 2.38 10.03C2.38 12.11 3.86 13.85 5.82 14.24C5.46 14.34 5.08 14.39 4.69 14.39C4.42 14.39 4.15 14.36 3.89 14.31C4.43 16 6 17.26 7.89 17.29C6.43 18.45 4.58 19.13 2.56 19.13C2.22 19.13 1.88 19.11 1.54 19.07C3.44 20.29 5.7 21 8.12 21C16 21 20.33 14.46 20.33 8.79C20.33 8.6 20.33 8.42 20.32 8.23C21.16 7.63 21.88 6.87 22.46 6Z" fill="currentColor"/>
        </svg>
        <a href="https://twitter.com/tothemoon_023" target="_blank" rel="noopener noreferrer">@tothemoon_023</a>
      </li>
      
      <li>
        <svg className="contact-icon" style={{ width: 20, height: 20 }} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C6.477 2 2 6.477 2 12C2 17.523 6.477 22 12 22C17.523 22 22 17.523 22 12C22 6.477 17.523 2 12 2ZM12 4C16.418 4 20 7.582 20 12C20 16.418 16.418 20 12 20C7.582 20 4 16.418 4 12C4 7.582 7.582 4 12 4ZM12 6C9.791 6 8 7.791 8 10C8 12.209 9.791 14 12 14C14.209 14 16 12.209 16 10C16 7.791 14.209 6 12 6ZM12 8C13.105 8 14 8.895 14 10C14 11.105 13.105 12 12 12C10.895 12 10 11.105 10 10C10 8.895 10.895 8 12 8ZM12 16C14.5 16 16.5 17.5 17.5 19C16.5 20.5 14.5 22 12 22C9.5 22 7.5 20.5 6.5 19C7.5 17.5 9.5 16 12 16Z" fill="currentColor"/>
        </svg>
        <a href="https://github.com/idenclave" target="_blank" rel="noopener noreferrer">idenclave</a>
      </li>
    </ul>
  </section>
);

export default ContactSection; 