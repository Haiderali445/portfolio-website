import React from 'react'
import './Footer.css'

const Footer = () => {
  return (
    <footer className="footer">
      <p>
        © {new Date().getFullYear()} <span className="footer__name">HAIDER ALI</span>. All rights reserved.
      </p>
    </footer>
  )
}

export default Footer
