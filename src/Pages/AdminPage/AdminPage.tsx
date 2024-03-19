import "./adminPage.css";
import React from "react";
import { useEffect, useState } from "react";
import axiosInstance from "../../api/axios-config";
import toast from "react-hot-toast";

interface TicketIdDTO {
  Id: number;
}

interface IdDTO {
  Id: number;
}
interface User {
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
  Status: string;
}

interface Line {
  id: number;
  name: string;
  stations: string[];
  distance: string[];
}

interface newLineDTO {
  Name: string;
  Stations: string[];
  Distance: string[];
}

interface Transaction {
  id: number;
  userId: number;
  credit: number;
}
const AdminPage: React.FC = () => {
  const [unapprovedTickets, setUnapprovedTickets] = useState<Ticket[]>();
  const [transactions, setTransactions] = useState<Transaction[]>();
  const [transaction, setTransaction] = useState<Transaction>();
  const [showAddCreditDiv, setShowAddCreditDiv] = useState<boolean>(false);
  const [editDivShow, SetEditDivShow] = useState<boolean>(false);
  const [addDivShow, SetAddDivShow] = useState<boolean>(false);
  const [showEditNameInput, setShowEditNameInput] = useState<boolean>(false);
  const [showEditStationInput, setShowEditStatopnInput] =
    useState<boolean>(false);
  const [searchTicketsTerm, setSearchTicketsTerm] = useState<string>("");
  const [searchUsersTerm, setSearchUsersTerm] = useState<string>("");
  const [searchInspectorsTerm, setSearchInspectorsTerm] = useState<string>("");
  const [searchLinesTerm, setSearchLinesTerm] = useState<string>("");

  const [showEditDistanceInput, setShowEditDistanceInput] =
    useState<boolean>(false);
  const [indexForEdit, setIndexForEdit] = useState<number>(-1);
  const [unapprovedUsers, setUnapprovedUsers] = useState<User[]>();
  const [inspectors, setInspectors] = useState<User[]>();
  const [lines, setLines] = useState<Line[]>();
  const [linesNewStation, setLinesNewStation] = useState<string>();
  const [newDistance, setNewDistance] = useState<string>();

  const [newLine, setNewLines] = useState<newLineDTO>({
    Name: "",
    Stations: [],
    Distance: [],
  });

  const [editLine, setEditLines] = useState<Line>({
    id: -1,
    name: "",
    stations: [],
    distance: [],
  });

  const [changeAdminView, setChangeAdminView] =
    useState<string>("Approve Tickets");

  //get unapproved tickets
  const getUnapprovedTickets = async () => {
    const jwtToken = localStorage.getItem("token");

    try {
      const response = await axiosInstance.get("Tickets/getUnapprovedTickets", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
      });
      if (response) {
        setUnapprovedTickets(response.data.reverse());
      }
    } catch (error) {
      console.log(error);
    }
  };

  //get unapproved users
  const getUnapprovedUsers = async () => {
    const jwtToken = localStorage.getItem("token");

    try {
      const response = await axiosInstance.get("Users/getUnapprovedUsers", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
      });
      if (response) {
        console.log(response.data);
        setUnapprovedUsers(response.data.reverse());
      }
    } catch (error) {
      console.log(error);
    }
  };

  //get all inspectors
  const getAllInspectors = async () => {
    const jwtToken = localStorage.getItem("token");

    try {
      const response = await axiosInstance.get("Users/getAllInspectors", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
      });
      if (response) {
        console.log(response.data);
        setInspectors(response.data.reverse());
      }
    } catch (error) {
      console.log(error);
    }
  };

  //get all transactions
  const getAllTransactions = async () => {
    const jwtToken = localStorage.getItem("token");

    try {
      const response = await axiosInstance.get("Users/getAllTransactions", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
      });
      if (response) {
        console.log(response.data);
        setTransactions(response.data.reverse());
      }
    } catch (error) {
      console.log(error);
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
        console.log(response.data);
        setLines(response.data.reverse());
      }
    } catch (error) {
      console.log(error);
    }
  };

  //approve ticket
  const approveTicket = async (id: number) => {
    const jwtToken = localStorage.getItem("token");

    try {
      const response = await axiosInstance.put(
        "Tickets/approveTicket",
        { Id: id } as TicketIdDTO,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );
      if (response) {
        console.log(response.data);
        toast.success("Ticket is approved.");
        getUnapprovedTickets();
      }
    } catch (error: any) {
      console.log(error);
    }
  };

  //reject ticket
  const rejectTicket = async (id: number) => {
    const jwtToken = localStorage.getItem("token");

    try {
      const response = await axiosInstance.put(
        "Tickets/rejectTicket",
        { Id: id } as TicketIdDTO,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );
      if (response) {
        console.log(response.data);
        toast.success("Ticket is rejected.");
        getUnapprovedTickets();
      }
    } catch (error) {
      console.log(error);
    }
  };

  //reject transaction
  const rejectTransaction = async (id: number) => {
    const jwtToken = localStorage.getItem("token");

    try {
      const response = await axiosInstance.delete("Admins/rejectTransaction", {
        data: { Id: id } as IdDTO, // Promenjeno sa { Id: id } as IdDTO
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
      });

      if (response) {
        console.log(response.data);
        toast.success("Transaction is rejected.");
        getAllTransactions();
      }
    } catch (error) {
      console.log(error);
    }
  };

  //delete user
  const deleteUser = async (id: number) => {
    const jwtToken = localStorage.getItem("token");

    try {
      const response = await axiosInstance.delete("Users/delete", {
        data: { Id: id } as IdDTO, // Promenjeno sa { Id: id } as IdDTO
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
      });

      if (response) {
        console.log(response.data);
        toast.success("User is deleted.");
        getUnapprovedUsers();
        getAllInspectors();
      }
    } catch (error) {
      console.log(error);
    }
  };

  //delete line
  const deleteLine = async (id: number) => {
    const jwtToken = localStorage.getItem("token");

    try {
      const response = await axiosInstance.delete("Admins/deleteLine", {
        data: { Id: id } as IdDTO, // Promenjeno sa { Id: id } as IdDTO
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
      });

      if (response) {
        console.log(response.data);
        toast.success("Line is deleted.");
        getAllLines();
      }
    } catch (error) {
      console.log(error);
    }
  };

  //promote to inspector
  const PromoteToInspector = async (id: number) => {
    const jwtToken = localStorage.getItem("token");

    try {
      const response = await axiosInstance.put(
        "Admins/PromoteToInspector",
        { Id: id } as IdDTO,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );
      if (response) {
        console.log(response.data);
        toast.success(`User  is promoted.`);
        getUnapprovedUsers();
        getAllInspectors();
      }
    } catch (error) {
      console.log(error);
    }
  };

  //demote from inspector
  const DemoteFromInspector = async (id: number) => {
    const jwtToken = localStorage.getItem("token");

    try {
      const response = await axiosInstance.put(
        "Admins/DemoteFromInspector",
        { Id: id } as IdDTO,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );
      if (response) {
        console.log(response.data);
        toast.success(`Inspector is demoted.`);
        getUnapprovedUsers();
        getAllInspectors();
      }
    } catch (error) {
      console.log(error);
    }
  };

  //add line
  const addNewLine = async () => {
    if (
      newLine.Name != "" &&
      newLine.Distance.length > 1 &&
      newLine.Stations.length > 1 &&
      newLine.Distance.length == newLine.Stations.length
    ) {
      const jwtToken = localStorage.getItem("token");
      try {
        await axiosInstance.post("Admins/addLine", newLine, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
        });

        toast.success("You have successfully added a new line.");
        SetAddDivShow(false);
        setNewLines({ Name: "", Stations: [], Distance: [] });
        getAllLines();
      } catch (error) {
        toast.error(
          "The error occurred while adding a new line, please try again later."
        );
        console.log(error);
      }
    } else {
      let p = "";
      newLine.Name == ""
        ? (p = "Enter line name")
        : newLine.Stations.length < 2
        ? (p = "You must enter more than 2 stations!")
        : newLine.Distance.length != newLine.Stations.length
        ? (p = "The number of stations and distance must be equal!")
        : (p = "Invalid data entered!");

      toast.error(p);
    }
  };

  //edit line
  const editLineRoute = async () => {
    const jwtToken = localStorage.getItem("token");
    try {
      await axiosInstance.put("Admins/editLine", editLine, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
      });

      toast.success("You have successfully edited a line.");
      SetEditDivShow(false);
      getAllLines();
    } catch (error) {
      toast.error(
        "The error occurred while adding a new line, please try again later."
      );
      console.log(error);
    }
  };

  //add credit
  const addCredit = async () => {
    const jwtToken = localStorage.getItem("token");
    try {
      await axiosInstance.post(
        "Users/addCredit",
        {
          id: transaction?.id,
          userId: transaction?.userId,
          credit: transaction?.credit,
        } as Transaction,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );

      toast.success("You have successfully approved a transaction request.");
      getAllTransactions();
      setShowAddCreditDiv(false);
    } catch (error) {
      toast.error("Error during credit addition, please try again later.");
      console.log(error);
    }
  };

  //edit station
  const editStation = (e: React.ChangeEvent<HTMLInputElement>) => {
    let temp = [...editLine.stations];
    temp[indexForEdit] = e.target.value;
    setEditLines({ ...editLine, stations: temp });
  };
  //edit distance
  const editDistance = (e: React.ChangeEvent<HTMLInputElement>) => {
    let temp = [...editLine.distance];
    temp[indexForEdit] = e.target.value;
    setEditLines({ ...editLine, distance: temp });
  };

  useEffect(() => {
    getUnapprovedTickets();
    getUnapprovedUsers();
    getAllInspectors();
    getAllLines();
    getAllTransactions();
  }, []);

  useEffect(() => {}, [transactions]);

  return (
    <div id="adminPageMain">
      {editDivShow == true ? (
        <div className="editLineDiv">
          {showEditNameInput == true ||
          showEditDistanceInput == true ||
          showEditStationInput == true ? (
            <div className="editInputDiv">
              {showEditNameInput ? <h3>Edit Name</h3> : null}
              {showEditNameInput ? (
                <input
                  type="text"
                  className="editNameInput"
                  placeholder="Insert Name"
                  onChange={(e) => {
                    setEditLines({
                      ...editLine,
                      name: e.target.value,
                    });
                  }}
                />
              ) : null}

              {showEditStationInput ? <h3>Edit Station</h3> : null}
              {showEditStationInput == true ? (
                <input
                  type="text"
                  className="editStationsInput"
                  placeholder="Insert Station"
                  onChange={(e) => {
                    editStation(e);
                  }}
                />
              ) : null}

              {showEditDistanceInput ? <h3>Edit Distance</h3> : null}
              {showEditDistanceInput == true ? (
                <input
                  type="text"
                  className="editDistanceInput"
                  placeholder="Insert Distance"
                  onChange={(e) => {
                    editDistance(e);
                  }}
                />
              ) : null}
            </div>
          ) : null}
          <div className="editLineCenterDiv">
            <div className="editLineX">
              <h3
                onClick={() => {
                  SetEditDivShow(false);
                  setEditLines({
                    id: -1,
                    name: "",
                    stations: [],
                    distance: [],
                  });
                }}
              >
                X
              </h3>
            </div>
            <div className="belowEditDiv">
              <div
                className="editLineName"
                onClick={() => {
                  setShowEditNameInput(true);
                  setShowEditStatopnInput(false);
                  setShowEditDistanceInput(false);
                }}
              >
                Name: <h2>"{editLine.name}"</h2>
              </div>
              <div className="stationAndDistancesEditDiv">
                <div className="editLineStations">
                  <div className="titleEditStations">
                    <h3>Stations</h3>
                  </div>
                  <div className="editLineStationsScroll">
                    {editLine.stations?.map((s, index) => {
                      return (
                        <div
                          className="editLineStationField"
                          onClick={() => {
                            setShowEditStatopnInput(true);
                            setShowEditNameInput(false);
                            setShowEditDistanceInput(false);
                            setIndexForEdit(index);
                          }}
                        >
                          {s}
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="editLineStations">
                  <div className="titleEditStations">
                    <h3>Distances</h3>
                  </div>
                  <div className="editLineStationsScroll">
                    {editLine.distance?.map((d, index) => {
                      return (
                        <div
                          className="editLineStationField"
                          onClick={() => {
                            setShowEditDistanceInput(true);
                            setShowEditNameInput(false);
                            setShowEditStatopnInput(false);
                            setIndexForEdit(index);
                          }}
                        >
                          {d}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
            <div className="editLineBtnDiv">
              <button onClick={editLineRoute}>Edit</button>
            </div>
          </div>
        </div>
      ) : null}
      {addDivShow == true ? (
        <div className="editLineDiv">
          <div className="lineOverviewDiv">
            <div className="titleOverviewDiv">
              <h3>Name: "{newLine.Name}"</h3>
            </div>

            <div className="mainInfoOverviewDiv">
              <div className="stationsOverviewDiv">
                <div className="stationsOverviewTitle">
                  <h4>Line Stations</h4>
                  <h4>{newLine.Stations.length}</h4>
                </div>
                <div className="stationsOverviewScroll">
                  {newLine.Stations?.map((s) => {
                    return <div>{s}</div>;
                  })}
                </div>
              </div>

              <div className="distancesOverviewDiv">
                <div className="stationsOverviewTitle">
                  <h4>Distances</h4>
                  <h4>{newLine.Distance.length}</h4>
                </div>
                <div className="distancesOverviewScroll">
                  {newLine.Distance?.map((d) => {
                    return <div>{d}</div>;
                  })}
                </div>
              </div>
            </div>
          </div>
          <div className="editLineCenterDiv">
            <div className="editLineX">
              <h3
                onClick={() => {
                  SetAddDivShow(false);
                  setNewLines({ Name: "", Stations: [], Distance: [] });
                }}
              >
                X
              </h3>
            </div>
            <div className="lineDataDiv">
              <div className="lineDataInfoField">
                <h3>Line Name:</h3>{" "}
                <input
                  type="text"
                  placeholder="Line Name"
                  onChange={(e) =>
                    setNewLines({ ...newLine, Name: e.target.value })
                  }
                />
              </div>
              <div className="lineDataInfoField">
                <h3>New Station</h3>{" "}
                <input
                  type="text"
                  placeholder="New Station"
                  onChange={(e) => {
                    setLinesNewStation(e.target.value);
                  }}
                />{" "}
                <button
                  onClick={() => {
                    if (linesNewStation && linesNewStation != "") {
                      let temp = [...newLine.Stations];
                      temp.push(linesNewStation);
                      setNewLines({ ...newLine, Stations: temp });
                    }
                  }}
                >
                  Add Station
                </button>
              </div>
              <div className="lineDataInfoField">
                <h3>Add Distance </h3>{" "}
                <input
                  type="number"
                  placeholder="Add Distance"
                  onChange={(e) => {
                    setNewDistance(e.target.value);
                  }}
                />{" "}
                <button
                  onClick={() => {
                    if (newDistance && newDistance != "") {
                      let temp = [...newLine.Distance];
                      temp.push(newDistance);
                      setNewLines({ ...newLine, Distance: temp });
                    }
                  }}
                >
                  Add Distance
                </button>
              </div>
              <div className="addNewLineBtnDiv">
                <button onClick={addNewLine}>Add New Line</button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <div className="adminPageMainCenterDiv">
        <img src="globusLogo.png" alt="Globus" className="logoAdminPage" />
        <div className="buttonsLine">
          <div
            className="buttonOnLine"
            onClick={() => {
              setChangeAdminView("Approve Tickets");
            }}
          >
            Approve Tickets
          </div>
          <div
            className="buttonOnLine"
            onClick={() => {
              setChangeAdminView("Approve Transaction");
            }}
          >
            Approve Transaction
          </div>
          <div
            className="buttonOnLine"
            onClick={() => {
              setChangeAdminView("Manage Users");
            }}
          >
            Manage Users
          </div>
          <div
            className="buttonOnLine"
            onClick={() => {
              setChangeAdminView("Manage Inspectors");
            }}
          >
            Manage Inspectors
          </div>
          <div
            className="buttonOnLine"
            onClick={() => {
              setChangeAdminView("Manage Lines");
            }}
          >
            Manage Lines
          </div>
        </div>
        {changeAdminView == "Manage Lines" ? (
          <div className="addNewLineBtnDiv">
            <button
              className="PromoteToInspectorBtn"
              onClick={() => {
                SetAddDivShow(true);
              }}
            >
              Add New Line
            </button>
            <input
              type="text"
              placeholder="Search"
              onChange={(e) => {
                setSearchLinesTerm(e.target.value);
              }}
            />
          </div>
        ) : changeAdminView == "Approve Transaction" ? (
          <div className="addNewLineBtnDiv"></div>
        ) : changeAdminView == "Approve Tickets" ? (
          <div className="addNewLineBtnDiv">
            <input
              type="text"
              placeholder="Search"
              onChange={(e) => {
                setSearchTicketsTerm(e.target.value);
              }}
            />
          </div>
        ) : changeAdminView == "Manage Users" ? (
          <div className="addNewLineBtnDiv">
            <input
              type="text"
              placeholder="Search"
              onChange={(e) => {
                setSearchUsersTerm(e.target.value);
              }}
            />
          </div>
        ) : (
          <div className="addNewLineBtnDiv">
            <input
              type="text"
              placeholder="Search"
              onChange={(e) => {
                setSearchInspectorsTerm(e.target.value);
              }}
            />
          </div>
        )}
        {changeAdminView == "Approve Tickets" ? (
          <div className="ApproveTicketsDiv">
            <div className="ApproveTicketsDivScroll">
              {unapprovedTickets
                ?.filter((l) => {
                  return (
                    l.userId.toString().includes(searchTicketsTerm) ||
                    l.id.toString().includes(searchTicketsTerm) ||
                    l.line
                      .toLowerCase()
                      .includes(searchTicketsTerm.toLowerCase())
                  );
                })
                .map((t) => {
                  return (
                    <div className="TicketDiv">
                      <div className="TicketInfo">
                        <h3>{t.id}</h3>
                        <h3>{t.userId}</h3>
                        <h3>{t.ticketType}</h3>
                        <h3>{t.line}</h3>
                        <h3>{t.start}</h3>
                        <h3>{t.destination}</h3>
                        <h3>{t.fromDate?.toString()}</h3>
                        <h3>{t.toDate?.toString()}</h3>
                      </div>
                      <div className="TicketBtnsDiv">
                        <button
                          className="approveBtn"
                          onClick={() => {
                            approveTicket(t.id);
                          }}
                        >
                          Approve
                        </button>
                        <button
                          className="RejectBtn"
                          onClick={() => {
                            rejectTicket(t.id);
                          }}
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        ) : changeAdminView == "Approve Transaction" ? (
          <div className="ApproveTicketsDiv">
            <div className="ApproveTicketsDivScroll">
              {transactions?.map((t) => {
                return (
                  <div className="TicketDiv">
                    <div className="TicketInfo">
                      <h3>{t.id}</h3>
                      <h3>{t.userId}</h3>
                      <h3>{t.credit}</h3>
                    </div>
                    <div className="TicketBtnsDiv">
                      <button
                        className="approveBtn"
                        onClick={() => {
                          setTransaction({
                            id: t.id,
                            userId: t.userId,
                            credit: t.credit,
                          });
                          setShowAddCreditDiv(true);
                        }}
                      >
                        Approve
                      </button>
                      <button
                        className="RejectBtn"
                        onClick={() => {
                          rejectTransaction(t.id);
                        }}
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : changeAdminView == "Manage Users" ? (
          <div className="ApproveTicketsDiv">
            <div className="ApproveTicketsDivScroll">
              {unapprovedUsers
                ?.filter((l) => {
                  return (
                    l.firstName
                      .toLowerCase()
                      .includes(searchUsersTerm.toLowerCase()) ||
                    l.id.toString().includes(searchUsersTerm) ||
                    l.lastName
                      .toLowerCase()
                      .includes(searchUsersTerm.toLowerCase()) ||
                    l.email
                      .toLowerCase()
                      .includes(searchUsersTerm.toLowerCase())
                  );
                })
                .map((u) => {
                  return (
                    <div className="TicketDiv">
                      <div className="TicketInfo">
                        <h3>{u.id}</h3>
                        <h3>{u.firstName}</h3>
                        <h3>{u.lastName}</h3>
                        <h3>{u.email}</h3>
                        <h3>{u.address}</h3>
                        <h3>{u.city}</h3>
                        <h3>{u.dateOfBirth?.toString()}</h3>
                        <h3>{u.phoneNumber}</h3>
                        <h3>{u.gender}</h3>
                        <h3>{u.isApproved}</h3>
                      </div>
                      <div className="TicketBtnsDiv">
                        <button
                          onClick={() => {
                            PromoteToInspector(u.id);
                          }}
                          className="PromoteToInspectorBtn"
                        >
                          Promote to Inspector
                        </button>
                        <button
                          className="RejectBtn"
                          onClick={() => {
                            deleteUser(u.id);
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        ) : changeAdminView == "Manage Lines" ? (
          <div className="ApproveTicketsDiv">
            <div className="ApproveTicketsDivScroll">
              {lines
                ?.filter((l) => {
                  return (
                    l.name
                      .toLowerCase()
                      .includes(searchLinesTerm.toLowerCase()) ||
                    l.id.toString().includes(searchLinesTerm)
                  );
                })
                .map((l) => {
                  return (
                    <div className="TicketDiv">
                      <div className="TicketInfo">
                        <h3>{l.id}</h3>
                        <h3>{l.name}</h3>

                        <div className="distanceDiv">
                          {l.stations.map((d) => {
                            return <h3>{d},</h3>;
                          })}
                        </div>
                        <div className="distanceDiv">
                          {l.distance.map((d) => {
                            return <h3>{d}, </h3>;
                          })}
                        </div>
                      </div>
                      <div className="TicketBtnsDiv">
                        <button
                          className="PromoteToInspectorBtn"
                          onClick={() => {
                            SetEditDivShow(true);
                            setEditLines(l);
                          }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            deleteLine(l.id);
                          }}
                          className="RejectBtn"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        ) : (
          <div className="ApproveTicketsDiv">
            <div className="ApproveTicketsDivScroll">
              {inspectors
                ?.filter((l) => {
                  return (
                    l.firstName
                      .toLowerCase()
                      .includes(searchInspectorsTerm.toLowerCase()) ||
                    l.id.toString().includes(searchInspectorsTerm) ||
                    l.lastName
                      .toLowerCase()
                      .includes(searchInspectorsTerm.toLowerCase()) ||
                    l.email
                      .toLowerCase()
                      .includes(searchInspectorsTerm.toLowerCase())
                  );
                })
                .map((i) => {
                  return (
                    <div className="TicketDiv">
                      <div className="TicketInfo">
                        <h3>{i.id}</h3>
                        <h3>{i.firstName}</h3>
                        <h3>{i.lastName}</h3>
                        <h3>{i.email}</h3>
                        <h3>{i.address}</h3>
                        <h3>{i.city}</h3>
                        <h3>{i.dateOfBirth?.toString()}</h3>
                        <h3>{i.phoneNumber}</h3>
                        <h3>{i.gender}</h3>
                      </div>
                      <div className="TicketBtnsDiv">
                        <button
                          onClick={() => {
                            DemoteFromInspector(i.id);
                          }}
                          className="PromoteToInspectorBtn"
                        >
                          Demote from inspector
                        </button>
                        <button
                          onClick={() => {
                            deleteUser(i.id);
                          }}
                          className="RejectBtn"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}{" "}
        {/*
           
        )   */}
      </div>
      {showAddCreditDiv == true ? (
        <div className="addCreditDivMain">
          <div className="addCreditCenterDiv">
            <div className="addCreditXDiv">
              <h3
                onClick={() => {
                  setShowAddCreditDiv(false);
                }}
              >
                X
              </h3>
            </div>
            <h1>Add Credit:{transaction?.credit}</h1>
            <button onClick={addCredit}>Add Credit</button>
          </div>
        </div>
      ) : null}
    </div>
  );
};
export default AdminPage;
