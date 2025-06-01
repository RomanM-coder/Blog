import React, { useState, Dispatch, SetStateAction } from "react";
import { motion, AnimatePresence } from "framer-motion"
import CurrencyRubleIcon from '@mui/icons-material/CurrencyRuble';
import CurrencyPoundIcon from '@mui/icons-material/CurrencyPound';
import CurrencyYenIcon from '@mui/icons-material/CurrencyYen';
import CurrencyYuanIcon from '@mui/icons-material/CurrencyYuan';
import CurrencyBitcoinIcon from '@mui/icons-material/CurrencyBitcoin';
import EuroSymbolIcon from '@mui/icons-material/EuroSymbol';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import './GaleryDemo.css'

interface IGallery {
  items: string[];
  setIndex: Dispatch<SetStateAction<number | null>>;
}
interface ISingleImage {
  color: string;
  onClick: (value: React.SetStateAction<number | null>) => void  
}

const Gallery = ({ items, setIndex }: IGallery) => {
  return (
    <ul className="gallery-container">
      {items.map((color, i) => (
        <motion.li
          className="gallery-item"
          key={color}
          onClick={() => setIndex(i)}
          style={{ backgroundColor: color }}
          layoutId={color}
        />
      ))}
    </ul>
  );
}

const SingleImage = ({ color, onClick }: ISingleImage) => {
  return (
    // <AnimatePresence>
    <div className="single-image-container" onClick={(event) => onClick(null)}>
      <motion.div
        layoutId={color}
        className="single-image"
        style={{ backgroundColor: color }}        
      />
    </div>
    // </AnimatePresence>
  )
}

export const GalleryDemo:React.FC = () => {
  const [index, setIndex] = useState<number|null>(null)

  return (
    <>  
      <Gallery items={colors} setIndex={setIndex} />
      <AnimatePresence>
        {index !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            key="overlay"
            className="overlay"
            onClick={() => setIndex(null)}
          />
        )}

        {index !== null && (
          <SingleImage
            key="image"            
            color={colors[index]}                        
            onClick={() => setIndex(null)}
          />
        )}
      </AnimatePresence>
        <AttachMoneyIcon/>
    </>    
  );
}

const numColors = 4 * 4;
const makeColor = (hsl: number): string => `hsl(${hsl}, 100%, 50%)`;
const colors = Array.from(Array(numColors)).map((_, i) =>
  makeColor(Math.round((360 / numColors) * i))
)