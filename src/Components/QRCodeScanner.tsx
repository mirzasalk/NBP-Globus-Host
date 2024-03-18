import  { useState,useEffect } from "react";
import { QrReader } from "react-qr-reader";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axiosInstance from "../api/axios-config";
import { UserData, Penalty } from "../Pages/inspectorPage/InspectorPage";

const QRCodeScanner = () => {
    const [delayScan, setDelayScan] = useState<number>(500);
    const [userToBePenalized, setUserToBePenalized] = useState<UserData>({
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
  const navigate = useNavigate();
  const [showWritePenaltyDiv, setShowWritePenaltyDiv] =
    useState<boolean>(false);

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

  const checkTicketWithScanner = async (ticketId: number) => {
    const jwtToken = localStorage.getItem("token");

    try {
      console.log("Before API request");

      const response = await axiosInstance.post(
        `/Tickets/CheckTicketWithScanner?ticketId=${ticketId}`,
        { ticketId },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );

      console.log("After API request");

      if (response) {
        console.log("Response received");

        const datumZaUporedivanje = new Date(response.data.ticket.toDate);
        const danasnjiDatum = new Date();

        if (
          datumZaUporedivanje > danasnjiDatum &&
          response.data.ticket.isApproved === true
        ) {
          toast.success("Ticket is valid");
          navigate("/inspectorPage");
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
      console.error("Error in checkTicketWithScanner:", error);
    }
  };

  const [data, setData] = useState("No result");

  const handleScan = (result: any, error: any) => {
    if (result) {
      setData(result?.text);

      // Parse the URL to extract ticketId
      // const url = new URL(result.text);
      // const ticketId = parseInt(url.searchParams.get('ticketId'), 10); //if result has params

      const scannedTicketId = parseInt(result.text, 10);

      // Call checkTicketWithScanner with the extracted ticketId
      if (!isNaN(scannedTicketId)) {
        checkTicketWithScanner(scannedTicketId);
        setDelayScan(0);
      } else {
        console.error("Invalid or missing ticketId in the QR code URL",error);
      }
    }

    // if (error) {
    //   console.info(error);
    // }
  };

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
  
  const WriteAPenalty = async () => {
    const jwtToken = localStorage.getItem("token");
    console.log(penalty, "befor Recording");
    try {
      const response = await axiosInstance.post(
        "/Users/WritePenalty",
       {
          inspectorId: user.id,
          passengerID: penalty.passengerID,
          dateOfPenalty: penalty.dateOfPenalty,
          price: 2000,
        } as Penalty,
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
        setShowWritePenaltyDiv(false);
        navigate("/inspectorPage");
      }
    } catch (error) {
      console.log(error);
      navigate("/inspectorPage");
    }
  };

  useEffect(() => {
    getUserById();
  }, []);
  
  return (
    <>
       <div
        style={{
          position: "relative",
          width: "90%",
          height: "auto",
           marginTop: "2em"
        }}
      >
        <QrReader
          onResult={handleScan}
          constraints={{ facingMode: "environment" }} // Ovo je samo primjer, zamijenite s odgovarajućim postavkama
          scanDelay={delayScan}
        />
      </div>
      <p>{data}</p>
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
                {userToBePenalized.firstName} {userToBePenalized.lastName}
              </strong>
            </h4>
            <button onClick={WriteAPenalty}>Write a penalty</button>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default QRCodeScanner;
