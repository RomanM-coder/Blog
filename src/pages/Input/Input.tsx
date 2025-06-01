import React, { useState } from "react";
import { motion } from "framer-motion";

enum Validity {
  Neutral,
  Valid,
  Invalid
}

const colors = {
  [Validity.Neutral]: (opacity: number) => `rgba(0, 153, 255, ${opacity})`,
  [Validity.Valid]: (opacity: number) => `rgba(34, 204, 136, ${opacity})`,
  [Validity.Invalid]: (opacity: number) => `rgba(255, 0, 85, ${opacity})`
};

export const Input:React.FC = () => {
  const [validity, setValidity] = useState(Validity.Neutral);
  const color = colors[validity];

  return (
    <motion.input
      initial={false}
      animate={{
        boxShadow: `0 0 0 5px ${color(0.7)}, 0 0 0 4px ${color(0)}`
      }}
      whileFocus={{
        boxShadow: `0 0 0 10px ${color(1)}, 0 0 0 50px ${color(0)}`,
        transition: {
          boxShadow: {
            duration: 0.3,
            from: `0 0 0 5px ${color(0.7)}, 0 0 0 4px ${color(1)}`
          }
        }
      }}
      onBlur={(e) => {
        const { value } = e.currentTarget;

        if (!value) {
          setValidity(Validity.Neutral);
        } else if (value.includes(" ")) {
          setValidity(Validity.Invalid);
        } else {
          setValidity(Validity.Valid);
        }
      }}
    />
  );
}
