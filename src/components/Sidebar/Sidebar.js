import { AiOutlineHome, AiOutlineCalendar, AiOutlineInfoCircle, AiOutlineLogin, AiOutlineLogout } from "react-icons/ai";
import Link from "next/link";
import "./Sidebar.scss";

export default function Sidebar({ open, toggleSidebar, logout }) {
  const user = {
    "Full Name": "John Doe",
    "Role": "Admin",
    "User Type": "User",
    "Profile Image Src": "/Images/dp.jpg",
    "Session Token": "1234567890"
  };

  const drawerItems = [
    { text: "About", icon: <AiOutlineHome className="icon" />, href: "#" },
    { text: "News", icon: <AiOutlineCalendar className="icon" />, href: "#" },
    { text: "Services", icon: <AiOutlineInfoCircle className="icon" />, href: "#" },
    { text: "Our Team", icon: <AiOutlineInfoCircle className="icon" />, href: "#" },
    { text: "Make Enquiry", icon: <AiOutlineInfoCircle className="icon" />, href: "#" },
  ];

  const handleLogout = () => {
    toggleSidebar(false);
    logout(true);
  };

  const SidebarContent = (
    <div className="sidebar-main" role="presentation">
      <div className="profile-container">
        <div className="profile-image"
          style={{ backgroundImage: "url(/images/dp.png)" }}>
        </div>
      </div>

      <nav className="nav-menu">
        {drawerItems.map((item) => (
          <Link key={item.text} href={item.href} className="nav-link">
            <span>{item.icon}</span>
            <span className="text">{item.text}</span>
          </Link>
        ))}
      </nav>

      <div className="divider">
        <nav className="nav-menu">
          {user ? (
            <button onClick={handleLogout} className="nav-link w-full">
              <AiOutlineLogout className="icon transform scale-x-[-1]" />
              <span className="text">Logout</span>
            </button>
          ) : (
            <button
              onClick={() => { toggleSidebar(false); router.push("/Login") }}
              className="nav-link w-full">
              <AiOutlineLogin className="icon" />
              <span className="text">Login</span>
            </button>
          )}
        </nav>
      </div>
    </div>
  );

  return (
    <>
      {open && (
        <div className="sidebar-container">
          <div className="sidebar-overlay" onClick={() => toggleSidebar(false)}></div>
          <div className="sidebar-wrapper">
            <div className={`sidebar-content ${open ? 'open' : ''}`}>
              {SidebarContent}
            </div>
          </div>
        </div>
      )}
    </>
  );
}