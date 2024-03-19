import { useState } from "react";
import "./inspectorPage.css";
import * as React from "react";
import axiosInstance from "../../api/axios-config";
import toast from "react-hot-toast";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface TicketIdDTO {
  Id: number;
}

export interface UserData {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: string;
  password: string;
  city: string;
  address: string;
  phoneNumber: string;
  gender: string | null;
  isApproved: boolean;
  role: string;
  credit: number;
}

export interface Penalty {
  inspectorId: number;
  passengerID: number;
  dateOfPenalty: Date | undefined;
  price: number;
}

const InspectorPage: React.FC = () => {
  const navigate = useNavigate();
  const [myWrittenPenalties, setMyWrittenPenalties] = useState<Penalty[]>();
  const [showWritePenaltyDiv, setShowWritePenaltyDiv] =
    useState<boolean>(false);
  const [userToBePenalized, setUserToBePenalized] = useState<UserData>({id: 0,
    firstName: "",
    lastName: "",
    email: "",
    dateOfBirth: "",
    password: "",
    city: "",
    address: "",
    phoneNumber: "",
    gender: "",
    isApproved: false,
    role: "",
    credit: 0,});

  const [penalty, setPenalty] = useState<Penalty>({
    inspectorId: 0,
    passengerID: 0,
    dateOfPenalty: undefined,
    price: 2000,
  });
  const [user, setUser] = useState<UserData>({
    id: 0,
    firstName: "",
    lastName: "",
    email: "",
    dateOfBirth: "",
    password: "",
    city: "",
    address: "",
    phoneNumber: "",
    gender: "",
    isApproved: false,
    role: "",
    credit: 0,
  });

  //get written penalties
  const getMyWrittenPenalties = async () => {
    const jwtToken = localStorage.getItem("token");

    try {
      const response = await axiosInstance.get("Users/getMyWrittenPenalties", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
      });
      if (response) {
        setMyWrittenPenalties(response.data.reverse());
      }
    } catch (error) {
      console.log(error);
    }
  };

  //get user by id
  const getUserById = async () => {
    const jwtToken = localStorage.getItem("token");

    try {
      const response = await axiosInstance.get("Users/getUserById", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
      });
      if (response) {
        setUser(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const [ticketId, setTicketId] = useState<number>(0);
  const [changeInspectorView, setChangeInspectorView] =
    useState<string>("Check the ticket");


  //check ticket
  const checkTicket = async () => {
    const jwtToken = localStorage.getItem("token");

    try {
      const response = await axiosInstance.post(
        "/Users/CheckTicket",
        { Id: ticketId } as TicketIdDTO,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );
      if (response) {
        const datumZaUporedivanje = new Date(response.data.ticket.toDate);
        const danasnjiDatum = new Date();
        if (datumZaUporedivanje > danasnjiDatum && response.data.ticket.isApproved == true) {
          toast.success("Ticket is valid");
        } else {
          toast.error("Ticket is not valid");
          console.log(response.data.user.id, user.id);
          setUserToBePenalized(response.data.user);

          setPenalty({
            ...penalty,
            passengerID: response.data.user.id,
            inspectorId: user.id,
            dateOfPenalty: new Date(),
          });

          setShowWritePenaltyDiv(true);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  
  //write penalty
  const WriteAPenalty = async () => {
    const jwtToken = localStorage.getItem("token");
    console.log(penalty, "before recording");
    try {
      const response = await axiosInstance.post(
        "/Users/WritePenalty",
        penalty,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );

      if (response.data) {
        toast.success("The penalty has been recorded");
        console.log(response.data, "after recording");
        getMyWrittenPenalties();
        setShowWritePenaltyDiv(false);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getUserById();
  }, []);
  useEffect(() => {
    getMyWrittenPenalties();
  }, [penalty]);

  return (
    <div id="inspectorPageMain">
      <div className="inspectorPageMainCenterDiv">
        <img src="globusLogo.png" alt="Globus" className="logoInspectorPage" />
        <div className="buttonsLine">
          <div
            className="buttonOnLine"
            onClick={() => {
              setChangeInspectorView("Check the ticket");
            }}
          >
            Check the ticket
          </div>
          <div
            className="buttonOnLine"
            onClick={() => {
              setChangeInspectorView("My issued fines");
            }}
          >
            My issued fines
          </div>
        </div>
        {changeInspectorView == "Check the ticket" ? (
          <div className="checkTheTicketDiv">
            <h3>Check the ticket</h3>

            <input
              className="inputForTicketId"
              type="number"
              placeholder="Enter the card number"
              onChange={(e) => {
                setTicketId(Number(e.target.value));
              }}
            />

            <button className="checkButton" onClick={checkTicket}>
              Check
            </button>
            <button className="checkButton" onClick={() => {navigate('/scanner');}}>
              Scan
            </button>
          </div>
        ) : (
          <div className="MyIssuedFinesDiv">
            <div className="MyIssuedFinesScroll">
              {myWrittenPenalties?.map((p) => {
                return (
                  <div className="penaltyDiv">
                     <h3>{user.firstName} {user.lastName}</h3>
                    <h3>{p.passengerID}</h3>
                    <h3>{p.dateOfPenalty?.toString()}</h3>
                    <h3>{p.price}</h3>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
      {showWritePenaltyDiv ? (
        <div className="writePenaltyMainDiv">
          <div className="writePenaltyCenterDiv">
            <div
              className="xdiv"
              onClick={() => {
                setShowWritePenaltyDiv(false);
              }}
            >
              X
            </div>
            <h1>Ticket is not valid</h1>
            <h4>
              Passenger: 
              <strong>
                {userToBePenalized?.firstName} {userToBePenalized?.lastName}
              </strong>
            </h4>
            <button onClick={WriteAPenalty}>Write a penalty</button>
          </div>
        </div>
      ) : null}
    </div>
  );
};
export default InspectorPage;
