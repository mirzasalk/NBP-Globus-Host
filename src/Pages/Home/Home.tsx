import "./home.css";
import axiosInstance from "../../api/axios-config";
import React, { useEffect, FormEvent } from "react";
import { useState } from "react";
import toast from "react-hot-toast";
import { jsPDF } from "jspdf";
import { useNavigate } from "react-router-dom";
import QRCode from "qrcode";

interface UserData {
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

interface Line {
  id: number;
  name: string;
  stations: string[];
  distance: string[];
}

interface TicketType {
  id: number;
  type: string;
  price: number;
}

interface TransactionRequestDTO {
  UserId: number;
  Credit: number;
}
interface newTicket {
  UserId: number;
  Line: string;
  Start: string;
  Destination: string;
  fromDate: Date | undefined;
  ToDate: Date | undefined;
  TicketType: number;
  isApproved: boolean;
}
interface Ticket {
  id: number;
  userId: number;
  line: string;
  start: string;
  destination: string;
  fromDate: Date | undefined;
  toDate: Date | undefined;
  ticketType: number;
  isApproved: boolean;
  status: string;
}

const Home: React.FC = () => {
  let countForRole = 0;
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showDropdownSecond, setShowDropdownSecond] = useState(false);
  const [showDropdownThird, setShowDropdownThird] = useState(false);
  const [showDropdownFourth, setShowDropdownFourth] = useState(false);
  const [lines, setLines] = useState<Line[]>();
  const [stations, setStations] = useState<string[]>([]);
  const [addCreditValue, setAddCreditValue] = useState<number>(0);
  const [showAddCreditDiv, setShowAddCreditDiv] = useState<boolean>(false);
  const [ByTicketOrMyTicket, setShowByTicketOrMyTicket] =
    useState<boolean>(false);
  const [start, setStart] = useState<string>("Choose a start station");
  const [destination, setDestination] = useState<string>(
    "Choose a destination"
  );
  const [showDivForByTicket, setShowDivForByTicket] = useState<boolean>(false);
  const [chosenLine, setChosenLine] = useState<Line>({
    id: 0,
    name: "Choose a line",
    stations: [],
    distance: [],
  });
  const [newTicketState, setNewTicketState] = useState<newTicket>();
  const [chosenTicketTypes, setChosenTicketTypes] = useState<TicketType>({
    id: 0,
    type: "Choose a type",
    price: 0,
  });
  const [ticketTypes, setTicketTypes] = useState<TicketType[]>();

