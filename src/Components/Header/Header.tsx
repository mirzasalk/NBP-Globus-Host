import "./header.css";
import { useEffect} from "react";
import { Link } from "react-router-dom";
import { useContext } from "react";
import UserContext from "../../reactContext/UserContext";


const Header = () => {
 
  const context = useContext(UserContext);
  if (!context) {
    // Ako kontekst nije definisan, možete postupiti na odgovarajući način, na primer, vratiti null ili nešto drugo
    return null;
  }

  // Destrukturiranje podataka iz konteksta
  const { islogin, setislogin } = context;
  useEffect(() => {
    // Provera da li postoji token u localStorage
    const token = localStorage.getItem("token");
    setislogin(!!token); // Ako token postoji, postavljamo isLoggedIn na true
  }, []);

  const handleLogout = () => {
    // Brisanje tokena iz localStorage-a prilikom odjave
    localStorage.removeItem("token");
    setislogin(false);
  };
  return (
    <div id="headerMain">
      <img className="logoImg" src="./globusLogo.png" alt="logo" />
        {islogin ? (
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
