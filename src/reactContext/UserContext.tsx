// context.ts
import { createContext, ReactNode, useState } from "react";
import { UserContextType, User } from "./types";

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  

  const contextValue: UserContextType = {
    user,
    setUser,
    
  };

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};

export default UserContext;