  const [reversedPassengerTickets, setReversedPassengerTickets] =
    useState<Ticket[]>();

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
  const newTicket: newTicket = {
    UserId: 0,
    Line: "",
    Start: "",
    Destination: "",
    fromDate: undefined,
    ToDate: undefined,
    TicketType: 0,
    isApproved: false,
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
      navigate("/logIn");
    }
  };

  //get all lines
  const getAllLines = async () => {
    const jwtToken = localStorage.getItem("token");

    try {
      const response = await axiosInstance.get("Admins/getAllLines", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
      });
      if (response) {
        setLines(response.data);
        console.log(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  //get user tickets
  const getUserTickets = async () => {
    const jwtToken = localStorage.getItem("token");

    try {
      const response = await axiosInstance.get("Users/getUserTickets", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
      });
      if (response) {
        console.log(response.data);
        setReversedPassengerTickets(response.data.reverse());
      }
    } catch (error) {
      console.log(error);
    }
  };

  //get ticket types
  const getTicketTypes = async () => {
    const jwtToken = localStorage.getItem("token");

    try {
      const response = await axiosInstance.get("TicketTypes/getTicketTypes", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
      });
      if (response) {
        setTicketTypes(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUserById();
    getAllLines();
    getTicketTypes();
  }, []);

  useEffect(() => {
    getUserTickets();
    console.log(user);
    countForRole++;
    if (countForRole > 3 && user.role != "passenger") {
      navigate("/logIn");
    }
  }, [user]);

  useEffect(() => {
    reversedPassengerTickets;
  }, [reversedPassengerTickets]);

  const validateTicketInfo = () => {
    if (user.credit >= chosenTicketTypes.price) {
      if (chosenTicketTypes.type != "Choose a type") {
        newTicket.UserId = user.id;
        newTicket.TicketType = chosenTicketTypes.id;
        if (chosenTicketTypes.type != "oneTime") {
          newTicket.Line = "";
          newTicket.Start = "";
          newTicket.Destination = "";
          newTicket.fromDate = new Date();
          if (chosenTicketTypes.type == "daily") {
            const currentDate = new Date();

            const tomorrowDate = new Date(
              currentDate.getTime() + 24 * 60 * 60 * 1000
            );

            newTicket.ToDate = tomorrowDate;
          } else if (chosenTicketTypes.type == "monthly") {
            const currentDate = new Date();

            const nextMonthDate = new Date(currentDate.getTime());
            nextMonthDate.setMonth(currentDate.getMonth() + 1);

            newTicket.ToDate = nextMonthDate;
          } else {
            const currentDate = new Date();

            const nextYearDate = new Date(currentDate.getTime());

            nextYearDate.setFullYear(currentDate.getFullYear() + 1);

            newTicket.ToDate = nextYearDate;
          }
          setShowDivForByTicket(true);

          setNewTicketState(newTicket);
        } else {
          if (
            chosenLine.name == "Choose a line" ||
            start == "Choose a start station" ||
            destination == "Choose a destination"
          ) {
            toast.error("Please fill in all the fields");
          } else {
            newTicket.Line = chosenLine.name;
            newTicket.Start = start;
            newTicket.Destination = destination;
            newTicket.fromDate = new Date();
            const currentDate = new Date();

            const nextHourDate = new Date(currentDate.getTime());
            nextHourDate.setHours(currentDate.getHours() + 1);
            newTicket.ToDate = nextHourDate;
            setShowDivForByTicket(true);

            setNewTicketState(newTicket);
          }
        }
      } else {
        toast.error("Please fill in all the fields");
      }
    } else {
      toast.error("You don't have enough credit; please recharge your balance.");
    }
  };

  const confirmPurchase = async () => {
    const jwtToken = localStorage.getItem("token");
    try {
      await axiosInstance.post("Users/addTicket", newTicketState, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
      });

      toast.success("You have successfully purchased the ticket.");
      setShowDivForByTicket(!showDivForByTicket);
      getUserTickets();
      getUserById();
    } catch (error) {
      toast.error("Error during purchase, please try again later.");
      console.log(error);
    }
  };

  const addCredit = async (event: FormEvent) => {
    event.preventDefault();
    const jwtToken = localStorage.getItem("token");

    try {
      /*  await axiosInstance.post(
        "Users/addCredit",
        { Credit: addCreditValue } as AddCreditDTO,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );
*/
      await axiosInstance.post(
        "Users/sendTransactionRequest",
        { Credit: addCreditValue, UserId: user.id } as TransactionRequestDTO,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );
      toast.success("You have successfully sent a transaction request.");

      setShowAddCreditDiv(!showAddCreditDiv);
      getUserById();
    } catch (error) {
      toast.error("Error during credit addition, please try again later.");
      console.log(error);
    }
  };

  //pdf
  const generatePDF = async (t: Ticket) => {
    const pdf = new jsPDF();
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(16);

    pdf.text("GLOBUS Ticket", 70, 57);

    pdf.setFont("helvetica");
    pdf.setFontSize(12);

    pdf.rect(15, 50, 180, 75); // x, y, širina, visina

    pdf.text(`Card Num.: ${t.id}`, 20, 70);

    pdf.text(
      `Type:${
        t.ticketType == 1
          ? "oneTime"
          : t.ticketType == 2
          ? "daily"
          : t.ticketType == 3
          ? "Monthly"
          : "Yearly"
      }`,
      20,
      80
    );
    pdf.text(`From Date: ${t.fromDate}`, 100, 70);
    pdf.text(`To Date: ${t.toDate}`, 100, 80);

    pdf.line(20, 82, 190, 82);

    pdf.text(`Line:${t.line == "" ? "All line" : t.line} `, 20, 89);
    pdf.text(`Start: ${t.start == "" ? "All Stations" : t.start}`, 100, 100);
    pdf.text(
      `Destination: ${t.destination == "" ? "All Stations" : t.destination}`,
      20,
      100
    );

    pdf.addImage("barkod.png", "PNG", 150, 103, 40, 15);

    // Generate QR code with dynamic data
    // const qrCodeData = `https://localhost:7269/Tickets/checkTicketWithScanner?ticketId=${t.id}`;
    const qrCodeData = `${t.id}`;
    try {
      pdf.addPage();
      // Generate QR code and get data URL
      const qrCodeDataURL = await QRCode.toDataURL(qrCodeData);

      // Add the QR code image to the PDF
      // pdf.addImage(qrCodeDataURL, 'PNG', 80, 150, 50, 50);
      pdf.addImage(qrCodeDataURL, "PNG", 80, 10, 50, 50);

      pdf.save("globus_ticket.pdf");
    } catch (error) {
      console.error("Error generating QR code:", error);
    }
  };

  return (
    <div id="homeMain">
      <div className="viewForPassenger">
        <div className="divForCredi">
          <div
            className="creditDiv"
            onClick={() => {
              setShowAddCreditDiv(true);
            }}
          >
            Credit: {user?.credit}
          </div>
        </div>
        <img
          className="logoForPassengerView"
          src="./globusLogo.png"
          alt="logo"
        />
        <div className="buttonsDiv">
          <div
            className="DivForchagePassengersView"
            onClick={() => {
              setShowByTicketOrMyTicket(false);
            }}
          >
            Buy Ticket
          </div>
          <div
            className="DivForchagePassengersView"
            onClick={() => {
              setShowByTicketOrMyTicket(true);
            }}
          >
            My Tickets
          </div>
          <div
            className="DivForchagePassengersView"
            onClick={() => {
              setShowAddCreditDiv(true);
            }}
          >
            Add Credit
          </div>
        </div>
        <div className="mainForPassengerView">
          {ByTicketOrMyTicket ? (
            <div className={"MyTicketDiv"}>
              {reversedPassengerTickets?.map((t, index) => {
                return (
                  <div
                    className={
                      t.status == "approved"
                        ? "myTicketField"
                        : t.status == "pending"
                        ? "myPendingTicketField"
                        : "myUnactiveTicketField"
                    }
                    key={index}
                  >
                    <div className="ticketInfoDiv">
                      <div> {t.id}</div>
                      <div>
                        {" "}
                        {t.ticketType == 1
                          ? "oneTime"
                          : t.ticketType == 2
                          ? "daily"
                          : t.ticketType == 3
                          ? "monthly"
                          : "yearly"}
                      </div>

                      {t.line != "" ? <div> {t.line}</div> : null}
                      {t.start != "" ? <div> {t.start}</div> : null}

                      {t.destination != "" ? <div> {t.destination}</div> : null}

                      <div>{t.fromDate?.toString()} </div>
                      <div>{t.toDate?.toString()} </div>
                      <div> {t.status}</div>
                    </div>
                    {t.status == "approved" ? (
                      <button
                        className="toPDFBtnDiv"
                        onClick={() => {
                          generatePDF(t);
                        }}
                      >
                        Download in PDF format
                      </button>
                    ) : null}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="byTicketInputDiv">
              <div className="tickeTypeAndLinesDiv">
                <div className="ticketTypeDiv">
                  <label htmlFor="line">Ticket Type:</label>

                  <div className="linesDivDropDown">
                    <div
                      className="chosenLineDiv"
                      onClick={() => {
                        setShowDropdownFourth(!showDropdownFourth);
                      }}
                    >
                      {chosenTicketTypes.type}
                    </div>
                    {showDropdownFourth ? (
                      <div className="linesScrollList">
                        {ticketTypes?.map((t) => {
                          return (
                            <div
                              className="divInScroll"
                              onClick={() => {
                                setShowDropdownFourth(!showDropdownFourth);
                                setChosenTicketTypes(t);
                              }}
                            >
                              {t.type + " - " + t.price}
                            </div>
                          );
                        })}
                      </div>
                    ) : null}
                  </div>
                </div>
                {chosenTicketTypes.type == "Choose a type" ||
                chosenTicketTypes.type != "oneTime" ? null : (
                  <div className="linesDiv">
                    <label htmlFor="line">Lines:</label>

                    <div className="linesDivDropDown">
                      <div
                        className="chosenLineDiv"
                        onClick={() => {
                          setShowDropdown(!showDropdown);
                        }}
                      >
                        {chosenLine.name}
                      </div>
                      {showDropdown ? (
                        <div className="linesScrollList">
                          {lines?.map((l) => {
                            return (
                              <div
                                className="divInScroll"
                                onClick={() => {
                                  setShowDropdown(!showDropdown);
                                  setChosenLine(l);
                                  setStations(l.stations);
                                }}
                              >
                                {l.name}
                              </div>
                            );
                          })}
                        </div>
                      ) : null}
                    </div>
                  </div>
                )}
              </div>
              {chosenLine?.name == "Choose a line" ||
              chosenTicketTypes.type != "oneTime" ? null : (
                <div className="divForStationsDropdowns">
                  <div className="stationsDiv">
                    <label htmlFor="line">Start:</label>

                    <div className="stationDivDropDown">
                      <div
                        className="chosenStationDiv"
                        onClick={() => {
                          setShowDropdownSecond(!showDropdownSecond);
                        }}
                      >
                        {start}
                      </div>
                      {showDropdownSecond ? (
                        <div className="linesScrollList">
                          {stations?.map((s) => {
                            return (
                              <div
                                className="divInScroll"
                                onClick={() => {
                                  setShowDropdownSecond(!showDropdownSecond);
                                  setStart(s);
                                }}
                              >
                                {s}
                              </div>
                            );
                          })}
                        </div>
                      ) : null}
                    </div>
                  </div>
                  <div className="stationsDiv">
                    <label htmlFor="line">Destination:</label>

                    <div className="stationDivDropDown">
                      <div
                        className="chosenStationDiv"
                        onClick={() => {
                          setShowDropdownThird(!showDropdownThird);
                        }}
                      >
                        {destination}
                      </div>
                      {showDropdownThird ? (
                        <div className="linesScrollList">
                          {stations?.map((s) => {
                            return (
                              <div
                                className="divInScroll"
                                onClick={() => {
                                  setShowDropdownThird(!showDropdownThird);
                                  setDestination(s);
                                }}
                              >
                                {s}
                              </div>
                            );
                          })}
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              )}
              <button className="byTicketBtn" onClick={validateTicketInfo}>
                Buy ticket
              </button>
            </div>
          )}
        </div>
      </div>
      {showDivForByTicket ? (
        <div className="divForbuyingTicket">
          <div className="centerDivForbuyingTicket">
            <div className="xdiv">
              <div
                onClick={() => {
                  setShowDivForByTicket(false);
                }}
              >
                X
              </div>
            </div>
            <h2>Confirm purchase!</h2>
            <p>
              Ticket Price:<strong>{chosenTicketTypes.price}</strong>
            </p>
            <button onClick={confirmPurchase}>Confirm</button>
          </div>
        </div>
      ) : null}
      {showAddCreditDiv ? (
        <div className="addingCreditDiv">
          <div className="addingCreditCenterDiv">
            <div className="Xdiv">
              <div
                onClick={() => {
                  setShowAddCreditDiv(false);
                }}
              >
                X
              </div>
            </div>
            <form>
              <h3>Add credit</h3>
              <input
                type="number"
                placeholder="Add credit"
                onChange={(e) => {
                  setAddCreditValue(Number(e.target.value));
                }}
              />
              <button onClick={addCredit}>Add Credit</button>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Home;
