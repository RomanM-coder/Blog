import './Bubble.css'

export const Bubble = () => {
  // console.clear();
//   let maxBubbles = 25;
//   let container = document.querySelector('.demo');
//   let containerWidth = container!.clientWidth;
//   let containerHeight = container!.clientHeight;
//   let content = document.querySelector('.demo__content');
//   let title = document.querySelector('.demo__title');
//   title!.content = document.querySelector('.demo-title__content');
//   title!.splash = document.querySelector('.demo-title__splash');

//   var shape = document.querySelector('.bubble');
//   var shapeWidth = shape!.clientWidth;
//   var shapeHeight = shape!.clientHeight;

//   let bubbles = [];

//   var minX = 0;
//   var minY = 0;

//   var baseShapeSize = 200;
//   var minShapeSize = 50;

//   var time = 7;
//   var minTime = 4;

//   var posibleSides = ['top', 'right', 'bottom', 'left'];

//------------------------------

//   function bubble( pos ) {
//       this.bubble = shape.cloneNode( true ); 
//       this.setSize();
//       this.setPos();
//       this.addAnimation();
//       content.appendChild( this.bubble );
//       this.content = this.bubble.querySelector('.bubble__group');
//       this.splash = this.bubble.querySelector('.bubble__splash');
//       this.isCollapsed = false;
//       var that = this;
      
//       this.bubble.onclick = function () {
//           if ( !that.isCollapsed ) {
//               that.isCollapsed = true;
//               that.collapse();
//           }
//       }
//   }

//------------------------------

// Bubble.prototype.collapse = function () {
//     var that = this;
    
//     function resetBubble() {
//         var tl = new TimelineLite();
//         that.setSize();
//         that.setPos();

//         tl.to( that.content, .3, {
//             'scale': 1,
//             'opacity': 1,
//             'delay': 2,
//             'onComplete': function() { 
//                 that.isCollapsed = false; 
//                 }
//         } );
//     }
    
//     var tl = new TimelineLite();
//     tl.set( this.content, {
//             'scale': 0,
//             'transform-origin': '100px 100px',
//             'opacity': 0
//         } );
//     tl.set( this.splash, {
//         'scale': .5,
//         'transform-origin': '100px 100px',
//         'opacity': 1,
//     } );
//     tl.to( this.splash, .15, {
//         'scale': 1.5,
//         'opacity': 0,
//         'ease': Power1.easeOut,
//         'onComplete': resetBubble
//     } );
// }

//------------------------------

// Bubble.prototype.setPos = function () {
//     var target = this.getSide();
//     this.bubble.style.transform = 'translate3d(' + target.coords.x +'px, ' + target.coords.y + 'px, 0)';
// }

//------------------------------

// Bubble.prototype.setSize = function () {
//     this.shapeSize = Math.round( Math.random() * (baseShapeSize - minShapeSize) ) + minShapeSize;
//     this.bubble.style.width = this.shapeSize + 'px';   
//     this.bubble.style.height = this.shapeSize + 'px';   
    
//     this.maxX = containerWidth - this.shapeSize;
//     this.maxY = containerHeight - this.shapeSize;
// }

//------------------------------

// Bubble.prototype.addAnimation = function () {
    
//     var minX = 0;
//     var newTime = Math.random() * time + minTime;
//     var elem = this.bubble;
//     var delay = Math.random() * time;
//     var tl = new TimelineLite();
//     var that = this;
    
//     animate();
    
//     function animate () {
//         var target = that.getSide( that.side );
//         that.side = target.side;
//         var propSet = { x: target.coords.x,
//                         y: target.coords.y,
//                         ease: SlowMo.easeInOut,
//                         delay: delay,
//                         onComplete: animate
//                     };        
//         tl.to( elem, newTime, propSet);
        
//         if ( delay ) {
//             delay = 0;
//         }
//     }   
// }

//------------------------------

// Bubble.prototype.getSide = function () {
//     var targetParams = {
//         side: '',
//         coords: {}
//     };
//     var maxRandX = Math.round( Math.random() * this.maxX );
//     var maxRandY = Math.round( Math.random() * this.maxY );
    
//     var sides = {'top': 
//                     { x: maxRandX, 
//                       y: minY },
//                  'right': 
//                     { x: this.maxX, 
//                       y: maxRandY },
//                  'bottom': 
//                     { x: maxRandX, 
//                       y: this.maxY },
//                  'left': { 
//                      x: minX, 
//                      y: maxRandY }
//                 };
        
//     delete sides[ this.side ];
//     var keys = Object.keys( sides );    
//     var randPos = Math.floor( Math.random() * keys.length );
//     var newSide = keys[ randPos ];    
    
//     targetParams.side = newSide;
//     targetParams.coords = sides[ newSide ];
    
//     return targetParams;
    
// }

// //------------------------------

// function addBubble () {
//     var bubble = new Bubble( i );
//     bubbles.push( bubble );
// }

// //------------------------------

// for ( var i = 0; i < maxBubbles; i ++ ) {
//     addBubble();
// }

//------------------------------

// window.onresize = function () {
//     containerWidth = container.clientWidth;
//     containerHeight = container.clientHeight;
    
//     bubbles.forEach( function ( item ) {
//         item.maxX = containerWidth - item.shapeSize;
//         item.maxY = containerHeight - item.shapeSize;
//         // item.addAnimation();
//     });
// }

//------------------------------

// title.onclick = function () {
//     var that = this;
    
//     function resetElem() {
//         var tl = new TimelineLite();
        
//         tl.to( that.content, .3, {
//             'scale': 1,
//             'opacity': 1,
//             'onComplete': function() { 
//                 that.isCollapsed = false; 
//                 }
//         } );
//     }
    
//     var tl = new TimelineLite();
//     tl.set( this.content, {
//             'scale': 0,
//             'opacity': 0
//         } );
//     tl.set( this.splash, {
//         'scale': .5,
//         'opacity': 1,
//     } );
//     tl.to( this.splash, .15, {
//         'scale': 1.5,
//         'opacity': 0,
//         'ease': Power1.easeOut,
//         'onComplete': resetElem
//     } );
// }



  return (
    <div className="demo">
      <div className="demo__content">
      
        <svg className="svg svg--defs">  
            
             {/* Bubble transparency  */}
            <radialGradient id="grad--bw"
                            fx="25%" fy="25%">
                <stop offset="0%" 
                      stopColor="black"/>  
                <stop offset="30%" 
                      stopColor="black" 
                      stopOpacity=".2"/>
                <stop offset="97%" 
                      stopColor="white" 
                      stopOpacity=".4"/>
                <stop offset="100%" 
                      stopColor="black"/>
            </radialGradient>
        
        <mask id="mask" maskContentUnits="objectBoundingBox">
            <rect fill="url(#grad--bw)"
              width="1" height="1"></rect>
        </mask>
        
         {/* Light spot  */}
        <radialGradient id="grad--spot"
                        fx="50%" fy="20%">
            <stop offset="10%" 
                  stopColor="white"
                  stopOpacity=".7"/>  
            <stop offset="70%" 
                  stopColor="white"
                  stopOpacity="0"/>
        </radialGradient>
        
         {/* Top & bottom light  */}
        {/* <radialGradient id="grad--bw-light"
                        fx="25%" fy="10%">
            <stop offset="60%" 
                  stopColor="black" 
                  stopOpacity="0"/>
            <stop offset="90%" 
                  stopColor="white" 
                  stopOpacity=".25"/>
            <stop offset="100%" 
                  stopColor="black"/>
        </radialGradient> */}
        
        {/* <mask id="mask--light-top" maskContentUnits="objectBoundingBox">
            <rect fill="url(#grad--bw-light)"
              width="1" height="1" transform="rotate(180, .5, .5)"></rect>
        </mask>
        
        <mask id="mask--light-bottom" maskContentUnits="objectBoundingBox">
            <rect fill="url(#grad--bw-light)"
              width="1" height="1"></rect>
        </mask> */}
        
         {/* Colors of bubble  */}
        {/* <linearGradient id="grad"
              x1="0" y1="100%" x2="100%" y2="0">
            <stop offset="0%" stopColor="dodgerblue" 
                  className="stop-1"/>   
            <stop offset="50%" stopColor="fuchsia"
                  className="stop-2"/>
            <stop offset="100%" stopColor="yellow" 
                  className="stop-3"/>
        </linearGradient> 
        
        <mask id="mask--collapse" maskContentUnits="objectBoundingBox">
            <circle r=".5" cx=".5" cy=".5"
                    className="collapse-circle"
                    ></circle>
        </mask> */}
        
        {/* <symbol id="splash">
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
        </symbol>*/}
    </svg> 
    
    {/* <div className="demo__defs hidden">
        <svg className="svg bubble" viewBox="0 0 200 200">
            <g className="bubble__group">
              <ellipse rx="20%" ry="10%"
                   cx="150" cy="150"
                   fill="url(#grad--spot)"
                   transform="rotate(-225, 150, 150)"
                   className="shape _hidden"    
                   ></ellipse>     
              <circle r="50%" 
                    cx="50%" cy="50%"
                    fill="aqua"
                    mask="url(#mask--light-bottom)"
                    className="shape _hidden"
                    ></circle>
              <circle r="50%" 
                    cx="50%" cy="50%"
                    fill="yellow"
                    mask="url(#mask--light-top)"
                    className="shape _hidden"
                    ></circle>             
              <ellipse rx="55" ry="25"
                   cx="55" cy="55"
                   fill="url(#grad--spot)"
                   transform="rotate(-45, 55, 55)"
                   className="shape _hidden"    
                   ></ellipse> 
              <circle r="50%" 
                    cx="50%" cy="50%"
                    fill="url(#grad)"
                    mask="url(#mask)"
                    className="shape _hidden"
                    ></circle> 
            </g>
            
            <use xlinkHref="#splash" className="bubble__splash"/>                 */}
            {/* </g> */}
        {/* </svg>
    </div>   */}
    
    {/* // <header className="demo__title demo-title">
    //     <svg className="svg demo-title__splash" viewBox="0 0 200 200">
    //         <use xlinkHref="#splash"/>
    //     </svg>
        
    //     <h1 className="demo-title__content">
    //     Bubbles
    //         <span className="demo__tip">Click bubble to burst it!</span>
    //     </h1>
    // </header>  */}
  </div>

</div>


  )
}
