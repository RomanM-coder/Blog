export const Splash: React.FC = () => {
  return (
    //  Лопание пузыря 
    
    <g className="splash__group" 
       fill="none"
       stroke="white" strokeOpacity=".8">
      <circle r="49%" 
          cx="50%" cy="50%"
          strokeWidth="3%"  
          strokeDasharray="1% 10%"  
          className="splash__circle _hidden"
          ></circle>
      <circle r="44%" 
          cx="50%" cy="50%"
          strokeWidth="2%"
          strokeDasharray="1% 5%" 
          className="splash__circle _hidden"
          ></circle>
      <circle r="39%" 
          cx="50%" cy="50%"
          strokeWidth="1%"  
          strokeDasharray="1% 8%"  
          className="splash__circle _hidden"
          ></circle>
      <circle r="33%" 
          cx="50%" cy="50%"
          strokeWidth="3%"  
          strokeDasharray="1% 6%"  
          className="splash__circle _hidden"
          ></circle>
      <circle r="26%" 
          cx="50%" cy="50%"
          strokeWidth="1%"  
          strokeDasharray="1% 7%"  
          className="splash__circle _hidden"
          ></circle>
      <circle r="18%" 
          cx="50%" cy="50%"
          strokeWidth="1%"  
          strokeDasharray="1% 8%"  
          className="splash__circle _hidden"
          ></circle>
    </g>
   
  )
}