import { parsePhoneNumber } from "libphonenumber-js";
import { FocusEventHandler, KeyboardEventHandler, MouseEventHandler, useCallback, useEffect, useRef, useState } from "react";
import QRCode from "react-qr-code";

const WALINK_TEMPLATE = "https://wa.me/";

function App() {
  const phoneInput = useRef<HTMLInputElement>(null)
  const messageInput = useRef<HTMLTextAreaElement>(null)
  const [walink, setWalink] = useState("")
  const [showQR, setShowQR] = useState(false)

  const getWalink = useCallback(function makeLink() {
    let phoneString = phoneInput.current?.value ?? "";

    const phoneNumber = parsePhoneNumber(phoneString, "DO");

    if (phoneNumber.isValid()) {
      const number = phoneNumber.countryCallingCode + phoneNumber.nationalNumber;
      const text = messageInput.current?.value
      const textParam = `?text=${ encodeURIComponent(text ?? "") }`
      return `${WALINK_TEMPLATE}${number}${ text ? textParam : ''}`
    }
    
    return ""
  }, [ ])


  const copyLink = () => {
    navigator.clipboard.writeText(getWalink())
    alert('Link copiado')
  }


  const openChat = () => {
    window.open(getWalink(), '_blank');
  }

  const handleShowQrClick:MouseEventHandler = (event) => {
    setWalink(getWalink())
    setShowQR(() => true)
  }

  const handlePhoneInputKeyUp: KeyboardEventHandler = (event) => {
    if (event.key === "Enter") openChat()
  }

  const handlePhoneInputFocus:FocusEventHandler<HTMLInputElement> = (event) => {
    event.target.select()
    event.target.setSelectionRange(0, 99999)
  }

  useEffect(()=> {
    phoneInput.current?.focus()
  }, [])

  return (
    <main>

      <div>
        {showQR && walink ? (
          <QRCode 
            value={walink} alt="QR code" 
            style={{ height: 300, }} />
        ): (
          <h1>
            Agrega un n&uacute;mero a tu <strong>WhatsApp</strong> sin crear el contacto.
          </h1>
        )}
      </div>

      <div className="stack">

      <input 
        ref={phoneInput}
        type={'tel'}
        defaultValue={``}
        placeholder={`# de teléfono`}
        className={`input`}
        onKeyUp={handlePhoneInputKeyUp}
        onFocus={handlePhoneInputFocus}
        onChange={() => setWalink(getWalink())}
      />

      <textarea
        ref={messageInput}
        className="textarea"
        placeholder="Escribe tu mensaje"
        onChange={() => setWalink(getWalink())}
        defaultValue="👋 Hola"
      ></textarea>

      <div className="dispersed horizontal stack">
        <button onClick={handleShowQrClick}>🤳 Ver QR</button>
        <button onClick={copyLink}>📋 Copiar link</button>
        <button onClick={openChat} className="primary">💬 Abrir chat</button>
      </div>
      </div>
    </main>
  );
}

export default App;
