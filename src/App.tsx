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
        Crear un link <span className="green">wa.me</span>!
      </h1>
      <TextField
        value={textValue}
        onChange={handleChange}
        margin="normal"
        label="Escribe tu número"
        fullWidth
      />
      <Button onClick={handleClick} variant="contained">
        Crear
      </Button>
      <br />
      <br />
      {number && (
        <Link target="_blank" href={`${WALINK_TEMPLATE}${number}`}>
          {WALINK_TEMPLATE}
          {number}
        </Link>
      )}
    </div>
  );
}

export default App;
