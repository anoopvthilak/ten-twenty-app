"use client";
import Link from 'next/link';
import { CiLogout, CiMenuFries, CiSettings, CiGrid41 } from "react-icons/ci";
import { useEffect, useState } from "react";
import Sidebar from "../Sidebar/Sidebar";
import "./Header.scss";
import { HiOutlineArrowRight } from "react-icons/hi";
const Header = function ({ isMobile }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = (newOpen) => {
    setSidebarOpen(newOpen);
  };


  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <header className='header'>
      {!isMobile ? (
        <div className="header_desktop_block_container">
          <div className="tabs_container">
            <Link href="#" className="tabs">About</Link>
            <Link href="#" className="tabs">News</Link>
            <Link href="#" className="tabs">Services</Link>
            <Link href="#" className="tabs">Our Team</Link>
            <Link href="#" className="tabs">Make Enquiry</Link>
          </div>
          <Link href="#" className="contact_us_button">
            <span>Contact us</span>
            <HiOutlineArrowRight className="arrow_icon" />
          </Link>

        </div>
      ) :
        <>
          <div className="header_mobile_block_container">
            <Link href="#" className="contact_us_button">
              <span>Contact us</span>
              <HiOutlineArrowRight className="arrow_icon" />
            </Link>

            <div className="ham" onClick={() => toggleSidebar(true)}>
              <CiMenuFries />
            </div>
          </div>

          <Sidebar open={sidebarOpen} toggleSidebar={toggleSidebar} />
        </>
      }
    </header >
  )
}
export default Header;
