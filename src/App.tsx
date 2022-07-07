import { Button, Link, TextField } from "@mui/material";
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

  return (
    <div className="App">
      <main>
      <h1>
        Agrega un n&uacute;mero a tu <strong className="green">WhatsApp</strong> sin crear el contacto.
      </h1>
      <TextField
        inputRef={phoneInput}
        onChange={generateWaLink}
        defaultValue=""
        margin="normal"
        label="Ingresa el número de telefono"
        fullWidth
        autoFocus
        type={'tel'}
        onKeyUp={handleKeyPress}
      />
      <br />
      {walink && (
        <>
          <Button color="success" href={walink} target="_blank" variant="contained">
            Continuar al chat
          </Button>
        </>
      )}

      {walink && (
        <QRCode value={walink} alt="QR code" style={{ margin: '2rem auto' }} />
      )}
      </main>
      
      <footer>
        &copy; 2022, walink.pro
      </footer>

    </div>
  );
}

export default App;
