import "./header.css";
import { useEffect,useState } from "react";
import { Link } from "react-router-dom";

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    // Provera da li postoji token u localStorage
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token); // Ako token postoji, postavljamo isLoggedIn na true
  }, []);

  const handleLogout = () => {
    // Brisanje tokena iz localStorage-a prilikom odjave
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  };
  return (
    <div id="headerMain">
      <img className="logoImg" src="./globusLogo.png" alt="logo" />
        {isLoggedIn ? (
          // Ako je korisnik ulogovan, prikaži Logout link
          <div className="logIn-LogOutDiv">
          <a href="/" onClick={handleLogout}>Logout</a>
          </div>
        ) : (
          // Ako korisnik nije ulogovan, prikaži Login i Register linkove
          <div className="logIn-LogOutDiv">
            <Link to="/logIn">Login</Link>
            <p>/</p>
            <Link to="/">Register</Link>
          </div>
        )}
      </div>
     
    
  );
};

export default Header;
