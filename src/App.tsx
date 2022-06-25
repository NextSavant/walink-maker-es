import { Button, Link, TextField } from "@mui/material";
import { ParseError, parsePhoneNumber } from "libphonenumber-js";
import { ChangeEvent, MouseEvent, useCallback, useState } from "react";
import './App.css';

const WALINK_TEMPLATE = "https://wa.me/";

function App() {
  const [textValue, setTextValue] = useState<string>("");
  const [number, setNumber] = useState<string>("");

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTextValue(event.target.value);
  };

  const handleClick = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      try {
        let text = textValue;
        const phoneN = parsePhoneNumber(text ?? "", "DO");
        if (phoneN.isValid())
          setNumber(phoneN.countryCallingCode + phoneN.nationalNumber);
      } catch (error) {
        if (error instanceof ParseError) alert(error.message);
        setNumber("");
      }
    },
    [textValue]
  );

  return (
    <div className="App">
      <h1>
        Crear un link de  <strong className="green">WhatsApp</strong>!
      </h1>
      <TextField
        value={textValue}
        onChange={handleChange}
        margin="normal"
        label="Escribe un número de telefono"
        fullWidth
        autoFocus
        type={'tel'}
      />
      <Button onClick={handleClick} variant="contained">
        Generar link
      </Button>
      <br />
      {number && (
        <>
          <p>Haz click en este link para abrir el chat en WhatsApp</p>
          <Link target="_blank" href={`${WALINK_TEMPLATE}${number}`}>
            {WALINK_TEMPLATE}
            {number}
          </Link>
        </>
      )}
    </div>
  );
}

export default App;
