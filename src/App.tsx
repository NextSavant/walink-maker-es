import { Link, TextField } from "@mui/material";
import { parsePhoneNumber } from "libphonenumber-js";
import { KeyboardEventHandler, useCallback, useRef, useState } from "react";
import QRCode from "react-qr-code";
import './App.css';

const WALINK_TEMPLATE = "https://wa.me/";

function App() {
  const phoneInput = useRef<HTMLInputElement>()
  const [walink, setWalink] = useState("")

  const generateWaLink = useCallback(function makeLink() {
    let text = phoneInput.current?.value ?? "";
    let number = ""

    setWalink("")

    try {
      const phoneNumber = parsePhoneNumber(text, "DO");
      if (phoneNumber.isValid()) {
        console.log('Phone number set', phoneNumber)
        number = phoneNumber.countryCallingCode + phoneNumber.nationalNumber;
        setWalink(WALINK_TEMPLATE + number)
      }

    } catch (error) {
      console.log(error)
    }

  }, [])


  const handleKeyPress: KeyboardEventHandler = (event) => {
    if (event.key === "Enter") generateWaLink()
  }
  // const handleClick = useCallback(
  //   () => {
  //     generateWaLink()
  //   },
  //   [generateWaLink]
  // );

  return (
    <div className="App">
      <h1>
        Crear un link de  <strong className="green">WhatsApp</strong>!
      </h1>
      <TextField
        inputRef={phoneInput}
        onChange={generateWaLink}
        defaultValue=""
        margin="normal"
        label="Escribe un número de telefono"
        fullWidth
        autoFocus
        type={'tel'}
        onKeyUp={handleKeyPress}
      />
      {/* <Button onClick={handleClick} variant="contained">
        Generar link
      </Button> */}
      <br />
      {walink && (
        <>
          <p>Haz click en este link para abrir el chat en WhatsApp</p>
          <Link target="_blank" href={walink}>
            {walink}
          </Link>
        </>
      )}

      {walink && (
        <QRCode value={walink} alt="QR code" style={{ margin: '2rem auto' }} />
      )}

    </div>
  );
}

export default App;
