import React, { useState } from "react"
import { Input } from "./Input"
import { Refresh } from "./Refresh"
import "./Input.css"

export const Inp:React.FC = () => {
  const [count, setCount] = useState(0);
  return (
    <div style={{paddingTop: '100px'}}>
      <Refresh onClick={() => setCount(count + 1)} />
      <div className="example-container">
        <Input key={count} />
      </div>
    </div>
  );
};